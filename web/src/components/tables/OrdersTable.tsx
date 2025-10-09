import { OrderData } from '@/types/object';
import { genColumns } from '@/utils/genColumns';
import { Table } from 'antd';

type OrdersTableProps = {
  pageSize?: number;
  orders: OrderData[];
};

export const OrdersTable = (props: OrdersTableProps) => {
  const columns = genColumns([
    'datetime',
    'orderid',
    'symbol',
    // 'exchange',
    'type',
    'direction',
    // "offset",
    'price',
    'volume',
    'traded',
    'status',
    // "reference",
  ]);

  return (
    <Table dataSource={props.orders} columns={columns} pagination={{ pageSize: props.pageSize }} rowKey='orderid' />
  );
};
