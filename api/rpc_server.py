from vnpy_binance import BinanceSpotGateway
from vnpy_ctastrategy import CtaStrategyApp
from vnpy_rpcservice import RpcServiceApp

from api.config import RPC_HOST, RPC_REP_PORT, RPC_PUB_PORT
from api.utils import http_client, publish_event
from vnpy.event.engine import EventEngine
from vnpy.trader.engine import MainEngine
from vnpy.trader.event import (
    EVENT_ACCOUNT,
    EVENT_CONTRACT,
    EVENT_LOG,
    EVENT_POSITION,
    EVENT_QUOTE,
    EVENT_TICK,
    EVENT_TRADE,
    EVENT_ORDER,
)
from vnpy.trader.logger import logger


def main():
    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)

    main_engine.add_gateway(BinanceSpotGateway, gateway_name="Vision")

    main_engine.add_app(CtaStrategyApp)
    main_engine.add_app(RpcServiceApp)

    # manage rpc service -------------------------------------------------------------
    rpc_service = main_engine.get_engine(RpcServiceApp.app_name)
    rpc_service.start(
        rep_address=f"tcp://{RPC_HOST}:{RPC_REP_PORT}",
        pub_address=f"tcp://{RPC_HOST}:{RPC_PUB_PORT}",
    )

    rpc_service.server.register(main_engine.connect)

    logger.info("RpcServer started")

    # register event to publish to centrifugo ----------------------------------------
    event_engine.register(EVENT_LOG, publish_event)
    event_engine.register(EVENT_CONTRACT, publish_event)
    event_engine.register(EVENT_POSITION, publish_event)
    event_engine.register(EVENT_ACCOUNT, publish_event)
    event_engine.register(EVENT_QUOTE, publish_event)
    event_engine.register(EVENT_TICK, publish_event)
    event_engine.register(EVENT_TRADE, publish_event)
    event_engine.register(EVENT_ORDER, publish_event)

    try:
        # Keep the server running
        import time

        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down...")


if __name__ == "__main__":
    main()
