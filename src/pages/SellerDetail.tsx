import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Store, ExternalLink, ArrowLeft, Package } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

export default function SellerDetail() {
  const { id } = useParams();
  const { sellers, products } = useStore();
  
  const seller = sellers.find(s => s.id === id);
  
  if (!seller) {
    return <div className="text-center py-20">Revendeur introuvable.</div>;
  }

  // Association intelligente : vérifie l'ID du vendeur, OU le nom du vendeur pour les anciens produits non migrés
  const sellerProducts = products.filter(p => 
    p.sellerId === seller.id || (p.seller && p.seller.toLowerCase() === seller.name.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <Link to="/sellers" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
        <ArrowLeft size={16} /> Retour aux revendeurs
      </Link>

      <div className="bg-surface rounded-2xl border border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <Store size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{seller.name}</h1>
            <p className="text-sm text-muted">{seller.yupooUrl}</p>
          </div>
        </div>
        <a href={seller.yupooUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto flex items-center justify-center gap-2 bg-background border border-border hover:border-accent text-primary px-5 py-2.5 rounded-xl font-medium transition-colors">
          <ExternalLink size={18} /> Ouvrir Yupoo
        </a>
      </div>

      <div>
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Package size={20} className="text-muted" /> Produits enregistrés ({sellerProducts.length})
        </h2>
        
        {sellerProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {sellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-border border-dashed rounded-2xl text-muted">
            <Store size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium text-primary">Aucun produit</p>
            <p className="text-sm mt-1">Les produits associés à ce revendeur apparaîtront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}