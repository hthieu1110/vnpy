import { TradeData } from "@/types/object";
import { useTableColumns } from "@/hooks/useTableColumns";
import { DataTable } from "../ui/DataTable";

type TradesTableProps = {
  pageSize?: number;
  trades: TradeData[];
};

export const TradesTable = (props: TradesTableProps) => {
  const columns = useTableColumns([
    ['datetime', 2],
    "orderid",
    "tradeid",
    "direction",
    "offset",
    "price",
    "volume",
  ]);

  return <DataTable
    dataSource={props.trades}
    columns={columns}
    rowKey="tradeid"
  />;
};
