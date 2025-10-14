from vnpy_ctastrategy import CtaTemplate
from vnpy.trader.engine import MainEngine
from vnpy_ctabacktester.engine import BacktesterEngine
from pathlib import Path

class BacktesterEngineExtra:
    def __init__(self, backtester: BacktesterEngine):
        self.backtester = backtester

    def get_all_strategies(self):
        user_strategies: Path  = Path.cwd().joinpath("strategies")
        self.backtester.load_strategy_class_from_folder(user_strategies, "strategies")

        res = []
        for strategy_name, strategy_cls in self.backtester.classes.items():
            strategy_cls: CtaTemplate = strategy_cls

            res.append({
                'strategy_name': strategy_name,
                'strategy_params': strategy_cls.get_class_parameters(),
            })
        return res

class MainEngineExtra:
    def __init__(self, main_engine: MainEngine):
        self._connected_gateways = {}
        self.main_engine = main_engine

    def check_gateway_connected(self, gateway_name: str):
        """
        Check if a gateway is connected.
        """
        return self._connected_gateways.get(gateway_name, False)

    def connect_and_track(self, setting: dict, gateway_name: str):
        """
        Wrap the main engine connect function and track if gateway is connected
        """
        self.main_engine.connect(setting, gateway_name)
        self._connected_gateways[gateway_name] = True

    def close_gateway(self, gateway_name: str):
        """Close a gateway"""
        # TODO: for now , do not close the gateway, just set the connection status to False
        if gateway_name in self._connected_gateways:
            self._connected_gateways[gateway_name] = False