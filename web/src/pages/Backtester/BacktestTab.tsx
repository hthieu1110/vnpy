import { BacktestEchart } from '@/components/charts/BacktestEchart';
import { DailyPnLChart } from '@/components/charts/DailyPnLChart';
import { PnLDistributionChart } from '@/components/charts/PnLDistributionChart';
import { DailyPnLTable } from '@/components/tables/DailyPnLTable';
import { OrdersTable } from '@/components/tables/OrdersTable';
import { StatisticsTable } from '@/components/tables/StatisticsTable';
import { TradesTable } from '@/components/tables/TradesTable';
import { backtesterEngineRpc } from '@/engineRpcs/backtesterEngineRpc';
import { useBacktester } from '@/hooks/useBacktester';
import { OrderData, TradeData, DailyResult, BarData, BacktestStatistics } from '@/types';
import { usePrevious } from '@uidotdev/usehooks';
import { Button, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';

const TabContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ height: 'calc(100vh - 325px)' }}>{children}</div>;
};

export const BacktestTab = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [statistics, setStatistics] = useState<BacktestStatistics>({} as BacktestStatistics);
  const [dailyResults, setDailyResults] = useState<DailyResult[]>([]);
  const [barDatas, setBarDatas] = useState<BarData[]>([]);
  const { isBacktesting, isDownloading, startBacktesting } = useBacktester();
  const prevIsBacktesting = usePrevious(isBacktesting);

  const tabItems: TabsProps['items'] = [
    {
      key: 'statistics',
      label: 'Statistics',
      children: (
        <TabContentWrapper>
          <StatisticsTable statistics={statistics} />
        </TabContentWrapper>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      children: (
        <TabContentWrapper>
          <OrdersTable orders={orders} />
        </TabContentWrapper>
      ),
    },
    {
      key: 'trades',
      label: 'Trades',
      children: (
        <TabContentWrapper>
          <TradesTable trades={trades} />
        </TabContentWrapper>
      ),
    },
    {
      key: 'daily_pnl',
      label: 'Daily PnL',
      children: (
        <TabContentWrapper>
          <DailyPnLTable dailyResults={dailyResults} />
        </TabContentWrapper>
      ),
    },
    {
      key: 'daily_pnl_chart',
      label: 'Daily PnL Chart',
      children: (
        <TabContentWrapper>
          <DailyPnLChart dailyResults={dailyResults} />
        </TabContentWrapper>
      ),
    },
    {
      key: 'pnl_distribution',
      label: 'PnL Distribution',
      children: (
        <TabContentWrapper>
          <PnLDistributionChart dailyResults={dailyResults} />
        </TabContentWrapper>
      ),
    },
    {
      key: 'backtest_echart',
      label: 'Backtest Chart',
      children: (
        <TabContentWrapper>
          <BacktestEchart barDatas={barDatas} trades={trades} />
        </TabContentWrapper>
      ),
    },
  ];

  const fetchOrdersAndTrades = async () => {
    const ordersPromise = backtesterEngineRpc.getAllOrders();
    const tradesPromise = backtesterEngineRpc.getAllTrades();
    const dailyResultsPromise = backtesterEngineRpc.getAllDailyResults();
    const historyDataPromise = backtesterEngineRpc.getHistoryData();
    const statisticsPromise = backtesterEngineRpc.getResultStatistics();

    const [orders, trades, dailyResults, historyData, statistics] = await Promise.all([
      ordersPromise,
      tradesPromise,
      dailyResultsPromise,
      historyDataPromise,
      statisticsPromise,
    ]);

    // const filteredHistory = historyData.filter(
    //   (c) => !(c.low_price < 115_000 || c.high_price > 125_000)
    // );

    setTrades(trades);
    setOrders(orders);
    setDailyResults(dailyResults);
    setBarDatas(historyData);
    setStatistics(statistics);
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
            type='primary'
            size='middle'
            loading={isBacktesting || isDownloading}
            onClick={startBacktesting}
            className='!mb-4'
          >
            Backtest
          </Button>
        ),
      }}
      tabPosition='left'
      defaultActiveKey='1'
      items={tabItems}
    />
  );
};
