import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface CrmAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userCredentials: { email: string; nombre: string }) => void;
}

export const CrmAuthModal: React.FC<CrmAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'activar'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Activación mes gratis form state
  const [actNombre, setActNombre] = useState('');
  const [actEmail, setActEmail] = useState('');
  const [actPassword, setActPassword] = useState('');
  const [actTelefono, setActTelefono] = useState('');
  const [actFechaInicio, setActFechaInicio] = useState<'hoy' | 'diferido'>('hoy');
  const [actCodigoBit, setActCodigoBit] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: loginEmail || 'alessandra@bit.gt',
        nombre: 'Alessandra Balconi',
      });
      onClose();
    }, 700);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: 'alessandra@bit.gt',
        nombre: 'Alessandra Balconi',
      });
      onClose();
    }, 500);
  };

  const handleActivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: actEmail || 'cliente@bit.gt',
        nombre: actNombre || 'Nuevo Usuario BIT',
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="bg-[#0b101d] text-white rounded-3xl border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.3)] w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Portal */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0e1424]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-[1.5px] shadow-lg">
              <div className="w-full h-full rounded-2xl bg-[#090d18] flex items-center justify-center">
                <Lock className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Portal Clientes CRM
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold">
                  Web App
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Plataforma de gestión de contactos y ventas inteligentes
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestañas: Iniciar Sesión / Activar Mes Gratis */}
        <div className="px-6 pt-4 bg-[#0e1424]/60 border-b border-white/10">
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('login')}
              className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={() => setActiveTab('activar')}
              className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'activar'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Activar Mes Gratis</span>
            </button>
          </div>

          <div className="py-2.5 text-center">
            <p className="text-[11px] text-slate-400">
              {activeTab === 'login'
                ? 'Ingresa con tu usuario y contraseña registrados para acceder a tu panel.'
                : 'El CRM se da gratis 1 mes, incluye capacitaciones en vivo y puedes activarlo cuando quieras.'}
            </p>
          </div>
        </div>

        {/* Contenido según pestaña */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* 1. TAB: INICIAR SESIÓN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Usuario o Correo Electrónico</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@bit.gt o tu usuario"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Contraseña</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Introduce tu contraseña"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-98 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Verificando credenciales...</span>
                ) : (
                  <>
                    <span>Entrar a mi CRM</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-white/10 text-center">
                <span className="text-[11px] text-slate-400 block mb-2">
                  ¿Quieres probar el CRM inmediatamente?
                </span>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Acceso Rápido Demo (Alessandra Balconi)</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200/90 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p>
                  Tus datos de prospectos y notas comerciales están cifrados y resguardados para tu uso privado.
                </p>
              </div>

            </form>
          )}

          {/* 2. TAB: ACTIVAR MES GRATIS */}
          {activeTab === 'activar' && (
            <form onSubmit={handleActivateSubmit} className="space-y-4">
              
              {/* Resumen de Beneficios */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#151c30] to-pink-950/40 border border-purple-500/30 space-y-2">
                <p className="text-xs font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Beneficio Incluido con tu Compra BIT:</span>
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span><strong>1 Mes Gratis de CRM Web App</strong> (gestión ilimitada de leads y pipeline)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span><strong>Capacitaciones Semanales en Vivo</strong> (ventas y prospección)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span><strong>Flexibilidad:</strong> Puedes activar tus 30 días cuando quieras</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tu Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={actNombre}
                  onChange={(e) => setActNombre(e.target.value)}
                  placeholder="Ej. Juan Morales"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico (para tu usuario) *</label>
                <input
                  type="email"
                  required
                  value={actEmail}
                  onChange={(e) => setActEmail(e.target.value)}
                  placeholder="juan@ejemplo.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Contraseña para tu CRM *</label>
                  <input
                    type="password"
                    required
                    value={actPassword}
                    onChange={(e) => setActPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">WhatsApp de contacto</label>
                  <input
                    type="tel"
                    value={actTelefono}
                    onChange={(e) => setActTelefono(e.target.value)}
                    placeholder="+502 5555-1234"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              </div>

              {/* Selector de Fecha de Activación */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  ¿Cuándo deseas iniciar tus 30 días gratis?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActFechaInicio('hoy')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      actFechaInicio === 'hoy'
                        ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold">Activar Hoy Mismo</span>
                    <span className="text-[10px] text-slate-400 font-normal">Empieza a usar el CRM ahora</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActFechaInicio('diferido')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      actFechaInicio === 'diferido'
                        ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold">Al Recibir mi BIT</span>
                    <span className="text-[10px] text-slate-400 font-normal">Tus 30 días inician al recibir</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.01] active:scale-98 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Activando tu mes gratis...</span>
                ) : (
                  <>
                    <span>Activar 1 Mes Gratis y Entrar al CRM</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Sin tarjeta de crédito obligatoria para activar tu prueba. Incluye acceso a capacitaciones.
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
