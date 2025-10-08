import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Account,
  Contract,
  Log,
  Order,
  OrderData,
  Position,
  Quote,
  Tick,
  Trade,
} from "@/types";
import { mergeByKey } from "@/utils/mergeByKey";

interface DataState {
  contracts: Contract[];
  logs: Log[];
  accounts: Account[];
  positions: Position[];
  trades: Trade[];
  orderDatas: OrderData[];
  quotes: Quote[];
  ticks: Tick[];
  // Actions
  actions: {
    addLog: (log: Log) => void;
    setLogs: (logs: Log[]) => void;
    addContract: (contract: Contract) => void;
    setContracts: (contracts: Contract[]) => void;
    setAccounts: (accounts: Account[]) => void;
    setPositions: (positions: Position[]) => void;
    setTrades: (trades: Trade[]) => void;
    setOrderDatas: (orders: OrderData[]) => void;
    setQuotes: (quotes: Quote[]) => void;
    setTicks: (ticks: Tick[]) => void;
  };
}

export const useDataStore = create<DataState>()(
  devtools((set) => ({
    contracts: [],
    logs: [],
    accounts: [],
    positions: [],
    trades: [],
    orderDatas: [],
    quotes: [],
    ticks: [],
    actions: {
      addLog: (log: Log) =>
        set((state) => {
          log.datetime = Date.now();
          return { logs: [...state.logs, log] };
        }),
      setLogs: (logs: Log[]) => set({ logs }),
      addContract: (contract: Contract) =>
        set((state) => ({ contracts: [...state.contracts, contract] })),
      setContracts: (contracts: Contract[]) => set({ contracts }),
      setAccounts: (accounts: Account[]) => set({ accounts }),
      setPositions: (positions: Position[]) => set({ positions }),
      setTrades: (trades: Trade[]) => set({ trades }),
      setOrderDatas: (orderDatas: OrderData[]) =>
        set((state) => ({
          orderDatas: mergeByKey(state.orderDatas, orderDatas, "orderid"),
        })),
      setQuotes: (quotes: Quote[]) => set({ quotes }),
      setTicks: (ticks: Tick[]) => set({ ticks }),
    },
  }))
);
