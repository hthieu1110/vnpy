# Market data client using Centrifugo
import asyncio
import json
import threading
from centrifuge import Client


class VNFutureSocketClient:
    def __init__(self, ws_url, on_tick):
        self.ws_url = ws_url
        self.on_tick = on_tick
        self._client = None
        self._stop = threading.Event()
        self._loop = None
        self._subscriptions = set()

    def start(self):
        t = threading.Thread(target=self._run_loop, daemon=True)
        t.start()

    def _run_loop(self):
        self._loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self._loop)
        self._loop.run_until_complete(self._run())

    async def _run(self):
        while not self._stop.is_set():
            try:
                self._client = Client(self.ws_url)

                # Set up message handler
                async def handle_message(message):
                    data = json.loads(message.data)
                    if data.get("type") == "tick":
                        self.on_tick(
                            {
                                "symbol": data["ticker"],
                                "datetime": data["ts"],
                                "last_price": data["lp"],
                                "volume": data.get("vol", 0),
                                "limit_up": data.get("u"),
                                "limit_down": data.get("d"),
                            }
                        )

                self._client.on_message = handle_message

                await self._client.connect()

                # Resubscribe to existing channels
                for symbol in self._subscriptions:
                    await self._client.subscribe(f"market.{symbol}")

                await self._client.wait()

            except Exception as e:
                print("Centrifugo error:", e)
                await asyncio.sleep(1)

    def subscribe(self, symbol: str):
        self._subscriptions.add(symbol)
        if self._client and self._client.connected:
            asyncio.run_coroutine_threadsafe(
                self._client.subscribe(f"Last.{symbol}"), self._loop
            )

    def stop(self):
        self._stop.set()
        if self._client:
            asyncio.run_coroutine_threadsafe(self._client.disconnect(), self._loop)
        if self._loop:
            self._loop.call_soon_threadsafe(self._loop.stop)
