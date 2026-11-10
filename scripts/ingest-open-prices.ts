/**
 * Ingestion des prix Open Prices (données ouvertes, licence ODbL — citer la source).
 *
 *   npm run ingest:prices            → écrit src/domain/data/open-prices.generated.json
 *   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npm run ingest:prices   → écrit aussi dans Supabase
 *
 * Pour chaque produit du catalogue : prix non promotionnels en euros, en France, sur 12 mois,
 * ramenés au prix du paquet Diallo, puis médiane par enseigne (2 observations minimum).
 */
import { writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { INGREDIENTS, type IngredientKey } from '../src/domain/data/ingredients';
import { OPEN_PRICES_MAP } from '../src/domain/data/open-prices-map';
import { STORES } from '../src/domain/data/catalog';

const API = process.env.OPEN_PRICES_API ?? 'https://prices.openfoodfacts.org/api/v1/prices';
const USER_AGENT = process.env.HTTP_USER_AGENT ?? 'Diallo/0.1 (ingestion des prix)';
const MONTHS = Number(process.env.OPEN_PRICES_MONTHS ?? 12);
const MAX_PAGES = 5;
const OUTPUT = new URL('../src/domain/data/open-prices.generated.json', import.meta.url);

interface OpenPrice {
  price: number;
  price_per: 'UNIT' | 'KILOGRAM' | 'LITER' | null;
  price_is_discounted: boolean;
  currency: string;
  date: string;
  product?: { product_quantity?: number | null; product_quantity_unit?: string | null } | null;
  location?: { osm_brand?: string | null; osm_address_country_code?: string | null } | null;
}

const since = new Date(Date.now() - MONTHS * 30 * 864e5).toISOString().slice(0, 10);

function storeFor(brand: string | null | undefined): string | null {
  if (!brand) return null;
  const b = brand.toLowerCase();
  return STORES.find((s) => s.osmBrands.some((name) => b === name.toLowerCase() || b.startsWith(`${name.toLowerCase()} `)))?.id ?? null;
}

/** Ramène une observation au prix d'un paquet Diallo (pack en g, ml ou pièces). */
function packPrice(key: IngredientKey, p: OpenPrice): number | null {
  const { pack, unit } = INGREDIENTS[key];
  if (p.price_per === 'KILOGRAM' && unit === 'g') return (p.price * pack) / 1000;
  if (p.price_per === 'LITER' && unit === 'ml') return (p.price * pack) / 1000;
  if (p.price_per === 'UNIT' && unit === 'pc') return p.price * pack;
  const qty = p.product?.product_quantity;
  const qUnit = p.product?.product_quantity_unit?.toLowerCase();
  if (!qty) return null;
  if (unit === 'g' && (!qUnit || qUnit === 'g')) return (p.price / qty) * pack;
  if (unit === 'ml' && (!qUnit || qUnit === 'ml')) return (p.price / qty) * pack;
  return null;
}

async function fetchPrices(filter: Record<string, string>): Promise<OpenPrice[]> {
  const all: OpenPrice[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({ ...filter, currency: 'EUR', price_is_discounted: 'false', date__gte: since, size: '100', page: String(page), order_by: '-date' });
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Open Prices ${res.status} pour ${JSON.stringify(filter)}`);
    const body = (await res.json()) as { items: OpenPrice[]; pages: number };
    all.push(...body.items);
    if (page >= body.pages) break;
  }
  return all;
}

const median = (values: number[]) => {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

async function main() {
  const entries: { storeId: string; key: IngredientKey; price: number; observations: number; observedFrom: string; observedTo: string }[] = [];
  for (const [key, mapping] of Object.entries(OPEN_PRICES_MAP) as [IngredientKey, { category?: string; productCategory?: string }][]) {
    const filter: Record<string, string> = mapping.category
      ? { category_tag: mapping.category }
      : { product__categories_tags__contains: mapping.productCategory ?? '' };
    let prices: OpenPrice[];
    try {
      prices = await fetchPrices(filter);
    } catch (error) {
      console.warn(`⚠︎ ${key} : ${(error as Error).message}`);
      continue;
    }
    const byStore = new Map<string, { values: number[]; dates: string[] }>();
    for (const p of prices) {
      if (p.location?.osm_address_country_code && p.location.osm_address_country_code !== 'FR') continue;
      const storeId = storeFor(p.location?.osm_brand);
      const value = packPrice(key, p);
      if (!storeId || value === null || !Number.isFinite(value) || value <= 0) continue;
      const bucket = byStore.get(storeId) ?? { values: [], dates: [] };
      bucket.values.push(value);
      bucket.dates.push(p.date);
      byStore.set(storeId, bucket);
    }
    for (const [storeId, { values, dates }] of byStore) {
      if (values.length < 2) continue;
      const sorted = [...dates].sort();
      entries.push({ storeId, key, price: Math.round(median(values) * 100) / 100, observations: values.length, observedFrom: sorted[0], observedTo: sorted.at(-1)! });
    }
    console.log(`✓ ${key} : ${prices.length} prix lus, ${byStore.size} enseigne(s)`);
  }

  writeFileSync(OUTPUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: 'Open Prices (Open Food Facts), ODbL', entries }, null, 2)}\n`);
  console.log(`${entries.length} prix agrégés écrits dans ${OUTPUT.pathname}`);

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && entries.length) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { error } = await supabase.from('price_aggregates').upsert(
      entries.map((e) => ({ store_id: e.storeId, ingredient_key: e.key, pack_price: e.price, observations: e.observations, observed_from: e.observedFrom, observed_to: e.observedTo, source: 'open-prices', updated_at: new Date().toISOString() })),
    );
    if (error) throw error;
    console.log('Supabase mis à jour.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
