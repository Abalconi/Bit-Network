import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Zap, 
  Lock, 
  ArrowRight, 
  CreditCard, 
  Layers, 
  Users, 
  Kanban, 
  BarChart3, 
  Download,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { SubscriptionInfo } from '../../services/crmApi';

interface SubscriptionPaywallProps {
  subscription: SubscriptionInfo | null;
  onActivateSubscription: (plan: 'monthly' | 'annual') => Promise<void>;
  onOpenPublicProfile: () => void;
  userEmail?: string;
}

export const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({
  subscription,
  onActivateSubscription,
  onOpenPublicProfile,
  userEmail,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedCheckoutOpen, setSimulatedCheckoutOpen] = useState(false);

  const handleStartCheckout = () => {
    // Abrir ventana de pago Recurrente / checkout
    setSimulatedCheckoutOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await onActivateSubscription(selectedPlan);
      setSimulatedCheckoutOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Banner Principal de Suscripción */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Acceso Exclusivo • BIT CRM Pro</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Lleva tu networking al siguiente nivel
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Tu tarjeta BIT física y tu perfil digital siempre están activos para tus clientes. Para capturar, gestionar prospectos, usar el pipeline y exportar contactos, activa tu suscripción mensual o anual.
        </p>
      </div>

      {/* Selector de Planes (Mensual vs Anual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-10">
        
        {/* Plan Mensual */}
        <div 
          onClick={() => setSelectedPlan('monthly')}
          className={`relative p-6 sm:p-8 rounded-3xl cursor-pointer transition-all border-2 flex flex-col justify-between ${
            selectedPlan === 'monthly'
              ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-600/20'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 opacity-90'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Mensual</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'monthly' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
              }`}>
                {selectedPlan === 'monthly' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">Q. 39.99</span>
              <span className="text-slate-500 font-medium text-sm">/ mes</span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Cobro recurrente mensual automático con Recurrente. Cancela cuando quieras sin contratos forzosos.
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              {[
                'Gestión ilimitada de prospectos y leads',
                'Pipeline visual de ventas estilo Kanban',
                'Exportación a Excel / CSV en 1 clic',
                'Sincronización en tiempo real con Supabase',
                'Atención directa por WhatsApp para leads',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedPlan('monthly'); handleStartCheckout(); }}
            className={`w-full mt-8 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              selectedPlan === 'monthly'
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Elegir Plan Mensual</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Plan Anual (Mejor valor / Ahorro) */}
        <div 
          onClick={() => setSelectedPlan('annual')}
          className={`relative p-6 sm:p-8 rounded-3xl cursor-pointer transition-all border-2 flex flex-col justify-between ${
            selectedPlan === 'annual'
              ? 'bg-gradient-to-b from-indigo-900 to-slate-900 text-white border-indigo-500 shadow-2xl shadow-indigo-900/30 ring-4 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Badge de Mejor Oferta */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Mejor Opción • Ahorras 2 meses</span>
          </div>

          <div>
            <div className="flex items-center justify-between mt-2 sm:mt-0">
              <span className={`text-xs font-bold uppercase tracking-wider ${selectedPlan === 'annual' ? 'text-indigo-200' : 'text-slate-500'}`}>
                Plan Anual Completo
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'annual' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-300'
              }`}>
                {selectedPlan === 'annual' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black">Q. 420.00</span>
              <span className={`font-medium text-sm ${selectedPlan === 'annual' ? 'text-indigo-200' : 'text-slate-500'}`}>/ año</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Q. 35/mes
              </span>
            </div>

            <p className={`text-xs mt-2 ${selectedPlan === 'annual' ? 'text-slate-300' : 'text-slate-500'}`}>
              Un solo pago anual recurrente por pasarela Recurrente. Máximo ahorro y tranquilidad por 12 meses.
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              {[
                'Todo lo del Plan Mensual incluido',
                'Acceso ininterrumpido durante 1 año completo',
                'Prioridad en exportación de reportes y leads',
                'Soporte técnico preferencial Bit Network',
                'Insignia de Profesional Verificado en tu perfil',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className={selectedPlan === 'annual' ? 'text-slate-200' : 'text-slate-700'}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedPlan('annual'); handleStartCheckout(); }}
            className="w-full mt-8 py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pagar Q. 420 con Recurrente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Garantía y Seguridad Recurrente */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Cobro Seguro en Quetzales (GTQ) por Recurrente</p>
            <p className="text-[11px] text-slate-500">Acepta todas las tarjetas Visa y Mastercard emitidas por bancos de Guatemala e internacionales.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPublicProfile}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition whitespace-nowrap"
        >
          Volver a mi tarjeta digital →
        </button>
      </div>

      {/* Modal / Diálogo de Checkout con Pasarela Recurrente */}
      {simulatedCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  R
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Recurrente Pagos GT</h3>
                  <p className="text-[10px] text-slate-500">Pasarela de pagos en línea cifrada</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                SSL 256-bit
              </span>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Concepto:</span>
                <span className="font-bold text-slate-900">
                  {selectedPlan === 'annual' ? 'Suscripción Anual BIT CRM Pro' : 'Suscripción Mensual BIT CRM Pro'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2">
                <span className="text-slate-600">Monto a cobrar:</span>
                <span className="font-black text-indigo-600 text-base">
                  {selectedPlan === 'annual' ? 'Q. 420.00' : 'Q. 39.99'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                <span>Cuenta a activar:</span>
                <span className="font-mono font-medium text-slate-700">{userEmail || 'tu-correo@bit.me'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 text-center">
                Al confirmar, se procesará el débito en tu tarjeta a través del servicio seguro de Recurrente y tu panel CRM se desbloqueará de inmediato.
              </p>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Procesando pago con Recurrente...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Confirmar y Desbloquear CRM Pro</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setSimulatedCheckoutOpen(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
