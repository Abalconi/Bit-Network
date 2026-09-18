import React from 'react';

interface BitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
}

export const BitLogo: React.FC<BitLogoProps> = ({ size = 'md', light = false }) => {
  const sizeClasses = {
    sm: 'text-lg tracking-tight',
    md: 'text-2xl tracking-tighter',
    lg: 'text-3xl tracking-tighter',
    xl: 'text-5xl tracking-tighter',
  };

  return (
    <div className="flex items-center gap-1.5 select-none font-sans font-black">
      {/* Icono del logo con la 'B' moderna con corte biselado */}
      <div className="relative flex items-center">
        <span className={`font-black ${sizeClasses[size]} ${light ? 'text-white' : 'text-slate-900'} flex items-center`}>
          <span className="relative inline-block mr-0.5">
            {/* Letra B estilizada con corte */}
            <svg
              viewBox="0 0 40 40"
              className={`inline-block ${
                size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : size === 'lg' ? 'w-9 h-9' : 'w-14 h-14'
              } mr-1 fill-current`}
            >
              <path
                d="M 6 4 
                   L 26 4 
                   C 32 4, 35 7, 35 12 
                   C 35 15, 33 17, 30 18.5 
                   C 34 20, 36 23, 36 28 
                   C 36 33, 31 36, 25 36 
                   L 6 36 
                   Z 
                   M 14 11 
                   L 14 18 
                   L 23 18 
                   C 25.5 18, 27 16.5, 27 14.5 
                   C 27 12.5, 25.5 11, 23 11 
                   Z 
                   M 14 23 
                   L 14 30 
                   L 24 30 
                   C 26.5 30, 28 28.5, 28 26.5 
                   C 28 24.5, 26.5 23, 24 23 
                   Z"
              />
              {/* Corte diagonal característico en el diseño de Bit */}
              <polygon points="4,21 16,9 12,9 2,21" fill={light ? '#0a101f' : '#ffffff'} />
            </svg>
          </span>
          <span className="-ml-1">it</span>
        </span>
      </div>
    </div>
  );
};
