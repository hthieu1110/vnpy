# Mac Installation Guide

## CTP Interface Support for Mac Systems

Thanks to Python's cross-platform advantages (Windows, Linux, Mac three major systems), VeighNa quantitative trading platform's core framework has been able to run on Mac systems for a long time.

However, due to the general lack of support for C++ trading APIs for Mac systems, previously only a few trading interfaces such as vnpy_ib that are [pure Python implementations] could run on Mac systems, which had little practical value for most users.

Starting from CTP API version 6.6.7, the Shanghai Futures Technology officially launched support for Mac systems, including Intel (x86_64) and Apple M-series (arm64) chips. Finally, VeighNa platform can provide integrated solutions from investment research backtesting to live trading for futures quantitative users on Mac systems.

## VeighNa Installation Process on Mac Systems

Currently, there is no ready-to-use distribution like VeighNa Studio on Mac systems, and the installation process needs to be completed manually:

1. Go to the Python official website to download the 3.10 version installation package (or use brew to install). After installation is complete, run the following command in Terminal:

```python3
python3
```
Check and confirm that the opened Python interpreter is version 3.10.

2. Use brew to install TA-Lib C++ development package:

```python3
brew install ta-lib
```

3. Install NumPy and TA-Lib (Python). Here we recommend using Douban PyPI mirror to solve the difficulty of accessing official sources:

```python3
python3 -m pip install numpy==1.26.4 --index=https://pypi.doubanio.com/simple
python3 -m pip install ta-lib --index=https://pypi.doubanio.com/simple
```

4. Install RiceQuant RQData client. Note that RiceQuant PyPI source is used here:

```python3
python3 -m pip install rqdatac --index=https://pypi2.ricequant.com/simple
```

5. Install VeighNa core framework and required functional plugin modules:

```python3
python3 -m pip install vnpy --index=https://pypi.doubanio.com/simple
python3 -m pip install vnpy_ctastrategy vnpy_ctabacktester vnpy_datamanager vnpy_sqlite vnpy_rqdata --index=https://pypi.doubanio.com/simple
```
The example here includes (can be adjusted according to your needs):

 - CTA strategy live and backtesting modules: vnpy_ctastrategy, vnpy_ctabacktester
 - Historical data management module: vnpy_datamanager
 - SQLite database driver: vnpy_sqlite
 - RQData data service adapter: vnpy_rqdata

If errors occur during pip installation due to missing certain dependency libraries, you can try installing that dependency library with pip first, then execute the above installation command again.

6. Install CTP trading interface module:

Due to significant changes in the project structure of CTP Mac system API in version 6.7.2, it has been changed to use framework directory structure, so it is no longer possible to directly download pre-compiled wheel binary packages from PyPI for installation.

Users need to clone (or download) this repository's source code to local (note: don't put the cloned source code folder vnpy_ctp directly under the user folder, it needs to be placed in a subfolder, otherwise there will be situations where the module cannot be recognized after installation. For example, create a folder named github under the user folder) and compile and install it themselves. The specific commands are as follows:

```python3
mkdir github

cd github

git clone https://github.com/vnpy/vnpy_ctp.git

cd vnpy_ctp

pip3 install -e .
```

Related notes are as follows:

Source code compilation requires XCode development tools' C++ compiler, please make sure to install it first.

During compilation, the framework folder path in the source code directory cloned to local will be specified as the loading path for API runtime dynamic libraries. Therefore, after subsequent runtime, the source code directory cannot be deleted or moved, otherwise it will cause dynamic library loading not found errors.

Due to the security mechanism of current new version Mac systems, after compilation is complete, you need to find the following two dynamic library files in [Finder], manually open each once to add to the operating system trust list, so that they can be successfully loaded when starting Python:

* vnpy_ctp/api/libs/thostmduserapi_se.framework/Versions/A/thostmduserapi_se
* vnpy_ctp/api/libs/thosttraderapi_se.framework/Versions/A/thosttraderapi_se

The above two files cannot be opened normally due to their binary format, but this does not affect adding them to the system trust list.

After completion, you can use the run.py script to start VeighNa Trader. The code is as follows:

```python3
from vnpy.event import EventEngine
from vnpy.trader.engine import MainEngine
from vnpy.trader.ui import MainWindow, create_qapp
from vnpy_ctp import CtpGateway
from vnpy_ctastrategy import CtaStrategyApp
from vnpy_ctabacktester import CtaBacktesterApp
from vnpy_datamanager import DataManagerApp

def main():
    """Start VeighNa Trader"""
    qapp = create_qapp()

    event_engine = EventEngine()
    main_engine = MainEngine(event_engine)

    main_engine.add_gateway(CtpGateway)
    main_engine.add_app(CtaStrategyApp)
    main_engine.add_app(CtaBacktesterApp)
    main_engine.add_app(DataManagerApp)

    main_window = MainWindow(main_engine, event_engine)
    main_window.showMaximized()

    qapp.exec()

if __name__ == "__main__":
    main()
```
