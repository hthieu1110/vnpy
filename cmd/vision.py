import sys
from vnpy_ctabacktester import CtaBacktesterApp
from vnpy.event import EventEngine
from vnpy.trader.engine import MainEngine
from vnpy.trader.ui import MainWindow, create_qapp

from vnpy_binance import BinanceSpotGateway

# from vnpy_novastrategy import NovaStrategyApp
from vnpy_ctastrategy import CtaStrategyApp
from vnpy_chartwizard import ChartWizardApp
from vnpy_paperaccount import PaperAccountApp


def main():
    qapp = create_qapp()
    qapp.setQuitOnLastWindowClosed(True)

    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)

    # main_engine.add_gateway(BinanceSpotGateway, gateway_name="Vision")
    main_engine.add_app(PaperAccountApp)
    # main_engine.add_app(CtaStrategyApp)
    # main_engine.add_app(ChartWizardApp)
    # main_engine.add_app(CtaBacktesterApp)

    # main_engine.add_app(NovaStrategyApp)

    main_window = MainWindow(main_engine, event_engine, force_close=True)
    main_window.auto_connect_gateway("Vision")
    main_window.showMaximized()

    qapp.exec()


if __name__ == "__main__":
    main()
