import { TradingForm } from "@/components/forms/TradingForm";
import { QuotesTable } from "@/components/tables/QuotesTable";
import { useState } from "react";
import { AccountsTable } from "@/components/tables/AccountsTable";
import { PositionsTable } from "@/components/tables/PositionsTable";
import { OrdersTableWithActions } from "@/components/tables/OrdersTableWithActions";

export const Trading = () => {
  const [symbol, setSymbol] = useState<string>("");

  return (
    <div className="flex gap-4 flex-row">
      <div>
        <TradingForm layout="vertical" onSelectSymbol={setSymbol} />
        {symbol && <QuotesTable symbol={symbol} />}
      </div>

      <div className="flex-1 flex flex-col gap-4" >
        <div style={{ height: "calc(100vh / 3)" }}>
          <OrdersTableWithActions />
        </div>

        <div style={{ height: 200 }}>
          <PositionsTable />
        </div>

        <div style={{ height: 200 }}>
          <AccountsTable searchColumn="accountid" />
        </div>
      </div>
    </div>
  );
};
