from vnpy_datafeed import DatafeedClient

client = DatafeedClient()
client.init(
    name="BINANCE",
    username="bTVoA301STi0t8HSPajvfEop6ofpGR4QU6bv1miQGDetmBZmdmq7f2c3wTXOS4bU",
    password="gG7ZZFPwdRCDRRASnp79er6pAlsRXqGiwgVvoB1kBHJEmJ12jNsslt2q67skb52o"
)

bars = client.query_bar_history(
    symbol="BTCUSDT",
    exchange=Exchange.BINANCE,
    interval="1m",
    start=datetime(2023, 1, 1),
    end=datetime(2023, 1, 5),
)