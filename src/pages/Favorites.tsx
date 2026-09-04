import { useStore } from '../store/useStore';
import ProductCard from '../components/ui/ProductCard';
import { Star } from 'lucide-react';

export default function Favorites() {
  const { products } = useStore();
  const favoriteProducts = products.filter(p => p.favorite);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="bg-surface rounded-2xl border border-border p-6">
        
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
          <div className="p-3 bg-warning/20 text-warning rounded-xl">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Vos Favoris</h2>
            <p className="text-sm text-muted">{favoriteProducts.length} produit(s) enregistré(s)</p>
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <Star size={48} className="mb-4 opacity-20" />
            <p className="text-lg">Aucun produit dans vos favoris.</p>
            <p className="text-sm mt-1">Cliquez sur l'étoile d'un produit pour l'ajouter ici.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}