import type { NextRequest } from 'next/server';
import { STORES_BY_ID } from '@/domain/data/catalog';
import { getPriceTable } from '@/server/prices';

/** GET /api/prices?stores=lidl,tang → prix des paquets par magasin et par produit. */
export async function GET(request: NextRequest) {
  const storeIds = (request.nextUrl.searchParams.get('stores') ?? '')
    .split(',')
    .filter((id) => STORES_BY_ID[id])
    .slice(0, 10);
  if (!storeIds.length) return Response.json({ error: 'Aucun magasin connu' }, { status: 400 });
  return Response.json(await getPriceTable(storeIds), {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
