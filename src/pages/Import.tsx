import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Link as LinkIcon, Image as ImageIcon, AlertCircle, Plus, Loader2, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Import() {
  const navigate = useNavigate();
  const { addProduct, settings, sellers } = useStore();
  
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Autre');
  const [priceCny, setPriceCny] = useState<number | ''>('');
  const [sellerId, setSellerId] = useState(''); // Nouveau système de revendeur
  const [mainImage, setMainImage] = useState('');
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);

  // Liste des catégories
  const categories = ['T-shirt', 'Pull', 'Manteau', 'Jean', 'Jogging', 'Short', 'Chaussure', 'Bijou', 'Montre', 'Autre'];

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('yupoo.com')) {
      setError('Veuillez entrer un lien Yupoo valide.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Utilisation d'un Proxy CORS public (AllOrigins) pour contourner la protection Yupoo
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');

      // Extraction du titre
      const titleEl = doc.querySelector('.showalbumheader__gallerytitle');
      const fetchedTitle = titleEl ? titleEl.textContent?.trim() : doc.title;
      if (fetchedTitle) setName(fetchedTitle);

      // Extraction des images
      const imgEls = doc.querySelectorAll('img[data-origin-src], .showalbum__children img, .image__img');
      const images: string[] = [];
      
      imgEls.forEach(img => {
        let src = img.getAttribute('data-origin-src') || img.getAttribute('src');
        if (src && !src.includes('data:image')) {
          if (src.startsWith('//')) src = 'https:' + src;
          if (!images.includes(src)) images.push(src);
        }
      });

      if (images.length > 0) {
        setMainImage(images[0]);
        setFetchedImages(images);
      } else {
        setError('Aucune image trouvée sur cette page.');
      }
    } catch (err) {
      setError('Impossible d\'extraire les données automatiquement (Protection Yupoo). Veuillez remplir manuellement.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !url) return;

    await addProduct({
      id: Date.now().toString(),
      name,
      category: category as any,
      seller: '', // On laisse vide pour utiliser sellerId
      sellerId: sellerId || undefined,
      yupooUrl: url,
      mainImage,
      images: fetchedImages,
      priceCny: Number(priceCny) || 0,
      priceEur: Number(((Number(priceCny) || 0) / settings.exchangeRate).toFixed(2)),
      description: '',
      favorite: false,
      createdAt: Date.now(),
      resalePrice: 0,
      shippingCost: 0,
      otherCosts: 0
    });

    navigate('/catalog');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Importer</h1>
        <p className="text-muted mt-1">Ajoutez un nouveau produit à votre catalogue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Colonne Formulaire (Gauche) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Étape 1 : Le lien */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><LinkIcon size={20} className="text-accent" /> 1. Lien du produit</h2>
            <form onSubmit={handleExtract} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://vendeur.x.yupoo.com/albums/..." 
                className="flex-1 h-12 bg-background border border-border rounded-xl px-4 text-primary focus:border-accent outline-none"
                required
              />
              <button 
                type="submit" 
                disabled={loading || !url} 
                className="h-12 px-6 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Extraire'}
              </button>
            </form>
          </div>

          {/* Étape 2 : Informations */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ImageIcon size={20} className="text-accent" /> 2. Informations</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger flex items-start gap-3 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-muted mb-2">Nom du produit</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-primary focus:border-accent outline-none" placeholder="Ex: Nike Dunk Low Panda" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-muted mb-2">Catégorie</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-primary focus:border-accent outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Prix (¥ CNY)</label>
                  <input type="number" value={priceCny} onChange={e => setPriceCny(Number(e.target.value))} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-primary focus:border-accent outline-none" placeholder="Ex: 260" />
                  {priceCny && <p className="text-xs text-muted mt-1.5 ml-1">≈ {((Number(priceCny) || 0) / settings.exchangeRate).toFixed(2)} €</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Revendeur</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <select value={sellerId} onChange={e => setSellerId(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl pl-12 pr-4 text-primary focus:border-accent outline-none appearance-none">
                    <option value="">-- Aucun revendeur associé --</option>
                    {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
              <button onClick={() => navigate('/catalog')} className="px-6 py-2.5 rounded-xl border border-border hover:bg-surface-hover transition-colors font-medium">Annuler</button>
              <button onClick={handleSave} disabled={!name || !url} className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors font-medium disabled:opacity-50 flex items-center gap-2">
                <Plus size={18} /> Ajouter au catalogue
              </button>
            </div>
          </div>
        </div>

        {/* Colonne Images (Droite) */}
        <div className="lg:col-span-5">
          <div className="bg-surface border border-border rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
            <h2 className="text-lg font-bold mb-4">Photos récupérées ({fetchedImages.length})</h2>
            
            {mainImage ? (
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-background border border-border relative">
                  <img src={mainImage} alt="Principale" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-white border border-white/10">Image principale</div>
                </div>
                
                {fetchedImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {fetchedImages.slice(0, 8).map((img, idx) => (
                      <button key={idx} onClick={() => setMainImage(img)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={img} referrerPolicy="no-referrer" alt={`Miniature ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted border-2 border-dashed border-border rounded-xl bg-background/50">
                <ImageIcon size={48} className="opacity-20 mb-4" />
                <p className="text-sm">Aucune image récupérée.</p>
                <p className="text-xs opacity-70 mt-1 text-center px-4">Ajoutez un lien valide et cliquez sur Extraire.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}