import { useStore } from '../store/useStore';
import { Package, Star, Tags, Users, ArrowRight, Plus, Calculator } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

export default function Dashboard() {
  const { products } = useStore();

  const recentProducts = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const favoriteProducts = products.filter(p => p.favorite).slice(0, 4);

  const StatCard = ({ icon: Icon, label, value, subtext, colorClass }: any) => (
    <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-5">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted">{label}</p>
        <p className="text-xs text-success mt-1 flex items-center gap-1">↗ {subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* Ligne 1 : Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Package} label="Produits" value={products.length} subtext="+12 ce mois" colorClass="bg-accent/10 text-accent" />
        <StatCard icon={Star} label="Favoris" value={favoriteProducts.length} subtext="+5 ce mois" colorClass="bg-success/10 text-success" />
        <StatCard icon={Tags} label="Catégories" value={new Set(products.map(p=>p.category)).size} subtext="Total" colorClass="bg-warning/10 text-warning" />
        <StatCard icon={Users} label="Vendeurs" value={new Set(products.map(p=>p.seller).filter(Boolean)).size} subtext="+2 ce mois" colorClass="bg-blue-500/10 text-blue-500" />
      </div>

      {/* Ligne 2 : Grilles */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Ajouts Récents (2/3) */}
        <div className="xl:col-span-2 bg-surface rounded-2xl border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold flex items-center gap-2"><Package size={18} className="text-accent"/> Ajouts récents</h2>
            <ArrowRight size={16} className="text-muted cursor-pointer hover:text-primary" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        {/* Favoris (1/3) */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold flex items-center gap-2"><Star size={18} className="text-warning"/> Produits favoris</h2>
            <ArrowRight size={16} className="text-muted cursor-pointer hover:text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {favoriteProducts.map(p => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>

      </div>

      {/* Ligne 3 : Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-6 flex items-center gap-2">Analyse de rentabilité</h2>
          <div className="flex items-center justify-between mt-8">
            <div className="w-32 h-32 rounded-full border-[14px] border-background border-t-success border-r-warning border-b-danger"></div>
            <div className="text-right">
              <p className="text-sm text-muted">ROI moyen global</p>
              <p className="text-4xl font-bold mt-1">42,6%</p>
              <p className="text-success text-sm font-medium mt-1">+8,3% ce mois</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
           <h2 className="font-bold mb-6">Activité récente</h2>
           <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-success/10 text-success rounded-xl"><Plus size={18}/></div>
                <div className="flex-1"><p className="text-sm font-medium">Nouveau produit ajouté</p><p className="text-xs text-muted mt-0.5">Nike Tech Fleece</p></div>
                <span className="text-xs text-muted">Il y a 2h</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-warning/10 text-warning rounded-xl"><Star size={18}/></div>
                <div className="flex-1"><p className="text-sm font-medium">Ajouté aux favoris</p><p className="text-xs text-muted mt-0.5">Rolex Datejust</p></div>
                <span className="text-xs text-muted">Il y a 3h</span>
              </div>
           </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-6">Raccourcis</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border cursor-pointer hover:border-accent transition-colors group">
              <div className="p-2.5 bg-accent/10 text-accent rounded-xl group-hover:bg-accent group-hover:text-white transition-colors"><Plus size={18}/></div>
              <div><p className="text-sm font-medium">Importer un produit</p></div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border cursor-pointer hover:border-blue-500 transition-colors group">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors"><Calculator size={18}/></div>
              <div><p className="text-sm font-medium">Calculateur de rentabilité</p></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}