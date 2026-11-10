import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { allowRequest, clientKey } from '@/server/rate-limit';
import { SharedListSchema, createSharedList, getSharedList, setItemChecked } from '@/server/shared-lists';

const TOKEN = /^[a-f0-9]{16}$/;

/** POST : crée une liste partagée. 503 si Supabase n'est pas configuré (le client bascule sur un lien instantané). */
export async function POST(request: Request) {
  if (!allowRequest(`share:${clientKey(request)}`, 30, 60 * 60 * 1000)) return Response.json({ error: 'Trop de demandes' }, { status: 429 });
  const body = SharedListSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: 'Liste invalide' }, { status: 400 });
  const token = await createSharedList(body.data);
  return token ? Response.json({ token }) : Response.json({ error: 'Partage indisponible' }, { status: 503 });
}

/** GET ?token=… : contenu et cases cochées. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!TOKEN.test(token)) return Response.json({ error: 'Lien invalide' }, { status: 400 });
  const list = await getSharedList(token);
  return list ? Response.json(list, { headers: { 'Cache-Control': 'no-store' } }) : Response.json({ error: 'Liste introuvable ou expirée' }, { status: 404 });
}

const Patch = z.object({ token: z.string().regex(TOKEN), key: z.string().max(40), checked: z.boolean() });

/** PATCH { token, key, checked } : coche partagée entre colocataires. */
export async function PATCH(request: Request) {
  const body = Patch.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: 'Requête invalide' }, { status: 400 });
  const checked = await setItemChecked(body.data.token, body.data.key, body.data.checked);
  return checked ? Response.json({ checked }) : Response.json({ error: 'Liste introuvable' }, { status: 404 });
}
