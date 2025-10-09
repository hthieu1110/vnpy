import { Button, Tabs, TabsProps, Card } from 'antd';
import { useBacktester } from '../hooks/useBacktester';
import { useEffect, useState } from 'react';
import { backtesterEngineRpc } from '@/engineRPCs/backtesterEngineRpc';
import { DailyResult, OrderData, TradeData } from '@/types/object';
import { OrdersTable } from '@/components/tables/OrdersTable';
import { TradesTable } from '@/components/tables/TradesTable';
import { BacktestForm } from '@/components/forms/BacktestForm';
import { usePrevious } from '@uidotdev/usehooks';
import { DailyResultsTable } from '@/components/tables/DailyResultsTable';

export const Backtester = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [dailyResults, setDailyResults] = useState<DailyResult[]>([]);

  const { startDownloadData, startBacktesting, isDownloading, isBacktesting } = useBacktester();
  const prevIsBacktesting = usePrevious(isBacktesting);

  useEffect(() => {
    backtesterEngineRpc.initEngine();
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
      key: 'daily_results',
      label: 'Daily Results',
      children: <DailyResultsTable dailyResults={dailyResults} pageSize={16} />,
    },
  ];

  const handleOnChange = (key: string) => {
    console.log(key);
  };

  const fetchOrdersAndTrades = async () => {
    const ordersPromise = backtesterEngineRpc.getAllOrders();
    const tradesPromise = backtesterEngineRpc.getAllTrades();
    const dailyResultsPromise = backtesterEngineRpc.getAllDailyResults();
    const [orders, trades, dailyResults] = await Promise.all([ordersPromise, tradesPromise, dailyResultsPromise]);
    setTrades(trades);
    setOrders(orders);
    setDailyResults(dailyResults);
  };

  useEffect(() => {
    if (prevIsBacktesting && !isBacktesting) {
      fetchOrdersAndTrades();
    }
  }, [isBacktesting, prevIsBacktesting]);

  return (
    <div>
      <Card>
        <BacktestForm />

        <div className='flex gap-4 items-center'>
          <Button size='middle' color='orange' variant='solid' loading={isDownloading} onClick={startDownloadData}>
            Download Data
          </Button>

          <Button type='primary' size='middle' loading={isBacktesting || isDownloading} onClick={startBacktesting}>
            Start Backtesting
          </Button>
        </div>
      </Card>

      <Tabs defaultActiveKey='1' items={tabItems} onChange={handleOnChange} />
    </div>
  );
};
