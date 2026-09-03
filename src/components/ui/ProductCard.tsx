import { Star, Clock, Store, MoreHorizontal } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
  onClick?: (product: Product) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onClick, onToggleFavorite, compact = false }: Props) {
  return (
    <article 
      // Correction 1 : On vérifie que onClick existe avant de l'appeler
      onClick={() => onClick && onClick(product)}
      className="group cursor-pointer bg-saas-card rounded-2xl overflow-hidden border border-saas-border hover:border-saas-primary/50 transition-all duration-300 flex flex-col shadow-lg shadow-black/20"
    >
      {/* Zone Image */}
      {/* Correction 2 : On utilise 'compact' pour changer la taille de l'image si besoin */}
      <div className={`${compact ? 'aspect-[4/3]' : 'aspect-square'} bg-[#111113] relative overflow-hidden`}>
        {product.mainImage ? (
          <img 
            src={product.mainImage} 
            alt={product.name} 
            referrerPolicy="no-referrer" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-saas-textMuted text-sm">Image indisponible</div>
        )}
        
        {/* Menu 3 points (Décoratif, utilise l'icône importée) */}
        <div className="absolute top-2 right-12 p-1.5 bg-black/50 backdrop-blur rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} />
        </div>
        
        {/* Bouton Favori (Top Right) */}
        <button 
          // Correction 3 : On vérifie que onToggleFavorite existe
          onClick={(e) => onToggleFavorite && onToggleFavorite(product.id, e)}
          className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg hover:bg-black/80 border border-white/10 transition-colors z-10"
        >
          <Star size={16} className={product.favorite ? "fill-yellow-500 text-yellow-500" : "text-white"} />
        </button>
      </div>
      
      {/* Zone Infos (Bottom) */}
      <div className="p-4 flex flex-col flex-1">
        
        <h3 className="font-semibold text-white truncate text-sm mb-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-saas-textMuted mb-4">{product.category}</p>
        
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-lg font-bold text-white leading-none">¥{product.priceCny}</span>
          <span className="text-xs text-saas-textMuted font-medium leading-none">≈ {product.priceEur} €</span>
        </div>
        
        {/* Correction 4 : L'icône Store est maintenant correctement importée */}
        <div className="mt-auto pt-3 border-t border-saas-border flex items-center justify-between text-xs text-saas-textMuted">
          <span className="flex items-center gap-1 truncate max-w-[60%]"><Store size={12}/> {product.seller || 'Inconnu'}</span>
          <span className="flex items-center gap-1"><Clock size={12}/> Il y a peu</span>
        </div>
      </div>
    </article>
  );
}