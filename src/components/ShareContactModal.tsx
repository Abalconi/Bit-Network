import React, { useState } from 'react';
import { X, Send, User, Phone, Mail, Building2, MessageSquare, CheckCircle2, Sparkles, ShieldCheck, MessageCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface ShareContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSuccess?: (contactData: { 
    nombre: string; 
    telefono: string; 
    email: string; 
    empresa: string; 
    mensaje: string; 
    canal?: string;
    origen?: string;
  }) => void;
}

export const ShareContactModal: React.FC<ShareContactModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) return;

    setIsSubmitting(true);

    if (onSuccess) {
      onSuccess({ 
        nombre, 
        telefono, 
        email, 
        empresa, 
        mensaje,
        canal: 'NFC',
        origen: 'Formulario Compartir Contacto'
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);

      setTimeout(() => {
        setIsSent(false);
        setNombre('');
        setTelefono('');
        setEmail('');
        setEmpresa('');
        setMensaje('');
        onClose();
      }, 2000);
    }, 400);
  };

  const handleSendViaWhatsApp = () => {
    const leadNombre = nombre.trim() || 'Interesado';
    const leadTelefono = telefono.trim() || '';

    // Guardar automáticamente en el CRM del usuario en backend
    if (onSuccess) {
      onSuccess({
        nombre: leadNombre,
        telefono: leadTelefono,
        email,
        empresa,
        mensaje: mensaje || 'Compartió contacto e inició conversación por WhatsApp',
        canal: 'WhatsApp',
        origen: 'Compartido por WhatsApp',
      });
    }

    const effectiveWa = user.whatsapp?.trim() || user.telefono?.trim() || '';
    const rawWa = effectiveWa.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hola ${user.nombre}, te comparto mis datos de contacto tras ver tu Bit:\n\n` +
      `• Nombre: ${leadNombre}\n` +
      (leadTelefono ? `• Teléfono/WA: ${leadTelefono}\n` : '') +
      (email ? `• Email: ${email}\n` : '') +
      (empresa ? `• Empresa: ${empresa}\n` : '') +
      (mensaje ? `• Mensaje: ${mensaje}\n` : '')
    );

    if (rawWa) {
      window.open(`https://wa.me/${rawWa}?text=${text}`, '_blank');
    }
    setIsSent(true);

    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal (Fija arriba) */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base tracking-tight leading-snug">
                Compartir mi contacto
              </h3>
              <p className="text-xs text-slate-300 leading-none mt-0.5">
                Conecta directamente con {user.nombre}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con Scroll fluido */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          {isSent ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                ¡Contacto enviado con éxito!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Tus datos han sido enviados. {user.nombre} se pondrá en contacto contigo muy pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingresa tus datos a continuación para que <strong className="text-slate-800">{user.nombre.split(' ')[0]}</strong> pueda guardarte en su agenda y darte seguimiento.
              </p>

              {/* Nombre y Teléfono con soporte de Autofill nativo del teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tu Nombre *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Ej. Juan Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+502 5555 1234"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Email y Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="juan@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Empresa / Cargo
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoComplete="organization"
                      placeholder="Ej. Innova Latam"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mensaje o motivo de contacto
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="Nos conocimos en el evento / Me interesa una cotización..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition resize-none"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Enviando...' : `Enviar mi contacto a ${user.nombre.split(' ')[0]}`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar directamente por WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1 pb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tus datos solo serán compartidos con {user.nombre}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
