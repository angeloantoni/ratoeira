'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { 
  Download, 
  Share2, 
  Check, 
  Flame, 
  Sparkles, 
  Printer, 
  Image as ImageIcon 
} from 'lucide-react';
import { useRatoeira } from '@/context/RatoeiraContext';
import { sound } from '@/lib/soundfx';

type TagTheme = 'classic' | 'neon' | 'magenta';

function EmitirTagContent() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id');
  const { lighters, profile, addXP } = useRatoeira();

  const [selectedLighterId, setSelectedLighterId] = useState<string>(
    requestedId || lighters[0]?.id || ''
  );
  const [selectedTheme, setSelectedTheme] = useState<TagTheme>('classic');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showStoriesModal, setShowStoriesModal] = useState(false);

  const selectedLighter = lighters.find((l) => l.id === selectedLighterId) || lighters[0];

  if (!selectedLighter) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-3xl">
          🏷️
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-display font-black text-white uppercase tracking-wider">
            NENHUM ISQUEIRO PARA EMITIR TAG
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs">
            Você ainda não fichou nenhum isqueiro. Cadastre seu isqueiro primeiro para gerar stickers e a folha A4 com 12 etiquetas!
          </p>
        </div>
        <Link
          href="/cadastrar"
          onClick={() => sound.click()}
          className="px-6 py-3 rounded-2xl bg-neon-green text-black font-extrabold text-xs uppercase tracking-wider shadow-neo-magenta hover:bg-neon-green/90 transition-all"
        >
          + Fichar Isqueiro Agora
        </Link>
      </div>
    );
  }

  // Generate real PDF with 12 stickers on an A4 sheet
  const handleGeneratePdf = async () => {
    sound.click();
    setIsGeneratingPdf(true);

    try {
      // Create A4 PDF (210mm x 297mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Instructions on PDF
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(13, 13, 13);
      doc.text('RATOEIRA — FOLHA DE ETIQUETAS ADESIVAS PARA ISQUEIRO', 20, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Item: ${selectedLighter.nickname} (${selectedLighter.code_identifier}) | Dono: @${profile.username} | Imprimir em escala 100% (Tamanho real: 15mm x 45mm)`,
        20,
        21
      );

      // Grid setup: 3 columns x 4 rows = 12 stickers
      const startX = 25;
      const startY = 30;
      const stickerWidth = 15; // 1.5 cm
      const stickerHeight = 45; // 4.5 cm
      const gapX = 35;
      const gapY = 15;

      const tagUrl = `https://ratoeira.app/resgate?code=${selectedLighter.code_identifier}&owner=${profile.username}`;

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const x = startX + col * (stickerWidth + gapX);
          const y = startY + row * (stickerHeight + gapY);

          // Sticker border & cutting guide
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.3);
          doc.roundedRect(x, y, stickerWidth, stickerHeight, 2, 2);

          // Header: RATOEIRA
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6);
          doc.setTextColor(0, 0, 0);
          doc.text('RATOEIRA', x + stickerWidth / 2, y + 4, { align: 'center' });

          // Propriedade De
          doc.setFontSize(4);
          doc.setFont('helvetica', 'normal');
          doc.text('PROPRIEDADE DE:', x + stickerWidth / 2, y + 26, { align: 'center' });

          // Username
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(5);
          doc.text(`@${profile.username}`, x + stickerWidth / 2, y + 29, { align: 'center' });

          // Code
          doc.setFontSize(5);
          doc.text(`#${selectedLighter.code_identifier}`, x + stickerWidth / 2, y + 33, { align: 'center' });

          // Message
          doc.setFontSize(3.5);
          doc.text('ESCANEIE SE ACHAR!', x + stickerWidth / 2, y + 37, { align: 'center' });

          // Barcode dummy lines
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.4);
          for (let b = 0; b < 10; b++) {
            const bx = x + 2.5 + b * 1;
            doc.line(bx, y + 39, bx, y + 43);
          }
        }
      }

      doc.save(`etiquetas-ratoeira-${selectedLighter.code_identifier}.pdf`);
      addXP(50, 'Folha de etiquetas A4 gerada!');
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      alert('Erro ao gerar o PDF. Verifique se o navegador bloqueou downloads.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col px-4 pt-2 pb-16 space-y-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-black text-white uppercase tracking-wider">
          EMITIR TAG
        </h1>
        <span className="px-2.5 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan text-[10px] font-extrabold tracking-wider uppercase">
          • TAG GENERATOR
        </span>
      </div>

      {/* Selected Lighter Card & Switcher */}
      <div className="p-3.5 rounded-3xl bg-card border border-neon-cyan/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20"
              style={{ backgroundColor: selectedLighter.color_style || '#0070BA' }}
            >
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{selectedLighter.nickname}</h2>
              <p className="text-[10px] text-zinc-400">
                {selectedLighter.brand_model.replace('_', ' ')} • Código: {selectedLighter.code_identifier}
              </p>
            </div>
          </div>

          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-neon-green/20 text-neon-green border border-neon-green/40">
            {selectedLighter.status === 'NO_BOLSO' ? 'NO BOLSO' : 'PERDIDO'}
          </span>
        </div>

        {/* Change lighter selector if multiple exist */}
        {lighters.length > 1 && (
          <div className="pt-2 border-t border-zinc-800">
            <select
              value={selectedLighterId}
              onChange={(e) => {
                sound.click();
                setSelectedLighterId(e.target.value);
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 focus:outline-none focus:border-neon-cyan"
            >
              {lighters.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nickname} (#{l.code_identifier})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="p-4 rounded-3xl bg-card border border-zinc-800 space-y-3">
        <div className="text-center pb-1 border-b border-zinc-800">
          <h3 className="text-xs font-black text-neon-green uppercase tracking-wider">
            PREVIEW DA TAG (ADESIVO PARA O ISQUEIRO)
          </h3>
        </div>

        {/* 3D Visual Preview of Lighter with Sticker */}
        <div className="flex items-center justify-center gap-6 py-4">
          {/* Virtual 3D Lighter */}
          <div className="relative flex flex-col items-center">
            <div 
              className="w-16 h-36 rounded-2xl flex flex-col items-center justify-between p-2 border-2 border-white/20 shadow-2xl relative"
              style={{ backgroundColor: selectedLighter.color_style || '#0070BA' }}
            >
              {/* Metal Head */}
              <div className="w-10 h-6 -mt-4 rounded-t-lg bg-gradient-to-b from-zinc-200 to-zinc-400 border border-zinc-500 flex items-center justify-center shadow-md">
                <div className="w-4 h-3 rounded-full bg-zinc-700" />
              </div>

              {/* Tag sticker applied on lighter body */}
              <div className={`w-11 h-24 rounded-lg p-1 flex flex-col items-center justify-between text-[6px] font-bold shadow-md ${
                selectedTheme === 'classic'
                  ? 'bg-white text-black'
                  : selectedTheme === 'neon'
                  ? 'bg-[#0D0D0D] text-neon-green border border-neon-green'
                  : 'bg-zinc-950 text-neon-magenta border border-neon-magenta'
              }`}>
                <span className="font-display tracking-tighter text-[7px] uppercase font-black">
                  RATOEIRA
                </span>
                <div className="p-0.5 bg-white rounded">
                  <QRCodeSVG
                    value={`https://ratoeira.app/r/${selectedLighter.code_identifier}`}
                    size={30}
                    level="L"
                  />
                </div>
                <div className="text-center leading-none">
                  <span className="text-[5px] block opacity-70">PROP. DE:</span>
                  <span className="text-[6px] font-extrabold block truncate max-w-[40px]">
                    @{profile.username}
                  </span>
                  <span className="text-[5px] block font-mono">
                    #{selectedLighter.code_identifier}
                  </span>
                </div>
              </div>

              {/* Bottom rim */}
              <div className="w-8 h-1 rounded-full bg-black/40" />
            </div>

            {/* Stand Base */}
            <div className="w-20 h-3 rounded-lg bg-zinc-800 border-t border-zinc-700 -mt-1 shadow-md" />
          </div>

          {/* Large Vertical Sticker Preview */}
          <div className={`w-28 h-56 rounded-2xl p-2.5 flex flex-col items-center justify-between shadow-2xl border-2 ${
            selectedTheme === 'classic'
              ? 'bg-white text-black border-zinc-300'
              : selectedTheme === 'neon'
              ? 'bg-[#0D0D0D] text-white border-neon-green shadow-glow-green'
              : 'bg-zinc-950 text-white border-neon-magenta shadow-glow-magenta'
          }`}>
            {/* Tag Header */}
            <div className="flex items-center gap-1">
              <span className="text-xs">🧀</span>
              <span className={`font-display font-black text-xs tracking-wider uppercase ${
                selectedTheme === 'neon' ? 'text-neon-green' : selectedTheme === 'magenta' ? 'text-neon-magenta' : 'text-black'
              }`}>
                RATOEIRA
              </span>
            </div>

            {/* QR Code */}
            <div className="p-1.5 bg-white rounded-xl shadow">
              <QRCodeSVG
                value={`https://ratoeira.app/resgate?code=${selectedLighter.code_identifier}&owner=${profile.username}`}
                size={72}
                level="M"
              />
            </div>

            {/* Owner Info */}
            <div className="text-center space-y-0.5">
              <span className={`text-[8px] font-bold block uppercase tracking-wider ${
                selectedTheme === 'classic' ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                PROPRIEDADE DE:
              </span>
              <span className={`text-xs font-black block tracking-tight uppercase ${
                selectedTheme === 'neon' ? 'text-neon-green' : selectedTheme === 'magenta' ? 'text-neon-magenta' : 'text-black'
              }`}>
                @{profile.username}
              </span>
              <span className="text-[10px] font-mono font-bold block">
                #{selectedLighter.code_identifier}
              </span>
            </div>

            {/* Scan notice & Barcode */}
            <div className="text-center w-full">
              <span className={`text-[7px] font-extrabold block uppercase tracking-wider ${
                selectedTheme === 'classic' ? 'text-zinc-700' : 'text-zinc-400'
              }`}>
                ESCANEIE SE ACHAR!
              </span>
              <div className="mt-1 h-3 flex items-center justify-center gap-0.5 w-full">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full ${
                      selectedTheme === 'classic' ? 'bg-black' : 'bg-white'
                    }`}
                    style={{ width: i % 3 === 0 ? '2px' : '1px' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-zinc-500 text-center font-medium">
          Tamanho real: 1,5cm × 4,5cm • Cabe no Bic Grande / Clipper
        </p>

        {/* Theme Selector */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {/* Classic P&B */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              setSelectedTheme('classic');
            }}
            className={`p-2 rounded-2xl border text-left transition-all ${
              selectedTheme === 'classic'
                ? 'bg-zinc-900 border-neon-cyan text-white shadow-glow-cyan'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span className="text-[10px] font-black uppercase block flex items-center gap-1">
              {selectedTheme === 'classic' && <Check className="w-3 h-3 text-neon-cyan" />}
              CLASSIC P&B
            </span>
            <span className="text-[8px] text-zinc-500 leading-tight block mt-0.5">
              Alto contraste para impressoras básicas
            </span>
          </button>

          {/* Neon Dark */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              setSelectedTheme('neon');
            }}
            className={`p-2 rounded-2xl border text-left transition-all ${
              selectedTheme === 'neon'
                ? 'bg-zinc-900 border-neon-green text-white shadow-glow-green'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span className="text-[10px] font-black uppercase block flex items-center gap-1 text-neon-green">
              {selectedTheme === 'neon' && <Check className="w-3 h-3 text-neon-green" />}
              NEON DARK
            </span>
            <span className="text-[8px] text-zinc-500 leading-tight block mt-0.5">
              Estética cyberpunk com fundo escuro
            </span>
          </button>

          {/* Alerta Magenta */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              setSelectedTheme('magenta');
            }}
            className={`p-2 rounded-2xl border text-left transition-all ${
              selectedTheme === 'magenta'
                ? 'bg-zinc-900 border-neon-magenta text-white shadow-glow-magenta'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span className="text-[10px] font-black uppercase block flex items-center gap-1 text-neon-magenta">
              {selectedTheme === 'magenta' && <Check className="w-3 h-3 text-neon-magenta" />}
              MAGENTA
            </span>
            <span className="text-[8px] text-zinc-500 leading-tight block mt-0.5">
              Máxima visibilidade no rolê
            </span>
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Main PDF Download */}
        <button
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf}
          className="w-full py-4 rounded-2xl bg-neon-green text-black font-display font-black text-sm tracking-wider uppercase shadow-neo-magenta hover:bg-neon-green/90 active:scale-98 transition-all flex flex-col items-center justify-center"
        >
          <span className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            {isGeneratingPdf ? 'GERANDO PDF...' : 'BAIXAR PDF PARA IMPRESSÃO'}
          </span>
          <span className="text-[10px] font-sans font-bold opacity-90">
            Folha A4 diagramada com 12 etiquetas
          </span>
        </button>

        {/* Stories / Poster generator */}
        <button
          onClick={() => {
            sound.click();
            setShowStoriesModal(true);
          }}
          className="w-full py-3 rounded-2xl bg-transparent border-2 border-neon-cyan text-neon-cyan font-bold text-xs tracking-wider uppercase hover:bg-neon-cyan/10 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>GERAR CARTAZ / STORIES (PROCURADO)</span>
        </button>
      </div>

      {/* Stories Poster Modal */}
      {showStoriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-xs rounded-3xl bg-[#141416] border-2 border-neon-cyan p-4 space-y-3 shadow-glow-cyan text-center">
            <h3 className="text-xl font-display font-black text-neon-magenta uppercase tracking-wider">
              🚨 PROCURADO NO ROLÊ! 🚨
            </h3>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div 
                className="w-20 h-28 mx-auto rounded-xl flex items-center justify-center border-2 border-white/20 shadow-md"
                style={{ backgroundColor: selectedLighter.color_style || '#0070BA' }}
              >
                <Flame className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm font-extrabold text-white">{selectedLighter.nickname}</p>
              <p className="text-xs text-neon-green font-bold">RECOMPENSA: +100 XP + CERVEJA GELADA</p>
              <div className="p-2 bg-white rounded-xl inline-block">
                <QRCodeSVG
                  value={`https://ratoeira.app/r/${selectedLighter.code_identifier}`}
                  size={90}
                />
              </div>
              <p className="text-[10px] text-zinc-400">Escaneie para devolver a @{profile.username}</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sound.xpGain();
                  alert('Cartaz pronto! Tire um print ou compartilhe direto nos seus Stories.');
                }}
                className="w-full py-2.5 rounded-xl bg-neon-cyan text-black font-extrabold text-xs tracking-wider uppercase hover:bg-neon-cyan/90 transition-colors"
              >
                COMPARTILHAR NO INSTAGRAM
              </button>
              <button
                onClick={() => setShowStoriesModal(false)}
                className="text-xs text-zinc-500 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmitirTagPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-zinc-500">Carregando gerador de tags...</div>}>
      <EmitirTagContent />
    </Suspense>
  );
}
