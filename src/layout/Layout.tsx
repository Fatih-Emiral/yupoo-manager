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
      
      <aside className="hidden md:flex w-[260px] bg-surface border-r border-border flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-accent">
              <Hexagon fill="currentColor" size={28}/>
            </div>
            <span className="text-xl font-bold tracking-wide">YUPOOMGR</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname.startsWith('/sellers') && item.path === '/sellers');
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted hover:bg-surface-hover hover:text-white'}`}
              >
                <Icon size={20} className={isActive ? 'text-accent' : 'text-muted'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mb-4">
          <div className="bg-background rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-secondary">Taux de change</span>
              <span className="flex items-center gap-1.5 text-xs text-success">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div> En ligne
              </span>
            </div>
            <p className="text-lg font-bold mb-1">1 EUR = {settings.exchangeRate} CNY</p>
            <p className="text-[10px] text-muted mb-3">Mis à jour récemment</p>
            <Link to="/settings" className="block w-full py-2 text-center text-sm font-medium bg-surface hover:bg-surface-hover rounded-lg transition-colors border border-border">
              Modifier le taux
            </Link>
          </div>
        </div>

        <div className="px-4 pb-6">
          <button className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors w-full p-2">
            <ArrowLeftToLine size={16} /> Réduire
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-background z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            <p className="text-sm text-muted mt-0.5">Aperçu général de votre catalogue</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/import" className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
              <Plus size={18} /> Importer un lien Yupoo
            </Link>
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-sm">FE</div>
          </div>
        </header>

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

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8 scroll-smooth-ios" id="main-content">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.filter(i => i.path !== '/import' && i.path !== '/settings' && i.path !== '/trash').map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname.startsWith('/sellers') && item.path === '/sellers');
            return (
              <Link key={item.path} to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-accent' : 'text-muted'}`}
              >
                <Icon size={22} className={isActive ? 'fill-accent/20' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
    </div>
  );
}