import 'server-only';
import { cacheLife } from 'next/cache';
import { INGREDIENTS, type IngredientKey } from '@/domain/data/ingredients';
import generated from '@/domain/data/open-prices.generated.json';
import { referenceTable } from '@/domain/pricing';
import type { PriceTable } from '@/domain/types';
import { getSupabase } from './supabase';

export interface PriceAggregate {
  storeId: string;
  key: string;
  price: number;
  observedTo?: string | null;
}

/** Observations les plus récentes : Supabase si configuré, sinon le fichier généré par l'ingestion. */
async function loadObservations(storeIds: string[]): Promise<PriceAggregate[]> {
  'use cache';
  cacheLife('hours');
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('price_aggregates')
      .select('store_id, ingredient_key, pack_price, observed_to')
      .in('store_id', storeIds);
    if (!error && data) {
      return data.map((row) => ({ storeId: row.store_id, key: row.ingredient_key, price: Number(row.pack_price), observedTo: row.observed_to }));
    }
    console.error('[prix] lecture Supabase impossible, repli sur le fichier', error?.message);
  }
  return (generated.entries as PriceAggregate[]).filter((e) => storeIds.includes(e.storeId));
}

/** Table de prix : référence pour tout, remplacée par une observation réelle quand elle existe. */
export async function getPriceTable(storeIds: string[]): Promise<PriceTable> {
  const table = referenceTable(storeIds);
  for (const obs of await loadObservations([...storeIds].sort())) {
    if (!(obs.key in INGREDIENTS) || !table[obs.storeId]) continue;
    table[obs.storeId][obs.key as IngredientKey] = {
      price: obs.price,
      source: 'open-prices',
      observedAt: obs.observedTo ?? undefined,
    };
  }
  return table;
}
