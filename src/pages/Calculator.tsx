import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { cnyToEur, eurToCny, calculateTotalCost, calculateProfit, calculateMargin, calculateROI } from '../core/calculator';
import { Save, RefreshCcw, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Calculator() {
  const { products, settings, updateProduct } = useStore();
  const rate = settings.exchangeRate;
  
  // États du formulaire
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [priceCny, setPriceCny] = useState<number>(0);
  const [priceEur, setPriceEur] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [resalePrice, setResalePrice] = useState<number>(0);

  // Synchronisation lors du choix d'un produit
  useEffect(() => {
    if (selectedProductId) {
      const p = products.find(p => p.id === selectedProductId);
      if (p) {
        setPriceCny(p.priceCny || 0);
        setPriceEur(p.priceEur || cnyToEur(p.priceCny || 0, rate));
        setShipping(p.shippingCost || 0);
        setOtherCosts(p.otherCosts || 0);
        setResalePrice(p.resalePrice || 0);
      }
    }
  }, [selectedProductId, products, rate]);

  // Gérer la conversion dynamique
  const handleCnyChange = (val: number) => {
    setPriceCny(val);
    setPriceEur(cnyToEur(val, rate));
  };
  const handleEurChange = (val: number) => {
    setPriceEur(val);
    setPriceCny(eurToCny(val, rate));
  };

  const handleReset = () => {
    setSelectedProductId('');
    setPriceCny(0); setPriceEur(0); setShipping(0); setOtherCosts(0); setResalePrice(0);
  };

  const handleSave = async () => {
    if (selectedProductId) {
      const p = products.find(p => p.id === selectedProductId);
      if (p) {
        await updateProduct({
          ...p,
          priceCny,
          priceEur,
          shippingCost: shipping,
          otherCosts,
          resalePrice
        });
        alert('Produit mis à jour avec succès !');
      }
    }
  };

  // Calculs finaux
  const totalCost = calculateTotalCost(priceEur, shipping, otherCosts);
  const profit = calculateProfit(resalePrice, totalCost);
  const margin = calculateMargin(profit, resalePrice);
  const roi = calculateROI(profit, totalCost);

  // Détermination de la couleur du ROI
  const getRoiColor = (val: number) => {
    if (val >= settings.roiThresholds.excellent) return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
    if (val >= settings.roiThresholds.good) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    if (val >= settings.roiThresholds.medium) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const getRoiLabel = (val: number) => {
    if (val >= settings.roiThresholds.excellent) return 'Excellent';
    if (val >= settings.roiThresholds.good) return 'Intéressant';
    if (val >= settings.roiThresholds.medium) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2"><TrendingUp /> Simulateur de Rentabilité</h2>
        <div className="text-sm text-gray-400 bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
          Taux actuel : 1 € = {rate} ¥
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Panneau de Saisie */}
        <div className="space-y-6 bg-dark-800 p-6 rounded-xl border border-dark-700">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Associer à un produit (Optionnel)</label>
            <select 
              value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white">
              <option value="">-- Calcul libre --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.seller})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Prix Achat (¥)</label>
              <input type="number" min="0" step="0.1" value={priceCny || ''} onChange={e => handleCnyChange(Number(e.target.value))} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Prix Achat (€)</label>
              <input type="number" min="0" step="0.1" value={priceEur || ''} onChange={e => handleEurChange(Number(e.target.value))} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Livraison (€)</label>
              <input type="number" min="0" step="0.1" value={shipping || ''} onChange={e => setShipping(Number(e.target.value))} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Autres Frais (€)</label>
              <input type="number" min="0" step="0.1" value={otherCosts || ''} onChange={e => setOtherCosts(Number(e.target.value))} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-400 mb-1">Prix de revente prévu (€)</label>
            <input type="number" min="0" step="1" value={resalePrice || ''} onChange={e => setResalePrice(Number(e.target.value))} className="w-full bg-dark-900 border border-blue-900/50 rounded-lg p-3 text-lg font-bold" />
          </div>

          <div className="pt-4 flex gap-4">
            <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 p-3 rounded-lg transition-colors">
              <RefreshCcw size={18} /> Réinitialiser
            </button>
            <button onClick={handleSave} disabled={!selectedProductId} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-colors font-medium ${selectedProductId ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-dark-700 text-gray-500 cursor-not-allowed'}`}>
              <Save size={18} /> Sauvegarder
            </button>
          </div>
        </div>

        {/* Panneau de Résultat (Façon Ticket) */}
        <div className="bg-dark-900 p-8 rounded-xl border border-dark-700 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Filigrane de fond */}
          <TrendingUp className="absolute -bottom-10 -right-10 text-dark-800 opacity-20" size={250} />
          
          <div className="space-y-4 relative z-10 font-mono">
            <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-6 text-center border-b border-dark-700 pb-2">Bilan Financier</h3>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Prix d'achat</span>
              <div className="text-right">
                <span className="text-xs text-gray-500 mr-2">¥ {priceCny.toFixed(2)}</span>
                <span>{priceEur.toFixed(2)} €</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Livraison</span>
              <span>{shipping.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Autres frais</span>
              <span>{otherCosts.toFixed(2)} €</span>
            </div>
            
            <div className="border-t border-dashed border-dark-600 my-4 pt-4 flex justify-between font-bold text-lg">
              <span>Coût Total</span>
              <span className="text-white">{totalCost.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center text-blue-400 mt-6">
              <span>Prix de Vente</span>
              <span className="font-bold text-xl">{resalePrice.toFixed(2)} €</span>
            </div>

            <div className="border-t border-dashed border-dark-600 my-4 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-300">Bénéfice Net</span>
                <span className={`font-bold text-2xl ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {profit > 0 ? '+' : ''}{profit.toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Marge</span>
                <span className="text-lg">{margin.toFixed(1)} %</span>
              </div>
            </div>
          </div>

          {/* Indicateur de ROI */}
          <div className={`mt-8 p-4 rounded-lg border flex items-center justify-between z-10 ${getRoiColor(roi)}`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider">Retour sur investissement</p>
              <p className="text-xs opacity-80 flex items-center gap-1 mt-1">
                {roi < settings.roiThresholds.medium && <AlertTriangle size={12} />} 
                Évaluation : {getRoiLabel(roi)}
              </p>
            </div>
            <div className="text-3xl font-black">
              {roi.toFixed(1)}%
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}