'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  Home, 
  Flame, 
  ScanLine, 
  QrCode, 
  Trophy, 
  Compass, 
  User, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Shield,
  Skull
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { sound } from '@/lib/soundfx';

export const SideDrawer: React.FC = () => {
  const { 
    isDrawerOpen, 
    toggleDrawer, 
    profile, 
    isAudioEnabled, 
    toggleAudio, 
    resetToDefaults 
  } = useRatoeira();

  if (!isDrawerOpen) return null;

  const navLinks = [
    { label: 'Início / Dashboard', href: '/', icon: Home },
    { label: 'Meus Isqueiros', href: '/inventario', icon: Flame },
    { label: 'Cadastrar Isqueiro', href: '/cadastrar', icon: ScanLine },
    { label: 'Emitir Tags & PDF', href: '/emitir-tag', icon: QrCode },
    { label: 'Missões & Conquistas', href: '/conquistas', icon: Trophy },
    { label: 'Explorar o Rolê', href: '/explorar', icon: Compass },
    { label: 'Editar Ficha de Rato', href: '/onboarding', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={toggleDrawer}
      />

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-xs h-full bg-[#121214] border-r border-zinc-800 p-5 flex flex-col justify-between z-10 shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xl font-display font-extrabold tracking-wider text-white">
                RATOEIRA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/30 font-bold">
                PWA
              </span>
            </div>
            <button
              onClick={toggleDrawer}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User mini profile card */}
          <div className="my-4 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-neon-cyan shrink-0">
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white truncate">
                  @{profile.username}
                </span>
                {profile.user_class === 'guardiao' ? (
                  <Shield className="w-3.5 h-3.5 text-neon-cyan" />
                ) : (
                  <Skull className="w-3.5 h-3.5 text-neon-magenta" />
                )}
              </div>
              <p className="text-xs text-neon-green font-semibold">
                Nível {profile.level} • {profile.title}
              </p>
              <p className="text-[10px] text-zinc-500">{profile.xp} XP acumulado</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    sound.click();
                    toggleDrawer();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors font-medium text-sm"
                >
                  <Icon className="w-4 h-4 text-neon-cyan" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Utilities */}
        <div className="space-y-2 pt-4 border-t border-zinc-800">
          {/* Audio toggle and Reset */}
          <div className="flex gap-2">
            <button
              onClick={toggleAudio}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-neon-green" />
                  <span>Som Ativo</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                  <span>Mudo</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (confirm('Deseja restaurar os dados iniciais de demonstração?')) {
                  resetToDefaults();
                  toggleDrawer();
                }
              }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400"
              title="Resetar Dados"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
