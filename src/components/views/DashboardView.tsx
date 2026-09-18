import React, { useState } from 'react';
import { 
  Eye, 
  Hand, 
  UserCheck, 
  QrCode, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  ChevronRight,
  Sparkles,
  Share2,
  Calendar,
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { UserProfile, BitDevice, ActivityItem } from '../../types';
import { HolographicSticker } from '../HolographicSticker';

interface DashboardViewProps {
  user: UserProfile;
  device: BitDevice;
  activities: ActivityItem[];
  onNavigateToProfile: () => void;
  onNavigateToLeads: () => void;
  onNavigateToNfc: () => void;
  onSimulateTap?: () => void;
  onNavigateToLanding?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  device,
  activities,
  onNavigateToProfile,
  onNavigateToLeads,
  onNavigateToNfc,
  onSimulateTap,
  onNavigateToLanding,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://bit.me/${user.handle}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Datos para las 4 KPI cards superiores exactas de la imagen
  const kpiCards = [
    {
      titulo: 'Visitas a tu perfil',
      valor: '1,284',
      cambio: '↑ 18%',
      periodo: 'vs. mes anterior',
      icono: Eye,
      colorIcono: 'text-blue-600 bg-blue-50 border-blue-100',
      sparklineColor: '#3b82f6',
      points: [40, 52, 48, 65, 60, 75, 70, 88, 82, 95, 90, 105, 115, 128],
    },
    {
      titulo: 'Taps en tu Bit',
      valor: '342',
      cambio: '↑ 24%',
      periodo: 'vs. mes anterior',
      icono: Hand,
      colorIcono: 'text-purple-600 bg-purple-50 border-purple-100',
      sparklineColor: '#8b5cf6',
      points: [15, 22, 18, 28, 25, 34, 30, 42, 38, 48, 44, 55, 62, 74],
    },
    {
      titulo: 'Contactos guardados',
      valor: '47',
      cambio: '↑ 12%',
      periodo: 'vs. mes anterior',
      icono: UserCheck,
      colorIcono: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      sparklineColor: '#10b981',
      points: [3, 4, 3, 5, 6, 5, 7, 8, 7, 10, 9, 11, 12, 14],
    },
    {
      titulo: 'Escaneos de QR',
      valor: '89',
      cambio: '↑ 36%',
      periodo: 'vs. mes anterior',
      icono: QrCode,
      colorIcono: 'text-amber-600 bg-amber-50 border-amber-100',
      sparklineColor: '#f59e0b',
      points: [6, 8, 9, 12, 11, 14, 16, 18, 20, 22, 24, 28, 30, 36],
    },
  ];

  // Datos para la gráfica dual "Taps y visitas" (30 días)
  const chartDays = [
    { label: '1 ago', taps: 45, visitas: 95 },
    { label: '5 ago', taps: 52, visitas: 110 },
    { label: '10 ago', taps: 88, visitas: 145 },
    { label: '15 ago', taps: 60, visitas: 115 },
    { label: '20 ago', taps: 78, visitas: 130 },
    { label: '25 ago', taps: 115, visitas: 168 },
    { label: '30 ago', taps: 85, visitas: 140 },
  ];

  // Helper para generar el path SVG suave de sparklines
  const generateSparklinePath = (points: number[], width = 160, height = 44) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const step = width / (points.length - 1);

    const coords = points.map((val, idx) => ({
      x: idx * step,
      y: height - ((val - min) / range) * (height - 8) - 4,
    }));

    // Curva Bezier
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return { linePath: path, coords };
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Cuatro KPI Cards Superiores con Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icono;
          const { linePath } = generateSparklinePath(card.points, 140, 36);

          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Encabezado de la card: Icono + Título */}
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${card.colorIcono}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {card.titulo}
                </span>
              </div>

              {/* Valor grande + Porcentaje de cambio */}
              <div className="flex items-baseline justify-between mt-3 mb-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {card.valor}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {card.cambio}
                  </span>
                </div>
              </div>

              {/* Subtítulo y Mini Sparkline */}
              <div className="flex items-end justify-between pt-1">
                <span className="text-[11px] text-slate-400 font-medium">
                  {card.periodo}
                </span>
                <div className="w-28 h-9">
                  <svg viewBox="0 0 140 36" className="w-full h-full overflow-visible">
                    <path
                      d={linePath}
                      fill="none"
                      stroke={card.sparklineColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Sección Principal Media: Gráfica "Taps y visitas" + "Actividad reciente" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfica de Líneas Dual (65% del ancho) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          
          {/* Header de la gráfica: Título + Leyenda + Filtro */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Taps y visitas
              </h2>
              <div className="flex items-center gap-4 mt-1.5 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-purple-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Taps</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Visitas</span>
                </div>
              </div>
            </div>

            {/* Dropdown de tiempo */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 w-fit">
              <span>Últimos 30 días</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Canvas SVG de la gráfica */}
          <div className="relative w-full h-64 mt-6">
            
            {/* Eje Y: Guías horizontales */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono">
              <div className="border-b border-slate-100 pb-1 flex justify-between"><span>200</span></div>
              <div className="border-b border-slate-100 pb-1 flex justify-between"><span>150</span></div>
              <div className="border-b border-slate-100 pb-1 flex justify-between"><span>100</span></div>
              <div className="border-b border-slate-100 pb-1 flex justify-between"><span>50</span></div>
              <div className="border-b border-slate-200 flex justify-between"><span>0</span></div>
            </div>

            {/* Curvas SVG */}
            <svg viewBox="0 0 700 220" className="absolute inset-0 w-full h-full overflow-visible pl-8 pb-4">
              <defs>
                <linearGradient id="visitasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="tapsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Área y Curva Visitas (Azul) */}
              <path
                d="M 30 130 C 130 115, 170 85, 230 70 C 310 95, 360 85, 420 65 C 500 40, 560 25, 620 50 L 620 200 L 30 200 Z"
                fill="url(#visitasGrad)"
              />
              <path
                d="M 30 130 C 130 115, 170 85, 230 70 C 310 95, 360 85, 420 65 C 500 40, 560 25, 620 50"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Área y Curva Taps (Morado) */}
              <path
                d="M 30 165 C 130 150, 170 140, 230 120 C 310 145, 360 135, 420 110 C 500 80, 560 95, 620 125 L 620 200 L 30 200 Z"
                fill="url(#tapsGrad)"
              />
              <path
                d="M 30 165 C 130 150, 170 140, 230 120 C 310 145, 360 135, 420 110 C 500 80, 560 95, 620 125"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Puntos interactivos */}
              {[
                { cx: 30, cy: 130, t: 45, v: 95 },
                { cx: 130, cy: 115, t: 52, v: 110 },
                { cx: 230, cy: 70, t: 88, v: 145 },
                { cx: 330, cy: 90, t: 60, v: 115 },
                { cx: 420, cy: 65, t: 78, v: 130 },
                { cx: 520, cy: 30, t: 115, v: 168 },
                { cx: 620, cy: 50, t: 85, v: 140 },
              ].map((pt, i) => (
                <g key={i} className="cursor-pointer">
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={activeChartPoint === i ? 6 : 4}
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setActiveChartPoint(i)}
                    onMouseLeave={() => setActiveChartPoint(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Eje X: Etiquetas de fechas */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[11px] text-slate-400 font-medium pt-2">
              {chartDays.map((d, i) => (
                <span key={i}>{d.label}</span>
              ))}
            </div>
          </div>

        </div>

        {/* Actividad Reciente (35% del ancho) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Actividad reciente
              </h2>
              <button
                onClick={onNavigateToLeads}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            {/* Lista de Actividad */}
            <div className="divide-y divide-slate-100 mt-2">
              {activities.map((act) => {
                const getIconInfo = (type: string) => {
                  switch (type) {
                    case 'contacto':
                      return { icon: UserCheck, color: 'text-purple-600 bg-purple-50' };
                    case 'tap':
                      return { icon: Hand, color: 'text-cyan-600 bg-cyan-50' };
                    case 'visita':
                      return { icon: Eye, color: 'text-blue-600 bg-blue-50' };
                    case 'lead':
                      return { icon: ArrowUpRight, color: 'text-amber-600 bg-amber-50' };
                    case 'qr':
                      return { icon: QrCode, color: 'text-slate-600 bg-slate-100' };
                    default:
                      return { icon: Sparkles, color: 'text-blue-600 bg-blue-50' };
                  }
                };

                const { icon: ActIcon, color } = getIconInfo(act.tipo);

                return (
                  <div
                    key={act.id}
                    onClick={onNavigateToLeads}
                    className="py-3 flex items-center justify-between group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                        <ActIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {act.titulo}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {act.detalle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Sincronización en tiempo real activa</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

      </div>

      {/* 3. Sección Inferior: Card "Tu Bit" + Card "Haz que tu Bit trabaje por ti" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card: Tu Bit (65% del ancho) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            
            {/* Sticker holográfico con reflejo metálico */}
            <div className="flex-shrink-0" onClick={onNavigateToNfc}>
              <HolographicSticker size="lg" interactive={true} />
            </div>

            {/* Información del Bit del usuario */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Tu Bit</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Activo
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Comparte tu perfil, conecta y haz crecer tu red.
              </p>

              {/* URL Pill con botón Copiar */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                  <span>bit.me/{user.handle}</span>
                  <button
                    onClick={handleCopyUrl}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    title="Copiar enlace"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción inferiores */}
          <div className="flex flex-wrap items-center gap-3 pt-6 mt-4 border-t border-slate-100">
            <button
              onClick={onNavigateToProfile}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              Editar perfil
            </button>
            <button
              onClick={onNavigateToProfile}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Ver tu perfil
            </button>
            <button
              onClick={onNavigateToNfc}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
              <span>Descargar QR</span>
            </button>
          </div>
        </div>

        {/* Card: Haz que tu Bit trabaje por ti (35% del ancho) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#0d162b] text-white p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden flex flex-col justify-between">
          
          <div className="relative z-10 max-w-[280px]">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Pro Tip
            </span>
            <h3 className="text-base font-black tracking-tight text-white mt-2">
              Haz que tu Bit trabaje por ti
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Activa la opción de compartir automática en tus redes y llega a más personas.
            </p>

            <button
              onClick={onNavigateToProfile}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition cursor-pointer"
            >
              <span>Configurar ahora</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teléfono ilustrado con sticker e iconos flotantes */}
          <div className="absolute -right-4 -bottom-6 w-44 h-52 pointer-events-none select-none opacity-90">
            <div className="relative w-full h-full">
              {/* Carcasa teléfono */}
              <div className="w-32 h-56 bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl p-2 relative mx-auto transform rotate-6">
                <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full holographic-foil flex items-center justify-center shadow-lg">
                    <span className="text-[9px] font-black text-slate-950">Bit</span>
                  </div>
                </div>
              </div>

              {/* Iconos flotantes */}
              <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-[9px] font-bold">IG</span>
              </div>
              <div className="absolute top-16 -left-2 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                <span className="text-[9px] font-bold">TK</span>
              </div>
              <div className="absolute top-8 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <span className="text-[9px] font-bold">in</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
