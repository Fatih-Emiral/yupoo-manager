import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { cnyToEur, eurToCny, calculateTotalCost, calculateProfit, calculateMargin, calculateROI } from '../core/calculator';
import { Save, RefreshCcw, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Calculator() {
  const { products, settings, updateProduct } = useStore();
  const rate = settings.exchangeRate;
  
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [priceCny, setPriceCny] = useState<number>(0);
  const [priceEur, setPriceEur] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [resalePrice, setResalePrice] = useState<number>(0);

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

  const totalCost = calculateTotalCost(priceEur, shipping, otherCosts);
  const profit = calculateProfit(resalePrice, totalCost);
  const margin = calculateMargin(profit, resalePrice);
  const roi = calculateROI(profit, totalCost);

  const getRoiColor = (val: number) => {
    if (val >= settings.roiThresholds.excellent) return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
    if (val >= settings.roiThresholds.good) return 'text-success bg-success/10 border-success/30';
    if (val >= settings.roiThresholds.medium) return 'text-warning bg-warning/10 border-warning/30';
    return 'text-danger bg-danger/10 border-danger/30';
  };

  const getRoiLabel = (val: number) => {
    if (val >= settings.roiThresholds.excellent) return 'Excellent';
    if (val >= settings.roiThresholds.good) return 'Intéressant';
    if (val >= settings.roiThresholds.medium) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2"><TrendingUp size={24} className="text-accent" /> Simulateur</h2>
        <div className="text-xs md:text-sm text-muted bg-surface px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-border self-end md:self-auto">
          1 € = {rate} ¥
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Panneau de Saisie */}
        <div className="space-y-4 md:space-y-6 bg-surface p-4 md:p-6 rounded-xl border border-border">
          <div>
            <label className="block text-xs md:text-sm text-muted mb-1.5">Associer à un produit (Optionnel)</label>
            <select 
              value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 md:p-3 text-primary focus:outline-none focus:border-accent">
              <option value="">-- Calcul libre --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.seller})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm text-muted mb-1.5">Prix Achat (¥)</label>
              <input type="number" min="0" step="0.1" value={priceCny || ''} onChange={e => handleCnyChange(Number(e.target.value))} className="w-full h-12 md:h-12 bg-background border border-border rounded-xl px-3 md:px-3 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs md:text-sm text-muted mb-1.5">Prix Achat (€)</label>
              <input type="number" min="0" step="0.1" value={priceEur || ''} onChange={e => handleEurChange(Number(e.target.value))} className="w-full h-12 md:h-12 bg-background border border-border rounded-xl px-3 md:px-3 focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm text-muted mb-1.5">Livraison (€)</label>
              <input type="number" min="0" step="0.1" value={shipping || ''} onChange={e => setShipping(Number(e.target.value))} className="w-full h-12 md:h-12 bg-background border border-border rounded-xl px-3 md:px-3 focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs md:text-sm text-muted mb-1.5">Autres Frais (€)</label>
              <input type="number" min="0" step="0.1" value={otherCosts || ''} onChange={e => setOtherCosts(Number(e.target.value))} className="w-full h-12 md:h-12 bg-background border border-border rounded-xl px-3 md:px-3 focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-blue-400 mb-1.5">Prix de revente prévu (€)</label>
            <input type="number" min="0" step="1" value={resalePrice || ''} onChange={e => setResalePrice(Number(e.target.value))} className="w-full h-14 md:h-14 bg-background border border-blue-900/50 rounded-xl px-4 text-lg font-bold focus:outline-none focus:border-blue-500" />
          </div>

          <div className="pt-2 md:pt-4 flex gap-3 md:gap-4">
            <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 bg-background border border-border active:scale-95 md:hover:bg-surface-hover p-3 md:p-3 rounded-xl transition-all">
              <RefreshCcw size={18} className="text-muted" /> <span className="text-sm font-medium">Reset</span>
            </button>
            <button onClick={handleSave} disabled={!selectedProductId} className={`flex-1 flex items-center justify-center gap-2 p-3 md:p-3 rounded-xl transition-all font-medium active:scale-95 ${selectedProductId ? 'bg-blue-600 md:hover:bg-blue-700 text-white' : 'bg-background border border-border text-muted opacity-50 cursor-not-allowed'}`}>
              <Save size={18} /> <span className="text-sm">Sauvegarder</span>
            </button>
          </div>
        </div>

        {/* Panneau de Résultat */}
        <div className="bg-surface p-5 md:p-8 rounded-xl border border-border shadow-lg flex flex-col justify-between relative overflow-hidden">
          <TrendingUp className="absolute -bottom-10 -right-10 text-background opacity-50" size={200} />
          
          <div className="space-y-4 relative z-10 font-mono text-sm md:text-base">
            <h3 className="text-muted uppercase tracking-widest text-xs md:text-sm mb-4 md:mb-6 text-center border-b border-border pb-2">Bilan Financier</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-muted">Prix d'achat</span>
              <div className="text-right">
                <span className="text-[10px] md:text-xs text-muted mr-2">¥ {priceCny.toFixed(2)}</span>
                <span>{priceEur.toFixed(2)} €</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Livraison</span>
              <span>{shipping.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Autres frais</span>
              <span>{otherCosts.toFixed(2)} €</span>
            </div>
            
            <div className="border-t border-dashed border-border my-3 md:my-4 pt-3 md:pt-4 flex justify-between font-bold text-base md:text-lg">
              <span>Coût Total</span>
              <span className="text-primary">{totalCost.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center text-blue-400 mt-4 md:mt-6">
              <span>Prix Vente</span>
              <span className="font-bold text-lg md:text-xl">{resalePrice.toFixed(2)} €</span>
            </div>

            <div className="border-t border-dashed border-border my-3 md:my-4 pt-3 md:pt-4 space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">Bénéfice Net</span>
                <span className={`font-bold text-xl md:text-2xl ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                  {profit > 0 ? '+' : ''}{profit.toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Marge</span>
                <span className="text-base md:text-lg">{margin.toFixed(1)} %</span>
              </div>
            </div>
          </div>

          <div className={`mt-6 md:mt-8 p-3 md:p-4 rounded-xl border flex items-center justify-between z-10 ${getRoiColor(roi)}`}>
            <div>
              <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Retour sur investissement</p>
              <p className="text-[10px] md:text-xs opacity-80 flex items-center gap-1 mt-0.5 md:mt-1">
                {roi < settings.roiThresholds.medium && <AlertTriangle size={12} />} 
                Évaluation : {getRoiLabel(roi)}
              </p>
            </div>
            <div className="text-2xl md:text-3xl font-black">
              {roi.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}