import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Trading } from './pages/Trading';
import { Market } from './pages/Market';
import { Settings } from './pages/Settings';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='trading' element={<Trading />} />
        <Route path='market' element={<Market />} />
        <Route path='settings' element={<Settings />} />
      </Route>
    </Routes>
  );
};

