import { TradingForm } from "@/components/forms/TradingForm";
import { OrderDatasWidget } from "@/widgets/OrderDatasWidget";
import { PositionsWidget } from "@/widgets/PositionsWidget";
import { AccountsWidget } from "@/widgets/AccountsWidget";

export const Trading = () => {
  return (
    <div className="flex gap-4 flex-row">
      <TradingForm layout="vertical" />
      <div
        className="flex-1 flex flex-col gap-4"
        style={{ height: "calc(100vh - 76px)" }}
      >
        <OrderDatasWidget />
        <PositionsWidget />
        <AccountsWidget />
      </div>
    </div>
  );
};
