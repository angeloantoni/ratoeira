'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Users, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Clock,
  Shield,
  Gift
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { sound } from '@/lib/soundfx';

export default function ConquistasPage() {
  const { profile, missions, badges, claimMission, addXP } = useRatoeira();
  const [showSeasonModal, setShowSeasonModal] = useState(false);

  // Level calculations
  const nextLevelXp = profile.level * 500;
  const prevLevelXp = (profile.level - 1) * 350;
  const xpInCurrentLevel = Math.max(0, profile.xp - prevLevelXp);
  const xpNeeded = Math.max(100, nextLevelXp - prevLevelXp);
  const xpPercentage = Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));

  const completedMissionsCount = missions.filter((m) => m.completed).length;

  return (
    <div className="flex flex-col px-4 pt-2 pb-16 space-y-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-black text-white uppercase tracking-wider">
          MISSÕES & CONQUISTAS
        </h1>
        <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-yellow-400/40 text-yellow-400 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          NÍVEL {profile.level} • {profile.xp} XP
        </span>
      </div>

      {/* Rank Progress Card */}
      <div className="p-4 rounded-3xl bg-card border border-zinc-800 space-y-2.5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-yellow-400/50 flex items-center justify-center text-2xl shadow-inner">
            👑
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-black text-white uppercase tracking-wider truncate">
              PROGRESSO DA PATENTE: {profile.title}
            </h2>
            <p className="text-[10px] text-zinc-400 font-medium">
              +{Math.max(0, nextLevelXp - profile.xp)} XP PARA NÍVEL {profile.level + 1} (BARÃO DO FOGO)
            </p>
          </div>
        </div>

        {/* Progress Bar with Percentage */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
            <span>Progresso da Patente</span>
            <span className="text-neon-green">{xpPercentage}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-magenta rounded-full shadow-glow-green"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-zinc-800/80">
          <span className="text-neon-green font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 fill-neon-green" />
            +150 XP HOJE
          </span>
          <span className="text-zinc-500 font-semibold">
            {completedMissionsCount}/{missions.length} MISSÕES CONCLUÍDAS
          </span>
        </div>
      </div>

      {/* Daily Flash Missions Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-black text-neon-cyan uppercase tracking-wider">
              MISSÕES RELÂMPAGO
            </h3>
            <Zap className="w-3.5 h-3.5 text-neon-cyan fill-neon-cyan" />
          </div>
          <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-semibold">
            <Clock className="w-3 h-3" />
            Expira em 12h 45m
          </span>
        </div>

        {/* Missions List */}
        <div className="space-y-2">
          {missions.map((m) => {
            const isCompleted = m.completed;
            const borderClass =
              m.theme_color === 'green'
                ? 'border-neon-green shadow-glow-green'
                : m.theme_color === 'magenta'
                ? 'border-neon-magenta shadow-glow-magenta'
                : 'border-neon-cyan shadow-glow-cyan';

            const textBadgeColor =
              m.theme_color === 'green'
                ? 'text-neon-green bg-neon-green/10 border-neon-green/40'
                : m.theme_color === 'magenta'
                ? 'text-neon-magenta bg-neon-magenta/10 border-neon-magenta/40'
                : 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/40';

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl bg-card border ${
                  isCompleted ? borderClass : 'border-zinc-800'
                } space-y-2 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${textBadgeColor}`}>
                      +{m.xp_reward} XP
                    </span>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {m.title}
                    </h4>
                  </div>

                  <span className={`text-[10px] font-bold ${
                    isCompleted ? 'text-neon-green flex items-center gap-1' : 'text-zinc-500 flex items-center gap-1'
                  }`}>
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-neon-green" />
                        {m.current}/{m.total} CONCLUÍDO
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        {m.current}/{m.total}
                      </>
                    )}
                  </span>
                </div>

                <p className="text-[10px] text-zinc-400">
                  {m.description}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.theme_color === 'green'
                        ? 'bg-neon-green'
                        : m.theme_color === 'magenta'
                        ? 'bg-neon-magenta'
                        : 'bg-neon-cyan'
                    }`}
                    style={{ width: `${Math.min(100, (m.current / m.total) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prestige Medals Wall */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-black text-neon-magenta uppercase tracking-wider">
              MURAL DE MEDALHAS
            </h3>
            <Trophy className="w-3.5 h-3.5 text-neon-magenta" />
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold">
            Conquistas de prestígio
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-2xl bg-card border flex flex-col items-center text-center justify-between space-y-1.5 transition-all ${
                b.unlocked
                  ? 'border-neon-green/80 shadow-glow-green'
                  : 'border-zinc-800/80 opacity-50'
              }`}
            >
              {/* Badge Circular Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${
                b.unlocked 
                  ? 'bg-zinc-900 border-neon-green shadow-glow-green' 
                  : 'bg-zinc-950 border-zinc-700'
              }`}>
                {b.icon}
              </div>

              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-tight leading-tight">
                  {b.name}
                </h4>
                <p className={`text-[8px] font-bold mt-0.5 uppercase ${
                  b.unlocked ? 'text-neon-green' : 'text-zinc-500'
                }`}>
                  {b.unlocked ? 'CONQUISTADO' : 'BLOQUEADO'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            sound.xpGain();
            setShowSeasonModal(true);
          }}
          className="w-full py-4 rounded-2xl bg-neon-green text-black font-display font-black text-xs tracking-wider uppercase shadow-neo-magenta hover:bg-neon-green/90 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4 stroke-[2.5]" />
          <span>VER RECOMPENSAS DA TEMPORADA</span>
        </button>
      </div>

      {/* Season Rewards Modal */}
      {showSeasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-xs rounded-3xl bg-[#141416] border-2 border-neon-green p-5 space-y-4 shadow-glow-green text-center">
            <span className="text-3xl">🧀🔥</span>
            <h3 className="text-xl font-display font-black text-white uppercase">
              PASSE DA TEMPORADA #01
            </h3>
            <p className="text-xs text-zinc-400">
              Complete missões diárias para desbloquear o avatar exclusivo &quot;Barão do Fogo Dourado&quot; e tags reflexivas para seus isqueiros!
            </p>
            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-1.5 text-xs">
              <p className="text-neon-green font-bold">✓ Nível 5: Tag Neon Desbloqueada</p>
              <p className="text-neon-cyan font-bold">🔒 Nível 10: Título &quot;Mestre Ratoeiro&quot;</p>
              <p className="text-neon-magenta font-bold">🔒 Nível 15: Avatar Lendário Moletom Ouro</p>
            </div>
            <button
              onClick={() => setShowSeasonModal(false)}
              className="w-full py-2.5 rounded-xl bg-neon-green text-black font-extrabold text-xs uppercase"
            >
              FECHAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
