'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  ScanLine, 
  Flame, 
  AlertCircle, 
  MapPin, 
  Sparkles, 
  Check, 
  Clock,
  HeartHandshake
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { sound } from '@/lib/soundfx';

interface LostItem {
  id: string;
  name: string;
  owner: string;
  code: string;
  model: string;
  color: string;
  timeAgo: string;
  location: string;
  reward: string;
}

const RECENT_LOST: LostItem[] = [
  {
    id: 'lost-1',
    name: 'BIC Verde',
    owner: 'marcos_r',
    code: 'RT-155',
    model: 'BIC Grande',
    color: '#39FF14',
    timeAgo: 'HÁ 2H',
    location: 'Centro',
    reward: '+100 XP',
  },
  {
    id: 'lost-2',
    name: 'Clipper Neon',
    owner: 'julia_s',
    code: 'RT-302',
    model: 'Clipper',
    color: '#FF007F',
    timeAgo: 'HÁ 5H',
    location: 'Campus Universitário',
    reward: '+120 XP',
  },
  {
    id: 'lost-3',
    name: 'Maçarico Turbo Gold',
    owner: 'diego_rock',
    code: 'RT-440',
    model: 'Maçarico',
    color: '#FFE600',
    timeAgo: 'ONTEM',
    location: 'Prainha',
    reward: '+150 XP',
  },
];

export default function ExplorarPage() {
  const { addXP } = useRatoeira();
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedItem, setClaimedItem] = useState<string | null>(null);

  const filteredLost = RECENT_LOST.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClaimReward = (item: LostItem) => {
    sound.xpGain();
    setClaimedItem(item.id);
    addXP(150, `Isqueiro devolvido para @${item.owner}! (+150 XP)`);
  };

  return (
    <div className="flex flex-col px-4 pt-2 pb-16 space-y-4 max-w-md mx-auto">
      {/* Top Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-neon-cyan" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar @usuario ou código #RT-..."
          className="w-full pl-10 pr-11 py-3 rounded-2xl bg-zinc-900 border border-neon-cyan/60 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-neon-cyan transition-colors"
        />
        <Link
          href="/cadastrar"
          onClick={() => sound.click()}
          className="absolute right-2.5 p-1.5 rounded-xl text-neon-green hover:bg-neon-green/10"
          title="Escanear com a câmera"
        >
          <ScanLine className="w-5 h-5 stroke-[2.5]" />
        </Link>
      </div>

      {/* Section 1: Ratoeados Recentemente */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-black text-neon-magenta uppercase tracking-wider">
              RATOEADOS RECENTEMENTE
            </h2>
            <span>🚨</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold">Feed ao vivo</span>
        </div>

        {/* 2-column or scrollable cards */}
        <div className="grid grid-cols-2 gap-3">
          {filteredLost.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-3xl bg-card border border-neon-magenta space-y-2 flex flex-col justify-between shadow-glow-magenta"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/40 flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" />
                  PERDIDO • {item.timeAgo}
                </span>
              </div>

              {/* Lighter Icon */}
              <div className="my-1 flex justify-center">
                <div 
                  className="w-9 h-16 rounded-xl flex items-center justify-center border border-white/20 shadow-md"
                  style={{ backgroundColor: item.color }}
                >
                  <Flame className="w-5 h-5 text-black/80" />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-white truncate">{item.name}</h3>
                <p className="text-[10px] text-neon-cyan font-bold">@{item.owner}</p>
                <p className="text-[9px] text-zinc-500 font-mono">#{item.code}</p>
              </div>

              <div className="pt-1.5 border-t border-zinc-800 text-[9px] text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neon-cyan shrink-0" />
                <span className="truncate">Último sinal: {item.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Quem Procura */}
      <div className="space-y-2.5 pt-2">
        <h2 className="text-xs font-black text-neon-cyan uppercase tracking-wider">
          QUEM PROCURA
        </h2>

        {/* Big User Highlight Card */}
        <div className="p-4 rounded-3xl bg-card border-2 border-neon-cyan space-y-3 shadow-glow-cyan">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-neon-cyan bg-zinc-800 shrink-0">
              <Image
                src="/avatars/1424f982-d4be-467e-948c-e3be7b4f2b0c.webp"
                alt="Lucas SP"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-white">@lucas_sp</h3>
              <p className="text-[10px] text-neon-green font-bold">NÍVEL 4 • RATO EXPERIENTE</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/40">
                  ÍNDICE DE MÃO LEVE: ALTO 🥷
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400">
            18 Fichados • 04 Ratoeados
          </p>

          {/* Public Item Container */}
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2.5">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
              ITENS PÚBLICOS DE @LUCAS_SP
            </span>

            <div className="flex items-center gap-3">
              <div className="w-10 h-14 rounded-xl bg-red-600 flex items-center justify-center border border-white/20 shrink-0">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/40 inline-flex items-center gap-1 mb-0.5">
                  <AlertCircle className="w-2.5 h-2.5" />
                  PROCURADO
                </span>
                <h4 className="text-xs font-bold text-white truncate">
                  Bic Vermelho do Bar
                </h4>
                <p className="text-[10px] text-zinc-500 font-mono">#RT-204</p>
                <p className="text-[9px] text-zinc-400">
                  Perdido na sexta-feira • Recompensa: Gratidão eterna
                </p>
              </div>
            </div>

            {/* Rescue CTA Button */}
            {claimedItem === 'rt-204' ? (
              <div className="w-full py-2.5 rounded-xl bg-neon-green text-black font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
                RESGATE NOTIFICADO! (+150 XP)
              </div>
            ) : (
              <button
                onClick={() => {
                  handleClaimReward({
                    id: 'rt-204',
                    name: 'Bic Vermelho do Bar',
                    owner: 'lucas_sp',
                    code: 'RT-204',
                    model: 'BIC Grande',
                    color: '#EF4444',
                    timeAgo: 'sexta-feira',
                    location: 'Vila Madalena',
                    reward: '+150 XP',
                  });
                }}
                className="w-full py-3 rounded-xl bg-neon-magenta text-white font-display font-black text-xs tracking-wider uppercase hover:bg-neon-magenta/90 shadow-neo-sm-green active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>ACHEI ESSE ISQUEIRO! (+150 XP)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
