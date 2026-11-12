import { CUISINES_BY_ID } from '@/domain/data/catalog';
import type { Recipe } from '@/domain/types';
import styles from './week.module.css';

/** Couleurs « plat + garniture » : une paire par recette, stable d'une visite à l'autre. */
const PLATES: [food: string, garnish: string][] = [
  ['#e9a23b', '#5e8c3a'],
  ['#d9532b', '#7a4a2a'],
  ['#f1e6d2', '#e36a3a'],
  ['#c8452a', '#f7d35a'],
  ['#f3e3b5', '#3f7a3a'],
  ['#b5651d', '#f1e6d2'],
  ['#7a9a3a', '#f5b847'],
];

function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** Vignette illustrée d'un plat : une assiette vue du dessus sur la couleur de sa cuisine. */
/** `bare` : sans fond, pour la poser sur un visuel déjà coloré. */
export function DishArt({ recipe, size = 72, bare = false }: { recipe: Pick<Recipe, 'id' | 'cuisine'>; size?: number; bare?: boolean }) {
  const [food, garnish] = PLATES[hash(recipe.id) % PLATES.length];
  return (
    <span className={styles.dishArt} style={{ width: size, height: size, background: bare ? undefined : CUISINES_BY_ID[recipe.cuisine].tint }} aria-hidden="true">
      <svg width={bare ? size : size * 0.8} height={bare ? size : size * 0.8} viewBox="0 0 74 74">
        <circle cx="37" cy="39" r="33" fill="#000" opacity="0.06" />
        <circle cx="37" cy="37" r="33" fill="#fff" />
        <circle cx="37" cy="37" r="24" fill={food} />
        <circle cx="29" cy="31" r="5" fill={garnish} />
        <circle cx="45" cy="34" r="4" fill={garnish} />
        <circle cx="36" cy="46" r="4.5" fill={garnish} />
      </svg>
    </span>
  );
}
