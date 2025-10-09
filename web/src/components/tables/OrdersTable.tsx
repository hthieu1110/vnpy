import { OrderData } from "@/types/object";
import { genColumns } from "@/utils/genColumns";
import { Card, Table } from "antd";

type OrdersTableProps = {
  pageSize?: number;
  orders: OrderData[];
};

export const OrdersTable = (props: OrdersTableProps) => {
  const columns = genColumns([
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
    "datetime",
    // "reference",
  ]);

  return (
    <Card title="Orders">
      <Table
        dataSource={props.orders}
        columns={columns}
        pagination={{ pageSize: props.pageSize }}
        rowKey="orderid"
      />
    </Card>
  );
};
