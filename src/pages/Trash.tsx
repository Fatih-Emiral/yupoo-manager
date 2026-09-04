import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, RefreshCcw, AlertTriangle } from 'lucide-react';

export default function Trash() {
  const { trashedProducts, restoreProduct, hardDeleteProduct, emptyTrash } = useStore();
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><Trash2 className="text-danger"/> Corbeille</h1>
          <p className="text-sm text-muted mt-1">{trashedProducts.length} produit(s) dans la corbeille.</p>
        </div>
        {trashedProducts.length > 0 && (
          <button
            onClick={() => setConfirmEmpty(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            <Trash2 size={18} /> Vider la corbeille
          </button>
        )}
      </div>

      {confirmEmpty && (
        <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-danger">
            <AlertTriangle size={32} />
            <div>
              <p className="font-bold">Suppression définitive</p>
              <p className="text-sm opacity-90">Voulez-vous vraiment vider toute la corbeille ? Cette action est irréversible.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setConfirmEmpty(false)} className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-danger/20 text-danger hover:bg-danger/10 font-medium">Annuler</button>
            <button onClick={() => { emptyTrash(); setConfirmEmpty(false); }} className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-danger text-white hover:bg-red-600 font-medium">Confirmer</button>
          </div>
        </div>
      )}

      {trashedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
           {trashedProducts.map(product => (
              <div key={product.id} className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col opacity-75 hover:opacity-100 transition-opacity">
                 <img src={product.mainImage} alt={product.name} className="w-full h-40 md:h-48 object-cover grayscale" />
                 <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted mt-1">{product.priceCny} ¥</p>
                    <div className="mt-auto pt-4 flex gap-2">
                       <button onClick={() => restoreProduct(product.id)} className="flex-1 flex justify-center py-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-primary transition-colors" title="Restaurer">
                          <RefreshCcw size={16} />
                       </button>
                       <button onClick={() => hardDeleteProduct(product.id)} className="flex-1 flex justify-center py-2 bg-danger/10 hover:bg-danger/20 border border-danger/20 rounded-lg text-danger transition-colors" title="Supprimer définitivement">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      ) : (
         <div className="text-center py-16 bg-surface border border-border border-dashed rounded-2xl text-muted">
            <Trash2 size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium text-primary">La corbeille est vide</p>
            <p className="text-sm mt-1">Les produits supprimés apparaîtront ici avant leur suppression définitive.</p>
         </div>
      )}
    </div>
  );
}