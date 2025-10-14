import { Table } from "antd";
import { OptimizationResult } from "@/types/object";
import { BACKTEST_FORM_HEIGHT } from "../forms/BacktestForm";

interface OptimizationResultsTableProps {
  optimizationResults: OptimizationResult[];
}

export const OptimizationResultsTable = (
  props: OptimizationResultsTableProps
) => {
  const { optimizationResults } = props;

  const columns = [
    {
      title: "Parameter",
      dataIndex: "params",
      key: "params",
      render: (value: Record<string, number>) => {
        return JSON.stringify(value);
      },
    },
    {
      title: "Target Value",
      dataIndex: "target_value",
      key: "target_value",
      sorter: (a: OptimizationResult, b: OptimizationResult) => a.target_value - b.target_value,
    },
  ];

  return (
    <Table
      rowKey={(record) => JSON.stringify(record.params)}
      dataSource={optimizationResults}
      columns={columns}
      pagination={false}
      style={{
        height: `calc(100vh - ${BACKTEST_FORM_HEIGHT}px)`,
        overflow: "auto",
      }}
    />
  );
};
