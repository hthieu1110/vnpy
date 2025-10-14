import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Dashboard2 } from "./pages/Dashboard2";
import { Trading } from "./pages/Trading";
import { Market } from "./pages/Market";
import { Settings } from "./pages/Settings";
import { useRegisterMainEvents } from "./hooks/useRegisterMainEvents";
import { useRegisterBacktesterEvents } from "./hooks/useRegisterBacktesterEvents";
import { Accounts } from "./pages/Accounts";
import { Contracts } from "./pages/Contracts";
import { Backtester } from "./pages/Backtester";
import { Home } from "./pages/Home";
import { useEffect } from "react";
import { mainEngineRpc } from "./engineRpcs/mainEngineRpc";

import settings from "../../.vntrader/connect_vision.json";
import { useAppStore } from "./stores/useAppStore";

let isConnected = false;

export const App = () => {
  const appActions = useAppStore((state) => state.actions);

  useRegisterMainEvents();
  useRegisterBacktesterEvents();

  useEffect(() => {
    if (!isConnected) {
      appActions.setIsConnecting(true);
      mainEngineRpc.connect(settings, "Vision");
      isConnected = true;
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard2" element={<Dashboard2 />} />
        <Route path="trading" element={<Trading />} />
        <Route path="backtester" element={<Backtester />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="market" element={<Market />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
