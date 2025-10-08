import { rpcService } from '@/services/rpc';
import { useAppStore } from '@/store/useAppStore';
import { useDataStore } from '@/store/useDataStore';
import { CancelRequest, OrderData } from '@/types';
import { genColumns } from '@/utils/genColumns';
import { Button, Card, Table } from 'antd';
import { useMemo, useState } from 'react';

type OrderDatasWidgetProps = {
  pageSize?: number;
};

export const OrderDatasWidget = (props: OrderDatasWidgetProps) => {
  const gateway = useAppStore((state) => state.gateway);
  const orderDatas = useDataStore((state) => state.orderDatas);
  const dataActions = useDataStore((state) => state.actions);
  const sortedOrderDatas = useMemo(() => orderDatas.sort((a, b) => b.datetime - a.datetime), [orderDatas]);
  const [isCancelling, setIsCancelling] = useState(false);

  const columns = genColumns([
    'orderid',
    'symbol',
    'exchange',
    'type',
    'direction',
    // "offset",
    'price',
    'volume',
    'traded',
    'status',
    'datetime',
    // "reference",
  ]);

  const handleCancelOrder = async (orderData: OrderData) => {
    setIsCancelling(true);
    try {
      const req: CancelRequest = {
        orderid: orderData.orderid,
        symbol: orderData.symbol,
        exchange: orderData.exchange,
      };

      await rpcService.cancelOrder(req, gateway);
      dataActions.removeOrderData(orderData.orderid);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsCancelling(false);
    }
  };

  columns.push({
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    render: (_: string, _item: unknown) => {
      const orderData = _item as OrderData;
      if (orderData.status === 'All Traded' || orderData.status === 'Cancelled') {
        return null;
      }

      return (
        <Button
          variant='outlined'
          color='danger'
          onClick={() => handleCancelOrder(orderData)}
          loading={isCancelling}
        >
          Cancel
        </Button>
      );
    },
  });

  return (
    <Card title='Orders'>
      <Table
        dataSource={sortedOrderDatas}
        columns={columns}
        pagination={{ pageSize: props.pageSize }}
        rowKey='orderid'
      />
    </Card>
  );
};
