from PySide6 import QtCore, QtWidgets

from vnpy.trader.engine import MainEngine
from vnpy.trader.object import ContractData
from vnpy.event import Event
from vnpy.trader.event import EVENT_CONTRACT


class SymbolLineWithAutoCompletion(QtWidgets.QLineEdit):
    completer_activated: QtCore.Signal = QtCore.Signal(str)

    def __init__(self, main_engine: MainEngine, lazy=False, is_vt_symbol=True, *args, **kwargs):
        """
        lazy: if True, the symbol list will be updated base on EVENT_CONTRACT
        we need this because for init UI, the gateway is not connected yet
        """
        super().__init__(*args, **kwargs)

        self.model = QtCore.QStringListModel([])
        self.main_engine = main_engine
        self.is_vt_symbol = is_vt_symbol
        self.setup_auto_completion()

        if lazy:
            self.main_engine.event_engine.register(EVENT_CONTRACT, self.process_contract_event)

    def process_contract_event(self, event: Event):
        contract: ContractData = event.data
        self.add_symbol(contract.vt_symbol if self.is_vt_symbol else contract.symbol)

    def setup_auto_completion(self):
        contracts: list[ContractData] = self.main_engine.get_all_contracts()
        symbols = [contract.vt_symbol if self.is_vt_symbol else contract.symbol for contract in contracts]
        self.model.setStringList(symbols)

        completer = QtWidgets.QCompleter(self.model)
        completer.setFilterMode(QtCore.Qt.MatchFlag.MatchStartsWith)
        completer.setCaseSensitivity(QtCore.Qt.CaseSensitivity.CaseInsensitive)

        completer.activated.connect(lambda text: self.completer_activated.emit(text))

        self.setCompleter(completer)

    def add_symbol(self, symbol: str):
        symbols = self.model.stringList()
        symbols.append(symbol)
        self.model.setStringList(symbols)