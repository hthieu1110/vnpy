import { Button, Tabs, TabsProps, Divider, Card } from 'antd';
import { useBacktester } from '../hooks/useBacktester';
import { useEffect, useState } from 'react';
import { backtesterEngineRpc } from '@/engineRPCs/backtesterEngineRpc';
import { OrderData, TradeData } from '@/types/object';
import { OrdersTable } from '@/components/tables/OrdersTable';
import { TradesTable } from '@/components/tables/TradesTable';
import { BacktestForm } from '@/components/forms/BacktestForm';
// import { useBacktesterStore } from '@/stores/useBacktesterStore';
import { usePrevious } from '@uidotdev/usehooks';

export const Backtester = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);

  // const { params, actions: backtesterActions } = useBacktesterStore();
  const { startDownloadData, startBacktesting, isDownloading, isBacktesting } = useBacktester();
  const prevIsBacktesting = usePrevious(isBacktesting);

  useEffect(() => {
    backtesterEngineRpc.initEngine();
  }, []);

  const tabItems: TabsProps['items'] = [
    {
      key: 'orders',
      label: 'Orders',
      children: <OrdersTable orders={orders} pageSize={10} />,
    },
    {
      key: 'trades',
      label: 'Trades',
      children: <TradesTable trades={trades} pageSize={10} />,
    },
  ];

  const handleOnChange = (key: string) => {
    console.log(key);
  };

  const fetchOrdersAndTrades = async () => {
    const ordersPromise = backtesterEngineRpc.getAllOrders();
    const tradesPromise = backtesterEngineRpc.getAllTrades();
    const [orders, trades] = await Promise.all([ordersPromise, tradesPromise]);
    setTrades(trades);
    setOrders(orders);
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

        <div className='flex gap-4 items-center justify-center'>
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
