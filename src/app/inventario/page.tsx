'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Flame, 
  Plus, 
  QrCode, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Shield, 
  Skull,
  Zap,
  MoreVertical
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { sound } from '@/lib/soundfx';
import { LighterStatus } from '@/types';

type FilterType = 'TODOS' | 'NO_BOLSO' | 'RATOEADOS';

export default function InventarioPage() {
  const { 
    profile, 
    lighters, 
    updateLighterStatus, 
    deleteLighter, 
    addXP 
  } = useRatoeira();

  const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS');
  const [selectedLighterMenu, setSelectedLighterMenu] = useState<string | null>(null);

  // Counts
  const totalCount = lighters.length;
  const noBolsoCount = lighters.filter((l) => l.status === 'NO_BOLSO').length;
  const ratoeadosCount = lighters.filter((l) => l.status === 'PERDIDO' || l.status === 'FURTADO').length;

  const filteredLighters = lighters.filter((l) => {
    if (activeFilter === 'NO_BOLSO') return l.status === 'NO_BOLSO';
    if (activeFilter === 'RATOEADOS') return l.status === 'PERDIDO' || l.status === 'FURTADO';
    return true;
  });

  const handleToggleStatus = (id: string, currentStatus: LighterStatus) => {
    sound.click();
    if (currentStatus === 'NO_BOLSO') {
      updateLighterStatus(id, 'PERDIDO');
    } else {
      updateLighterStatus(id, 'NO_BOLSO');
      addXP(40, 'Isqueiro resgatado de volta ao bolso!');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja remover "${name}" do seu inventário?`)) {
      deleteLighter(id);
      setSelectedLighterMenu(null);
    }
  };

  return (
    <div className="flex flex-col px-4 pt-2 pb-16 space-y-4 max-w-md mx-auto">
      {/* Top Profile Card */}
      <div className="w-full p-4 rounded-3xl bg-card border border-zinc-800 space-y-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-neon-green via-neon-cyan to-neon-magenta shrink-0 shadow-glow-green">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-950">
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-white text-base truncate">
                @{profile.username}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/40">
                {profile.user_class === 'guardiao' ? 'GUARDIÃO 🛡️' : 'RATO LADRÃO 🥷'}
              </span>
            </div>

            <p className="text-xs text-neon-green font-bold">
              NÍVEL {profile.level} • {profile.title}
            </p>

            {/* Badges preview row */}
            <div className="flex items-center gap-1.5 mt-1 overflow-x-auto">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-yellow-500/30 text-yellow-400 font-bold">
                🏆 MÃO LEVE
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-neon-cyan/30 text-neon-cyan font-bold">
                ⚡ HOUDINI
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-neon-magenta/30 text-neon-magenta font-bold">
                🔥 SOMMELIER
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-1 pt-1 border-t border-zinc-800">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>{profile.xp.toLocaleString()} / {(profile.level * 500).toLocaleString()} XP</span>
            <span className="text-neon-green font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 fill-neon-green" />
              +150 XP hoje
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-magenta rounded-full"
              style={{ width: `${Math.min(100, Math.round((profile.xp / (profile.level * 500)) * 100))}%` }}
            />
          </div>
        </div>

        {/* Pill Counters */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="py-1 px-1 rounded-xl bg-zinc-900/80 border border-neon-cyan/40 text-center">
            <span className="text-[11px] font-bold text-neon-cyan">
              {totalCount < 10 ? `0${totalCount}` : totalCount} • CADASTRADOS
            </span>
          </div>
          <div className="py-1 px-1 rounded-xl bg-zinc-900/80 border border-neon-green/40 text-center">
            <span className="text-[11px] font-bold text-neon-green">
              {noBolsoCount < 10 ? `0${noBolsoCount}` : noBolsoCount} • NO BOLSO
            </span>
          </div>
          <div className="py-1 px-1 rounded-xl bg-zinc-900/80 border border-neon-magenta/40 text-center">
            <span className="text-[11px] font-bold text-neon-magenta">
              {ratoeadosCount < 10 ? `0${ratoeadosCount}` : ratoeadosCount} • RATOEADOS
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <button
          onClick={() => {
            sound.click();
            setActiveFilter('TODOS');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeFilter === 'TODOS'
              ? 'bg-neon-cyan text-black border border-neon-cyan shadow-glow-cyan'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          TODOS ({totalCount})
        </button>

        <button
          onClick={() => {
            sound.click();
            setActiveFilter('NO_BOLSO');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeFilter === 'NO_BOLSO'
              ? 'bg-neon-green text-black border border-neon-green shadow-glow-green'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          NO BOLSO ({noBolsoCount})
        </button>

        <button
          onClick={() => {
            sound.click();
            setActiveFilter('RATOEADOS');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeFilter === 'RATOEADOS'
              ? 'bg-neon-magenta text-white border border-neon-magenta shadow-glow-magenta'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          RATOEADOS ({ratoeadosCount})
        </button>
      </div>

      {/* Lighters Grid or Empty State */}
      {filteredLighters.length === 0 ? (
        <div className="p-8 rounded-3xl bg-card border border-zinc-800 text-center space-y-4 my-2">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center text-3xl">
            🧀
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              NENHUM ISQUEIRO FICHADO
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Seu inventário está zerado. Escaneie ou digite o código do seu primeiro isqueiro para protegê-lo no rolê!
            </p>
          </div>
          <Link
            href="/cadastrar"
            onClick={() => sound.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neon-green text-black font-extrabold text-xs tracking-wider uppercase shadow-neo-magenta hover:bg-neon-green/90 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Fichar Primeiro Isqueiro</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredLighters.map((lighter) => {
          const isNoBolso = lighter.status === 'NO_BOLSO';
          const isSpoils = lighter.is_spoils;

          return (
            <div
              key={lighter.id}
              className={`relative rounded-3xl bg-card p-3 flex flex-col justify-between border-2 transition-all ${
                isSpoils 
                  ? 'border-neon-magenta shadow-glow-magenta' 
                  : isNoBolso 
                  ? 'border-neon-green shadow-glow-green' 
                  : 'border-neon-magenta'
              }`}
            >
              {/* Card Header Badge */}
              <div className="flex items-center justify-between mb-2">
                {isSpoils ? (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-neon-magenta text-white flex items-center gap-1">
                    <Skull className="w-2.5 h-2.5" />
                    ESPÓLIO
                  </span>
                ) : isNoBolso ? (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-neon-green/20 text-neon-green border border-neon-green/40 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    NO BOLSO
                  </span>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/40 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    RATOEADO!
                  </span>
                )}

                <div className="relative">
                  <button
                    onClick={() => {
                      sound.click();
                      setSelectedLighterMenu(selectedLighterMenu === lighter.id ? null : lighter.id);
                    }}
                    className="p-1 rounded-lg text-zinc-500 hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Context Popup */}
                  {selectedLighterMenu === lighter.id && (
                    <div className="absolute right-0 top-6 z-30 w-36 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl p-1 space-y-1 text-xs">
                      <Link
                        href={`/emitir-tag?id=${lighter.id}`}
                        onClick={() => sound.click()}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
                      >
                        <QrCode className="w-3.5 h-3.5 text-neon-cyan" />
                        <span>Emitir Tag</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(lighter.id, lighter.nickname)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-950/40 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Lighter Icon / Visual Display */}
              <div className="my-2 flex flex-col items-center justify-center">
                <div 
                  className="w-12 h-24 rounded-xl flex flex-col items-center justify-between py-2 border-2 border-white/20 relative shadow-inner"
                  style={{ backgroundColor: lighter.color_style || '#0070BA' }}
                >
                  {/* Metal head */}
                  <div className="w-8 h-4 rounded-t-md bg-zinc-300 border-b border-zinc-400 flex items-center justify-center">
                    <div className="w-3 h-2 rounded-full bg-zinc-600" />
                  </div>
                  {/* Body brand */}
                  <div className="text-[8px] font-black uppercase tracking-tighter text-black/70 rotate-90">
                    {lighter.brand_model.replace('_', ' ')}
                  </div>
                  {/* Bottom rim */}
                  <div className="w-6 h-1 rounded-full bg-black/30" />
                </div>
              </div>

              {/* Lighter Info */}
              <div className="mt-1">
                <h3 className="text-xs font-extrabold text-white truncate" title={lighter.nickname}>
                  {lighter.nickname}
                </h3>
                <p className="text-[10px] text-zinc-400 truncate">
                  {lighter.brand_model.replace('_', ' ')} • #{lighter.code_identifier}
                </p>
                {isSpoils && lighter.original_owner && (
                  <p className="text-[9px] text-neon-magenta font-bold mt-0.5">
                    De: {lighter.original_owner}
                  </p>
                )}
              </div>

              {/* Switch Toggle */}
              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <span className={`text-[10px] font-black tracking-wider uppercase ${
                  isNoBolso ? 'text-neon-green' : 'text-neon-magenta'
                }`}>
                  {isNoBolso ? 'COMIGO' : 'PERDIDO'}
                </span>

                {/* Neo Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(lighter.id, lighter.status)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                    isNoBolso ? 'bg-neon-green' : 'bg-red-500'
                  }`}
                  aria-label="Alternar status do isqueiro"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isNoBolso ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}

      {/* Floating Action Button */}
      <div className="sticky bottom-20 z-20 pt-2 flex justify-center">
        <Link
          href="/cadastrar"
          onClick={() => sound.click()}
          className="px-6 py-3 rounded-full bg-neon-green text-black font-display font-black text-xs tracking-wider uppercase shadow-neo-magenta flex items-center gap-2 hover:bg-neon-green/90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>FICHAR NOVO ISQUEIRO (+100 XP)</span>
        </Link>
      </div>
    </div>
  );
}
