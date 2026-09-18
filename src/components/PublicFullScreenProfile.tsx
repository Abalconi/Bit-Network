import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Mail, 
  Download, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  ArrowLeft, 
  Globe, 
  Phone,
  Sparkles,
  Share2,
  ExternalLink
} from 'lucide-react';
import { UserProfile, VisitorExchangeData } from '../types';

interface PublicFullScreenProfileProps {
  user: UserProfile;
  onBackToDashboard: () => void;
  onSubmitContactExchange: (data: VisitorExchangeData) => void;
}

export const PublicFullScreenProfile: React.FC<PublicFullScreenProfileProps> = ({
  user,
  onBackToDashboard,
  onSubmitContactExchange,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('contact');
  const [downloadedVcard, setDownloadedVcard] = useState(false);
  
  const [visitorData, setVisitorData] = useState<VisitorExchangeData>({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    cargo: '',
    notas: '',
    consentAccepted: true,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleDownloadVCard = () => {
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${user.nombre}`,
      `N:${user.nombre.split(' ').slice(-1)[0]};${user.nombre.split(' ')[0]};;;`,
      `ORG:${user.empresa}`,
      `TITLE:${user.cargo}`,
      `TEL;TYPE=CELL:${user.telefono}`,
      `EMAIL;TYPE=INTERNET:${user.email}`,
      `URL:https://bit.me/${user.handle}`,
      `NOTE:${user.tagline} - ${user.descripcion}`,
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${user.nombre.toLowerCase().replace(/\s+/g, '_')}_bit.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedVcard(true);
    setTimeout(() => setDownloadedVcard(false), 3000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorData.nombre || !visitorData.email) return;

    onSubmitContactExchange(visitorData);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setVisitorData({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        cargo: '',
        notas: '',
        consentAccepted: true,
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center">
      
      {/* Barra superior de control: "Vista previa del cliente final" */}
      <div className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-white z-50 sticky top-0">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Dashboard</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>https://bit.me/{user.handle}</span>
        </div>

        <div className="text-[11px] font-semibold text-slate-300">
          Vista Pública Oficial
        </div>
      </div>

      {/* Contenedor central simulando pantalla móvil / web limpia */}
      <div className="w-full max-w-md bg-white min-h-[calc(100vh-48px)] shadow-2xl flex flex-col relative pb-12">
        
        {/* Portada panorámica de montaña al atardecer */}
        <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-800">
          <img
            src={user.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Avatar circular superpuesto */}
        <div className="relative -mt-16 sm:-mt-20 flex flex-col items-center px-6">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.nombre}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
            />
          </div>

          {/* Nombre y Tagline */}
          <h1 className="text-2xl font-black text-slate-900 mt-3 tracking-tight text-center">
            {user.nombre}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 tracking-tight text-center">
            {user.tagline}
          </p>

          {/* Fila de Redes Sociales */}
          <div className="flex items-center gap-3 mt-3">
            <a
              href={user.redesSociales.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
              title="LinkedIn"
            >
              <span className="text-xs font-black">in</span>
            </a>
            <a
              href={user.redesSociales.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href={user.redesSociales.tiktok}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
              title="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.88-4.5V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.85 4.85 0 0 1-1-.06z" />
              </svg>
            </a>
          </div>

          {/* Botón Principal: Guardar contacto */}
          <button
            onClick={handleDownloadVCard}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#0e1628] hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 transition cursor-pointer"
          >
            {downloadedVcard ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Contacto guardado en tu teléfono!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Guardar contacto</span>
              </>
            )}
          </button>

          {/* Acordeones Interactivos (Sobre mi, Mi trabajo, Contáctame) */}
          <div className="w-full mt-6 space-y-2.5">
            
            {/* 1. Sobre mi */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden transition">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'sobreMi' ? null : 'sobreMi')}
                className="w-full p-3.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">Sobre mi</h3>
                    <p className="text-[10px] text-slate-500">Conoce más sobre mi y mi experiencia</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeAccordion === 'sobreMi' ? 'rotate-180' : ''}`} />
              </button>

              {activeAccordion === 'sobreMi' && (
                <div className="p-4 bg-white text-xs text-slate-600 space-y-3 border-t border-slate-100 animate-in fade-in">
                  <p className="leading-relaxed">{user.sections.sobreMi.contenido}</p>
                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-slate-800 mb-1.5">Áreas de especialidad:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.sections.sobreMi.skills.map((skill, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Mi trabajo */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden transition">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'trabajo' ? null : 'trabajo')}
                className="w-full p-3.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-cyan-100/80 text-cyan-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">Mi trabajo</h3>
                    <p className="text-[10px] text-slate-500">Proyectos, skills y lo que hago</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeAccordion === 'trabajo' ? 'rotate-180' : ''}`} />
              </button>

              {activeAccordion === 'trabajo' && (
                <div className="p-4 bg-white text-xs text-slate-600 space-y-3 border-t border-slate-100 animate-in fade-in">
                  <p className="leading-relaxed">{user.sections.miTrabajo.subtitulo}</p>
                  <div className="space-y-2 pt-1">
                    {user.sections.miTrabajo.proyectos.map((proy, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="font-bold text-slate-900 text-xs">{proy.nombre}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{proy.detalle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Contáctame e Intercambio de Contacto */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden transition">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'contact' ? null : 'contact')}
                className="w-full p-3.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">Contáctame</h3>
                    <p className="text-[10px] text-slate-500">Hablemos, estoy disponible</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeAccordion === 'contact' ? 'rotate-180' : ''}`} />
              </button>

              {activeAccordion === 'contact' && (
                <div className="p-4 bg-white text-xs text-slate-600 space-y-3.5 border-t border-slate-100 animate-in fade-in">
                  <div className="space-y-1 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${user.email}`} className="text-blue-600 font-bold hover:underline">
                        {user.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${user.telefono}`} className="text-slate-800 font-medium">
                        {user.telefono}
                      </a>
                    </div>
                  </div>

                  {/* Formulario Intercambiar Contacto */}
                  <div className="pt-2 border-t border-slate-100">
                    {formSubmitted ? (
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-center">
                        <p className="font-bold text-xs">✓ ¡Datos recibidos!</p>
                        <p className="text-[11px] mt-0.5">Alessandra se pondrá en contacto contigo muy pronto.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-2.5">
                        <p className="font-bold text-slate-900 text-xs">
                          Déjame tus datos para agregarte a mi red:
                        </p>
                        <div className="space-y-2">
                          <input
                            type="text"
                            required
                            placeholder="Nombre completo *"
                            value={visitorData.nombre}
                            onChange={(e) => setVisitorData({ ...visitorData, nombre: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Email *"
                            value={visitorData.email}
                            onChange={(e) => setVisitorData({ ...visitorData, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <input
                            type="text"
                            placeholder="Empresa / Organización"
                            value={visitorData.empresa}
                            onChange={(e) => setVisitorData({ ...visitorData, empresa: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <input
                            type="tel"
                            placeholder="Teléfono móvil"
                            value={visitorData.telefono}
                            onChange={(e) => setVisitorData({ ...visitorData, telefono: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                        >
                          Conectar con Alessandra
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Frase / Quote de Alessandra Balconi */}
          <p className="text-xs font-semibold text-slate-400 mt-8 text-center italic">
            "{user.quote}"
          </p>

          {/* Footer de Bit */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col items-center">
            <span className="font-serif italic text-xs text-slate-400">
              Tap. Connect. Grow.
            </span>
            <span className="font-black text-slate-900 text-sm tracking-tighter mt-0.5">
              Bit
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
