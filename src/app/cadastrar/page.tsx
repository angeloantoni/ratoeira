'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Check, 
  Sparkles, 
  Flame, 
  HelpCircle,
  Tag
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';
import { LIGHTER_COLORS } from '@/lib/constants';
import { LighterModel } from '@/types';
import { sound } from '@/lib/soundfx';

const MODELS: { id: LighterModel; label: string }[] = [
  { id: 'BIC_GRANDE', label: 'BIC GRANDE' },
  { id: 'BIC_MINI', label: 'BIC MINI' },
  { id: 'CLIPPER', label: 'CLIPPER' },
  { id: 'MACARICO', label: 'MAÇARICO' },
];

export default function CadastrarPage() {
  const router = useRouter();
  const { addLighter } = useRatoeira();

  const [codeIdentifier, setCodeIdentifier] = useState('7891020304050');
  const [model, setModel] = useState<LighterModel>('BIC_GRANDE');
  const [selectedColor, setSelectedColor] = useState(LIGHTER_COLORS[0]);
  const [nickname, setNickname] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isManualInput, setIsManualInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanSuccess = (code: string) => {
    setCodeIdentifier(code);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    sound.click();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.click();

    const formattedCode = codeIdentifier.trim() || 'RT-' + Math.floor(100 + Math.random() * 900);
    const finalNickname = nickname.trim() || `${model.replace('_', ' ')} ${selectedColor.name}`;

    addLighter({
      code_identifier: formattedCode,
      nickname: finalNickname,
      brand_model: model,
      color_style: selectedColor.hex,
      color_name: selectedColor.name,
      photo_url: photoPreview || undefined,
      status: 'NO_BOLSO',
    });

    router.push('/inventario');
  };

  return (
    <div className="flex flex-col px-4 pt-2 pb-10 space-y-4 max-w-md mx-auto">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-black text-white uppercase tracking-wider">
          CADASTRAR ISQUEIRO
        </h1>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 border border-neon-green/40 text-neon-green text-[10px] font-extrabold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
          SCANNER ATIVO
        </span>
      </div>

      {/* Camera Viewfinder */}
      <BarcodeScanner 
        onScanSuccess={handleScanSuccess} 
        recognizedCode={codeIdentifier}
      />

      {/* Manual Input Toggle or Display */}
      {isManualInput ? (
        <div className="p-3 rounded-2xl bg-zinc-900 border border-neon-cyan space-y-1">
          <label className="text-[10px] font-bold text-neon-cyan uppercase tracking-wider block">
            Código do Isqueiro (EAN / QR Tag)
          </label>
          <input
            type="text"
            value={codeIdentifier}
            onChange={(e) => setCodeIdentifier(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan"
            placeholder="Ex: 7891020304050 ou RT-042"
          />
        </div>
      ) : null}

      {/* Form Details Card */}
      <form onSubmit={handleSubmit} className="p-4 rounded-3xl bg-card border border-zinc-800 space-y-4 shadow-lg">
        <div className="text-center pb-1 border-b border-zinc-800">
          <h2 className="text-xs font-black text-zinc-300 uppercase tracking-widest">
            DETALHES DO ISQUEIRO
          </h2>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Foto do Item (Opcional)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-neon-cyan flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-bold">+ FOTO</span>
            </button>

            {photoPreview ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-neon-green">
                <Image
                  src={photoPreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-neon-green text-black text-[8px] font-black text-center py-0.5">
                  Adicionada
                </span>
              </div>
            ) : (
              <div 
                className="w-16 h-16 rounded-2xl border border-zinc-800 flex items-center justify-center"
                style={{ backgroundColor: selectedColor.hex }}
              >
                <Flame className="w-8 h-8 text-white/80" />
              </div>
            )}
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Modelo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  sound.click();
                  setModel(m.id);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                  model === m.id
                    ? 'bg-neon-cyan text-black border-neon-cyan shadow-glow-cyan'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-700/60 hover:border-zinc-500'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color / Style Picker */}
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Cor / Estampa
          </label>
          <div className="flex items-center gap-2.5 overflow-x-auto py-1">
            {LIGHTER_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  sound.click();
                  setSelectedColor(c);
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-all ${
                  selectedColor.name === c.name
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                    : 'opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              >
                {selectedColor.name === c.name && (
                  <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Nickname / War Mark */}
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
            Apelido / Marca de Guerra
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ex: Bic Azul sem a chapinha de metal, riscado embaixo"
            className="w-full px-3 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>

        {/* CTA Button */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-neon-green text-black font-display font-black text-sm tracking-wider uppercase shadow-neo-magenta hover:bg-neon-green/90 active:scale-98 transition-all flex flex-col items-center justify-center"
          >
            <span>FICHAR NA RATOEIRA</span>
            <span className="text-[10px] font-sans font-bold opacity-90 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              SALVAR NO MEU INVENTÁRIO (+100 XP)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsManualInput(!isManualInput)}
            className="w-full text-center text-[10px] font-bold text-neon-cyan hover:underline tracking-wider uppercase py-1"
          >
            {isManualInput ? 'OCULTAR CÓDIGO MANUAL' : 'OU DIGITAR CÓDIGO MANUALMENTE'}
          </button>
        </div>
      </form>
    </div>
  );
}
