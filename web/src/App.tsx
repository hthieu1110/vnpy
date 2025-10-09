import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Dashboard2 } from './pages/Dashboard2';
import { Trading } from './pages/Trading';
import { Market } from './pages/Market';
import { Settings } from './pages/Settings';
import { useRegisterMainEvents } from './hooks/useRegisterMainEvents';
import { Accounts } from './pages/Accounts';
import { Contracts } from './pages/Contracts';
import { Backtester } from './pages/Backtester';
  
export const App = () => {
  useRegisterMainEvents();

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
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

