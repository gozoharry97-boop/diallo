import type { IngredientKey } from './data/ingredients';
import type { PlanLine } from './planner';
import type { CuisineId, Pantry, Recipe, WeekRecord } from './types';

/** Semaines consécutives sous le budget, en partant de la plus récente. */
export function budgetStreak(history: WeekRecord[]): number {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].total > history[i].budget) break;
    streak++;
  }
  return streak;
}

export function bestStreak(history: WeekRecord[]): number {
  let best = 0;
  let current = 0;
  for (const week of history) {
    current = week.total <= week.budget ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
}

/** Économie d'une semaine : marge sous le budget + produits pris au placard. */
export function weekSavings(week: Pick<WeekRecord, 'budget' | 'total' | 'pantrySaved'>): number {
  return Math.round((Math.max(0, week.budget - week.total) + week.pantrySaved) * 100) / 100;
}

export function piggyBank(history: WeekRecord[]): number {
  return Math.round(history.reduce((sum, week) => sum + weekSavings(week), 0) * 100) / 100;
}

export function passportStamps(history: WeekRecord[], cookedThisWeek: CuisineId[] = []): Set<CuisineId> {
  return new Set([...history.flatMap((w) => w.cuisinesCooked), ...cookedThisWeek]);
}

export interface Challenge {
  key: IngredientKey;
  /** Indices des dîners qui utilisent ce produit. */
  days: number[];
}

/**
 * Défi zéro gaspi : finir un paquet entamé. On choisit le produit du placard,
 * ou à défaut le paquet acheté, qui sert dans le plus de dîners.
 */
export function zeroWasteChallenge(week: Recipe[], lines: PlanLine[], pantry: Pantry): Challenge | null {
  const daysUsing = (key: IngredientKey) =>
    week.flatMap((recipe, day) => (recipe.ingredients[key] !== undefined ? [day] : []));
  const candidatesList = lines
    .filter((line) => line.have !== true && (typeof pantry[line.key] === 'number' || line.packs > 0))
    .map((line) => ({ key: line.key, days: daysUsing(line.key), fromPantry: typeof pantry[line.key] === 'number' }))
    .filter((c) => c.days.length >= 2 || (c.fromPantry && c.days.length >= 1))
    .sort((a, b) => Number(b.fromPantry) - Number(a.fromPantry) || b.days.length - a.days.length);
  const pick = candidatesList[0];
  return pick ? { key: pick.key, days: pick.days } : null;
}

export type Mood = 'content' | 'fier' | 'inquiet' | 'concentre';
