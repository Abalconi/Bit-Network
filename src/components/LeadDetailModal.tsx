import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  MapPin, 
  Radio, 
  Calendar, 
  Clock, 
  Check, 
  Send,
  MessageSquare,
  FileText,
  UserCheck,
  History,
  Trash2
} from 'lucide-react';
import { CrmLead, ContactStage } from '../types';

interface LeadDetailModalProps {
  lead: CrmLead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (leadId: string, stage: ContactStage) => void;
  onAddNote: (leadId: string, noteText: string) => void;
  onDeleteLead?: (leadId: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStage,
  onAddNote,
  onDeleteLead,
}) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'notas' | 'actividad'>('resumen');
  const [newNote, setNewNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !lead) return null;

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote);
    setNewNote('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const stages: ContactStage[] = ['Nuevo', 'Contactado', 'En negociación', 'Ganado', 'Perdido'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado del Modal */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3.5">
            {lead.avatarUrl ? (
              <img
                src={lead.avatarUrl}
                alt={lead.nombre}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${lead.avatarColor || 'bg-blue-100 text-blue-700'}`}>
                {lead.avatarInitial || lead.nombre.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {lead.nombre}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {lead.estatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {lead.empresa} {lead.cargo ? `• ${lead.cargo}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas: Resumen, Notas, Actividad (Fiel a la Imagen 3) */}
        <div className="flex items-center border-b border-slate-200 px-6 text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'resumen'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('notas')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'notas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            Notas ({lead.notasHistorial?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('actividad')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'actividad'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            Actividad
          </button>
        </div>

        {/* Contenido Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">
          
          {activeTab === 'resumen' && (
            <>
              {/* Información del Contacto */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Información del contacto
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Email</p>
                      <a href={`mailto:${lead.email}`} className="font-bold text-slate-900 hover:text-blue-600 transition">
                        {lead.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Teléfono</p>
                      <a href={`tel:${lead.telefono}`} className="font-bold text-slate-900 hover:text-blue-600 transition">
                        {lead.telefono}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Empresa</p>
                      <p className="font-bold text-slate-900">{lead.empresa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Cargo</p>
                      <p className="font-bold text-slate-900">{lead.cargo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Ubicación</p>
                      <p className="font-bold text-slate-900">{lead.ubicacion || 'Guatemala'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Fuente / Canal</p>
                      <p className="font-bold text-slate-900">{lead.canal} — {lead.origen}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selector de Estatus */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Estatus del Pipeline
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stages.map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStage(lead.id, st)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                        lead.estatus === st
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección de Notas Rápidas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Notas sobre este lead
                  </h4>
                  {isSaved && (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Guardado
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribe una nota sobre la conversación o próximos pasos..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    Guardar nota
                  </button>
                </div>

                {/* Historial de notas */}
                {lead.notasHistorial && lead.notasHistorial.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {lead.notasHistorial.map((nh) => (
                      <div key={nh.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-600">{nh.autor}</span>
                          <span>{nh.fecha}</span>
                        </div>
                        <p className="text-slate-700">{nh.texto}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'notas' && (
            <div className="space-y-3">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Añadir nueva nota..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
              <button
                onClick={handleSaveNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Guardar nota
              </button>

              <div className="space-y-2 pt-2">
                {lead.notasHistorial?.map((nh) => (
                  <div key={nh.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                      <span>{nh.autor}</span>
                      <span>{nh.fecha}</span>
                    </div>
                    <p className="text-slate-800 text-xs">{nh.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actividad' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <Radio className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Contacto capturado vía {lead.canal}</p>
                  <p className="text-[11px] text-slate-500">Ubicación: {lead.origen} ({lead.fecha})</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <UserCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">vCard descargada al móvil de {lead.nombre.split(' ')[0]}</p>
                  <p className="text-[11px] text-slate-500">Perfil sincronizado</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer del Modal */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          {onDeleteLead && (
            <button
              onClick={() => {
                if (window.confirm('¿Seguro que deseas eliminar este contacto?')) {
                  onDeleteLead(lead.id);
                  onClose();
                }
              }}
              className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar lead</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
