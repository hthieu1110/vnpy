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
  logConsoleVisible: boolean;

  // Actions
  actions: {
    setUser: (user: User | null) => void;
    setGateway: (connectedGateway: string | null) => void;
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
        logConsoleVisible: false,

        actions: {
          setUser: (user) => set({ user }),
          setGateway: (connectedGateway) => set({ gateway: connectedGateway }),
          setTheme: (theme) => set({ theme }),
          setLogConsoleVisible: (visible) => set({ logConsoleVisible: visible }),
          logout: () => set({ user: null, gateway: null }),
        },
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          user: state.user,
          gateway: state.gateway,
          theme: state.theme,
          logConsoleVisible: state.logConsoleVisible,
        }),
      }
    )
  )
);
