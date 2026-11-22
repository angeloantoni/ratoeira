'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sound } from '@/lib/soundfx';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  recognizedCode?: string;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  onScanSuccess, 
  recognizedCode 
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<unknown>(null);
  const containerId = 'html5qr-code-full-region';

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let html5QrCode: any = null;

    let mounted = true;

    async function initScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted) return;

        html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 160 },
          aspectRatio: 1.5,
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText: string) => {
            sound.scanSuccess();
            onScanSuccess(decodedText);
          },
          () => {
            // Frame scan failure is normal when no barcode is in view
          }
        );

        if (mounted) {
          setIsScanning(true);
          setCameraError(null);
        }
      } catch (err: unknown) {
        console.warn('Câmera não inicializada:', err);
        if (mounted) {
          setCameraError('Câmera indisponível ou permissão não concedida.');
          setIsScanning(false);
        }
      }
    }

    initScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        try {
          (scannerRef.current as { stop: () => Promise<void>; clear: () => void }).stop()
            .then(() => {
              (scannerRef.current as { clear: () => void }).clear();
            })
            .catch(() => {});
        } catch {
          // cleanup
        }
      }
    };
  }, [onScanSuccess]);

  const simulateQuickScan = () => {
    sound.scanSuccess();
    // Simulate typical BIC barcode or RT code
    const mockBarcodes = ['7891020304050', '7891035210492', 'RT-042', 'RT-115'];
    const chosen = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    onScanSuccess(chosen);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-neon-green bg-black">
      {/* Viewfinder Target Corners */}
      <div className="absolute inset-0 pointer-events-none z-20 p-4">
        {/* Top-left corner */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-neon-green rounded-tl-xl" />
        {/* Top-right corner */}
        <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-neon-green rounded-tr-xl" />
        {/* Bottom-left corner */}
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-neon-green rounded-bl-xl" />
        {/* Bottom-right corner */}
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-neon-green rounded-br-xl" />

        {/* Dynamic Pink Neon Laser Line */}
        <div className="absolute left-6 right-6 h-0.5 bg-neon-magenta shadow-[0_0_12px_#FF007F] animate-laser-line" />
      </div>

      {/* HTML5 QR Code Mount Region */}
      <div 
        id={containerId} 
        className="w-full h-56 bg-zinc-950 flex items-center justify-center overflow-hidden"
      >
        {cameraError && (
          <div className="text-center p-4 z-10 space-y-2">
            <Camera className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 max-w-xs">{cameraError}</p>
            <button
              type="button"
              onClick={simulateQuickScan}
              className="mt-2 px-3 py-1.5 rounded-xl bg-neon-green/20 border border-neon-green text-neon-green text-xs font-bold hover:bg-neon-green/30"
            >
              Simular Leitura de Isqueiro ⚡
            </button>
          </div>
        )}
      </div>

      {/* Top action button on scanner */}
      <div className="absolute top-4 right-4 z-30">
        <button
          type="button"
          onClick={simulateQuickScan}
          title="Simular escaneamento com código real"
          className="w-9 h-9 rounded-full bg-black/60 border border-neon-green text-neon-green flex items-center justify-center hover:bg-neon-green hover:text-black transition-colors"
        >
          <Zap className="w-4 h-4" />
        </button>
      </div>

      {/* Recognition Pill */}
      {recognizedCode && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-xs">
          <div className="px-3 py-1.5 rounded-full bg-zinc-950/90 border border-neon-green text-neon-green flex items-center justify-center gap-1.5 shadow-glow-green text-xs font-extrabold tracking-wider">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-neon-green" />
            <span className="truncate">CÓDIGO: {recognizedCode}</span>
          </div>
        </div>
      )}
    </div>
  );
};
