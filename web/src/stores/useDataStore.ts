import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Account,
  Contract,
  Log,
  OrderData,
  Position,
  Quote,
  TickData,
  Trade,
} from "@/types/object";

interface DataState {
  contracts: Contract[];
  logs: Log[];
  accounts: Account[];
  positions: Position[];
  trades: Trade[];
  orderDatas: OrderData[];
  quotes: Quote[];
  ticks: TickData[];
  // Actions
  actions: {
    addLog: (engine: string, log: Log) => void;
    setLogs: (logs: Log[]) => void;
    addContract: (contract: Contract) => void;
    setContracts: (contracts: Contract[]) => void;
    setAccounts: (accounts: Account[]) => void;
    setPositions: (positions: Position[]) => void;
    setTrades: (trades: Trade[]) => void;
    setOrderDatas: (orders: OrderData[]) => void;
    removeOrderData: (orderid: string) => void;
    setQuotes: (quotes: Quote[]) => void;
    setTicks: (ticks: TickData[]) => void;
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
      addLog: (engine: string, log: Log) =>
        set((state) => {
          log.datetime = Date.now();
          log.engine = engine;
          return { logs: [...state.logs, log] };
        }),
      setLogs: (logs: Log[]) => set({ logs }),
      addContract: (contract: Contract) =>
        set((state) => ({ contracts: [...state.contracts, contract] })),
      setContracts: (contracts: Contract[]) => set({ contracts }),
      setAccounts: (accounts: Account[]) => set({ accounts }),
      setPositions: (positions: Position[]) => set({ positions }),
      setTrades: (trades: Trade[]) => set({ trades }),
      setOrderDatas: (orderDatas: OrderData[]) => set({ orderDatas }),
      removeOrderData: (orderid: string) =>
        set((state) => ({
          orderDatas: state.orderDatas.filter(
            (order) => order.orderid !== orderid
          ),
        })),
      setQuotes: (quotes: Quote[]) => set({ quotes }),
      setTicks: (ticks: TickData[]) => set({ ticks }),
    },
  }))
);
