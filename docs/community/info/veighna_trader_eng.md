# VeighNa Trader

## Starting the Program

### Graphical Mode

After starting and logging into VeighNa Station, users can click the [Trading] button, check the required trading interfaces and application modules, and click the [Start] button to enter VeighNa Trader, as shown in the figure below:
![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/22.png)

### Script Mode

Find the run.py file in the examples/veighna_trader folder (not the one under veighna_studio, need to download source code from github). Run run.py to enter VeighNa Trader.

- Taking Win10 system as an example, users can hold [Shift] in the folder where run.py is located, right-click the mouse, select [Open PowerShell window here], in the pop-up window, enter the following command to start VeighNa Trader.
   ```bash
        python run.py
   ```
   ![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/3.png)

The successfully started VeighNa Trader is shown in the figure below:
![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/23.png)

## Connecting Interfaces

### SimNow Simulation

Taking using SimNow simulation trading account to login **CTP** interface as an example, click [System] -> [Connect CTP] in the menu bar of VeighNa Trader, and an account configuration window will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/gateway/1.png)

The requirements for filling in each field are as follows:
- Username: xxxxxx (6-digit pure number account)
- Password: xxxxxx (need to change password once for post-market testing)
- Broker Code: 9999 (SimNow default broker number)
- Trading Server: 180.168.146.187:10202 (intraday testing)
- Market Data Server: 180.168.146.187:10212 (intraday testing)
- Product Name: simnow_client_test
- Authorization Code: 0000000000000000 (16 zeros)

Please note that the username needs to be filled with InvestorID (6-digit pure number), not the account (phone number) when registering on Simnow website. In addition, Simnow registered accounts need to change the password once before they can login.

After successful connection, the VeighNa Trader main interface [Log] component will immediately output login-related information, and users can also see account information, position information, contract query and other related information. As shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/1.png)

## Contract Query

After successfully connecting to the trading interface, users can query contract information through the contract query function:
Click [Help] -> [Query Contracts] in the menu bar, in the pop-up dialog box, directly click the [Query] button in the upper right corner to query contract information (leave blank to query all contract price information), as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/spread_trading/3.png)

Please note that the IB interface cannot automatically obtain all contract information when logging in, and can only obtain it when users manually subscribe to market data. Therefore, you need to manually subscribe to contract market data on the main interface first to query contract information.

## Subscribe to Market Data

In the trading component, enter the exchange and contract code, press Enter to subscribe to market data. For example, when subscribing to stock index futures, fill in CFFEX for exchange and fill in the corresponding contract code IF2206.

After successful subscription, the trading component will display the contract name and show depth market quotes below, such as the latest price, bid price and ask price. The market data component will display the latest market information, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/24.png)

Please note that **the entered contract code needs to be consistent with what can be found in the [Help] -> [Query Contracts] function in the menu bar**.

## Order Trading

The trading component is used for manually initiating order trading. In addition to filling in the exchange and contract code, you also need to fill in the five fields shown in the figure below (direction, open/close, type, price, and quantity):

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/5.png)

Please note that if the order type is market order, the order price can be left blank; if the trading interface only supports one-way positions (interface position direction support details can be found in the trading interface section), the open/close direction can be left blank.

After sending an order, local will cache order-related information and display it in the [Orders] component and [Active] component. At this time, the order status is [Submitting].

After the exchange receives the order sent by the user, it will insert it into the central order book for matching and settlement, and push order reports to the user:
- If the order has not been filled yet, the [Orders] component and [Active] component will only update the time and order status fields, and the order status becomes [Unfilled];
- If the order is filled immediately, the order-related information will be removed from the [Active] component and added to the [Trades] component, and the order status becomes [Filled].

## Data Monitoring

Data monitoring consists of the following components and includes two auxiliary functions:

Select any of the following components, right-click the mouse to choose [Adjust Column Width] (especially suitable for lower screen resolution situations) or choose [Save Data] (CSV format), as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/12.png)

### Market Data Component

The market data component is used for real-time monitoring of subscribed market data, as shown in the figure below:

![](https://vnpy-community.oss-cn-shanghai.aliyuncs.com/forum_experience/yazhang/quick_start/subcribe_contract_module.png)

The market data component monitoring content includes the following parts:

- Contract Information: contract code, exchange, contract name;
- Market Information: latest price, trading volume, open price, high price, low price, close price, bid1 price, bid1 volume, ask1 price, ask1 volume;
- Other Information: data push time, interface.

### Active Component

The active component is used to store unfilled orders, such as limit orders or market orders that did not fill immediately. In this component, double-click any order with the mouse to complete order cancellation, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/15.png)

### Trades Component

The trades component is used to store filled orders. In this component, price, quantity, and time are all trade information pushed by the exchange, not order information, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/14.png)

### Orders Component

The orders component is used to store all order information sent by users. The order status can be submitting, cancelled, partially filled, filled, rejected, etc., as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/13.png)

### Positions Component

The positions component is used to record historical positions. Pay attention to the following field information.

- Direction: futures varieties have long/short directions, while stock varieties have [net] positions;
- Quantity: total position, i.e., today's position + yesterday's position;
- Yesterday's Position: its appearance derives from the need for SHFE's unique close today/close yesterday mode;
- Average Price: average price of historical trades (some huge orders may have multiple partial fills, requiring average price calculation);
- P&L: position P&L. For long positions, profit = current price - average price, for short positions it's the opposite.

If positions are closed and exited, position quantity is cleared to zero, floating P&L becomes realized P&L, thus affecting account balance changes. Therefore, the following fields: quantity, yesterday's position, frozen, average price, P&L are all 0, as shown in the figure below:

![](https://vnpy-community.oss-cn-shanghai.aliyuncs.com/forum_experience/yazhang/quick_start/query_position.png)

### Account Component

The account component displays basic account information, as shown in the figure below:

![](https://vnpy-community.oss-cn-shanghai.aliyuncs.com/forum_experience/yazhang/quick_start/query_account.png)

Pay attention to the following three field information:

- Available Funds: cash that can be used for orders
- Frozen: amount frozen by order operations (not the same concept as margin)
- Balance: total funds, i.e., available funds + margin + floating P&L

If all positions are closed, floating P&L becomes realized P&L, margin and floating P&L are cleared to zero, and total funds equal available funds.

### Log Component

The log component is used to display interface login information and order error information, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/cta_strategy/1.png)

## Application Modules

VeighNa officially provides ready-to-use quantitative trading application modules. When starting VeighNa Trader, check the required functional modules. After successful startup, click the [Function] button in the menu bar to display the checked functional modules, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/25.png)

## Global Configuration

Click the [Configuration] button on the menu bar of VeighNa Trader to pop up the [Global Configuration] window, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/20.png)

### GUI Interface

font.family and font.size parameters are used to configure the GUI interface. The meanings of each parameter are shown below:

- font.family: Set the font type of VeighNa Trader graphical interface. In addition to the default Arial font, it also supports Courier New and System fonts;

- font.size: Set the font size of VeighNa Trader graphical interface. Users can modify the font size according to their monitor's actual resolution.

### Log Output

log.active, log.level, log.console and log.file are used to configure log output. The meanings of each parameter are shown below:

- log.active: Control whether to start LogEngine, default is True. If this item is changed to False, then the subsequent parameters will all become invalid, and VeighNa Trader will no longer output logs or generate log files when running (can reduce some system delay);

- log.level: Control the log output level. Logs can be divided from light to severe into DEBUG, INFO, WARNING, ERROR, CRITICAL five levels, corresponding to integer values of 10, 20, 30, 40, 50 respectively. If the log level is lower than this setting value, it will be ignored. If you want to record more detailed system running information, it is recommended to lower the integer value;

- log.console: console refers to terminal, such as cmd and Powershell on Windows systems, and Terminal on Linux. When set to True, running scripts through terminal (need to register log event listeners) to start VeighNa Trader, log information will be output in the terminal; if starting VeighNa Trader directly through VeighNa Station, there will be no console output;

- log.file: This parameter is used to control whether to output logs to files. It is recommended to set to True, otherwise generated logs cannot be recorded.

The log files of VeighNa Trader are located in the .vntrader\log directory under the runtime directory by default, with the full path being:
```
C:\users\administrator\.vntrader\log
```

Where administrator is the current Windows system login username.

### Email Notification

Parameters prefixed with email are used to configure email. They can send email real-time notifications when specific events occur (such as order fills, data abnormalities). The meanings of each parameter are as follows:

- email.server: SMTP email server address, QQ email server address is filled in by default and can be used directly. If you need to use other emails, you need to find other server addresses yourself;
- email.port: SMTP email server port number, QQ email server port is filled in by default and can be used directly;
- email.username: Fill in the email address, such as xxxx@qq.com;
- email.password: For QQ email, this is not the email password, but an authorization code generated by the system after enabling SMTP;
- email.sender: Sender email name, same as email.username;
- email.receiver: Email address to receive emails.

### datafeed Data Service

Similar to database adapters, for data services there is a standardized BaseDatafeed interface (located in vnpy.trader.datafeed), implementing more flexible data service support. The specific field meanings are as follows:

- datafeed.name: The name of the data service interface, lowercase English letters of the full name;
- datafeed.username: The username for the data service;
- datafeed.password: The password for the data service.

The fields are shown in the figure:
![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/quick_start/17.png)

Currently supports seven datafeeds:
- [XT]
- [RQData]
- [Udata]
- [TuShare]
- [TQSDK]
- [Wind]
- [iFinD]
- [Tinysoft]

[XT]:https://github.com/vnpy/vnpy_xt
[RQData]:https://github.com/vnpy/vnpy_rqdata
[Udata]: https://github.com/vnpy/vnpy_udata
[TuShare]: https://github.com/vnpy/vnpy_tushare
[TQSDK]: https://github.com/vnpy/vnpy_tqsdk
[Wind]:https://github.com/vnpy/vnpy_wind
[iFinD]: https://github.com/vnpy/vnpy_ifind
[Tinysoft]: https://github.com/vnpy/vnpy_tinysoft

### Database

Parameters prefixed with database are used to configure database services. Currently, VeighNa supports eight databases: SQLite, MySQL, PostgreSQL, MongoDB, InfluxDB, DolphinDB, Arctic, and LevelDB. Specific configuration methods can be found in the database configuration section of the project documentation.
