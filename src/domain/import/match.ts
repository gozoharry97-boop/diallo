import { INGREDIENTS, INGREDIENT_KEYS, type IngredientKey } from '../data/ingredients';
import type { ExtraItem, Recipe, RecipeSource } from '../types';
import type { Extraction } from './schema';

/** Autres noms courants d'un produit du catalogue (en plus de son nom). */
const ALIASES: Partial<Record<IngredientKey, string[]>> = {
  riz: ['riz', 'riz basmati', 'riz thai', 'riz jasmin', 'riz blanc'],
  pates: ['pates', 'spaghetti', 'penne', 'tagliatelles', 'fusilli', 'macaroni', 'linguine'],
  nouilles: ['nouilles aux oeufs', 'nouilles chinoises', 'nouilles ramen'],
  nouillesriz: ['nouilles de riz', 'vermicelles de riz', 'pad thai noodles'],
  udon: ['udon', 'nouilles udon'],
  semoule: ['semoule', 'couscous'],
  lentillesC: ['lentilles corail', 'lentilles rouges'],
  lentillesV: ['lentilles vertes', 'lentilles'],
  poischiches: ['pois chiches'],
  haricots: ['haricots rouges', 'red kidney'],
  haricotsnoirs: ['haricots noirs'],
  tomatesC: ['tomates concassees', 'tomates pelees', 'coulis de tomate', 'sauce tomate', 'pulpe de tomate'],
  concentre: ['concentre de tomate', 'double concentre'],
  coco: ['lait de coco', 'creme de coco'],
  bouillon: ['bouillon', 'cube de bouillon', 'bouillon cube'],
  soja: ['sauce soja', 'soja sale', 'shoyu', 'tamari'],
  saucehuitre: ['sauce huitre', "sauce d'huitre"],
  nuocmam: ['nuoc mam', 'sauce poisson', 'fish sauce'],
  currypaste: ['pate de curry', 'curry rouge', 'curry vert'],
  gochujang: ['gochujang', 'piment coreen'],
  sesame: ['huile de sesame'],
  patearachide: ['pate d arachide', 'beurre de cacahuete', 'beurre d arachide', 'peanut butter'],
  cacahuetes: ['cacahuetes', 'arachides grillees'],
  gingembre: ['gingembre'],
  oignons: ['oignon', 'oignon jaune', 'oignon rouge', 'echalote', 'oignon nouveau', 'cebette'],
  ail: ['ail', 'gousse d ail', 'gousses d ail'],
  citrons: ['citron', 'jus de citron', 'citron jaune'],
  citronvert: ['citron vert', 'lime', 'jus de citron vert'],
  pdt: ['pomme de terre', 'pommes de terre', 'patate'],
  patatedouce: ['patate douce'],
  poivrons: ['poivron'],
  tomates: ['tomate', 'tomates cerises'],
  germes: ['pousses de soja', 'germes de soja', 'soja frais'],
  paksoi: ['pak choi', 'bok choy'],
  oeufs: ['oeuf', 'oeufs'],
  creme: ['creme fraiche', 'creme liquide', 'creme'],
  lait: ['lait'],
  fromage: ['emmental', 'fromage rape', 'parmesan', 'gruyere', 'cheddar', 'mozzarella'],
  beurre: ['beurre'],
  yaourt: ['yaourt', 'yaourt grec'],
  poulet: ['poulet', 'blanc de poulet', 'filet de poulet', 'escalope de poulet'],
  cuisses: ['cuisse de poulet', 'pilon de poulet', 'haut de cuisse'],
  boeuf: ['boeuf hache', 'viande hachee', 'steak hache'],
  boeuflam: ['boeuf emince', 'lamelles de boeuf', 'boeuf en lamelles'],
  boeufmij: ['boeuf a mijoter', 'boeuf bourguignon', 'paleron'],
  crevettes: ['crevette', 'crevettes'],
  saumon: ['saumon', 'pave de saumon'],
  cabillaud: ['cabillaud', 'colin', 'merlu', 'poisson blanc'],
  tilapia: ['tilapia', 'poisson braise'],
  tofu: ['tofu', 'tofu ferme'],
  epinards: ['epinard', 'epinards'],
  herbes: ['coriandre', 'persil', 'menthe', 'basilic', 'aneth', 'ciboulette', 'herbes fraiches'],
  plantain: ['banane plantain', 'plantain'],
  attieke: ['attieke'],
  gombo: ['gombo'],
};

/** Poids moyen d'une pièce pour les produits vendus au poids. */
const PIECE_WEIGHT_G: Partial<Record<IngredientKey, number>> = {
  oignons: 100, carottes: 100, tomates: 120, pdt: 150, courgettes: 200, aubergine: 250,
  patatedouce: 250, plantain: 200, poireaux: 200, brocoli: 400, choufleur: 800, chou: 1000,
  butternut: 1000, gingembre: 30, champignons: 20, poulet: 150, cuisses: 250, saumon: 125,
};

/** Parts d'une unité vendue à la pièce : 1 gousse = 1/10 de tête d'ail. */
const SUB_PIECE: Record<string, number> = { gousse: 0.1, gousses: 0.1 };

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const singular = (word: string) => (word.length > 3 && /[sx]$/.test(word) ? word.slice(0, -1) : word);
const tokens = (text: string) => normalize(text).split(' ').map(singular);

const containsPhrase = (haystack: string[], needle: string[]) =>
  needle.length > 0 && haystack.some((_, i) => needle.every((t, j) => haystack[i + j] === t));

/** Produit du catalogue correspondant à un nom libre, ou null. */
export function matchIngredient(name: string): IngredientKey | null {
  const words = tokens(name);
  let best: { key: IngredientKey; score: number } | null = null;
  for (const key of INGREDIENT_KEYS) {
    const names = [INGREDIENTS[key].name.replace(/\s*\(.*\)/, ''), ...(ALIASES[key] ?? [])];
    for (const candidate of names) {
      const phrase = tokens(candidate);
      if (!containsPhrase(words, phrase)) continue;
      const score = phrase.length * 10 + (phrase.length === words.length ? 5 : 0);
      if (!best || score > best.score) best = { key, score };
    }
  }
  return best?.key ?? null;
}

interface Converted {
  value: number;
  uncertain: boolean;
}

/** Convertit une quantité libre dans l'unité du produit (g, ml ou pièce). */
export function toIngredientUnit(key: IngredientKey, quantity: number | null, rawUnit: string | null): Converted {
  const ingredient = INGREDIENTS[key];
  const unit = rawUnit ? normalize(rawUnit) : '';
  if (quantity === null || quantity <= 0) return { value: defaultQuantity(key), uncertain: true };

  const spoon = /^(c a s|cas|cuillere a soupe|cuilleres a soupe|cs|tbsp)$/.test(unit) ? 15
    : /^(c a c|cac|cuillere a cafe|cuilleres a cafe|cc|tsp)$/.test(unit) ? 5 : 0;
  const metric: Record<string, number> = { g: 1, gr: 1, gramme: 1, grammes: 1, kg: 1000, ml: 1, cl: 10, dl: 100, l: 1000, litre: 1000 };

  if (ingredient.unit === 'pc') {
    if (unit in SUB_PIECE) return { value: quantity * SUB_PIECE[unit], uncertain: false };
    if (!unit || /piece|unite|botte|tete|rouleau|sachet/.test(unit)) return { value: quantity, uncertain: false };
    return { value: quantity, uncertain: true };
  }
  if (spoon) return { value: quantity * spoon, uncertain: false };
  if (unit in metric) return { value: quantity * metric[unit], uncertain: false };
  const pieceWeight = PIECE_WEIGHT_G[key];
  if (pieceWeight && (!unit || /piece|unite|gros|moyen|petit/.test(unit))) return { value: quantity * pieceWeight, uncertain: false };
  return { value: defaultQuantity(key), uncertain: true };
}

function defaultQuantity(key: IngredientKey): number {
  const { unit, pack } = INGREDIENTS[key];
  if (unit === 'pc') return pack <= 3 ? 0.25 : 1;
  return Math.min(pack / 4, unit === 'g' ? 80 : 50);
}

const roundQty = (n: number) => (n >= 10 ? Math.round(n) : Math.round(n * 100) / 100);

export interface BuiltRecipe {
  recipe: Recipe;
  /** Lignes converties avec doute, pour l'encadré « À vérifier ». */
  guessed: string[];
}

/** Recette « cocotte-minute » prête pour le planificateur, à partir de l'extraction. */
export function buildImportedRecipe(extraction: Extraction, id: string, source: RecipeSource): BuiltRecipe {
  const servings = Math.max(1, Math.round(extraction.servings) || 1);
  const ingredients: Recipe['ingredients'] = {};
  const extras: ExtraItem[] = [];
  const guessed: string[] = [];

  for (const item of extraction.ingredients) {
    const key = matchIngredient(item.name);
    if (!key) {
      extras.push({ name: item.name, quantity: item.quantity ?? undefined, unit: item.unit ?? undefined });
      continue;
    }
    const { value, uncertain } = toIngredientUnit(key, item.quantity, item.unit);
    ingredients[key] = roundQty((ingredients[key] ?? 0) + value / servings);
    if (uncertain) guessed.push(INGREDIENTS[key].name.replace(/\s*\(.*\)/, ''));
  }

  const animal = (Object.keys(ingredients) as IngredientKey[]).map((k) => INGREDIENTS[k].animal).find(Boolean);
  return {
    recipe: {
      id,
      name: extraction.title,
      cuisine: extraction.cuisine,
      minutes: Math.max(5, Math.round(extraction.minutes)),
      protein: animal ?? 'legume',
      spicy: extraction.spicy || undefined,
      ingredients,
      steps: extraction.steps.slice(0, 4),
      source,
      extras: extras.length ? extras : undefined,
      uncertainties: extraction.uncertainties.length ? extraction.uncertainties : undefined,
    },
    guessed,
  };
}
