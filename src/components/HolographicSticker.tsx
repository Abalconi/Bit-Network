import React, { useState } from 'react';

interface HolographicStickerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const HolographicSticker: React.FC<HolographicStickerProps> = ({
  size = 'md',
  interactive = true,
  className = '',
  onClick,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const dimensionClass = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  }[size];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -15;
    const rotY = ((x - centerX) / centerX) * 15;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '600px',
      }}
      className={`relative inline-block cursor-pointer select-none ${className}`}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered && interactive ? 1.05 : 1})`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        }}
        className={`${dimensionClass} rounded-full relative overflow-hidden shadow-xl border-2 border-slate-200/60 p-1 flex items-center justify-center`}
      >
        {/* Capa base metálica holográfica arcoíris */}
        <div
          className="absolute inset-0 rounded-full holographic-foil opacity-95"
          style={{
            backgroundPosition: `${glarePos.x}% ${glarePos.y}%`,
          }}
        />

        {/* Brillo iridiscente especular reactivo al ángulo de luz */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)`,
          }}
        />

        {/* Anillo concéntrico sutil */}
        <div className="absolute inset-1.5 rounded-full border border-slate-700/20 pointer-events-none" />

        {/* Contenido frontal del sticker BIT */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {size === 'sm' ? (
            <span className="font-black text-xs text-slate-900 tracking-tighter">Bit</span>
          ) : (
            <>
              {/* Logo Bit en negro puro con tipografía geométrica */}
              <div className="flex items-center justify-center">
                <span
                  className={`font-black text-slate-950 tracking-tighter leading-none ${
                    size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-4xl'
                  }`}
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Bit
                </span>
              </div>

              {/* Subtítulo — bit.me — */}
              <div
                className={`flex items-center gap-1 my-0.5 text-slate-900/80 font-bold tracking-widest ${
                  size === 'md' ? 'text-[6px]' : size === 'lg' ? 'text-[9px]' : 'text-xs'
                }`}
              >
                <span className="w-1.5 h-[0.5px] bg-slate-900 inline-block" />
                <span>bit.me</span>
                <span className="w-1.5 h-[0.5px] bg-slate-900 inline-block" />
              </div>

              {/* Iconos de redes sociales del sticker físico (Facebook, Instagram, TikTok) */}
              <div
                className={`flex items-center gap-1 mt-0.5 text-slate-950 ${
                  size === 'md' ? 'scale-75' : size === 'lg' ? 'scale-90' : 'scale-110'
                }`}
              >
                {/* Facebook */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[7px] font-bold">
                  f
                </div>
                {/* Instagram */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-950 text-white flex items-center justify-center">
                  <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                {/* TikTok */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-950 text-white flex items-center justify-center">
                  <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.88-4.5V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.85 4.85 0 0 1-1-.06z" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
