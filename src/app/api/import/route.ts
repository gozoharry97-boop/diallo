import { z } from 'zod';
import { allowRequest, clientKey } from '@/server/rate-limit';
import { runImport } from '@/server/import/run-import';

const Body = z.object({
  url: z.string().url().max(500),
  text: z.string().max(5000).optional(),
});

/** POST /api/import { url, text? } → recette cocotte-minute ou motif d'échec. */
export async function POST(request: Request) {
  if (!allowRequest(`import:${clientKey(request)}`, 15, 60 * 60 * 1000)) {
    return Response.json({ status: 'rate-limited' }, { status: 429 });
  }
  const body = Body.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ status: 'invalid-url' }, { status: 400 });
  return Response.json(await runImport(body.data.url, body.data.text));
}
