import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Lock, 
  ArrowRight,
  Building,
  Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (details: OrderDetails) => void;
}

export interface OrderDetails {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  municipio: string;
  departamento: string;
  metodoPago: 'tarjeta' | 'transferencia';
  total: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'formulario' | 'procesando' | 'exito'>('formulario');
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'transferencia'>('tarjeta');
  
  // Form fields
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [departamento, setDepartamento] = useState('Guatemala');
  const [municipio, setMunicipio] = useState('Ciudad de Guatemala');
  const [customHandle, setCustomHandle] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('procesando');
    
    // Simular procesamiento bancario seguro
    setTimeout(() => {
      setStep('exito');
      setTimeout(() => {
        onSuccess({
          nombre: nombre || 'Cliente Bit',
          email: email || 'cliente@ejemplo.com',
          telefono: telefono || '+502 5555-0000',
          direccion: direccion || 'Dirección de Entrega',
          municipio,
          departamento,
          metodoPago,
          total: 99,
        });
      }, 1600);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="bg-[#0B101D] text-white rounded-3xl border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.35)] w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header de la Pasarela */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1424]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-pink-400 via-cyan-300 to-purple-500 shadow-md">
              <div className="w-full h-full rounded-full bg-[#07090F] flex items-center justify-center">
                <span className="text-white font-black text-xs italic">Bit</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>Pasarela de Pago Segura</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-[9px] font-bold">
                  256-bit SSL
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Pago único de Q. 99 con envío gratis incluido a todo el país</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido según el estado */}
        <div className="p-6 overflow-y-auto space-y-6">

          {step === 'procesando' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
              <h4 className="text-lg font-black text-white">Procesando tu pedido de BIT...</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Conectando de forma cifrada. Por favor no cierres esta ventana.
              </p>
            </div>
          )}

          {step === 'exito' && (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-white">¡Pago Confirmado con Éxito!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Hemos recibido tu pago de <strong className="text-emerald-400">Q. 99</strong>. Tu sticker físico inteligente BIT está en camino con <strong>envío gratis</strong> a tu dirección.
              </p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <p className="text-slate-400">Guía de rastreo: <strong className="text-cyan-400 font-mono">GT-BIT-{Math.floor(100000 + Math.random() * 900000)}</strong></p>
                <p className="text-slate-400">Entrega estimada: <strong className="text-white">24 a 48 horas hábiles</strong></p>
              </div>
            </div>
          )}

          {step === 'formulario' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Resumen del Pedido */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl p-[2px] bg-gradient-to-tr from-pink-400 via-cyan-300 to-purple-500 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-[#090e1a] flex items-center justify-center">
                      <span className="text-white font-black text-xs italic">Bit</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">1x BIT Holográfico NTAG213</p>
                    <p className="text-[11px] text-cyan-400 flex items-center gap-1 font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Envío Gratis Incluido a Todo el País</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through block">Q. 180</span>
                  <span className="text-2xl font-black text-white tracking-tight">Q. 99</span>
                </div>
              </div>

              {/* Selector de Método de Pago */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setMetodoPago('tarjeta')}
                    className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                      metodoPago === 'tarjeta'
                        ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-xs">Tarjeta de Crédito / Débito</span>
                    <span className="text-[10px] text-slate-400">Pago en línea seguro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('transferencia')}
                    className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                      metodoPago === 'transferencia'
                        ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <Building className="w-5 h-5 text-pink-400" />
                    <span className="font-bold text-xs">Transferencia Bancaria</span>
                    <span className="text-[10px] text-slate-400">Depósito / Transferencia</span>
                  </button>
                </div>
              </div>

              {/* Datos de Entrega */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dirección de Envío</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Teléfono WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+502 5555-1234"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Correo Electrónico (para activar tu perfil) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tuemail@ejemplo.com"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Departamento</label>
                    <select
                      value={departamento}
                      onChange={(e) => setDepartamento(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                    >
                      <option value="Guatemala">Guatemala</option>
                      <option value="Sacatepéquez">Sacatepéquez</option>
                      <option value="Quetzaltenango">Quetzaltenango</option>
                      <option value="Escuintla">Escuintla</option>
                      <option value="Chimaltenango">Chimaltenango</option>
                      <option value="Alta Verapaz">Alta Verapaz</option>
                      <option value="Petén">Petén</option>
                      <option value="Otro">Otro Departamento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Municipio / Zona</label>
                    <input
                      type="text"
                      required
                      value={municipio}
                      onChange={(e) => setMunicipio(e.target.value)}
                      placeholder="Zona 10, Mixco..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Dirección Exacta de Entrega *</label>
                  <input
                    type="text"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Calle, avenida, número de casa, colonia, edificio u oficina"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Nombre de usuario deseado (bit.me/<span className="text-cyan-400">{customHandle || 'tu-nombre'}</span>)
                  </label>
                  <input
                    type="text"
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="Ej. alessandra, carlos"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

              </div>

              {/* Si eligió Tarjeta, mostrar campos de tarjeta */}
              {metodoPago === 'tarjeta' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Datos de la Tarjeta</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Cifrado de extremo a extremo</span>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Número de tarjeta (16 dígitos)"
                      maxLength={19}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition text-center"
                    />
                    <input
                      type="password"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC / CVV"
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition text-center"
                    />
                  </div>
                </div>
              )}

              {metodoPago === 'transferencia' && (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs space-y-2">
                  <p className="font-bold text-white">Instrucciones de Transferencia:</p>
                  <p className="text-[11px] text-slate-300">
                    Al presionar confirmar, registraremos tu orden y te proporcionaremos los datos bancarios exactos y el enlace directo para confirmar tu comprobante de manera inmediata.
                  </p>
                </div>
              )}

              {/* Botón de Enviar Pedido */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-black text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.01] active:scale-98 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirmar Pedido — Q. 99 (Envío Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garantía oficial de 30 días y atención personalizada.</span>
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
