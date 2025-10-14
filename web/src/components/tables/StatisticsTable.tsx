import { BacktestStatistics } from "@/types";
import { List } from "antd";
import { BACKTEST_FORM_HEIGHT } from "../forms/BacktestForm";

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
        height: `calc(100vh - ${BACKTEST_FORM_HEIGHT}px)`,
        overflow: "auto",
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
