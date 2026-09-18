import React, { useState } from 'react';
import { 
  Radio, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  ArrowRight,
  Lock,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { BitDevice, UserProfile } from '../types';

interface NfcHardwareSimulatorProps {
  device: BitDevice;
  owner: UserProfile;
  onTapNfc: () => void;
  onOpenCode: () => void;
}

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateRandomBase62Token(length = 8): string {
  let result = '';
  const cryptoObj = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;
  const randomBytes = new Uint8Array(length);
  cryptoObj.getRandomValues(randomBytes);
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS[randomBytes[i] % BASE62_CHARS.length];
  }
  return result;
}

export const NfcHardwareSimulator: React.FC<NfcHardwareSimulatorProps> = ({
  device,
  owner,
  onTapNfc,
  onOpenCode,
}) => {
  const [currentSampleToken, setCurrentSampleToken] = useState('8F3K2x9Z');
  const [copied, setCopied] = useState(false);
  const [isTapping, setIsTapping] = useState(false);

  const handleGenerateToken = () => {
    const newToken = generateRandomBase62Token(8);
    setCurrentSampleToken(newToken);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://bit.cards/b/${currentSampleToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      onTapNfc();
    }, 650);
  };

  return (
    <div className="space-y-8">
      
      {/* Banner de Bienvenida y Flujo Principal Imparable */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Arquitectura Validada · Sprint 1 MVP</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            BIT: Plataforma de Networking NFC & CRM
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            El hardware físico NFC es el punto de inicio de la relación; no el producto final.
            Al aproximar un smartphone al dispositivo BIT, se lee de inmediato un token criptográfico 
            en Base62 que abre el perfil digital del propietario, permitiendo un intercambio de datos 
            instantáneo vía HTMX y alimentando un pipeline CRM con aislamiento estricto de datos.
          </p>

          {/* Diagrama del Flujo Imparable */}
          <div className="pt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Flujo Principal Imparable:
            </p>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>BIT físico (NFC)</span>
              </span>
              <span className="text-slate-600 font-bold">──➔</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-bold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Perfil Digital (/b/8F3K2x9Z)</span>
              </span>
              <span className="text-slate-600 font-bold">──➔</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Intercambio HTMX</span>
              </span>
              <span className="text-slate-600 font-bold">──➔</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-purple-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CRM Kanban</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Tarjeta Física NFC + Panel de Seguridad NanoID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Visualización de la Tarjeta Física BIT */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Dispositivo Físico NFC</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
              Chip NTAG213 Activo
            </span>
          </div>

          {/* Tarjeta Visual 3D con Efecto Tap */}
          <div className="relative group">
            <div 
              onClick={handleTriggerTap}
              className={`relative cursor-pointer transition-all duration-300 rounded-3xl overflow-hidden aspect-[1.586/1] w-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl border ${
                isTapping
                  ? 'scale-[0.98] ring-4 ring-emerald-500/80 shadow-emerald-500/30'
                  : 'hover:scale-[1.01] hover:shadow-emerald-500/10'
              } bg-gradient-to-br from-slate-900 via-neutral-900 to-slate-950 border-slate-800`}
            >
              {/* Antena NFC / Circuitos Sutiles */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Onda de Tap animada */}
              {isTapping && (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 backdrop-blur-xs transition-all">
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Radio className="w-12 h-12 text-emerald-400 animate-ping" />
                    <span className="font-bold text-sm bg-slate-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                      ¡NFC Detectado! Abriendo perfil...
                    </span>
                  </div>
                </div>
              )}

              {/* Cabecera de la Tarjeta */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                    B
                  </div>
                  <span className="font-mono text-xs font-bold text-white tracking-widest">
                    BIT CARD
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>NFC 13.56 MHz</span>
                </div>
              </div>

              {/* Chip NFC y Propietario */}
              <div className="relative z-10 space-y-1">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-400/80 to-amber-600/80 border border-amber-300/60 flex items-center justify-center shadow-inner mb-2 opacity-90">
                  <div className="w-6 h-4 border border-amber-900/40 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                    <div className="bg-amber-800/20" />
                    <div className="bg-amber-800/20" />
                  </div>
                </div>
                <p className="font-mono text-[11px] text-slate-400 tracking-wider">
                  {device.idInterno}
                </p>
                <h3 className="font-extrabold text-lg text-white tracking-tight truncate">
                  {owner.nombre}
                </h3>
                <p className="text-xs text-emerald-400 font-medium truncate">
                  {owner.cargo} · {owner.empresa}
                </p>
              </div>

              {/* Footer de la tarjeta con Token grabado */}
              <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  URL Chip: /b/{device.tokenPublico}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-widest">
                  Toca para escanear
                </span>
              </div>
            </div>
          </div>

          {/* Botón de Interacción Rápida */}
          <button
            id="btn-tap-nfc-card"
            onClick={handleTriggerTap}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Radio className="w-4 h-4" />
            <span>Simular Aproximación NFC con Smartphone</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Panel de Seguridad y Algoritmo NanoID Base62 */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Seguridad de Hardware & URLs (NanoID)</span>
            </h2>
            <span className="text-xs text-slate-500">Mapeo Criptográfico</span>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-xl">
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Mitigación de Enumeración (IDOR / Brute-Force)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Los IDs internos de fábrica (<code className="text-emerald-400 font-mono">BIT-000001</code>) 
                jamás se exponen en las URLs públicas. Se asocian a un token público aleatorio Base62 de 8 caracteres 
                generado mediante el módulo <code className="text-emerald-400 font-mono">secrets</code> de Python (CSPRNG).
              </p>
            </div>

            {/* Mapeo de la Relación Estricta */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Mapeo en Base de Datos (Django):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">1. Hardware ID</span>
                  <span className="text-white font-bold">{device.idInterno}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 block">2. Token NanoID</span>
                  <span className="text-emerald-300 font-bold">{device.tokenPublico}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">3. User / Profile</span>
                  <span className="text-white font-bold truncate block">{owner.nombre}</span>
                </div>
              </div>
            </div>

            {/* Playground Generador de Tokens en Vivo */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Generador de Tokens en Vivo</span>
                <button
                  onClick={handleGenerateToken}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generar nuevo</span>
                </button>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-mono text-xs select-none">/b/</span>
                <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider flex-grow">
                  {currentSampleToken}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Copiar URL completa"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Comparativa Técnica: UUID4 vs NanoID Base62 */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Ventajas de NanoID Base62 sobre UUID4:
              </span>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400">UUID4 Estándar</span>
                  <p className="text-[11px] text-slate-500 font-mono">36 caracteres</p>
                  <p className="text-[11px] text-red-400">Ocupa ~3x más bytes en chip NFC NTAG213.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <span className="font-bold text-emerald-400">NanoID Base62</span>
                  <p className="text-[11px] text-emerald-300 font-mono">8-10 caracteres</p>
                  <p className="text-[11px] text-emerald-400">218 billones de combinaciones. Lectura veloz.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Llamada a inspección de código */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Implementación lista en Django 5 con modelos completos para <code className="text-emerald-400 font-mono">users</code>, <code className="text-emerald-400 font-mono">bits</code> y <code className="text-emerald-400 font-mono">crm</code>.</span>
        </div>
        <button
          onClick={onOpenCode}
          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
        >
          <span>Examinar código Django</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
