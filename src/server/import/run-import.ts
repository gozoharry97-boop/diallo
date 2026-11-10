import 'server-only';
import { buildImportedRecipe } from '@/domain/import/match';
import { parseVideoUrl } from '@/domain/import/platform';
import type { Recipe } from '@/domain/types';
import { env } from '../env';
import { DEMO_EXTRACTION, extractRecipe } from './extract';
import { fetchVideoMetadata } from './metadata';

export type ImportResult =
  | { status: 'ok'; recipe: Recipe; guessed: string[]; thumbnailUrl?: string }
  | { status: 'invalid-url' }
  | { status: 'unavailable-video' }
  | { status: 'need-text' }
  | { status: 'no-recipe' }
  | { status: 'service-unavailable' };

/** Texte minimal pour tenter une extraction (une légende vide ou un simple titre ne suffit pas). */
const MIN_TEXT_LENGTH = 40;

export async function runImport(url: string, userText?: string): Promise<ImportResult> {
  const ref = parseVideoUrl(url);
  if (!ref) return { status: 'invalid-url' };

  if (env.importDemo) {
    const { recipe, guessed } = buildImportedRecipe(DEMO_EXTRACTION, newId(), { platform: ref.platform, url: ref.url, author: '@createur-demo' });
    return { status: 'ok', recipe, guessed };
  }
  if (!env.anthropicKey) return { status: 'service-unavailable' };

  const meta = await fetchVideoMetadata(ref);
  if (!meta && !userText) return { status: 'unavailable-video' };
  const text = [meta?.text, userText].filter(Boolean).join('\n\n').trim();
  if (text.length < MIN_TEXT_LENGTH) return { status: 'need-text' };

  try {
    const extraction = await extractRecipe(text, { title: meta?.title, author: meta?.author });
    if (!extraction.found || extraction.ingredients.length === 0) return { status: 'no-recipe' };
    const { recipe, guessed } = buildImportedRecipe(extraction, newId(), {
      platform: ref.platform,
      url: ref.url,
      title: meta?.title,
      author: meta?.author,
    });
    return { status: 'ok', recipe, guessed, thumbnailUrl: meta?.thumbnailUrl };
  } catch (error) {
    console.error('[import] extraction impossible', error);
    return { status: 'service-unavailable' };
  }
}

const newId = () => `imp-${crypto.randomUUID().slice(0, 8)}`;
