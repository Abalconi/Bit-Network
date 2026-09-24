import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Radio, 
  QrCode, 
  Globe, 
  Store, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Filter
} from 'lucide-react';
import { CrmLead, ContactStage, LeadChannel } from '../../types';

interface SalesPipelineViewProps {
  leads: CrmLead[];
  onSelectLead: (lead: CrmLead) => void;
  onUpdateLeadStage: (leadId: string, newStage: ContactStage) => void;
  onAddNewContact: () => void;
}

export const SalesPipelineView: React.FC<SalesPipelineViewProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStage,
  onAddNewContact,
}) => {
  const stageDefinitions: { id: ContactStage; label: string; color: string; borderTop: string }[] = [
    { id: 'Nuevo', label: 'Nuevo', color: 'text-blue-600 bg-blue-50', borderTop: 'border-t-blue-500' },
    { id: 'Contactado', label: 'Contactado', color: 'text-purple-600 bg-purple-50', borderTop: 'border-t-purple-500' },
    { id: 'En negociación', label: 'En negociación', color: 'text-amber-600 bg-amber-50', borderTop: 'border-t-amber-500' },
    { id: 'Ganado', label: 'Ganado', color: 'text-emerald-600 bg-emerald-50', borderTop: 'border-t-emerald-500' },
    { id: 'Perdido', label: 'Perdido', color: 'text-rose-600 bg-rose-50', borderTop: 'border-t-rose-500' },
  ];

  const stages = stageDefinitions.map(def => ({
    ...def,
    count: leads.filter(l => l.estatus === def.id).length,
  }));


  const getChannelBadge = (channel: LeadChannel) => {
    switch (channel) {
      case 'NFC':
        return { text: 'NFC', bg: 'bg-blue-50 text-blue-700' };
      case 'QR':
        return { text: 'QR', bg: 'bg-purple-50 text-purple-700' };
      case 'Perfil':
        return { text: 'Perfil', bg: 'bg-cyan-50 text-cyan-700' };
      default:
        return { text: channel, bg: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Cabecera del Pipeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Pipeline de ventas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualiza y gestiona tus oportunidades de negocio en tiempo real.
          </p>
        </div>

        <button
          onClick={onAddNewContact}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo contacto</span>
        </button>
      </div>

      {/* Tablero Kanban con 5 Columnas (Fiel a la Imagen 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto">
        {stages.map((stage) => {
          // Filtrar leads por etapa
          const stageLeads = leads.filter((l) => l.estatus === stage.id);
          const displayCount = stageLeads.length > 0 ? stageLeads.length : stage.count;

          return (
            <div
              key={stage.id}
              className={`bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 border-t-4 ${stage.borderTop} flex flex-col min-w-[240px]`}
            >
              {/* Header de la Columna */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800 tracking-tight">
                    {stage.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                    {displayCount}
                  </span>
                </div>
                <button 
                  onClick={onAddNewContact}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/60 transition"
                  title="Añadir contacto a esta columna"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lista de Tarjetas en esta Columna */}
              <div className="space-y-3">
                {stageLeads.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                    Sin leads activos en esta fase
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const channelInfo = getChannelBadge(lead.canal);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                        onClick={() => onSelectLead(lead)}
                      >
                        {/* Fila Superior: Avatar + Nombre + Menú */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {lead.avatarUrl ? (
                              <img
                                src={lead.avatarUrl}
                                alt={lead.nombre}
                                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${lead.avatarColor || 'bg-blue-100 text-blue-700'}`}>
                                {lead.avatarInitial || lead.nombre.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition truncate">
                                {lead.nombre}
                              </h4>
                              <p className="text-[10px] text-slate-500 truncate">
                                {lead.empresa}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectLead(lead);
                            }}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Pie de la tarjeta: Fecha + Tag Canal + Ver más */}
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">{lead.fecha}</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${channelInfo.bg}`}>
                              {channelInfo.text}
                            </span>
                          </div>

                          <span className="font-bold text-blue-600 hover:underline">
                            + Ver más
                          </span>
                        </div>

                        {/* Selector rápido para mover etapa */}
                        <div 
                          className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Mover fase:</span>
                          <div className="flex items-center gap-1">
                            {stage.id !== 'Nuevo' && (
                              <button
                                onClick={() => {
                                  const stageOrder: ContactStage[] = ['Nuevo', 'Contactado', 'En negociación', 'Ganado', 'Perdido'];
                                  const curIdx = stageOrder.indexOf(stage.id);
                                  if (curIdx > 0) onUpdateLeadStage(lead.id, stageOrder[curIdx - 1]);
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                title="Fase anterior"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {stage.id !== 'Perdido' && (
                              <button
                                onClick={() => {
                                  const stageOrder: ContactStage[] = ['Nuevo', 'Contactado', 'En negociación', 'Ganado', 'Perdido'];
                                  const curIdx = stageOrder.indexOf(stage.id);
                                  if (curIdx < stageOrder.length - 1) onUpdateLeadStage(lead.id, stageOrder[curIdx + 1]);
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                title="Siguiente fase"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
