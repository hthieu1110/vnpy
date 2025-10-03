from vnpy.trader.constant import Product


def get_contract_size(ticker_ref: dict) -> float:
    if ticker_ref["stock_type"] == "Stock":
        return 1
    elif ticker_ref["stock_type"] == "Derivatives":
        return 100_000
    else:
        return 1_000_000  # if unknown then return big number to block


def get_contract_pricetick(ticker_ref: dict) -> float:
    if ticker_ref["stock_type"] == "Derivatives":
        return 0.1
    elif ticker_ref["exchange"] == "HOSE":
        return 100
    elif ticker_ref["exchange"] == "HASTC":
        return 0.1
    else:
        return 1_000_000  # if unknown then return big number to block
