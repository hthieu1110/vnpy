import { TradeData } from '@/types/object';
import { genColumns } from '@/utils/genColumns';
import { Table } from 'antd';

type TradesTableProps = {
  pageSize?: number;
  trades: TradeData[];
};

export const TradesTable = (props: TradesTableProps) => {
  const columns = genColumns(['datetime', 'orderid', 'tradeid', 'direction', 'offset', 'price', 'volume']);

  return (
    <Table dataSource={props.trades} columns={columns} pagination={{ pageSize: props.pageSize }} rowKey='tradeid' />
  );
};
