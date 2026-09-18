import React, { useEffect, useState } from 'react';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_BIT_DEVICE, 
  INITIAL_LEADS, 
  INITIAL_ACTIVITY 
} from './data/mockData';
import { 
  UserProfile, 
  BitDevice, 
  CrmLead, 
  ActivityItem, 
  ContactStage, 
  VisitorExchangeData 
} from './types';
import { Sidebar, NavTabId } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { ClientProfileView } from './components/views/ClientProfileView';
import { LeadsView } from './components/views/LeadsView';
import { SalesPipelineView } from './components/views/SalesPipelineView';
import { NfcHardwareView } from './components/views/NfcHardwareView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { BrandingView } from './components/views/BrandingView';
import { LandingPageView } from './components/views/LandingPageView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { NewContactModal } from './components/NewContactModal';
import { PublicFullScreenProfile } from './components/PublicFullScreenProfile';
import { CrmAuthModal } from './components/CrmAuthModal';
import { listContacts, login, updateContactStage } from './services/crmApi';
import { CheckCircle2, Bell } from 'lucide-react';

export default function App() {
  // Estado global de datos
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [device, setDevice] = useState<BitDevice>(INITIAL_BIT_DEVICE);
  const [leads, setLeads] = useState<CrmLead[]>(INITIAL_LEADS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  // Navegación y Vistas
  // La Landing Page es la página principal pública de presentación del producto y ventas
  const [currentTab, setCurrentTab] = useState<NavTabId>(() => (
    window.location.pathname.startsWith('/crm') ? 'dashboard' : 'landing'
  ));
  const [isPublicFullScreen, setIsPublicFullScreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [crmToken, setCrmToken] = useState(() => localStorage.getItem('bit_crm_token'));
  const [isCrmAuthOpen, setIsCrmAuthOpen] = useState(false);

  // Modales
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isNfcSimulatorOpen, setIsNfcSimulatorOpen] = useState(false);

  // Búsqueda y Notificaciones
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (currentTab !== 'dashboard' || !crmToken) {
      return;
    }

    listContacts(crmToken)
      .then(setLeads)
      .catch(() => showToast('No se pudieron cargar los contactos del CRM'));
  }, [currentTab, crmToken]);

  useEffect(() => {
    if (window.location.pathname.startsWith('/crm') && !crmToken) {
      setIsCrmAuthOpen(true);
    }
  }, [crmToken]);

  // Acción: Intercambio de Contacto desde el perfil público del cliente
  const handleContactExchange = (data: VisitorExchangeData) => {
    const newLead: CrmLead = {
      id: `lead-${Date.now()}`,
      fecha: 'Hoy',
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono || '+502 5000-0000',
      empresa: data.empresa || 'Empresa Independiente',
      cargo: data.cargo || 'Contacto Web',
      canal: 'Perfil',
      estatus: 'Nuevo',
      origen: 'Perfil Público bit.me',
      ubicacion: 'Guatemala',
      avatarInitial: data.nombre.charAt(0).toUpperCase(),
      avatarColor: 'bg-cyan-100 text-cyan-700',
      notasHistorial: data.notas ? [
        {
          id: `n-${Date.now()}`,
          autor: 'Alessandra Balconi',
          fecha: 'Hoy',
          texto: `Mensaje recibido del cliente: "${data.notas}"`,
        }
      ] : [],
    };

    setLeads(prev => [newLead, ...prev]);

    // Registrar actividad en tiempo real
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      tipo: 'contacto',
      titulo: `${data.nombre} envió sus datos`,
      detalle: `Nuevo contacto registrado desde el perfil web · hace un momento`,
      fecha: 'Hoy',
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast(`¡Nuevo lead capturado! ${data.nombre} guardado en el CRM`);
  };

  // Acción: Simular lectura física NFC
  const handleNfcTapSuccess = () => {
    // Actualizar métricas del dispositivo
    setDevice(prev => ({
      ...prev,
      tapsTotales: prev.tapsTotales + 1,
      ultimoTap: 'Hace unos segundos',
    }));

    // Registrar nueva actividad
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      tipo: 'tap',
      titulo: 'Tap en tu Bit detectado',
      detalle: 'Lectura NFC realizada desde un iPhone · hace unos segundos',
      fecha: 'Hoy',
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast('¡Tap NFC detectado! +1 lectura registrada en tus métricas');
  };

  // Acción: Cambiar fase del Lead en Pipeline o Modal
  const handleUpdateLeadStage = (leadId: string, newStage: ContactStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, estatus: newStage };
      }
      return lead;
    }));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, estatus: newStage } : null);
    }

    if (crmToken) {
      updateContactStage(crmToken, leadId, newStage).catch(() => {
        showToast('No se pudo sincronizar la etapa con Django');
      });
    }

    showToast(`Estatus actualizado a: ${newStage}`);
  };

  // Acción: Agregar nota a un Lead
  const handleAddLeadNote = (leadId: string, noteText: string) => {
    const newNoteItem = {
      id: `n-${Date.now()}`,
      autor: user.nombre,
      fecha: 'Hoy',
      texto: noteText,
    };

    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const existingNotes = lead.notasHistorial || [];
        return { ...lead, notasHistorial: [newNoteItem, ...existingNotes] };
      }
      return lead;
    }));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? {
        ...prev,
        notasHistorial: [newNoteItem, ...(prev.notasHistorial || [])],
      } : null);
    }

    showToast('Nota de seguimiento guardada');
  };

  // Acción: Añadir nuevo contacto manualmente desde el botón "+ Nuevo contacto"
  const handleAddNewContact = (formData: Partial<CrmLead>) => {
    const newLead: CrmLead = {
      id: `lead-${Date.now()}`,
      fecha: 'Hoy',
      nombre: formData.nombre || 'Nuevo Contacto',
      email: formData.email || '',
      telefono: formData.telefono || '',
      empresa: formData.empresa || 'General',
      cargo: formData.cargo || 'Profesional',
      canal: formData.canal || 'NFC',
      estatus: formData.estatus || 'Nuevo',
      origen: formData.origen || 'Registro Manual',
      ubicacion: formData.ubicacion || 'Guatemala',
      avatarInitial: (formData.nombre || 'N').charAt(0).toUpperCase(),
      avatarColor: 'bg-purple-100 text-purple-700',
      notasHistorial: formData.notasHistorial || [],
    };

    setLeads(prev => [newLead, ...prev]);
    showToast(`Contacto "${newLead.nombre}" creado exitosamente`);
  };

  // Acción: Eliminar lead
  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    showToast('Lead eliminado del sistema');
  };

  // 1. VISTA DE CLIENTE FINAL COMPLETA (bit.me/alessandra)
  if (isPublicFullScreen) {
    return (
      <PublicFullScreenProfile
        user={user}
        onBackToDashboard={() => setIsPublicFullScreen(false)}
        onSubmitContactExchange={handleContactExchange}
      />
    );
  }

  // 2. VISTA DE LANDING PAGE PÚBLICA CON SIMULADOR NFC INTEGRADO (TOTALMENTE INDEPENDIENTE DEL CRM)
  if (currentTab === 'landing') {
    return (
      <LandingPageView
        user={user}
        onOpenCrmLogin={() => window.location.assign('/crm/')}
      />
    );
  }

  // 3. PANEL PRINCIPAL BIT (DASHBOARD, LEADS, CRM, HARDWARE, PERFIL)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Barra Lateral Navegación (Sidebar) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        leadsCount={leads.length}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenPublicProfile={() => setIsPublicFullScreen(true)}
      />

      {/* Contenido Principal con Offset del Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Cabecera Superior */}
        <Header
          user={user}
          currentTab={currentTab}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenPublicProfile={() => setIsPublicFullScreen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Notificación Toast flotante */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Vista Renderizada según Navegación */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: DASHBOARD (Fiel a la Imagen 1 arriba) */}
          {currentTab === 'dashboard' && (
            <DashboardView
              user={user}
              device={device}
              activities={activities}
              onNavigateToProfile={() => setCurrentTab('profile')}
              onNavigateToLeads={() => setCurrentTab('leads')}
              onNavigateToNfc={() => setCurrentTab('nfc')}
              onNavigateToLanding={() => setCurrentTab('landing')}
            />
          )}

          {/* TAB 2: MI PERFIL / PERFIL DEL CLIENTE (Fiel a la Imagen 1 abajo) */}
          {currentTab === 'profile' && (
            <ClientProfileView
              user={user}
              onOpenFullScreen={() => setIsPublicFullScreen(true)}
              onSubmitContactExchange={handleContactExchange}
            />
          )}

          {/* TAB 3: LEADS (Fiel a la Imagen 3 arriba) */}
          {currentTab === 'leads' && (
            <LeadsView
              leads={leads}
              activities={activities}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelectLead={(lead) => setSelectedLead(lead)}
              onAddNewContact={() => setIsNewContactOpen(true)}
            />
          )}

          {/* TAB 4: CRM / PIPELINE DE VENTAS (Fiel a la Imagen 3 abajo) */}
          {currentTab === 'crm' && (
            <SalesPipelineView
              leads={leads}
              onSelectLead={(lead) => setSelectedLead(lead)}
              onUpdateLeadStage={handleUpdateLeadStage}
              onAddNewContact={() => setIsNewContactOpen(true)}
            />
          )}

          {/* TAB 5: NFC / HARDWARE BIT (Fiel a la Imagen 2) */}
          {currentTab === 'nfc' && (
            <NfcHardwareView
              user={user}
              device={device}
              onNavigateToLanding={() => setCurrentTab('landing')}
              onOpenPublicProfile={() => setIsPublicFullScreen(true)}
            />
          )}

          {/* TAB 6: ANALYTICS */}
          {currentTab === 'analytics' && (
            <AnalyticsView />
          )}

          {/* TAB 7: CONFIGURACIÓN */}
          {currentTab === 'settings' && (
            <BrandingView
              user={user}
              onUpdateUser={(updated) => setUser(prev => ({ ...prev, ...updated }))}
            />
          )}

        </main>
      </div>

      {/* MODAL: DETALLE DE LEAD (Fiel a la Imagen 3 abajo centro) */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateStage={handleUpdateLeadStage}
        onAddNote={handleAddLeadNote}
        onDeleteLead={handleDeleteLead}
      />

      {/* MODAL: NUEVO CONTACTO MANUAL */}
      <NewContactModal
        isOpen={isNewContactOpen}
        onClose={() => setIsNewContactOpen(false)}
        onAddContact={handleAddNewContact}
      />

      <CrmAuthModal
        isOpen={isCrmAuthOpen}
        onClose={() => setIsCrmAuthOpen(false)}
        onLoginSuccess={async ({ email, nombre, password }) => {
          if (!password) {
            showToast('Introduce tu contraseña para conectar con Django');
            return;
          }

          try {
            const session = await login(email, password);
            localStorage.setItem('bit_crm_token', session.token);
            setCrmToken(session.token);
            setUser(prev => ({ ...prev, email: session.user.email, nombre }));
            setIsCrmAuthOpen(false);
            showToast('Sesión iniciada correctamente');
          } catch (error) {
            showToast(error instanceof Error ? error.message : 'No se pudo iniciar sesión');
          }
        }}
      />

    </div>
  );
}
