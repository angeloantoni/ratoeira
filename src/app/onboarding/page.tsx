'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  AtSign, 
  Shield, 
  Skull, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { RAT_AVATARS } from '@/lib/constants';
import { UserClass } from '@/types';
import { sound } from '@/lib/soundfx';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, addXP } = useRatoeira();

  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(() => {
    const idx = RAT_AVATARS.indexOf(profile.avatar_url);
    return idx >= 0 ? idx : 0;
  });

  const [username, setUsername] = useState(profile.username || '');
  const [city, setCity] = useState(profile.city || 'São Paulo - SP');
  const [selectedClass, setSelectedClass] = useState<UserClass>(profile.user_class || 'guardiao');

  const handlePrevAvatar = () => {
    sound.click();
    setCurrentAvatarIndex((prev) => (prev === 0 ? RAT_AVATARS.length - 1 : prev - 1));
  };

  const handleNextAvatar = () => {
    sound.click();
    setCurrentAvatarIndex((prev) => (prev === RAT_AVATARS.length - 1 ? 0 : prev + 1));
  };

  const handleSelectClass = (cls: UserClass) => {
    sound.click();
    setSelectedClass(cls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.replace('@', '').trim() || 'RatoEsperto';

    updateProfile({
      username: cleanUsername,
      city: city.trim() || 'Brasil',
      user_class: selectedClass,
      avatar_url: RAT_AVATARS[currentAvatarIndex],
    });

    addXP(50, 'Ficha de Rato confirmada (+50 XP)');
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-8 space-y-5 max-w-md mx-auto">
      {/* Top Header Logo */}
      <div className="relative w-28 h-20 -my-2">
        <Image
          src="/brand/logo-transparent.webp"
          alt="Ratoeira"
          fill
          className="object-contain"
        />
      </div>

      {/* Title */}
      <div className="text-center space-y-0.5">
        <h1 className="text-2xl font-display font-black text-white uppercase tracking-wider">
          CRIE SUA FICHA DE RATO
        </h1>
        <p className="text-xs text-zinc-400">
          Personalize seu perfil urbano para o rolê
        </p>
      </div>

      {/* Avatar Selector Carousel */}
      <div className="w-full flex items-center justify-center gap-3 py-2">
        <button
          type="button"
          onClick={handlePrevAvatar}
          className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-neon-cyan transition-colors"
          aria-label="Avatar anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Current Active Avatar with Neon Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-neon-green via-neon-cyan to-neon-magenta shadow-glow-green">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-950">
              <Image
                src={RAT_AVATARS[currentAvatarIndex]}
                alt="Avatar Rato"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </div>
          <span className="mt-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-neon-green text-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Check className="w-3 h-3 stroke-[3]" />
            SELECIONADO
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextAvatar}
          className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-neon-cyan transition-colors"
          aria-label="Próximo avatar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Username */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neon-cyan uppercase tracking-wider block">
            Nome de Rato (Username)
          </label>
          <div className="relative flex items-center">
            <AtSign className="absolute left-3 w-4 h-4 text-neon-cyan" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu_username"
              required
              className="w-full pl-9 pr-4 py-3 rounded-2xl bg-zinc-900 border border-neon-cyan/60 text-white font-bold text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
            />
          </div>
        </div>

        {/* City / Location */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neon-cyan uppercase tracking-wider block">
            Sua Cidade / Região
          </label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-neon-cyan" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Natal - RN ou São Paulo - SP"
              required
              className="w-full pl-9 pr-4 py-3 rounded-2xl bg-zinc-900 border border-neon-cyan/60 text-white font-bold text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
            />
          </div>
        </div>

        {/* Class Selector */}
        <div className="space-y-2 pt-1">
          <div className="text-center">
            <span className="text-xs font-black text-neon-green uppercase tracking-wider block">
              ESCOLHA SUA CLASSE NO ROLÊ
            </span>
            <span className="text-[10px] text-zinc-400">
              Diferentes bônus, medalhas e missões
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Guardião Card */}
            <button
              type="button"
              onClick={() => handleSelectClass('guardiao')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                selectedClass === 'guardiao'
                  ? 'bg-zinc-900 border-2 border-neon-cyan shadow-glow-cyan'
                  : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-6 h-6 text-neon-cyan" />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedClass === 'guardiao' ? 'border-neon-cyan bg-neon-cyan' : 'border-zinc-600'
                }`}>
                  {selectedClass === 'guardiao' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                </div>
              </div>
              <div>
                <p className="font-display font-black text-sm text-neon-cyan uppercase">
                  GUARDIÃO
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-tight">
                  Protege seus isqueiros e ganha XP devolvendo
                </p>
              </div>
            </button>

            {/* Rato Ladrão Card */}
            <button
              type="button"
              onClick={() => handleSelectClass('rato_ladrao')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                selectedClass === 'rato_ladrao'
                  ? 'bg-zinc-900 border-2 border-neon-magenta shadow-glow-magenta'
                  : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Skull className="w-6 h-6 text-neon-magenta" />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedClass === 'rato_ladrao' ? 'border-neon-magenta bg-neon-magenta' : 'border-zinc-600'
                }`}>
                  {selectedClass === 'rato_ladrao' && <Check className="w-3 h-3 text-black stroke-[3]" />}
                </div>
              </div>
              <div>
                <p className="font-display font-black text-sm text-neon-magenta uppercase">
                  RATO LADRÃO
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-tight">
                  Compete na região e ganha XP mocando isqueiros
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-neon-green text-black font-display font-black text-base tracking-wider uppercase shadow-neo-magenta hover:bg-neon-green/90 active:scale-98 transition-all flex flex-col items-center justify-center"
          >
            <span>ENTRAR NA TOCA</span>
            <span className="text-[10px] font-sans font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              COMEÇAR COM +50 XP
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
