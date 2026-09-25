import { CrmLead, ContactStage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bit-network-backend-production.up.railway.app';
const CRM_API_URL = `${API_BASE_URL}/crm/api`;

interface ApiContact {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  cargo: string;
  canal: string;
  estatus: ContactStage;
  origen: string;
  fecha: string;
  notas: string;
  avatar_initial: string;
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
  fecha: contact.fecha ? new Date(contact.fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short' }) : 'Hoy',
  avatarInitial: contact.avatar_initial || (contact.nombre ? contact.nombre.charAt(0).toUpperCase() : 'C'),
  avatarColor: 'bg-cyan-100 text-cyan-700',
  notasHistorial: contact.notas ? [{
    id: `note-${contact.id}`,
    autor: 'CRM',
    fecha: contact.fecha ? new Date(contact.fecha).toLocaleDateString('es-GT') : 'Hoy',
    texto: contact.notas,
  }] : [],
});

export async function login(email: string, password: string) {
  const response = await fetch(`${CRM_API_URL}/login/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });

  if (!response.ok) {
    throw new Error('No se pudo iniciar sesión. Revisa tus credenciales.');
  }

  const data = await response.json() as {token: string; user: {id: number; email: string}};
  if (data.token) {
    localStorage.setItem('bit_crm_token', data.token);
    localStorage.setItem('bit_crm_user', JSON.stringify(data.user));
  }
  return data;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('bit_crm_token');
}

export async function listContacts(token?: string | null): Promise<CrmLead[]> {
  const effectiveToken = token || getStoredToken();
  
  // POR SEGURIDAD Y PRIVACIDAD DE DATOS:
  // Si no hay token de propietario, NO descargar la lista de contactos del backend.
  // Un cliente o visitante público solo debe poder capturar su propio contacto (POST), no listar los de otros (GET).
  if (!effectiveToken) {
    return [];
  }

  const url = `${CRM_API_URL}/contacts/`;

  const response = await fetch(url, {
    headers: authHeaders(effectiveToken),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado o revocado
      localStorage.removeItem('bit_crm_token');
      localStorage.removeItem('bit_crm_user');
      throw new Error('Sesión expirada. Por favor ingresa nuevamente con tus credenciales.');
    }
    throw new Error('No se pudieron cargar los contactos del servidor.');
  }

  const contacts = await response.json() as ApiContact[];
  const leads = contacts.map(toCrmLead);
  
  // Guardar en caché local para persistencia instantánea y offline
  try {
    localStorage.setItem('bit_crm_leads', JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving leads to localStorage', e);
  }
  
  return leads;
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
  const effectiveToken = token || getStoredToken();
  
  // Si tenemos token usamos el endpoint autenticado, de lo contrario el endpoint público de captura
  const url = effectiveToken 
    ? `${CRM_API_URL}/contacts/` 
    : `${CRM_API_URL}/public/capture/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: authHeaders(effectiveToken),
    body: JSON.stringify({
      nombre: contactData.nombre,
      email: contactData.email || '',
      telefono: contactData.telefono || '',
      empresa: contactData.empresa || '',
      cargo: contactData.cargo || '',
      origen: contactData.origen || contactData.canal || 'Formulario Web / WhatsApp',
      notas: contactData.notas || '',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error al guardar contacto en el backend:', errorBody);
    throw new Error('Error al guardar el contacto en la base de datos.');
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
    origen: 'WhatsApp Directo',
    notas: data.mensaje ? `Mensaje WhatsApp: "${data.mensaje}"` : 'Inició conversación vía botón de WhatsApp del perfil BIT.',
  });
}

export async function updateContactStage(leadId: string, estatus: ContactStage, token?: string | null) {
  const effectiveToken = token || getStoredToken();
  if (!effectiveToken) {
    throw new Error('Se requiere autenticación para actualizar la etapa del contacto.');
  }

  const response = await fetch(`${CRM_API_URL}/contacts/${leadId}/stage/`, {
    method: 'PATCH',
    headers: authHeaders(effectiveToken),
    body: JSON.stringify({estatus}),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar la etapa del contacto.');
  }

  return toCrmLead(await response.json() as ApiContact);
}

export async function deleteContact(leadId: string, token?: string | null): Promise<boolean> {
  const effectiveToken = token || getStoredToken();
  if (!effectiveToken) {
    throw new Error('Se requiere autenticación para eliminar un contacto.');
  }

  const response = await fetch(`${CRM_API_URL}/contacts/${leadId}/`, {
    method: 'DELETE',
    headers: authHeaders(effectiveToken),
  });

  return response.ok;
}

/**
 * Obtener perfil de usuario desde el backend (público para visitantes o autenticado para el dueño)
 */
export async function getProfile(token?: string | null): Promise<Partial<any> | null> {
  const effectiveToken = token || getStoredToken();

  try {
    const response = await fetch(`${CRM_API_URL}/profile/`, {
      headers: authHeaders(effectiveToken),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Endpoint de perfil no disponible en el backend, usando almacenamiento local:', err);
  }
  return null;
}

/**
 * Guardar perfil de usuario en el backend si el endpoint está disponible
 */
export async function saveProfile(profileData: any, token?: string | null): Promise<any> {
  const effectiveToken = token || getStoredToken();
  if (!effectiveToken) {
    throw new Error('Debes iniciar sesión con tu cuenta de propietario para guardar y sincronizar tu perfil en la nube.');
  }

  const response = await fetch(`${CRM_API_URL}/profile/`, {
    method: 'PUT',
    headers: authHeaders(effectiveToken),
    body: JSON.stringify(profileData),
  });

  if (response.status === 401) {
    // El token guardado ya no es válido en el backend (ej: reinicio o cambio de contraseña)
    localStorage.removeItem('bit_crm_token');
    localStorage.removeItem('bit_crm_user');
    throw new Error('Tu sesión ha expirado o ya no es válida. Por favor inicia sesión nuevamente en Acceso Propietario.');
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.detail || `Error (${response.status}) al sincronizar el perfil con el servidor.`);
  }

  return await response.json();
}
