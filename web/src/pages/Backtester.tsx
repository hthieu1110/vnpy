import { Button, Tabs, TabsProps, Card, Switch } from 'antd';
import { useBacktester } from '../hooks/useBacktester';
import { useEffect, useState } from 'react';
import { backtesterEngineRpc } from '@/engineRPCs/backtesterEngineRpc';
import { BarData, DailyResult, OrderData, TradeData } from '@/types/object';
import { OrdersTable } from '@/components/tables/OrdersTable';
import { TradesTable } from '@/components/tables/TradesTable';
import { BacktestForm } from '@/components/forms/BacktestForm';
import { usePrevious } from '@uidotdev/usehooks';
import { DailyPnLTable } from '@/components/tables/DailyPnLTable';
import { BacktestEchart } from '@/components/charts/BacktestEchart';
import { BacktestLightweightChart } from '@/components/charts/BacktestLightweightChart';
import { Strategy } from '@/types/object';
import { DailyPnLChart } from '@/components/charts/DailyPnLChart';
import { PnLDistributionChart } from '@/components/charts/PnLDistributionChart';

export const Backtester = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [dailyResults, setDailyResults] = useState<DailyResult[]>([]);
  const [barDatas, setBarDatas] = useState<BarData[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isShowConfig, setIsShowConfig] = useState(true);

  const { startDownloadData, startBacktesting, isDownloading, isBacktesting } = useBacktester();
  const prevIsBacktesting = usePrevious(isBacktesting);

  const initEngineAndLoadStrategies = async () => {
    await backtesterEngineRpc.initEngine();
    const strategies = await backtesterEngineRpc.customGetAllStrategies();
    setStrategies(strategies);
  };

  useEffect(() => {
    initEngineAndLoadStrategies();
  }, []);

  const tabItems: TabsProps['items'] = [
    {
      key: 'orders',
      label: 'Orders',
      children: <OrdersTable orders={orders} pageSize={16} />,
    },
    {
      key: 'trades',
      label: 'Trades',
      children: <TradesTable trades={trades} pageSize={16} />,
    },
    {
      key: 'daily_pnl',
      label: 'Daily PnL',
      children: <DailyPnLTable dailyResults={dailyResults} pageSize={16} />,
    },
    {
      key: 'daily_pnl_chart',
      label: 'Daily PnL Chart',
      children: <DailyPnLChart dailyResults={dailyResults} />,
    },
    {
      key: 'pnl_distribution',
      label: 'PnL Distribution',
      children: <PnLDistributionChart dailyResults={dailyResults} />,
    },
    {
      key: 'backtest_echart',
      label: 'Backtest EChart',
      children: <BacktestEchart barDatas={barDatas} trades={trades} />,
    },
    {
      key: 'backtest_lightweight_chart',
      label: 'Backtest Lightweight Chart',
      children: <BacktestLightweightChart barDatas={barDatas} trades={trades} />,
    },
  ];

  const handleOnChange = (key: string) => {
    console.log(key);
  };

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

    const filteredHistory = historyData.filter((c) => !(c.low_price < 115_000 || c.high_price > 125_000));

    setTrades(trades);
    setOrders(orders);
    setDailyResults(dailyResults);
    setBarDatas(filteredHistory);
  };

  useEffect(() => {
    if (prevIsBacktesting && !isBacktesting) {
      fetchOrdersAndTrades();
    }
  }, [isBacktesting, prevIsBacktesting]);

  return (
    <div>
      <Card title='Backtest Config' style={{ marginBottom: 8 }} extra={<Switch checked={isShowConfig} onChange={setIsShowConfig} />}>
        {isShowConfig && (
          <div>
            <BacktestForm strategies={strategies} />

            <div className='flex gap-4 items-center !mt-2'>
              <Button size='middle' color='orange' variant='solid' loading={isDownloading} onClick={startDownloadData}>
                Download Data
              </Button>

              <Button type='primary' size='middle' loading={isBacktesting || isDownloading} onClick={startBacktesting}>
                Start Backtesting
              </Button>
            </div>
          </div>
        )}
      </Card>

      {!isBacktesting && orders.length === 0 ? (
        <div className='text-lg text-center'>No backtest results</div>
      ) : (
        <Tabs defaultActiveKey='1' items={tabItems} onChange={handleOnChange} />
      )}
    </div>
  );
};
