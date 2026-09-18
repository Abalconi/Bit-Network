import { CrmLead, ContactStage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
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

const authHeaders = (token: string) => ({
  Authorization: `Token ${token}`,
  'Content-Type': 'application/json',
});

const toCrmLead = (contact: ApiContact): CrmLead => ({
  id: String(contact.id),
  nombre: contact.nombre,
  email: contact.email,
  telefono: contact.telefono,
  empresa: contact.empresa,
  cargo: contact.cargo,
  canal: contact.canal as CrmLead['canal'],
  estatus: contact.estatus,
  origen: contact.origen,
  fecha: new Date(contact.fecha).toLocaleDateString('es-GT'),
  avatarInitial: contact.avatar_initial,
  avatarColor: 'bg-cyan-100 text-cyan-700',
  notasHistorial: contact.notas ? [{
    id: `note-${contact.id}`,
    autor: 'CRM',
    fecha: new Date(contact.fecha).toLocaleDateString('es-GT'),
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

  return response.json() as Promise<{token: string; user: {id: number; email: string}} >;
}

export async function listContacts(token: string): Promise<CrmLead[]> {
  const response = await fetch(`${CRM_API_URL}/contacts/`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error('No se pudieron cargar los contactos.');
  }

  const contacts = await response.json() as ApiContact[];
  return contacts.map(toCrmLead);
}

export async function updateContactStage(token: string, leadId: string, estatus: ContactStage) {
  const response = await fetch(`${CRM_API_URL}/contacts/${leadId}/stage/`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({estatus}),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar la etapa del contacto.');
  }

  return toCrmLead(await response.json() as ApiContact);
}
