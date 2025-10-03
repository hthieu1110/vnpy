from centrifuge import (
    ClientEventHandler,
    ConnectedContext,
    ConnectingContext,
    DisconnectedContext,
    ErrorContext,
    JoinContext,
    LeaveContext,
    PublicationContext,
    ServerJoinContext,
    ServerLeaveContext,
    ServerPublicationContext,
    ServerSubscribedContext,
    ServerSubscribingContext,
    ServerUnsubscribedContext,
    SubscribedContext,
    SubscribingContext,
    SubscriptionErrorContext,
    SubscriptionEventHandler,
    UnsubscribedContext,
)

from vnpy.trader.logger import logger


class DebugClientEventLoggerHandler(ClientEventHandler):
    async def on_connecting(self, ctx: ConnectingContext) -> None:
        logger.info(f"Client connecting: {ctx}")

    async def on_connected(self, ctx: ConnectedContext) -> None:
        logger.info(f"Client connected: {ctx}")

    async def on_disconnected(self, ctx: DisconnectedContext) -> None:
        logger.info(f"Client disconnected: {ctx}")

    async def on_error(self, ctx: ErrorContext) -> None:
        logger.error(f"Client error: {ctx}")

    async def on_subscribed(self, ctx: ServerSubscribedContext) -> None:
        logger.info(f"Client subscribed server-side sub: {ctx}")

    async def on_subscribing(self, ctx: ServerSubscribingContext) -> None:
        logger.info(f"Client subscribing server-side sub: {ctx}")

    async def on_unsubscribed(self, ctx: ServerUnsubscribedContext) -> None:
        logger.info(f"Client unsubscribed from server-side sub: {ctx}")

    async def on_publication(self, ctx: ServerPublicationContext) -> None:
        logger.info(f"Client publication from server-side sub: {ctx.pub.data}")

    async def on_join(self, ctx: ServerJoinContext) -> None:
        logger.info(f"Client join in server-side sub: {ctx}")

    async def on_leave(self, ctx: ServerLeaveContext) -> None:
        logger.info(f"Client leave in server-side sub: {ctx}")


class DebugSubscriptionEventLoggerHandler(SubscriptionEventHandler):
    async def on_subscribing(self, ctx: SubscribingContext) -> None:
        logger.info(f"Subscription subscribing: {ctx}")

    async def on_subscribed(self, ctx: SubscribedContext) -> None:
        logger.info(f"Subscription subscribed: {ctx}")

    async def on_unsubscribed(self, ctx: UnsubscribedContext) -> None:
        logger.info(f"Subscription unsubscribed: {ctx}")

    async def on_publication(self, ctx: PublicationContext) -> None:
        logger.info(f"Subscription publication: {ctx.pub.data}")

    async def on_join(self, ctx: JoinContext) -> None:
        logger.info(f"Subscription join: {ctx}")

    async def on_leave(self, ctx: LeaveContext) -> None:
        logger.info(f"Subscription leave: {ctx}")

    async def on_error(self, ctx: SubscriptionErrorContext) -> None:
        logger.error(f"Subscription error: {ctx}")
