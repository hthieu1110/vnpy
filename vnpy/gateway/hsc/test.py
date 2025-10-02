import asyncio
import json
import time
from vnpy.event import EventEngine
from vnpy.trader.engine import MainEngine
from vnpy.trader.event import EVENT_TICK, EVENT_ORDER, EVENT_TRADE
from vnpy.trader.object import (
    SubscribeRequest,
    OrderRequest,
    Direction,
    Offset,
    OrderType,
)
from vnpy.trader.constant import Exchange

from vnpy.gateway.hsc.gateway import HscGateway
from vnpy.gateway.hsc.settings import HscGatewaySettings

import os
from dotenv import load_dotenv

from vnpy.trader.utility import load_json

load_dotenv()


def print_tick(event):
    tick = event.data
    print("TICK:", tick)


def print_order(event):
    order = event.data
    print("ORDER:", order)


def print_trade(event):
    trade = event.data
    print("TRADE:", trade)


def run():
    GATEWAY_NAME = "HSC"
    SYMBOL = "41I1FA000"

    # 1. Start engines
    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)
    main_engine.add_gateway(HscGateway, GATEWAY_NAME)

    # 2. Register listeners
    event_engine.register(EVENT_TICK, print_tick)
    event_engine.register(EVENT_ORDER, print_order)
    event_engine.register(EVENT_TRADE, print_trade)

    # 3. Connect gateway (replace with your API keys)

    workdir = os.getcwd()
    filepath = os.path.join(workdir, ".vntrader/connect_hscgateway.json")

    with open(filepath, encoding="UTF-8") as f:
        settings: dict = json.load(f)

    main_engine.connect(settings, GATEWAY_NAME)

    # 4. Subscribe to market data
    sub = SubscribeRequest(symbol=SYMBOL, exchange=Exchange.VNEX)
    main_engine.subscribe(sub, GATEWAY_NAME)

    # # 5. Place a test order
    # order_req = OrderRequest(
    #     symbol="VN30F2310",
    #     exchange=Exchange.HOSE,
    #     direction=Direction.LONG,
    #     offset=Offset.OPEN,
    #     type=OrderType.LIMIT,
    #     price=1000,
    #     volume=1,
    # )
    # vt_orderid = main_engine.send_order(order_req, "VNSTOCK")
    # print("Order sent, vt_orderid:", vt_orderid)


if __name__ == "__main__":
    run()
