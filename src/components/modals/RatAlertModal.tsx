'use client';

import React from 'react';
import Image from 'next/image';
import { X, Flame, AlertCircle } from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { sound } from '@/lib/soundfx';

export const RatAlertModal: React.FC = () => {
  const { activeAlert, dismissAlert, updateLighterStatus } = useRatoeira();

  if (!activeAlert) return null;

  const lighter = activeAlert.lighter;

  const handleClaim = () => {
    sound.click();
    // Mark lighter as PERDIDO
    updateLighterStatus(lighter.id, 'PERDIDO');
    dismissAlert(true);
    alert(`📢 Isqueiro ${lighter.nickname} marcado como PROCURADO! Alerta emitido para os ratos da região.`);
  };

  const handleMockWhatsApp = () => {
    sound.click();
    const text = encodeURIComponent(
      `🚨 ALERTA DE RATOEIRA! 🧀\n\nO rato @${activeAlert.offender_username} acabou de mocar meu isqueiro "${lighter.nickname}" (${lighter.code_identifier}) no rolê!\n\nDevolve meu fogo ou vai virar alvo do squad! 🔥🐁`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    dismissAlert(false);
  };

  const handleDismiss = () => {
    dismissAlert(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141416] border-2 border-neon-magenta p-5 shadow-glow-magenta">
        {/* Close button */}
        <button
          onClick={() => dismissAlert(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5 text-neon-magenta" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-neon-green tracking-wider uppercase mb-2">
          <span>🚨</span>
          <span>ALERTA DE RATOEIRA!</span>
          <span>🚨</span>
        </div>

        {/* Big Alert Title */}
        <h2 className="text-3xl font-display font-black text-center text-neon-magenta tracking-wide uppercase leading-none drop-shadow-md">
          VOCÊ FOI RATOEADO!
        </h2>

        {/* Offender Banner */}
        <div className="mt-3 px-3 py-1.5 rounded-full bg-zinc-900 border border-neon-magenta/50 text-center">
          <p className="text-xs font-bold text-white uppercase tracking-tight">
            O RATO <span className="text-neon-cyan">@{activeAlert.offender_username}</span> ACABA DE MOCAR SEU ISQUEIRO!
          </p>
        </div>

        {/* Rat running illustration */}
        <div className="relative w-44 h-44 mx-auto my-2">
          <Image
            src="/brand/logo.webp"
            alt="Rato com isqueiro"
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(255,0,127,0.4)]"
          />
        </div>

        {/* Lighter Information Card */}
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20"
              style={{ backgroundColor: lighter.color_style || '#0070BA' }}
            >
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{lighter.nickname}</p>
              <p className="text-xs text-zinc-400 font-mono">#{lighter.code_identifier}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-magenta/20 border border-neon-magenta/40 text-neon-magenta text-[10px] font-black uppercase">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>CAPTURADO EM TEMPO REAL • NO ROLÊ</span>
          </div>

          <p className="text-[10px] text-zinc-400 text-center font-semibold">
            PERDA: -50 XP • CONVERTIDO EM RECOMPENSA DE RESGATE
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2.5">
          {/* Action 1: Reivindicar */}
          <button
            onClick={handleClaim}
            className="w-full py-3 px-4 rounded-2xl bg-neon-magenta text-white font-extrabold text-sm tracking-wide shadow-neo-sm-green active:scale-95 transition-all flex flex-col items-center justify-center"
          >
            <span>COBRAR RECOMPENSA / EXIGIR DE VOLTA</span>
            <span className="text-[10px] font-medium opacity-90">Marcar como Procurado e rastrear</span>
          </button>

          {/* Action 2: Zoar no WhatsApp */}
          <button
            onClick={handleMockWhatsApp}
            className="w-full py-2.5 px-4 rounded-2xl bg-transparent border-2 border-neon-cyan text-neon-cyan font-extrabold text-xs tracking-wider hover:bg-neon-cyan/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>ZOAR @{activeAlert.offender_username.toUpperCase()} NO GRUPO / WHATSAPP 💬</span>
          </button>

          {/* Action 3: Dismiss */}
          <button
            onClick={handleDismiss}
            className="w-full text-center text-[11px] text-zinc-500 hover:text-zinc-300 font-semibold pt-1"
          >
            Deixar pra lá, foi de presente (-50 XP)
          </button>
        </div>
      </div>
    </div>
  );
};
