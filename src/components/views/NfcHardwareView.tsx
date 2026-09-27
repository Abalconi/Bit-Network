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
  Plus,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { UserProfile, BitDevice } from '../../types';
import { HolographicSticker } from '../HolographicSticker';

interface NfcHardwareViewProps {
  user: UserProfile;
  device: BitDevice;
  onSimulateTap?: () => void;
  onNavigateToLanding?: () => void;
  onOpenPublicProfile: () => void;
  isSuperAdmin?: boolean;
}

interface GeneratedBatchItem {
  id: string;
  token: string;
  url: string;
  fecha: string;
  estado: 'Disponible' | 'Grabado' | 'Activado';
}

export const NfcHardwareView: React.FC<NfcHardwareViewProps> = ({
  user,
  device,
  onSimulateTap,
  onNavigateToLanding,
  onOpenPublicProfile,
  isSuperAdmin = false,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadedQr, setDownloadedQr] = useState(false);

  // Generador de Tokens y Lotes de Fabricación NFC
  const [prefix, setPrefix] = useState('BIT');
  const [quantity, setQuantity] = useState(5);
  const [generatedTokens, setGeneratedTokens] = useState<GeneratedBatchItem[]>([
    { id: 'BIT-00892', token: '8F3K2x9Z', url: `${window.location.origin}/bit/BIT-00892`, fecha: 'Hoy', estado: 'Grabado' },
    { id: 'BIT-00893', token: 'M9A14bK2', url: `${window.location.origin}/bit/BIT-00893`, fecha: 'Hoy', estado: 'Disponible' },
    { id: 'BIT-00894', token: 'T7P88xQ1', url: `${window.location.origin}/bit/BIT-00894`, fecha: 'Hoy', estado: 'Disponible' },
  ]);
  const [copiedBatchIndex, setCopiedBatchIndex] = useState<number | null>(null);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://bit.me/${user.handle}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadQr = () => {
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

  // Generar nuevo lote de links para stickers físicos
  const handleGenerateBatch = () => {
    const newItems: GeneratedBatchItem[] = [];
    const baseNumber = Math.floor(1000 + Math.random() * 8000);
    const origin = window.location.origin;

    for (let i = 0; i < quantity; i++) {
      const bitId = `${prefix}-${baseNumber + i}`;
      const randomToken = Math.random().toString(36).substring(2, 8).toUpperCase();
      newItems.push({
        id: bitId,
        token: randomToken,
        url: `${origin}/bit/${bitId}`,
        fecha: 'Ahora',
        estado: 'Disponible',
      });
    }

    setGeneratedTokens(prev => [...newItems, ...prev]);
  };

  const handleCopyTokenUrl = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedBatchIndex(index);
    setTimeout(() => setCopiedBatchIndex(null), 2000);
  };

  const handleExportCsv = () => {
    const headers = 'ID_BIT,TOKEN,URL_GRABACION_NFC,ESTADO,FECHA\n';
    const rows = generatedTokens
      .map(item => `${item.id},${item.token},${item.url},${item.estado},${item.fecha}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lote_nfc_bit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* 2. GENERADOR DE LOTES DE ENLACES PARA NUEVOS CLIENTES */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Generador de Links NFC para Nuevos BITs
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Estos son los enlaces permanentes que se graban en los chips NFC físicos con la app <em>NFC Tools</em>. Cuando el cliente toque su tarjeta por primera vez, el sistema le pedirá activarla y creará su cuenta limpia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Descargar lista para grabador masivo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={handleGenerateBatch}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generar {quantity} Nuevos Tokens</span>
            </button>
          </div>
        </div>

        {/* Parámetros de Generación */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Prefijo de Lote</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Cantidad por generación</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-800"
            >
              <option value={3}>3 unidades (Muestras)</option>
              <option value={5}>5 unidades</option>
              <option value={10}>10 unidades (Lote pequeño)</option>
              <option value={25}>25 unidades (Caja estándar)</option>
              <option value={50}>50 unidades (Lote mayorista)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Protocolo de Escritura</label>
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>NDEF Record URI (https://)</span>
            </div>
          </div>
        </div>

        {/* Tabla de Tokens Generados */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">ID Interno</th>
                <th className="py-2.5 px-3">Enlace NDEF para Chip NFC</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {generatedTokens.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">
                    {item.id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 truncate max-w-xs">
                    {item.url}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      item.estado === 'Grabado'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{item.estado}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleCopyTokenUrl(item.url, idx)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-[11px] transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      {copiedBatchIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar URL</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Configuración del Enlace y Código QR */}
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
            <span>Número de serie activo: {device.serialNumber}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Sincronizado con Supabase
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
