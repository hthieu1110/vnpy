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
import { upsertByKeys } from "@/utils/upsertByKeys";

interface DataState {
  contracts: Contract[];
  logs: Log[];
  accounts: Account[];
  positions: Position[];
  trades: Trade[];
  orders: OrderData[];
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
    setOrders: (orders: OrderData[]) => void;
    removeOrderData: (orderid: string) => void;
    setQuotes: (quotes: Quote[]) => void;
    setTicks: (ticks: TickData[]) => void;
    upsertAccount: (account: Account) => void;
    upsertOrder: (orderData: OrderData) => void;
    upsertTick: (tickData: TickData) => void;
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
      setLogs: (logs: Log[]) => set({ logs }),
      addContract: (contract: Contract) =>
        set((state) => ({ contracts: [...state.contracts, contract] })),
      setContracts: (contracts: Contract[]) => set({ contracts }),
      setAccounts: (accounts: Account[]) => set({ accounts }),
      setPositions: (positions: Position[]) => set({ positions }),
      setTrades: (trades: Trade[]) => set({ trades }),
      setOrders: (orders: OrderData[]) => set({ orders }),
      removeOrderData: (orderid: string) =>
        set((state) => ({
          orders: state.orders.filter(
            (order) => order.orderid !== orderid
          ),
        })),
      setQuotes: (quotes: Quote[]) => set({ quotes }),
      setTicks: (ticks: TickData[]) => set({ ticks }),

      upsertAccount: (account: Account) => {
        set((state) => ({ accounts: upsertByKeys<Account>(state.accounts, account, 'accountid') }))
      },

      upsertOrder: (order: OrderData) => {
        set((state) => ({ orders: upsertByKeys<OrderData>(state.orders, order, 'orderid') }))
      },

      upsertTick: (tick: TickData) => {
        set((state) => ({ ticks: upsertByKeys<TickData>(state.ticks, tick, 'symbol') }))
      },
    },
  }))
);
