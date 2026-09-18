import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Search, 
  ChevronDown, 
  Menu, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Check,
  User as UserIcon,
  LogOut,
  GraduationCap,
  Store
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  currentTab: string;
  onToggleMobileMenu: () => void;
  onOpenPublicProfile: () => void;
  onOpenLandingPage?: () => void;
  onOpenTrainings?: () => void;
  onLogout?: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentTab,
  onToggleMobileMenu,
  onOpenPublicProfile,
  onOpenLandingPage,
  onOpenTrainings,
  onLogout,
  searchTerm = '',
  onSearchChange,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dateRange, setDateRange] = useState('Últimos 30 días');

  const getHeaderTitles = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: `Hola, ${user.nombre.split(' ')[0]} 👋`,
          subtitle: 'Aquí tienes un resumen de cómo va tu Bit.',
        };
      case 'profile':
        return {
          title: 'Perfil del cliente',
          subtitle: 'Así se ve tu perfil público cuando alguien escanea tu Bit o entra a tu link.',
        };
      case 'leads':
        return {
          title: 'Leads',
          subtitle: 'Personas que han conectado con tu Bit. Gestiona, nutre y convierte.',
        };
      case 'crm':
        return {
          title: 'Pipeline de ventas',
          subtitle: 'Visualiza y gestiona tus oportunidades.',
        };
      case 'nfc':
        return {
          title: 'NFC / Hardware Bit',
          subtitle: 'Sticker holográfico inteligente con chip NTAG213 y enlace dinámico.',
        };
      case 'analytics':
        return {
          title: 'Analytics & Rendimiento',
          subtitle: 'Métricas detalladas de interacciones, conversiones y canales.',
        };
      case 'branding':
        return {
          title: 'Branding & Identidad',
          subtitle: 'Personaliza los colores, estilo de tu perfil público y acabados.',
        };
      default:
        return {
          title: 'Panel Bit',
          subtitle: 'Gestión integral de networking y contactos.',
        };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        
        {/* Izquierda: Botón móvil + Título dinámico */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Centro / Buscador contextual (en Leads o CRM) */}
        {(currentTab === 'leads' || currentTab === 'crm') && onSearchChange && (
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar nombre, email, empresa..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>
        )}

        {/* Derecha: Acciones rápidas, Selector de Fecha, Notificaciones y Perfil */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Badge Mes Gratis & Capacitaciones */}
          {onOpenTrainings && (
            <button
              onClick={onOpenTrainings}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-purple-700 text-xs font-bold transition cursor-pointer"
              title="Capacitaciones en vivo incluidas en tu mes gratis"
            >
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Mes Gratis: 27 días</span>
              <span className="hidden md:inline px-1.5 py-0.5 rounded bg-purple-200/70 text-[10px] text-purple-900 font-extrabold">
                Capacitaciones
              </span>
            </button>
          )}

          {/* Botón rápido para ver la landing page (tienda) */}
          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              title="Ver la tienda / Landing page pública"
            >
              <Store className="w-3.5 h-3.5 text-slate-600" />
              <span>Ver Landing</span>
            </button>
          )}

          {/* Selector de Rango de Fechas */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300 transition">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </div>

          {/* Notificaciones */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Dropdown Notificaciones */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900">Notificaciones</span>
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Marcar leídas</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">¡Nuevo lead registrado!</p>
                      <p className="text-slate-600 text-[11px]">María González escaneó tu Bit en Restaurante</p>
                      <span className="text-[10px] text-slate-400">Hace 2 minutos</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-50 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-700">QR escaneado</p>
                      <p className="text-slate-500 text-[11px]">Carlos Ramírez vio tu perfil en Antigua</p>
                      <span className="text-[10px] text-slate-400">Hace 12 minutos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menú de Usuario: Alessandra Balconi */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
            >
              <img
                src={user.avatarUrl}
                alt={user.nombre}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
              />
              <span className="hidden sm:inline-block font-bold text-xs text-slate-800 tracking-tight">
                {user.nombre}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Usuario */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{user.nombre}</p>
                  <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full w-fit">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>Mes Gratis • 27 días restantes</span>
                  </div>
                </div>

                <div className="py-1">
                  {onOpenTrainings && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenTrainings();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-purple-700 hover:bg-purple-50 transition text-left cursor-pointer font-semibold"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      <span>Capacitaciones en Vivo</span>
                    </button>
                  )}
                  {onOpenLandingPage && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenLandingPage();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ver Landing Page (Tienda)</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenPublicProfile();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ver perfil público en vivo</span>
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer font-semibold border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cerrar Sesión</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
