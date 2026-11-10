import { CUISINES_BY_ID, DAYS } from '@/domain/data/catalog';
import { eur } from '@/domain/format';
import type { Recipe } from '@/domain/types';
import { Button, ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
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
  onToggleCooked: () => void;
  onSwap: () => void;
}

export function DinnerCard({ recipe, day, perPerson, cooked, newStamp, onToggleCooked, onSwap }: Props) {
  const cuisine = CUISINES_BY_ID[recipe.cuisine];
  return (
    <li className={`${styles.dinner} ${cooked ? styles.dinnerDone : ''}`}>
      <article aria-labelledby={`diner-${day}`}>
        <div className={styles.dinnerTop}>
          <CuisineBadge cuisine={recipe.cuisine} />
          <div>
            <p className={styles.day}>
              {DAYS[day]}
              {newStamp && <span className={styles.stamp}>Nouveau tampon</span>}
            </p>
            <h3 id={`diner-${day}`} className={styles.dinnerName}>{recipe.name}</h3>
            <p className={styles.meta}>
              {cuisine.name}, {recipe.minutes} min, {eur(perPerson)} la part{recipe.spicy ? ', pimenté' : ''}
              {recipe.source ? ', recette vidéo' : ''}
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant={cooked ? 'success' : 'soft'} aria-pressed={cooked} onClick={onToggleCooked}>
            {cooked && <Icon name="check" size={16} strokeWidth={2.6} />}
            {cooked ? 'Cuisiné' : 'Je l’ai cuisiné'}
          </Button>
          <ButtonLink href={`/recette?jour=${day}`} variant="soft">Recette</ButtonLink>
          <Button variant="soft" onClick={onSwap}>Changer</Button>
        </div>
      </article>
    </li>
  );
}
