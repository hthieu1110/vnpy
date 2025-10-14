import { TradeData } from "@/types/object";
import { genColumns } from "@/utils/genColumns";
import { Table } from "antd";
import { BACKTEST_FORM_HEIGHT } from "../forms/BacktestForm";

type TradesTableProps = {
  pageSize?: number;
  trades: TradeData[];
};

export const TradesTable = (props: TradesTableProps) => {
  const columns = genColumns([
    "datetime",
    "orderid",
    "tradeid",
    "direction",
    "offset",
    "price",
    "volume",
  ]);

  return (
    <Table
      dataSource={props.trades}
      columns={columns}
      pagination={false}
      rowKey="tradeid"
      sticky
      virtual
      scroll={{
        y: `calc(100vh - ${BACKTEST_FORM_HEIGHT}px)`,
        x: props.trades.length > 0 ? true : undefined,
      }}
      style={{
        tableLayout: "fixed",
      }}
    />
  );
};
