import React, { useState } from 'react';
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
  Building
} from 'lucide-react';
import { UserProfile } from '../../types';

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

  // Guardar cambios en el perfil
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
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Image className="w-4 h-4 text-indigo-600" />
                <span>Imágenes de Perfil y Portada</span>
              </h3>

              {/* Vista previa combinada */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-44">
                <img
                  src={formData.coverUrl}
                  alt="Vista previa portada"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <img
                    src={formData.avatarUrl}
                    alt="Vista previa avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-white"
                  />
                  <div className="text-white drop-shadow">
                    <p className="font-black text-sm">{formData.nombre || 'Tu Nombre'}</p>
                    <p className="text-xs text-white/80">{formData.tagline || 'Especialidad / Cargo'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* URL de Portada */}
                <div className="space-y-2">
                  <label className="font-bold text-xs text-slate-700 block">
                    URL de la Foto de Portada
                  </label>
                  <input
                    type="url"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400">Predefinidas:</span>
                    {coverPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, coverUrl: preset })}
                        className="w-5 h-5 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition cursor-pointer"
                      >
                        <img src={preset} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL de Foto de Perfil / Avatar */}
                <div className="space-y-2">
                  <label className="font-bold text-xs text-slate-700 block">
                    URL de la Foto de Perfil (Avatar)
                  </label>
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400">Predefinidas:</span>
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarUrl: preset })}
                        className="w-5 h-5 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition cursor-pointer"
                      >
                        <img src={preset} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
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
