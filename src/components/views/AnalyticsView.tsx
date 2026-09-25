import React, { useState } from 'react';
import { 
  TrendingUp, 
  Smartphone, 
  Globe, 
  Clock, 
  MapPin, 
  Users, 
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart2,
  CheckCircle2,
  Zap,
  Phone,
  Mail,
  Building2,
  Award,
  Filter,
  Activity,
  Layers,
  Sparkles,
  QrCode
} from 'lucide-react';
import { CrmLead, ActivityItem, BitDevice, ContactStage } from '../../types';

interface AnalyticsViewProps {
  leads: CrmLead[];
  activities?: ActivityItem[];
  device?: BitDevice;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  leads = [],
  activities = [],
  device
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'recent'>('all');

  // Cálculos reales de métricas basadas en la base de datos de leads
  const totalLeads = leads.length;
  
  // Conteo por etapas del embudo
  const countNuevo = leads.filter(l => l.estatus === 'Nuevo').length;
  const countContactado = leads.filter(l => l.estatus === 'Contactado').length;
  const countNegociacion = leads.filter(l => l.estatus === 'En negociación').length;
  const countGanado = leads.filter(l => l.estatus === 'Ganado').length;
  const countPerdido = leads.filter(l => l.estatus === 'Perdido').length;

  // Tasas de conversión reales
  const tasaConversionGanados = totalLeads > 0 
    ? ((countGanado / totalLeads) * 100).toFixed(1) 
    : '0';

  const tasaCalificacion = totalLeads > 0 
    ? (((totalLeads - countNuevo) / totalLeads) * 100).toFixed(1) 
    : '0';

  // Canales de captación reales
  const countNfc = leads.filter(l => l.canal === 'NFC' || l.origen?.toLowerCase().includes('nfc') || l.origen?.toLowerCase().includes('tap')).length;
  const countQr = leads.filter(l => l.canal === 'QR' || l.origen?.toLowerCase().includes('qr')).length;
  const countWeb = leads.filter(l => l.canal === 'Perfil' || l.canal === 'Web' || l.origen?.toLowerCase().includes('web') || l.origen?.toLowerCase().includes('perfil')).length;
  const countOtros = totalLeads - (countNfc + countQr + countWeb);
  const safeCountOtros = countOtros > 0 ? countOtros : 0;

  // Calidad de información recopilada (Completitud de datos)
  const leadsConTelefono = leads.filter(l => l.telefono && l.telefono.trim().length > 3).length;
  const leadsConEmail = leads.filter(l => l.email && l.email.trim().includes('@')).length;
  const leadsConEmpresa = leads.filter(l => l.empresa && l.empresa.trim().length > 1).length;

  const pctTelefono = totalLeads > 0 ? Math.round((leadsConTelefono / totalLeads) * 100) : 0;
  const pctEmail = totalLeads > 0 ? Math.round((leadsConEmail / totalLeads) * 100) : 0;
  const pctEmpresa = totalLeads > 0 ? Math.round((leadsConEmpresa / totalLeads) * 100) : 0;

  const stagesData: Array<{ stage: ContactStage; label: string; count: number; color: string; bg: string }> = [
    { stage: 'Nuevo', label: '1. Nuevos Prospectos', count: countNuevo, color: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
    { stage: 'Contactado', label: '2. En Contacto', count: countContactado, color: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
    { stage: 'En negociación', label: '3. En Negociación / Propuesta', count: countNegociacion, color: 'bg-purple-500', bg: 'bg-purple-50 text-purple-700' },
    { stage: 'Ganado', label: '4. Clientes Cerrados', count: countGanado, color: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
    { stage: 'Perdido', label: '5. Descartados / Perdidos', count: countPerdido, color: 'bg-slate-400', bg: 'bg-slate-100 text-slate-600' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado con estado en vivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              <span>Analítica y Rendimiento del CRM</span>
            </h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Datos en Vivo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Métricas calculadas en tiempo real a partir de tus contactos registrados y la actividad de tu tarjeta BIT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterPeriod === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Histórico Completo
          </button>
          <button
            onClick={() => setFilterPeriod('recent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterPeriod === 'recent'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Últimos 30 días
          </button>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas Principales Reales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Contactos Capturados</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-slate-900">{totalLeads}</span>
            <span className="text-xs font-bold text-blue-600">Leads totales</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">{countNuevo}</span> pendientes de contactar
          </div>
        </div>

        {/* Tasa de Cierre / Clientes Ganados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tasa de Conversión a Cliente</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-emerald-600">{tasaConversionGanados}%</span>
            <span className="text-xs font-bold text-emerald-700">{countGanado} ganados</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {countNegociacion} en negociación activa
          </div>
        </div>

        {/* Tasa de Calificación del Pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tasa de Prospección Activa</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-purple-600">{tasaCalificacion}%</span>
            <span className="text-xs font-bold text-purple-700">avanzaron</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Prospectos que salieron de la fase inicial
          </div>
        </div>

        {/* Canales Físicos vs Virtuales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Captación por NFC & QR</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-amber-600">
              {totalLeads > 0 ? Math.round(((countNfc + countQr) / totalLeads) * 100) : 0}%
            </span>
            <span className="text-xs font-bold text-amber-700">{countNfc + countQr} contactos</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Generados presencialmente con hardware
          </div>
        </div>

      </div>

      {/* Sección 2: Embudo de Ventas (Pipeline Funnel) en Tiempo Real */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Embudo de Conversión en Tiempo Real (Pipeline)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribución de tus contactos en cada una de las 5 etapas del proceso de ventas.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
            {totalLeads} contactos evaluados
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {stagesData.map((item) => {
            const pct = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
            return (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${item.bg}`}>
                      {item.label}
                    </span>
                    <span className="font-bold text-slate-700">{item.count} leads</span>
                  </div>
                  <span className="font-bold text-slate-500">{pct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(pct, item.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sección 3: Canales de Adquisición y Calidad de Datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Canales de Adquisición */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>Canales de Entrada de Contactos</span>
          </h3>
          <p className="text-xs text-slate-500">
            Medio a través del cual los clientes registraron sus datos.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  Tarjeta Física NFC (Toque móvil)
                </span>
                <span>{countNfc} ({totalLeads > 0 ? Math.round((countNfc / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalLeads > 0 ? (countNfc / totalLeads) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-purple-600" />
                  Código QR Dinámico
                </span>
                <span>{countQr} ({totalLeads > 0 ? Math.round((countQr / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalLeads > 0 ? (countQr / totalLeads) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Perfil Web Digital (Enlace compartido)
                </span>
                <span>{countWeb} ({totalLeads > 0 ? Math.round((countWeb / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalLeads > 0 ? (countWeb / totalLeads) * 100 : 0}%` }}
                />
              </div>
            </div>

            {safeCountOtros > 0 && (
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    Ingreso Manual / Otros
                  </span>
                  <span>{safeCountOtros} ({Math.round((safeCountOtros / totalLeads) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400 rounded-full transition-all duration-500"
                    style={{ width: `${(safeCountOtros / totalLeads) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calidad de Información Recopilada */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Calidad y Completitud de Datos</span>
          </h3>
          <p className="text-xs text-slate-500">
            Nivel de detalle de los contactos registrados para seguimiento comercial.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Con Teléfono / WhatsApp</h4>
                  <p className="text-[11px] text-slate-400">{leadsConTelefono} de {totalLeads} contactos</p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-700">{pctTelefono}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Con Correo Electrónico</h4>
                  <p className="text-[11px] text-slate-400">{leadsConEmail} de {totalLeads} contactos</p>
                </div>
              </div>
              <span className="text-sm font-black text-blue-700">{pctEmail}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Con Empresa o Cargo</h4>
                  <p className="text-[11px] text-slate-400">{leadsConEmpresa} de {totalLeads} contactos</p>
                </div>
              </div>
              <span className="text-sm font-black text-purple-700">{pctEmpresa}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sección 4: Hardware BIT Vinculado */}
      {device && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-slate-900">{device.nombre}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {device.status === 'Active' ? 'Activo' : device.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Serie: {device.serialNumber || device.idInterno} · Tipo: {device.tipo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 font-semibold block">Taps Totales</span>
              <span className="text-lg font-black text-slate-900">{device.tapsTotales || device.tapsCount || 0}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 font-semibold block">Último Escaneo</span>
              <span className="text-xs font-bold text-slate-700">{device.ultimoTap || 'Reciente'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sección 5: Registro de Actividad Reciente */}
      {activities.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span>Últimas Interacciones Registradas</span>
          </h3>
          <div className="space-y-2 pt-1">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="font-bold text-slate-800">{act.titulo}</span>
                  <span className="text-slate-400">· {act.detalle}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{act.fecha || act.tiempo || 'Hoy'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

