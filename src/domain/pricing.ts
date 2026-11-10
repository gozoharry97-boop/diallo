import { INGREDIENTS, INGREDIENT_KEYS, type IngredientKey } from './data/ingredients';
import { STORES_BY_ID } from './data/catalog';
import type { BestPrices, Ingredient, PriceTable, Profile, Store } from './types';

/** Le magasin vend-il ce produit ? Un supermarché vend tout ; une épicerie, ses rayons et catégories. */
export function storeCarries(store: Store, ingredient: Ingredient): boolean {
  if (store.noPork && ingredient.pork) return false;
  if (store.kind === 'supermarket') return true;
  return Boolean(store.aisles?.includes(ingredient.aisle) || store.categories?.includes(ingredient.category));
}

/** Prix de référence estimé du paquet dans ce magasin (repli quand aucune observation n'existe). */
export function referencePrice(store: Store, ingredient: Ingredient): number {
  const categoryFactor = store.categoryFactor[ingredient.category] ?? 1;
  const aisleFactor = store.aisleFactor?.[ingredient.aisle] ?? 1;
  return Math.round(ingredient.price * store.index * categoryFactor * aisleFactor * 100) / 100;
}

/** Table de prix de référence pour une liste de magasins. */
export function referenceTable(storeIds: string[]): PriceTable {
  const table: PriceTable = {};
  for (const id of storeIds) {
    const store = STORES_BY_ID[id];
    if (!store) continue;
    table[id] = {};
    for (const key of INGREDIENT_KEYS) {
      const ingredient = INGREDIENTS[key];
      if (storeCarries(store, ingredient)) table[id][key] = { price: referencePrice(store, ingredient), source: 'reference' };
    }
  }
  return table;
}

export function profileStoreIds(profile: Pick<Profile, 'store' | 'extras'>): string[] {
  return [profile.store, ...profile.extras].filter((id) => STORES_BY_ID[id]);
}

/**
 * Pour chaque ingrédient, le magasin le moins cher parmi ceux de l'utilisateur.
 * Une entrée absente de `table` retombe sur le prix de référence.
 */
export function bestPrices(profile: Pick<Profile, 'store' | 'extras'>, table: PriceTable = {}): BestPrices {
  const stores = profileStoreIds(profile).map((id) => STORES_BY_ID[id]);
  const best: BestPrices = {};
  for (const key of INGREDIENT_KEYS) {
    const ingredient = INGREDIENTS[key];
    for (const store of stores) {
      if (!storeCarries(store, ingredient)) continue;
      const quote = table[store.id]?.[key] ?? { price: referencePrice(store, ingredient), source: 'reference' as const };
      const current = best[key];
      if (!current || quote.price < current.price - 0.001) best[key] = { ...quote, storeId: store.id };
    }
  }
  return best;
}

export function unitPrice(prices: BestPrices, key: IngredientKey): number {
  const quote = prices[key];
  return quote ? quote.price / INGREDIENTS[key].pack : Number.POSITIVE_INFINITY;
}
