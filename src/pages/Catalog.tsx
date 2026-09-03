import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Search, FilterX } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import ProductModal from '../components/ui/ProductModal';
import type { Product } from '../types';

export default function Catalog() {
  const { products, toggleFavorite } = useStore();
  
  // États des filtres
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sellerFilter, setSellerFilter] = useState('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('NEWEST');

  // État du modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Listes dynamiques pour les dropdowns
  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];
  const sellers = ['ALL', ...Array.from(new Set(products.map(p => p.seller).filter(Boolean)))];

  // Logique de filtrage et tri (Ultra rapide grâce à useMemo)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.seller.toLowerCase().includes(s));
    }
    if (categoryFilter !== 'ALL') result = result.filter(p => p.category === categoryFilter);
    if (sellerFilter !== 'ALL') result = result.filter(p => p.seller === sellerFilter);
    if (showFavoritesOnly) result = result.filter(p => p.favorite);

    result.sort((a, b) => {
      if (sortBy === 'NEWEST') return b.createdAt - a.createdAt;
      if (sortBy === 'PRICE_ASC') return a.priceCny - b.priceCny;
      if (sortBy === 'PRICE_DESC') return b.priceCny - a.priceCny;
      return 0;
    });

    return result;
  }, [products, search, categoryFilter, sellerFilter, showFavoritesOnly, sortBy]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche d'ouvrir le modal quand on clique sur l'étoile
    toggleFavorite(id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Barre de recherche */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Catalogue</h1>
          <p className="text-dark-400 mt-1">{filteredProducts.length} produit(s) trouvé(s)</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un produit, un vendeur..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-dark-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-dark-400"
          />
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="flex flex-wrap items-center gap-3 bg-dark-900 p-3 rounded-xl border border-dark-800">
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-dark-950 border border-dark-800 text-sm rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-blue-500">
          <option value="ALL">Toutes catégories</option>
          {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sellerFilter} onChange={e => setSellerFilter(e.target.value)} className="bg-dark-950 border border-dark-800 text-sm rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-blue-500">
          <option value="ALL">Tous vendeurs</option>
          {sellers.filter(s => s !== 'ALL').map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-dark-950 border border-dark-800 text-sm rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-blue-500">
          <option value="NEWEST">Plus récents</option>
          <option value="PRICE_ASC">Prix croissant</option>
          <option value="PRICE_DESC">Prix décroissant</option>
        </select>

        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} 
          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${showFavoritesOnly ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-dark-950 border-dark-800 text-gray-400 hover:text-white'}`}
        >
          ⭐ Favoris
        </button>

        {(search || categoryFilter !== 'ALL' || sellerFilter !== 'ALL' || showFavoritesOnly) && (
          <button onClick={() => {setSearch(''); setCategoryFilter('ALL'); setSellerFilter('ALL'); setShowFavoritesOnly(false);}} className="ml-auto p-2 text-dark-400 hover:text-red-400 transition-colors" title="Réinitialiser">
            <FilterX size={18} />
          </button>
        )}
      </div>

      {/* Grille */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={setSelectedProduct} 
              onToggleFavorite={handleToggleFavorite} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-dark-400 bg-dark-900 rounded-2xl border border-dark-800 border-dashed">
          <Search size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium text-gray-300">Aucun produit trouvé</p>
          <p className="text-sm mt-1">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      )}

      {/* Modal Produit */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}