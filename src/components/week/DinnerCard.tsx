import Link from 'next/link';
import { CUISINES_BY_ID, DAYS } from '@/domain/data/catalog';
import { eur } from '@/domain/format';
import type { Recipe } from '@/domain/types';
import { Icon } from '../ui/Icon';
import { DishArt } from './DishArt';
import styles from './week.module.css';

export function CuisineBadge({ cuisine, size = 46 }: { cuisine: Recipe['cuisine']; size?: number }) {
  const c = CUISINES_BY_ID[cuisine];
  return (
    <span className={styles.cuisine} style={{ background: c.tint, width: size, height: size }} aria-hidden="true">
      {c.short}
    </span>
  );
}

interface Props {
  recipe: Recipe;
  day: number;
  perPerson: number;
  cooked: boolean;
  newStamp: boolean;
  selected: boolean;
  onToggleCooked: () => void;
  onSwap: () => void;
}

/** Carte d'un dîner : toute la carte ouvre la recette ; le rond coche « cuisiné » ; le jour choisi montre ses actions. */
export function DinnerCard({ recipe, day, perPerson, cooked, newStamp, selected, onToggleCooked, onSwap }: Props) {
  const cuisine = CUISINES_BY_ID[recipe.cuisine];
  return (
    <li>
      <article className={`${styles.dinner} ${selected ? styles.dinnerSelected : ''}`} aria-labelledby={`diner-${day}`}>
        <div className={styles.dinnerTop}>
          <DishArt recipe={recipe} />
          <div className="grow">
            <p className={styles.day}>{DAYS[day]} · {cuisine.name}</p>
            <h3 id={`diner-${day}`} className={styles.dinnerName}>
              <Link href={`/recette?jour=${day}`} className={styles.stretch}>{recipe.name}</Link>
            </h3>
            <p className={styles.meta}>
              <span className={styles.metaTime}><Icon name="clock" size={14} />{recipe.minutes} min</span>
              <span>{eur(perPerson)} la part</span>
              {recipe.spicy && <span>Pimenté</span>}
              {recipe.source && <span>Vidéo</span>}
              {newStamp && <span className={styles.stamp}>Nouveau tampon</span>}
            </p>
          </div>
          <button
            type="button"
            className={`${styles.cookToggle} ${styles.lift}`}
            aria-pressed={cooked}
            aria-label={cooked ? `${recipe.name} : cuisiné` : `Je l’ai cuisiné : ${recipe.name}`}
            onClick={onToggleCooked}
          >
            {cooked && <Icon name="check" size={20} strokeWidth={2.6} />}
          </button>
        </div>
        {selected && (
          <div className={`${styles.actions} ${styles.lift}`}>
            <button type="button" className={styles.actionMain} aria-pressed={cooked} onClick={onToggleCooked}>
              {cooked ? 'Cuisiné, bravo !' : 'Je l’ai cuisiné'}
            </button>
            <button type="button" className={styles.actionIcon} aria-label={`Changer le dîner de ${DAYS[day].toLowerCase()}`} onClick={onSwap}>
              <Icon name="swap" />
            </button>
          </div>
        )}
      </article>
    </li>
  );
}
