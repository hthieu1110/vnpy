# Trading Interfaces

## Loading and Startup

### VeighNa Station Loading

After starting and logging into VeighNa Station, click the [Trading] button, and check the trading interface you want to use in the [Trading Interface] column of the configuration dialog.

### Script Loading

Taking the CTP interface as an example, add the following code in the startup script:

```python3
# Write at the top
from vnpy_ctp import CtpGateway

# Write after creating the main_engine object
main_engine.add_gateway(CtpGateway)
```

## Connecting Interfaces

Click [System] -> [Connect CTP] in the menu bar of the graphical operation interface VeighNa Trader, and a account configuration window will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/gateway/1.png)

Enter account, password and other related information to connect to the interface, and immediately perform query operations: such as querying account information, querying positions, querying order information, querying transaction information, etc. After successful query, you can see the output logs in the components of the main interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/gateway/5.png)

### Modify JSON Configuration File

Interface configuration related information is saved in JSON files, placed in the .vntrader folder under the user directory, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/gateway/3.png)

If you need to modify the interface configuration file, users can modify it either in the graphical interface VeighNa Trader or directly modify the corresponding JSON file in the .vntrader folder.

The advantage of separating the JSON configuration file from vnpy is: avoiding the need to reconfigure the JSON file every time you upgrade.

### View Tradeable Contracts

First log in to the interface, then click [Help] -> [Query Contracts] in the menu bar to pop up a blank [Query Contracts] window. Click the [Query] button to display the query results. Leave blank to query all contracts, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/gateway/4.png)

## Interface Categories

| Interface | Type |
| --------- | ---- |
| CTP | Futures, Futures Options (Live 6.5.1) |
| CTP Test | Futures, Futures Options (Test 6.5.1) |
| CTP Mini | Futures, Futures Options (Live 1.4) |
| FEMAS | Futures |
| CTP Options | ETF Options (Live 20190802) |
| Vertex Feichuang | ETF Options |
| Vertex HTS | ETF Options |
| HS UFT | Futures, ETF Options |
| Yisheng | Futures, Gold TD |
| Zhongtai XTP | A-shares, Margin Trading, ETF Options |
| Guotai Junan Unified Trading Gateway | A-shares |
| Huaxin Qidian Stocks | A-shares |
| Huaxin Qidian Options | ETF Options |
| Zhongyi Huida Comstar | Interbank Market |
| Dongfang Securities OST | A-shares |
| Interactive Brokers | Overseas Multi-varieties |
| Yisheng 9.0 Overseas | Overseas Futures |
| Direct Access Futures | Overseas Futures |
| Ronghang | Futures Asset Management |
| TTS | Futures |
| Feishu | Gold TD |
| Jinshida Gold | Gold TD |

## Interface Details

### CTP

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - Futures
  - Futures Options

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Broker Code:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

- Simulation Account: Obtained from the SimNow website. Just enter your mobile phone number and SMS verification (SMS verification can sometimes only be received during normal working hours on weekdays). SimNow username (InvestorID) is a 6-digit pure number, broker number is 9999, and provides two sets of environments for intraday simulation trading and post-market testing. You need to change the password once before you can use it. Please note that the applicable time periods for each simulation environment are different.

- Live Account: Open an account with a futures company, and you can activate it by contacting the account manager. The username is a pure number, and the broker number is also a 4-digit pure number (each futures company has a different broker number). In addition, live accounts can also activate simulation trading functions, and you also need to contact the account manager.

### CTPTEST (CTP Test)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - Futures
  - Futures Options

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Broker Code:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

Open an account with a futures company, and apply for penetration access testing from the futures company by contacting the account manager.

### MINI (CTP Mini)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - Futures
  - Futures Options

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Broker Code:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

Open an account with a futures company, and you can activate it by contacting the account manager. The username is a pure number, and the broker number is also a 4-digit pure number (each futures company has a different broker number). In addition, live accounts can also activate simulation trading functions, and you also need to contact the account manager.

### FEMAS (Feima)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - Futures

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Broker Code:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

Open an account with a futures company, and you can activate it by contacting the account manager. The username is a pure number, and the broker code is also a 4-digit pure number (each futures company has a different broker number). In addition, live accounts can also activate simulation trading functions, and you also need to contact the account manager.

### SOPT (CTP Options)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - ETF Options

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Broker Code:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

Open an account with a futures company, and you can activate it by contacting the account manager. The username is a pure number, and the broker code is also a 4-digit pure number (each futures company has a different broker code). In addition, live accounts can also activate simulation trading functions, and you also need to contact the account manager.

### SEC (Vertex Feichuang)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - ETF Options

- Position Direction
  - Stocks only support one-way positions
  - Stock options only support two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Account:
- Password:
- Market Data Address:
- Trading Address:
- Market Data Protocol: TCP, UDP
- Authorization Code:
- Product Number:
- Collection Type: Vertex, HS, JZ, JSD
- Market Data Compression: N, Y

#### Account Acquisition

Open an account with a futures company, and you can activate it by contacting the account manager.

### HTS (Vertex HTS)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - ETF Options

- Position Direction
  - Two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Account:
- Password:
- Market Data Address:
- Trading Address:
- Market Data Protocol: TCP, UDP
- Authorization Code:
- Product Number:
- Collection Type: Vertex, HS, JZ, JSD
- Market Data Compression: N, Y

#### Account Acquisition

Open an account with a futures company, and you can activate it by contacting the account manager.

### UFT (HS UFT)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - Futures
  - ETF Options

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Market Data Server:
- Trading Server:
- Server Type: Futures, ETF Options
- Product Name:
- Authorization Code:
- Order Type: q

#### Account Acquisition

Please apply for test accounts through Hengsheng Electronics.

### ESUNNY (Yisheng)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - Futures
  - Gold TD

- Position Direction
  - Supports two-way positions

- Historical Data
  - Not supported

#### Related Fields

- Market Data Account:
- Market Data Password:
- Market Data Server:
- Market Data Port: 0
- Market Data Authorization Code:
- Trading Account:
- Trading Password:
- Trading Server:
- Trading Port: 0
- Trading Product Name:
- Trading Authorization Code:
- Trading System: Domestic, Overseas

#### Account Acquisition

Please apply for test accounts through the Yisheng official website.

### XTP (Zhongtai Counter)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - A-shares
  - Margin Trading
  - ETF Options

- Position Direction
  - Stocks only support one-way positions
  - Other varieties support two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Account:
- Password:
- Customer Number: 1
- Market Data Address:
- Market Data Port: 0
- Trading Address:
- Trading Port: 0
- Market Data Protocol: TCP, UDP
- Log Level: FATAL, ERROR, WARNING, INFO, DEBUG, TRACE
- Authorization Code:

#### Account Acquisition

Please apply for test accounts through Zhongtai Securities.

#### Other Features

XTP is the first ultra-fast counter to provide margin trading.

### HFT (Guotai Junan Unified Trading Gateway)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - A-shares

- Position Direction
  - Only supports one-way positions

- Historical Data
  - Not provided

#### Related Fields

- Trading Username:
- Trading Password:
- Trading Server:
- Trading Port:
- Institution Code:
- Branch Code:
- Gateway:
- Market Data Username:
- Market Data Password:
- Market Data Server:
- Market Data Port:

#### Account Acquisition

Please apply for test accounts through Guotai Junan.

### TORASTOCK (Huaxin Qidian Stocks)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - A-shares

- Position Direction
  - Only supports one-way positions

- Historical Data
  - Not provided

#### Related Fields

- Account:
- Password:
- Market Data Server:
- Trading Server:
- Account Type: User Code, Fund Account
- Address Type: Front Address, FENS Address

#### Account Acquisition

Please apply for test accounts through Huaxin Securities.

### TORAOPTION (Huaxin Qidian Options)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - ETF Options

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Account:
- Password:
- Market Data Server:
- Trading Server:
- Account Type: User Code, Fund Account
- Address Type: Front Address, FENS Address

#### Account Acquisition

Please apply for test accounts through Huaxin Securities.

### COMSTAR (Zhongyi Huida)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - Interbank Market

- Position Direction
  - None

- Historical Data
  - Not provided

#### Related Fields

- Trading Server:
- Username:
- Password:
- Key:
- routing_type: 5
- valid_until_time: 18:30:00.000

#### Account Acquisition

Only available to large financial institutions (securities proprietary trading departments, bank financial market departments, etc.), not available to hedge funds or individuals. Requires purchasing ComStar's trading interface service before use.

### OST (Dongfang Securities)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - A-shares

- Position Direction
  - One-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Trading Server:
- SSE Snapshot Address:
- SSE Snapshot Port: 0
- SZSE Snapshot Address:
- SZSE Snapshot Port: 0
- Local IP Address:

#### Account Acquisition

Open an account with a securities company, and you can activate it by contacting the account manager.

### IB (Interactive Brokers)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu
  - Mac

- Trading Varieties
  - Overseas Multi-varieties

- Position Direction
  - Only supports one-way positions

- Historical Data
  - Provided

#### Related Fields

- TWS Address: 127.0.0.1
- TWS Port: 7497
- Customer Number: 1
- Trading Account:

#### Account Acquisition

After opening an account with Interactive Brokers and depositing funds, you can obtain API access permissions.

#### Other Features

Tradeable varieties cover many overseas markets including stocks, options, futures; relatively low commission fees.

Please note that IB interface contract codes are special. Please visit the official website's product query section to check. VeighNa Trader uses Interactive Brokers' unique identifier ConId for each contract in a specific exchange as the contract code, rather than Symbol or LocalName.

### TAP (Yisheng 9.0 Overseas)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - Overseas Futures

- Position Direction
  - Only supports one-way positions

- Historical Data
  - Not provided

#### Related Fields

- Market Data Account:
- Market Data Password:
- Market Data Server:
- Market Data Port: 0
- Trading Account:
- Trading Password:
- Trading Server:
- Trading Port: 0
- Authorization Code:

#### Account Acquisition

Please apply for test accounts through the Yisheng official website.

### DA (Direct Access Futures)

#### Interface Support

- Operating Systems
  - Windows

- Trading Varieties
  - Overseas Futures

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Trading Server:
- Market Data Server:
- Authorization Code:

#### Account Acquisition

After opening an account with Direct Access Futures and depositing funds, you can obtain API access permissions.

### ROHON (Ronghang)

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - Futures Asset Management

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Broker Code:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

Please apply for test accounts through Ronghang.

Please note that the [Broker Code] of the Ronghang interface is no longer in pure numeric form, but can contain English and numeric strings; VeighNa connecting to Ronghang for trading belongs to [Relay] mode in penetration certification, rather than [Direct] mode when connecting to counters (CTP, HS, etc.) for trading, so do not select the wrong option when filling out the penetration certification test form.

### TTS

#### Interface Support

- Operating Systems
  - Windows
  - Ubuntu

- Trading Varieties
  - Futures
  - Futures Options

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Broker Code:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

Please obtain through the OpenCTP platform.

### SGIT (Feishu)

#### Interface Support

- Operating Systems
  - Ubuntu

- Trading Varieties
  - Gold TD

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Trading Server:
- Market Data Server:
- Product Name:
- Authorization Code:

#### Account Acquisition

Please obtain through gold spot brokers.

### KSGOLD (Jinshida Gold)

#### Interface Support

- Operating Systems
  - Ubuntu

- Trading Varieties
  - Gold TD

- Position Direction
  - Only supports two-way positions

- Historical Data
  - Not provided

#### Related Fields

- Username:
- Password:
- Trading Server:
- Market Data Server:
- Account Type: Bank Account, Gold Account

#### Account Acquisition

Please obtain through gold spot brokers.
