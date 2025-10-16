import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Account, Contract, Log, OrderData, Position, Quote, TickData, TradeData } from '@/types/object';
import { upsertByKeys } from '@/utils/upsertByKeys';

interface DataState {
  contracts: Contract[];
  logs: Log[];
  accounts: Account[];
  positions: Position[];
  trades: TradeData[];
  orders: OrderData[];
  quotes: Quote[];
  ticks: TickData[];
  // Actions
  actions: {
    addLog: (engine: string, log: Log) => void;
    removeOrderById: (orderid: string) => void;
    upsertData: <T>(dataKey: keyof DataState, newData: T, keys: keyof T | (keyof T)[]) => void;
    addData: <T>(dataKey: keyof DataState, newData: T) => void;
    setDatas: <T>(dataKey: keyof DataState, newData: T[]) => void;
  };
}

export const useDataStore = create<DataState>()(
  devtools((set) => ({
    contracts: [],
    logs: [],
    accounts: [],
    positions: [],
    trades: [],
    orders: [],
    quotes: [],
    ticks: [],
    actions: {
      addLog: (engine: string, log: Log) =>
        set((state) => {
          log.datetime = Date.now();
          log.engine = engine;
          return { logs: [...state.logs, log] };
        }),
      removeOrderById: (orderid: string) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.orderid !== orderid),
        })),
      upsertData: <T>(dataKey: keyof DataState, newData: T, keys: keyof T | (keyof T)[]) => {
        set((state) => ({ [dataKey]: upsertByKeys<T>(state[dataKey] as T[], newData, keys) }));
      },
      addData: <T>(dataKey: keyof DataState, newData: T) => {
        set((state) => ({ [dataKey]: [...(state[dataKey] as T[]), newData] }));
      },
      setDatas: <T>(dataKey: keyof DataState, newData: T[]) => {
        set({ [dataKey]: newData });
      },
    },
  }))
);
