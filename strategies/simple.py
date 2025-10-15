from vnpy_ctastrategy import (
    CtaTemplate,
    StopOrder,
    TickData,
    BarData,
    TradeData,
    OrderData,
    BarGenerator,
    ArrayManager,
)


class MySimpleStrategy(CtaTemplate):
    # Strategy parameters
    buy_threshold: int = 220
    sell_threshold: int = 213
    fixed_size: int = 1

    parameters = [
        "buy_threshold",
        "sell_threshold",
        "fixed_size",
    ]

    variables = [
        "buy_threshold_value",
        "sell_threshold_value",
    ]

    def on_init(self) -> None:
        self.write_log("Strategy initialized")

        self.bg = BarGenerator(self.on_bar)
        self.am = ArrayManager()

        self.load_bar(10)

    def on_start(self) -> None:
        self.write_log("Strategy started")

    def on_stop(self) -> None:
        self.write_log("Strategy stopped")

    def on_tick(self, tick: TickData) -> None:
        self.bg.update_tick(tick)

    def on_bar(self, bar: BarData) -> None:
        # Cancel all pending orders
        self.cancel_all()

        if self.pos == 0:
            if bar.close_price > self.buy_threshold:
                self.buy(bar.close_price, self.fixed_size)

        elif self.pos > 0:
            if bar.close_price < self.sell_threshold:
                self.sell(bar.close_price, abs(self.pos))

        # Update GUI
        self.put_event()

    def on_order(self, order: OrderData) -> None:
        pass

    def on_trade(self, trade: TradeData) -> None:
        self.put_event()

    def on_stop_order(self, stop_order: StopOrder) -> None:
        pass
