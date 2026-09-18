export type BitStatus = 'Active' | 'Inactive' | 'Pending';

export type ContactStage = 'Nuevo' | 'Contactado' | 'En negociación' | 'Ganado' | 'Perdido';

export type LeadChannel = 'NFC' | 'QR' | 'Perfil' | 'Web' | 'Otros';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  cargo: string;
  empresa: string;
  tagline: string;
  descripcion: string;
  avatarUrl: string;
  coverUrl: string;
  telefono: string;
  whatsapp: string;
  ubicacion: string;
  handle: string; // e.g. "alessandra" -> bit.me/alessandra
  redesSociales: {
    linkedin?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  sections: {
    sobreMi: {
      titulo: string;
      subtitulo: string;
      contenido: string;
      skills: string[];
    };
    miTrabajo: {
      titulo: string;
      subtitulo: string;
      proyectos: Array<{ nombre: string; detalle: string; link?: string }>;
    };
    contactame: {
      titulo: string;
      subtitulo: string;
      disponible: boolean;
      mensaje: string;
    };
  };
  quote: string;
}

export interface BitDevice {
  idInterno: string; // ej: 'BIT-00042'
  tokenPublico: string; // ej: '8F3K2x9Z'
  nombre: string;
  status: BitStatus;
  tipo: 'Sticker Holográfico' | 'Tarjeta Mate' | 'Llavero';
  urlPublica: string;
  scansCount: number;
  tapsCount: number;
  tapsTotales: number;
  ultimoTap: string;
  serialNumber: string;
  createdAt: string;
  bateria?: string;
}

export interface VisitorExchangeData {
  nombre: string;
  email: string;
  telefono: string;
  whatsapp?: string;
  empresa: string;
  cargo: string;
  notas: string;
  consentAccepted: boolean;
}

export interface CrmLead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  cargo: string;
  canal: LeadChannel;
  estatus: ContactStage;
  origen: string; // 'Restaurante', 'Evento', 'Perfil público', 'Tienda'
  ubicacion?: string;
  fecha: string;
  avatarColor?: string;
  avatarInitial?: string;
  avatarUrl?: string;
  notasHistorial?: Array<{
    id: string;
    texto: string;
    fecha: string;
    autor: string;
  }>;
  actividadHistorial?: Array<{
    id: string;
    accion: string;
    fecha: string;
    tipo: 'tap' | 'email' | 'call' | 'status_change' | 'qr';
  }>;
}

export interface ActivityItem {
  id: string;
  tipo: 'contacto' | 'tap' | 'visita' | 'lead' | 'qr';
  titulo: string;
  detalle: string;
  tiempo?: string;
  fecha?: string;
}

// Interfaces de soporte legacy para compatibilidad
export interface CrmContact {
  id: string;
  userEmail: string;
  bitOriginId: string;
  nombre: string;
  empresa: string;
  cargo: string;
  email: string;
  telefono: string;
  whatsapp?: string;
  estado: ContactStage | string;
  origen: string;
  notas: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DjangoFile {
  path: string;
  title: string;
  description: string;
  category: 'models' | 'views' | 'urls' | 'templates' | 'admin' | 'services';
  code: string;
}
