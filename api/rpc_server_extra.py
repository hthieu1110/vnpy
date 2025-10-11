from vnpy_ctastrategy import CtaTemplate
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
