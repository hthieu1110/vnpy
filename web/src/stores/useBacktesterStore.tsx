import { Interval } from '@/types/constants';
import { create } from 'zustand';
import dayjs from 'dayjs';

export interface BacktesterParams {
  strategy: string;
  symbol: string;
  exchange: string;
  interval: string; 
  rate: number;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  slippage: number;
  size: number;
  pricetick: number;
  initialCapital: number;
}

interface BacktesterState {
  isDownloading: boolean;
  isBacktesting: boolean;
  isOptimizing: boolean;
  params: BacktesterParams;

  actions: {
    setIsDownloading: (isDownloading: boolean) => void;
    setIsBacktesting: (isBacktesting: boolean) => void;
    setIsOptimizing: (isOptimizing: boolean) => void;
    updateParams: (params: Partial<BacktesterState>) => void;
  };
}

export const useBacktesterStore = create<BacktesterState>((set) => ({
  isDownloading: false,
  isBacktesting: false,
  isOptimizing: false,
  params: {
    strategy: 'DoubleMaStrategy',
    symbol: 'BTCUSDT_SPOT_BINANCE',
    exchange: 'GLOBAL',
    interval: Interval.MINUTE,
    startDate: dayjs(Date.now() - 24 * 60 * 60 * 7 * 1000),
    endDate: dayjs(Date.now()),
    rate: 0.000025,
    slippage: 0.2,
    size: 300,
    pricetick: 0.2,
    initialCapital: 1_000_000,
  },

  actions: {
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setIsBacktesting: (isBacktesting) => set({ isBacktesting }),
    setIsOptimizing: (isOptimizing) => set({ isOptimizing }),
    updateParams: (changes) => set((prev) => ({ params: { ...prev.params, ...changes } })),
  },
}));
