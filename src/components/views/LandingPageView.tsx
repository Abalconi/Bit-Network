import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Zap, 
  Award,
  Smartphone,
  Users,
  Building,
  RotateCw,
  QrCode,
  Share2,
  Lock
} from 'lucide-react';
import { UserProfile } from '../../types';
import { NfcTapSimulator } from '../NfcTapSimulator';
import { CheckoutModal, OrderDetails } from '../CheckoutModal';

interface LandingPageViewProps {
  user: UserProfile;
  onOpenCrmLogin?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  user,
  onOpenCrmLogin,
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<OrderDetails | null>(null);

  const handleOrderSuccess = (details: OrderDetails) => {
    setOrderSuccess(details);
  };

  const realBitProductImg = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80";
  const realCrmDashboardImg = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Barra de Anuncio Superior con Oferta de Lanzamiento */}
      <div className="bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-cyan-900/90 border-b border-white/10 px-4 py-2 text-center text-xs text-white font-medium flex flex-wrap items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Edición Oficial Guatemala: <strong>Q. 99</strong> con <strong>Envío Gratis</strong> · Incluye <strong>1 Mes Gratis de CRM Web App</strong> con Capacitaciones en Vivo</span>
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="ml-2 underline font-bold hover:text-cyan-300 transition cursor-pointer"
        >
          Pedir Ahora →
        </button>
      </div>

      {/* 1. NAVEGACIÓN SUPERIOR DE LA LANDING */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#07090F]/90 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Logotipo BIT */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-pink-400 via-cyan-300 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-[#07090F] flex items-center justify-center">
              <span className="text-white font-black text-base tracking-tighter italic">Bit</span>
            </div>
          </div>
          <span className="text-white font-black text-lg tracking-tight">
            BIT<span className="text-cyan-400">.</span>
          </span>
        </div>

        {/* Enlaces de Sección */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
          <a href="#hero-tap" className="hover:text-cyan-400 transition-colors">¿Qué es BIT?</a>
          <a href="#simulador" className="hover:text-cyan-400 transition-colors">Simulador</a>
          <a href="#beneficios" className="hover:text-cyan-400 transition-colors">Beneficios</a>
          <a href="#galeria-real" className="hover:text-cyan-400 transition-colors">Fotos Reales</a>
          <a href="#precio" className="hover:text-cyan-400 transition-colors">Precio</a>
        </nav>

        {/* CTA Principal y Acceso Clientes CRM */}
        <div className="flex items-center gap-2.5">
          {onOpenCrmLogin && (
            <button
              id="btn-acceso-crm-header"
              onClick={onOpenCrmLogin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-400/40 transition cursor-pointer"
              title="Acceso Clientes a la Web App CRM"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Acceso CRM</span>
            </button>
          )}

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Comprar BIT — Q. 99</span>
          </button>
        </div>
      </header>

      {/* 2. HERO PRINCIPAL DE ALTO IMPACTO */}
      <section id="hero-tap" className="pt-12 sm:pt-16 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Columna Izquierda: Mensaje Comercial Contundente */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-bold text-cyan-200 tracking-wide">
                La Tarjeta de Presentación Inteligente que Multiplica tus Ventas
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
              Nunca Más Vuelvas a Perder <br />
              <span className="bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Un Cliente Potencial
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Pega tu sticker holográfico <strong>BIT</strong> en tu teléfono. Cuando conozcas a un cliente, simplemente acerca su celular y tu perfil comercial, catálogo, redes y contacto se guardarán al instante.
            </p>

            {/* Caja de Precio Destacada: Q. 99 con Envío Gratis */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0e1424] to-cyan-950/40 border border-purple-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Oferta Exclusiva Guatemala
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">Q. 99</span>
                  <span className="text-slate-400 text-xs font-semibold">pago único · sin mensualidades</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <Truck className="w-4 h-4" />
                <span>Envío Gratis a Domicilio</span>
              </div>
            </div>

            {/* Llamados a la Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-black text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Comprar BIT Ahora — Q. 99</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#simulador"
                className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Ver Simulador en Vivo</span>
              </a>
            </div>

            {/* Garantías y Seguridad de Pago */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pago Seguro (Tarjeta o Transferencia)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garantía de Reemplazo Oficial</span>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Holograma Visual 3D del BIT */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/35 via-cyan-500/25 to-pink-500/30 rounded-3xl blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center space-y-6">
              
              <div 
                onClick={() => setIsCheckoutOpen(true)}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-3 shadow-[0_0_70px_rgba(6,182,212,0.45),0_0_100px_rgba(168,85,247,0.35)] flex items-center justify-center transition-transform hover:scale-105 duration-500 cursor-pointer group"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 50%, #FF9A8B 0%, #FF6A88 20%, #FF99AC 40%, #00F2FE 60%, #4FACFE 80%, #A855F7 100%)'
                }}
              >
                <div className="w-full h-full rounded-full bg-[#070b16] border-2 border-white/60 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/15 via-transparent to-pink-400/15 pointer-events-none" />
                  
                  <span className="text-5xl sm:text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl group-hover:scale-110 transition-transform">
                    Bit
                  </span>
                  <span className="text-xs font-mono text-cyan-400 mt-2 font-bold uppercase tracking-widest">
                    Chip Inteligente NTAG213
                  </span>
                  <span className="text-[11px] text-pink-300 font-semibold mt-1">
                    Resistente al Agua · Uso Rudo
                  </span>
                  
                  <div className="mt-3 px-3.5 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white group-hover:bg-cyan-400 group-hover:text-slate-950 transition">
                    Q. 99 con Envío Gratis
                  </div>
                </div>
              </div>

              {/* Badges de Compatibilidad */}
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Compatible con iPhone y Android</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  Sin Baterías
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. SECCIÓN SIMULADOR NFC INTERACTIVO */}
      <section id="simulador" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <NfcTapSimulator
          user={user}
          onBuyBit={() => setIsCheckoutOpen(true)}
        />
      </section>

      {/* 4. BENEFICIOS CLAVE: ¿POR QUÉ BIT REEMPLAZA LAS TARJETAS DE PAPEL? */}
      <section id="beneficios" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            La Evolución del Networking
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            ¿Por Qué las Tarjetas de Papel Ya No Funcionan?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            El 88% de las tarjetas tradicionales terminan en la basura en menos de una semana. Con BIT, te guardan en el teléfono en 3 segundos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#0e1424] border border-white/10 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Transmisión Instantánea</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un solo toque abre tu perfil digital con un botón directo para guardar tu número, correo, WhatsApp y servicios en la agenda de tu cliente.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0e1424] border border-white/10 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <RotateCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Actualizable en Vivo</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Cambiaste de teléfono o cargo? Edita tu información en cualquier momento sin tener que mandar a imprimir nuevas tarjetas ni gastar de nuevo.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0e1424] border border-white/10 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-400/30 flex items-center justify-center text-pink-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Imagen 100% Profesional</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Causa un impacto memorable en reuniones, ferias comerciales y eventos. Muestra que tu negocio está a la vanguardia tecnológica.
            </p>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN DE FOTOS REALES */}
      <section id="galeria-real" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            Transparencia Total
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Fotos Reales de lo que Recibes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Mira exactamente la calidad de fabricación del sticker físico y el sistema de gestión incluido.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Foto Real 1: Sticker BIT */}
          <div className="bg-[#0e1424] rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white">Sticker Físico BIT</h3>
                  <p className="text-xs text-cyan-400 font-semibold mt-0.5">Foil holográfico reflectivo con adhesivo 3M</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                  Hardware Físico
                </span>
              </div>

              <div 
                className="rounded-2xl overflow-hidden border border-white/15 bg-black aspect-[4/3] relative group cursor-pointer"
                onClick={() => setIsCheckoutOpen(true)}
              >
                <img 
                  src={realBitProductImg} 
                  alt="Sticker físico real de BIT sobre smartphone" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white text-xs">
                  <p className="font-bold">Diámetro 30mm • Chip NTAG213</p>
                  <p className="text-[11px] text-slate-300">Resistente al agua, polvo y fricción diaria</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300">Compatible con iPhones y Androids</span>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Comprar Q. 99
              </button>
            </div>
          </div>

          {/* Foto Real 2: CRM Kanban */}
          <div className="bg-[#0e1424] rounded-3xl p-6 sm:p-7 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white">Tablero CRM de Contactos</h3>
                  <p className="text-xs text-purple-400 font-semibold mt-0.5">Tus prospectos organizados en un panel fácil de usar</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs">
                  Software Incluido
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/15 bg-black aspect-[4/3] relative group">
                <img 
                  src={realCrmDashboardImg} 
                  alt="Tablero de ventas y contactos del sistema BIT" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white text-xs">
                  <p className="font-bold">Nuevo • En Contacto • Negociación • Ganado</p>
                  <p className="text-[11px] text-slate-300">Registra automáticamente cada persona que conecta contigo</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300">Acceso de por vida sin suscripciones</span>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Pedir mi BIT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SECCIÓN DE PRECIO OFICIAL: Q. 99 CON ENVÍO GRATIS */}
      <section id="precio" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/10">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            Inversión Inteligente
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Obtén tu BIT Hoy Mismo
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Hardware físico oficial NTAG213 + Perfil Digital personal ilimitado + Sistema de contactos incluido.
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-b from-[#111728] to-[#0a0d18] border-2 border-cyan-400/40 p-8 sm:p-10 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center relative overflow-hidden">
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider mb-4">
            Precio Especial de Lanzamiento
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-slate-500 text-xl font-bold line-through">Q. 180</span>
            <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">Q. 99</span>
          </div>

          <p className="text-xs text-cyan-300 font-bold mt-2">
            Pago único · Sin contratos ni costos ocultos
          </p>

          <div className="max-w-md mx-auto my-8 space-y-3 text-left text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>1x Sticker Holográfico Oficial NXP NTAG213</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Perfil Web Digital personalizado (bit.me/tu-nombre)</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Botón inteligente para guardar en contactos (.vcf)</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-100 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">1 Mes Gratis de CRM Web App con Usuario y Clave</span>
                <span className="text-[11px] text-purple-200">Incluye Capacitaciones en vivo para ventas y prospección. ¡Se puede activar cuando quieras!</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Envío gratis asegurado a domicilio a todo el país</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Garantía de reemplazo oficial de 30 días</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full max-w-md py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-black text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Pedir mi BIT por Q. 99 con Envío Gratis
          </button>

          <p className="text-[11px] text-slate-400 mt-4">
            Entrega estimada en 24 a 48 horas hábiles en Ciudad de Guatemala y departamentos.
          </p>

        </div>

      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto border-t border-white/10 bg-[#07090F] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-xs text-slate-400 text-center">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#07090F] flex items-center justify-center">
                <span className="text-white font-black text-xs italic">B</span>
              </div>
            </div>
            <span className="text-lg font-black text-white tracking-tight">Bit</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-medium text-xs">
            <a href="#hero-tap" className="hover:text-white transition">¿Qué es BIT?</a>
            <a href="#simulador" className="hover:text-white transition">Simulador</a>
            <a href="#beneficios" className="hover:text-white transition">Beneficios</a>
            <a href="#galeria-real" className="hover:text-white transition">Fotos Reales</a>
            {onOpenCrmLogin && (
              <button 
                onClick={onOpenCrmLogin} 
                className="text-cyan-400 hover:text-cyan-300 transition font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Portal CRM Clientes (Iniciar Sesión)</span>
              </button>
            )}
            <button onClick={() => setIsCheckoutOpen(true)} className="text-pink-400 hover:text-pink-300 transition font-bold cursor-pointer">
              Comprar por Q. 99 →
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            BIT Guatemala © 2026 · Todos los derechos reservados.
          </p>

        </div>
      </footer>

      {/* MODAL DE PASARELA DE PAGO */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />

    </div>
  );
};
