# Feature Introduction

As a Python-based quantitative trading program development framework, VeighNa is committed to providing quantitative solutions from trading API integration to automated strategy trading.

## Target Users

If you have the following needs, consider trying VeighNa:

* Develop your own quantitative trading programs based on Python language, making full use of Python community's powerful data research and machine learning ecosystem
* Connect to various types of financial markets at home and abroad through a standardized trading platform system: securities, futures, options, overseas markets, etc.
* Use thoroughly field-tested quantitative strategy engines to complete the entire business process from data maintenance, strategy development, backtesting research to live automated trading
* Customize and extend the platform to meet personalized trading needs: add trading interfaces, modify GUI interfaces, develop complex strategy applications based on event-driven engines
* Control the source code details of trading programs, eliminate various program backdoors, and avoid risks such as strategy theft, trading signal interception, and account password theft
* Save costs for quantitative trading platforms, no longer need to pay tens of thousands of annual software licensing fees or additional points per transaction

## Application Scenarios

From professional individual investors and startup hedge funds to securities asset management departments, VeighNa can find application scenarios.

* Professional individual investors: Use VeighNa Trader to directly connect to futures companies' CTP futures counters, achieving CTA business processes from strategy development to live automated trading
* Startup hedge funds: Build unified reporting channels on the server side based on RpcService, allowing traders to develop various trading strategy applications on their local computers
* Securities asset management departments: Connect to securities companies' unified O32 asset management systems, and customize develop multi-strategy complex systems based on event-driven engines

## Supported Interfaces

**vnpy.gateway**, covering trading interfaces for all trading varieties at home and abroad:

* Domestic Markets

  * CTP (ctp): Futures, Futures Options

  * CTP Test (ctptest): Futures, Futures Options

  * CTP Mini (mini): Futures, Futures Options

  * FEMAS (femas): Futures

  * CTP Options (sopt): ETF Options

  * Vertex Feichuang (sec): ETF Options

  * Vertex HTS (hts): ETF Options

  * HS UFT (uft): Futures, ETF Options

  * Yisheng (esunny): Futures, Gold TD

  * Zhongtai XTP (xtp): A-shares, Margin Trading, ETF Options

  * Guotai Junan Unified Trading Gateway (hft): A-shares, Margin Trading

  * Huaxin Qidian Stocks (torastock): A-shares

  * Huaxin Qidian Options (toraoption): ETF Options

  * Zhongyi Huida Comstar (comstar): Interbank Market

  * Dongfang Securities OST (ost): A-shares

  * Ronghang (rohon): Futures Asset Management

  * TTS (tts): Futures

  * Feishu (sgit): Gold TD

  * Jinshida Gold (ksgold): Gold TD

* Overseas Markets

  * Interactive Brokers (ib): Overseas Multi-varieties

  * Yisheng 9.0 Overseas (tap): Overseas Futures

  * Direct Access Futures (da): Overseas Futures

* Special Applications

  * RPC Service (rpc): Cross-process communication interface for distributed architecture

## Supported Applications

**vnpy.app**, ready-to-use quantitative strategy trading applications:

* cta_strategy: CTA strategy engine module, while maintaining ease of use, allows users to perform fine-grained control over the reporting and cancellation behavior of CTA strategy orders during operation (reducing trading slippage, implementing high-frequency strategies)

* cta_backtester: CTA strategy backtesting module, no need to use Jupyter Notebook, directly use graphical interface for strategy backtesting analysis, parameter optimization and related work

* spread_trading: Multi-contract spread arbitrage module, in addition to allowing users to manually start algorithmic buying and selling spreads, also supports users to use the strategy template SpreadStrategyTemplate to develop various spread quantitative trading strategies

* algo_trading: Algorithmic trading module, providing various commonly used intelligent trading algorithms: TWAP, Sniper, Iceberg, BestLimit, etc. Supports common algorithm configuration saving

* option_master: Options volatility trading module, provides volatility curve charts, allows users to make corresponding judgment analysis, then use volatility management components to set pricing reference volatility, and then automatically scan market trading opportunities through options electronic eye algorithms and instantly complete trades

* portfolio_strategy: Multi-contract portfolio strategy module, specifically designed for quantitative strategies that need to trade multiple contracts simultaneously, meeting their historical data backtesting and live automated trading needs

* script_trader: Script strategy module, designed for multi-target portfolio trading strategies, can also directly implement REPL command-style trading in the command line, does not support backtesting functionality

* chart_wizard: Real-time K-line chart module, can implement simple real-time K-line market display, directly input vt_symbol in the local contract code edit box, click the [New Chart] button to open the chart for the corresponding contract

* rpc_service: RPC service module, allows starting a VeighNa Trader process as a server, serving as a unified market data and trading routing channel, allowing multiple clients to connect simultaneously, implementing multi-process distributed systems

* excel_rtd: Excel RTD module, RTD stands for RealTimeData, is Microsoft's data integration solution mainly designed for real-time data needs in the financial industry. This module is used to implement the function of accessing any data information within VeighNa programs in Excel

* data_manager: Historical data management module, is a multi-functional management tool for historical data within VeighNa Trader. Can support data import, data viewing, and data export functions, supports custom data table header formats

* data_recorder: Market data recording module, configured through graphical interface, records Tick or K-line market data to database in real-time according to needs, used for strategy backtesting or live initialization

* risk_manager: Risk management module, provides statistics and restrictions on rules including trading flow control, order quantity, active orders, total cancellation count, etc., effectively implementing front-end risk control functions

* web_trader: Web service module, designed for B-S architecture needs, implements a web server providing active function calls (REST) and passive data push (Websocket)

* portfolio_manager: Portfolio management module, this module is mainly aimed at various investors adopting fundamental strategies, creating an independent portfolio strategy object for each investment strategy

* paper_account: Paper trading account module, designed to solve the current problems of various simulation trading accounts that need to rely on server-side functions, directly provides a localized simulation trading environment within the trading client, while performing order matching based on live market data

## General Components

**vnpy.event**, a concise and easy-to-use event-driven engine, serving as the core of event-driven trading programs.

**vnpy.chart**, high-performance Python K-line charts, supporting large data volume chart display and real-time data update functions.

**vnpy.trader.database**, integrates several database management modules to support database read/write performance and future new database extensions.

**vnpy.trader.datafeed**, provides standardized BaseDataFeed interface, bringing more flexible data service support.
