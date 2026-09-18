import React, { useState } from 'react';
import { Palette, Check, Sparkles, Image, RefreshCw } from 'lucide-react';
import { UserProfile } from '../../types';
import { HolographicSticker } from '../HolographicSticker';

interface BrandingViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const BrandingView: React.FC<BrandingViewProps> = ({ user, onUpdateUser }) => {
  const [tagline, setTagline] = useState(user.tagline);
  const [quote, setQuote] = useState(user.quote);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ tagline, quote });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600" />
          <span>Personalización de Identidad Visual</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Ajusta cómo ven tu tarjeta de presentación y tu perfil digital.
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Subtítulo / Especialidades en Perfil
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Frase Inspiracional / Lema al pie del perfil
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <span>Guardar Personalización</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Acabado del Sticker Físico</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Tu sticker utiliza nuestro Foil Holográfico Iridiscente reflectivo que proyecta reflejos de color según la incidencia de la luz ambiental.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Foil Arcoíris Premium Activo</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl">
          <HolographicSticker size="lg" interactive={true} />
        </div>
      </div>
    </div>
  );
};
