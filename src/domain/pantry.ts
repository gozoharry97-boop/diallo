import type { PlanLine } from './planner';
import type { Pantry } from './types';

/** Part minimale d'un paquet pour qu'un reste soit gardé au placard. */
const MIN_LEFTOVER_SHARE = 0.2;

/**
 * Fin de semaine : les restes qui se conservent passent au placard,
 * les produits frais entamés et les paquets terminés en sortent.
 */
export function pantryAfterWeek(lines: PlanLine[], pantry: Pantry): Pantry {
  const next: Pantry = { ...pantry };
  for (const line of lines) {
    if (line.have === true) continue;
    if (line.ingredient.keeps && line.leftover >= MIN_LEFTOVER_SHARE * line.ingredient.pack) {
      next[line.key] = Math.round(line.leftover * 10) / 10;
    } else {
      delete next[line.key];
    }
  }
  return next;
}
