import { useDataStore } from "@/stores/useDataStore";
import { genColumns } from "@/utils/genColumns";
import { Card, Table } from "antd";

type PositionsWidgetProps = {
  pageSize?: number;
}

export const PositionsWidget = (props: PositionsWidgetProps) => {
  const positions = useDataStore((state) => state.positions);
  
  const columns = genColumns([
    "symbol",
    "exchange",
    "direction",
    "volume",
    "frozen",
    "price",
    "pnl",
    "yd_volume",
  ]);

  return (
    <Card title="Positions">
      <Table dataSource={positions} columns={columns} pagination={{ pageSize: props.pageSize }} />
    </Card>
  );
};
