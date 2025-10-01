import threading
import time
from typing import Dict

from vnpy.trader.constant import (
    Exchange,
    OrderType,
    Direction,
    Status,
)
from vnpy.event import Event
from vnpy.trader.event import (
    EVENT_TICK,
    EVENT_ORDER,
    EVENT_TRADE,
    EVENT_ACCOUNT,
    EVENT_POSITION,
    EVENT_LOG,
)
from vnpy.trader.object import AccountData, OrderData, PositionData, TickData, TradeData

from .vnfuture_socket import VNFutureSocketClient
from .vnfuture_rest import VNFutureRestClient
from .constants import ORDER_TYPE_MAP, STATUS_MAP
from vnpy.trader.gateway import BaseGateway


class VNFutureGateway(BaseGateway):
    """
    Implement VNFuture gateway.
    """

    def __init__(self, event_engine, gateway_name="VNFuture"):
        self.event_engine = event_engine
        self.gateway_name = gateway_name

        self.market_client: VNFutureSocketClient = None
        self.rest_client: VNFutureRestClient = None

        # local map: local_order_id -> remote_order_id
        self._local_to_remote: Dict[str, str] = {}
        self._remote_to_local: Dict[str, str] = {}

    def connect(self, settings: dict):
        """
        settings example:
        {
            "market_ws": "wss://md.internal:443/ws",
            "trade_rest": "https://api.internal/trade",
            "api_key": "...",
            "secret": "...",
            "account": "ACC123",
        }
        """
        # create clients
        self.rest_client = VNFutureRestClient(
            settings["trade_rest"], settings["api_key"], settings.get("secret")
        )
        self.market_client = VNFutureSocketClient(
            settings["market_ws"], on_tick=self._on_tick
        )
        # start market client in background loop
        self.market_client.start()

        # optionally start a thread to poll order/account updates (if REST push not available)
        self._start_polling()

    def _start_polling(self):
        t = threading.Thread(target=self._poll_loop, daemon=True)
        t.start()

    def _poll_loop(self):
        while True:
            try:
                orders = self.rest_client.get_open_orders()
                for od in orders:
                    self._handle_remote_order(od)
                # accounts/positions
                acct = self.rest_client.get_account()
                self._emit_account(acct)
                pos = self.rest_client.get_positions()
                self._emit_positions(pos)
            except Exception as e:
                self._write_log(f"Polling error: {e}")
            time.sleep(1)  # adjust

    def subscribe(self, subscribe_req):
        # subscribe via market client
        self.market_client.subscribe(subscribe_req.vt_symbol)

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
        tick = TickData(
            symbol=raw_tick["symbol"],
            exchange=Exchange.SSE,
            datetime=raw_tick["datetime"],
            name=raw_tick.get("name", ""),
            volume=raw_tick.get("volume", 0),
            last_price=raw_tick["last_price"],
            limit_up=raw_tick.get("limit_up"),
            limit_down=raw_tick.get("limit_down"),
            gateway_name=self.gateway_name,
        )
        self.event_engine.put(Event(EVENT_TICK, tick))

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
        if self.market_client:
            self.market_client.stop()
        if self.rest_client:
            self.rest_client.close()
