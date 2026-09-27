import React, { useState } from 'react';
import { Lock, Mail, KeyRound, Loader2, AlertCircle, X, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { login, register } from '../services/crmApi';

export interface AuthenticatedUser {
  id: number;
  email: string;
  is_superuser?: boolean;
  subscription_status?: string;
  subscription_plan?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: AuthenticatedUser, profile?: any) => void;
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa correo y contraseña.');
      return;
    }

    if (mode === 'register' && !nombre.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        const res = await register({
          email: email.trim(),
          password,
          nombre: nombre.trim()
        });
        onSuccess(res.token, res.user, res.profile);
      } else {
        const res = await login(email.trim(), password);
        onSuccess(res.token, res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decoración superior de seguridad */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Selector de modo: Iniciar sesión vs Activar nuevo BIT */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'register' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Activar Nuevo BIT</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            mode === 'register' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-800'
          }`}>
            {mode === 'register' ? <UserPlus className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {mode === 'register' ? 'Activa tu Tarjeta BIT' : 'Acceso Propietario'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'register' 
                ? 'Tu perfil empezará 100% limpio y listo para personalizar'
                : 'Inicia sesión para gestionar prospectos y perfil'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tu Nombre Completo
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Carlos Mendoza"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {mode === 'register' ? 'Crea tu Contraseña' : 'Contraseña'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === 'register' ? 'Creando cuenta en Supabase...' : 'Verificando credenciales...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{mode === 'register' ? 'Activar mi BIT y empezar' : 'Ingresar al Panel de Control'}</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Bit Network Cloud · Conexión directa y segura con Supabase
        </p>
      </div>
    </div>
  );
};
