import React, { useState } from 'react';
import { 
  Radio, 
  Smartphone, 
  Download, 
  ChevronRight, 
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Wifi,
  Battery,
  Phone,
  Mail,
  Share2,
  QrCode,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface NfcTapSimulatorProps {
  user: UserProfile;
  onBuyBit?: () => void;
}

export const NfcTapSimulator: React.FC<NfcTapSimulatorProps> = ({
  user,
  onBuyBit,
}) => {
  const [tapState, setTapState] = useState<'idle' | 'tapping' | 'read'>('idle');
  const [copiedVcf, setCopiedVcf] = useState(false);
  const [activeTabInsidePhone, setActiveTabInsidePhone] = useState<'perfil' | 'servicios' | 'qr'>('perfil');
  const [tapCounter, setTapCounter] = useState(1);

  const triggerTap = () => {
    if (tapState === 'tapping') return;
    setTapState('tapping');
    
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([60, 40, 60]);
    }

    setTimeout(() => {
      setTapState('read');
      setTapCounter(prev => prev + 1);
    }, 1000);
  };

  const handleReset = () => {
    setTapState('idle');
    setCopiedVcf(false);
    setActiveTabInsidePhone('perfil');
  };

  const handleSaveContact = () => {
    setCopiedVcf(true);
    setTimeout(() => setCopiedVcf(false), 2500);
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#0d1322] to-[#070a14] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(6,182,212,0.18)] relative overflow-hidden">
      
      {/* Luces difusas */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera del Simulador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Simulador Interactivo en Tiempo Real</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Experimenta el Tap Físico
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Toca el sticker o presiona el botón para simular cómo cualquier cliente ve tu información de inmediato al acercar su teléfono.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerTap}
            disabled={tapState === 'tapping'}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{tapState === 'tapping' ? 'Transmitiendo...' : 'Hacer Tap Ahora'}</span>
          </button>

          {tapState !== 'idle' && (
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Reiniciar simulador"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Escenario Central: Sticker a la izquierda, Celular Completo a la derecha */}
      <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LADO IZQUIERDO: STICKER FÍSICO BIT */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
          
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
              Paso 1: El Contacto
            </span>
            <p className="text-sm font-black text-white">
              Toca el Sticker Holográfico
            </p>
          </div>

          <div className="relative flex items-center justify-center py-6">
            
            {/* Ondas electromagnéticas animadas en Tap */}
            {tapState === 'tapping' && (
              <>
                <div className="absolute w-56 h-56 rounded-full border-2 border-cyan-400/80 animate-ping pointer-events-none" />
                <div className="absolute w-72 h-72 rounded-full border border-purple-400/60 animate-ping delay-150 pointer-events-none" />
                <div className="absolute w-88 h-88 rounded-full border border-pink-400/40 animate-ping delay-300 pointer-events-none" />
              </>
            )}

            {/* Disco Holográfico BIT */}
            <div
              onClick={triggerTap}
              className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-3 cursor-pointer transition-all duration-300 group select-none ${
                tapState === 'tapping'
                  ? 'scale-110 shadow-[0_0_70px_rgba(6,182,212,0.95),0_0_110px_rgba(168,85,247,0.7)]'
                  : 'hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.35)]'
              }`}
              style={{
                background: 'conic-gradient(from 225deg at 50% 50%, #FF9A8B 0%, #FF6A88 25%, #00F2FE 50%, #4FACFE 75%, #A855F7 100%)'
              }}
            >
              <div className="w-full h-full rounded-full bg-[#080d1a] border-2 border-white/60 flex flex-col items-center justify-center text-center relative overflow-hidden p-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-transparent to-pink-400/20 pointer-events-none" />
                
                <span className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter drop-shadow-md group-hover:scale-105 transition-transform">
                  Bit
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider mt-1">
                  NTAG213
                </span>
                <span className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 group-hover:bg-cyan-400 group-hover:text-slate-950 font-bold transition">
                  {tapState === 'idle' ? 'Toca aquí' : tapState === 'tapping' ? 'Enviando datos...' : '¡Enlace completado!'}
                </span>
              </div>
            </div>

          </div>

          <div className="text-xs text-slate-400 max-w-xs space-y-1">
            <p className="flex items-center justify-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Funciona sin baterías ni mantenimiento.</span>
            </p>
            <p className="text-[11px] text-slate-500">Pégalo en tu teléfono o tarjeta personal.</p>
          </div>

        </div>

        {/* LADO DERECHO: SMARTPHONE COMPLETO TOTALMENTE VISIBLE */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          
          <div className="space-y-1 mb-3 text-center">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
              Paso 2: Lo que ve tu cliente al instante
            </span>
            <p className="text-sm font-black text-white">
              Smartphone Completo en Pantalla
            </p>
          </div>

          {/* Marco completo del smartphone */}
          <div className="w-full max-w-[325px] bg-[#0c101c] rounded-[48px] p-3 border-[6px] border-[#222b40] shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.25)] relative flex flex-col">
            
            {/* Botones físicos laterales */}
            <div className="absolute -left-[9px] top-24 w-[3px] h-10 bg-[#3a445d] rounded-l" />
            <div className="absolute -left-[9px] top-38 w-[3px] h-10 bg-[#3a445d] rounded-l" />
            <div className="absolute -right-[9px] top-28 w-[3px] h-14 bg-[#3a445d] rounded-r" />

            {/* Barra superior de estado */}
            <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[10px] text-slate-400 font-mono select-none">
              <span>9:41</span>
              {/* Dynamic Island */}
              <div className="w-20 h-4 bg-black rounded-full border border-white/10 flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-slate-400" />
                <Battery className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Pantalla Interna del Smartphone */}
            <div className="w-full bg-[#080c16] rounded-[36px] p-3 border border-white/10 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
              
              {tapState === 'idle' && (
                <div className="my-auto text-center p-4 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                    <Smartphone className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Acerca el teléfono al BIT</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                      Sin escribir nada ni pedir números, tu cliente ve tu perfil completo al instante.
                    </p>
                  </div>
                  <button
                    onClick={triggerTap}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    Simular Toque Ahora
                  </button>
                </div>
              )}

              {tapState === 'tapping' && (
                <div className="my-auto text-center p-4 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 mx-auto rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
                  <div>
                    <p className="text-sm font-bold text-white">Detectando BIT NFC...</p>
                    <p className="text-xs text-cyan-400 font-mono mt-1">Conexión instantánea</p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                    Cargando perfil digital
                  </span>
                </div>
              )}

              {tapState === 'read' && (
                <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  
                  {/* Notificación de lectura en pantalla */}
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold text-white">Etiqueta Detectada</span>
                    </div>
                    <span className="text-[9px] text-cyan-300 font-mono font-bold">bit.me/{user.handle}</span>
                  </div>

                  {/* Tarjeta del Perfil Digital Cargado */}
                  <div className="bg-[#101728] rounded-2xl p-3 border border-white/10 space-y-2.5 shadow-inner">
                    
                    {/* Header con Portada y Avatar */}
                    <div className="relative">
                      <div className="h-16 rounded-xl overflow-hidden bg-slate-800">
                        <img 
                          src={user.coverUrl} 
                          alt="Cover" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.nombre} 
                          className="w-11 h-11 rounded-full border-2 border-cyan-400 object-cover shadow-lg" 
                        />
                      </div>
                    </div>

                    <div className="pt-4 text-center">
                      <p className="text-xs font-black text-white">{user.nombre}</p>
                      <p className="text-[10px] text-cyan-400 font-medium truncate">{user.cargo}</p>
                    </div>

                    {/* Botón Guardar Contacto (.vcf) */}
                    <button
                      onClick={handleSaveContact}
                      className="w-full py-2.5 px-3 rounded-xl bg-white text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md hover:bg-slate-200 transition cursor-pointer"
                    >
                      {copiedVcf ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>¡Contacto Guardado!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Guardar Contacto en Teléfono</span>
                        </>
                      )}
                    </button>

                    {/* Selector de pestañas internas del teléfono para mostrar dinamismo */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl text-[9px] font-bold text-slate-400">
                      <button
                        onClick={() => setActiveTabInsidePhone('perfil')}
                        className={`py-1 rounded-lg transition cursor-pointer ${activeTabInsidePhone === 'perfil' ? 'bg-white/15 text-white' : 'hover:text-white'}`}
                      >
                        Perfil
                      </button>
                      <button
                        onClick={() => setActiveTabInsidePhone('servicios')}
                        className={`py-1 rounded-lg transition cursor-pointer ${activeTabInsidePhone === 'servicios' ? 'bg-white/15 text-white' : 'hover:text-white'}`}
                      >
                        Enlaces
                      </button>
                      <button
                        onClick={() => setActiveTabInsidePhone('qr')}
                        className={`py-1 rounded-lg transition cursor-pointer ${activeTabInsidePhone === 'qr' ? 'bg-white/15 text-white' : 'hover:text-white'}`}
                      >
                        Código QR
                      </button>
                    </div>

                    {/* Contenido según pestaña interna */}
                    {activeTabInsidePhone === 'perfil' && (
                      <div className="space-y-1.5 text-[10px] animate-in fade-in">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-cyan-400" />
                            <span>Llamar por WhatsApp</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-pink-400" />
                            <span>Enviar Correo</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      </div>
                    )}

                    {activeTabInsidePhone === 'servicios' && (
                      <div className="space-y-1.5 text-[10px] animate-in fade-in">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-slate-300">
                          <span>Catálogo de Servicios 2026</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-slate-300">
                          <span>Ubicación de Oficina</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      </div>
                    )}

                    {activeTabInsidePhone === 'qr' && (
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center animate-in fade-in space-y-1">
                        <div className="w-16 h-16 mx-auto bg-white p-1 rounded-lg flex items-center justify-center">
                          <QrCode className="w-14 h-14 text-slate-900" />
                        </div>
                        <p className="text-[9px] text-slate-400">Escaneo alternativo para cámaras antiguas</p>
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* Barra inferior de gestos del smartphone */}
              <div className="pt-2">
                <div className="w-28 h-1 bg-white/30 rounded-full mx-auto" />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Barra Informativa Inferior */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Lecturas simuladas en esta sesión: <strong className="text-white">{tapCounter}</strong></span>
        </div>

        {onBuyBit && (
          <button
            onClick={onBuyBit}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition cursor-pointer"
          >
            <span>Pedir mi BIT por Q. 99 con envío gratis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
