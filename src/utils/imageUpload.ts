/**
 * Utilidad para optimizar y convertir imágenes subidas por el usuario a Data URLs seguras.
 * - Comprime y redimensiona de forma óptima para no sobrecargar el almacenamiento local
 * - Genera un formato universal compatible tanto con Supabase/Django backend como con localStorage
 * - Garantiza que las imágenes se sincronicen entre dispositivos sin depender de rutas temporales (blob:)
 */

export interface ProcessImageOptions {
  maxDimension?: number;
  quality?: number;
}

export function processUploadedImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<string> {
  const { maxDimension = 1200, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado debe ser una imagen válida (JPG, PNG, WebP o GIF).'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Ocurrió un error al leer el archivo en el dispositivo.'));
    };

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== 'string') {
        reject(new Error('No se pudo procesar la imagen seleccionada.'));
        return;
      }

      // Si es un SVG liviano, conservarlo directo
      if (file.type === 'image/svg+xml') {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onerror = () => {
        reject(new Error('No se pudo decodificar el formato de la imagen.'));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensionar proporcionalmente para optimizar peso y transferencia de red
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Dibujar en el canvas redimensionado
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar como JPEG optimizado para fotos
        try {
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(result);
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}
