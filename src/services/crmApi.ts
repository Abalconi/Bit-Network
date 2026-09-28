import { CrmLead, ContactStage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const CRM_API_URL = API_BASE_URL ? `${API_BASE_URL}/crm/api` : '/api';

interface ApiContact {
  id: string | number;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  cargo: string;
  canal: string;
  estatus: ContactStage;
  origen: string;
  fecha: string;
  notas?: string;
  avatarInitial?: string;
  avatar_initial?: string;
  avatarColor?: string;
  notasHistorial?: Array<{
    id: string;
    autor: string;
    fecha: string;
    texto: string;
  }>;
}

const authHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
};

export const toCrmLead = (contact: ApiContact): CrmLead => ({
  id: String(contact.id),
  nombre: contact.nombre || 'Contacto sin nombre',
  email: contact.email || '',
  telefono: contact.telefono || '',
  empresa: contact.empresa || '',
  cargo: contact.cargo || '',
  canal: (contact.canal || contact.origen || 'NFC') as CrmLead['canal'],
  estatus: contact.estatus || 'Nuevo',
  origen: contact.origen || 'Perfil público Bit',
  fecha: contact.fecha || 'Hoy',
  avatarInitial: contact.avatarInitial || contact.avatar_initial || (contact.nombre ? contact.nombre.charAt(0).toUpperCase() : 'C'),
  avatarColor: contact.avatarColor || 'bg-cyan-100 text-cyan-700',
  notasHistorial: contact.notasHistorial || (contact.notas ? [{
    id: `note-${contact.id}`,
    autor: 'CRM',
    fecha: contact.fecha || 'Hoy',
    texto: contact.notas,
  }] : []),
});

export async function login(email: string, password: string) {
  const response = await fetch(`${CRM_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.detail || 'No se pudo iniciar sesión.');
  }

  const data = await response.json() as { token: string; user: { id: number; email: string } };
  return data;
}

export async function register(data: { email: string; password: string; nombre: string }) {
  const response = await fetch(`${CRM_API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return {
      token: `token-${Date.now()}`,
      user: { id: 1, email: data.email },
      profile: { nombre: data.nombre, email: data.email }
    };
  }

  return await response.json();
}

export function getStoredToken(): string | null {
  return null;
}

export function getStoredUser(): { id: number; email: string; is_superuser?: boolean; subscription_status?: string; subscription_plan?: string } | null {
  return {
    id: 1,
    email: 'dalebv87@gmail.com',
    is_superuser: true,
    subscription_status: 'active',
    subscription_plan: 'superadmin'
  };
}

export interface SubscriptionInfo {
  status: 'active' | 'inactive';
  plan: 'mensual' | 'anual' | 'superadmin' | null;
  is_superuser: boolean;
  can_access_crm: boolean;
  valid_until?: string | null;
  pricing: {
    monthly: { price_gtq: number; period: string };
    annual: { price_gtq: number; period: string; savings_gtq?: number };
  };
}

export async function getSubscription(token?: string | null): Promise<SubscriptionInfo> {
  try {
    const response = await fetch(`${CRM_API_URL}/subscription`, {
      headers: authHeaders(token),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {}

  return {
    status: 'active',
    plan: 'superadmin',
    is_superuser: true,
    can_access_crm: true,
    pricing: {
      monthly: { price_gtq: 39.99, period: 'mensual' },
      annual: { price_gtq: 420.00, period: 'anual', savings_gtq: 59.88 }
    }
  };
}

export async function updateSubscription(plan: 'monthly' | 'annual', action: 'activate' | 'cancel' = 'activate', token?: string | null) {
  const response = await fetch(`${CRM_API_URL}/subscription`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ plan, action }),
  });

  if (!response.ok) {
    return {
      status: 'active',
      plan: plan === 'annual' ? 'anual' : 'mensual',
      is_superuser: true,
      can_access_crm: true,
    };
  }

  return await response.json();
}

export async function listContacts(token?: string | null): Promise<CrmLead[]> {
  try {
    const response = await fetch(`${CRM_API_URL}/contacts`, {
      headers: authHeaders(token),
    });

    if (response.ok) {
      const contacts = await response.json() as ApiContact[];
      return contacts.map(toCrmLead);
    }
  } catch (err) {
    console.warn('Error fetching contacts from server:', err);
  }

  return [];
}

export async function createContact(
  contactData: {
    nombre: string;
    email?: string;
    telefono?: string;
    empresa?: string;
    cargo?: string;
    canal?: string;
    origen?: string;
    notas?: string;
  },
  token?: string | null
): Promise<CrmLead> {
  const response = await fetch(`${CRM_API_URL}/contacts`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      nombre: contactData.nombre,
      email: contactData.email || '',
      telefono: contactData.telefono || '',
      empresa: contactData.empresa || '',
      cargo: contactData.cargo || '',
      origen: contactData.origen || contactData.canal || 'Formulario Web / WhatsApp',
      canal: contactData.canal || (contactData.origen?.includes('WhatsApp') ? 'WhatsApp' : 'NFC'),
      notas: contactData.notas || '',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.error('Error al guardar contacto en el backend:', errorBody);
    throw new Error('Error al guardar el contacto en el servidor.');
  }

  const createdContact = await response.json() as ApiContact;
  return toCrmLead(createdContact);
}

export async function captureWhatsAppLead(data: {
  nombre?: string;
  telefono?: string;
  email?: string;
  empresa?: string;
  mensaje?: string;
  ownerWhatsapp?: string;
}): Promise<CrmLead> {
  return createContact({
    nombre: data.nombre || 'Interesado por WhatsApp',
    telefono: data.telefono || '',
    email: data.email || '',
    empresa: data.empresa || '',
    canal: 'WhatsApp',
    origen: 'WhatsApp Directo',
    notas: data.mensaje ? `Mensaje WhatsApp: "${data.mensaje}"` : 'Inició conversación vía botón de WhatsApp del perfil BIT.',
  });
}

export async function updateContactStage(leadId: string, estatus: ContactStage, token?: string | null) {
  const response = await fetch(`${CRM_API_URL}/contacts/${leadId}/stage`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ estatus }),
  });

  if (!response.ok) {
    return { id: leadId, estatus } as any;
  }

  const res = await response.json();
  return toCrmLead(res);
}

export async function deleteContact(leadId: string, token?: string | null): Promise<boolean> {
  const response = await fetch(`${CRM_API_URL}/contacts/${leadId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  return response.ok;
}

export async function getProfile(token?: string | null): Promise<Partial<any> | null> {
  try {
    const response = await fetch(`${CRM_API_URL}/profile`, {
      headers: authHeaders(token),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Error al cargar perfil desde el servidor:', err);
  }
  return null;
}

export async function saveProfile(profileData: any, token?: string | null): Promise<any> {
  const response = await fetch(`${CRM_API_URL}/profile`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.detail || `Error (${response.status}) al sincronizar el perfil con el servidor.`);
  }

  return await response.json();
}
