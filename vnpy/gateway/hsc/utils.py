import traceback
from vnpy.trader.logger import logger


def gateway_log(func):
    def wrapper(*args, **kwargs):
        # first argument is self
        s = args[0]

        logger.info(f"Gateway {s.gateway_name} {func.__name__}...")
        res = func(*args, **kwargs)
        logger.info(f"Gateway {s.gateway_name} {func.__name__} done")
        return res

    return wrapper


def socket_log(func):
    async def wrapper(*args, **kwargs):
        logger.info(f"SocketClient {func.__name__}...")
        res = await func(*args, **kwargs)
        logger.info(f"SocketClient {func.__name__} done")
        return res

    return wrapper


def handle_future(fut):
    try:
        fut.result()
    except Exception as e:
        logger.error(f"Async task failed: {e}")
        # traceback.print_exc()
