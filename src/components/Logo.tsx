import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-16 h-16", showText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
        <img 
          src="/logo.png" 
          alt="KisaanAI Logo" 
          className="w-full h-full object-contain scale-150"
        />
      </div>
      {showText && (
        <span className="text-2xl font-black tracking-tight text-white">KisaanAI</span>
      )}
    </div>
  );
};
