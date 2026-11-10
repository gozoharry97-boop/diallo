import { AISLES, STORES_BY_ID } from '@/domain/data/catalog';
import { eur, formatQuantity, packLabel } from '@/domain/format';
import type { PlanLine } from '@/domain/planner';
import type { Profile } from '@/domain/types';

export interface StoreGroup {
  storeId: string;
  name: string;
  subtotal: number;
  aisles: { id: string; name: string; lines: PlanLine[] }[];
}

/** Lignes à acheter regroupées par magasin (principal d'abord), puis par rayon. */
export function groupByStore(lines: PlanLine[], profile: Pick<Profile, 'store' | 'extras'>): StoreGroup[] {
  const order = [profile.store, ...profile.extras];
  return order
    .map((storeId) => {
      const storeLines = lines.filter((l) => l.packs > 0 && l.storeId === storeId);
      return {
        storeId,
        name: STORES_BY_ID[storeId]?.name ?? storeId,
        subtotal: storeLines.reduce((sum, l) => sum + l.cost, 0),
        aisles: AISLES.map((a) => ({ id: a.id, name: a.name, lines: storeLines.filter((l) => l.ingredient.aisle === a.id) })).filter((a) => a.lines.length),
      };
    })
    .filter((g) => g.aisles.length);
}

export function lineDetail(line: PlanLine): string {
  const fromPantry = typeof line.have === 'number' ? `, dont ${formatQuantity(Math.min(line.have, line.need), line.ingredient)} au placard` : '';
  return `${line.packs} × ${packLabel(line.ingredient)} (besoin : ${formatQuantity(line.need, line.ingredient)}${fromPantry})`;
}

/** Contenu d'une liste partagée : texte déjà mis en forme, sans donnée personnelle. */
export function sharePayload(groups: StoreGroup[], title: string) {
  return {
    title,
    stores: groups.map((g) => ({
      name: g.name,
      items: g.aisles.flatMap((a) => a.lines.map((l) => ({ key: l.key, label: l.ingredient.name, detail: lineDetail(l), price: eur(l.cost) }))),
    })),
  };
}

export type SharePayload = ReturnType<typeof sharePayload>;

/** Lien instantané (sans serveur) : la liste est encodée dans l'ancre de l'URL. */
export function encodeSnapshot(payload: SharePayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeSnapshot(encoded: string): SharePayload | null {
  try {
    const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as SharePayload;
  } catch {
    return null;
  }
}
