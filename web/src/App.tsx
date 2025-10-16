import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Trading } from './pages/Trading';
import { Settings } from './pages/Settings';
import { Accounts } from './pages/Accounts';
import { Contracts } from './pages/Contracts';
import { Backtester } from './pages/Backtester';
import { useEffect } from 'react';
import { mainRpc } from './services/rpcs/mainRpc';

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
  const { connectedGateway, actions: appActions } = useAppStore();
  const dataActions = useDataStore((state) => state.actions);
  const navigate = useNavigate();

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

  useEffect(() => {
    mainRpc.checkGatewayConnected('Vision').then((isConnected) => {
      if (isConnected) {
        appActions.setIsConnecting(false);
        appActions.setConnectedGateway('Vision');
      } else {
        navigate('/');
      }
    });
  }, []);

  useEffect(() => {
    if (!connectedGateway) return;

    (async () => {
      const accountsPromise = mainRpc.getAllAccounts();
      const contractsPromise = mainRpc.getAllContracts();
      const ordersPromise = mainRpc.getAllOrders();

      const [accounts, contracts, orders] = await Promise.all([accountsPromise, contractsPromise, ordersPromise]);

      dataActions.setAccounts(accounts);
      dataActions.setContracts(contracts);
      dataActions.setOrders(orders);
    })();

  }, [connectedGateway, dataActions, navigate]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='trading' element={<Trading />} />
        <Route path='backtester' element={<Backtester />} />
        <Route path='accounts' element={<Accounts />} />
        <Route path='contracts' element={<Contracts />} />
        <Route path='settings' element={<Settings />} />
      </Route>
    </Routes>
  );
};
