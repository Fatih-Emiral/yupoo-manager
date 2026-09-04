import { Star, Clock, Store, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Product } from '../../types';
import { useStore } from '../../store/useStore';

interface Props {
  product: Product;
  onClick?: (product: Product) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onClick, onToggleFavorite, compact = false }: Props) {
  const { deleteProduct, sellers } = useStore();
  
  // Rétrocompatibilité nom de vendeur
  const sellerName = product.sellerId 
    ? sellers.find(s => s.id === product.sellerId)?.name || product.seller 
    : product.seller;

  return (
    <article 
      onClick={() => onClick && onClick(product)}
      className="group cursor-pointer bg-surface rounded-xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-200 flex flex-col shadow-sm"
    >
      {/* Zone Image : Format compact 4/3 pour gagner en hauteur */}
      <div className={`aspect-[4/3] bg-background relative overflow-hidden`}>
        {product.mainImage ? (
          <img 
            src={product.mainImage} 
            alt={product.name} 
            referrerPolicy="no-referrer" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">Aucune image</div>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Déplacer vers la corbeille ?')) deleteProduct(product.id);
          }}
          className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded hover:bg-danger/80 border border-white/10 text-white transition-all z-10 md:opacity-0 group-hover:opacity-100"
          title="Corbeille"
        >
          <Trash2 size={14} />
        </button>

        <div className="absolute top-2 right-10 p-1 bg-black/50 backdrop-blur rounded text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          <MoreHorizontal size={14} />
        </div>
        
        <button 
          onClick={(e) => onToggleFavorite && onToggleFavorite(product.id, e)}
          className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded hover:bg-black/80 border border-white/10 transition-colors z-10"
        >
          <Star size={14} className={product.favorite ? "fill-warning text-warning" : "text-white"} />
        </button>
      </div>
      
      {/* Zone Infos : Marges et textes réduits */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-primary truncate text-sm mb-0.5" title={product.name}>
          {product.name}
        </h3>
        <p className="text-[10px] text-muted mb-2">{product.category}</p>
        
        <div className="flex flex-col gap-0.5 mb-2">
          <span className="text-base font-bold text-primary leading-none">¥{product.priceCny}</span>
          <span className="text-[10px] text-muted font-medium leading-none">≈ {product.priceEur} €</span>
        </div>
        
        <div className="mt-auto pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted">
          <span className="flex items-center gap-1 truncate max-w-[65%]"><Store size={10}/> {sellerName || 'Inconnu'}</span>
          <span className="flex items-center gap-1"><Clock size={10}/> Récent</span>
        </div>
      </div>
    </article>
  );
}