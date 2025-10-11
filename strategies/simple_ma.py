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


class MySimpleMaStrategy(CtaTemplate):
    """Simple Moving Average Crossover Strategy"""
    
    # Strategy parameters
    fast_ma: int = 10
    slow_ma: int = 20
    fixed_size: int = 1
    
    # Strategy variables
    fast_ma_value: float = 0.0
    slow_ma_value: float = 0.0

    parameters = [
        "fast_ma",
        "slow_ma",
        "fixed_size",
    ]
    
    variables = [
        "fast_ma_value",
        "slow_ma_value",
    ]

    def on_init(self) -> None:
        """
        Callback when strategy is inited.
        """
        self.write_log("Strategy initialized")
        
        self.bg = BarGenerator(self.on_bar)
        self.am = ArrayManager()
        
        # Load historical data for moving average calculation
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

        # Update bar to array manager
        am = self.am
        am.update_bar(bar)
        if not am.inited:
            return

        # Calculate moving averages
        fast_ma_array = am.sma(self.fast_ma, array=True)
        slow_ma_array = am.sma(self.slow_ma, array=True)
        
        self.fast_ma_value = fast_ma_array[-1]
        slow_ma_prev = slow_ma_array[-2]
        self.slow_ma_value = slow_ma_array[-1]
        fast_ma_prev = fast_ma_array[-2]

        # Generate trading signals based on MA crossover
        # Golden cross: fast MA crosses above slow MA -> Buy signal
        # Death cross: fast MA crosses below slow MA -> Sell signal
        
        cross_over = fast_ma_prev <= slow_ma_prev and self.fast_ma_value > self.slow_ma_value
        cross_below = fast_ma_prev >= slow_ma_prev and self.fast_ma_value < self.slow_ma_value

        if self.pos == 0:
            # No position, check for entry signals
            if cross_over:
                self.buy(bar.close_price, self.fixed_size)
            elif cross_below:
                self.short(bar.close_price, self.fixed_size)
                
        elif self.pos > 0:
            # Long position, check for exit signal
            if cross_below:
                self.sell(bar.close_price, abs(self.pos))
                
        elif self.pos < 0:
            # Short position, check for exit signal
            if cross_over:
                self.cover(bar.close_price, abs(self.pos))

        # Update GUI
        self.put_event()

    def on_order(self, order: OrderData) -> None:
        pass

    def on_trade(self, trade: TradeData) -> None:
        self.put_event()

    def on_stop_order(self, stop_order: StopOrder) -> None:
        pass
