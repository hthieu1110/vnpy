import asyncio
from dataclasses import asdict
import threading
import time
from typing import Callable, Dict
from datetime import datetime, UTC
import requests
import aiohttp
from time import sleep

from vnpy.trader.constant import (
    Exchange,
    Offset,
    OrderType,
    Direction,
    Product,
    Status,
)
from vnpy.event import Event
from vnpy.trader.event import (
    EVENT_ALL_CONTRACTS,
    EVENT_ORDER,
    EVENT_TRADE,
    EVENT_ACCOUNT,
    EVENT_POSITION,
    EVENT_LOG,
)
from vnpy.trader.object import (
    AccountData,
    ContractData,
    OrderData,
    PositionData,
    SubscribeRequest,
    TickData,
    TradeData,
)
from vnpy.trader.gateway import BaseGateway
from vnpy.trader.logger import logger

from .settings import HscGatewaySettings
from .socket_client import HscSocketClient
from .rest_client import HscRestClient
from .constants import (
    ORDER_TYPE_MAP,
    PRODUCT_MAP,
    STATUS_MAP,
    HSC_GATEWAY_NAME,
    NoneEnum,
    OrderStatus,
)
from .adapters import (
    get_contract_size,
    get_contract_pricetick,
)


class HscGateway(BaseGateway):
    """
    Implement VNFuture gateway.
    """

    default_setting = {
        "centri_url": "",
        "tickers_ref_url": "",
        "bearer_token": "",
        "account_url": "",
        "orders_url": "",
    }

    exchanges = [Exchange.VNEX]

    def __init__(self, event_engine, gateway_name=HSC_GATEWAY_NAME):
        super().__init__(event_engine, gateway_name)

        self.socket_client: HscSocketClient = None
        self.rest_client: HscRestClient = None

        # create dedicated thread for asyncio
        self.loop = asyncio.new_event_loop()
        self.loop.set_debug(True)

        self.thread = threading.Thread(target=self.loop.run_forever, daemon=True)
        self.thread.start()

        # local map: local_order_id -> remote_order_id
        self._local_to_remote: Dict[str, str] = {}
        self._remote_to_local: Dict[str, str] = {}

        self._ticks_cache: Dict[str, TickData] = {}

    # run async function in sync context
    def _async_run(
        self, coro: asyncio.Future, callback: Callable = None, success_msg: str = None
    ):
        async def wrapper():
            res = await coro
            if callback:
                callback(res)
            if success_msg:
                self.write_log(success_msg)

        try:
            fut = asyncio.run_coroutine_threadsafe(wrapper(), self.loop)
            fut.result()
        except Exception as e:
            msg = f"Async task failed: {e}"
            logger.error(msg)
            self.write_log(msg)

    def connect(self, settings: HscGatewaySettings):
        self.rest_client = HscRestClient(settings["bearer_token"])
        self.socket_client = HscSocketClient(
            centri_url=settings["centri_url"],
            on_tick=self._on_tick,
        )

        self._async_run(
            coro=self.socket_client.start(),
            success_msg="Socket started",
        )

        self._async_run(
            coro=self._fetch_contracts(settings["tickers_ref_url"]),
            success_msg="Contracts fetched",
            callback=lambda contracts: self.on_event(EVENT_ALL_CONTRACTS, contracts),
        )

        self.query_account(settings["account_url"])
        self.query_position(settings["orders_url"])

    async def _fetch_contracts(self, tickers_ref_url: str) -> list[ContractData]:
        contracts: list[ContractData] = []
        async with aiohttp.ClientSession() as session:
            async with session.get(tickers_ref_url) as response:
                data = await response.json()
                for ticker_ref in data:
                    contract = ContractData(
                        gateway_name=self.gateway_name,
                        size=get_contract_size(ticker_ref),
                        pricetick=get_contract_pricetick(ticker_ref),
                        symbol=ticker_ref["symbol"],
                        exchange=Exchange.VNEX,
                        name=ticker_ref["name"],
                        product=PRODUCT_MAP.get(
                            ticker_ref["stock_type"], Product.EQUITY
                        ),
                        min_volume=100,  # minimum order volume
                        stop_supported=True,  # whether server supports stop order
                        net_position=True,  # whether gateway uses net position volume
                        history_data=True,  # whether gateway provides bar history data
                    )
                    self.on_contract(contract)
                    contracts.append(contract)
        return contracts

    def subscribe(self, sub_req: SubscribeRequest):
        symbol = sub_req.vt_symbol.split(".")[0]

        self._async_run(
            coro=self.socket_client.subscribe(symbol),
            success_msg=f"Subscribe to {symbol}",
        )

    def send_order(self, order_request):
        """
        order_request has attributes: symbol, price, volume, direction, offset, order_type, etc.
        Return local_order_id
        """
        local_id = f"{int(time.time()*1000)}"
        # convert to exchange-specific order
        remote_req = {
            "symbol": order_request.symbol,
            "price": order_request.price,
            "volume": order_request.volume,
            "side": "BUY" if order_request.direction == Direction.LONG else "SELL",
            "type": ORDER_TYPE_MAP.get(order_request.type, "LO"),
        }
        remote = self.rest_client.send_order(remote_req)
        remote_id = remote["order_id"]
        self._local_to_remote[local_id] = remote_id
        self._remote_to_local[remote_id] = local_id

        # emit preliminary OrderData with status SUBMITTING
        order = OrderData(
            symbol=order_request.symbol,
            exchange=Exchange.SSE,  # example
            orderid=local_id,
            type=order_request.type,
            direction=order_request.direction,
            price=order_request.price,
            volume=order_request.volume,
            traded=0,
            status=Status.SUBMITTING,
            gateway_name=self.gateway_name,
        )
        self.event_engine.put(Event(EVENT_ORDER, order))
        return local_id

    def cancel_order(self, cancel_request):
        local = cancel_request.orderid
        remote = self._local_to_remote.get(local)
        if not remote:
            # maybe already remote id known via different mapping
            self._write_log(f"Cancel failed: unknown local order {local}")
            return
        self.rest_client.cancel_order(remote)

    def query_account(self, account_url: str):
        acct = self.rest_client.json_query(account_url)
        self._emit_account(acct)

    def query_position(self, orders_url: str):
        pos = self.rest_client.json_query(orders_url)
        self._emit_positions(pos["orders"])
        self._emit_orders(pos["orders"])

    # callbacks from internal clients
    def _on_tick(self, raw_tick: dict):
        """
        raw_tick is provider-specific; convert to vn.py TickData
        """
        # hsc last data
        # { 'symbol': 'HPG', 'lp': 1854, 'vol': 221621, 'val': 41445860400000, 'avg': 1870.12, 'lv': 2, 'bv1': 6, 'bp1': 1854, 'av1': 1, 'ap1': 1854.3 }

        utc_now = datetime.now(UTC)
        symbol = raw_tick["symbol"]

        tick = TickData(
            gateway_name=self.gateway_name,
            symbol=symbol,
            exchange=Exchange.VNEX,
            datetime=utc_now,
            #
            name="",
            volume=raw_tick.get("vol", 0),
            turnover=0,
            open_interest=0,
            last_price=raw_tick.get("lp", 0),
            last_volume=raw_tick.get("lv", 0),
            limit_up=0,
            limit_down=0,
            #
            bid_price_1=raw_tick.get("bp1", 0),
            bid_price_2=raw_tick.get("bp2", 0),
            bid_price_3=raw_tick.get("bp3", 0),
            bid_price_4=raw_tick.get("bp4", 0),
            bid_price_5=raw_tick.get("bp5", 0),
            #
            ask_price_1=raw_tick.get("ap1", 0),
            ask_price_2=raw_tick.get("ap2", 0),
            ask_price_3=raw_tick.get("ap3", 0),
            ask_price_4=raw_tick.get("ap4", 0),
            ask_price_5=raw_tick.get("ap5", 0),
            #
            bid_volume_1=raw_tick.get("bv1", 0),
            bid_volume_2=raw_tick.get("bv2", 0),
            bid_volume_3=raw_tick.get("bv3", 0),
            bid_volume_4=raw_tick.get("bv4", 0),
            bid_volume_5=raw_tick.get("bv5", 0),
            #
            ask_volume_1=raw_tick.get("av1", 0),
            ask_volume_2=raw_tick.get("av2", 0),
            ask_volume_3=raw_tick.get("av3", 0),
            ask_volume_4=raw_tick.get("av4", 0),
            ask_volume_5=raw_tick.get("av5", 0),
            #
            localtime=utc_now,
        )
        if symbol not in self._ticks_cache:
            tick.open_price = tick.last_price
            tick.high_price = tick.last_price
            tick.low_price = tick.last_price
            tick.pre_close = tick.last_price

            self._ticks_cache[symbol] = tick
        else:
            # merge tick
            current = self._ticks_cache[symbol]
            for k, v in asdict(tick).items():
                current_val = getattr(current, k)
                # update only if value is not None
                setattr(current, k, v or current_val)

        self.on_tick(self._ticks_cache[symbol])

    def _handle_remote_order(self, remote_order):
        """
        Map remote order update to OrderData/TradeData
        remote_order sample:
        {"order_id":"123", "symbol":"SSI.HSX", "status":"PART_FILLED", "filled":200, "price":10000, "avg_price":10005}
        """
        remote_id = remote_order["order_id"]
        local_id = self._remote_to_local.get(remote_id, str(remote_id))
        status = STATUS_MAP.get(remote_order["status"], Status.UNKNOWN)

        order = OrderData(
            symbol=remote_order["symbol"],
            exchange=Exchange.SSE,
            orderid=local_id,
            type=OrderType.LIMIT,  # map properly
            direction=(
                Direction.LONG if remote_order["side"] == "BUY" else Direction.SHORT
            ),
            price=remote_order.get("price", 0),
            volume=remote_order.get("volume", 0),
            traded=remote_order.get("filled", 0),
            status=status,
            gateway_name=self.gateway_name,
        )
        self.event_engine.put(Event(EVENT_ORDER, order))

        # if filled incrementally, create TradeData(s)
        if remote_order.get("last_fill_qty", 0) > 0:
            trade = TradeData(
                symbol=remote_order["symbol"],
                exchange=Exchange.SSE,
                tradeid=str(remote_order.get("trade_id", "")),
                orderid=local_id,
                direction=order.direction,
                price=remote_order.get(
                    "last_fill_price", remote_order.get("avg_price")
                ),
                volume=remote_order.get("last_fill_qty"),
                datetime=remote_order.get("last_fill_time"),
                gateway_name=self.gateway_name,
            )
            self.event_engine.put(Event(EVENT_TRADE, trade))

    def _emit_account(self, raw_acct):
        acct = AccountData(
            accountid=raw_acct.get("account_id", "Balance"),
            balance=raw_acct["currentValue"]["accountValue"],
            frozen=raw_acct.get("frozen", 0),
            gateway_name=self.gateway_name,
        )
        self.event_engine.put(Event(EVENT_ACCOUNT, acct))

    def _emit_positions(self, raw_positions):
        for p in raw_positions:
            # positions = only show executed orders
            if p["status"] not in [
                OrderStatus.FULLY_FILLED.name,
                OrderStatus.PARTIAL_FILLED.name,
                OrderStatus.COMPLETED.name,
            ]:
                continue

            pos = PositionData(
                symbol=p["ticker"],
                exchange=self.exchanges[0],
                direction=Direction.LONG if p["bidAsk"] == "B" else Direction.SHORT,
                volume=p["executedQuantity"],
                price=p["filledPrice"],
                gateway_name=self.gateway_name,
            )

            self.event_engine.put(Event(EVENT_POSITION, pos))

    def _emit_orders(self, raw_orders):
        for o in raw_orders:
            order = OrderData(
                gateway_name=self.gateway_name,
                symbol=o["ticker"],
                exchange=self.exchanges[0],
                orderid=o["coreOrderId"],
                type=OrderType.LIMIT,
                direction=Direction.LONG if o["bidAsk"] == "B" else Direction.SHORT,
                offset=Offset.NONE,
                price=o["filledPrice"],
                volume=o["quantity"],
                traded=o["executedQuantity"],
                status=STATUS_MAP.get(o["status"], Status.SUBMITTING),
                datetime=datetime.fromisoformat(o["createdAt"].replace("Z", "+00:00")),
                reference=o["orn"],
            )

            self.event_engine.put(Event(EVENT_ORDER, order))

    def _write_log(self, msg: str):
        self.event_engine.put(Event(EVENT_LOG, msg))

    def close(self):
        if self.socket_client:
            fut = asyncio.run_coroutine_threadsafe(self.socket_client.stop(), self.loop)
            self._handle_future(fut)
        if self.rest_client:
            self.rest_client.close()

    def _handle_future(self, fut: asyncio.Future):
        try:
            fut.result()
        except Exception as e:
            logger.error(f"Async task failed: {e}")
            # traceback.print_exc()
