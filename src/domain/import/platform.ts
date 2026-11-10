import type { Platform } from '../types';

export interface VideoRef {
  platform: Platform;
  /** Identifiant de la vidéo ; vide pour un lien court TikTok tant qu'il n'est pas résolu. */
  videoId: string;
  url: string;
}

const PATTERNS: { platform: Platform; test: RegExp }[] = [
  { platform: 'youtube', test: /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i },
  { platform: 'tiktok', test: /tiktok\.com\/@[\w.-]+\/video\/(\d+)/i },
  { platform: 'tiktok', test: /(?:vm|vt)\.tiktok\.com\/([\w-]+)/i },
  { platform: 'instagram', test: /instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([\w-]+)/i },
];

/** Reconnaît un lien YouTube, TikTok ou Instagram. Renvoie null pour tout autre lien. */
export function parseVideoUrl(input: string): VideoRef | null {
  const url = input.trim();
  if (!/^https?:\/\//i.test(url)) return null;
  for (const { platform, test } of PATTERNS) {
    const match = url.match(test);
    if (!match) continue;
    const isShortTikTok = platform === 'tiktok' && /(?:vm|vt)\.tiktok\.com/i.test(url);
    return { platform, videoId: isShortTikTok ? '' : match[1], url };
  }
  return null;
}

/**
 * Lecteurs intégrés officiels. YouTube en mode « nocookie ».
 * À revérifier si une plateforme change ses URL d'intégration.
 */
export function embedUrl(ref: VideoRef): string | null {
  if (!ref.videoId) return null;
  switch (ref.platform) {
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${ref.videoId}?cc_load_policy=1&hl=fr`;
    case 'tiktok':
      return `https://www.tiktok.com/embed/v2/${ref.videoId}?lang=fr-FR`;
    case 'instagram':
      return `https://www.instagram.com/${/\/reels?\//.test(ref.url) ? 'reel' : 'p'}/${ref.videoId}/embed/captioned`;
  }
}

export const PLATFORM_LABEL: Record<Platform, string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
};
