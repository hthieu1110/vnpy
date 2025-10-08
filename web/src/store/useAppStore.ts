import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AppState {
  user: User | null;
  gateway: string | null;
  theme: 'light' | 'dark';
  isShowLogs: boolean;

  isConnecting: boolean;

  // Actions
  actions: {
    setUser: (user: User | null) => void;
    setGateway: (connectedGateway: string | null) => void;
    setIsConnecting: (connecting: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setLogConsoleVisible: (visible: boolean) => void;
    logout: () => void;
  };
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        gateway: null,
        theme: 'light',
        isShowLogs: false,
        isConnecting: false,
        actions: {
          setUser: (user) => set({ user }),
          setGateway: (connectedGateway) => set({ gateway: connectedGateway, isConnecting: false }),
          setIsConnecting: (connecting) => set({ isConnecting: connecting }),
          setTheme: (theme) => set({ theme }),
          setLogConsoleVisible: (visible) => set({ isShowLogs: visible }),
          logout: () => set({ user: null, gateway: null, isConnecting: false }),
        },
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          user: state.user,
          gateway: state.gateway,
          theme: state.theme,
          isShowLogs: state.isShowLogs,
        }),
      }
    )
  )
);
