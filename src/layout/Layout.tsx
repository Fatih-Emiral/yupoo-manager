import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Grid, Star, Link as LinkIcon, Calculator, Settings, Plus, Hexagon, ArrowLeftToLine, Store, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Layout() {
  const location = useLocation();
  const { settings } = useStore();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/catalog', icon: Grid, label: 'Catalogue' },
    { path: '/sellers', icon: Store, label: 'Revendeurs' },
    { path: '/favorites', icon: Star, label: 'Favoris' },
    { path: '/import', icon: LinkIcon, label: 'Importer' },
    { path: '/calculator', icon: Calculator, label: 'Calculateur' },
    { path: '/trash', icon: Trash2, label: 'Corbeille' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  const getPageTitle = () => navItems.find(item => item.path === location.pathname)?.label || 'YUPOOMGR';

  return (
    <div className="flex h-[100dvh] bg-background text-primary font-sans overflow-hidden">
      
      {/* SIDEBAR AFFINÉE (240px au lieu de 260px) */}
      <aside className="hidden md:flex w-[240px] bg-surface border-r border-border flex-col z-20">
        <div className="h-16 flex items-center px-5 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="text-accent"><Hexagon fill="currentColor" size={24}/></div>
            <span className="text-lg font-bold tracking-wide">YUPOOMGR</span>
          </Link>
        </div>

        {/* Onglets plus compacts (py-2.5, gap réduit) */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname.startsWith('/sellers') && item.path === '/sellers');
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted hover:bg-surface-hover hover:text-white'}`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'text-muted'} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Widget Taux de change compact */}
        <div className="px-3 mb-3">
          <div className="bg-background rounded-lg p-3 border border-border">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-secondary">Taux de change</span>
              <span className="flex items-center gap-1 text-[10px] text-success">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div> En ligne
              </span>
            </div>
            <p className="text-base font-bold mb-0.5">1 EUR = {settings.exchangeRate} CNY</p>
            <p className="text-[9px] text-muted mb-2">Mis à jour récemment</p>
            <Link to="/settings" className="block w-full py-1.5 text-center text-xs font-medium bg-surface hover:bg-surface-hover rounded-md transition-colors border border-border">
              Modifier
            </Link>
          </div>
        </div>

        <div className="px-3 pb-4">
          <button className="flex items-center gap-2 text-xs text-muted hover:text-white transition-colors w-full p-2">
            <ArrowLeftToLine size={14} /> Réduire
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-[#0b0c10]">
        
        {/* HEADER DESKTOP AFFINÉ (h-16 au lieu de h-20, px-6) */}
        <header className="hidden md:flex h-16 items-center justify-between px-6 bg-[#0b0c10] z-10 sticky top-0">
          <div>
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
            <p className="text-xs text-muted mt-0.5">Aperçu général de votre catalogue</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/import" className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> Importer un lien Yupoo
            </Link>
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-xs">FE</div>
          </div>
        </header>

        {/* HEADER MOBILE (Inchangé) */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-surface border-b border-border pt-[max(0.75rem,env(safe-area-inset-top))] sticky top-0 z-10">
          <div className="flex items-center gap-2 text-accent">
            <Hexagon size={24} fill="currentColor" />
            <span className="font-bold text-primary tracking-tight text-lg">YUPOOMGR</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/import" className="p-2 bg-accent text-white rounded-full active:scale-95 transition-transform">
              <Plus size={18} />
            </Link>
            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center font-bold text-xs">FE</div>
          </div>
        </header>

        {/* PADDINGS RÉDUITS (p-4 md:p-6 au lieu de p-8) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6 scroll-smooth-ios custom-scrollbar" id="main-content">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex justify-around items-center h-14 px-1">
          {navItems.filter(i => i.path !== '/import' && i.path !== '/settings' && i.path !== '/trash').map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname.startsWith('/sellers') && item.path === '/sellers');
            return (
              <Link key={item.path} to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-accent' : 'text-muted'}`}
              >
                <Icon size={20} className={isActive ? 'fill-accent/20' : ''} />
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
    </div>
  );
}