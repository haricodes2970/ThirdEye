import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div
      className={`
        bg-slate-950/60
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
        relative
        overflow-hidden
        transition-all duration-500
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10 p-6 h-full">
        {children}
      </div>
    </div>
  );
}
