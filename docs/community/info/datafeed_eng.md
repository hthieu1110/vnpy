# Data Services

For data services, VeighNa provides a standardized BaseDatafeed interface (located in vnpy.trader.datafeed), implementing more flexible data service support. In global configuration, fields related to data services are prefixed with datafeed.

The specific field meanings are as follows:
- datafeed.name: The name of the data service interface, must be lowercase English letters of the full name;
- datafeed.username: The username for the data service;
- datafeed.password: The password for the data service.

The above fields are required for all data services. If using token-based authorization, please fill in the datafeed.password field. Currently, VeighNa Trader supports the following seven data services. **For specific details of each data service, please refer to the corresponding project address**.

## XT (XunTou Research)

XT Research is a professional data service launched by Ruizhi Rongke Company, which should be a cost-effective choice for most individual investors:
- Project address: [vnpy_xt](https://github.com/vnpy/vnpy_xt)
- Data categories: Stocks, Futures, Options, Funds, Contract Information, Financial Information
- Data periods: Daily, Hourly, Minute, TICK (real-time updates)
- Registration: [XT Research](https://xuntou.net/#/signup?utm_source=vnpy)

## RQData

RiceQuant RQData is a cloud data service launched by RiceQuant Technology Company, providing extensive domestic financial market variety data support:
- Project address: [vnpy_rqdata](https://github.com/vnpy/vnpy_rqdata)
- Data categories: Stocks, Futures, Options, Funds, and Gold TD
- Data periods: Daily, Hourly, Minute, TICK (real-time updates)
- Registration: [RICEQUANT](https://www.ricequant.com/welcome/purchase?utm_source=vnpy)

**Please note that the username and password in the configuration information are not the account and password used for logging into the RiceQuant official website.**

## UData

Hengsheng UData is a cloud data service launched by Hengsheng Electronics, providing unlimited access to various financial data:
- Project address: [vnpy_udata](https://github.com/vnpy/vnpy_udata)
- Data categories: Stocks, Futures
- Data periods: Minute-level (updated after market close)
- Registration: [Hengsheng UData](https://udata.hs.net/home)

## TuShare

TuShare is a well-known domestic open-source Python financial data interface project, long-term developed and maintained by the Jimmy team. In addition to market data, it also provides many alternative data:
- Project address: [vnpy_tushare](https://www.github.com/vnpy/vnpy_tushare)
- Data categories: Stocks, Futures
- Data periods: Daily, Minute-level (updated after market close)
- Registration: [Tushare Big Data Community](https://tushare.pro/)

## TQSDK

Tianqin TQSDK is a Python programmatic trading solution launched by Xinyi Technology, providing historical data acquisition from the listing of currently tradeable contracts:
- Project address: [vnpy_tqsdk](https://github.com/vnpy/vnpy_tqsdk)
- Data categories: Futures
- Data periods: Minute-level (real-time updates)
- Registration: [Tianqin Quantitative - Xinyi Technology (shinnytech.com)](https://www.shinnytech.com/tianqin)

## Wind

Wind is already a standard configuration for practitioners working in domestic financial institutions. Whether it's stocks, bonds, or commodity market data, Wind has everything:
- Project address: [vnpy_wind](https://github.com/vnpy/vnpy_wind)
- Data categories: Futures
- Data periods: Minute-level (real-time updates)
- Registration: [Wind Financial Terminal](https://www.wind.com.cn/newsite/wft.html)

## iFinD

Tonghuashun iFinD is a financial data terminal launched by Tonghuashun Company for professional institutional users, and its market share has rapidly increased in recent years:
- Project address: [vnpy_ifind](https://github.com/vnpy/vnpy_ifind)
- Data categories: Futures
- Data periods: Minute-level (real-time updates)
- Registration: [iFinD Financial Data Terminal](http://www.51ifind.com/)

## Tinysoft

As a veteran domestic financial data company, Tianruan's core product [Tianruan .NET Financial Analysis Platform] (abbreviated as TinySoft) has accumulated a large number of users in securities research institutes and proprietary trading fields. When looking at securities financial engineering research reports, you often find data source notes in chart annotations stating "The above data comes from Tianruan":
- Project address: [vnpy_tinysoft](https://github.com/vnpy/vnpy_tinysoft)
- Data categories: Futures
- Data periods: Minute-level (real-time updates)
- Registration: [Tianruan .NET Financial Analysis Platform](http://www.tinysoft.com.cn/TSDN/HomePage.tsl)

Please note that because Tinysoft currently does not support Python 3.10, VeighNa Studio 3.0.0 does not provide Tinysoft support.

## Script Usage

Before using scripts, please first configure the data service according to the above instructions. When using, call the corresponding function interfaces (for specific interface support, please refer to the supported data periods mentioned above).

### Script Loading

#### Load required packages and data structures in scripts

```python3
from datetime import datetime
from vnpy.trader.constant import Exchange, Interval
from vnpy.trader.datafeed import get_datafeed
from vnpy.trader.object import HistoryRequest

# Get data service instance
datafeed = get_datafeed()
```

#### Get historical data at K-line level

```python3
req = HistoryRequest(
    # Contract code (example cu888 is RiceQuant continuous contract code, for demonstration only, please query data service providers for specific contract codes according to needs)
    symbol="cu888",
    # Exchange where the contract is traded
    exchange=Exchange.SHFE,
    # Historical data start time
    start=datetime(2019, 1, 1),
    # Historical data end time
    end=datetime(2021, 1, 20),
    # Data time granularity, default options are minute-level, hourly, and daily, specific selection needs to be combined with the data service permissions and requirements
    interval=Interval.DAILY
)

# Get K-line historical data
data = datafeed.query_bar_history(req)
```

#### Get tick-level historical data

Since tick data volume is large, please first refer to the above to confirm whether the data service provides tick data download services before downloading

```python3
req = HistoryRequest(
    # Contract code (example cu888 is RiceQuant continuous contract code, for demonstration only, please query data service providers for specific contract codes according to needs)
    symbol="cu888",
    # Exchange where the contract is traded
    exchange=Exchange.SHFE,
    # Historical data start time
    start=datetime(2019, 1, 1),
    # Historical data end time
    end=datetime(2021, 1, 20),
    # Data time granularity, for tick level
    interval=Interval.TICK
)

# Get tick historical data
data = datafeed.query_tick_history(req)
```
