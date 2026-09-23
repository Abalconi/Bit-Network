import React from 'react';
import { X, Users, Phone, Mail, Building2, Calendar, MessageSquare, Download, Trash2, CheckCircle2 } from 'lucide-react';

export interface ReceivedContact {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  empresa: string;
  mensaje: string;
  fecha: string;
}

interface ReceivedContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: ReceivedContact[];
  onDeleteContact?: (id: string) => void;
}

export const ReceivedContactsModal: React.FC<ReceivedContactsModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onDeleteContact,
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (contacts.length === 0) return;
    const headers = ['Nombre', 'Teléfono', 'Email', 'Empresa', 'Mensaje', 'Fecha'];
    const rows = contacts.map(c => [
      `"${c.nombre}"`,
      `"${c.telefono}"`,
      `"${c.email}"`,
      `"${c.empresa || ''}"`,
      `"${c.mensaje || ''}"`,
      `"${c.fecha}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contactos_recibidos_bit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Contactos Recibidos por Tap NFC
              </h3>
              <p className="text-xs text-slate-500">
                Clientes que compartieron sus datos contigo a través de tu perfil público
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contacts.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Exportar a Excel / CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Contactos */}
        <div className="p-6 overflow-y-auto space-y-3">
          {contacts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-700">No hay contactos recibidos aún</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Cuando alguien escanee tu Bit o entre a tu link y presione "Compartir mi contacto", sus datos aparecerán aquí.
              </p>
            </div>
          ) : (
            contacts.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{c.nombre}</h4>
                    {c.empresa && (
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.empresa}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {c.fecha}
                    </span>
                    {onDeleteContact && (
                      <button
                        onClick={() => onDeleteContact(c.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <a
                    href={`https://wa.me/${c.telefono.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-700 font-semibold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{c.telefono} (WhatsApp)</span>
                  </a>
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center gap-1.5 text-blue-700 font-semibold hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{c.email}</span>
                    </a>
                  )}
                </div>

                {c.mensaje && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2 mt-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="italic">"{c.mensaje}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
