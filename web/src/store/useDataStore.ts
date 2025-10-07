import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Account, Contract, Log, Order, Position, Quote, Tick, Trade } from '@/types';



interface DataState {
  contracts: Contract[];
  logs: Log[];
  accounts: Account[];
  positions: Position[];
  trades: Trade[];
  orders: Order[];
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
    setOrders: (orders: Order[]) => void;
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
    orders: [],
    quotes: [],
    ticks: [],
    actions: {
      addLog: (log: Log) =>
        set((state) => {
          log.datetime = new Date().toLocaleString();
          return { logs: [...state.logs, log] };
        }),
      setLogs: (logs: Log[]) => set({ logs }),
      addContract: (contract: Contract) => set((state) => ({ contracts: [...state.contracts, contract] })),
      setContracts: (contracts: Contract[]) => set({ contracts }),
      setAccounts: (accounts: Account[]) => set({ accounts }),
      setPositions: (positions: Position[]) => set({ positions }),
      setTrades: (trades: Trade[]) => set({ trades }),
      setOrders: (orders: Order[]) => set({ orders }),
      setQuotes: (quotes: Quote[]) => set({ quotes }),
      setTicks: (ticks: Tick[]) => set({ ticks }),
    },
  }))
);
