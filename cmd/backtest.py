from datetime import datetime, timedelta
from vnpy.event import EventEngine
from vnpy.trader.engine import MainEngine
from vnpy.trader.ui import create_qapp

from vnpy_binance import BinanceSpotGateway
from vnpy_ctabacktester import CtaBacktesterApp


def main() -> None:
    """Start Trader"""
    qapp = create_qapp()

    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)

    main_engine.add_gateway(BinanceSpotGateway)
    backtester = main_engine.add_app(CtaBacktesterApp)

    backtester.init_engine()
    backtester.start_backtesting(
        "SimpleStrategy",
        "BTCUSDT",
        "1m",
        datetime.now() - timedelta(days=1),
        datetime.now(),
        0.001,
        0.001,
        1,
        1,
        1000000,
        {},
    )


if __name__ == "__main__":
    main()
