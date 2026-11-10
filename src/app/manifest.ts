import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Diallo — tes dîners dans ton budget',
    short_name: 'Diallo',
    description: 'Dîners de la semaine, liste de courses et recettes vidéo, dans ton budget.',
    start_url: '/semaine',
    display: 'standalone',
    background_color: '#f2f3f7',
    theme_color: '#a3214a',
    lang: 'fr',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
    // Partager une vidéo depuis TikTok ou Instagram vers Diallo (Android ; non pris en charge par Safari iOS).
    share_target: {
      action: '/importer',
      method: 'GET',
      params: { title: 'title', text: 'text', url: 'url' },
    },
  };
}
