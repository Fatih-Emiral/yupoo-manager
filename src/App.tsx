import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import { useStore } from './store/useStore';

// Pages
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Import from './pages/Import';
import Calculator from './pages/Calculator';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';

export default function App() {
  const loadProducts = useStore(state => state.loadProducts);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="import" element={<Import />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}