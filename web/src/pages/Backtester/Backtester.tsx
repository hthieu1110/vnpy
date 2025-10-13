import { Button, Tabs, TabsProps, Card, Switch } from "antd";
import { useBacktester } from "../../hooks/useBacktester";
import { useEffect, useState } from "react";
import { backtesterEngineRpc } from "@/engineRpcs/backtesterEngineRpc";
import { BacktestForm } from "@/components/forms/BacktestForm";
import { Strategy } from "@/types/object";
import { BacktestTab } from "./BacktestTab";
import { OptimizationTab } from "./OptimizationTab";

export const Backtester = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isShowConfig, setIsShowConfig] = useState(true);

  const { startDownloadData, isDownloading } = useBacktester();

  const initEngineAndLoadStrategies = async () => {
    await backtesterEngineRpc.initEngine();
    const strategies = await backtesterEngineRpc.customGetAllStrategies();
    setStrategies(strategies);
  };

  useEffect(() => {
    initEngineAndLoadStrategies();
  }, []);

  const tabItems: TabsProps["items"] = [
    {
      key: "backtest",
      label: "Backtest",
      children: <BacktestTab />,
    },
    {
      key: "optimization",
      label: "Optimization",
      children: <OptimizationTab />,
    },
  ];

  return (
    <div>
      <Card
        title="Backtest Config"
        style={{ marginBottom: 8 }}
        extra={<Switch checked={isShowConfig} onChange={setIsShowConfig} />}
      >
        {isShowConfig && <BacktestForm strategies={strategies} />}
      </Card>

      <Tabs
        tabBarExtraContent={{
          right: (
            <Button
              size="middle"
              variant="solid"
              color="green"
              loading={isDownloading}
              onClick={startDownloadData}
            >
              Download Data
            </Button>
          ),
        }}
        defaultActiveKey="1"
        centered
        items={tabItems}
      />
    </div>
  );
};
