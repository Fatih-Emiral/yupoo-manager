import { X, ExternalLink, Calculator, Star, CheckCircle2 } from 'lucide-react';
import type { Product } from '../../types';
import { calculateTotalCost, calculateProfit, calculateROI } from '../../core/calculator';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const { toggleFavorite } = useStore();
  const totalCost = calculateTotalCost(product.priceEur, product.shippingCost || 0, product.otherCosts || 0);
  const profit = calculateProfit(product.resalePrice || 0, totalCost);
  const roi = calculateROI(profit, totalCost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-dark-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-dark-800 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-slide-up">
        {/* Bouton Fermer */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors">
          <X size={20} />
        </button>

        {/* Galerie (Gauche) */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-auto bg-dark-950 flex flex-col">
          <div className="flex-1 overflow-hidden relative">
            {product.mainImage ? (
              <img src={product.mainImage} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-dark-700">Aucune image</div>
            )}
            <div className="absolute top-4 left-4">
               <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/10">{product.category}</span>
            </div>
          </div>
          {/* Miniatures */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-dark-900 border-t border-dark-800 hide-scrollbar">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt="thumb" referrerPolicy="no-referrer" className="h-16 w-16 object-cover rounded-md border border-dark-700 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              ))}
            </div>
          )}
        </div>

        {/* Infos (Droite) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8 bg-dark-900">
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{product.name}</h2>
            <p className="text-dark-400 text-sm flex items-center gap-2">
              <Store size={14} /> Vendeur : <span className="text-gray-300 font-medium">{product.seller || 'Inconnu'}</span>
            </p>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-blue-500">¥{product.priceCny}</span>
            <span className="text-lg text-dark-400 font-medium mb-1">≈ {product.priceEur}€</span>
          </div>

          <div className="flex gap-3">
            <a href={product.yupooUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
              <ExternalLink size={18} /> Voir sur Yupoo
            </a>
            <button onClick={() => toggleFavorite(product.id)} className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${product.favorite ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-dark-800 border-dark-700 text-dark-400 hover:text-white'}`}>
              <Star size={20} className={product.favorite ? "fill-yellow-500" : ""} />
            </button>
          </div>

          <div className="bg-dark-950 p-5 rounded-xl border border-dark-800 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider"><CheckCircle2 size={16} className="text-emerald-500"/> Rentabilité Estimée</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-dark-400">Coût d'achat total</p>
                <p className="font-medium text-white">{totalCost} €</p>
              </div>
              <div>
                <p className="text-dark-400">Prix de revente</p>
                <p className="font-medium text-white">{product.resalePrice || 0} €</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-dark-800 flex justify-between items-center">
              <div>
                <p className="text-dark-400 text-sm">Bénéfice Net</p>
                <p className={`text-xl font-bold ${profit > 0 ? 'text-emerald-500' : 'text-dark-400'}`}>{profit > 0 ? '+' : ''}{profit} €</p>
              </div>
              <div className="text-right">
                <p className="text-dark-400 text-sm">ROI</p>
                <p className="font-bold text-white">{roi}%</p>
              </div>
            </div>

            <Link to="/calculator" className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-lg text-sm transition-colors border border-dark-700">
              <Calculator size={14} /> Ajuster dans le calculateur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const Store = ({size}:any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>