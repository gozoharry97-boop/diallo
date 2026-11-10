import type { Aisle, ContinentId, CuisineId, DietId, ExclusionId, Store } from '../types';

const SUPERMARKET_FACTOR = { asia: 1.3, afro: 1.4, orient: 1.15, latino: 1.15 };
const DISCOUNT_FACTOR = { asia: 1.35, afro: 1.5, orient: 1.2, latino: 1.2 };

/** Indices de prix estimés : remplacés par Open Prices dès qu'une observation existe. */
export const STORES: readonly Store[] = [
  { id: 'leclerc', name: 'E.Leclerc', kind: 'supermarket', index: 0.92, categoryFactor: SUPERMARKET_FACTOR, osmBrands: ['E.Leclerc', 'Leclerc', 'E. Leclerc'] },
  { id: 'lidl', name: 'Lidl', kind: 'supermarket', index: 0.88, categoryFactor: DISCOUNT_FACTOR, osmBrands: ['Lidl'] },
  { id: 'aldi', name: 'Aldi', kind: 'supermarket', index: 0.87, categoryFactor: DISCOUNT_FACTOR, osmBrands: ['Aldi'] },
  { id: 'intermarche', name: 'Intermarché', kind: 'supermarket', index: 0.97, categoryFactor: SUPERMARKET_FACTOR, osmBrands: ['Intermarché', 'Intermarché Super', 'Intermarché Hyper', 'Intermarché Contact'] },
  { id: 'superu', name: 'Super U', kind: 'supermarket', index: 0.98, categoryFactor: SUPERMARKET_FACTOR, osmBrands: ['Super U', 'Hyper U', 'U Express', 'Marché U'] },
  { id: 'auchan', name: 'Auchan', kind: 'supermarket', index: 0.96, categoryFactor: { ...SUPERMARKET_FACTOR, asia: 1.2 }, osmBrands: ['Auchan', 'Auchan Supermarché', 'My Auchan'] },
  { id: 'carrefour', name: 'Carrefour', kind: 'supermarket', index: 1.0, categoryFactor: { ...SUPERMARKET_FACTOR, asia: 1.2 }, osmBrands: ['Carrefour', 'Carrefour Market', 'Carrefour City', 'Carrefour Express', 'Carrefour Contact'] },
  { id: 'netto', name: 'Netto', kind: 'supermarket', index: 0.93, categoryFactor: DISCOUNT_FACTOR, osmBrands: ['Netto'] },
  { id: 'grandfrais', name: 'Grand Frais', kind: 'supermarket', index: 1.0, categoryFactor: { asia: 1.05, afro: 1.1, orient: 0.95, latino: 1.05 }, aisleFactor: { legumes: 0.88 }, osmBrands: ['Grand Frais'] },
  { id: 'monoprix', name: 'Monoprix', kind: 'supermarket', index: 1.22, categoryFactor: SUPERMARKET_FACTOR, osmBrands: ['Monoprix', 'Monop’', "Monop'"] },
  { id: 'franprix', name: 'Franprix', kind: 'supermarket', index: 1.2, categoryFactor: SUPERMARKET_FACTOR, osmBrands: ['Franprix'] },
  { id: 'biocoop', name: 'Biocoop', kind: 'supermarket', index: 1.45, categoryFactor: SUPERMARKET_FACTOR, osmBrands: ['Biocoop'] },
  { id: 'tang', name: 'Tang Frères', kind: 'specialty', description: 'Asie, Afrique, Antilles', index: 0.92, aisles: ['legumes', 'boucherie', 'epicerie', 'surgeles'], categories: ['asia', 'afro', 'latino'], categoryFactor: { asia: 0.7, afro: 0.85, latino: 0.95 }, osmBrands: ['Tang Frères', 'Tang Freres'] },
  { id: 'parisstore', name: 'Paris Store', kind: 'specialty', description: 'Asie', index: 0.93, aisles: ['legumes', 'boucherie', 'epicerie', 'surgeles'], categories: ['asia', 'afro'], categoryFactor: { asia: 0.72, afro: 0.9 }, osmBrands: ['Paris Store'] },
  { id: 'kmart', name: 'K-Mart', kind: 'specialty', description: 'Corée, Japon', index: 1.1, aisles: ['epicerie', 'surgeles'], categories: ['asia'], categoryFactor: { asia: 0.82 }, osmBrands: ['K-Mart', 'K Mart'] },
  { id: 'asie', name: 'Autre épicerie asiatique', kind: 'specialty', description: 'Chine, Vietnam, Thaïlande…', index: 0.95, aisles: ['legumes', 'epicerie', 'surgeles'], categories: ['asia'], categoryFactor: { asia: 0.75 }, osmBrands: [] },
  { id: 'afro', name: 'Épicerie africaine', kind: 'specialty', description: 'Afrique, Antilles', index: 1.05, aisles: ['epicerie', 'surgeles'], categories: ['afro', 'latino'], categoryFactor: { afro: 0.7, latino: 0.9 }, osmBrands: [] },
  { id: 'orient', name: 'Épicerie orientale', kind: 'specialty', description: 'Maghreb, Moyen-Orient', index: 0.95, aisles: ['legumes', 'epicerie'], categories: ['orient'], categoryFactor: { orient: 0.7 }, osmBrands: [] },
  { id: 'halal', name: 'Boucherie halal', kind: 'specialty', description: 'Viande', index: 0.85, aisles: ['boucherie'], categories: [], categoryFactor: { orient: 0.85 }, noPork: true, osmBrands: [] },
  { id: 'marche', name: 'Marché ou primeur', kind: 'specialty', description: 'Fruits et légumes', index: 0.85, aisles: ['legumes'], categories: [], categoryFactor: {}, osmBrands: [] },
  { id: 'picard', name: 'Picard', kind: 'specialty', description: 'Surgelés', index: 1.15, aisles: ['surgeles'], categories: [], categoryFactor: {}, osmBrands: ['Picard'] },
];

export const STORES_BY_ID: Record<string, Store> = Object.fromEntries(STORES.map((s) => [s.id, s]));
export const SUPERMARKETS = STORES.filter((s) => s.kind === 'supermarket');
export const SPECIALTY_STORES = STORES.filter((s) => s.kind === 'specialty');

export const AISLES: readonly { id: Aisle; name: string }[] = [
  { id: 'legumes', name: 'Fruits & légumes' },
  { id: 'boucherie', name: 'Boucherie & poisson' },
  { id: 'cremerie', name: 'Crèmerie & frais' },
  { id: 'epicerie', name: 'Épicerie' },
  { id: 'surgeles', name: 'Surgelés' },
];

export const CONTINENTS: readonly { id: ContinentId; name: string; summary: string }[] = [
  { id: 'europe', name: 'Europe', summary: 'France, Italie, Espagne, Méditerranée, Nord et Est' },
  { id: 'afrique', name: 'Afrique', summary: 'Ouest, Centre, Est, Maghreb' },
  { id: 'asie', name: 'Asie', summary: 'Chine, Japon, Corée, Thaïlande et Vietnam, Inde' },
  { id: 'moyen-orient', name: 'Moyen-Orient', summary: 'Liban et alentours' },
  { id: 'ameriques', name: 'Amériques', summary: 'Mexique et Amérique latine, Antilles, Amérique du Nord' },
];

export interface Cuisine {
  id: CuisineId;
  name: string;
  continent: ContinentId;
  /** Initiales affichées sur la pastille du dîner. */
  short: string;
  /** Teinte de la pastille (le texte reste #171A33). */
  tint: string;
}

export const CUISINES: readonly Cuisine[] = [
  { id: 'fr', name: 'Française', continent: 'europe', short: 'Fr', tint: '#D5ECDF' },
  { id: 'it', name: 'Italienne', continent: 'europe', short: 'It', tint: '#D5ECDF' },
  { id: 'es', name: 'Espagne & Portugal', continent: 'europe', short: 'Es', tint: '#D5ECDF' },
  { id: 'med', name: 'Grèce & Méditerranée', continent: 'europe', short: 'Mé', tint: '#D5ECDF' },
  { id: 'nord', name: "Europe du Nord & de l'Est", continent: 'europe', short: 'NE', tint: '#D5ECDF' },
  { id: 'ao', name: "Afrique de l'Ouest", continent: 'afrique', short: 'AO', tint: '#F6D3DC' },
  { id: 'ac', name: 'Afrique centrale', continent: 'afrique', short: 'AC', tint: '#F6D3DC' },
  { id: 'ae', name: "Afrique de l'Est", continent: 'afrique', short: 'AE', tint: '#F6D3DC' },
  { id: 'ma', name: 'Maghreb', continent: 'afrique', short: 'Ma', tint: '#F9EBB8' },
  { id: 'cn', name: 'Chine', continent: 'asie', short: 'Ch', tint: '#D7E4F7' },
  { id: 'jp', name: 'Japon', continent: 'asie', short: 'Jp', tint: '#D7E4F7' },
  { id: 'kr', name: 'Corée', continent: 'asie', short: 'Co', tint: '#D7E4F7' },
  { id: 'se', name: 'Thaïlande & Vietnam', continent: 'asie', short: 'TV', tint: '#D7E4F7' },
  { id: 'in', name: 'Inde', continent: 'asie', short: 'In', tint: '#FBE3C4' },
  { id: 'mo', name: 'Liban & Moyen-Orient', continent: 'moyen-orient', short: 'MO', tint: '#E6DDF5' },
  { id: 'lat', name: 'Mexique & Amérique latine', continent: 'ameriques', short: 'AL', tint: '#FCE1CF' },
  { id: 'ant', name: 'Antilles & Réunion', continent: 'ameriques', short: 'An', tint: '#FCE1CF' },
  { id: 'us', name: 'Amérique du Nord', continent: 'ameriques', short: 'AN', tint: '#FCE1CF' },
];

export const CUISINES_BY_ID = Object.fromEntries(CUISINES.map((c) => [c.id, c])) as Record<CuisineId, Cuisine>;

export const DIETS: readonly { id: DietId; name: string; hint?: string }[] = [
  { id: 'omni', name: 'Je mange de tout' },
  { id: 'flexi', name: 'Flexitarien', hint: 'Viande 2 soirs maximum par semaine.' },
  { id: 'pesco', name: 'Pescétarien', hint: 'Poisson et fruits de mer, pas de viande.' },
  { id: 'vege', name: 'Végétarien', hint: 'Ni viande ni poisson, œufs et laitages ok.' },
  { id: 'vegan', name: 'Végan', hint: 'Aucun produit animal.' },
  { id: 'keto', name: 'Low-carb', hint: 'Sans riz, pâtes, pain, pommes de terre ni légumineuses.' },
  { id: 'carni', name: 'Carnivore', hint: 'Uniquement viande, poisson, œufs et produits laitiers.' },
];

export const EXCLUSIONS: readonly { id: ExclusionId; name: string }[] = [
  { id: 'gluten', name: 'Gluten' },
  { id: 'lactose', name: 'Lactose' },
  { id: 'oeufs', name: 'Œufs' },
  { id: 'poisson', name: 'Poisson' },
  { id: 'crustaces', name: 'Crustacés' },
  { id: 'arachides', name: 'Arachides' },
  { id: 'fruitsacoque', name: 'Fruits à coque' },
  { id: 'soja', name: 'Soja' },
  { id: 'sesame', name: 'Sésame' },
  { id: 'porc', name: 'Porc' },
  { id: 'epice', name: 'Plats pimentés' },
];

export const MAX_MINUTES_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 999, label: 'Peu importe' },
];

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;
