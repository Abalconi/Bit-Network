/**
 * Utilidad para optimizar y convertir imágenes subidas por el usuario a Data URLs
 * Redimensiona proporcionalmente para evitar saturar el almacenamiento de LocalStorage
 * garantizando la máxima nitidez tanto en móviles como en pantallas de alta resolución.
 */

export interface ProcessImageOptions {
  maxDimension?: number;
  quality?: number;
}

export function processUploadedImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<string> {
  const { maxDimension = 1400, quality = 0.86 } = options;

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

      // Si es un SVG o GIF animado ligero, podemos devolverlo directo
      if (file.type === 'image/svg+xml' || (file.type === 'image/gif' && file.size < 500 * 1024)) {
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

        // Si la imagen es más grande que maxDimension, calcular escala proporcional
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
          // Si el navegador no soporta 2D context, usar dataUrl original
          resolve(result);
          return;
        }

        // Suavizado de bordes para alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Dibujar en el canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar como JPEG optimizado para fotos, o PNG si conserva transparencias
        const isPngWithAlpha = file.type === 'image/png';
        const outputMime = isPngWithAlpha ? 'image/png' : 'image/jpeg';
        
        try {
          const optimizedDataUrl = canvas.toDataURL(outputMime, quality);
          resolve(optimizedDataUrl);
        } catch {
          // Fallback seguro al Data URL original
          resolve(result);
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}
