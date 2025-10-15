import { OrderData } from "@/types/object";
import { useTableColumns } from "@/hooks/useTableColumns";
import { DataTable } from "../ui/DataTable";

type OrdersTableProps = {
  pageSize?: number;
  orders: OrderData[];
};

export const OrdersTable = (props: OrdersTableProps) => {
  const columns = useTableColumns([
    ["datetime", 2],
    ["orderid", 1],
    ["symbol", 2],
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

  return <DataTable
    dataSource={props.orders}
    columns={columns}
    rowKey="orderid"
  />;
};