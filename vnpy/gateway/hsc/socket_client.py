from centrifuge import (
    Client,
    ErrorContext,
    PublicationContext,
    SubscribedContext,
    SubscriptionEventHandler,
    ClientEventHandler,
)
from typing import Callable

from vnpy.trader.logger import logger

from .utils import socket_log


async def _on_client_error(ctx: ErrorContext):
    logger.error(f"Client error: {ctx}")


async def _on_sub_error(ctx: ErrorContext):
    logger.error(f"Subscription error: {ctx}")


async def _on_subscribed(ctx: SubscribedContext):
    logger.info(f"Subscribed to channel: {ctx.channel}")


class HscSocketClient:
    def __init__(self, centri_url: str, on_tick: Callable):
        self.centri_url = centri_url
        self._client: Client = None

        self.on_tick = on_tick

    @socket_log
    async def start(self):
        events_handler = ClientEventHandler()
        events_handler.on_error = _on_client_error

        client = Client(
            self.centri_url,
            events=events_handler,
        )

        await client.connect()

        self._client = client

    def _enhanced_on_tick(self, symbol: str, ctx: PublicationContext):
        ctx.pub.data["symbol"] = symbol
        self.on_tick(ctx.pub.data)

    async def subscribe(self, symbol: str):
        if self._client is None:
            raise Exception("Client not connected")

        events_handler = SubscriptionEventHandler()

        async def _on_publication(ctx: PublicationContext):
            ctx.pub.data["symbol"] = symbol
            self.on_tick(ctx.pub.data)

        events_handler.on_publication = _on_publication
        events_handler.on_error = _on_sub_error
        events_handler.on_subscribed = _on_subscribed

        sub = self._client.new_subscription(
            "Last." + symbol,
            events=events_handler,
            recoverable=True,  # seems that this is set by server
        )

        await sub.subscribe()

    async def stop(self):
        if self._client:
            await self._client.disconnect()
            self._client = None
