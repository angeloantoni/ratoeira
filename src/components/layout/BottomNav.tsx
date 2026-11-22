'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, ScanLine, Compass } from 'lucide-react';
import { sound } from '@/lib/soundfx';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide bottom nav on onboarding screen
  if (pathname === '/onboarding') {
    return null;
  }

  const isInventario = pathname === '/inventario';
  const isCadastrar = pathname === '/cadastrar';
  const isExplorar = pathname === '/explorar';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-lg border-t border-zinc-800/80 px-6 py-2 pb-5">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Tab 1: Meus Isqueiros */}
        <Link
          href="/inventario"
          onClick={() => sound.click()}
          className={`flex flex-col items-center gap-1 transition-colors ${
            isInventario ? 'text-neon-cyan' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Flame className={`w-6 h-6 ${isInventario ? 'fill-neon-cyan/20 stroke-neon-cyan' : ''}`} />
          <span className="text-[11px] font-bold tracking-wider font-display uppercase">
            Meus Isqueiros
          </span>
        </Link>

        {/* Tab 2: Floating Scan / Cadastrar Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <Link
            href="/cadastrar"
            onClick={() => sound.click()}
            className={`w-14 h-14 rounded-full bg-neon-green flex items-center justify-center text-black shadow-glow-green border-2 border-white/40 active:scale-95 transition-transform ${
              isCadastrar ? 'ring-4 ring-neon-green/40' : ''
            }`}
            aria-label="Cadastrar Isqueiro"
          >
            <ScanLine className="w-7 h-7 stroke-[2.5]" />
          </Link>
          <span className="text-[10px] font-extrabold text-neon-green tracking-wider mt-1 uppercase">
            + Cadastrar
          </span>
        </div>

        {/* Tab 3: Explorar */}
        <Link
          href="/explorar"
          onClick={() => sound.click()}
          className={`flex flex-col items-center gap-1 transition-colors ${
            isExplorar ? 'text-neon-cyan' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Compass className={`w-6 h-6 ${isExplorar ? 'stroke-neon-cyan stroke-[2.5]' : ''}`} />
          <span className="text-[11px] font-bold tracking-wider font-display uppercase">
            Explorar
          </span>
        </Link>
      </div>
    </nav>
  );
};
