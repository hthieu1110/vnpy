import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AppState {
  user: User | null;
  gateway: string;
  theme: "light" | "dark";
  isShowLogs: boolean;
  isAutoShowLogs: boolean;
  isConnecting: boolean;
  isOrderCancelling: boolean;

  // Actions
  actions: {
    setUser: (user: User | null) => void;
    setGateway: (connectedGateway: string) => void;
    setIsConnecting: (connecting: boolean) => void;
    setTheme: (theme: "light" | "dark") => void;
    setLogConsoleVisible: (visible: boolean) => void;
    setIsAutoShowLogs: (isAutoShowLogs: boolean) => void;
    logout: () => void;
    setIsOrderCancelling: (isOrderCancelling: boolean) => void;
  };
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        gateway: "",
        theme: "light",
        isShowLogs: false,
        isAutoShowLogs: false,
        isConnecting: false,
        isOrderCancelling: false,
        actions: {
          setUser: (user) => set({ user }),
          setGateway: (connectedGateway) =>
            set({ gateway: connectedGateway, isConnecting: false }),
          setIsConnecting: (connecting) => set({ isConnecting: connecting }),
          setTheme: (theme) => set({ theme }),
          setLogConsoleVisible: (visible) => set({ isShowLogs: visible }),
          setIsAutoShowLogs: (isAutoShowLogs) => set({ isAutoShowLogs }),
          logout: () => set({ user: null, gateway: "", isConnecting: false }),
          setIsOrderCancelling: (isOrderCancelling) =>
            set({ isOrderCancelling }),
        },
      }),
      {
        name: "app-storage",
        partialize: (state) => ({
          user: state.user,
          theme: state.theme,
          isShowLogs: state.isShowLogs,
          isAutoShowLogs: state.isAutoShowLogs,
        }),
      }
    )
  )
);
