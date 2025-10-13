import { Table } from "antd";
import { OptimizationResult } from "@/types/object";

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
    },
  ];

  return (
    <Table
      rowKey={(record) => JSON.stringify(record.params)}
      dataSource={optimizationResults}
      columns={columns}
      pagination={{ pageSize: 16 }}
    />
  );
};
