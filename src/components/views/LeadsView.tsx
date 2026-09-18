import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  TrendingUp, 
  Download, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal,
  Radio,
  QrCode,
  Globe,
  Store,
  Calendar,
  Eye,
  Plus
} from 'lucide-react';
import { CrmLead, ActivityItem, LeadChannel, ContactStage } from '../../types';
import { LEADS_SUMMARY_STATS, CHANNEL_DISTRIBUTION } from '../../data/mockData';

interface LeadsViewProps {
  leads: CrmLead[];
  activities: ActivityItem[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectLead: (lead: CrmLead) => void;
  onAddNewContact: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  activities,
  searchTerm,
  onSearchChange,
  onSelectLead,
  onAddNewContact,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filtrado de leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.empresa.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel = selectedChannel === 'all' || lead.canal === selectedChannel;
    const matchesStatus = selectedStatus === 'all' || lead.estatus === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Exportar a CSV real
  const handleExportCsv = () => {
    const headers = ['Fecha,Nombre,Email,Teléfono,Empresa,Cargo,Canal,Estatus,Origen,Ubicación'];
    const rows = filteredLeads.map(
      (l) =>
        `"${l.fecha}","${l.nombre}","${l.email}","${l.telefono}","${l.empresa}","${l.cargo}","${l.canal}","${l.estatus}","${l.origen}","${l.ubicacion || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bit_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ContactStage) => {
    switch (status) {
      case 'Nuevo':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contactado':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'En negociación':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Ganado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Perdido':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getChannelBadge = (channel: LeadChannel) => {
    switch (channel) {
      case 'NFC':
        return { icon: Radio, text: 'NFC', color: 'text-blue-600 bg-blue-50' };
      case 'QR':
        return { icon: QrCode, text: 'QR', color: 'text-purple-600 bg-purple-50' };
      case 'Perfil':
        return { icon: Globe, text: 'Perfil', color: 'text-cyan-600 bg-cyan-50' };
      default:
        return { icon: Store, text: channel, color: 'text-slate-600 bg-slate-100' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Barra de Acciones de Leads: Buscador y Exportar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar nombre, email, empresa..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddNewContact}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo contacto</span>
          </button>
          
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar leads</span>
          </button>
        </div>
      </div>

      {/* 1. 5 KPI Cards Superiores (Fieles a la Imagen 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total de leads */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Total de leads</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">247</span>
            <span className="text-xs font-bold text-emerald-600">↑ 32%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">vs. mes anterior</span>
        </div>

        {/* Contactados */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Contactados</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">124</span>
            <span className="text-xs font-bold text-emerald-600">↑ 28%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">vs. mes anterior</span>
        </div>

        {/* En negociación */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">En negociación</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">47</span>
            <span className="text-xs font-bold text-emerald-600">↑ 18%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">vs. mes anterior</span>
        </div>

        {/* Ganados */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Ganados</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">28</span>
            <span className="text-xs font-bold text-emerald-600">↑ 12%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">vs. mes anterior</span>
        </div>

        {/* Tasa de conversión */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Tasa de conversión</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">11.3%</span>
            <span className="text-xs font-bold text-emerald-600">↑ 4.2%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">vs. mes anterior</span>
        </div>

      </div>

      {/* 2. Sección Media: Gráfica de Donut (Distribución por canal) + Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico Donut de Canales (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
            Distribución de leads por canal
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            
            {/* Gráfico Donut SVG */}
            <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Círculo base */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                
                {/* NFC: 42% -> 2 * PI * 38 * 0.42 = 100.2 */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#3b82f6" strokeWidth="12"
                  strokeDasharray="100.2 238.7" strokeDashoffset="0"
                />
                {/* QR: 28% -> 66.8 */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#8b5cf6" strokeWidth="12"
                  strokeDasharray="66.8 238.7" strokeDashoffset="-100.2"
                />
                {/* Perfil: 18% -> 43 */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#06b6d4" strokeWidth="12"
                  strokeDasharray="43 238.7" strokeDashoffset="-167"
                />
                {/* Web: 8% -> 19.1 */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#f59e0b" strokeWidth="12"
                  strokeDasharray="19.1 238.7" strokeDashoffset="-210"
                />
                {/* Otros: 4% -> 9.5 */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#ef4444" strokeWidth="12"
                  strokeDasharray="9.5 238.7" strokeDashoffset="-229.1"
                />
              </svg>

              {/* Centro del Donut: "247 total" */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 tracking-tight">247</span>
                <span className="text-[10px] font-semibold text-slate-400 -mt-0.5">total</span>
              </div>
            </div>

            {/* Leyenda con porcentajes */}
            <div className="space-y-2 text-xs font-semibold w-full max-w-[200px]">
              {CHANNEL_DISTRIBUTION.map((ch, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className="text-slate-700">{ch.nombre}</span>
                  </div>
                  <span className="text-slate-900 font-bold">{ch.porcentaje}%</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Actividad reciente compacta (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Actividad reciente
            </h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer">Ver todo</span>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="py-2.5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{act.titulo}</p>
                  <p className="text-[11px] text-slate-400 truncate">{act.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Tabla de Leads Recientes (Fiel a la Imagen 3) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Encabezado y Filtros de la Tabla */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Leads recientes</h3>
            <p className="text-xs text-slate-400">Mostrando {filteredLeads.length} contactos capturados</p>
          </div>

          {/* Filtros Dropdown */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {/* Canal */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="all">Todos los canales</option>
              <option value="NFC">Canal: NFC</option>
              <option value="QR">Canal: QR</option>
              <option value="Perfil">Canal: Perfil</option>
            </select>

            {/* Estatus */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="all">Todos los estatus</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Contactado">Contactado</option>
              <option value="En negociación">En negociación</option>
              <option value="Ganado">Ganado</option>
              <option value="Perdido">Perdido</option>
            </select>

            {/* Tiempo */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Últimos 30 días</span>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Fecha</th>
                <th className="py-3 px-4 sm:px-6">Nombre</th>
                <th className="py-3 px-4 sm:px-6">Empresa</th>
                <th className="py-3 px-4 sm:px-6">Canal</th>
                <th className="py-3 px-4 sm:px-6">Estatus</th>
                <th className="py-3 px-4 sm:px-6">Origen</th>
                <th className="py-3 px-4 sm:px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const channelInfo = getChannelBadge(lead.canal);
                const ChannelIcon = channelInfo.icon;

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    {/* Fecha */}
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap">
                      {lead.fecha}
                    </td>

                    {/* Nombre + Avatar + Email */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        {lead.avatarUrl ? (
                          <img
                            src={lead.avatarUrl}
                            alt={lead.nombre}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${lead.avatarColor || 'bg-slate-100 text-slate-600'}`}>
                            {lead.avatarInitial || lead.nombre.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                            {lead.nombre}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Empresa */}
                    <td className="py-3.5 px-4 sm:px-6 text-slate-700 font-medium">
                      {lead.empresa}
                    </td>

                    {/* Canal */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${channelInfo.color}`}>
                        <ChannelIcon className="w-3 h-3" />
                        <span>{channelInfo.text}</span>
                      </div>
                    </td>

                    {/* Estatus */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(lead.estatus)}`}>
                        {lead.estatus}
                      </span>
                    </td>

                    {/* Origen */}
                    <td className="py-3.5 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.origen}</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
