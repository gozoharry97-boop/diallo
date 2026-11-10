import type { Ingredient } from './types';

const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

/** 1.35 → « 1,35 € » */
export function eur(amount: number): string {
  return EUR.format(Math.round(amount * 100) / 100);
}

const decimal = (n: number, digits = 1) =>
  (Math.round(n * 10 ** digits) / 10 ** digits).toString().replace('.', ',');

/** Quantité lisible : 1200 g → « 1,2 kg », 0.5 pc → « ½ ». */
/** Quantité lisible pour un ingrédient (« 120 g », « ½ », « 1 gousse »). */
export function formatQuantity(quantity: number, ingredient: Pick<Ingredient, 'unit' | 'small'>): string {
  const { unit, small } = ingredient;
  if (small && quantity < 1) {
    const count = Math.max(1, Math.round(quantity * small.per));
    return `${count} ${small.label}${count > 1 ? 's' : ''}`;
  }
  if (unit === 'g') return quantity >= 1000 ? `${decimal(quantity / 1000)} kg` : `${Math.round(quantity)} g`;
  if (unit === 'ml') return quantity >= 1000 ? `${decimal(quantity / 1000)} L` : `${Math.round(quantity)} ml`;
  if (Math.abs(quantity - 0.5) < 0.01) return '½';
  if (Math.abs(quantity - 0.25) < 0.01) return '¼';
  return decimal(quantity);
}

export function packLabel(ingredient: Ingredient): string {
  return ingredient.packLabel ?? formatQuantity(ingredient.pack, { unit: ingredient.unit });
}

/** Retire la précision entre parenthèses : « Pois chiches (boîte) » → « Pois chiches ». */
export function shortName(ingredient: Ingredient): string {
  return ingredient.name.replace(/\s*\(.*\)/, '');
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count > 1 ? pluralForm : singular}`;
}
