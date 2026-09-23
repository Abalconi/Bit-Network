import React, { useState } from 'react';
import { 
  Download, 
  Check, 
  User, 
  Briefcase, 
  Mail, 
  ChevronRight, 
  Globe, 
  Phone, 
  Search, 
  Lock, 
  Sparkles, 
  Wifi, 
  Battery, 
  Share2, 
  Smartphone, 
  Monitor, 
  Radio, 
  CheckCircle2, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../types';
import { ShareContactModal } from './ShareContactModal';
import { ProfileSectionDetailModal } from './ProfileSectionDetailModal';

interface ClientProfileShowcaseProps {
  user: UserProfile;
  onSimulateNfcTap?: () => void;
}

export const ClientProfileShowcase: React.FC<ClientProfileShowcaseProps> = ({
  user,
}) => {
  const [downloadedVcard, setDownloadedVcard] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeDetailSection, setActiveDetailSection] = useState<'sobreMi' | 'miTrabajo' | 'contactame' | null>(null);
  
  // Vista: 'dual' (como la imagen de referencia: escritorio + celular) o 'mobile-only' (pantalla completa móvil)
  const [viewMode, setViewMode] = useState<'dual' | 'mobile-only'>('dual');
  const [nfcTappedNotice, setNfcTappedNotice] = useState(false);

  // Descarga del archivo vCard real .vcf
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
    setTimeout(() => setDownloadedVcard(false), 3500);
  };

  const handleSimulateTap = () => {
    // Sonido sutil de lectura NFC vía Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Ignorar si el navegador bloquea audio sin interacción directa
    }

    setNfcTappedNotice(true);
    setTimeout(() => setNfcTappedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#edf2f7] text-slate-800 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      
      {/* Toast animado al simular Tap NFC */}
      {nfcTappedNotice && (
        <div className="fixed top-6 z-50 animate-in slide-in-from-top-4 duration-300 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-cyan-400/40">
          <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black text-cyan-300">¡Tap NFC Detectado Exitosamente!</p>
            <p className="text-[11px] text-slate-300">Chip NTAG213 transmitió bit.me/{user.handle}</p>
          </div>
        </div>
      )}

      {/* Cabecera idéntica a la imagen de referencia */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Perfil del cliente
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Así se ve tu perfil público cuando alguien escanea tu Bit o entra a tu link.
          </p>
        </div>

        {/* Controles interactivos: Selector de Vista & Simular Tap */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-xs font-bold">
            <button
              onClick={() => setViewMode('dual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'dual'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Vista Dual</span>
            </button>
            <button
              onClick={() => setViewMode('mobile-only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'mobile-only'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Solo Celular</span>
            </button>
          </div>

          <button
            onClick={handleSimulateTap}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
            title="Prueba lo que ocurre físicamente al acercar el teléfono a la tarjeta o sticker BIT"
          >
            <Radio className="w-4 h-4" />
            <span>Simular Tap NFC</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VISTA DUAL: ESCRITORIO (IZQUIERDA) + CELULAR IPHONE (DERECHA)   */}
      {/* ============================================================== */}
      {viewMode === 'dual' ? (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          
          {/* 1. MOCKUP VENTANA DE NAVEGADOR DE ESCRITORIO (7 columnas en LG, 8 en XL) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            
            {/* Barra superior de la ventana del navegador (Chrome / macOS) */}
            <div className="bg-[#1e293b] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
              {/* Botones de ventana (Rojo, Amarillo, Verde) */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-inner" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-inner" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-inner" />
              </div>

              {/* Barra de dirección URL */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-1 flex items-center gap-2 text-xs text-slate-300 font-mono shadow-inner w-64 max-w-full justify-center">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="truncate">bit.me/{user.handle}</span>
              </div>

              {/* Espacio derecho para balance */}
              <div className="w-12" />
            </div>

            {/* Contenido dentro del navegador */}
            <div className="flex flex-col bg-white">
              
              {/* Portada panorámica de volcanes al atardecer con recorte curvo */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={user.coverUrl}
                  alt="Volcán de Guatemala al atardecer"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Degradado sutil para profundidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Recorte curvo blanco inferior característico del diseño BIT */}
                <div className="absolute -bottom-1 left-0 right-0 h-10 bg-white rounded-t-[50%] scale-x-125" />
              </div>

              {/* Avatar centrado con borde blanco */}
              <div className="relative -mt-16 sm:-mt-20 flex flex-col items-center px-6 pb-8">
                
                <div className="relative">
                  <img
                    src={user.avatarUrl}
                    alt={user.nombre}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-[4px] border-white shadow-xl bg-white"
                  />
                </div>

                {/* Nombre y Especialidad */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 text-center tracking-tight">
                  {user.nombre}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 text-center tracking-tight">
                  {user.tagline}
                </p>

                {/* Fila de Redes Sociales (LinkedIn, Instagram, TikTok, Facebook, WhatsApp, Web) */}
                <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-4 flex-wrap">
                  
                  {/* LinkedIn */}
                  {user.redesSociales.linkedin && (
                    <a
                      href={user.redesSociales.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
                      title="LinkedIn de Alessandra"
                    >
                      <span className="text-xs font-black">in</span>
                    </a>
                  )}

                  {/* Instagram */}
                  {user.redesSociales.instagram && (
                    <a
                      href={user.redesSociales.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
                      title="Instagram"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
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
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
                      title="TikTok"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
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
                      className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
                      title="Facebook"
                    >
                      <span className="text-sm font-black">f</span>
                    </a>
                  )}

                  {/* WhatsApp Directo */}
                  <a
                    href={`https://wa.me/50255551234?text=Hola%20${encodeURIComponent(user.nombre)},%20vi%20tu%20perfil%20Bit.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </a>

                  {/* Website */}
                  {user.redesSociales.website && (
                    <a
                      href={user.redesSociales.website}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-sm"
                      title="Página Web"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}

                </div>

                {/* Botón Principal: Guardar contacto & Compartir Contacto */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full max-w-md">
                  <button
                    onClick={handleDownloadVCard}
                    className="w-full py-2.5 px-6 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
                  >
                    {downloadedVcard ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>¡Contacto Guardado en Teléfono!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Guardar contacto</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="w-full py-2.5 px-6 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir mi contacto</span>
                  </button>
                </div>

                {/* 3 Tarjetas en fila horizontal (Grid de 3 columnas en escritorio) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-8 w-full max-w-2xl">
                  
                  {/* Tarjeta 1: Sobre mí */}
                  <div
                    onClick={() => setActiveDetailSection('sobreMi')}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition">
                        Sobre mí
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Conoce más sobre mí y mi experiencia.
                      </p>
                    </div>
                  </div>

                  {/* Tarjeta 2: Mi trabajo */}
                  <div
                    onClick={() => setActiveDetailSection('miTrabajo')}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-cyan-400 hover:shadow-md transition cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 group-hover:text-cyan-600 transition">
                        Mi trabajo
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Proyectos, skills y lo que hago.
                      </p>
                    </div>
                  </div>

                  {/* Tarjeta 3: Contáctame */}
                  <div
                    onClick={() => setActiveDetailSection('contactame')}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-purple-300 hover:shadow-md transition cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition">
                        Contáctame
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Hablemos, estoy disponible.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Quote inferior & Línea de acento azul */}
                <div className="mt-8 flex flex-col items-center">
                  <p className="text-xs font-medium text-slate-500 tracking-tight">
                    {user.quote}
                  </p>
                  <span className="w-10 h-1 rounded-full bg-blue-500 mt-2" />
                </div>

              </div>

            </div>

          </div>

          {/* 2. MOCKUP SMARTPHONE IPHONE (5 columnas en LG, 4 en XL) */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center sticky top-6">
            <div className="w-[320px] sm:w-[340px] rounded-[48px] bg-slate-900 p-2.5 shadow-2xl border-[6px] border-slate-300">
              
              {/* Pantalla del teléfono */}
              <div className="rounded-[40px] bg-white overflow-hidden flex flex-col min-h-[640px] shadow-inner relative">
                
                {/* Status Bar Superior: 9:41, Señal, Wifi, Batería */}
                <div className="h-9 px-6 flex items-center justify-between text-[11px] font-bold text-white z-20 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-4 h-4" />
                  </div>
                </div>

                {/* Portada panorámica de volcanes */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={user.coverUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Recorte curvo */}
                  <div className="absolute -bottom-1 left-0 right-0 h-8 bg-white rounded-t-[50%] scale-x-125" />
                </div>

                {/* Avatar circular superpuesto */}
                <div className="relative -mt-14 flex flex-col items-center px-4 pb-6">
                  
                  <img
                    src={user.avatarUrl}
                    alt={user.nombre}
                    className="w-24 h-24 rounded-full object-cover border-[3.5px] border-white shadow-xl bg-white"
                  />

                  {/* Nombre y Especialidad */}
                  <h3 className="text-base font-black text-slate-900 mt-2 text-center tracking-tight">
                    {user.nombre}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 text-center tracking-tight mt-0.5">
                    {user.tagline}
                  </p>

                  {/* Redes Sociales en el celular */}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <a
                      href={user.redesSociales.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-sm"
                    >
                      <span className="text-[10px] font-black">in</span>
                    </a>
                    <a
                      href={user.redesSociales.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-sm"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href={user.redesSociales.tiktok}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-sm"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.88-4.5V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.85 4.85 0 0 1-1-.06z" />
                      </svg>
                    </a>
                    <a
                      href={`https://wa.me/50255551234?text=Hola%20${encodeURIComponent(user.nombre)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    </a>
                  </div>

                  {/* Botón Principal Guardar Contacto en Móvil */}
                  <button
                    onClick={handleDownloadVCard}
                    className="mt-3.5 w-full py-2.5 px-4 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
                  >
                    {downloadedVcard ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Guardado!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Guardar contacto</span>
                      </>
                    )}
                  </button>

                  {/* Botón Compartir Contacto en Móvil */}
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="mt-1.5 w-full py-1.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-3 h-3 text-indigo-600" />
                    <span>Compartir mi contacto</span>
                  </button>

                  {/* Lista de Filas Apiladas (Mobile Stacked List) idéntica a la imagen */}
                  <div className="w-full mt-4 space-y-2">
                    
                    {/* Fila 1: Sobre mí */}
                    <div
                      onClick={() => setActiveDetailSection('sobreMi')}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between transition cursor-pointer shadow-sm active:bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-xs text-slate-900 leading-tight">Sobre mí</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Conoce más sobre mí y mi experiencia</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    </div>

                    {/* Fila 2: Mi trabajo */}
                    <div
                      onClick={() => setActiveDetailSection('miTrabajo')}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between transition cursor-pointer shadow-sm active:bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-xs text-slate-900 leading-tight">Mi trabajo</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Proyectos, skills y lo que hago</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    </div>

                    {/* Fila 3: Contáctame */}
                    <div
                      onClick={() => setActiveDetailSection('contactame')}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between transition cursor-pointer shadow-sm active:bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-xs text-slate-900 leading-tight">Contáctame</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Hablemos, estoy disponible</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    </div>

                  </div>

                  {/* Quote inferior en Móvil */}
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-[10px] font-medium text-slate-400 tracking-tight text-center">
                      {user.quote}
                    </p>
                    <span className="w-8 h-0.5 rounded-full bg-blue-500 mt-1.5" />
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      ) : (
        /* ============================================================== */
        /* VISTA SOLO CELULAR PANTALLA COMPLETA (Experiencia Tap Móvil)     */
        /* ============================================================== */
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col pb-12 animate-in zoom-in-95 duration-200">
          
          {/* Barra superior estilo navegador móvil con URL segura */}
          <div className="bg-[#1e293b] px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>bit.me/{user.handle}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
              NFC Verificado
            </span>
          </div>

          {/* Portada panorámica de volcanes */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <img
              src={user.coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute -bottom-1 left-0 right-0 h-10 bg-white rounded-t-[50%] scale-x-125" />
          </div>

          {/* Avatar circular superpuesto */}
          <div className="relative -mt-16 flex flex-col items-center px-6">
            
            <img
              src={user.avatarUrl}
              alt={user.nombre}
              className="w-28 h-28 rounded-full object-cover border-[4px] border-white shadow-xl bg-white"
            />

            {/* Nombre y Especialidad */}
            <h2 className="text-xl font-black text-slate-900 mt-3 text-center tracking-tight">
              {user.nombre}
            </h2>
            <p className="text-xs font-semibold text-slate-500 text-center tracking-tight mt-0.5">
              {user.tagline}
            </p>

            {/* Redes Sociales */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <a
                href={user.redesSociales.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-sm"
              >
                <span className="text-xs font-black">in</span>
              </a>
              <a
                href={user.redesSociales.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={user.redesSociales.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.88-4.5V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.85 4.85 0 0 1-1-.06z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/50255551234?text=Hola%20${encodeURIComponent(user.nombre)}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
            </div>

            {/* Botones de Acción */}
            <div className="w-full mt-4 space-y-2">
              <button
                onClick={handleDownloadVCard}
                className="w-full py-3 px-6 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
              >
                {downloadedVcard ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Contacto Guardado en Teléfono!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Guardar contacto</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full py-2.5 px-6 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir mi contacto con Alessandra</span>
              </button>
            </div>

            {/* Lista Móvil */}
            <div className="w-full mt-6 space-y-2.5">
              
              <div
                onClick={() => setActiveDetailSection('sobreMi')}
                className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between transition cursor-pointer shadow-sm active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-slate-900">Sobre mí</p>
                    <p className="text-[11px] text-slate-500">Conoce más sobre mí y mi experiencia</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div
                onClick={() => setActiveDetailSection('miTrabajo')}
                className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between transition cursor-pointer shadow-sm active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-slate-900">Mi trabajo</p>
                    <p className="text-[11px] text-slate-500">Proyectos, skills y lo que hago</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div
                onClick={() => setActiveDetailSection('contactame')}
                className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between transition cursor-pointer shadow-sm active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-slate-900">Contáctame</p>
                    <p className="text-[11px] text-slate-500">Hablemos, estoy disponible</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

            </div>

            {/* Quote inferior */}
            <div className="mt-8 flex flex-col items-center">
              <p className="text-xs font-medium text-slate-400 tracking-tight text-center">
                {user.quote}
              </p>
              <span className="w-10 h-1 rounded-full bg-blue-500 mt-2" />
            </div>

          </div>

        </div>
      )}

      {/* Modal para Compartir Contacto */}
      <ShareContactModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        user={user}
        onSuccess={() => {
          // El modal da feedback propio
        }}
      />

      {/* Modal para Ver Detalles de Sección (Sobre mí, Mi trabajo, Contáctame) */}
      <ProfileSectionDetailModal
        section={activeDetailSection}
        onClose={() => setActiveDetailSection(null)}
        user={user}
        onOpenShareContact={() => setIsShareModalOpen(true)}
      />

    </div>
  );
};
