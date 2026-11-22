'use client';

import React from 'react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { Zap } from 'lucide-react';

export const XpToast: React.FC = () => {
  const { xpToast } = useRatoeira();

  if (!xpToast) return null;

  const isPositive = xpToast.amount >= 0;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
      <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 shadow-2xl backdrop-blur-md ${
        isPositive 
          ? 'bg-zinc-950/95 border-neon-green shadow-glow-green text-neon-green' 
          : 'bg-zinc-950/95 border-neon-magenta shadow-glow-magenta text-neon-magenta'
      }`}>
        <Zap className="w-5 h-5 fill-current" />
        <span className="font-display font-extrabold text-lg tracking-wider">
          {isPositive ? `+${xpToast.amount} XP` : `${xpToast.amount} XP`}
        </span>
        <span className="text-xs text-white font-medium pl-1 border-l border-zinc-700">
          {xpToast.reason}
        </span>
      </div>
    </div>
  );
};
