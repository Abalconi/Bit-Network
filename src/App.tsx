import React, { useState, useEffect } from 'react';
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
  ContactStage 
} from './types';
import * as crmApi from './services/crmApi';
import { Sidebar, NavTabId } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { CustomizeProfileView } from './components/views/CustomizeProfileView';
import { LeadsView } from './components/views/LeadsView';
import { SalesPipelineView } from './components/views/SalesPipelineView';
import { NfcHardwareView } from './components/views/NfcHardwareView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { BrandingView } from './components/views/BrandingView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { NewContactModal } from './components/NewContactModal';
import { PublicFullScreenProfile } from './components/PublicFullScreenProfile';
import { NfcTapSimulatorModal } from './components/NfcTapSimulatorModal';
import { TrainingsModal } from './components/TrainingsModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Estado del perfil del usuario (persistido en localStorage para no perder cambios de fotos/links/textos)
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('bit_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [device, setDevice] = useState<BitDevice>(INITIAL_BIT_DEVICE);

  // Leads con persistencia offline-first en localStorage
  const [leads, setLeads] = useState<CrmLead[]>(() => {
    try {
      const saved = localStorage.getItem('bit_crm_leads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading leads from storage', e);
    }
    return INITIAL_LEADS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  // Sincronizar leads con el backend de Django en Railway y Supabase al cargar y periódicamente
  useEffect(() => {
    let isMounted = true;

    const fetchLatestLeads = () => {
      crmApi.listContacts()
        .then((serverLeads) => {
          if (isMounted && serverLeads && serverLeads.length > 0) {
            setLeads(prev => {
              const map = new Map<string, CrmLead>();
              // Primero cargamos los contactos de la base de datos Supabase
              serverLeads.forEach(l => map.set(l.id, l));
              // Agregamos los que ya teníamos para no perder nada
              prev.forEach(l => {
                if (!map.has(l.id)) map.set(l.id, l);
              });
              const merged = Array.from(map.values());
              try {
                localStorage.setItem('bit_crm_leads', JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        })
        .catch((err) => {
          console.warn('Conectando con base de datos local y remota:', err);
        });
    };

    fetchLatestLeads();

    // Sincronizar cada 10 segundos para ver cambios entre móvil y PC sin refrescar
    const interval = setInterval(fetchLatestLeads, 10000);

    // Sincronizar inmediatamente al volver a la pestaña
    const handleFocus = () => fetchLatestLeads();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 'public_profile' = vista completa web real lista para el dominio sin marcos
  // 'crm' = panel administrativo donde se cambian fotos, links, títulos y textos
  const [appMode, setAppMode] = useState<'public_profile' | 'crm'>('public_profile');
  const [currentTab, setCurrentTab] = useState<NavTabId>('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isNfcSimulatorOpen, setIsNfcSimulatorOpen] = useState(false);
  const [isTrainingsOpen, setIsTrainingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actualizar datos del usuario desde el CRM (fotos, links, títulos, descripciones)
  const handleUpdateUser = (updatedFields: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('bit_user_profile', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving profile', err);
      }
      return updated;
    });
    showToast('Cambios guardados con éxito');
  };

  // Agregar nuevo lead (vía formulario de compartir contacto, WhatsApp o manual)
  const handleAddNewLead = async (newLeadData: Partial<CrmLead> & { notas?: string; canal?: string; origen?: string }) => {
    const tempId = `lead-${Date.now()}`;
    const newLead: CrmLead = {
      id: tempId,
      nombre: newLeadData.nombre || 'Nuevo Contacto',
      email: newLeadData.email || '',
      telefono: newLeadData.telefono || '',
      empresa: newLeadData.empresa || '',
      cargo: newLeadData.cargo || '',
      canal: (newLeadData.canal || (newLeadData.origen?.includes('WhatsApp') ? 'WhatsApp' : 'NFC')) as CrmLead['canal'],
      estatus: newLeadData.estatus || 'Nuevo',
      origen: newLeadData.origen || 'Perfil público Bit',
      fecha: 'Hoy',
      ubicacion: newLeadData.ubicacion || 'Guatemala',
      avatarInitial: (newLeadData.nombre || 'N').charAt(0).toUpperCase(),
      avatarColor: 'bg-cyan-100 text-cyan-700',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      notasHistorial: newLeadData.notas ? [{
        id: `note-${Date.now()}`,
        texto: newLeadData.notas,
        fecha: 'Hoy',
        autor: user.nombre
      }] : []
    };

    // Actualizar estado y almacenamiento local de inmediato para que NUNCA se pierda al refrescar
    setLeads(prev => {
      const updated = [newLead, ...prev];
      try {
        localStorage.setItem('bit_crm_leads', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving to localStorage', e);
      }
      return updated;
    });

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      tipo: 'contacto',
      titulo: `${newLead.nombre} envió sus datos`,
      detalle: `${newLead.origen} · hace un momento`,
      fecha: 'Hoy',
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast(`¡Contacto recibido! ${newLead.nombre} guardado en el CRM`);

    // Sincronizar en segundo plano con el backend de Django en Railway y Supabase
    try {
      const savedLead = await crmApi.createContact({
        nombre: newLead.nombre,
        email: newLead.email,
        telefono: newLead.telefono,
        empresa: newLead.empresa,
        cargo: newLead.cargo,
        origen: newLead.origen,
        canal: newLead.canal,
        notas: newLeadData.notas || '',
      });

      if (savedLead && savedLead.id) {
        setLeads(prev => {
          const replaced = prev.map(l => l.id === tempId ? savedLead : l);
          try {
            localStorage.setItem('bit_crm_leads', JSON.stringify(replaced));
          } catch {}
          return replaced;
        });
      }
    } catch (err) {
      console.warn('Contacto preservado en almacenamiento local:', err);
    }
  };

  // Actualizar etapa de lead en CRM
  const handleUpdateLeadStage = (leadId: string, newStage: ContactStage) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, estatus: newStage } : l);
      try {
        localStorage.setItem('bit_crm_leads', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, estatus: newStage } : null);
    }
    showToast(`Etapa actualizada a: ${newStage}`);

    crmApi.updateContactStage(leadId, newStage).catch(err => {
      console.warn('Error sincronizando etapa en el backend:', err);
    });
  };

  // Agregar nota a un lead
  const handleAddNoteToLead = (leadId: string, noteText: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentNotes = l.notasHistorial || [];
        return {
          ...l,
          notasHistorial: [
            {
              id: `note-${Date.now()}`,
              texto: noteText,
              fecha: 'Hoy',
              autor: user.nombre
            },
            ...currentNotes
          ]
        };
      }
      return l;
    }));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? {
        ...prev,
        notasHistorial: [
          {
            id: `note-${Date.now()}`,
            texto: noteText,
            fecha: 'Hoy',
            autor: user.nombre
          },
          ...(prev.notasHistorial || [])
        ]
      } : null);
    }

    showToast('Nota registrada con éxito');
  };

  // Eliminar lead
  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => {
      const updated = prev.filter(l => l.id !== leadId);
      try {
        localStorage.setItem('bit_crm_leads', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(null);
    }
    showToast('Lead eliminado');
  };

  // Simulación de lectura física NFC
  const handleNfcTapSuccess = () => {
    setDevice(prev => ({
      ...prev,
      tapsTotales: prev.tapsTotales + 1,
      ultimoTap: 'Hace unos segundos',
    }));

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      tipo: 'tap',
      titulo: 'Tap en tu Bit detectado',
      detalle: 'Lectura NFC realizada desde un smartphone · hace unos segundos',
      fecha: 'Hoy',
    };
    setActivities(prev => [newActivity, ...prev]);
    showToast('¡Tap NFC detectado! +1 lectura en tus analíticas');
  };

  // ==============================================================
  // 1. PERFIL PÚBLICO FINAL FULL WEB (LISTO PARA SUBIR AL DOMINIO)
  // Pantalla completa, sin marcos falsos, con formulario completo
  // ==============================================================
  if (appMode === 'public_profile') {
    return (
      <PublicFullScreenProfile 
        user={user}
        onOpenCrm={() => setAppMode('crm')}
        onUpdateUser={handleUpdateUser}
        onLeadCapture={(leadData: any) => {
          handleAddNewLead({
            nombre: leadData.nombre,
            telefono: leadData.telefono,
            email: leadData.email,
            empresa: leadData.empresa,
            origen: leadData.origen || (leadData.canal === 'WhatsApp' ? 'Compartido por WhatsApp' : 'Perfil público Bit'),
            canal: leadData.canal || (leadData.origen?.includes('WhatsApp') ? 'WhatsApp' : 'NFC'),
            notas: leadData.mensaje
          });
        }}
      />
    );
  }

  // ==============================================================
  // 2. PANEL CRM: PARA CAMBIAR FOTOS, ENLACES, TÍTULOS Y TEXTOS
  // ==============================================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      
      {/* Barra superior de control del CRM */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-slate-800 z-30">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">Panel CRM de Bit</span>
          <span className="text-slate-400 hidden sm:inline">| Edita aquí tu foto, enlaces, títulos y textos</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAppMode('public_profile')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <span>Ver Perfil Web en Vivo</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Barra Lateral / Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          leadsCount={leads.length}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenPublicProfile={() => setAppMode('public_profile')}
          onOpenTrainings={() => setIsTrainingsOpen(true)}
        />

        {/* Contenedor Principal con Header y Vistas */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <Header
            user={user}
            currentTab={currentTab}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onOpenPublicProfile={() => setAppMode('public_profile')}
            onOpenTrainings={() => setIsTrainingsOpen(true)}
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

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* 1. Mi Perfil (Editor completo de fotos, links, títulos y textos) */}
            {currentTab === 'profile' && (
              <CustomizeProfileView
                user={user}
                onUpdateUser={handleUpdateUser}
                onOpenPublicProfile={() => setAppMode('public_profile')}
              />
            )}

            {/* 2. Dashboard */}
            {currentTab === 'dashboard' && (
              <DashboardView
                user={user}
                device={device}
                activities={activities}
                onNavigateToProfile={() => setCurrentTab('profile')}
                onNavigateToLeads={() => setCurrentTab('leads')}
                onNavigateToNfc={() => setCurrentTab('nfc')}
                onSimulateTap={() => setIsNfcSimulatorOpen(true)}
              />
            )}

            {/* 3. NFC / Bit Hardware */}
            {currentTab === 'nfc' && (
              <NfcHardwareView
                user={user}
                device={device}
                onSimulateTap={() => setIsNfcSimulatorOpen(true)}
                onOpenPublicProfile={() => setAppMode('public_profile')}
              />
            )}

            {/* 4. Leads */}
            {currentTab === 'leads' && (
              <LeadsView
                leads={leads}
                activities={activities}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSelectLead={setSelectedLead}
                onAddNewContact={() => setIsNewContactOpen(true)}
              />
            )}

            {/* 5. CRM Pipeline */}
            {currentTab === 'crm' && (
              <SalesPipelineView
                leads={leads}
                onSelectLead={setSelectedLead}
                onUpdateLeadStage={handleUpdateLeadStage}
                onAddNewContact={() => setIsNewContactOpen(true)}
              />
            )}

            {/* 6. Analytics */}
            {currentTab === 'analytics' && (
              <AnalyticsView />
            )}

            {/* 7. Configuración / Branding */}
            {currentTab === 'settings' && (
              <BrandingView
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </main>
        </div>
      </div>

      {/* MODALES DEL CRM */}
      {selectedLead && (
        <LeadDetailModal
          isOpen={Boolean(selectedLead)}
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateStage={(leadId, stage) => handleUpdateLeadStage(leadId, stage)}
          onAddNote={handleAddNoteToLead}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {isNewContactOpen && (
        <NewContactModal
          isOpen={isNewContactOpen}
          onClose={() => setIsNewContactOpen(false)}
          onAddContact={handleAddNewLead}
        />
      )}

      {isNfcSimulatorOpen && (
        <NfcTapSimulatorModal
          isOpen={isNfcSimulatorOpen}
          onClose={() => setIsNfcSimulatorOpen(false)}
          user={user}
          onTapSuccess={handleNfcTapSuccess}
          onOpenProfile={() => {
            setIsNfcSimulatorOpen(false);
            setAppMode('public_profile');
          }}
        />
      )}

      {isTrainingsOpen && (
        <TrainingsModal
          isOpen={isTrainingsOpen}
          onClose={() => setIsTrainingsOpen(false)}
        />
      )}

    </div>
  );
}
