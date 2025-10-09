import { useDataStore } from '@/store/useDataStore';
import { OrderData } from '@/types/object';
import { genColumns } from '@/utils/genColumns';
import { Button, Card, Table } from 'antd';
import { useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';

type OrderDatasWidgetProps = {
  pageSize?: number;
};

export const OrderDatasWidget = (props: OrderDatasWidgetProps) => {
  const orderDatas = useDataStore((state) => state.orderDatas);
  const sortedOrderDatas = useMemo(() => orderDatas.sort((a, b) => +b.orderid - +a.orderid), [orderDatas]);
  const { cancelOrderById, isOrderCancelling } = useOrders();
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

  columns.push({
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    render: (_: unknown, _item: unknown) => {
      const orderData = _item as OrderData;
      if (orderData.status === 'All Traded' || orderData.status === 'Cancelled') {
        return null;
      }

      return (
        <Button
          variant='outlined'
          color='danger'
          onClick={() => cancelOrderById(orderData.orderid)}
          loading={isOrderCancelling}
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
