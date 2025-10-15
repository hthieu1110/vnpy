import { useDataStore } from "@/stores/useDataStore";
import { TickData } from "@/types";
import { Card } from "antd";
import { useMemo } from "react";

interface QuotesTableProps {
  symbol: string;
}

const getByKey = (
  tick: TickData,
  key: string,
  id: number,
  precision: number = 2
) => {
  /** @ts-expect-error: ignore type error */
  return Math.round(tick[`${key}_${id}`] * 10 ** precision) / 10 ** precision;
};

const getValByKey = (
  tick: TickData,
  key: string,
  id: number,
  precision: number = 2
) => {
  return (
    Math.round(
      /** @ts-expect-error: ignore type error */
      tick[`${key}_price_${id}`] * tick[`${key}_volume_${id}`] * 10 ** precision
    ) /
    10 ** precision
  );
};

export const QuotesTable = (props: QuotesTableProps) => {
  const { symbol } = props;
  const ticks = useDataStore((state) => state.ticks);
  const tick = useMemo(
    () => ticks.find((tick) => tick.symbol === symbol),
    [ticks, symbol]
  );

  if (!tick) {
    return null;
  }

  const updatedAt = new Date(tick.localtime * 1000);

  return (
    <div>
      <div className="italic text-sm text-gray-500">Updated {updatedAt.toLocaleString()}</div>
      <Card title="Ask">
        {[5, 4, 3, 2, 1].map((id: number) => (
          <div key={id} className="flex justify-between">
            <span className="text-red-500 font-bold">
              {getByKey(tick, "ask_price", id)}
            </span>
            <span>{getByKey(tick, "ask_volume", id)}</span>
            <span>{getValByKey(tick, "ask", id, 2)}</span>
          </div>
        ))}
      </Card>
      <Card className="!my-2">
        <div className="flex justify-between">
          <span className="text-xl font-bold">{tick.last_price}</span>
          <span>{tick.last_volume}</span>
        </div>
      </Card>
      <Card title="Bid">
        {[1, 2, 3, 4, 5].map((id: number) => (
          <div key={id} className="flex justify-between">
            <span className="text-green-500 font-bold">
              {getByKey(tick, "bid_price", id)}
            </span>
            <span>{getByKey(tick, "bid_volume", id)}</span>
            <span>{getValByKey(tick, "bid", id, 2)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
