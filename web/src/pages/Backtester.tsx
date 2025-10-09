import { Button } from "antd";
import { useRegisterEvents } from "../hooks/useRegisterBacktesterEvents";
import { useBacktester } from "../hooks/useBacktester";

export const Backtester = () => {
  useRegisterEvents();    

  const { downloadData } = useBacktester();

  return (
    <div>
      <div className="text-lg !mb-4">Backtester</div>
      <Button onClick={downloadData}>Download Data for Backtesting</Button>
    </div>
  );
};
