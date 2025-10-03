# CtaStrategy - CTA Automated Trading Module

## Feature Introduction

CtaStrategy is a functional module for **CTA automated trading**. Users can easily complete tasks such as strategy initialization, strategy startup, strategy stop, strategy parameter editing, and strategy removal through its UI interface operations.

## Loading and Startup

### VeighNa Station Loading

After starting and logging into VeighNa Station, click the [Trading] button, and check [CtaStrategy] in the [Application Modules] column of the configuration dialog.

### Script Loading

Add the following code in the startup script:

```python3
# Write at the top
from vnpy_ctastrategy import CtaStrategyApp

# Write after creating the main_engine object
main_engine.add_app(CtaStrategyApp)
```

## Starting the Module

For user-developed strategies, they need to be placed in the **strategies** directory under the VeighNa Trader runtime directory to be recognized and loaded. The specific runtime directory path can be viewed in the title bar at the top of the VeighNa Trader main interface.

For users who install by default on Windows, the strategies directory path where strategies are placed is usually:

```
C:\Users\Administrator\strategies
```

Where Administrator is the current Windows system login username.

Before starting the module, please first connect to the trading interface (connection method can be found in the connection interface section of the basic usage). After seeing "Contract information query successful" output in the VeighNa Trader main interface [Log] bar, then start the module, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/1.png)

Please note that the IB interface cannot automatically obtain all contract information when logging in, and can only obtain it when users manually subscribe to market data. Therefore, you need to manually subscribe to contract market data on the main interface first, then start the module.

After successfully connecting to the trading interface, click [Function] -> [CTA Strategy] in the menu bar, or click the icon in the left button bar:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/00.png)

You can enter the CTA strategy module UI interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/2.png)

If data service is configured (configuration method can be found in the global configuration section of basic usage), when opening the CTA strategy module, it will automatically execute data service login initialization. If login is successful, it will output "Data service initialization successful" log, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/ctas.png)

## Adding Strategies

Users can create different strategy instances (objects) based on written CTA strategy templates (classes). The advantage of strategy instances is that the same strategy can simultaneously trade multiple variety contracts, and each instance can have different parameters.

Select the strategy name you want to trade in the dropdown box in the upper left corner, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/28.png)

Please note that the displayed strategy name is the name of the **strategy class** (camelCase naming), not the name of the strategy file (underscore mode naming).

After selecting the strategy class, click [Add Strategy], and an add strategy dialog will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/5.png)

When creating strategy instances, you need to configure related parameters. The parameter requirements are as follows:

- Instance Name
  - Instance names cannot be duplicated;
- Contract Variety
  - Format is vt_symbol (contract code + exchange name);
  - Must be contract names that can be found in the live trading system;
  - Generally choose the month with the best liquidity for that futures variety;
- Parameter Settings
  - The displayed parameter names are the parameter names written in the parameters list in the strategy;
  - The default values are the default values of the parameters in the strategy;
  - As can be observed from the above figure, the parameter names are followed by <> brackets showing the data type of that parameter. When filling in parameters, the corresponding data type should be followed. Among them, <class 'str'> is string, <class 'int'> is integer, <class 'float'> is float;
  - Please note that if a parameter might be adjusted to a value with decimal places, but the default parameter value is an integer (such as 1). When writing the strategy, please set the default parameter value to a float (such as 1.0). Otherwise, the strategy will default that parameter to an integer, and when [editing] strategy instance parameters later, it will only allow integers to be filled in.

After parameter configuration is complete, click the [Add] button to start creating the strategy instance. After successful creation, you can see the strategy instance in the strategy monitoring component on the left, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/47.png)

The top of the strategy monitoring component displays the strategy instance name, contract variety name, strategy class name, and strategy author name (defined in the strategy). The top buttons are used to control and manage strategy instances. The first row table displays the parameter information inside the strategy (parameter names need to be written in the strategy's parameters list to be displayed in the graphical interface), and the second row table displays the variable information during strategy operation (variable names need to be written in the strategy's variables list to be displayed in the graphical interface). The [inited] field indicates the current initialization status of the strategy (whether historical data playback has been completed), and the [trading] field indicates whether the strategy can currently start trading.

As can be observed from the above figure, at this time the [inited] and [trading] status of the strategy instance are both [False]. This indicates that the strategy instance has not been initialized yet and cannot send trading signals.

After successful creation of the strategy instance, the configuration information of the strategy instance will be saved to the cta_strategy_setting.json file in the .vntrader folder.

## Managing Strategies

### Initialization

After successful creation of the strategy instance, you can initialize that instance. Click the [Initialize] button under that strategy instance. If initialization is successful, it will look like the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/54.png)

During the initialization process, the following three tasks are completed in order:

1. **Obtain Historical Data**

   To ensure the accuracy of indicator values inside the strategy, each strategy instance needs a certain amount of historical data for strategy initialization.

   Therefore, during strategy initialization, the load_bar function inside the strategy instance will first obtain the latest historical data from the interface. If the interface does not provide historical data, it will obtain it through the configured data service (taking RQData as an example, [RQData](https://www.ricequant.com/welcome/purchase?utm_source=vnpy) provides domestic futures, stocks, and options historical data. RQData's data service provides intraday K-line updates, even if the strategy is started at 9:45, it can obtain K-line data from 9:30 market open to 9:45, providing it to the strategy for initialization calculation, without worrying about data missing issues). If no data service is configured, it will query through local database access. In this case, users need to ensure data completeness in the database (meeting initialization requirements), which can be recorded through DataRecorder or imported from CSV files using DataManager.

   The specific data loading length depends on the parameter control of the load_bar function (strategy template defaults to 10 days). After data loading, it will be pushed to the strategy in the form of K-line by K-line (or Tick), implementing internal variable initialization calculation, such as caching K-line sequences, calculating technical indicators, etc.

2. **Load Cached Variables**

   During daily live operation, some variables in quantitative strategies are only related to historical market data. This type of variable can get correct values through loading historical data playback. Another type of variable may be related to trading status, such as strategy positions, trailing stops' highest price tracking, etc. This type of variable needs to be cached on hard disk (when exiting the program), and read and restored the next day after historical data playback, to ensure consistency with previous trading status.

   Each time the strategy is stopped, the variables corresponding to the strategy's variables list and strategy positions will be automatically cached into the cta_strategy_data.json file in the .vntrader directory, for automatic loading during the next strategy initialization.

   Please note that in some cases (such as manual position closing), cached data may have deviations (because strategy position maintenance is the logical position of the running strategy instance, not the position of a specific variety), then you can adjust by manually modifying the json file.

3. **Subscribe to Market Data Push**

   Finally, based on the vt_symbol parameter, obtain the contract information that the strategy trades, and subscribe to real-time market data push for that contract. If the live trading system cannot find information for that contract, such as not connecting to the login interface or vt_symbol filling error, corresponding error information will be output in the log module.

After the above three steps are completed, it can be observed that at this time the [inited] status of the strategy instance has become [True], and variables also display corresponding values (no longer 0). This indicates that the strategy instance has called the load_bar function to load historical data and completed initialization. The [trading] status is still [False], indicating that the strategy instance cannot start automated trading yet.

### Start

When the strategy instance initialization is successful and the [inited] status is [True], the automated trading function can be started. Click the [Start] button under the strategy instance to start that strategy instance. After success, it will look like the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/59.png)

It can be observed that at this time the [inited] and [trading] status of the strategy instance are both [True]. This indicates that the strategy instance has called the load_bar function, completed historical data playback, and at this time the trading request class functions (buy/sell/short/cover/cancel_order, etc.) and information output class functions (send_email/put_event, etc.) inside the strategy will truly execute and send corresponding request instructions to the underlying interface (truly execute trading).

During the strategy initialization process in the previous step, although the strategy was also receiving (historical) data and calling corresponding functional functions, because the [trading] status was [False], there would not be any real order placement operations or trading-related log information output.

If the strategy sends limit orders after startup, you can go to the VeighNa Trader main interface [Orders] bar to view order details. If the strategy sends local stop orders, you can view order details in the stop order monitoring component in the upper right area of the CTA strategy UI interface.

### Stop

If after starting the strategy, due to certain situations (such as reaching market close time, or encountering emergency situations during trading) you want to stop, edit, or remove the strategy, you can click the [Stop] button under the strategy instance to stop that strategy instance's automated trading. After success, it will look like the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/60.png)

The CTA strategy engine will automatically cancel all active orders previously sent by that strategy to ensure that there are no uncontrolled orders after the strategy stops. At the same time, the latest variable information of that strategy instance will be saved to the cta_strategy_data.json file in the .vntrader folder.

At this time, it can be observed that the [trading] status of the strategy instance has changed to [False], indicating that the strategy instance has stopped automated trading.

During CTA strategy live trading, under normal circumstances, the strategy should run automatically throughout the entire trading session, and try to avoid additional pause and restart operations. For domestic futures markets, automated trading should be started before the trading session begins, then closed after market close. Because now CTP night session also closes the system after market close and restarts before morning open, strategies also need to be stopped after night session close and VeighNa Trader needs to be closed.

## CTA Strategy Template (CtaTemplate)

The CTA strategy template provides signal generation and order management functions. Users can develop CTA strategies based on this template (located in site-packages\vnpy_ctastrategy\template).

User-developed strategies can be placed in the [strategies] folder under the user runtime folder.

Please note:

1. Strategy file naming uses underscore mode, such as boll_channel_strategy.py, while strategy class naming uses camelCase, such as BollChannelStrategy.

2. Self-built strategy class names should not coincide with example strategy class names. If they coincide, only one strategy class name will be displayed on the graphical interface.

### Strategy Parameters and Variables

Below the strategy class, you can set the strategy author (author), parameters (parameters), and variables (variables), as shown in the code below:

```python3
    author = "Python Trader"

    boll_window = 18
    boll_dev = 3.4
    cci_window = 10
    atr_window = 30
    sl_multiplier = 5.2
    fixed_size = 1

    boll_up = 0
    boll_down = 0
    cci_value = 0
    atr_value = 0

    intra_trade_high = 0
    intra_trade_low = 0
    long_stop = 0
    short_stop = 0

    parameters = [
        "boll_window",
        "boll_dev",
        "cci_window",
        "atr_window",
        "sl_multiplier",
        "fixed_size"
    ]
    variables = [
        "boll_up",
        "boll_down",
        "cci_value",
        "atr_value",
        "intra_trade_high",
        "intra_trade_low",
        "long_stop",
        "short_stop"
    ]
```

Although both strategy parameters and variables belong to the strategy class, strategy parameters are fixed (specified by traders externally), while strategy variables change with strategy status during trading, so strategy variables only need to be initialized to corresponding basic types at the beginning. For example: integers set to 0, floats set to 0.0, and strings set to "".

If you need the CTA engine to display strategy parameters and variables on the UI interface during operation, and save their values during data refresh and strategy stop, you need to add the names of parameters and variables (in string data type) to the parameters and variables lists.

Please note that this list only accepts parameters or variables passed in as str, int, float, and bool data types. If the strategy needs to use parameters and variables of other data types, please put the definition of that parameter or variable under the __init__ function.

### Class Initialization

Input parameters: cta_engine: Any, strategy_name: str, vt_symbol: str, setting: dict

Output parameters: None

The __init__ function is the constructor of the strategy class and needs to be consistent with the inherited CtaTemplate.

In this inherited strategy class, initialization is generally divided into three steps, as shown in the code below:

```python3
    def __init__(self, cta_engine, strategy_name, vt_symbol, setting):
        """"""
        super().__init__(cta_engine, strategy_name, vt_symbol, setting)

        self.bg = BarGenerator(self.on_bar, 15, self.on_15min_bar)
        self.am = ArrayManager()
```

1. Inherit the CTA strategy template through the super() method, passing in the CTA engine, strategy name, vt_symbol, and parameter settings in the __init__() function. Note that the CTA engine can be a live engine or backtesting engine, which facilitates **implementing the same code running both backtesting and live** (the above parameters are automatically passed in by the strategy engine when using the strategy class to create strategy instances, users do not need to set them).

2. Call the K-line generation module (BarGenerator): synthesize Tick data into 1-minute K-line data through time slicing. If needed, longer time period data can also be synthesized, such as 15-minute K-lines.

3. Call the K-line time series management module (ArrayManager): based on K-line data, such as 1-minute, 15-minute, convert it into time series data structures convenient for vectorized calculations, and internally support using talib library to calculate corresponding technical indicators.

### Strategy Callback Functions

Functions starting with "on" in CtaTemplate are called callback functions, which can be used to receive data or receive status updates when writing strategies. The role of callback functions is that when a certain event occurs, this type of function in the strategy will be automatically called by the CTA strategy engine (no need to actively operate in the strategy).

#### Strategy Instance Status Control (Required for all strategies)

**on_init**

* Input parameters: None
* Output parameters: None

The on_init function will be called when initializing the strategy. The default approach is to first call the write_log function to output "Strategy initialization" log, then call the load_bar function to load historical data.

**on_start**

* Input parameters: None
* Output parameters: None

The on_start function will be called when starting the strategy. The default approach is to call the write_log function to output "Strategy started" log.

**on_stop**

* Input parameters: None
* Output parameters: None

The on_stop function will be called when stopping the strategy. The default approach is to call the write_log function to output "Strategy stopped" log.

#### Receive Data, Calculate Indicators, Send Trading Signals

**on_tick**

* Input parameters: tick: TickData
* Output parameters: None

When the strategy receives the latest Tick data market push, the on_tick function will be called. The default approach is to push the received Tick data into the bg instance created earlier through BarGenerator's update_tick function to synthesize 1-minute K-lines.

**on_bar**

* Input parameters: bar: BarData
* Output parameters: None

When the strategy receives the latest K-line data (live trading defaults to 1-minute K-lines synthesized based on Tick, backtesting depends on the K-line data frequency selected when choosing parameters), the on_bar function will be called.

### Active Functions

**buy**: Buy to open position (Direction: LONG, Offset: OPEN)

**sell**: Sell to close position (Direction: SHORT, Offset: CLOSE)

**short**: Sell to open position (Direction: SHORT, Offset: OPEN)

**cover**: Buy to close position (Direction: LONG, Offset: CLOSE)

* Input parameters: price: float, volume: float, stop: bool = False, lock: bool = False, net: bool = False
* Output parameters: vt_orderids: List[vt_orderid] / None

buy/sell/short/cover are all trading request class functions responsible for sending orders inside the strategy. The strategy can send trading signals to the CTA strategy engine through these functions to achieve order placement.

### Functional Functions

**write_log**

* Input parameters: msg: str
* Output parameters: None

Calling the write_log function in the strategy can output logs of specified content.

**put_event**

* Input parameters: None
* Output parameters: None

Calling the put_event function in the strategy can notify the graphical interface to refresh strategy status-related displays.

**send_email**

* Input parameters: msg: str
* Output parameters: None

After configuring email-related information (configuration method can be found in the global configuration section of basic usage), calling the send_email function in the strategy can send emails with specified content to your own email.
