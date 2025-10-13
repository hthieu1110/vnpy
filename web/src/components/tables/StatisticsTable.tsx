import { BacktestStatistics } from "@/types";
import { List, Table } from "antd";

interface StatisticsTableProps {
  statistics: BacktestStatistics;
}

const snakeToLabel = (key: string) => {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
};

export const StatisticsTable = (props: StatisticsTableProps) => {
  const data = Object.keys(props.statistics).map((key) => {
    return {
      indicator: snakeToLabel(key),
      value: props.statistics[key as keyof BacktestStatistics],
    };
  });

  const columns = [
    {
      title: "Indicator",
      dataIndex: "indicator",
      key: "indicator",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <List
      rowKey="indicator"
      dataSource={data}
      style={{
        maxHeight: 600,
        overflow: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#ccc transparent",
      }}
      renderItem={(item, idx) => (
        <List.Item
          style={{
            padding: "4px 0",
            display: "flex",
            flexDirection: "row",
            borderBottom: "none",
            backgroundColor: idx % 2 === 0 ? "#f6f6f6" : "transparent",
          }}
        >
          <span className="flex-1 text-right font-bold">{item.indicator}:</span>
          <span className="flex-3 text-left !ml-4">{item.value}</span>
        </List.Item>
      )}
    />
  );

  //   return (
  //     <Table dataSource={data} columns={columns} pagination={{ pageSize: 16 }} />
  //   );
};
