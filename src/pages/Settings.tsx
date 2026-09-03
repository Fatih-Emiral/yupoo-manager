import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Save, Download, Upload, Trash2, AlertTriangle, Check } from 'lucide-react';
import localforage from 'localforage';

export default function Settings() {
  const { settings, updateSettings, products, loadProducts } = useStore();
  const [rate, setRate] = useState(settings.exchangeRate);
  const [saved, setSaved] = useState(false);

  const handleSaveRate = () => {
    updateSettings({ exchangeRate: rate });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "yupoo_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClearData = async () => {
    if (window.confirm("⚠️ ATTENTION : Cela va supprimer tout votre catalogue. Cette action est irréversible. Êtes-vous sûr ?")) {
      await localforage.clear();
      await loadProducts(); // Recharge le store à vide
      alert("Catalogue effacé.");
    }
  };

  const Section = ({ title, children }: any) => (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6 border-b border-dark-800 pb-4">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-dark-400 mt-1">Configurez votre environnement de sourcing.</p>
      </header>

      <Section title="💱 Taux de change">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm text-dark-400 mb-2">1 EUR = X CNY (Yuan)</label>
            <input 
              type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))}
              className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button onClick={handleSaveRate} className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
            {saved ? <><Check size={18}/> Enregistré</> : <><Save size={18}/> Appliquer</>}
          </button>
        </div>
      </Section>

      <Section title="💾 Gestion des données (Local)">
        <p className="text-sm text-dark-400 mb-6">Vos données sont actuellement stockées dans ce navigateur. Exportez-les régulièrement pour ne pas les perdre.</p>
        
        <div className="space-y-4">
          <button onClick={handleExport} className="w-full flex items-center justify-between p-4 bg-dark-950 border border-dark-800 rounded-xl hover:border-dark-700 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors"><Download size={20}/></div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Sauvegarder le catalogue</p>
                <p className="text-xs text-dark-400">Télécharger un fichier .json</p>
              </div>
            </div>
          </button>

          <button onClick={handleClearData} className="w-full flex items-center justify-between p-4 bg-dark-950 border border-dark-800 rounded-xl hover:border-red-900/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors"><Trash2 size={20}/></div>
              <div className="text-left">
                <p className="text-sm font-medium text-red-400">Effacer toutes les données</p>
                <p className="text-xs text-dark-400">Supprimer définitivement le catalogue</p>
              </div>
            </div>
          </button>
        </div>
      </Section>
    </div>
  );
}