import React, { useState, useRef } from 'react';
import { 
  User, 
  Briefcase, 
  Mail, 
  ChevronRight, 
  Globe, 
  Share2, 
  ExternalLink,
  MessageCircle,
  FileDown,
  Building2,
  MapPin,
  Check,
  Edit3,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { ShareContactModal } from './ShareContactModal';
import { ProfileSectionDetailModal } from './ProfileSectionDetailModal';
import { processUploadedImage } from '../utils/imageUpload';

interface PublicFullScreenProfileProps {
  user: UserProfile;
  onOpenCrm?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onLeadCapture?: (lead: { nombre: string; telefono: string; email: string; empresa: string; mensaje: string }) => void;
}

export const PublicFullScreenProfile: React.FC<PublicFullScreenProfileProps> = ({
  user,
  onOpenCrm,
  onUpdateUser,
  onLeadCapture
}) => {
  const [downloadedVcard, setDownloadedVcard] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeDetailSection, setActiveDetailSection] = useState<'sobreMi' | 'miTrabajo' | 'contactame' | null>(null);

  // Estados de subida directa de fotos desde el perfil público
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const showQuickFeedback = (msg: string) => {
    setPhotoFeedback(msg);
    setTimeout(() => setPhotoFeedback(null), 3500);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateUser) return;

    setIsUploadingCover(true);
    try {
      const optimizedUrl = await processUploadedImage(file, { maxDimension: 1600, quality: 0.88 });
      onUpdateUser({ coverUrl: optimizedUrl });
      showQuickFeedback('¡Foto de fondo actualizada!');
    } catch (err: any) {
      alert(err?.message || 'Error al procesar la foto de fondo');
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateUser) return;

    setIsUploadingAvatar(true);
    try {
      const optimizedUrl = await processUploadedImage(file, { maxDimension: 800, quality: 0.90 });
      onUpdateUser({ avatarUrl: optimizedUrl });
      showQuickFeedback('¡Foto de perfil actualizada!');
    } catch (err: any) {
      alert(err?.message || 'Error al procesar la foto de perfil');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Descarga real de archivo vCard (.vcf)
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
    link.setAttribute('download', `${user.nombre.toLowerCase().replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedVcard(true);
    setTimeout(() => setDownloadedVcard(false), 3500);
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Inputs de subida ocultos */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
        onChange={handleCoverUpload}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* Notificación flotante de foto actualizada */}
      {photoFeedback && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white font-bold text-xs backdrop-blur-md shadow-2xl border border-white/20 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{photoFeedback}</span>
        </div>
      )}

      {/* Botón flotante para acceder a editar datos desde el CRM */}
      {onOpenCrm && (
        <button
          onClick={onOpenCrm}
          className="fixed top-4 right-4 z-40 px-3.5 py-2 rounded-full bg-slate-900/85 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-xl transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          title="Ir al panel CRM para editar fotos, enlaces y textos"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Editar en CRM</span>
        </button>
      )}

      {/* ============================================================== */}
      {/* 1. PORTADA FULL WIDTH WEB CON RECORTE CURVO INFERIOR           */}
      {/* ============================================================== */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden bg-slate-900 group">
        <img
          src={user.coverUrl}
          alt="Portada"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Degradado para dar profundidad visual */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

        {/* Botón directo para subir/cambiar foto de fondo */}
        {onUpdateUser && (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="absolute top-4 left-4 z-30 px-3.5 py-2 rounded-full bg-slate-900/85 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-xl transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Subir foto de fondo desde tu dispositivo"
          >
            {isUploadingCover ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>Cambiar fondo</span>
          </button>
        )}

        {/* Recorte curvo blanco inferior que abarca el 100% del ancho de la pantalla */}
        <div className="absolute -bottom-2 left-0 right-0 h-12 sm:h-16 md:h-20 bg-white rounded-t-[50%] scale-x-125" />
      </div>

      {/* ============================================================== */}
      {/* 2. CONTENIDO PRINCIPAL: AVATAR, IDENTIDAD Y ACCIONES            */}
      {/* ============================================================== */}
      <div className="relative -mt-20 sm:-mt-28 md:-mt-32 flex flex-col items-center px-4 sm:px-6 w-full max-w-5xl mx-auto flex-1 pb-16">
        
        {/* Avatar grande centrado con botón de subida */}
        <div className="relative group/avatar">
          <img
            src={user.avatarUrl}
            alt={user.nombre}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full object-cover border-[5px] sm:border-[6px] border-white shadow-2xl bg-white"
          />

          {/* Botón directo para subir/cambiar foto de perfil */}
          {onUpdateUser && (
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2.5 sm:p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl border-2 sm:border-3 border-white transition active:scale-95 cursor-pointer transform hover:scale-105"
              title="Subir foto de perfil desde tu dispositivo"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Nombre completo */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mt-4 text-center tracking-tight">
          {user.nombre}
        </h1>

        {/* Tagline / Título profesional */}
        <p className="text-sm sm:text-lg md:text-xl font-semibold text-slate-600 mt-1.5 text-center tracking-tight max-w-2xl">
          {user.tagline}
        </p>

        {/* Empresa y Ubicación si existen */}
        <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-slate-500 font-medium mt-2 flex-wrap">
          {user.empresa && (
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              {user.empresa}
            </span>
          )}
          {user.ubicacion && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {user.ubicacion}
            </span>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. ICONOS DE REDES SOCIALES (FB, IG, WA, TIKTOK, LINKEDIN, WEB)*/}
        {/* ============================================================== */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 flex-wrap">
          
          {/* LinkedIn */}
          {user.redesSociales.linkedin && (
            <a
              href={user.redesSociales.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
            >
              <span className="text-sm sm:text-base font-black">in</span>
            </a>
          )}

          {/* Instagram */}
          {user.redesSociales.instagram && (
            <a
              href={user.redesSociales.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          )}

          {/* TikTok */}
          {user.redesSociales.tiktok && (
            <a
              href={user.redesSociales.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.88-4.5V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.85 4.85 0 0 1-1-.06z" />
              </svg>
            </a>
          )}

          {/* Facebook */}
          {user.redesSociales.facebook && (
            <a
              href={user.redesSociales.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
            >
              <span className="text-base sm:text-lg font-black">f</span>
            </a>
          )}

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(user.nombre)},%20acabo%20de%20escanear%20tu%20Bit.`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </a>

          {/* Página Web */}
          {user.redesSociales.website && (
            <a
              href={user.redesSociales.website}
              target="_blank"
              rel="noreferrer"
              aria-label="Página Web"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
            >
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          )}

        </div>

        {/* ============================================================== */}
        {/* 4. BOTONES PRINCIPALES: GUARDAR CONTACTO (.VCF) Y COMPARTIR     */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-7 w-full max-w-lg">
          
          {/* Botón Guardar contacto */}
          <button
            onClick={handleDownloadVCard}
            className="w-full py-3.5 px-6 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition cursor-pointer"
          >
            {downloadedVcard ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span>¡Contacto guardado!</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                <span>Guardar contacto</span>
              </>
            )}
          </button>

          {/* Botón Compartir contacto */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full py-3.5 px-6 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/90 font-bold text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-indigo-600" />
            <span>Compartir mi contacto</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* 5. TARJETAS / SECCIONES: SOBRE MÍ, MI TRABAJO, CONTÁCTAME       */}
        {/* Responsive: 1 columna en móvil, 3 columnas en pantallas grandes */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
          
          {/* Tarjeta 1: Sobre mí */}
          <div
            onClick={() => setActiveDetailSection('sobreMi')}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-400 hover:shadow-lg transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                <User className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition">
                  {user.sections.sobreMi.titulo}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {user.sections.sobreMi.subtitulo || 'Conoce más sobre mí y mi experiencia.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 flex-shrink-0 ml-2" />
          </div>

          {/* Tarjeta 2: Mi trabajo */}
          <div
            onClick={() => setActiveDetailSection('miTrabajo')}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-cyan-400 hover:shadow-lg transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-cyan-600 transition">
                  {user.sections.miTrabajo.titulo}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {user.sections.miTrabajo.subtitulo || 'Proyectos, skills y lo que hago.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-600 flex-shrink-0 ml-2" />
          </div>

          {/* Tarjeta 3: Contáctame */}
          <div
            onClick={() => setActiveDetailSection('contactame')}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-400 hover:shadow-lg transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-600 transition">
                  {user.sections.contactame.titulo}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {user.sections.contactame.subtitulo || 'Hablemos, estoy disponible.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 flex-shrink-0 ml-2" />
          </div>

        </div>

        {/* ============================================================== */}
        {/* 6. LEMA INFERIOR & LÍNEA DE ACENTO                             */}
        {/* ============================================================== */}
        <div className="mt-12 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-slate-400 max-w-md">
            "{user.quote}"
          </p>
          <span className="w-12 h-1 rounded-full bg-blue-500 mt-2.5" />
        </div>

      </div>

      {/* MODAL PARA COMPARTIR CONTACTO */}
      <ShareContactModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        user={user}
        onSuccess={onLeadCapture}
      />

      {/* MODAL DE DETALLE DE SECCIONES */}
      <ProfileSectionDetailModal
        section={activeDetailSection}
        onClose={() => setActiveDetailSection(null)}
        user={user}
        onOpenShareContact={() => setIsShareModalOpen(true)}
      />

    </div>
  );
};
