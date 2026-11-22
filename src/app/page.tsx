'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ScanLine, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Flame, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { sound } from '@/lib/soundfx';

export default function HomePage() {
  const router = useRouter();
  const { profile, lighters, addLighter } = useRatoeira();
  const [manualCodeOpen, setManualCodeOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualNickname, setManualNickname] = useState('');

  // Stats
  const totalCount = lighters.length;
  const noBolsoCount = lighters.filter((l) => l.status === 'NO_BOLSO').length;
  const ratoeadosCount = lighters.filter((l) => l.status === 'PERDIDO' || l.status === 'FURTADO').length;

  // Level calculations
  const nextLevelXp = profile.level * 500;
  const prevLevelXp = (profile.level - 1) * 350;
  const xpInCurrentLevel = Math.max(0, profile.xp - prevLevelXp);
  const xpNeeded = Math.max(100, nextLevelXp - prevLevelXp);
  const xpPercentage = Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    sound.scanSuccess();
    const formattedCode = manualCode.toUpperCase().startsWith('RT-') 
      ? manualCode.toUpperCase() 
      : 'RT-' + manualCode.toUpperCase();

    addLighter({
      code_identifier: formattedCode,
      nickname: manualNickname.trim() || `Isqueiro ${formattedCode}`,
      brand_model: 'BIC_GRANDE',
      color_style: '#0070BA',
      color_name: 'Azul',
      status: 'NO_BOLSO',
    });

    setManualCode('');
    setManualNickname('');
    setManualCodeOpen(false);
  };

  return (
    <div className="flex flex-col items-center px-4 pt-2 pb-6 space-y-4">
      {/* Official Centered Ratoeira Logo (Fundo Transparente) */}
      <div className="relative w-72 h-56 -my-2 flex items-center justify-center">
        <Image
          src="/brand/logo-transparent.webp"
          alt="Ratoeira Oficial"
          fill
          priority
          sizes="288px"
          className="object-contain drop-shadow-[0_0_25px_rgba(57,255,20,0.3)] animate-pulse-slow"
        />
      </div>

      {/* Card "SEU INVENTÁRIO" */}
      <div className="w-full rounded-3xl bg-card border border-zinc-800 p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black tracking-widest text-zinc-300 uppercase">
            Seu Inventário
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/40">
            {profile.user_class === 'guardiao' ? 'Classe: Guardião 🛡️' : 'Classe: Rato Ladrão 🥷'}
          </span>
        </div>

        {/* Status Counters Pills */}
        <div className="grid grid-cols-3 gap-2">
          {/* Fichados */}
          <Link
            href="/inventario"
            onClick={() => sound.click()}
            className="flex items-center justify-center py-2 px-1 rounded-xl bg-zinc-900 border border-neon-cyan/50 hover:border-neon-cyan text-center"
          >
            <span className="text-xs font-bold text-neon-cyan">
              {totalCount < 10 ? `0${totalCount}` : totalCount} • FICHADOS
            </span>
          </Link>

          {/* No Bolso */}
          <Link
            href="/inventario"
            onClick={() => sound.click()}
            className="flex items-center justify-center py-2 px-1 rounded-xl bg-zinc-900 border border-neon-green/50 hover:border-neon-green text-center"
          >
            <span className="text-xs font-bold text-neon-green">
              {noBolsoCount < 10 ? `0${noBolsoCount}` : noBolsoCount} • NO BOLSO
            </span>
          </Link>

          {/* Ratoeados */}
          <Link
            href="/inventario"
            onClick={() => sound.click()}
            className="flex items-center justify-center py-2 px-1 rounded-xl bg-zinc-900 border border-neon-magenta/50 hover:border-neon-magenta text-center"
          >
            <span className="text-xs font-bold text-neon-magenta">
              {ratoeadosCount < 10 ? `0${ratoeadosCount}` : ratoeadosCount} • RATOEADOS
            </span>
          </Link>
        </div>

        {/* Level and XP Bar */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-neon-green uppercase tracking-wide">
              NÍVEL {profile.level} • {profile.title}
            </span>
            <span className="font-mono text-zinc-400 font-bold">
              {profile.xp.toLocaleString()} XP
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden relative border border-zinc-700/50">
            <div
              className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-magenta rounded-full transition-all duration-500 shadow-glow-green"
              style={{ width: `${Math.max(10, Math.min(100, xpPercentage))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
            <span>Falta {Math.max(0, nextLevelXp - profile.xp)} XP para Nível {profile.level + 1}</span>
            <span className="flex items-center gap-1 text-neon-green font-bold">
              <Zap className="w-3 h-3 fill-neon-green" />
              +150 XP hoje
            </span>
          </div>
        </div>
      </div>

      {/* Main Scan Button CTA */}
      <div className="w-full relative group">
        <Link
          href="/cadastrar"
          onClick={() => sound.click()}
          className="w-full py-4 px-6 rounded-2xl bg-neon-green text-black font-display font-black text-lg tracking-wider flex items-center justify-center gap-3 shadow-neo-magenta hover:bg-neon-green/90 active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
        >
          <ScanLine className="w-7 h-7 stroke-[2.5]" />
          <div className="flex flex-col text-left">
            <span className="leading-tight text-base font-extrabold">ESCANEAR ISQUEIRO</span>
            <span className="text-[10px] font-sans font-bold tracking-normal opacity-90">
              CADASTRAR CÓDIGO DE BARRAS (+100 XP)
            </span>
          </div>
        </Link>
      </div>

      {/* Secondary Manual Entry Toggle */}
      <div className="w-full">
        <button
          onClick={() => {
            sound.click();
            setManualCodeOpen(!manualCodeOpen);
          }}
          className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-neon-cyan hover:underline tracking-wider uppercase transition-colors"
        >
          <span>DIGITAR CÓDIGO MANUALMENTE (+50 XP)</span>
          {manualCodeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {manualCodeOpen && (
          <form
            onSubmit={handleManualSubmit}
            className="mt-2 p-3.5 rounded-2xl bg-card border border-neon-cyan/40 space-y-3 animate-fade-in"
          >
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Código do Isqueiro (RT-XXX ou Código de Barras)
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ex: RT-042 ou 7891020304050"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan placeholder:text-zinc-600"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Apelido / Descrição Rápida
              </label>
              <input
                type="text"
                value={manualNickname}
                onChange={(e) => setManualNickname(e.target.value)}
                placeholder="Ex: Bic Azul sem tampa"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-neon-cyan placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-neon-cyan text-black font-extrabold text-xs tracking-wider uppercase hover:bg-neon-cyan/90 transition-colors shadow-neo-sm-green flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar no Inventário</span>
            </button>
          </form>
        )}
      </div>

      {/* Quick Action Cards Grid */}
      <div className="w-full grid grid-cols-2 gap-3 pt-1">
        {/* Emitir Tag sticker */}
        <Link
          href="/emitir-tag"
          onClick={() => sound.click()}
          className="p-3 rounded-2xl bg-card border border-zinc-800 hover:border-neon-cyan transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🏷️</span>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-neon-cyan transition-colors" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Emitir Tags PDF
            </h4>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Folha A4 com 12 stickers coláveis
            </p>
          </div>
        </Link>

        {/* Missões e Badges */}
        <Link
          href="/conquistas"
          onClick={() => sound.click()}
          className="p-3 rounded-2xl bg-card border border-zinc-800 hover:border-neon-green transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">⚡</span>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-neon-green transition-colors" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Missões Diárias
            </h4>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Ganhe XP e desbloqueie medalhas
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
