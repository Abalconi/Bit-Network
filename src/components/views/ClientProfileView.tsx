import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Mail, 
  Download, 
  ChevronRight, 
  ExternalLink, 
  Check, 
  Smartphone, 
  Globe, 
  Send,
  Phone,
  Sparkles,
  Share2,
  Lock
} from 'lucide-react';
import { UserProfile, VisitorExchangeData } from '../../types';
import { HolographicSticker } from '../HolographicSticker';

interface ClientProfileViewProps {
  user: UserProfile;
  onOpenFullScreen: () => void;
  onSubmitContactExchange: (data: VisitorExchangeData) => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  user,
  onOpenFullScreen,
  onSubmitContactExchange,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('contact');
  const [downloadedVcard, setDownloadedVcard] = useState(false);
  
  // Estado del formulario de intercambio de contacto
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

  // Descarga de vCard real (.vcf)
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
    <div className="space-y-6 pb-12">
      
      {/* Barra superior de control del Perfil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900">Enlace público activo:</span>
            <code className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
              https://bit.me/{user.handle}
            </code>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Optimizado con compresión ultra-rápida y carga en menos de 0.2 segundos al toque NFC.
          </p>
        </div>

        <button
          onClick={onOpenFullScreen}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Abrir página completa de cliente</span>
        </button>
      </div>

      {/* Mockups de Visualización: Desktop + Móvil + Card Promocional (Fiel a la Imagen 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 1. Vista previa Desktop / Web (Columna 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col">
          
          {/* Barra del navegador simulado con buscador */}
          <div className="bg-slate-900 px-4 py-3 flex items-center gap-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            
            {/* Input URL del navegador */}
            <div className="flex-1 max-w-xs mx-auto bg-slate-800/90 text-slate-300 px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-2">
              <Globe className="w-3 h-3 text-slate-400" />
              <span className="truncate">bit.me/{user.handle}</span>
            </div>
          </div>

          {/* Contenido Web Desktop */}
          <div className="relative pb-8">
            
            {/* Portada panorámica de montaña al atardecer (exacta a la imagen) */}
            <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-800">
              <img
                src={user.coverUrl}
                alt="Banner de portada"
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

              {/* Nombre y Cargo */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 tracking-tight">
                {user.nombre}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 tracking-tight text-center">
                {user.tagline}
              </p>

              {/* Fila de Redes Sociales: LinkedIn, Instagram, TikTok */}
              <div className="flex items-center gap-3 mt-3">
                {/* LinkedIn */}
                <a
                  href={user.redesSociales.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                >
                  <span className="text-xs font-black">in</span>
                </a>
                {/* Instagram */}
                <a
                  href={user.redesSociales.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href={user.redesSociales.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.88-4.5V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.85 4.85 0 0 1-1-.06z" />
                  </svg>
                </a>
              </div>

              {/* Botón Principal: Guardar contacto */}
              <button
                onClick={handleDownloadVCard}
                className="mt-4 w-full max-w-xs flex items-center justify-center gap-2 py-2.5 px-6 rounded-2xl bg-[#0e1628] hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
              >
                {downloadedVcard ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡vCard Descargada!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Guardar contacto</span>
                  </>
                )}
              </button>

              {/* Tarjetas / Acordeón Desktop (3 columnas compactas) */}
              <div className="w-full max-w-lg mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Sobre mi */}
                <div 
                  onClick={() => setActiveAccordion(activeAccordion === 'sobreMi' ? null : 'sobreMi')}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-left ${
                    activeAccordion === 'sobreMi' ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Sobre mi</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    Conoce más sobre mi y mi experiencia
                  </p>
                </div>

                {/* Mi trabajo */}
                <div 
                  onClick={() => setActiveAccordion(activeAccordion === 'trabajo' ? null : 'trabajo')}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-left ${
                    activeAccordion === 'trabajo' ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Mi trabajo</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    Proyectos, skills y lo que hago
                  </p>
                </div>

                {/* Contáctame */}
                <div 
                  onClick={() => setActiveAccordion(activeAccordion === 'contact' ? null : 'contact')}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-left ${
                    activeAccordion === 'contact' ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Contáctame</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    Hablemos, estoy disponible
                  </p>
                </div>
              </div>

              {/* Detalle expandido según sección activa */}
              {activeAccordion && (
                <div className="w-full max-w-lg mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 animate-in fade-in duration-200">
                  {activeAccordion === 'sobreMi' && (
                    <div className="space-y-2">
                      <p>{user.sections.sobreMi.contenido}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {user.sections.sobreMi.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeAccordion === 'trabajo' && (
                    <div className="space-y-2">
                      {user.sections.miTrabajo.proyectos.map((proy, i) => (
                        <div key={i} className="border-b border-slate-200 pb-2 last:border-none last:pb-0">
                          <p className="font-bold text-slate-900 text-xs">{proy.nombre}</p>
                          <p className="text-[11px] text-slate-500">{proy.detalle}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeAccordion === 'contact' && (
                    <div>
                      {formSubmitted ? (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-center font-bold text-xs">
                          ✓ ¡Tus datos fueron enviados exitosamente al CRM de Alessandra!
                        </div>
                      ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-2.5">
                          <p className="font-bold text-slate-900 text-xs">
                            Deja tus datos para conectar de vuelta:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Tu nombre *"
                              value={visitorData.nombre}
                              onChange={(e) => setVisitorData({ ...visitorData, nombre: e.target.value })}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="email"
                              required
                              placeholder="Tu email *"
                              value={visitorData.email}
                              onChange={(e) => setVisitorData({ ...visitorData, email: e.target.value })}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Empresa"
                              value={visitorData.empresa}
                              onChange={(e) => setVisitorData({ ...visitorData, empresa: e.target.value })}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="tel"
                              placeholder="Teléfono"
                              value={visitorData.telefono}
                              onChange={(e) => setVisitorData({ ...visitorData, telefono: e.target.value })}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                          >
                            Enviar mis datos
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Frase / Quote al pie */}
              <p className="text-xs font-semibold text-slate-400 mt-6 text-center italic">
                "{user.quote}"
              </p>
            </div>

          </div>
        </div>

        {/* 2. Vista previa Móvil (iPhone frame) (Columna 3) */}
        <div className="lg:col-span-3 flex justify-center">
          <div className="w-[280px] bg-slate-950 rounded-[40px] p-2.5 shadow-2xl border-4 border-slate-800 relative">
            
            {/* Pantalla del teléfono */}
            <div className="w-full bg-white rounded-[32px] overflow-hidden text-center pb-6 relative text-slate-900">
              
              {/* Dynamic Island / Notch con hora 9:41 */}
              <div className="bg-slate-900 text-white px-5 pt-2 pb-1 flex items-center justify-between text-[10px] font-bold">
                <span>9:41</span>
                <div className="w-16 h-3 bg-black rounded-full mx-auto" />
                <span>5G</span>
              </div>

              {/* Portada móvil */}
              <div className="h-24 w-full relative overflow-hidden bg-slate-800">
                <img
                  src={user.coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Avatar circular */}
              <div className="-mt-10 flex flex-col items-center px-4">
                <img
                  src={user.avatarUrl}
                  alt={user.nombre}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />

                <h3 className="font-extrabold text-sm text-slate-900 mt-1.5">
                  {user.nombre}
                </h3>
                <p className="text-[9px] font-semibold text-slate-500 line-clamp-1">
                  {user.tagline}
                </p>

                {/* Redes sociales */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                    in
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /></svg>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    TK
                  </div>
                </div>

                {/* Botón Guardar contacto */}
                <button
                  onClick={handleDownloadVCard}
                  className="mt-2.5 w-full py-1.5 rounded-xl bg-[#0e1628] text-white font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Download className="w-3 h-3" />
                  <span>Guardar contacto</span>
                </button>

                {/* Lista de acordeones móvil */}
                <div className="w-full mt-3 space-y-1.5 text-left">
                  <div className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-blue-600" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-900">Sobre mi</p>
                        <p className="text-[8px] text-slate-400 truncate max-w-[120px]">Conoce más sobre mi</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>

                  <div className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 text-cyan-600" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-900">Mi trabajo</p>
                        <p className="text-[8px] text-slate-400 truncate max-w-[120px]">Proyectos y skills</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>

                  <div className="p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-purple-600" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-900">Contáctame</p>
                        <p className="text-[8px] text-slate-400 truncate max-w-[120px]">Hablemos, disponible</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                <p className="text-[8px] text-slate-400 mt-3 italic">
                  "{user.quote}"
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* 3. Card Promocional "Tu Bit, en la vida real" (Columna 3 - Fiel a la Imagen 1 derecha) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md flex flex-col items-center text-center justify-between">
          <div className="w-full flex flex-col items-center">
            
            {/* Visual del sticker con acabado holográfico */}
            <div className="my-2">
              <HolographicSticker size="xl" interactive={true} />
            </div>

            <h3 className="font-extrabold text-base text-slate-900 mt-4 tracking-tight">
              Tu Bit, en la vida real
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Un pequeño sticker, grandes oportunidades.
            </p>

            {/* Checklist de características */}
            <div className="w-full text-left mt-5 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>NFC de contacto instantáneo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Código QR de respaldo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Todas tus redes sincronizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Tu sitio web corporativo</span>
              </div>
            </div>
          </div>

          <div className="w-full pt-6 mt-4 border-t border-slate-100 flex flex-col items-center">
            <span className="font-serif italic text-sm text-slate-600 tracking-wider">
              Tap. Connect. Grow.
            </span>
            <span className="font-black text-slate-900 text-lg tracking-tighter mt-0.5">
              Bit
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
