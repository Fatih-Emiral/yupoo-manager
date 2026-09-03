import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchYupooData } from '../core/scraper/yupooService';
import { guessCategory } from '../core/scraper/categoryEngine';
import type { Category, Product } from '../types/index';
import { cnyToEur } from '../core/calculator';
import { Search, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function Import() {
  const addProduct = useStore(state => state.addProduct);
  const rate = useStore(state => state.settings.exchangeRate);
  const navigate = useNavigate();
  
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'REVIEW'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', seller: '', category: 'Autre' as Category, 
    priceCny: 0, description: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('yupoo.com')) {
      setErrorMsg("Ce n'est pas un lien Yupoo valide.");
      return;
    }

    setStatus('LOADING');
    setErrorMsg('');
    
    const scrapedData = await fetchYupooData(url);
    
    if (scrapedData) {
      setFormData({
        name: scrapedData.title,
        seller: scrapedData.seller,
        category: guessCategory(scrapedData.title),
        priceCny: 0,
        description: ''
      });
      setImages(scrapedData.images);
    } else {
      // Fallback manuel si le proxy échoue
      setErrorMsg("Impossible d'extraire les données automatiquement (Protection Yupoo). Veuillez remplir manuellement.");
    }
    setStatus('REVIEW');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: uuidv4(),
      yupooUrl: url,
      name: formData.name || 'Produit sans nom',
      category: formData.category,
      seller: formData.seller,
      priceCny: formData.priceCny,
      priceEur: cnyToEur(formData.priceCny, rate),
      mainImage: images.length > 0 ? images[mainImageIndex] : '',
      images: images,
      description: formData.description,
      favorite: false,
      createdAt: Date.now(),
      resalePrice: 0, shippingCost: 0, otherCosts: 0
    };
    await addProduct(newProduct);
    navigate('/catalog');
  };

  const categories: Category[] = ['T-shirt', 'Pull', 'Manteau', 'Jean', 'Jogging', 'Short', 'Chaussure', 'Bijou', 'Montre', 'Autre'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Importer depuis Yupoo</h2>
      
      {status === 'IDLE' && (
        <form onSubmit={handleFetch} className="bg-dark-800 p-8 rounded-xl border border-dark-700 shadow-lg">
          <div className="flex gap-4">
            <input 
              type="url" required value={url} onChange={e => setUrl(e.target.value)}
              className="flex-1 bg-dark-900 border border-dark-700 rounded-lg p-4 text-white focus:border-blue-500 outline-none transition-colors"
              placeholder="Collez le lien de l'album Yupoo ici..."
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Search size={20} /> Analyser
            </button>
          </div>
          {errorMsg && <p className="text-red-400 mt-4 flex items-center gap-2"><AlertCircle size={16}/> {errorMsg}</p>}
        </form>
      )}

      {status === 'LOADING' && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p>Analyse de la page Yupoo en cours via proxy...</p>
          <p className="text-sm mt-2 text-dark-500">Cela peut prendre quelques secondes.</p>
        </div>
      )}

      {status === 'REVIEW' && (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne Gauche : Données */}
          <div className="space-y-4 bg-dark-800 p-6 rounded-xl border border-dark-700">
            {errorMsg && (
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 text-sm mb-4">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nom du produit</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Catégorie</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Prix (¥ CNY)</label>
                <input type="number" min="0" step="0.1" value={formData.priceCny} onChange={e => setFormData({...formData, priceCny: Number(e.target.value)})} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3" />
                <p className="text-xs text-gray-500 mt-1">≈ {cnyToEur(formData.priceCny, rate)} €</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Vendeur</label>
              <input type="text" value={formData.seller} onChange={e => setFormData({...formData, seller: e.target.value})} className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3" />
            </div>
            
            <div className="pt-4 flex gap-4">
              <button type="button" onClick={() => setStatus('IDLE')} className="flex-1 bg-dark-700 p-3 rounded-lg">Annuler</button>
              <button type="submit" className="flex-1 bg-blue-600 p-3 rounded-lg font-medium text-white">Ajouter au Catalogue</button>
            </div>
          </div>

          {/* Colonne Droite : Galerie */}
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="text-sm text-gray-400 mb-4">Photos récupérées ({images.length})</h3>
            
            {images.length > 0 ? (
              <div className="space-y-4">
                {/* Image Principale (avec referrerPolicy pour contrer Yupoo) */}
                <div className="aspect-square bg-dark-900 rounded-lg border border-dark-700 overflow-hidden flex items-center justify-center">
                  <img src={images[mainImageIndex]} alt="Main" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                {/* Grille de sélection */}
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button key={idx} type="button" onClick={() => setMainImageIndex(idx)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${mainImageIndex === idx ? 'border-blue-500' : 'border-transparent'}`}>
                      <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-dark-900 rounded-lg border border-dark-700 flex flex-col items-center justify-center text-gray-500">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <p className="text-sm text-center px-4">Aucune image récupérée automatiquement.<br/>Ajoutez-les manuellement plus tard.</p>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}