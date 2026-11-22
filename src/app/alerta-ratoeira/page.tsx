'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRatoeira } from '@/context/RatoeiraContext';

export default function AlertaRatoeiraPage() {
  const router = useRouter();
  const { triggerRatAlert } = useRatoeira();

  useEffect(() => {
    triggerRatAlert();
    router.replace('/');
  }, [triggerRatAlert, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-4">
      <div className="space-y-2">
        <span className="text-3xl animate-bounce">🚨</span>
        <p className="text-sm font-bold text-neon-magenta">Acionando Alerta de Ratoeira...</p>
      </div>
    </div>
  );
}
