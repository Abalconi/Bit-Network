import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Radio, 
  Users, 
  Contact, 
  Kanban, 
  TrendingUp, 
  Palette, 
  Settings,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Store,
  LogOut
} from 'lucide-react';
import { BitLogo } from './BitLogo';
import { HolographicSticker } from './HolographicSticker';

export type NavTabId = 
  | 'dashboard' 
  | 'profile' 
  | 'nfc' 
  | 'leads' 
  | 'crm' 
  | 'analytics' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  leadsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenPublicProfile: () => void;
  onOpenTrainings?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  leadsCount,
  isOpenMobile,
  onCloseMobile,
  onOpenPublicProfile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTabId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile' as NavTabId, label: 'Mi perfil', icon: User },
    { id: 'nfc' as NavTabId, label: 'NFC / Bit', icon: Radio },
    { id: 'leads' as NavTabId, label: 'Leads', icon: Users, badge: leadsCount },
    { id: 'crm' as NavTabId, label: 'CRM Pipeline', icon: Kanban },
    { id: 'analytics' as NavTabId, label: 'Analytics', icon: TrendingUp },
    { id: 'settings' as NavTabId, label: 'Configuración', icon: Settings },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#090e1a] text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera del Sidebar con Logo Bit */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <div 
            onClick={() => { onSelectTab('dashboard'); onCloseMobile(); }}
            className="cursor-pointer group flex items-center gap-2"
          >
            <BitLogo size="lg" light={true} />
          </div>
        </div>

        {/* Lista de Navegación Principal */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1b253b] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Widget Inferior: "Tu Bit" */}
        <div className="p-3 border-t border-slate-800/80">
          <div
            onClick={() => {
              onSelectTab('nfc');
              onCloseMobile();
            }}
            className="group flex items-center justify-between p-2.5 rounded-2xl bg-[#131b2e] hover:bg-[#18233c] border border-slate-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <HolographicSticker size="sm" interactive={false} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#131b2e]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight">Tu Bit</span>
                  <span className="text-[10px] font-medium text-emerald-400">• Activo</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                  bit.me/alessandra
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
          </div>

          {/* Botón rápido para previsualizar como cliente externo */}
          <button
            onClick={onOpenPublicProfile}
            className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Ver perfil del cliente</span>
          </button>
        </div>
      </aside>
    </>
  );
};
