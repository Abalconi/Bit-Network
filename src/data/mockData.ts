import { UserProfile, BitDevice, CrmLead, ActivityItem } from '../types';
import avatarImg from '../assets/images/alessandra_balconi_avatar_1790194941845.jpg';
import coverImg from '../assets/images/guatemala_volcano_cover_1790194928574.jpg';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-alessandra-01',
  email: 'alessandra@bit.me',
  nombre: 'Alessandra Balconi',
  cargo: 'Head of Business Intelligence',
  empresa: 'Data & Tech Solutions',
  tagline: 'Data & Tech | Business Intelligence | Travel',
  descripcion: 'Especialista en analítica predictiva, arquitectura de datos y crecimiento empresarial. Conectando personas y tecnología para transformar decisiones complejas en resultados claros.',
  avatarUrl: avatarImg,
  coverUrl: coverImg,
  telefono: '+502 5555 1234',
  whatsapp: '+502 5555 1234',
  ubicacion: 'Ciudad de Guatemala, GT',
  handle: 'alessandra',
  redesSociales: {
    linkedin: 'https://linkedin.com/in/alessandrabalconi',
    instagram: 'https://instagram.com/alessandrabalconi',
    tiktok: 'https://tiktok.com/@alessandrabalconi',
    facebook: 'https://facebook.com/alessandra.balconi',
    website: 'https://bit.me/alessandra',
  },
  sections: {
    sobreMi: {
      titulo: 'Sobre mi',
      subtitulo: 'Conoce más sobre mi y mi experiencia',
      contenido: 'Más de 8 años liderando equipos de BI, analítica avanzada y modelado de datos para empresas Fortune 500 y startups de alto impacto en Latinoamérica y Europa.',
      skills: ['Business Intelligence', 'Data Engineering', 'BigQuery & SQL', 'Growth Analytics', 'NFC Tech'],
    },
    miTrabajo: {
      titulo: 'Mi trabajo',
      subtitulo: 'Proyectos, skills y lo que hago',
      proyectos: [
        {
          nombre: 'Data Platform Scaling',
          detalle: 'Migración y optimización de pipelines de datos procesando más de 50M de eventos diarios.',
        },
        {
          nombre: 'Bit Networking Deployment',
          detalle: 'Estrategia de adopción de credenciales físicas NFC e integración instantánea con CRM.',
        },
        {
          nombre: 'Executive Dashboards',
          detalle: 'Visualización ejecutiva de KPI para C-Level con reportes en tiempo real y alertas automáticas.',
        },
      ],
    },
    contactame: {
      titulo: 'Contáctame',
      subtitulo: 'Hablemos, estoy disponible',
      disponible: true,
      mensaje: 'Actualmente abierta a asesorías estratégicas, conferencias sobre Inteligencia de Negocios y alianzas tecnológicas.',
    },
  },
  quote: 'Transformando datos en decisiones.',
};

export const INITIAL_BIT_DEVICE: BitDevice = {
  idInterno: 'BIT-00892',
  tokenPublico: '8F3K2x9Z',
  nombre: 'Tu Bit',
  status: 'Active',
  tipo: 'Sticker Holográfico',
  urlPublica: 'https://bit.me/alessandra',
  scansCount: 0,
  tapsCount: 0,
  tapsTotales: 0,
  ultimoTap: 'Sin registros',
  serialNumber: 'NFC-8F3K2-NTAG213',
  createdAt: '2025-08-01T10:00:00Z',
  bateria: 'Pasivo (NFC NTAG213 sin batería)',
};

// Arreglo limpio sin datos sintéticos: solo contendrá contactos reales capturados
export const INITIAL_LEADS: CrmLead[] = [];

export const INITIAL_ACTIVITY: ActivityItem[] = [];

export const DASHBOARD_STATS = {

  visitas: {
    valor: 1284,
    cambio: '+18%',
    periodo: 'vs. mes anterior',
    sparkline: [45, 52, 60, 58, 65, 72, 85, 90, 84, 98, 110, 125, 118, 134, 145],
  },
  taps: {
    valor: 342,
    cambio: '+24%',
    periodo: 'vs. mes anterior',
    sparkline: [12, 18, 15, 22, 28, 26, 35, 42, 38, 45, 52, 48, 56, 62, 70],
  },
  contactos: {
    valor: 47,
    cambio: '+12%',
    periodo: 'vs. mes anterior',
    sparkline: [2, 3, 4, 3, 5, 6, 7, 6, 8, 9, 10, 9, 12, 14, 15],
  },
  escaneosQr: {
    valor: 89,
    cambio: '+36%',
    periodo: 'vs. mes anterior',
    sparkline: [5, 7, 8, 10, 12, 14, 13, 16, 19, 21, 20, 24, 28, 30, 34],
  },
};

export const LEADS_SUMMARY_STATS = {
  totalLeads: { valor: 247, cambio: '+32%' },
  contactados: { valor: 124, cambio: '+28%' },
  enNegociacion: { valor: 47, cambio: '+18%' },
  ganados: { valor: 28, cambio: '+12%' },
  tasaConversion: { valor: '11.3%', cambio: '+4.2%' },
};

export const CHANNEL_DISTRIBUTION = [
  { nombre: 'NFC', porcentaje: 42, color: '#3b82f6', leads: 104 },
  { nombre: 'QR', porcentaje: 28, color: '#8b5cf6', leads: 69 },
  { nombre: 'Perfil', porcentaje: 18, color: '#06b6d4', leads: 44 },
  { nombre: 'Web', porcentaje: 8, color: '#f59e0b', leads: 20 },
  { nombre: 'Otros', porcentaje: 4, color: '#ef4444', leads: 10 },
];
