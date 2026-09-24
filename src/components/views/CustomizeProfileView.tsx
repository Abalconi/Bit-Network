import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Image, 
  Link as LinkIcon, 
  Type, 
  FileText, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Globe, 
  Eye, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  Upload,
  Camera,
  Loader2,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { UserProfile } from '../../types';
import { processUploadedImage } from '../../utils/imageUpload';

interface CustomizeProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenPublicProfile: () => void;
}

export const CustomizeProfileView: React.FC<CustomizeProfileViewProps> = ({
  user,
  onUpdateUser,
  onOpenPublicProfile
}) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [activeTab, setActiveTab] = useState<'general' | 'links' | 'sections'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados de subida y arrastre de fotos
  const [isProcessingCover, setIsProcessingCover] = useState(false);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Modos de entrada (archivo o URL)
  const [coverInputMode, setCoverInputMode] = useState<'upload' | 'url'>('upload');
  const [avatarInputMode, setAvatarInputMode] = useState<'upload' | 'url'>('upload');

  // Referencias a inputs de archivos ocultos
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar formData si el usuario cambia externamente
  useEffect(() => {
    setFormData(user);
  }, [user]);

  const showUploadFeedback = (msg: string) => {
    setUploadMessage(msg);
    setUploadError(null);
    setTimeout(() => setUploadMessage(null), 3500);
  };

  const showUploadErrorMsg = (err: string) => {
    setUploadError(err);
    setUploadMessage(null);
    setTimeout(() => setUploadError(null), 5000);
  };

  // Procesar archivo de portada subido por el cliente
  const handleCoverFileSelected = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showUploadErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    setIsProcessingCover(true);
    setUploadError(null);

    try {
      const optimizedUrl = await processUploadedImage(file, { maxDimension: 1600, quality: 0.88 });
      setFormData(prev => ({ ...prev, coverUrl: optimizedUrl }));
      onUpdateUser({ coverUrl: optimizedUrl });
      showUploadFeedback('¡Foto de fondo actualizada y guardada con éxito!');
    } catch (err: any) {
      showUploadErrorMsg(err?.message || 'Error al procesar la foto de fondo.');
    } finally {
      setIsProcessingCover(false);
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = '';
      }
    }
  };

  // Procesar archivo de avatar subido por el cliente
  const handleAvatarFileSelected = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showUploadErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    setIsProcessingAvatar(true);
    setUploadError(null);

    try {
      const optimizedUrl = await processUploadedImage(file, { maxDimension: 800, quality: 0.90 });
      setFormData(prev => ({ ...prev, avatarUrl: optimizedUrl }));
      onUpdateUser({ avatarUrl: optimizedUrl });
      showUploadFeedback('¡Foto de perfil actualizada y guardada con éxito!');
    } catch (err: any) {
      showUploadErrorMsg(err?.message || 'Error al procesar la foto de perfil.');
    } finally {
      setIsProcessingAvatar(false);
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = '';
      }
    }
  };

  // Guardar cambios generales en el perfil
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Galería de fotos predefinidas para cambio rápido si el usuario lo desea
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
  ];

  const coverPresets = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Encabezado con botón de Ver Perfil Público en vivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span>Editar Perfil Digital de Bit</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Modifica tus fotos (portada y avatar), enlaces a redes sociales, títulos de tarjetas y textos descriptivos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPublicProfile}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-indigo-200/60"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Ver perfil en vivo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs para organizar la edición */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'general'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Fotos e Información Básica</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'links'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Enlaces y Redes Sociales</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'sections'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tarjetas de Información</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ============================================================== */}
        {/* TAB 1: GENERAL (FOTOS, NOMBRE, TITULOS, EMPRESA)               */}
        {/* ============================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            
            {/* Fotos (Avatar y Portada) */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Image className="w-4 h-4 text-indigo-600" />
                    <span>Imágenes de Perfil y Portada</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sube tus propias fotos desde tu celular o computadora para personalizar tu perfil digital.
                  </p>
                </div>
                
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 self-start sm:self-auto flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Subida directa habilitada
                </span>
              </div>

              {/* Mensajes de notificación de subida */}
              {uploadMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{uploadMessage}</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Inputs de archivo ocultos accesibles programáticamente */}
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverFileSelected(file);
                }}
              />
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarFileSelected(file);
                }}
              />

              {/* Vista previa interactiva combinada */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-48 sm:h-56 group shadow-inner">
                <img
                  src={formData.coverUrl}
                  alt="Vista previa portada"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
                
                {/* Botón flotante para cambiar foto de fondo directamente */}
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={isProcessingCover}
                  className="absolute top-3 right-3 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {isProcessingCover ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>Cambiar Foto de Fondo</span>
                </button>

                {/* Avatar y Datos superpuestos */}
                <div className="absolute bottom-3 left-4 flex items-center gap-3.5">
                  <div className="relative group/avatar">
                    <img
                      src={formData.avatarUrl}
                      alt="Vista previa avatar"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-white shadow-xl bg-white"
                    />
                    {/* Botón flotante para cambiar avatar */}
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      disabled={isProcessingAvatar}
                      className="absolute -bottom-1 -right-1 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border-2 border-white transition active:scale-95 cursor-pointer"
                      title="Subir foto de perfil"
                    >
                      {isProcessingAvatar ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-white drop-shadow">
                    <p className="font-black text-sm sm:text-base leading-tight">{formData.nombre || 'Tu Nombre'}</p>
                    <p className="text-xs text-white/90 font-medium">{formData.tagline || 'Especialidad / Cargo'}</p>
                    <p className="text-[11px] text-blue-200 hidden sm:block mt-0.5">
                      Haz clic en los botones de cámara para subir fotos nuevas
                    </p>
                  </div>
                </div>
              </div>

              {/* Paneles de Configuración Individual: Fondo y Perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* ============================================================== */}
                {/* 1. SECCIÓN FOTO DE FONDO / PORTADA                              */}
                {/* ============================================================== */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Foto de Fondo (Portada)</span>
                    </label>

                    {/* Alternador Subir Archivo vs URL */}
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setCoverInputMode('upload')}
                        className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          coverInputMode === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Subir archivo
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverInputMode('url')}
                        className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          coverInputMode === 'url' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        URL / Galería
                      </button>
                    </div>
                  </div>

                  {coverInputMode === 'upload' ? (
                    /* Zona de Subida y Arrastre para Fondo */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingCover(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingCover(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingCover(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleCoverFileSelected(file);
                      }}
                      className={`p-4 border-2 border-dashed rounded-xl transition flex flex-col items-center justify-center text-center cursor-pointer ${
                        isDraggingCover 
                          ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-200' 
                          : 'border-slate-300 hover:border-indigo-400 bg-white'
                      }`}
                      onClick={() => coverFileInputRef.current?.click()}
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shadow-xs">
                        {isProcessingCover ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <p className="font-bold text-xs text-slate-800">
                        {isProcessingCover ? 'Optimizando foto...' : 'Selecciona o arrastra una foto de fondo'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        JPG, PNG, WebP · Tamaño ideal: 1400×600 px
                      </p>

                      <button
                        type="button"
                        disabled={isProcessingCover}
                        className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Subir desde tu equipo</span>
                      </button>
                    </div>
                  ) : (
                    /* Entrada manual de URL y Predefinidas para Fondo */
                    <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <input
                          type="url"
                          value={formData.coverUrl}
                          onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-400">Predefinidas:</span>
                        {coverPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, coverUrl: preset });
                              onUpdateUser({ coverUrl: preset });
                            }}
                            className="w-6 h-6 rounded-md overflow-hidden border border-slate-300 hover:scale-110 transition cursor-pointer shadow-xs"
                            title={`Seleccionar fondo ${idx + 1}`}
                          >
                            <img src={preset} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ============================================================== */}
                {/* 2. SECCIÓN FOTO DE PERFIL (AVATAR)                             */}
                {/* ============================================================== */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Foto de Perfil (Avatar)</span>
                    </label>

                    {/* Alternador Subir Archivo vs URL */}
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setAvatarInputMode('upload')}
                        className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          avatarInputMode === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Subir archivo
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarInputMode('url')}
                        className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          avatarInputMode === 'url' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        URL / Galería
                      </button>
                    </div>
                  </div>

                  {avatarInputMode === 'upload' ? (
                    /* Zona de Subida y Arrastre para Avatar */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingAvatar(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingAvatar(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingAvatar(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleAvatarFileSelected(file);
                      }}
                      className={`p-4 border-2 border-dashed rounded-xl transition flex flex-col items-center justify-center text-center cursor-pointer ${
                        isDraggingAvatar 
                          ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-200' 
                          : 'border-slate-300 hover:border-indigo-400 bg-white'
                      }`}
                      onClick={() => avatarFileInputRef.current?.click()}
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shadow-xs">
                        {isProcessingAvatar ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <p className="font-bold text-xs text-slate-800">
                        {isProcessingAvatar ? 'Optimizando foto...' : 'Selecciona o arrastra tu foto de perfil'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        JPG, PNG, WebP · Tamaño ideal: cuadrada o retrato 1:1
                      </p>

                      <button
                        type="button"
                        disabled={isProcessingAvatar}
                        className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Subir desde tu equipo</span>
                      </button>
                    </div>
                  ) : (
                    /* Entrada manual de URL y Predefinidas para Avatar */
                    <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <input
                          type="url"
                          value={formData.avatarUrl}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-400">Predefinidas:</span>
                        {avatarPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, avatarUrl: preset });
                              onUpdateUser({ avatarUrl: preset });
                            }}
                            className="w-6 h-6 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition cursor-pointer shadow-xs"
                            title={`Seleccionar avatar ${idx + 1}`}
                          >
                            <img src={preset} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Datos Personales y Textos */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-600" />
                <span>Textos Principales del Perfil</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Handle / Enlace Bit (bit.me/...)
                  </label>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Subtítulo / Especialidad (ej: Data & Tech | Business Intelligence | Travel)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Empresa u Organización
                  </label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Cargo o Puesto
                  </label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Lema / Frase al pie del perfil
                  </label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ENLACES Y REDES SOCIALES                                */}
        {/* ============================================================== */}
        {activeTab === 'links' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-600" />
              <span>Enlaces a Redes Sociales y Comunicación</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ingresa los enlaces que se mostrarán en los iconos circulares del perfil. Si dejas uno vacío, se ocultará automáticamente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* WhatsApp */}
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Número de WhatsApp (con código de país)
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="+502 5555 1234"
                />
              </div>

              {/* Teléfono para vCard */}
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Teléfono para Guardar en Contactos
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Enlace de LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.redesSociales.linkedin || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    redesSociales: { ...formData.redesSociales, linkedin: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Enlace de Instagram
                </label>
                <input
                  type="url"
                  value={formData.redesSociales.instagram || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    redesSociales: { ...formData.redesSociales, instagram: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Enlace de TikTok
                </label>
                <input
                  type="url"
                  value={formData.redesSociales.tiktok || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    redesSociales: { ...formData.redesSociales, tiktok: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://tiktok.com/@..."
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Enlace de Facebook
                </label>
                <input
                  type="url"
                  value={formData.redesSociales.facebook || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    redesSociales: { ...formData.redesSociales, facebook: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://facebook.com/..."
                />
              </div>

              {/* Página Web */}
              <div className="md:col-span-2">
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Página Web o Blog Personal
                </label>
                <input
                  type="url"
                  value={formData.redesSociales.website || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    redesSociales: { ...formData.redesSociales, website: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="https://tusitio.com"
                />
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TARJETAS DE INFORMACIÓN (SOBRE MÍ, MI TRABAJO, ETC)     */}
        {/* ============================================================== */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            
            {/* Sección 1: Sobre mí */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Tarjeta 1: Sobre Mí</span>
                <span className="text-xs text-slate-400 font-normal">Sección interactiva</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Título de la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.sections.sobreMi.titulo}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        sobreMi: { ...formData.sections.sobreMi, titulo: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Subtítulo en la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.sections.sobreMi.subtitulo}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        sobreMi: { ...formData.sections.sobreMi, subtitulo: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Texto / Contenido al abrir la tarjeta
                  </label>
                  <textarea
                    rows={4}
                    value={formData.sections.sobreMi.contenido}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        sobreMi: { ...formData.sections.sobreMi, contenido: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Mi Trabajo */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Tarjeta 2: Mi Trabajo</span>
                <span className="text-xs text-slate-400 font-normal">Proyectos y proyectos destacados</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Título de la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.sections.miTrabajo.titulo}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        miTrabajo: { ...formData.sections.miTrabajo, titulo: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Subtítulo en la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.sections.miTrabajo.subtitulo}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        miTrabajo: { ...formData.sections.miTrabajo, subtitulo: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Contáctame */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Tarjeta 3: Contáctame</span>
                <span className="text-xs text-slate-400 font-normal">Mensaje directo y llamada a la acción</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Título de la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.sections.contactame.titulo}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        contactame: { ...formData.sections.contactame, titulo: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Subtítulo en la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.sections.contactame.subtitulo}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        contactame: { ...formData.sections.contactame, subtitulo: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Mensaje de bienvenida al contacto
                  </label>
                  <textarea
                    rows={3}
                    value={formData.sections.contactame.mensaje}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        contactame: { ...formData.sections.contactame, mensaje: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* BOTÓN FLOTANTE O FIJO DE GUARDADO */}
        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Check className="w-4 h-4" />
                <span>¡Cambios guardados y aplicados en el perfil público!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Guardar todos los cambios</span>
          </button>
        </div>

      </form>
    </div>
  );
};
