'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, ArrowLeft, Trophy } from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title, showBack = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, toggleDrawer } = useRatoeira();

  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0D0D]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-zinc-800/80">
      {/* Left Action: Hamburger or Back */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl border border-neon-green/80 bg-zinc-900 flex items-center justify-center text-neon-green hover:bg-neon-green/10 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={toggleDrawer}
            className="w-10 h-10 rounded-xl border border-neon-green/80 bg-zinc-900 flex items-center justify-center text-neon-green hover:bg-neon-green/10 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Title or Brand Text */}
        <div className="flex items-center">
          <span className="font-display tracking-wider text-white text-base uppercase font-bold">
            {title ? title : 'RATOEIRA • SQUAD'}
          </span>
        </div>
      </div>

      {/* Right Action: Trophy & Profile Pill */}
      <div className="flex items-center gap-2">
        {isHome && (
          <Link
            href="/conquistas"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-900/90 border border-yellow-400/40 text-yellow-400 hover:border-yellow-400 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight">RANK</span>
          </Link>
        )}

        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-neon-cyan/70 hover:border-neon-cyan transition-colors"
        >
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-neon-cyan bg-zinc-800">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                fill
                sizes="24px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-700" />
            )}
          </div>
          <span className="text-xs font-bold text-neon-cyan tracking-wider">
            @{profile.username}
          </span>
        </Link>
      </div>
    </header>
  );
};
