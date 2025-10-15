import { OrderData } from "@/types/object";
import { useTableColumns } from "@/hooks/useTableColumns";
import { Table } from "antd";
import { BACKTEST_FORM_HEIGHT } from "../forms/BacktestForm";

type OrdersTableProps = {
  pageSize?: number;
  orders: OrderData[];
};

export const OrdersTable = (props: OrdersTableProps) => {
  const columns = useTableColumns([
    "datetime",
    "orderid",
    "symbol",
    // 'exchange',
    "type",
    "direction",
    // "offset",
    "price",
    "volume",
    "traded",
    "status",
    // "reference",
  ]);

  return (
    <Table
      dataSource={props.orders}
      columns={columns}
      pagination={false}
      rowKey="orderid"
      sticky
      scroll={{
        y: `calc(100vh - ${BACKTEST_FORM_HEIGHT}px)`,
        x: props.orders.length > 0 ? true : undefined,
      }}
      style={{
        tableLayout: "fixed",
      }}
    />
  );
};
