import React from 'react';
import { 
  TrendingUp, 
  Smartphone, 
  Globe, 
  Clock, 
  MapPin, 
  Users, 
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import { DASHBOARD_STATS, CHANNEL_DISTRIBUTION } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tasa de rebote</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">14.2%</span>
            <span className="text-xs font-bold text-emerald-600">↓ 3.1%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Excelente retención en página</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tiempo medio en perfil</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">1m 48s</span>
            <span className="text-xs font-bold text-emerald-600">↑ 12s</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Interacción con proyectos y redes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Guardado de vCard</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">38.4%</span>
            <span className="text-xs font-bold text-emerald-600">↑ 5.8%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">De cada 100 visitas, 38 guardan</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Clics a Redes</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">419</span>
            <span className="text-xs font-bold text-emerald-600">↑ 41%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Mayoría a LinkedIn e Instagram</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>Dispositivos del Cliente</span>
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Apple iOS (iPhone)</span>
                <span>72%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[72%] h-full bg-blue-600 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Google Android</span>
                <span>28%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[28%] h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Horarios Pico de Conexión</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">12:30 PM - 2:30 PM (Almuerzos & Networking)</span>
              <span className="text-blue-600 font-bold">44% de Taps</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">6:30 PM - 9:00 PM (After-work & Cenas)</span>
              <span className="text-purple-600 font-bold">36% de Taps</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">Resto del día</span>
              <span className="text-slate-500 font-bold">20% de Taps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
