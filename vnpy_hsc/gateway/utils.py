from asyncio import Future
import asyncio
from typing import Callable
from vnpy.trader.gateway import BaseGateway
from vnpy.trader.logger import logger


def async_run(
    gateway: BaseGateway,
    loop: asyncio.AbstractEventLoop,
    coro: asyncio.Future, 
    callback: Callable = None, 
    success_msg: str = None
):
    async def wrapper():
        res = await coro
        if callback:
            callback(res)
        if success_msg:
            gateway.write_log(success_msg)

    try:
        fut = asyncio.run_coroutine_threadsafe(wrapper(), loop)
        fut.result()
    except Exception as e:
        msg = f"Async task failed: {e}"
        logger.error(msg)
        gateway.write_log(msg)