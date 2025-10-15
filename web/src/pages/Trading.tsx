import { TradingForm } from "@/components/forms/TradingForm";
import { OrderDatasWidget } from "@/widgets/OrderDatasWidget";
import { PositionsWidget } from "@/widgets/PositionsWidget";
import { AccountsWidget } from "@/widgets/AccountsWidget";
import { QuotesTable } from "@/components/tables/QuotesTable";
import { useState } from "react";

export const Trading = () => {
  const [symbol, setSymbol] = useState<string>("");

  return (
    <div className="flex gap-4 flex-row">
      <div>
        <TradingForm layout="vertical" onSelectSymbol={setSymbol} />
        {symbol && <QuotesTable symbol={symbol} />}
      </div>
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
