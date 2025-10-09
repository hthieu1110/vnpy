import { Interval } from "@/types/constants";
import { create } from "zustand";

interface BacktesterParams {
  strategy: string;
  symbol: string;
  exchange: string;
  interval: string;
  startDate: number;
  endDate: number;
  commissionRate: number;
  slippage: number;
  contractMultiple: number;
  pricetick: number;
  initialCapital: number;
}

interface BacktesterState {
  params: BacktesterParams;

  actions: {
    updateParams: (params: Partial<BacktesterState>) => void;
  };
}

export const useBacktesterStore = create<BacktesterState>((set) => ({
  params: {
    strategy: "",
    symbol: "BTCUSDT_SPOT_BINANCE",
    exchange: "GLOBAL",
    interval: Interval.MINUTE,
    startDate: Date.now() - 24 * 60 * 60 * 5,
    endDate: Date.now(),
    commissionRate: 0,
    slippage: 0,
    contractMultiple: 0,
    pricetick: 0,
    initialCapital: 0,
  },

  actions: {
    updateParams: (changes) =>
      set((prev) => ({ params: { ...prev.params, ...changes } })),
  },
}));
