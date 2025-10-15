import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Dashboard2 } from './pages/Dashboard2';
import { Trading } from './pages/Trading';
import { Market } from './pages/Market';
import { Settings } from './pages/Settings';
import { Accounts } from './pages/Accounts';
import { Contracts } from './pages/Contracts';
import { Backtester } from './pages/Backtester';
import { Home } from './pages/Home';
import { useEffect } from 'react';
import { mainEngineRpc } from './engineRpcs/mainEngineRpc';

import { useAppStore } from './stores/useAppStore';
import { useSub_EVENT_LOG } from './hooks/events/main/useSub_EVENT_LOG';
import { useSub_EVENT_POSITION } from './hooks/events/main/useSub_EVENT_POSITION';
import { useSub_EVENT_TRADE } from './hooks/events/main/useSub_EVENT_TRADE';
import { useSub_EVENT_ORDER } from './hooks/events/main/useSub_EVENT_ORDER';
import { useSub_EVENT_QUOTE } from './hooks/events/main/useSub_EVENT_QUOTE';
import { useSub_EVENT_TICK } from './hooks/events/main/useSub_EVENT_TICK';
import { useSub_EVENT_BACKTESTER_BACKTESTING_FINISHED } from './hooks/events/backtester/useSub_EVENT_BACKTESTER_BACKTESTING_FINISHED';
import { useSub_EVENT_BACKTESTER_LOG } from './hooks/events/backtester/useSub_EVENT_BACKTESTER_LOG';
import { useSub_EVENT_BACKTESTER_OPTIMIZATION_FINISHED } from './hooks/events/backtester/useSub_EVENT_BACKTESTER_OPTIMIZATION_FINISHED';
import { useDataStore } from './stores/useDataStore';

export const App = () => {
  const appActions = useAppStore((state) => state.actions);
  const dataActions = useDataStore((state) => state.actions);
  const gateway = useAppStore((state) => state.gateway);

  // useSub_EVENT_CONTRACT();
  // useSub_EVENT_ACCOUNT();
  useSub_EVENT_POSITION();
  useSub_EVENT_TRADE();
  useSub_EVENT_ORDER();
  useSub_EVENT_QUOTE();
  useSub_EVENT_TICK();
  useSub_EVENT_LOG();

  useSub_EVENT_BACKTESTER_LOG();
  useSub_EVENT_BACKTESTER_BACKTESTING_FINISHED();
  useSub_EVENT_BACKTESTER_OPTIMIZATION_FINISHED();

  const fetchContracts = async () => {
    const contracts = await mainEngineRpc.getAllContracts();
    dataActions.setContracts(contracts);
  };

  const fetchAccounts = async () => {
    const accounts = await mainEngineRpc.getAllAccounts();
    dataActions.setAccounts(accounts);
  };

  useEffect(() => {
    mainEngineRpc.checkGatewayConnected('Vision').then((isConnected) => {
      if (isConnected) {
        appActions.setIsConnecting(false);
        appActions.setGateway('Vision');
      }
    });
  }, []);

  useEffect(() => {
    if (gateway) {
      fetchContracts();
      fetchAccounts();
    }
  }, [gateway]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='dashboard2' element={<Dashboard2 />} />
        <Route path='trading' element={<Trading />} />
        <Route path='backtester' element={<Backtester />} />
        <Route path='accounts' element={<Accounts />} />
        <Route path='contracts' element={<Contracts />} />
        <Route path='market' element={<Market />} />
        <Route path='settings' element={<Settings />} />
      </Route>
    </Routes>
  );
};
