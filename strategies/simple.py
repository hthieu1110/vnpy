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
    fixed_size: float = 1
    ma_period: int = 30

    parameters = [
        "fixed_size",
        "ma_period",
    ]

    def on_init(self) -> None:
        self.write_log("Strategy initialized")

        self.bg = BarGenerator(self.on_bar)
        self.am = ArrayManager()

        self.load_bar(days=10)

    def on_start(self) -> None:
        self.write_log("Strategy started")

    def on_stop(self) -> None:
        self.write_log("Strategy stopped")

    def on_tick(self, tick: TickData) -> None:
        self.bg.update_tick(tick)

    def on_bar(self, bar: BarData) -> None:
        # Cancel all pending orders
        self.cancel_all()

        last_sma = self.am.sma(self.ma_period)

        if self.pos == 0:
            if bar.close_price > last_sma:
                self.buy(bar.close_price, self.fixed_size)

        elif self.pos > 0:
            if bar.close_price < last_sma:
                self.sell(bar.close_price, self.fixed_size)

        # Update GUI
        self.put_event()

    def on_order(self, order: OrderData) -> None:
        pass

    def on_trade(self, trade: TradeData) -> None:
        self.put_event()

    def on_stop_order(self, stop_order: StopOrder) -> None:
        pass
