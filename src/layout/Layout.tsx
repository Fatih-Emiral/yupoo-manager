import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Grid, Star, Link as LinkIcon, Calculator, Settings, Plus, Hexagon, ArrowLeftToLine } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Layout() {
  const location = useLocation();
  const { settings } = useStore();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/catalog', icon: Grid, label: 'Catalogue' },
    { path: '/favorites', icon: Star, label: 'Favoris' },
    { path: '/import', icon: LinkIcon, label: 'Importer' },
    { path: '/calculator', icon: Calculator, label: 'Calculateur' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  const getPageTitle = () => navItems.find(item => item.path === location.pathname)?.label || 'YUPOOMGR';

  return (
    <div className="flex h-screen bg-background text-primary font-sans overflow-hidden">
      
      {/* SIDEBAR UNIQUE */}
      <aside className="w-[260px] bg-surface border-r border-border flex flex-col z-20">
        
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-accent">
              <Hexagon fill="currentColor" size="{28}"/>            </div>
            <span className="text-xl font-bold tracking-wide">YUPOOMGR</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-accent/10 text-accent font-medium' 
                    : 'text-muted hover:bg-surface-hover hover:text-white'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-accent' : 'text-muted'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Widget Taux de change (Fidèle à l'image) */}
        <div className="px-4 mb-4">
          <div className="bg-background rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-secondary">Taux de change</span>
              <span className="flex items-center gap-1.5 text-xs text-success"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> En ligne</span>
            </div>
            <p className="text-lg font-bold mb-1">1 EUR = {settings.exchangeRate} CNY</p>
            <p className="text-[10px] text-muted mb-3">Mis à jour récemment</p>
            <Link to="/settings" className="block w-full py-2 text-center text-sm font-medium bg-surface hover:bg-surface-hover rounded-lg transition-colors border border-border">
              Modifier le taux
            </Link>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="px-4 pb-6">
          <button className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors w-full p-2">
            <ArrowLeftToLine size={16} /> Réduire
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL (Topbar + Pages) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR UNIQUE */}
        <header className="h-20 flex items-center justify-between px-8 bg-background z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            <p className="text-sm text-muted mt-0.5">Aperçu général de votre catalogue</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/import" 
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              <Plus size={18} /> Importer un lien Yupoo
            </Link>
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-sm">
              FE
            </div>
          </div>
        </header>

        {/* PAGES */}
        <main className="flex-1 overflow-y-auto p-8" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}