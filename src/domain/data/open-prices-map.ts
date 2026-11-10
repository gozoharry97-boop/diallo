import type { IngredientKey } from './ingredients';

/**
 * Correspondance entre le catalogue Diallo et les taxonomies Open Food Facts.
 * - `category` : produits sans code-barres (fruits, légumes), prix au kilo ou à l'unité.
 * - `productCategory` : produits emballés, retrouvés par leur catégorie de produit.
 * Les étiquettes sont à affiner au fil des données réellement présentes dans Open Prices.
 */
export const OPEN_PRICES_MAP: Partial<Record<IngredientKey, { category?: string; productCategory?: string }>> = {
  oignons: { category: 'en:onions' },
  carottes: { category: 'en:carrots' },
  pdt: { category: 'en:potatoes' },
  courgettes: { category: 'en:zucchini' },
  tomates: { category: 'en:tomatoes' },
  citrons: { category: 'en:lemons' },
  citronvert: { category: 'en:limes' },
  poireaux: { category: 'en:leeks' },
  poivrons: { category: 'en:bell-peppers' },
  brocoli: { category: 'en:broccoli' },
  aubergine: { category: 'en:aubergines' },
  patatedouce: { category: 'en:sweet-potatoes' },
  plantain: { category: 'en:plantains' },
  gingembre: { category: 'en:ginger' },
  avocat: { category: 'en:avocados' },
  choufleur: { category: 'en:cauliflowers' },
  champignons: { category: 'en:mushrooms' },
  ail: { category: 'en:garlic' },
  concombre: { category: 'en:cucumbers' },
  butternut: { category: 'en:butternut-squashes' },
  chou: { category: 'en:cabbages' },
  riz: { productCategory: 'en:long-grain-rices' },
  pates: { productCategory: 'en:pastas' },
  lentillesC: { productCategory: 'en:red-lentils' },
  lentillesV: { productCategory: 'en:green-lentils' },
  coco: { productCategory: 'en:coconut-milks' },
  soja: { productCategory: 'en:soy-sauces' },
  oeufs: { productCategory: 'en:eggs' },
  beurre: { productCategory: 'en:butters' },
  lait: { productCategory: 'en:semi-skimmed-milks' },
  tofu: { productCategory: 'en:tofu' },
  feta: { productCategory: 'en:feta' },
  yaourt: { productCategory: 'en:plain-yogurts' },
  tomatesC: { productCategory: 'en:canned-tomatoes' },
  poischiches: { productCategory: 'en:canned-chickpeas' },
  semoule: { productCategory: 'en:couscous' },
};
