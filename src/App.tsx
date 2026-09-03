import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import { useStore } from './store/useStore';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';

// Vues simplifiées (à créer dans src/pages)
import Import from './pages/Import';
import Catalog from './pages/Catalog';

function App() {
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
          <Route path="favorites" element={<div>Favoris (À venir)</div>} />
          <Route path="import" element={<Import />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="settings" element={<div>Paramètres (À venir)</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;