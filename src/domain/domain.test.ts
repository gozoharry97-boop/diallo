import { describe, expect, it } from 'vitest';
import { INGREDIENTS } from './data/ingredients';
import { RECIPES, RECIPES_BY_ID } from './data/recipes';
import { STORES_BY_ID } from './data/catalog';
import { fitsDiet, hasMeat, isCompatible, weekRespectsDiet } from './diet';
import { budgetStreak, piggyBank, zeroWasteChallenge } from './game';
import { pantryAfterWeek } from './pantry';
import { candidates, generateWeek, planCost, swapOptions } from './planner';
import { bestPrices, referencePrice, storeCarries } from './pricing';
import type { Profile, WeekRecord } from './types';

const profile: Profile = {
  store: 'lidl', extras: ['tang'], people: 1, dinners: 5, budget: 25,
  diet: 'omni', exclusions: [], cuisines: [], maxMinutes: 999,
};
const seeded = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

describe('catalogue', () => {
  it('chaque ingrédient de recette existe et chaque recette a des étapes', () => {
    for (const recipe of RECIPES) {
      expect(recipe.steps.length).toBeGreaterThan(0);
      for (const key of Object.keys(recipe.ingredients)) expect(INGREDIENTS).toHaveProperty(key);
    }
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });
});

describe('régimes', () => {
  it('végan exclut tout produit animal, carnivore n’accepte que des produits animaux', () => {
    const vegan = candidates({ ...profile, diet: 'vegan' });
    expect(vegan.length).toBeGreaterThan(5);
    for (const r of vegan) expect(Object.keys(r.ingredients).every((k) => !INGREDIENTS[k as keyof typeof INGREDIENTS].animal)).toBe(true);
    for (const r of candidates({ ...profile, diet: 'carni' })) {
      expect(Object.keys(r.ingredients).every((k) => INGREDIENTS[k as keyof typeof INGREDIENTS].animal)).toBe(true);
    }
  });

  it('les exclusions porc et piment fonctionnent', () => {
    expect(fitsDiet(RECIPES_BY_ID.carbo, { diet: 'omni', exclusions: ['porc'] })).toBe(false);
    expect(fitsDiet(RECIPES_BY_ID.chili, { diet: 'omni', exclusions: ['epice'] })).toBe(false);
    expect(fitsDiet(RECIPES_BY_ID.dahl, { diet: 'omni', exclusions: ['porc', 'epice'] })).toBe(true);
  });

  it('flexitarien : 2 soirs de viande au plus', () => {
    const meat = RECIPES.filter(hasMeat).slice(0, 3);
    expect(weekRespectsDiet(meat, { diet: 'flexi' })).toBe(false);
    expect(weekRespectsDiet(meat.slice(0, 2), { diet: 'flexi' })).toBe(true);
  });

  it('les cuisines choisies filtrent les recettes', () => {
    expect(candidates({ ...profile, cuisines: ['ac'] }).every((r) => r.cuisine === 'ac')).toBe(true);
    expect(isCompatible(RECIPES_BY_ID.goulash, { ...profile, maxMinutes: 30 })).toBe(false);
  });
});

describe('prix', () => {
  it('une épicerie ne vend que ses rayons et catégories', () => {
    expect(storeCarries(STORES_BY_ID.tang, INGREDIENTS.soja)).toBe(true);
    expect(storeCarries(STORES_BY_ID.halal, INGREDIENTS.lardons)).toBe(false);
    expect(storeCarries(STORES_BY_ID.marche, INGREDIENTS.riz)).toBe(false);
  });

  it('chaque produit va au magasin le moins cher, et une observation remplace la référence', () => {
    const prices = bestPrices(profile);
    expect(prices.soja?.storeId).toBe('tang');
    expect(prices.creme?.storeId).toBe('lidl');
    const observed = bestPrices(profile, { lidl: { soja: { price: 0.5, source: 'open-prices', observedAt: '2026-10-01' } } });
    expect(observed.soja).toMatchObject({ storeId: 'lidl', price: 0.5, source: 'open-prices' });
    expect(referencePrice(STORES_BY_ID.lidl, INGREDIENTS.riz)).toBeCloseTo(1.45, 2);
  });
});

describe('planificateur', () => {
  const prices = bestPrices(profile);

  it('compose une semaine sous le budget quand c’est possible', () => {
    const week = generateWeek({ profile, pantry: {}, prices, random: seeded(7) });
    expect(week).toHaveLength(5);
    expect(new Set(week.map((r) => r.id)).size).toBe(5);
    expect(planCost(week, 1, {}, prices).total).toBeLessThanOrEqual(25);
  });

  it('achète des paquets entiers et déduit le placard', () => {
    const week = [RECIPES_BY_ID.dahl];
    const empty = planCost(week, 2, {}, prices);
    const lentils = empty.lines.find((l) => l.key === 'lentillesC');
    expect(lentils).toMatchObject({ need: 160, packs: 1 });
    const withPantry = planCost(week, 2, { lentillesC: 500, riz: true }, prices);
    expect(withPantry.total).toBeLessThan(empty.total);
    expect(withPantry.pantrySaved).toBeGreaterThan(0);
  });

  it('propose des remplaçants triés et signale ceux qui sont hors budget', () => {
    const week = generateWeek({ profile, pantry: {}, prices, random: seeded(3) });
    const options = swapOptions(week, 0, profile, {}, prices);
    expect(options.length).toBeGreaterThan(10);
    expect(options[0].total).toBeLessThanOrEqual(options.at(-1)!.total);
    expect(options.every((o) => !week.some((r) => r.id === o.recipe.id))).toBe(true);
  });
});

describe('placard et jeu', () => {
  it('les restes qui se conservent passent au placard, pas les produits frais', () => {
    const prices = bestPrices(profile);
    const { lines } = planCost([RECIPES_BY_ID.dahl, RECIPES_BY_ID.shakshuka ?? RECIPES_BY_ID.chakchouka], 1, {}, prices);
    const pantry = pantryAfterWeek(lines, {});
    expect(pantry.lentillesC).toBe(420);
    expect(pantry.oeufs).toBeUndefined();
  });

  it('série, cagnotte et défi', () => {
    const history: WeekRecord[] = [
      { weekStart: '2026-10-19', budget: 25, total: 30, pantrySaved: 0, dinners: 5, cooked: 5, cuisinesCooked: [], challengeDone: false },
      { weekStart: '2026-10-26', budget: 25, total: 20, pantrySaved: 1, dinners: 5, cooked: 5, cuisinesCooked: ['in'], challengeDone: true },
      { weekStart: '2026-11-02', budget: 25, total: 24, pantrySaved: 0.5, dinners: 5, cooked: 4, cuisinesCooked: ['ao'], challengeDone: false },
    ];
    expect(budgetStreak(history)).toBe(2);
    expect(piggyBank(history)).toBeCloseTo(7.5, 2);
    const prices = bestPrices(profile);
    const week = [RECIPES_BY_ID.dahl, RECIPES_BY_ID.currycoco, RECIPES_BY_ID.chilisin];
    const challenge = zeroWasteChallenge(week, planCost(week, 1, {}, prices).lines, {});
    expect(challenge?.days.length).toBeGreaterThanOrEqual(2);
  });
});
