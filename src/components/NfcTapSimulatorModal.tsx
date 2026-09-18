import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Wifi, 
  Radio, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  ArrowDown
} from 'lucide-react';
import { UserProfile } from '../types';
import { HolographicSticker } from './HolographicSticker';

interface NfcTapSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onTapSuccess: () => void;
  onOpenProfile: () => void;
}

export const NfcTapSimulatorModal: React.FC<NfcTapSimulatorModalProps> = ({
  isOpen,
  onClose,
  user,
  onTapSuccess,
  onOpenProfile,
}) => {
  const [tapState, setTapState] = useState<'approaching' | 'tapped' | 'notification' | 'opened'>('approaching');

  useEffect(() => {
    if (!isOpen) {
      setTapState('approaching');
      return;
    }

    // Secuencia de animación de simulación de toque
    const t1 = setTimeout(() => {
      setTapState('tapped');
      onTapSuccess();
    }, 1200);

    const t2 = setTimeout(() => {
      setTapState('notification');
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>SIMULADOR DE TAP FÍSICO NFC</span>
        </div>
        <h3 className="text-lg font-black tracking-tight text-white">
          Acercando Smartphone al Bit
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Comprueba la velocidad y experiencia de apertura que vivirá tu cliente.
        </p>

        {/* Escenario de Simulación */}
        <div className="my-8 relative w-64 h-64 flex flex-col items-center justify-center">
          
          {/* Ondas electromagnéticas de radiofrecuencia (cuando ocurre el tap) */}
          {tapState !== 'approaching' && (
            <>
              <div className="absolute w-36 h-36 rounded-full border border-blue-500/40 animate-ping" />
              <div className="absolute w-48 h-48 rounded-full border border-cyan-500/30 animate-pulse" />
            </>
          )}

          {/* Sticker Bit Físico en la base */}
          <div className="relative z-10 transition-transform duration-500">
            <HolographicSticker size="lg" interactive={false} />
          </div>

          {/* Teléfono que desciende simulando el tap */}
          <div 
            className={`absolute z-20 transition-all duration-700 ease-out transform ${
              tapState === 'approaching' 
                ? '-top-12 scale-90 opacity-70' 
                : 'top-2 scale-100 opacity-95'
            }`}
          >
            <div className="w-36 h-48 bg-slate-950 rounded-3xl border-2 border-slate-700 shadow-2xl p-2 flex flex-col items-center justify-between">
              <div className="w-12 h-2.5 bg-slate-800 rounded-full" />
              
              {/* Notificación en pantalla del teléfono */}
              {tapState === 'notification' && (
                <div 
                  onClick={() => {
                    onClose();
                    onOpenProfile();
                  }}
                  className="w-full bg-slate-800/95 border border-slate-600 rounded-xl p-2 text-left animate-in slide-in-from-top-4 cursor-pointer shadow-lg hover:bg-slate-700 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-[9px] font-bold text-white">Etiqueta NFC detectada</span>
                  </div>
                  <p className="text-[8px] text-slate-300 font-semibold truncate mt-0.5">
                    {user.nombre}
                  </p>
                  <p className="text-[7px] text-blue-400 font-mono">
                    bit.me/{user.handle}
                  </p>
                </div>
              )}

              <div className="w-10 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>

        </div>

        {/* Estado del Tap y Acciones */}
        <div className="w-full pt-4 border-t border-slate-800 space-y-2">
          {tapState === 'tapped' && (
            <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Lectura NFC instantánea exitosa!</span>
            </p>
          )}

          {tapState === 'notification' && (
            <div className="space-y-2 animate-in fade-in">
              <p className="text-xs text-slate-300">
                El teléfono del cliente acaba de abrir la notificación de tu perfil.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir perfil tal como lo ve el cliente</span>
              </button>
            </div>
          )}

          {tapState === 'approaching' && (
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Acercando smartphone al chip NFC...</span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
