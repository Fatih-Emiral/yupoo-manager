import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Search, FilterX } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import ProductModal from '../components/ui/ProductModal';
import type { Product } from '../types';

export default function Catalog() {
  const { products, toggleFavorite } = useStore();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sellerFilter, setSellerFilter] = useState('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('NEWEST');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];
  const sellers = ['ALL', ...Array.from(new Set(products.map(p => p.seller).filter(Boolean)))];

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
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4 hidden md:flex">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Catalogue</h1>
          <p className="text-dark-400 mt-1">{filteredProducts.length} produit(s) trouvé(s)</p>
        </div>
      </div>

      <div className="w-full relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un produit, un vendeur..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 md:h-14 bg-surface border border-border rounded-xl pl-12 pr-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-muted"
        />
      </div>

      {/* Barre de Filtres avec scroll horizontal sur mobile */}
      <div className="flex overflow-x-auto no-scrollbar scroll-smooth-ios flex-nowrap md:flex-wrap items-center gap-2 md:gap-3 bg-transparent md:bg-surface md:p-3 md:rounded-xl md:border md:border-border pb-1 md:pb-0">
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="whitespace-nowrap flex-shrink-0 bg-surface md:bg-background border border-border text-sm rounded-lg px-3 py-2.5 h-10 md:h-auto text-primary focus:outline-none focus:border-accent">
          <option value="ALL">Catégories</option>
          {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sellerFilter} onChange={e => setSellerFilter(e.target.value)} className="whitespace-nowrap flex-shrink-0 bg-surface md:bg-background border border-border text-sm rounded-lg px-3 py-2.5 h-10 md:h-auto text-primary focus:outline-none focus:border-accent">
          <option value="ALL">Vendeurs</option>
          {sellers.filter(s => s !== 'ALL').map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="whitespace-nowrap flex-shrink-0 bg-surface md:bg-background border border-border text-sm rounded-lg px-3 py-2.5 h-10 md:h-auto text-primary focus:outline-none focus:border-accent">
          <option value="NEWEST">Plus récents</option>
          <option value="PRICE_ASC">Prix croissant</option>
          <option value="PRICE_DESC">Prix décroissant</option>
        </select>

        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} 
          className={`whitespace-nowrap flex-shrink-0 px-4 py-2.5 h-10 md:h-auto text-sm rounded-lg border transition-colors ${showFavoritesOnly ? 'bg-warning/20 border-warning/50 text-warning' : 'bg-surface md:bg-background border-border text-muted md:hover:text-white'}`}
        >
          ⭐ Favoris
        </button>

        {(search || categoryFilter !== 'ALL' || sellerFilter !== 'ALL' || showFavoritesOnly) && (
          <button onClick={() => {setSearch(''); setCategoryFilter('ALL'); setSellerFilter('ALL'); setShowFavoritesOnly(false);}} className="whitespace-nowrap flex-shrink-0 px-3 py-2.5 h-10 md:h-auto text-muted active:text-danger md:hover:text-danger transition-colors flex items-center" title="Réinitialiser">
            <FilterX size={18} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center md:hidden mb-2">
         <p className="text-sm font-medium text-muted">{filteredProducts.length} produit(s)</p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
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
        <div className="flex flex-col items-center justify-center py-16 text-muted bg-surface rounded-2xl border border-border border-dashed">
          <Search size={40} className="mb-4 opacity-20" />
          <p className="text-base md:text-lg font-medium text-primary">Aucun produit trouvé</p>
          <p className="text-xs md:text-sm mt-1 text-center px-4">Essayez de modifier vos filtres.</p>
        </div>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}