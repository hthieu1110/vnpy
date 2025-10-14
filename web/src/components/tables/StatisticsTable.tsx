import { BacktestStatistics } from "@/types";
import { List } from "antd";

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

  return (
    <List
      rowKey="indicator"
      dataSource={data}
      style={{
        height: "calc(100vh - 400px)",
        overflow: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#ccc transparent",
        border: "1px solid red",
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
};
