from enum import Enum
from vnpy.trader.constant import OrderType, Product, Status

HSC_GATEWAY_NAME = "HSC_FUTURES"

ORDER_TYPE_MAP = {
    OrderType.LIMIT: "LO",
}

STATUS_MAP = {
    "OUTSTANDING": Status.SUBMITTING,
    "COMPLETED": Status.ALLTRADED,
    "CANCELLED": Status.CANCELLED,
    "PARTIAL_FILLED": Status.PARTTRADED,
    "REJECTED": Status.REJECTED,
}

PRODUCT_MAP = {
    "Derivatives": Product.FUTURES,
    "ETF": Product.ETF,
    "Bond": Product.BOND,
    "Fund": Product.FUND,
    "Stock": Product.EQUITY,
    "BondFutures": Product.BOND,
    "CoveredWarrant": Product.WARRANT,
}


class NoneEnum(Enum):
    NONE = "N/A"


class OrderStatus(Enum):
    OUTSTANDING = "Outstanding"
    REJECTED = "Rejected"
    FULLY_FILLED = "Fully Filled"
    PARTIAL_FILLED = "Partial Filled"
    COMPLETED = "Completed"
