import { useStore } from '../store/useStore';
import { Package, Star, Tags, Users, ArrowRight, Plus, Calculator } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { products } = useStore();

  const recentProducts = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const favoriteProducts = products.filter(p => p.favorite).slice(0, 4);

  const StatCard = ({ icon: Icon, label, value, subtext, colorClass }: any) => (
    <div className="bg-surface p-4 md:p-6 rounded-2xl border border-border flex items-center gap-3 md:gap-5">
      <div className={`p-3 md:p-4 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xl md:text-2xl font-bold">{value}</p>
        <p className="text-xs md:text-sm text-muted">{label}</p>
        <p className="text-[10px] md:text-xs text-success mt-0.5 md:mt-1 flex items-center gap-1">↗ {subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      
      {/* Titre affiché uniquement sur mobile (le layout desktop gère déjà son titre) */}
      <div className="block md:hidden mb-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Aperçu général de votre catalogue</p>
      </div>
      
      {/* Statistiques : 2 colonnes mobile, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon={Package} label="Produits" value={products.length} subtext="+12 ce mois" colorClass="bg-accent/20 text-accent" />
        <StatCard icon={Star} label="Favoris" value={favoriteProducts.length} subtext="+5 ce mois" colorClass="bg-success/20 text-success" />
        <StatCard icon={Tags} label="Catégories" value={new Set(products.map(p=>p.category)).size} subtext="Total" colorClass="bg-warning/20 text-warning" />
        <StatCard icon={Users} label="Vendeurs" value={new Set(products.map(p=>p.seller).filter(Boolean)).size} subtext="+2 ce mois" colorClass="bg-blue-500/20 text-blue-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        
        {/* Ajouts récents */}
        <div className="xl:col-span-2 bg-surface rounded-2xl border border-border p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="font-bold flex items-center gap-2 text-sm md:text-base"><Package size={18} className="text-accent"/> Ajouts récents</h2>
            <Link to="/catalog" className="text-muted cursor-pointer hover:text-primary"><ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        {/* Favoris */}
        <div className="bg-surface rounded-2xl border border-border p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="font-bold flex items-center gap-2 text-sm md:text-base"><Star size={18} className="text-warning"/> Produits favoris</h2>
            <Link to="/favorites" className="text-muted cursor-pointer hover:text-primary"><ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {favoriteProducts.map(p => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>

      </div>

      {/* Analyse, Activité et Raccourcis empilés en 1 colonne (ou 3 sur desktop si adapté) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Analyse */}
        <div className="bg-surface rounded-2xl border border-border p-4 md:p-6">
          <h2 className="font-bold mb-4 md:mb-6 flex items-center gap-2 text-sm md:text-base">Analyse de rentabilité</h2>
          {products.length === 0 ? (
            <div className="flex items-center justify-between mt-4 md:mt-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[10px] md:border-[14px] border-border"></div>
              <div className="text-right">
                <p className="text-xs md:text-sm text-muted">ROI moyen global</p>
                <p className="text-3xl md:text-4xl font-bold mt-1 text-muted">0%</p>
                <p className="text-muted text-[10px] md:text-sm font-medium mt-1">En attente de données</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-4 md:mt-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[10px] md:border-[14px] border-background border-t-success border-r-warning border-b-success"></div>
              <div className="text-right">
                <p className="text-xs md:text-sm text-muted">ROI moyen global</p>
                <p className="text-3xl md:text-4xl font-bold mt-1">
                  {(products.reduce((acc, p) => acc + (Number((p as any).roi) || 0), 0) / products.length).toFixed(1)}%
                </p>
                <p className="text-success text-[10px] md:text-sm font-medium mt-1">Basé sur {products.length} produits</p>
              </div>
            </div>
          )}
        </div>

        {/* Activité */}
        <div className="bg-surface rounded-2xl border border-border p-4 md:p-6">
           <h2 className="font-bold mb-4 md:mb-6 text-sm md:text-base">Activité récente</h2>
           <div className="space-y-4 md:space-y-5">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 bg-success/10 text-success rounded-xl"><Plus size={18}/></div>
                <div className="flex-1"><p className="text-xs md:text-sm font-medium">Nouveau produit ajouté</p><p className="text-[10px] md:text-xs text-muted mt-0.5">Nike Tech Fleece</p></div>
                <span className="text-[10px] md:text-xs text-muted">Il y a 2h</span>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 bg-warning/10 text-warning rounded-xl"><Star size={18}/></div>
                <div className="flex-1"><p className="text-xs md:text-sm font-medium">Ajouté aux favoris</p><p className="text-[10px] md:text-xs text-muted mt-0.5">Rolex Datejust</p></div>
                <span className="text-[10px] md:text-xs text-muted">Il y a 3h</span>
              </div>
           </div>
        </div>

        {/* Raccourcis */}
        <div className="bg-surface rounded-2xl border border-border p-4 md:p-6">
          <h2 className="font-bold mb-4 md:mb-6 text-sm md:text-base">Raccourcis</h2>
          <div className="space-y-3">
            <Link to="/import" className="flex items-center gap-3 md:gap-4 p-3 bg-background rounded-xl border border-border cursor-pointer active:scale-[0.98] md:hover:border-accent transition-all group">
              <div className="p-2 md:p-2.5 bg-accent/10 text-accent rounded-xl md:group-hover:bg-accent md:group-hover:text-white transition-colors"><Plus size={18}/></div>
              <div><p className="text-sm font-medium">Importer un produit</p></div>
            </Link>
            <Link to="/calculator" className="flex items-center gap-3 md:gap-4 p-3 bg-background rounded-xl border border-border cursor-pointer active:scale-[0.98] md:hover:border-blue-500 transition-all group">
              <div className="p-2 md:p-2.5 bg-blue-500/10 text-blue-500 rounded-xl md:group-hover:bg-blue-500 md:group-hover:text-white transition-colors"><Calculator size={18}/></div>
              <div><p className="text-sm font-medium">Calculateur de rentabilité</p></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}