import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USER_PROFILE, 
  BLANK_USER_PROFILE,
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
import { LoginModal } from './components/LoginModal';
import { SubscriptionPaywall } from './components/views/SubscriptionPaywall';
import { CheckCircle2 } from 'lucide-react';
import { normalizeAssetUrl } from './utils/assetSync';

export default function App() {
  // Estado de autenticación del propietario
  const [authToken, setAuthToken] = useState<string | null>(() => crmApi.getStoredToken());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Estado del perfil del usuario (la única fuente de la verdad es la base de datos de Supabase)
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);

  const [device, setDevice] = useState<BitDevice>(INITIAL_BIT_DEVICE);

  // Leads obtenidos y sincronizados directamente desde Supabase
  const [leads, setLeads] = useState<CrmLead[]>(INITIAL_LEADS);

  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  // Estado de suscripción en Recurrente / Supabase
  // El superadmin siempre tiene acceso garantizado al CRM sin pagar
  const [subscription, setSubscription] = useState<crmApi.SubscriptionInfo | null>(() => {
    const stored = crmApi.getStoredUser();
    const isSuper = Boolean(stored?.is_superuser);
    return {
      status: isSuper ? 'active' : (stored?.subscription_status === 'active' ? 'active' : 'inactive'),
      plan: isSuper ? 'superadmin' : (stored?.subscription_plan as any || null),
      is_superuser: isSuper,
      can_access_crm: isSuper || stored?.subscription_status === 'active',
      pricing: {
        monthly: { price_gtq: 39.99, period: 'mensual' },
        annual: { price_gtq: 420.00, period: 'anual', savings_gtq: 59.88 }
      }
    };
  });

  // Consultar estado de suscripción en el backend al tener sesión iniciada
  useEffect(() => {
    if (!authToken) return;
    crmApi.getSubscription(authToken)
      .then((sub) => {
        if (sub) {
          setSubscription(sub);
        }
      })
      .catch((err) => console.warn('Error al verificar suscripción:', err));
  }, [authToken]);

  // 1. Sincronizar perfil público desde Supabase en tiempo real (tanto para visitantes como para el propietario)
  useEffect(() => {
    let isMounted = true;

    crmApi.getProfile(authToken)
      .then((serverProfile) => {
        if (!isMounted || !serverProfile) return;

        setUser(prev => {
          // Detectar si el servidor solo tiene el prefijo del correo (ej: 'dalebv87') porque aún no se ha guardado un nombre formal
          const isRawEmailUsername = serverProfile.nombre && serverProfile.email && 
            serverProfile.nombre.toLowerCase() === serverProfile.email.split('@')[0].toLowerCase() && 
            !serverProfile.telefono && !serverProfile.cargo;

          // Si el servidor solo tiene el prefijo de email pero localmente ya hay un nombre asignado, no sobreescribir con el prefijo
          const shouldKeepLocalName = isRawEmailUsername && prev.nombre && prev.nombre !== serverProfile.nombre;

          const cleaned: Partial<UserProfile> = {};
          if (serverProfile.nombre && serverProfile.nombre.trim() && !shouldKeepLocalName) cleaned.nombre = serverProfile.nombre;
          if (serverProfile.cargo && serverProfile.cargo.trim()) cleaned.cargo = serverProfile.cargo;
          if (serverProfile.tagline && serverProfile.tagline.trim()) cleaned.tagline = serverProfile.tagline;
          if (serverProfile.empresa && serverProfile.empresa.trim()) cleaned.empresa = serverProfile.empresa;
          if (serverProfile.ubicacion && serverProfile.ubicacion.trim()) cleaned.ubicacion = serverProfile.ubicacion;
          if (serverProfile.descripcion && serverProfile.descripcion.trim()) cleaned.descripcion = serverProfile.descripcion;
          if (serverProfile.telefono && serverProfile.telefono.trim()) cleaned.telefono = serverProfile.telefono;
          if (serverProfile.email && serverProfile.email.trim()) cleaned.email = serverProfile.email;
          if (serverProfile.whatsapp && serverProfile.whatsapp.trim()) cleaned.whatsapp = serverProfile.whatsapp;
          if (serverProfile.avatarUrl) cleaned.avatarUrl = normalizeAssetUrl(serverProfile.avatarUrl, 'avatar');
          if (serverProfile.coverUrl) cleaned.coverUrl = normalizeAssetUrl(serverProfile.coverUrl, 'cover');

          // Fusión segura de redes sociales: solo sobreescribir las que tengan valor
          if (serverProfile.redesSociales && typeof serverProfile.redesSociales === 'object') {
            const hasAnyLink = Object.values(serverProfile.redesSociales).some(
              v => typeof v === 'string' && v.trim().length > 0
            );
            if (hasAnyLink) {
              cleaned.redesSociales = {
                ...prev.redesSociales,
                ...serverProfile.redesSociales,
              };
            }
          }

          // Fusión segura de secciones
          if (serverProfile.sections && typeof serverProfile.sections === 'object') {
            cleaned.sections = {
              ...prev.sections,
              ...serverProfile.sections,
            };
          }

          return {
            ...prev,
            ...cleaned,
          };
        });
      })
      .catch((err) => {
        console.warn('Conectando con Supabase:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [authToken]);

  // 2. Sincronizar leads del CRM periódicamente desde Supabase (ESTRICTAMENTE SOLO si el dueño está autenticado)
  useEffect(() => {
    if (!authToken) return;

    let isMounted = true;

    const fetchLatestLeads = () => {
      crmApi.listContacts(authToken)
        .then((serverLeads) => {
          if (isMounted && serverLeads && serverLeads.length > 0) {
            setLeads(serverLeads);
          }
        })
        .catch((err) => {
          console.warn('Conectando con Supabase:', err);
        });
    };

    fetchLatestLeads();

    // Sincronizar leads cada 10 segundos
    const interval = setInterval(fetchLatestLeads, 10000);
    const handleFocus = () => fetchLatestLeads();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [authToken]);

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
  const handleUpdateUser = async (updatedFields: Partial<UserProfile>) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);

    // Guardar en backend (Supabase) si estamos autenticados
    if (authToken) {
      try {
        const responseData = await crmApi.saveProfile(updated, authToken);
        if (responseData && responseData.profile) {
          setUser(prev => ({ ...prev, ...responseData.profile }));
        }
        showToast('¡Perfil guardado y sincronizado con éxito en Supabase!');
      } catch (err: any) {
        const errorMsg = err?.message || 'Error al sincronizar con Supabase';
        if (errorMsg.includes('expirado') || errorMsg.includes('no es válida')) {
          setAuthToken(null);
          setIsLoginModalOpen(true);
        }
        showToast(errorMsg);
        throw err;
      }
    } else {
      showToast('Inicia sesión como propietario para sincronizar en Supabase.');
    }
  };

  // Resetear perfil a blanco para que un nuevo cliente empiece desde cero
  const handleResetToBlank = async () => {
    const blank = {
      ...BLANK_USER_PROFILE,
      email: user.email || '',
      nombre: user.nombre || '',
    };
    setUser(blank);
    if (authToken) {
      try {
        await crmApi.saveProfile(blank, authToken);
        showToast('¡Perfil vaciado! Listo para ingresar tus propios datos.');
      } catch (err) {
        console.warn('Error al vaciar perfil en Supabase:', err);
      }
    }
  };

  // Manejar activación de suscripción en Recurrente (o simulación exitosa)
  const handleActivateSubscription = async (plan: 'monthly' | 'annual') => {
    if (!authToken) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const res = await crmApi.updateSubscription(plan, 'activate', authToken);
      setSubscription({
        status: 'active',
        plan: plan === 'annual' ? 'anual' : 'mensual',
        is_superuser: Boolean(subscription?.is_superuser),
        can_access_crm: true,
        pricing: {
          monthly: { price_gtq: 39.99, period: 'mensual' },
          annual: { price_gtq: 420.00, period: 'anual', savings_gtq: 59.88 }
        }
      });
      showToast(`¡Suscripción ${plan === 'annual' ? 'Anual' : 'Mensual'} activada con Recurrente! Acceso concedido al CRM.`);
      setCurrentTab('crm');
    } catch (err: any) {
      showToast(err?.message || 'Error al procesar la suscripción.');
    }
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

    // Actualizar estado de React de inmediato
    setLeads(prev => [newLead, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      tipo: 'contacto',
      titulo: `${newLead.nombre} envió sus datos`,
      detalle: `${newLead.origen} · hace un momento`,
      fecha: 'Hoy',
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast(`¡Contacto recibido! ${newLead.nombre} guardado en el CRM`);

    // Sincronizar directamente con Supabase
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
        setLeads(prev => prev.map(l => l.id === tempId ? savedLead : l));
      }
    } catch (err) {
      console.warn('Error al guardar lead en Supabase:', err);
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

    // Sincronizar eliminación en el backend si estamos autenticados
    if (authToken && !leadId.startsWith('lead-')) {
      crmApi.deleteContact(leadId, authToken).catch(err => {
        console.warn('Error eliminando contacto en backend:', err);
      });
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

  // Cerrar sesión de manera segura
  const handleLogout = () => {
    localStorage.removeItem('bit_crm_token');
    localStorage.removeItem('bit_crm_user');
    setAuthToken(null);
    setAppMode('public_profile');
    showToast('Sesión cerrada con éxito');
  };

  // ==============================================================
  // 1. PERFIL PÚBLICO FINAL FULL WEB (LISTO PARA COMPARTIR CON CLIENTES)
  // Pantalla completa, sin marcos, protegido para visitantes
  // ==============================================================
  if (appMode === 'public_profile') {
    return (
      <>
        <PublicFullScreenProfile 
          user={user}
          isAuthenticated={Boolean(authToken)}
          onOpenCrm={() => {
            if (authToken) {
              setAppMode('crm');
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          onRequestLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
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

        {/* Modal de login / activación para el cliente */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={(token, loggedUser, newProfile) => {
            setAuthToken(token);
            const isSuper = Boolean(loggedUser?.is_superuser);
            setSubscription({
              status: isSuper ? 'active' : (loggedUser?.subscription_status === 'active' ? 'active' : 'inactive'),
              plan: isSuper ? 'superadmin' : (loggedUser?.subscription_plan as any || null),
              is_superuser: isSuper,
              can_access_crm: isSuper || loggedUser?.subscription_status === 'active',
              pricing: {
                monthly: { price_gtq: 39.99, period: 'mensual' },
                annual: { price_gtq: 420.00, period: 'anual', savings_gtq: 59.88 }
              }
            });

            if (newProfile) {
              // Cliente nuevo que acaba de auto-activar su BIT
              setUser({
                ...BLANK_USER_PROFILE,
                nombre: newProfile.nombre || '',
                email: loggedUser.email || '',
              });
              setAppMode('crm');
              setCurrentTab('profile');
              showToast('¡Felicidades! Tu BIT ha sido activado. Personaliza tu perfil.');
            } else {
              setAppMode('crm');
              showToast('¡Bienvenido! Sesión iniciada con éxito');
            }
          }}
        />
      </>
    );
  }

  // ==============================================================
  // 2. PANEL CRM: PROTEGIDO POR AUTENTICACIÓN
  // ==============================================================
  // Si no está autenticado, no permitir ver el panel CRM
  if (!authToken) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <CheckCircle2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Acceso restringido</h2>
          <p className="text-sm text-slate-400">
            Debes iniciar sesión con tus credenciales de propietario para acceder al CRM y editar tu perfil.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setAppMode('public_profile')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Volver al perfil
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-indigo-600/25"
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={(token, loggedUser, newProfile) => {
            setAuthToken(token);
            const isSuper = Boolean(loggedUser?.is_superuser);
            setSubscription({
              status: isSuper ? 'active' : (loggedUser?.subscription_status === 'active' ? 'active' : 'inactive'),
              plan: isSuper ? 'superadmin' : (loggedUser?.subscription_plan as any || null),
              is_superuser: isSuper,
              can_access_crm: isSuper || loggedUser?.subscription_status === 'active',
              pricing: {
                monthly: { price_gtq: 39.99, period: 'mensual' },
                annual: { price_gtq: 420.00, period: 'anual', savings_gtq: 59.88 }
              }
            });

            if (newProfile) {
              setUser({
                ...BLANK_USER_PROFILE,
                nombre: newProfile.nombre || '',
                email: loggedUser.email || '',
              });
              setCurrentTab('profile');
              showToast('¡Felicidades! Tu BIT ha sido activado. Personaliza tu perfil.');
            } else {
              showToast('¡Bienvenido! Sesión iniciada');
            }
          }}
        />
      </div>
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
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-medium text-xs transition cursor-pointer border border-slate-700/60"
            title="Cerrar sesión de propietario"
          >
            Cerrar Sesión
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
          onLogout={handleLogout}
          canAccessCrm={Boolean(subscription?.can_access_crm)}
          isSuperAdmin={Boolean(subscription?.is_superuser)}
        />

        {/* Contenedor Principal con Header y Vistas */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <Header
            user={user}
            currentTab={currentTab}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onOpenPublicProfile={() => setAppMode('public_profile')}
            onOpenTrainings={() => setIsTrainingsOpen(true)}
            onLogout={handleLogout}
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
                onResetToBlank={handleResetToBlank}
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

            {/* 4. Leads (Protegido por Suscripción - Superadmin siempre tiene acceso) */}
            {currentTab === 'leads' && (
              !subscription?.can_access_crm ? (
                <SubscriptionPaywall
                  subscription={subscription}
                  onActivateSubscription={handleActivateSubscription}
                  onOpenPublicProfile={() => setAppMode('public_profile')}
                  userEmail={user.email}
                />
              ) : (
                <LeadsView
                  leads={leads}
                  activities={activities}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onSelectLead={setSelectedLead}
                  onAddNewContact={() => setIsNewContactOpen(true)}
                />
              )
            )}

            {/* 5. CRM Pipeline (Protegido por Suscripción - Superadmin siempre tiene acceso) */}
            {currentTab === 'crm' && (
              !subscription?.can_access_crm ? (
                <SubscriptionPaywall
                  subscription={subscription}
                  onActivateSubscription={handleActivateSubscription}
                  onOpenPublicProfile={() => setAppMode('public_profile')}
                  userEmail={user.email}
                />
              ) : (
                <SalesPipelineView
                  leads={leads}
                  onSelectLead={setSelectedLead}
                  onUpdateLeadStage={handleUpdateLeadStage}
                  onAddNewContact={() => setIsNewContactOpen(true)}
                />
              )
            )}

            {/* 6. Analytics (Protegido por Suscripción - Superadmin siempre tiene acceso) */}
            {currentTab === 'analytics' && (
              !subscription?.can_access_crm ? (
                <SubscriptionPaywall
                  subscription={subscription}
                  onActivateSubscription={handleActivateSubscription}
                  onOpenPublicProfile={() => setAppMode('public_profile')}
                  userEmail={user.email}
                />
              ) : (
                <AnalyticsView
                  leads={leads}
                  activities={activities}
                  device={device}
                />
              )
            )}

            {/* 7. Suscripción CRM / Planes Recurrente */}
            {currentTab === 'subscription' && (
              <SubscriptionPaywall
                subscription={subscription}
                onActivateSubscription={handleActivateSubscription}
                onOpenPublicProfile={() => setAppMode('public_profile')}
                userEmail={user.email}
              />
            )}

            {/* 8. Configuración / Branding */}
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
