import ssl
from centrifuge import (
    Client,
    ErrorContext,
    PublicationContext,
    SubscribedContext,
    SubscriptionEventHandler,
    ClientEventHandler,
)
from typing import Callable

from vnpy.trader.gateway import BaseGateway
from vnpy.trader.logger import logger


async def _on_client_error(ctx: ErrorContext):
    logger.error(f"Client error: {ctx}")


async def _on_sub_error(ctx: ErrorContext):
    logger.error(f"Subscription error: {ctx}")


async def _on_subscribed(ctx: SubscribedContext):
    logger.info(f"Subscribed to channel: {ctx.channel}")

# Disable verification globally
ssl._create_default_https_context = ssl._create_unverified_context  

class HscSocketClient:
    def __init__(self, gateway: BaseGateway, centri_url: str, bearer_token: str, on_tick: Callable):
        self.gateway = gateway
        self.centri_url = centri_url
        self._client: Client = None
        self.bearer_token = bearer_token

        self.on_tick = on_tick

    async def start(self):
        events_handler = ClientEventHandler()
        events_handler.on_error = _on_client_error

        client = Client(
            self.centri_url,
            events=events_handler,
            token=self.bearer_token,
            # data={"token": self.bearer_token}
        )

        await client.connect()

        self._client = client
        self.gateway.write_log("Socket connected")

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
            token=self.bearer_token,
            # data={"token": self.bearer_token},
        )

        await sub.subscribe()

    async def stop(self):
        if self._client:
            await self._client.disconnect()
            self._client = None
