import type { IngredientKey } from './data/ingredients';

export type { IngredientKey };

export type Unit = 'g' | 'ml' | 'pc';
export type Aisle = 'legumes' | 'boucherie' | 'cremerie' | 'epicerie' | 'surgeles';
export type ProductCategory = 'base' | 'asia' | 'afro' | 'orient' | 'latino';
export type Allergen =
  | 'gluten' | 'lactose' | 'oeufs' | 'poisson' | 'crustaces'
  | 'arachides' | 'fruitsacoque' | 'soja' | 'sesame';
export type AnimalType = 'viande' | 'poisson' | 'mer' | 'oeuf' | 'lait';

export interface Ingredient {
  name: string;
  /** Taille du paquet vendu, dans `unit`. */
  pack: number;
  unit: Unit;
  /** Prix de référence du paquet (€), moyenne nationale estimée. */
  price: number;
  aisle: Aisle;
  category: ProductCategory;
  allergens?: readonly Allergen[];
  animal?: AnimalType;
  pork?: boolean;
  /** Féculent : exclu du régime low-carb. */
  starchy?: boolean;
  /** Se conserve : les restes passent au placard. */
  keeps?: boolean;
  packLabel?: string;
  /** Sous-unité pour les petites quantités : 1 tête d'ail = 10 gousses. */
  small?: { label: string; per: number };
}

export type CuisineId =
  | 'fr' | 'it' | 'es' | 'med' | 'nord'
  | 'ao' | 'ac' | 'ae' | 'ma'
  | 'cn' | 'jp' | 'kr' | 'se' | 'in'
  | 'mo' | 'lat' | 'ant' | 'us';
export type ContinentId = 'europe' | 'afrique' | 'asie' | 'moyen-orient' | 'ameriques';
export type DietId = 'omni' | 'flexi' | 'pesco' | 'vege' | 'vegan' | 'keto' | 'carni';
export type ExclusionId = Allergen | 'porc' | 'epice';
export type Platform = 'youtube' | 'tiktok' | 'instagram';

/** Ingrédient d'une recette importée qui n'existe pas dans le catalogue (non chiffré). */
export interface ExtraItem {
  name: string;
  quantity?: number;
  unit?: string;
}

export interface RecipeSource {
  platform: Platform;
  url: string;
  title?: string;
  author?: string;
}

export interface Recipe {
  id: string;
  name: string;
  cuisine: CuisineId;
  minutes: number;
  /** Protéine principale, pour varier la semaine. */
  protein: string;
  spicy?: boolean;
  /** Quantité par personne, dans l'unité de l'ingrédient. */
  ingredients: Partial<Record<IngredientKey, number>>;
  steps: string[];
  /** Recettes importées depuis une vidéo. */
  source?: RecipeSource;
  extras?: ExtraItem[];
  uncertainties?: string[];
}

export interface Store {
  id: string;
  name: string;
  kind: 'supermarket' | 'specialty';
  description?: string;
  /** Indice de prix général (1 = moyenne nationale). */
  index: number;
  /** Multiplicateur par catégorie de produits. */
  categoryFactor: Partial<Record<ProductCategory, number>>;
  aisleFactor?: Partial<Record<Aisle, number>>;
  /** Épicerie spécialisée : rayons et catégories vendus. Supermarché : tout. */
  aisles?: readonly Aisle[];
  categories?: readonly ProductCategory[];
  noPork?: boolean;
  /** Valeurs possibles de `osm_brand` dans Open Prices. */
  osmBrands: readonly string[];
}

export interface Profile {
  store: string;
  extras: string[];
  people: number;
  dinners: number;
  budget: number;
  diet: DietId;
  exclusions: ExclusionId[];
  /** Vide = ouvert à toutes les cuisines. */
  cuisines: CuisineId[];
  maxMinutes: number;
}

/** Quantité restante (unité de l'ingrédient) ou `true` = « j'en ai assez ». */
export type Pantry = Partial<Record<IngredientKey, number | true>>;

export type PriceSource = 'open-prices' | 'reference';

export interface PriceQuote {
  /** Prix du paquet (€). */
  price: number;
  storeId: string;
  source: PriceSource;
  observedAt?: string;
}

/** Prix par magasin puis par ingrédient. */
export type PriceTable = Record<string, Partial<Record<IngredientKey, Omit<PriceQuote, 'storeId'>>>>;

export type BestPrices = Partial<Record<IngredientKey, PriceQuote>>;

export interface WeekRecord {
  weekStart: string;
  budget: number;
  total: number;
  pantrySaved: number;
  dinners: number;
  cooked: number;
  cuisinesCooked: CuisineId[];
  challengeDone: boolean;
}
