import type { Metadata, Viewport } from 'next';
import '@fontsource/familjen-grotesk/400.css';
import '@fontsource/familjen-grotesk/500.css';
import '@fontsource/familjen-grotesk/600.css';
import '@fontsource/familjen-grotesk/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import './globals.css';
import { AppStateProvider } from '@/state/store';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: { default: 'Diallo — tes dîners dans ton budget', template: '%s · Diallo' },
  description: 'Diallo compose tes dîners de la semaine avec les prix de tes magasins, épiceries du monde comprises, et te prépare la liste de courses.',
  applicationName: 'Diallo',
};

export const viewport: Viewport = {
  themeColor: '#a3214a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <AppStateProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
