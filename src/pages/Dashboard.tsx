import { useStore } from '../store/useStore';
import { Package, Star, Tags, Users, ArrowRight, Plus, Calculator } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { products, favoriteProducts, sellers } = useStore();

  const recentProducts = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const favProductsList = favoriteProducts.slice(0, 4);
  
  const topRoiProducts = [...products]
    .filter(p => p.roi !== undefined)
    .sort((a, b) => (b.roi || 0) - (a.roi || 0))
    .slice(0, 5);

  const StatCard = ({ icon: Icon, label, value, subtext, colorClass, strokeClass }: any) => (
    <div className="bg-surface p-4 rounded-xl border border-border flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colorClass}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xl font-bold leading-tight">{value}</p>
          <p className="text-xs text-muted">{label}</p>
          <p className="text-[10px] text-success mt-0.5 flex items-center gap-0.5">↗ {subtext}</p>
        </div>
      </div>
      {/* Mini graphique décoratif fidèle à la référence */}
      <svg className={`w-12 h-6 ${strokeClass}`} viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="0,15 15,5 25,10 40,0 50,5"></polyline>
      </svg>
    </div>
  );

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      
      <div className="block md:hidden mb-2">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-xs text-muted mt-0.5">Aperçu général de votre catalogue</p>
      </div>
      
      {/* Ligne 1 : Statistiques ultra-compactes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Package} label="Produits" value={products.length} subtext="+12 ce mois" colorClass="bg-accent/10 text-accent" strokeClass="text-accent" />
        <StatCard icon={Star} label="Favoris" value={favoriteProducts.length} subtext="+5 ce mois" colorClass="bg-success/10 text-success" strokeClass="text-success" />
        <StatCard icon={Tags} label="Catégories" value={new Set(products.map(p=>p.category)).size} subtext="Total" colorClass="bg-warning/10 text-warning" strokeClass="text-warning" />
        <StatCard icon={Users} label="Vendeurs" value={sellers.length} subtext="+2 ce mois" colorClass="bg-blue-500/10 text-blue-500" strokeClass="text-blue-500" />
      </div>

      {/* Ligne 2 : Grilles de produits (Espacements réduits p-4) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        <div className="xl:col-span-2 bg-surface rounded-xl border border-border p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2 text-sm"><Package size={16} className="text-accent"/> Ajouts récents</h2>
            <Link to="/catalog" className="text-muted cursor-pointer hover:text-primary"><ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2 text-sm"><Star size={16} className="text-warning"/> Produits favoris</h2>
            <Link to="/favorites" className="text-muted cursor-pointer hover:text-primary"><ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {favProductsList.map(p => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>

      </div>

      {/* Ligne 3 : Analyse enrichie avec la liste Top Produits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Analyse ROI + Top Produits */}
        <div className="bg-surface rounded-xl border border-border p-4 lg:col-span-1 flex flex-col xl:flex-row gap-6">
          <div className="flex-1">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-sm">Analyse de rentabilité</h2>
            {products.length === 0 ? (
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-20 rounded-full border-[8px] border-border shrink-0"></div>
                <div>
                  <p className="text-xs text-muted">ROI moyen global</p>
                  <p className="text-2xl font-bold mt-0.5 text-muted">0%</p>
                  <p className="text-muted text-[9px] font-medium mt-0.5">En attente</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-20 rounded-full border-[8px] border-background border-t-success border-r-warning border-b-success shrink-0"></div>
                <div>
                  <p className="text-xs text-muted">ROI moyen global</p>
                  <p className="text-2xl font-bold mt-0.5">
                    {(products.reduce((acc, p) => acc + (Number((p as any).roi) || 0), 0) / products.length).toFixed(1)}%
                  </p>
                  <p className="text-success text-[10px] font-medium mt-0.5">+{products.length} produits</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Liste Top ROI inspirée de la référence */}
          <div className="flex-1 border-t xl:border-t-0 xl:border-l border-border pt-4 xl:pt-0 xl:pl-4">
            <h3 className="text-xs font-semibold text-muted mb-3">Top produits (ROI)</h3>
            <div className="space-y-2.5">
              {topRoiProducts.length > 0 ? topRoiProducts.map((p, idx) => (
                <div key={p.id} className="flex justify-between items-center text-xs">
                  <span className="truncate max-w-[120px] text-primary">{idx + 1}. {p.name}</span>
                  <span className="font-medium text-success">{p.roi}%</span>
                </div>
              )) : (
                <div className="text-xs text-muted">Aucune donnée ROI calculée.</div>
              )}
            </div>
          </div>
        </div>

        {/* Activité */}
        <div className="bg-surface rounded-xl border border-border p-4">
           <div className="flex justify-between items-center mb-4">
             <h2 className="font-bold text-sm">Activité récente</h2>
             <ArrowRight size={14} className="text-muted" />
           </div>
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 text-success rounded-lg"><Plus size={14}/></div>
                <div className="flex-1"><p className="text-xs font-medium">Nouveau produit ajouté</p><p className="text-[10px] text-muted mt-0.5">Nike Tech Fleece Hoodie</p></div>
                <span className="text-[10px] text-muted">Il y a 2h</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 text-warning rounded-lg"><Star size={14}/></div>
                <div className="flex-1"><p className="text-xs font-medium">Ajouté aux favoris</p><p className="text-[10px] text-muted mt-0.5">Supreme Box Logo Tee</p></div>
                <span className="text-[10px] text-muted">Il y a 3h</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Calculator size={14}/></div>
                <div className="flex-1"><p className="text-xs font-medium">Calcul effectué</p><p className="text-[10px] text-muted mt-0.5">Jordan 4 Black Cat</p></div>
                <span className="text-[10px] text-muted">Il y a 5h</span>
              </div>
           </div>
        </div>

        {/* Raccourcis compacts */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h2 className="font-bold mb-4 text-sm">Raccourcis</h2>
          <div className="space-y-2">
            <Link to="/import" className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border hover:border-accent transition-all group">
              <div className="p-1.5 bg-accent/10 text-accent rounded-md group-hover:bg-accent group-hover:text-white transition-colors"><Plus size={16}/></div>
              <div><p className="text-xs font-medium">Importer un produit</p><p className="text-[9px] text-muted mt-0.5">Ajouter un lien Yupoo</p></div>
            </Link>
            <Link to="/calculator" className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border hover:border-blue-500 transition-all group">
              <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md group-hover:bg-blue-500 group-hover:text-white transition-colors"><Calculator size={16}/></div>
              <div><p className="text-xs font-medium">Calculateur</p><p className="text-[9px] text-muted mt-0.5">Calculer votre rentabilité</p></div>
            </Link>
            <Link to="/catalog" className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border hover:border-success transition-all group">
              <div className="p-1.5 bg-success/10 text-success rounded-md group-hover:bg-success group-hover:text-white transition-colors"><Package size={16}/></div>
              <div><p className="text-xs font-medium">Voir le catalogue</p><p className="text-[9px] text-muted mt-0.5">Parcourir tous les produits</p></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}