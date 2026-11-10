import 'server-only';
import { cacheLife } from 'next/cache';
import type { VideoMetadata } from '@/domain/import/schema';
import type { VideoRef } from '@/domain/import/platform';
import { env } from '../env';

/**
 * Métadonnées publiques d'une vidéo, uniquement via les points d'accès officiels
 * (oEmbed, API YouTube). La vidéo elle-même n'est jamais téléchargée.
 */
export async function fetchVideoMetadata(ref: VideoRef): Promise<VideoMetadata | null> {
  'use cache';
  cacheLife('days');
  try {
    switch (ref.platform) {
      case 'tiktok':
        return await tiktok(ref);
      case 'youtube':
        return await youtube(ref);
      case 'instagram':
        return await instagram(ref);
    }
  } catch (error) {
    console.error(`[import] métadonnées ${ref.platform} indisponibles`, error);
    return null;
  }
}

async function getJson(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': env.userAgent, Accept: 'application/json' } });
  return res.ok ? res.json() : null;
}

async function tiktok(ref: VideoRef): Promise<VideoMetadata | null> {
  const data = await getJson(`https://www.tiktok.com/oembed?url=${encodeURIComponent(ref.url)}`);
  if (!data) return null;
  return {
    platform: 'tiktok',
    url: ref.url,
    videoId: ref.videoId || String(data.embed_product_id ?? ''),
    title: data.title,
    author: data.author_name,
    thumbnailUrl: data.thumbnail_url,
    // Sur TikTok, `title` contient la légende complète de la vidéo.
    text: data.title,
  };
}

async function youtube(ref: VideoRef): Promise<VideoMetadata | null> {
  const oembed = await getJson(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(ref.url)}`);
  let description: string | undefined;
  if (env.youtubeKey) {
    const params = new URLSearchParams({ part: 'snippet', id: ref.videoId, key: env.youtubeKey });
    const details = await getJson(`https://www.googleapis.com/youtube/v3/videos?${params}`);
    description = details?.items?.[0]?.snippet?.description;
  }
  if (!oembed && !description) return null;
  return {
    platform: 'youtube',
    url: ref.url,
    videoId: ref.videoId,
    title: oembed?.title,
    author: oembed?.author_name,
    thumbnailUrl: oembed?.thumbnail_url,
    text: [oembed?.title, description].filter(Boolean).join('\n\n'),
  };
}

async function instagram(ref: VideoRef): Promise<VideoMetadata | null> {
  const params = new URLSearchParams({ url: ref.url, omitscript: 'true' });
  const data = await getJson(`${env.instagramOembed}?${params}`);
  if (!data) return null;
  return {
    platform: 'instagram',
    url: ref.url,
    videoId: ref.videoId,
    author: data.author_name,
    // L'intégration « avec légende » contient souvent le texte du post ; sinon on demandera la description.
    text: typeof data.html === 'string' ? htmlToText(data.html) : undefined,
  };
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}
