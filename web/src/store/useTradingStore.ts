import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Position {
  symbol: string
  volume: number
  price: number
  direction: 'long' | 'short'
}

interface Order {
  id: string
  symbol: string
  type: 'limit' | 'market'
  direction: 'buy' | 'sell'
  price: number
  volume: number
  status: 'pending' | 'filled' | 'cancelled'
}

interface TradingState {
  positions: Position[]
  orders: Order[]
  selectedSymbol: string | null
  
  // Actions
  setPositions: (positions: Position[]) => void
  setOrders: (orders: Order[]) => void
  setSelectedSymbol: (symbol: string | null) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  removeOrder: (id: string) => void
}

export const useTradingStore = create<TradingState>()(
  devtools(
    (set) => ({
      positions: [],
      orders: [],
      selectedSymbol: null,

      setPositions: (positions) => set({ positions }),
      setOrders: (orders) => set({ orders }),
      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrder: (id, updates) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updates } : order
          ),
        })),
      removeOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),
    }),
    { name: 'trading-store' }
  )
)


