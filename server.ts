import express, { Request, Response } from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DIST_DIR = path.resolve(__dirname, 'dist');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const SUBSCRIPTION_FILE = path.join(DATA_DIR, 'subscription.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers for data reading and writing
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Default profile with real data
const DEFAULT_PROFILE = {
  id: 'usr-alessandra-01',
  email: 'dalebv87@gmail.com',
  nombre: 'Alessandra Balconi',
  cargo: 'Head of Business Intelligence',
  empresa: 'Data & Tech Solutions',
  tagline: 'Data & Tech | Business Intelligence | Travel',
  descripcion: 'Especialista en analítica predictiva, arquitectura de datos y crecimiento empresarial. Conectando personas y tecnología para transformar decisiones complejas en resultados claros.',
  avatarUrl: '',
  coverUrl: '',
  telefono: '+502 5697 7540',
  whatsapp: '+502 5697 7540',
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
      titulo: 'Sobre mí',
      subtitulo: 'Conoce más sobre mí y mi experiencia',
      contenido: 'Más de 8 años liderando equipos de BI, analítica avanzada y modelado de datos para empresas Fortune 500 y startups de alto impacto en Latinoamérica y Europa.',
      skills: ['Business Intelligence', 'Data Engineering', 'BigQuery & SQL', 'Growth Analytics', 'NFC Tech']
    },
    miTrabajo: {
      titulo: 'Mi trabajo',
      subtitulo: 'Proyectos, skills y lo que hago',
      proyectos: [
        {
          nombre: 'Data Platform Scaling',
          detalle: 'Migración y optimización de pipelines de datos procesando más de 50M de eventos diarios.'
        },
        {
          nombre: 'Bit Networking Deployment',
          detalle: 'Estrategia de adopción de credenciales físicas NFC e integración instantánea con CRM.'
        },
        {
          nombre: 'Executive Dashboards',
          detalle: 'Visualización ejecutiva de KPI para C-Level con reportes en tiempo real y alertas automáticas.'
        }
      ]
    },
    contactame: {
      titulo: 'Contáctame',
      subtitulo: 'Hablemos, estoy disponible',
      disponible: true,
      mensaje: 'Escríbeme o llámame para coordinar una reunión.'
    }
  },
  subscription_status: 'active',
  subscription_plan: 'superadmin',
  is_superuser: true
};

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// CORS headers for all incoming requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Asynchronous background forwarder to Railway (fire-and-forget mirror)
async function mirrorToRailway(pathSuffix: string, method: string, body?: any) {
  try {
    const railwayUrl = `https://bit-network-backend-production.up.railway.app${pathSuffix}`;
    await fetch(railwayUrl, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }).catch(() => {});
  } catch {}
}

// ---------------------------------------------------------------------------
// API ROUTES: Profile
// ---------------------------------------------------------------------------
const handleGetProfile = (_req: Request, res: Response) => {
  const profile = readJsonFile(PROFILE_FILE, DEFAULT_PROFILE);
  return res.json(profile);
};

const handleUpdateProfile = (req: Request, res: Response) => {
  const current = readJsonFile(PROFILE_FILE, DEFAULT_PROFILE);
  const data = req.body || {};

  const updated = {
    ...current,
    ...data,
    redesSociales: {
      ...(current.redesSociales || {}),
      ...(data.redesSociales || {}),
    },
    sections: {
      ...(current.sections || {}),
      ...(data.sections || {}),
    },
  };

  // Ensure phone and whatsapp are preserved if provided
  if (data.telefono !== undefined) updated.telefono = String(data.telefono).trim();
  if (data.whatsapp !== undefined) updated.whatsapp = String(data.whatsapp).trim();
  if (data.nombre !== undefined) updated.nombre = String(data.nombre).trim();
  if (data.email !== undefined) updated.email = String(data.email).trim();

  writeJsonFile(PROFILE_FILE, updated);

  // Background mirror
  mirrorToRailway('/crm/api/profile/', 'PUT', updated);

  return res.json({
    status: 'ok',
    detail: 'Perfil actualizado con éxito en el servidor.',
    profile: updated,
  });
};

app.get('/api/profile', handleGetProfile);
app.get('/crm/api/profile/', handleGetProfile);
app.get('/crm/api/public/profile/', handleGetProfile);

app.put('/api/profile', handleUpdateProfile);
app.post('/api/profile', handleUpdateProfile);
app.put('/crm/api/profile/', handleUpdateProfile);
app.post('/crm/api/profile/', handleUpdateProfile);

// ---------------------------------------------------------------------------
// API ROUTES: Contacts (CRM Leads)
// ---------------------------------------------------------------------------
const handleGetContacts = (_req: Request, res: Response) => {
  const contacts = readJsonFile<any[]>(CONTACTS_FILE, []);
  return res.json(contacts);
};

const handleCreateContact = (req: Request, res: Response) => {
  const contacts = readJsonFile<any[]>(CONTACTS_FILE, []);
  const body = req.body || {};

  const nombre = (body.nombre || '').trim() || 'Contacto Interesado';
  const telefono = (body.telefono || '').trim();
  const email = (body.email || '').trim();
  const empresa = (body.empresa || '').trim();
  const cargo = (body.cargo || '').trim();
  const canal = body.canal || (body.origen?.includes('WhatsApp') ? 'WhatsApp' : 'NFC');
  const origen = body.origen || 'Formulario de Contacto Bit';
  const notas = body.notas || body.mensaje || '';

  const newContact = {
    id: `lead-${Date.now()}`,
    nombre,
    email,
    telefono,
    empresa,
    cargo,
    canal,
    estatus: 'Nuevo',
    origen,
    fecha: 'Hoy',
    ubicacion: body.ubicacion || 'Guatemala',
    avatarInitial: nombre.charAt(0).toUpperCase() || 'C',
    avatarColor: 'bg-cyan-100 text-cyan-700',
    notasHistorial: notas ? [
      {
        id: `note-${Date.now()}`,
        texto: notas,
        fecha: 'Hoy',
        autor: 'CRM',
      }
    ] : [],
  };

  // Prepend to top of list
  const updatedContacts = [newContact, ...contacts];
  writeJsonFile(CONTACTS_FILE, updatedContacts);

  // Background mirror to Railway public capture
  mirrorToRailway('/crm/api/public/capture/', 'POST', {
    nombre,
    email,
    telefono,
    empresa,
    cargo,
    origen,
    notas,
  });

  return res.status(201).json(newContact);
};

app.get('/api/contacts', handleGetContacts);
app.get('/crm/api/contacts/', handleGetContacts);
app.get('/crm/api/public/capture/', handleGetContacts);

app.post('/api/contacts', handleCreateContact);
app.post('/api/public/capture', handleCreateContact);
app.post('/crm/api/contacts/', handleCreateContact);
app.post('/crm/api/public/capture/', handleCreateContact);

// Update stage
app.patch(['/api/contacts/:id/stage', '/crm/api/contacts/:id/stage/'], (req: Request, res: Response) => {
  const { id } = req.params;
  const { estatus } = req.body;
  const contacts = readJsonFile<any[]>(CONTACTS_FILE, []);

  const index = contacts.findIndex(c => String(c.id) === String(id));
  if (index !== -1) {
    contacts[index].estatus = estatus;
    writeJsonFile(CONTACTS_FILE, contacts);
    return res.json(contacts[index]);
  }
  return res.status(404).json({ error: 'Contacto no encontrado' });
});

// Delete contact
app.delete(['/api/contacts/:id', '/crm/api/contacts/:id/'], (req: Request, res: Response) => {
  const { id } = req.params;
  const contacts = readJsonFile<any[]>(CONTACTS_FILE, []);
  const filtered = contacts.filter(c => String(c.id) !== String(id));
  writeJsonFile(CONTACTS_FILE, filtered);
  return res.status(204).send();
});

// ---------------------------------------------------------------------------
// API ROUTES: Subscription & Auth
// ---------------------------------------------------------------------------
const handleGetSubscription = (_req: Request, res: Response) => {
  return res.json({
    status: 'active',
    plan: 'superadmin',
    is_superuser: true,
    can_access_crm: true,
    pricing: {
      monthly: { price_gtq: 39.99, period: 'mensual' },
      annual: { price_gtq: 420.00, period: 'anual', savings_gtq: 59.88 },
    },
  });
};

app.get('/api/subscription', handleGetSubscription);
app.get('/crm/api/subscription/', handleGetSubscription);

app.post(['/api/subscription', '/crm/api/subscription/'], (req: Request, res: Response) => {
  const { plan } = req.body;
  return res.json({
    status: 'active',
    plan: plan === 'annual' ? 'anual' : 'mensual',
    is_superuser: true,
    can_access_crm: true,
    pricing: {
      monthly: { price_gtq: 39.99, period: 'mensual' },
      annual: { price_gtq: 420.00, period: 'anual', savings_gtq: 59.88 },
    },
  });
});

app.post(['/api/login', '/crm/api/login/'], (req: Request, res: Response) => {
  const email = (req.body.email || 'dalebv87@gmail.com').trim().toLowerCase();
  return res.json({
    token: `token-${Date.now()}`,
    user: {
      id: 1,
      email,
      is_superuser: true,
      subscription_status: 'active',
      subscription_plan: 'superadmin',
    },
  });
});

// ---------------------------------------------------------------------------
// DEV & PRODUCTION RUNTIMES
// ---------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(compression() as unknown as express.RequestHandler);
    app.use(express.static(DIST_DIR, { index: false }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend & Frontend unified server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
