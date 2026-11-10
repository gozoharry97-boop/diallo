import 'server-only';
import { cacheLife } from 'next/cache';
import { RECIPES_BY_ID } from '@/domain/data/recipes';
import { embedUrl } from '@/domain/import/platform';
import type { Platform } from '@/domain/types';
import { env } from './env';
import { getSupabase } from './supabase';

export interface VideoLink {
  platform: Platform;
  videoId: string;
  url: string;
  title: string;
  author: string;
  durationSeconds?: number;
  /** null : inconnu (TikTok et Instagram n'exposent pas l'information). */
  captions: boolean | null;
  embedUrl: string;
  curated: boolean;
}

const MAX_VIDEOS = 3;

/** Vidéos d'une recette : sélection manuelle (TikTok, Instagram, YouTube) puis recherche YouTube. */
export async function findVideos(recipeId: string): Promise<VideoLink[]> {
  const recipe = RECIPES_BY_ID[recipeId];
  if (!recipe) return [];
  const [curated, searched] = await Promise.all([curatedVideos(recipeId), searchYouTube(`${recipe.name} recette`)]);
  const all = [...curated, ...searched.filter((v) => !curated.some((c) => c.videoId === v.videoId))];
  // Sous-titrées d'abord, puis une vidéo par plateforme avant de compléter.
  all.sort((a, b) => Number(b.captions === true) - Number(a.captions === true));
  const picked: VideoLink[] = [];
  for (const platform of ['youtube', 'tiktok', 'instagram'] as const) {
    const first = all.find((v) => v.platform === platform);
    if (first) picked.push(first);
  }
  for (const v of all) if (picked.length < MAX_VIDEOS && !picked.includes(v)) picked.push(v);
  return picked.slice(0, MAX_VIDEOS);
}

async function curatedVideos(recipeId: string): Promise<VideoLink[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('curated_videos')
    .select('platform, video_id, url, title, author, duration_seconds, has_captions')
    .eq('recipe_id', recipeId);
  if (error || !data) return [];
  return data.flatMap((row) => {
    const ref = { platform: row.platform as Platform, videoId: row.video_id as string, url: row.url as string };
    const embed = embedUrl(ref);
    return embed
      ? [{ ...ref, title: row.title ?? '', author: row.author ?? '', durationSeconds: row.duration_seconds ?? undefined, captions: row.has_captions ?? null, embedUrl: embed, curated: true }]
      : [];
  });
}

/**
 * Recherche YouTube mise en cache une semaine : le quota de `search.list`
 * est très limité (100 requêtes par jour par défaut).
 */
async function searchYouTube(query: string): Promise<VideoLink[]> {
  'use cache';
  cacheLife('weeks');
  if (!env.youtubeKey) return [];
  try {
    const search = new URLSearchParams({
      part: 'snippet', type: 'video', q: query, maxResults: '6', regionCode: 'FR',
      relevanceLanguage: 'fr', videoEmbeddable: 'true', safeSearch: 'strict', key: env.youtubeKey,
    });
    const found = await fetch(`https://www.googleapis.com/youtube/v3/search?${search}`).then((r) => (r.ok ? r.json() : null));
    const ids: string[] = found?.items?.map((i: { id: { videoId: string } }) => i.id.videoId) ?? [];
    if (!ids.length) return [];
    const details = new URLSearchParams({ part: 'snippet,contentDetails', id: ids.join(','), key: env.youtubeKey });
    const videos = await fetch(`https://www.googleapis.com/youtube/v3/videos?${details}`).then((r) => (r.ok ? r.json() : null));
    return (videos?.items ?? []).map((v: YouTubeVideo) => {
      const ref = { platform: 'youtube' as const, videoId: v.id, url: `https://www.youtube.com/watch?v=${v.id}` };
      return {
        ...ref,
        title: v.snippet.title,
        author: v.snippet.channelTitle,
        durationSeconds: parseIsoDuration(v.contentDetails.duration),
        captions: v.contentDetails.caption === 'true',
        embedUrl: embedUrl(ref)!,
        curated: false,
      };
    });
  } catch (error) {
    console.error('[vidéos] recherche YouTube impossible', error);
    return [];
  }
}

interface YouTubeVideo {
  id: string;
  snippet: { title: string; channelTitle: string };
  contentDetails: { duration: string; caption: string };
}

export function parseIsoDuration(iso: string): number | undefined {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}
