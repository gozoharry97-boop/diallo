'use client';

import { useMemo } from 'react';
import { RECIPES_BY_ID } from '@/domain/data/recipes';
import { zeroWasteChallenge, type Challenge } from '@/domain/game';
import { dinnerValue, generateWeek, planCost, type PlanCost } from '@/domain/planner';
import type { BestPrices, Pantry, Profile, Recipe } from '@/domain/types';
import { useAppState, type AppState } from './store';
import { usePrices } from './usePrices';

export function resolveRecipe(state: Pick<AppState, 'customRecipes'>, id: string): Recipe | undefined {
  return state.customRecipes[id] ?? RECIPES_BY_ID[id];
}

/** Identifiants d'une nouvelle semaine composée sous le budget. */
export function composeWeek(profile: Profile, pantry: Pantry, prices: BestPrices): string[] {
  return generateWeek({ profile, pantry, prices }).map((r) => r.id);
}

export interface WeekView {
  week: Recipe[];
  cost: PlanCost;
  /** Coût réellement utilisé par chaque dîner (jour → €). */
  dinnerValues: number[];
  /** Paquets entamés : différence entre le total et la somme des dîners. */
  openedPacks: number;
  overBudget: boolean;
  margin: number;
  challenge: Challenge | null;
  challengeDone: number;
  cookedCount: number;
}

/** Vue calculée de la semaine en cours : plan, coût, défi, avancement. */
export function useWeek() {
  const store = useAppState();
  const { state } = store;
  const { prices, live } = usePrices(state.profile);

  const view = useMemo<WeekView | null>(() => {
    const profile = state.profile;
    if (!profile) return null;
    const week = state.plan.map((id) => resolveRecipe(state, id)).filter((r): r is Recipe => Boolean(r));
    const listOnly = state.listOnlyRecipes.map((id) => resolveRecipe(state, id)).filter((r): r is Recipe => Boolean(r));
    const cost = planCost([...week, ...listOnly], profile.people, state.pantry, prices);
    const dinnerValues = week.map((r) => dinnerValue(r, profile.people, prices));
    const used = dinnerValues.reduce((a, b) => a + b, 0) + listOnly.reduce((a, r) => a + dinnerValue(r, profile.people, prices), 0);
    const challenge = zeroWasteChallenge(week, cost.lines, state.pantry);
    return {
      week,
      cost,
      dinnerValues,
      openedPacks: Math.max(0, Math.round((cost.total + cost.pantrySaved - used) * 100) / 100),
      overBudget: cost.total > profile.budget,
      margin: Math.round((profile.budget - cost.total) * 100) / 100,
      challenge,
      challengeDone: challenge ? challenge.days.filter((d) => state.cooked[d]).length : 0,
      cookedCount: week.filter((_, i) => state.cooked[i]).length,
    };
  }, [state, prices]);

  return { ...store, prices, livePrices: live, view };
}
