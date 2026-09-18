import React, { useState } from 'react';
import { 
  Radio, 
  Smartphone, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Wifi,
  Cpu,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { UserProfile, BitDevice } from '../../types';
import { HolographicSticker } from '../HolographicSticker';

interface NfcHardwareViewProps {
  user: UserProfile;
  device: BitDevice;
  onSimulateTap?: () => void;
  onNavigateToLanding?: () => void;
  onOpenPublicProfile: () => void;
}

export const NfcHardwareView: React.FC<NfcHardwareViewProps> = ({
  user,
  device,
  onSimulateTap,
  onNavigateToLanding,
  onOpenPublicProfile,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadedQr, setDownloadedQr] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://bit.me/${user.handle}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadQr = () => {
    // Generar un canvas y descargar imagen del QR
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#090e1a';
      ctx.fillRect(40, 40, 320, 320);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`bit.me/${user.handle}`, 200, 385);
      
      const a = document.createElement('a');
      a.download = `bit_qr_${user.handle}.png`;
      a.href = canvas.toDataURL();
      a.click();
      setDownloadedQr(true);
      setTimeout(() => setDownloadedQr(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Banner Principal: Sticker Físico Holográfico Interactivo */}
      <div className="bg-gradient-to-br from-[#0a1020] to-[#121c35] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Lado Izquierdo: Descripción y Acciones */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hardware Oficial Bit • NTAG213</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tu Sticker Holográfico Inteligente
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Fabricado con foil iridiscente premium y chip NFC de alta sensibilidad. Pégalo en la parte trasera de tu teléfono o en cualquier superficie para compartir tu perfil al instante con un solo toque.
            </p>

            {/* Fila de Especificaciones Clave */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Diámetro</p>
                <p className="text-sm font-bold text-white mt-0.5">30 mm</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Frecuencia</p>
                <p className="text-sm font-bold text-white mt-0.5">13.56 MHz</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Acabado</p>
                <p className="text-sm font-bold text-white mt-0.5">Foil Holográfico</p>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {onNavigateToLanding && (
                <button
                  id="btn-goto-landing-simulator"
                  onClick={onNavigateToLanding}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Probar Simulador en la Landing Page</span>
                </button>
              )}

              <button
                onClick={onOpenPublicProfile}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver página de destino</span>
              </button>
            </div>
          </div>

          {/* Lado Derecho: Render 3D del Sticker con Reflejo Reactivo */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
            <div className="relative p-6 rounded-full bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex flex-col items-center">
              <HolographicSticker size="xl" interactive={true} />
              <span className="text-[11px] text-slate-400 mt-3 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Mueve el cursor para ver el reflejo arcoíris
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Configuración del Enlace y Código QR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Código QR oficial (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col items-center text-center justify-between">
          <div className="w-full flex flex-col items-center">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Código QR de Respaldo
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Para dispositivos antiguos o situaciones donde la cámara sea más cómoda que el NFC.
            </p>

            {/* Código QR Renderizado */}
            <div className="my-6 p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-md">
              <div className="w-44 h-44 bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden p-3">
                <QrCode className="w-full h-full text-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-slate-900">
                    <span className="font-black text-slate-950 text-xs">Bit</span>
                  </div>
                </div>
              </div>
            </div>

            <code className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
              bit.me/{user.handle}
            </code>
          </div>

          <button
            onClick={handleDownloadQr}
            className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            {downloadedQr ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡QR Descargado!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar QR en Alta Resolución</span>
              </>
            )}
          </button>
        </div>

        {/* Especificaciones Técnicas y Compatibilidad (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Compatibilidad y Ficha Técnica
            </h3>

            <div className="space-y-4 mt-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Compatibilidad Universal</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Funciona de forma nativa sin instalar ninguna app adicional en todos los iPhone (XR, XS, 11, 12, 13, 14, 15, 16) y en más del 90% de dispositivos Android con NFC habilitado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Resistencia y Durabilidad</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Recubrimiento epoxi impermeable (IP68), resistente a arañazos, salpicaduras y calor. Adhesivo 3M extra fuerte de grado industrial.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Sin Baterías ni Recargas</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Se alimenta por inducción magnética pasiva en el momento exacto del toque con el smartphone. Vida útil estimada: más de 10 años / 100,000 lecturas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Número de serie: {device.serialNumber}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Sincronizado
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
