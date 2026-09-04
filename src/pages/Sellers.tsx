import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Store, Search, ExternalLink, Plus, Edit, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Seller } from '../types';

export default function Sellers() {
  const { sellers, products, addSeller, updateSeller, deleteSeller } = useStore();
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [formData, setFormData] = useState({ name: '', yupooUrl: '', description: '' });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredSellers = sellers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.yupooUrl.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (seller?: Seller) => {
    if (seller) {
      setEditingSeller(seller);
      setFormData({ name: seller.name, yupooUrl: seller.yupooUrl, description: seller.description || '' });
    } else {
      setEditingSeller(null);
      setFormData({ name: '', yupooUrl: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.yupooUrl) return;
    
    if (editingSeller) {
      updateSeller({ ...editingSeller, ...formData });
    } else {
      addSeller({
        id: Date.now().toString(),
        ...formData,
        createdAt: Date.now()
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><Store className="text-accent"/> Revendeurs</h1>
          <p className="text-sm text-muted mt-1">Retrouvez rapidement vos vendeurs Yupoo.</p>
        </div>
        <button onClick={() => openModal()} className="w-full md:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
          <Plus size={18} /> Ajouter un revendeur
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un revendeur..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 md:h-14 bg-surface border border-border rounded-xl pl-12 pr-4 text-sm md:text-base text-primary focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredSellers.map(seller => {
          const productCount = products.filter(p => p.sellerId === seller.id || (p.seller && p.seller.toLowerCase() === seller.name.toLowerCase())).length;

          return (
            <div key={seller.id} className="bg-surface rounded-2xl border border-border p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Link to={`/sellers/${seller.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{seller.name}</h3>
                    <p className="text-xs text-muted mt-0.5 truncate max-w-[150px]">{seller.yupooUrl.replace('https://', '')}</p>
                  </div>
                </Link>
                
                <div className="flex gap-2">
                  <button onClick={() => openModal(seller)} className="p-1.5 text-muted hover:text-primary"><Edit size={16}/></button>
                  <button onClick={() => setDeletingId(seller.id)} className="p-1.5 text-muted hover:text-danger"><Trash2 size={16}/></button>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                <span className="text-sm font-medium text-muted">{productCount} produits</span>
                <a href={seller.yupooUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium">
                  Voir Yupoo <ExternalLink size={14}/>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg">{editingSeller ? 'Modifier' : 'Ajouter'} un revendeur</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-primary"><X size={20}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Nom du revendeur</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:border-accent" placeholder="Ex: KickWho" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Lien Yupoo</label>
                <input type="url" value={formData.yupooUrl} onChange={e => setFormData({...formData, yupooUrl: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:border-accent" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Description (optionnelle)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:border-accent min-h-[80px]" />
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-primary font-medium hover:bg-surface-hover">Annuler</button>
              <button onClick={handleSubmit} disabled={!formData.name || !formData.yupooUrl} className="flex-1 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 text-center">
            <Trash2 size={40} className="mx-auto text-danger mb-4" />
            <h3 className="font-bold text-lg mb-2">Supprimer ce revendeur ?</h3>
            <p className="text-sm text-muted mb-6">Cette action supprimera uniquement le revendeur de votre liste. Les produits associés ne seront pas supprimés.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-2.5 rounded-xl border border-border hover:bg-surface-hover font-medium">Annuler</button>
              <button onClick={() => { deleteSeller(deletingId); setDeletingId(null); }} className="flex-1 py-2.5 rounded-xl bg-danger text-white font-medium hover:bg-red-600">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}