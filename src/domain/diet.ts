import { INGREDIENTS, type IngredientKey } from './data/ingredients';
import type { Ingredient, Profile, Recipe } from './types';

const ingredientsOf = (recipe: Recipe): Ingredient[] =>
  (Object.keys(recipe.ingredients) as IngredientKey[]).map((key) => INGREDIENTS[key]);

export const hasMeat = (recipe: Recipe) => ingredientsOf(recipe).some((i) => i.animal === 'viande');

/** Le régime et les exclusions de l'utilisateur autorisent-ils cette recette ? */
export function fitsDiet(recipe: Recipe, profile: Pick<Profile, 'diet' | 'exclusions'>): boolean {
  const items = ingredientsOf(recipe);
  const animals = items.map((i) => i.animal);
  const fish = animals.includes('poisson') || animals.includes('mer');
  const meat = animals.includes('viande');

  switch (profile.diet) {
    case 'pesco':
      if (meat) return false;
      break;
    case 'vege':
      if (meat || fish) return false;
      break;
    case 'vegan':
      if (animals.some(Boolean)) return false;
      break;
    case 'keto':
      if (items.some((i) => i.starchy)) return false;
      break;
    case 'carni':
      if (!animals.every(Boolean)) return false;
      break;
    default:
      break;
  }

  const excluded = new Set(profile.exclusions);
  if (excluded.has('porc') && items.some((i) => i.pork)) return false;
  if (excluded.has('epice') && recipe.spicy) return false;
  return !items.some((i) => i.allergens?.some((a) => excluded.has(a)));
}

/** Recette compatible avec tout le profil : régime, cuisines choisies et temps. */
export function isCompatible(recipe: Recipe, profile: Profile): boolean {
  if (!fitsDiet(recipe, profile)) return false;
  if (profile.cuisines.length > 0 && !profile.cuisines.includes(recipe.cuisine)) return false;
  return recipe.minutes <= profile.maxMinutes;
}

/** Contraintes qui portent sur la semaine entière (flexitarien : 2 soirs de viande au plus). */
export function weekRespectsDiet(recipes: Recipe[], profile: Pick<Profile, 'diet'>): boolean {
  return profile.diet !== 'flexi' || recipes.filter(hasMeat).length <= 2;
}
