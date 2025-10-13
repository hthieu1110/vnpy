from typing import Callable
from vnpy_binance import BinanceSpotGateway
from vnpy_ctastrategy import CtaStrategyApp
from vnpy_rpcservice import RpcServiceApp
from vnpy_rpcservice.rpc_service import RpcEngine
from api.rpc_server_extra import BacktesterEngineExtra
from vnpy_ctabacktester import CtaBacktesterApp

from api.config import RPC_HOST, RPC_REP_PORT, RPC_PUB_PORT
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

from api.utils import EventRegistry, RpcRegistry


def main():
    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)

    main_engine.add_gateway(BinanceSpotGateway, gateway_name="Vision")

    cta_strategy = main_engine.add_app(CtaStrategyApp)
    rpc_service = main_engine.add_app(RpcServiceApp)
    backtester = main_engine.add_app(CtaBacktesterApp)

    # manage rpc service -------------------------------------------------------------
    rpc_service.start(
        rep_address=f"tcp://{RPC_HOST}:{RPC_REP_PORT}",
        pub_address=f"tcp://{RPC_HOST}:{RPC_PUB_PORT}",
    )

    event_registry = EventRegistry(event_engine)
    rpc_registry = RpcRegistry(rpc_service)

    # main engine management -------------------------------------------------------------
    rpc_registry.add_multi(
        "MainEngine",
        [
            main_engine.connect,
            main_engine.send_order,
            main_engine.cancel_order,
            main_engine.get_all_quotes,
            main_engine.get_all_active_quotes,
        ],
    )

    event_registry.add_multi(
        [
            EVENT_LOG,
            EVENT_CONTRACT,
            EVENT_POSITION,
            EVENT_ACCOUNT,
            EVENT_QUOTE,
            EVENT_TICK,
            EVENT_TRADE,
            EVENT_ORDER,
        ]
    )

    # backtester engine management -------------------------------------------------------------
    backtester_extra = BacktesterEngineExtra(backtester)
    rpc_registry.add_multi(
        "CtaBacktesterApp",
        [
            backtester.init_engine,
            backtester.start_downloading,
            backtester.start_backtesting,
            backtester.start_optimization,
            backtester.get_all_orders,
            backtester.get_all_trades,
            backtester.get_all_daily_results,
            backtester.get_history_data,
            backtester.reload_strategy_class,
            backtester.get_result_values,
            backtester.get_result_statistics,
            backtester_extra.get_all_strategies,
        ],
    )

    event_registry.add_multi(
        [
            EVENT_BACKTESTER_LOG,
            EVENT_BACKTESTER_BACKTESTING_FINISHED,
            EVENT_BACKTESTER_OPTIMIZATION_FINISHED,
        ]
    )

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
