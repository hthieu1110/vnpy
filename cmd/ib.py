from vnpy.event import EventEngine  
from vnpy.trader.engine import MainEngine  
from vnpy.trader.ui import MainWindow, create_qapp  
  
from vnpy_ctastrategy import CtaStrategyApp  
from vnpy_paperaccount import PaperAccountApp
from vnpy_ib import IbGateway
  
def main():  
    qapp = create_qapp()  
  
    event_engine = EventEngine()  
    main_engine = MainEngine(event_engine)  
      
    main_engine.add_gateway(IbGateway)

    # Add paper account for simulation  
    # main_engine.add_app(PaperAccountApp)  
    main_engine.add_app(CtaStrategyApp)  
  
    main_window = MainWindow(main_engine, event_engine)  
    main_window.showMaximized()  
  
    qapp.exec()  
  
if __name__ == "__main__":  
    main()