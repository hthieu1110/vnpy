import { OrderData } from "@/types/object";
import { useTableColumns } from "@/hooks/useTableColumns";
import { DataTable } from "../ui/DataTable";

type OrdersTableProps = {
  orders: OrderData[];
  title?: string;
  height?: number;
  excludes?: string[];
};

export const OrdersTable = (props: OrdersTableProps) => {
  let columns = useTableColumns([
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

  if (props.excludes) {
    columns = columns.filter((column) => !props.excludes.includes(column.dataIndex as string));
  }

  return <DataTable
    title={props.title}
    dataSource={props.orders}
    columns={columns}
    rowKey="orderid"
    height={props.height}
  />;
};