import asyncio
from dataclasses import asdict
import threading
import time
from typing import Dict
from datetime import datetime, UTC
import requests
import aiohttp
from time import sleep

from vnpy.trader.constant import (
    Exchange,
    OrderType,
    Direction,
    Status,
)
from vnpy.event import Event
from vnpy.trader.event import (
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
from .constants import ORDER_TYPE_MAP, STATUS_MAP, HSC_GATEWAY_NAME
from .adapters import (
    get_contract_size,
    get_contract_pricetick,
    get_contact_product,
)
from .utils import gateway_log


class HscGateway(BaseGateway):
    """
    Implement VNFuture gateway.
    """

    default_setting = {
        "centri_url": "",
        "tickers_ref_url": "",
        "api_token": "",
    }

    exchanges = [Exchange.VNEX]

    def __init__(self, event_engine, gateway_name=HSC_GATEWAY_NAME):
        super().__init__(event_engine, gateway_name)

        self.socket_client: HscSocketClient = None
        self.rest_client: HscRestClient = None

        # create dedicated thread for asyncio
        self.loop = asyncio.new_event_loop()
        # self.loop.set_debug(True)

        self.thread = threading.Thread(target=self.loop.run_forever, daemon=True)
        self.thread.start()

        # local map: local_order_id -> remote_order_id
        self._local_to_remote: Dict[str, str] = {}
        self._remote_to_local: Dict[str, str] = {}

        self._ticks_cache: Dict[str, TickData] = {}

    def connect(self, settings: HscGatewaySettings):
        self.rest_client = HscRestClient(settings["api_token"])
        self.socket_client = HscSocketClient(
            centri_url=settings["centri_url"],
            on_tick=self._on_tick,
        )

        fut = asyncio.run_coroutine_threadsafe(self.socket_client.start(), self.loop)
        self._handle_future(fut)

        logger.info(f"Gateway {self.gateway_name} connected")

        fut2 = asyncio.run_coroutine_threadsafe(
            self._fetch_contracts_async(settings["tickers_ref_url"]), self.loop
        )
        self._handle_future(fut2)

    async def _fetch_contracts_async(self, tickers_ref_url: str):
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
                        product=get_contact_product(ticker_ref),
                        min_volume=100,  # minimum order volume
                        stop_supported=True,  # whether server supports stop order
                        net_position=True,  # whether gateway uses net position volume
                        history_data=True,  # whether gateway provides bar history data
                    )
                    self.on_contract(contract)

    def _fetch_contracts(self, tickers_ref_url: str):
        response = requests.get(tickers_ref_url)
        data = response.json()
        for ticker_ref in data:
            contract = ContractData(
                gateway_name=self.gateway_name,
                size=get_contract_size(ticker_ref),
                pricetick=get_contract_pricetick(ticker_ref),
                symbol=ticker_ref["symbol"],
                exchange=Exchange.VNEX,
                name=ticker_ref["name"],
                product=get_contact_product(ticker_ref),
                min_volume=100,  # minimum order volume
                stop_supported=True,  # whether server supports stop order
                net_position=True,  # whether gateway uses net position volume
                history_data=True,  # whether gateway provides bar history data
            )
            self.on_contract(contract)

    @gateway_log
    def subscribe(self, sub_req: SubscribeRequest):
        symbol = sub_req.vt_symbol.split(".")[0]

        fut = asyncio.run_coroutine_threadsafe(
            self.socket_client.subscribe(symbol), self.loop
        )
        self._handle_future(fut)

    # def stop(self):
    #     self.rest_client.close()
    #     self.loop.stop()
    #     self.thread.join()

    # def _start_polling(self):
    #     t = threading.Thread(target=self._poll_loop, daemon=True)
    #     t.start()

    # def _poll_loop(self):
    #     while True:
    #         try:
    #             orders = self.rest_client.get_open_orders()
    #             for od in orders:
    #                 self._handle_remote_order(od)
    #             # accounts/positions
    #             acct = self.rest_client.get_account()
    #             self._emit_account(acct)
    #             pos = self.rest_client.get_positions()
    #             self._emit_positions(pos)
    #         except Exception as e:
    #             self._write_log(f"Polling error: {e}")
    #         time.sleep(1)  # adjust

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

    def query_account(self):
        acct = self.rest_client.get_account()
        self._emit_account(acct)

    def query_position(self):
        pos = self.rest_client.get_positions()
        self._emit_positions(pos)

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
            accountid=raw_acct["account_id"],
            balance=raw_acct["balance"],
            frozen=raw_acct.get("frozen", 0),
            gateway_name=self.gateway_name,
        )
        self.event_engine.put(Event(EVENT_ACCOUNT, acct))

    def _emit_positions(self, raw_positions):
        for p in raw_positions:
            pos = PositionData(
                symbol=p["symbol"],
                exchange=Exchange.SSE,
                direction=(
                    Direction.LONG if p["direction"] == "LONG" else Direction.SHORT
                ),
                volume=p["volume"],
                price=p.get("avg_price", 0),
                gateway_name=self.gateway_name,
            )
            self.event_engine.put(Event(EVENT_POSITION, pos))

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
