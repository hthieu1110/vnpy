"""
General constant enums used in the trading platform.
"""

from enum import Enum

from .locale import _


class Direction(Enum):
    """
    Direction of order/trade/position.
    """

    LONG = _("Long")
    SHORT = _("Short")
    NET = _("Net")


class Offset(Enum):
    """
    Offset of order/trade.
    """

    NONE = ""
    OPEN = _("Open")
    CLOSE = _("Close")
    CLOSETODAY = _("Close Today")
    CLOSEYESTERDAY = _("Close Yesterday")


class Status(Enum):
    """
    Order status.
    """

    SUBMITTING = _("Submitting")
    NOTTRADED = _("Not Traded")
    PARTTRADED = _("Partially Traded")
    ALLTRADED = _("All Traded")
    CANCELLED = _("Cancelled")
    REJECTED = _("Rejected")


class Product(Enum):
    """
    Product class.
    """

    EQUITY = _("Equity")
    FUTURES = _("Futures")
    OPTION = _("Option")
    INDEX = _("Index")
    FOREX = _("Forex")
    SPOT = _("Spot")
    ETF = "ETF"
    BOND = _("Bond")
    WARRANT = _("Warrant")
    SPREAD = _("Spread")
    FUND = _("Fund")
    CFD = "CFD"
    SWAP = _("Swap")


class OrderType(Enum):
    """
    Order type.
    """

    LIMIT = _("Limit")
    MARKET = _("Market")
    STOP = "STOP"
    FAK = "FAK"
    FOK = "FOK"
    RFQ = _("RFQ")
    ETF = "ETF"


class OptionType(Enum):
    """
    Option type.
    """

    CALL = _("Call")
    PUT = _("Put")


class Exchange(Enum):
    """
    Exchange.
    """

    # Vietnamese
    HOSE = "HOSE"  # Ho Chi Minh Stock Exchange
    HNX = "HNX"  # Ha Noi Stock Exchange
    UPCOM = "UPCOM"  # Vietnam Securities Depository
    VNEX = "VNEX"  # Vietnam Exchange - Includes both HOSE, HNX and UPCOM

    # Chinese
    CFFEX = "CFFEX"  # China Financial Futures Exchange
    SHFE = "SHFE"  # Shanghai Futures Exchange
    CZCE = "CZCE"  # Zhengzhou Commodity Exchange
    DCE = "DCE"  # Dalian Commodity Exchange
    INE = "INE"  # Shanghai International Energy Exchange
    GFEX = "GFEX"  # Guangzhou Futures Exchange
    SSE = "SSE"  # Shanghai Stock Exchange
    SZSE = "SZSE"  # Shenzhen Stock Exchange
    BSE = "BSE"  # Beijing Stock Exchange
    SHHK = "SHHK"  # Shanghai-HK Stock Connect
    SZHK = "SZHK"  # Shenzhen-HK Stock Connect
    SGE = "SGE"  # Shanghai Gold Exchange
    WXE = "WXE"  # Wuxi Steel Exchange
    CFETS = "CFETS"  # CFETS Bond Market Maker Trading System
    XBOND = "XBOND"  # CFETS X-Bond Anonymous Trading System

    # Global
    SMART = "SMART"  # Smart Router for US stocks
    NYSE = "NYSE"  # New York Stock Exchnage
    NASDAQ = "NASDAQ"  # Nasdaq Exchange
    ARCA = "ARCA"  # ARCA Exchange
    EDGEA = "EDGEA"  # Direct Edge Exchange
    ISLAND = "ISLAND"  # Nasdaq Island ECN
    BATS = "BATS"  # Bats Global Markets
    IEX = "IEX"  # The Investors Exchange
    AMEX = "AMEX"  # American Stock Exchange
    TSE = "TSE"  # Toronto Stock Exchange
    NYMEX = "NYMEX"  # New York Mercantile Exchange
    COMEX = "COMEX"  # COMEX of CME
    GLOBEX = "GLOBEX"  # Globex of CME
    IDEALPRO = "IDEALPRO"  # Forex ECN of Interactive Brokers
    CME = "CME"  # Chicago Mercantile Exchange
    ICE = "ICE"  # Intercontinental Exchange
    SEHK = "SEHK"  # Stock Exchange of Hong Kong
    HKFE = "HKFE"  # Hong Kong Futures Exchange
    SGX = "SGX"  # Singapore Global Exchange
    CBOT = "CBOT"  # Chicago Board of Trade
    CBOE = "CBOE"  # Chicago Board Options Exchange
    CFE = "CFE"  # CBOE Futures Exchange
    DME = "DME"  # Dubai Mercantile Exchange
    EUREX = "EUX"  # Eurex Exchange
    APEX = "APEX"  # Asia Pacific Exchange
    LME = "LME"  # London Metal Exchange
    BMD = "BMD"  # Bursa Malaysia Derivatives
    TOCOM = "TOCOM"  # Tokyo Commodity Exchange
    EUNX = "EUNX"  # Euronext Exchange
    KRX = "KRX"  # Korean Exchange
    OTC = "OTC"  # OTC Product (Forex/CFD/Pink Sheet Equity)
    IBKRATS = "IBKRATS"  # Paper Trading Exchange of IB

    # Special Function
    LOCAL = "LOCAL"  # For local generated data
    GLOBAL = "GLOBAL"  # For those exchanges not supported yet


class Currency(Enum):
    """
    Currency.
    """

    USD = "USD"
    HKD = "HKD"
    CNY = "CNY"
    CAD = "CAD"
    VND = "VND"


class Interval(Enum):
    """
    Interval of bar data.
    """

    MINUTE = "1m"
    HOUR = "1h"
    DAILY = "d"
    WEEKLY = "w"
    TICK = "tick"
