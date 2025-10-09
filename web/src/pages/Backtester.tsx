import { Button, Tabs, TabsProps } from "antd";
import { useBacktester } from "../hooks/useBacktester";
import { useEffect, useState } from "react";
import { backtesterEngineRpc } from "@/engineRPCs/backtesterEngineRpc";
import { OrderData, TradeData } from "@/types/object";
import { OrdersTable } from "@/components/tables/OrdersTable";
import { TradesTable } from "@/components/tables/TradesTable";
import { BacktestForm } from "@/components/forms/BacktestForm";

export const Backtester = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);

  const { startDownloadData, startBacktesting, isDownloading, isBacktesting } =
    useBacktester();

  useEffect(() => {
    backtesterEngineRpc.initEngine();
  }, []);

  const tabItems: TabsProps["items"] = [
    {
      key: "trades",
      label: "Trades",
      children: <TradesTable trades={trades} pageSize={10} />,
    },
    {
      key: "orders",
      label: "Orders",
      children: <OrdersTable orders={orders} pageSize={10} />,
    },
  ];

  const handleOnChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <div>
        <div className="text-lg !mb-4">Backtester</div>

        <BacktestForm />

        <Button loading={isDownloading} onClick={startDownloadData}>
          Download Data for Backtesting
        </Button>
        <Button loading={isBacktesting} onClick={startBacktesting}>
          Start Backtesting
        </Button>

        <Button
          onClick={async () => {
            const orders = await backtesterEngineRpc.getAllOrders();
            const trades = await backtesterEngineRpc.getAllTrades();
            setTrades(trades);
            setOrders(orders);
          }}
        >
          Get All Orders
        </Button>
      </div>

      <Tabs defaultActiveKey="1" items={tabItems} onChange={handleOnChange} />
    </div>
  );
};
