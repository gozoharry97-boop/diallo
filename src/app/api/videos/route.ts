import type { NextRequest } from 'next/server';
import { findVideos } from '@/server/videos';

/** GET /api/videos?recipe=dahl → jusqu'à 3 vidéos du plat (sous-titrées d'abord). */
export async function GET(request: NextRequest) {
  const recipeId = request.nextUrl.searchParams.get('recipe') ?? '';
  if (!/^[a-z0-9-]{1,40}$/i.test(recipeId)) return Response.json({ error: 'Recette inconnue' }, { status: 400 });
  return Response.json(await findVideos(recipeId));
}
