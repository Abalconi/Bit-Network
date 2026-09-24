import { INITIAL_USER_PROFILE } from '../data/mockData';

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
