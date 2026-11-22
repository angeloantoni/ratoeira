import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RatoeiraProvider } from '@/context/RatoeiraContext';
import { TopHeader } from '@/components/layout/TopHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { RatAlertModal } from '@/components/modals/RatAlertModal';
import { XpToast } from '@/components/modals/XpToast';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Ratoeira',
  description: 'O Web App Progressivo gamificado com estética Streetwear Neon para rastrear e resgatar isqueiros no rolê.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.webp',
    shortcut: '/favicon.webp',
    apple: '/icon.webp',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0D0D0D] text-white min-h-screen bg-graffiti-pattern flex flex-col justify-between selection:bg-neon-magenta selection:text-white">
        <RatoeiraProvider>
          {/* Main App Container styled like modern mobile screen */}
          <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative bg-[#0D0D0D] shadow-2xl border-x border-zinc-900">
            <TopHeader />
            <SideDrawer />
            <RatAlertModal />
            <XpToast />
            <ServiceWorkerRegister />

            <main className="flex-1 pb-24 overflow-y-auto">
              {children}
            </main>

            <BottomNav />
          </div>
        </RatoeiraProvider>
      </body>
    </html>
  );
}
