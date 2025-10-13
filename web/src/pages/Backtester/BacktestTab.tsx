import { BacktestEchart } from "@/components/charts/BacktestEchart";
import { DailyPnLChart } from "@/components/charts/DailyPnLChart";
import { PnLDistributionChart } from "@/components/charts/PnLDistributionChart";
import { DailyPnLTable } from "@/components/tables/DailyPnLTable";
import { OrdersTable } from "@/components/tables/OrdersTable";
import { TradesTable } from "@/components/tables/TradesTable";
import { backtesterEngineRpc } from "@/engineRpcs/backtesterEngineRpc";
import { useBacktester } from "@/hooks/useBacktester";
import { OrderData, TradeData, DailyResult, BarData } from "@/types";
import { usePrevious } from "@uidotdev/usehooks";
import { Button, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";

export const BacktestTab = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [dailyResults, setDailyResults] = useState<DailyResult[]>([]);
  const [barDatas, setBarDatas] = useState<BarData[]>([]);
  const { isBacktesting, isDownloading, startBacktesting } = useBacktester();
  const prevIsBacktesting = usePrevious(isBacktesting);

  const tabItems: TabsProps["items"] = [
    {
      key: "orders",
      label: "Orders",
      children: <OrdersTable orders={orders} pageSize={16} />,
    },
    {
      key: "trades",
      label: "Trades",
      children: <TradesTable trades={trades} pageSize={16} />,
    },
    {
      key: "daily_pnl",
      label: "Daily PnL",
      children: <DailyPnLTable dailyResults={dailyResults} pageSize={16} />,
    },
    {
      key: "daily_pnl_chart",
      label: "Daily PnL Chart",
      children: <DailyPnLChart dailyResults={dailyResults} />,
    },
    {
      key: "pnl_distribution",
      label: "PnL Distribution",
      children: <PnLDistributionChart dailyResults={dailyResults} />,
    },
    {
      key: "backtest_echart",
      label: "Backtest Chart",
      children: <BacktestEchart barDatas={barDatas} trades={trades} />,
    },
  ];

  const fetchOrdersAndTrades = async () => {
    const ordersPromise = backtesterEngineRpc.getAllOrders();
    const tradesPromise = backtesterEngineRpc.getAllTrades();
    const dailyResultsPromise = backtesterEngineRpc.getAllDailyResults();
    const historyDataPromise = backtesterEngineRpc.getHistoryData();
    
    const [orders, trades, dailyResults, historyData] = await Promise.all([
      ordersPromise,
      tradesPromise,
      dailyResultsPromise,
      historyDataPromise,
    ]);

    // const filteredHistory = historyData.filter(
    //   (c) => !(c.low_price < 115_000 || c.high_price > 125_000)
    // );

    setTrades(trades);
    setOrders(orders);
    setDailyResults(dailyResults);
    setBarDatas(historyData);
  };

  useEffect(() => {
    if (prevIsBacktesting && !isBacktesting) {
      fetchOrdersAndTrades();
    }
  }, [isBacktesting, prevIsBacktesting]);

  return (
    <Tabs
      tabBarExtraContent={{
        left: (
          <Button
            type="primary"
            size="middle"
            loading={isBacktesting || isDownloading}
            onClick={startBacktesting}
            className="!mb-4"
          >
            Run Backtest
          </Button>
        ),
      }}
      tabPosition="left"
      defaultActiveKey="1"
      items={tabItems}
      onChange={() => {}}
    />
  );
};
