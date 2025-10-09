import { Button } from "antd";
import { useBacktester } from "../hooks/useBacktester";
import { useEffect } from "react";
import { backtesterEngineRpc } from "@/engineRpcs/backtesterEngineRpc";

export const Backtester = () => {
  const { startDownloadData, startBacktesting, isDownloading, isBacktesting } =
    useBacktester();

  useEffect(() => {
    backtesterEngineRpc.initEngine();
  }, []);

  return (
    <div>
      <div className="text-lg !mb-4">Backtester</div>
      <Button loading={isDownloading} onClick={startDownloadData}>
        Download Data for Backtesting
      </Button>
      <Button loading={isBacktesting} onClick={startBacktesting}>
        Start Backtesting
      </Button>
    </div>
  );
};
