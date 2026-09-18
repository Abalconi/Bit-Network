import React from 'react';
import { 
  X, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Users
} from 'lucide-react';

interface TrainingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingsModal: React.FC<TrainingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const capacitaciones = [
    {
      id: 1,
      titulo: 'Módulo 1: Configuración de tu Perfil y Tarjeta BIT NFC',
      descripcion: 'Aprende a personalizar tus enlaces, optimizar tu vCard y configurar tu chip NTAG213 para máximo impacto.',
      fecha: 'Próximo Miércoles, 7:00 PM',
      duracion: '45 minutos',
      instructor: 'Equipo de Soporte BIT',
      modalidad: 'Google Meet en Vivo',
      estado: 'Confirmada',
    },
    {
      id: 2,
      titulo: 'Módulo 2: Técnicas de Prospección Comercial con Tap NFC',
      descripcion: 'Cómo iniciar conversaciones en eventos, conferencias y reuniones sin sonar invasivo, logrando un 90% de guardados en agenda.',
      fecha: 'Próximo Viernes, 7:00 PM',
      duracion: '60 minutos',
      instructor: 'Coach de Ventas B2B',
      modalidad: 'Google Meet en Vivo',
      estado: 'Cupo Reservado',
    },
    {
      id: 3,
      titulo: 'Módulo 3: Gestión de Leads y Cierre de Ventas en el CRM',
      descripcion: 'Aprende a mover tus prospectos por el pipeline Kanban, registrar notas y automatizar tus seguimientos por WhatsApp.',
      fecha: 'Próximo Sábado, 10:00 AM',
      duracion: '50 minutos',
      instructor: 'Especialista en CRM & Ventas',
      modalidad: 'Google Meet en Vivo',
      estado: 'Cupo Reservado',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Capacitaciones en Vivo Incluidas
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  100% Gratis en tu Mes de Prueba
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Talleres prácticos para que multipliques tus prospectos y cierres de venta desde la primera semana.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-blue-900">
                  Beneficio exclusivo de tu compra BIT
                </p>
                <p className="text-blue-700 mt-0.5">
                  Tienes acceso a todas las sesiones en vivo y a las grabaciones durante los 30 días de tu CRM gratis.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold whitespace-nowrap shadow-sm">
              3 Sesiones Activas
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Próximos Talleres Programados
            </h4>

            {capacitaciones.map((taller) => (
              <div 
                key={taller.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-white space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {taller.id}
                    </span>
                    <h5 className="font-bold text-sm text-slate-900">
                      {taller.titulo}
                    </h5>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                    {taller.estado}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {taller.descripcion}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pl-8 pt-1">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{taller.fecha}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{taller.duracion}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                    <span>{taller.modalidad}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{taller.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Asesoría 1 a 1 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                <BookOpen className="w-3.5 h-3.5" />
                <span>¿Necesitas ayuda para configurar tu equipo?</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Agenda una sesión 1 a 1 de 15 minutos con un especialista técnico de BIT.
              </p>
            </div>
            <a
              href="https://wa.me/50255550000?text=Hola,%20tengo%20mi%20mes%20gratis%20de%20CRM%20y%20deseo%20agendar%20mi%20capacitacion"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition whitespace-nowrap shadow"
            >
              Agendar por WhatsApp
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Los enlaces a las salas de Meet se enviarán a tu correo 30 minutos antes de cada sesión.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
