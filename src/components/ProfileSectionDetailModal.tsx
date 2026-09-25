import React from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  Mail, 
  MessageCircle, 
  Phone, 
  ExternalLink,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSectionDetailModalProps {
  section: 'sobreMi' | 'miTrabajo' | 'contactame' | null;
  onClose: () => void;
  user: UserProfile;
  onOpenShareContact: () => void;
}

export const ProfileSectionDetailModal: React.FC<ProfileSectionDetailModalProps> = ({
  section,
  onClose,
  user,
  onOpenShareContact,
}) => {
  if (!section) return null;

  const effectiveWa = user.whatsapp?.trim() || user.telefono?.trim() || '';
  const rawWa = effectiveWa.replace(/\D/g, '');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera según la sección */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            {section === 'sobreMi' && (
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
            {section === 'miTrabajo' && (
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
            )}
            {section === 'contactame' && (
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                {section === 'sobreMi' && user.sections.sobreMi.titulo}
                {section === 'miTrabajo' && user.sections.miTrabajo.titulo}
                {section === 'contactame' && user.sections.contactame.titulo}
              </h3>
              <p className="text-xs text-slate-500 leading-none mt-0.5">
                {section === 'sobreMi' && (user.sections.sobreMi.subtitulo || 'Trayectoria y especialidad')}
                {section === 'miTrabajo' && (user.sections.miTrabajo.subtitulo || 'Proyectos, skills y soluciones')}
                {section === 'contactame' && (user.sections.contactame.subtitulo || 'Hablemos, estoy disponible')}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido según sección con scroll fluido */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain space-y-4">
          
          {/* SECCIÓN SOBRE MÍ */}
          {section === 'sobreMi' && (
            <div className="space-y-4 text-xs text-slate-700">
              <p className="text-sm leading-relaxed text-slate-800 font-medium">
                {user.sections.sobreMi.contenido}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="font-bold text-slate-900 text-xs">Áreas de especialidad</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.sections.sobreMi.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold text-[11px] shadow-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {user.ubicacion && (
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
                  <p className="font-bold text-blue-900">Ubicación y Disponibilidad</p>
                  <p className="text-blue-700">{user.ubicacion} · Proyectos remotos y presenciales en toda la región.</p>
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN MI TRABAJO */}
          {section === 'miTrabajo' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-600">
                {user.sections.miTrabajo.subtitulo}
              </p>

              <div className="space-y-2.5">
                {user.sections.miTrabajo.proyectos.map((proy, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-400 transition space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                        <span>{proy.nombre}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">Proyecto {idx + 1}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                      {proy.detalle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <p className="font-bold text-cyan-300">¿Tienes un proyecto en mente?</p>
                  <p className="text-slate-300 text-[11px]">Hablemos para coordinar una reunión.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenShareContact();
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer text-center"
                >
                  Conectar ahora
                </button>
              </div>
            </div>
          )}

          {/* SECCIÓN CONTÁCTAME */}
          {section === 'contactame' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                {user.sections.contactame.mensaje}
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {user.whatsapp && (
                  <a
                    href={`https://wa.me/${rawWa}?text=Hola%20${encodeURIComponent(user.nombre)},%20acabo%20de%20escanear%20tu%20Bit%20y%20me%20gustar%C3%ADa%20conversar.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 flex items-center justify-between transition cursor-pointer text-emerald-950"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                        <MessageCircle className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <p className="font-bold text-xs">WhatsApp Directo</p>
                        <p className="text-[11px] text-emerald-700">{user.whatsapp}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                  </a>
                )}

                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition cursor-pointer text-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs">Correo Electrónico</p>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                )}

                {user.telefono && (
                  <a
                    href={`tel:${user.telefono}`}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition cursor-pointer text-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs">Llamada Telefónica</p>
                        <p className="text-[11px] text-slate-500">{user.telefono}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenShareContact();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Dejar mis datos para que {user.nombre.split(' ')[0]} me contacte</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
