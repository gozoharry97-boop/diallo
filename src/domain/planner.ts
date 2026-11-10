import { INGREDIENTS, type IngredientKey } from './data/ingredients';
import { RECIPES } from './data/recipes';
import { isCompatible, weekRespectsDiet } from './diet';
import { unitPrice } from './pricing';
import type { BestPrices, ExtraItem, Ingredient, Pantry, Profile, Recipe } from './types';

export interface PlanLine {
  key: IngredientKey;
  ingredient: Ingredient;
  /** Quantité totale nécessaire pour la semaine. */
  need: number;
  /** Paquets à acheter (0 = déjà au placard). */
  packs: number;
  cost: number;
  storeId: string;
  have: number | true | undefined;
  /** Quantité restante après la semaine (Infinity si « j'en ai assez »). */
  leftover: number;
}

export interface PlanCost {
  /** Montant à payer en caisse. */
  total: number;
  /** Valeur des produits pris dans le placard. */
  pantrySaved: number;
  lines: PlanLine[];
  /** Ingrédients de recettes importées absents du catalogue : à acheter, non chiffrés. */
  unpriced: ExtraItem[];
}

/** Coût d'une semaine : paquets entiers à acheter, placard déduit. */
export function planCost(recipes: Recipe[], people: number, pantry: Pantry, prices: BestPrices): PlanCost {
  const need = new Map<IngredientKey, number>();
  const unpriced: ExtraItem[] = [];
  for (const recipe of recipes) {
    for (const [key, perPerson] of Object.entries(recipe.ingredients) as [IngredientKey, number][]) {
      need.set(key, (need.get(key) ?? 0) + perPerson * people);
    }
    unpriced.push(...(recipe.extras ?? []));
  }

  let total = 0;
  let pantrySaved = 0;
  const lines: PlanLine[] = [];
  for (const [key, quantity] of need) {
    const ingredient = INGREDIENTS[key];
    const quote = prices[key];
    if (!quote) continue;
    const have = pantry[key];
    const fromPantry = have === true ? quantity : Math.min(quantity, typeof have === 'number' ? have : 0);
    const remaining = quantity - fromPantry;
    const packs = remaining > 0 ? Math.ceil(remaining / ingredient.pack - 1e-9) : 0;
    const cost = packs * quote.price;
    total += cost;
    pantrySaved += fromPantry * unitPrice(prices, key);
    const available = have === true ? Number.POSITIVE_INFINITY : (typeof have === 'number' ? have : 0) + packs * ingredient.pack;
    lines.push({ key, ingredient, need: quantity, packs, cost, storeId: quote.storeId, have, leftover: available - quantity });
  }
  return { total: round(total), pantrySaved: round(pantrySaved), lines, unpriced };
}

/** Valeur des ingrédients réellement utilisés par un dîner (hors paquets entamés). */
export function dinnerValue(recipe: Recipe, people: number, prices: BestPrices): number {
  let value = 0;
  for (const [key, perPerson] of Object.entries(recipe.ingredients) as [IngredientKey, number][]) {
    const price = unitPrice(prices, key);
    if (Number.isFinite(price)) value += perPerson * people * price;
  }
  return round(value);
}

export function candidates(profile: Profile, catalog: readonly Recipe[] = RECIPES): Recipe[] {
  return catalog.filter((recipe) => isCompatible(recipe, profile));
}

interface GenerateOptions {
  profile: Profile;
  pantry: Pantry;
  prices: BestPrices;
  /** Budget visé (par défaut celui du profil). 0 = semaine la moins chère possible. */
  budget?: number;
  catalog?: readonly Recipe[];
  random?: () => number;
}

/**
 * Compose une semaine : choix glouton du dîner qui coûte le moins en plus
 * (paquets déjà ouverts réutilisés), pénalités pour varier protéines et cuisines,
 * puis remplacements successifs tant que le total dépasse le budget.
 */
export function generateWeek({ profile, pantry, prices, budget = profile.budget, catalog = RECIPES, random = Math.random }: GenerateOptions): Recipe[] {
  const pool = candidates(profile, catalog);
  const count = Math.min(profile.dinners, pool.length);
  const cost = (week: Recipe[]) => planCost(week, profile.people, pantry, prices).total;
  const noise = Math.max(3, (1.5 * profile.budget) / Math.max(1, profile.dinners));

  const chosen: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const base = cost(chosen);
    let best: { recipe: Recipe; score: number } | null = null;
    for (const recipe of pool) {
      if (chosen.includes(recipe) || !weekRespectsDiet([...chosen, recipe], profile)) continue;
      const sameProtein = chosen.filter((c) => c.protein === recipe.protein).length;
      const sameCuisine = chosen.filter((c) => c.cuisine === recipe.cuisine).length;
      const score = cost([...chosen, recipe]) - base + (sameProtein * 1.5 + sameCuisine * 1.2) * profile.people + random() * noise;
      if (!best || score < best.score) best = { recipe, score };
    }
    if (!best) break;
    chosen.push(best.recipe);
  }
  return fitBudget(chosen, pool, budget, (week) => cost(week), profile);
}

function fitBudget(week: Recipe[], pool: Recipe[], budget: number, cost: (w: Recipe[]) => number, profile: Profile): Recipe[] {
  let current = [...week];
  let total = cost(current);
  for (let round = 0; round < 25 && total > budget; round++) {
    let best: { week: Recipe[]; total: number } | null = null;
    for (let day = 0; day < current.length; day++) {
      for (const recipe of pool) {
        if (current.includes(recipe)) continue;
        const next = current.map((r, i) => (i === day ? recipe : r));
        if (!weekRespectsDiet(next, profile)) continue;
        const nextTotal = cost(next);
        if (nextTotal < (best?.total ?? total) - 0.001) best = { week: next, total: nextTotal };
      }
    }
    if (!best) break;
    current = best.week;
    total = best.total;
  }
  return current;
}

/** Total de la semaine la moins chère trouvée (meilleur de 3 essais). */
export function cheapestWeekTotal(profile: Profile, prices: BestPrices, catalog: readonly Recipe[] = RECIPES): number {
  let best = Number.POSITIVE_INFINITY;
  for (let attempt = 0; attempt < 3; attempt++) {
    const week = generateWeek({ profile, pantry: {}, prices, budget: 0, catalog });
    if (week.length) best = Math.min(best, planCost(week, profile.people, {}, prices).total);
  }
  return best;
}

export interface SwapOption {
  recipe: Recipe;
  total: number;
  delta: number;
  /** Motif d'indisponibilité, sinon null. */
  blocked: 'flexitarien' | 'hors budget' | null;
}

/** Remplaçants possibles d'un dîner, triés du total de semaine le plus bas au plus haut. */
export function swapOptions(week: Recipe[], day: number, profile: Profile, pantry: Pantry, prices: BestPrices, catalog: readonly Recipe[] = RECIPES): SwapOption[] {
  const currentTotal = planCost(week, profile.people, pantry, prices).total;
  return candidates(profile, catalog)
    .filter((recipe) => !week.some((r) => r.id === recipe.id))
    .map((recipe) => {
      const next = week.map((r, i) => (i === day ? recipe : r));
      const total = planCost(next, profile.people, pantry, prices).total;
      const blocked: SwapOption['blocked'] = !weekRespectsDiet(next, profile)
        ? 'flexitarien'
        : total > profile.budget && total > currentTotal
          ? 'hors budget'
          : null;
      return { recipe, total, delta: round(total - currentTotal), blocked };
    })
    .sort((a, b) => a.total - b.total);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
