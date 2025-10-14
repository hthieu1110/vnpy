import { useDataStore } from "@/stores/useDataStore";
import { useTableColumns } from "@/hooks/useTableColumns";
import { Card, Table } from "antd";

type PositionsWidgetProps = {
  pageSize?: number;
};

export const PositionsWidget = (props: PositionsWidgetProps) => {
  const positions = useDataStore((state) => state.positions);

  const columns = useTableColumns([
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
      <Table
        dataSource={positions}
        columns={columns}
        pagination={props.pageSize ? { pageSize: props.pageSize } : false}
        rowKey={(record) =>
          record.symbol + record.exchange + record.direction + record.volume
        }
        sticky
        scroll={{
          y: "25vh",
          // x: "max-content",
        }}
        style={{
          tableLayout: "fixed",
        }}
      />
    </Card>
  );
};
