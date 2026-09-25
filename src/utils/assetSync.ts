import { INITIAL_USER_PROFILE } from '../data/mockData';
import { UserProfile } from '../types';

/**
 * Normaliza cualquier ruta de imagen/avatar para que sea universalmente consistente
 * tanto entre distintos dominios, dispositivos móviles/escritorio, localStorage y Supabase.
 */
export function normalizeAssetUrl(
  url: string | null | undefined, 
  type: 'avatar' | 'cover'
): string {
  const fallback = type === 'avatar' 
    ? INITIAL_USER_PROFILE.avatarUrl 
    : INITIAL_USER_PROFILE.coverUrl;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  const clean = url.trim();

  // Si es un fallback generado automáticamente por ui-avatars.com (círculo con letras como "HE"),
  // descartarlo y usar la fotografía real del perfil
  if (clean.includes('ui-avatars.com')) {
    return fallback;
  }

  // 1. Data URLs optimizadas (Base64 JPEG/WebP/PNG) - válidas y autocontenidas en cualquier dispositivo
  if (clean.startsWith('data:image/')) {
    return clean;
  }

  // 2. URLs absolutas https o http (Supabase Storage, Cloudinary, AWS S3, Unsplash)
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // 3. Blob URLs temporales generadas en una sesión local previa
  // (Los blob: URLs caducan al cerrar o cambiar de pestaña/dispositivo, por lo que deben retornar el asset seguro)
  if (clean.startsWith('blob:')) {
    return fallback;
  }

  // 4. Si contiene rutas relativas rotas de desarrollo como '/src/assets/' o '/@fs/'
  if (clean.startsWith('/src/assets/') || clean.startsWith('/@fs/')) {
    return fallback;
  }

  // 5. Assets ya empaquetados por Vite (ej: /assets/alessandra_balconi_avatar-...jpg)
  if (clean.startsWith('/assets/') || clean.startsWith('assets/')) {
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  return clean;
}

/**
 * Repara y fusiona de forma segura los datos de perfil para evitar que
 * queden en blanco las redes sociales, fotos o textos importantes al sincronizar
 * entre el móvil, la PC, localStorage y el servidor backend.
 */
export function repairAndMergeUserProfile(
  savedOrRemote: Partial<UserProfile> | null | undefined,
  base: UserProfile = INITIAL_USER_PROFILE
): UserProfile {
  if (!savedOrRemote) return base;

  // Restaurar nombre si fue reemplazado por texto de prueba genérico como 'hello'
  const rawNombre = savedOrRemote.nombre?.trim();
  const nombre = (rawNombre && rawNombre.toLowerCase() !== 'hello')
    ? rawNombre
    : base.nombre;

  // Fusión profunda estricta para redes sociales: NUNCA dejar el objeto vacío ni perder iconos
  const remoteRedes = savedOrRemote.redesSociales || {};
  const redesSociales = {
    linkedin: remoteRedes.linkedin?.trim() || base.redesSociales.linkedin,
    instagram: remoteRedes.instagram?.trim() || base.redesSociales.instagram,
    tiktok: remoteRedes.tiktok?.trim() || base.redesSociales.tiktok,
    facebook: remoteRedes.facebook?.trim() || base.redesSociales.facebook,
    website: remoteRedes.website?.trim() || base.redesSociales.website,
  };

  const avatarUrl = normalizeAssetUrl(savedOrRemote.avatarUrl, 'avatar');
  const coverUrl = normalizeAssetUrl(savedOrRemote.coverUrl, 'cover');

  return {
    ...base,
    ...savedOrRemote,
    nombre,
    avatarUrl,
    coverUrl,
    redesSociales,
    tagline: savedOrRemote.tagline?.trim() || base.tagline,
    empresa: savedOrRemote.empresa?.trim() || base.empresa,
    cargo: savedOrRemote.cargo?.trim() || base.cargo,
    ubicacion: savedOrRemote.ubicacion?.trim() || base.ubicacion,
    whatsapp: savedOrRemote.whatsapp?.trim() || base.whatsapp,
    telefono: savedOrRemote.telefono?.trim() || base.telefono,
    email: savedOrRemote.email?.trim() || base.email,
    descripcion: savedOrRemote.descripcion?.trim() || base.descripcion,
    sections: savedOrRemote.sections || base.sections,
    quote: savedOrRemote.quote?.trim() || base.quote,
  };
}
