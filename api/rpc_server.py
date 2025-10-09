from vnpy_binance import BinanceSpotGateway
from vnpy_ctastrategy import CtaStrategyApp
from vnpy_rpcservice import RpcServiceApp
from vnpy_ctabacktester import CtaBacktesterApp

from api.config import RPC_HOST, RPC_REP_PORT, RPC_PUB_PORT
from api.utils import event_to_centri
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
from vnpy_ctabacktester.engine import (
    EVENT_BACKTESTER_LOG,
    EVENT_BACKTESTER_BACKTESTING_FINISHED,
    EVENT_BACKTESTER_OPTIMIZATION_FINISHED,
)
from vnpy.trader.logger import logger


def main():
    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)

    main_engine.add_gateway(BinanceSpotGateway, gateway_name="Vision")

    # main_engine.add_app(CtaStrategyApp)
    rpc_service = main_engine.add_app(RpcServiceApp)
    backtester = main_engine.add_app(CtaBacktesterApp)

    # manage rpc service -------------------------------------------------------------
    rpc_service.start(
        rep_address=f"tcp://{RPC_HOST}:{RPC_REP_PORT}",
        pub_address=f"tcp://{RPC_HOST}:{RPC_PUB_PORT}",
    )

    # main engine management -------------------------------------------------------------
    rpc_service.server.register(main_engine.connect)
    rpc_service.server.register(main_engine.get_all_quotes)
    rpc_service.server.register(main_engine.get_all_active_quotes)

    event_to_centri(event_engine, EVENT_LOG)
    event_to_centri(event_engine, EVENT_CONTRACT)
    event_to_centri(event_engine, EVENT_POSITION)
    event_to_centri(event_engine, EVENT_ACCOUNT)
    event_to_centri(event_engine, EVENT_QUOTE)
    event_to_centri(event_engine, EVENT_TICK)
    event_to_centri(event_engine, EVENT_TRADE)
    event_to_centri(event_engine, EVENT_ORDER)

    # backtester engine management -------------------------------------------------------------
    rpc_service.server.register(backtester.init_engine)
    rpc_service.server.register(backtester.start_downloading)
    rpc_service.server.register(backtester.start_backtesting)
    rpc_service.server.register(backtester.start_optimization)

    event_to_centri(event_engine, EVENT_BACKTESTER_LOG)
    event_to_centri(event_engine, EVENT_BACKTESTER_BACKTESTING_FINISHED)
    event_to_centri(event_engine, EVENT_BACKTESTER_OPTIMIZATION_FINISHED)

    logger.info("RpcServer started")

    try:
        # Keep the server running
        import time

        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down...")


if __name__ == "__main__":
    main()
