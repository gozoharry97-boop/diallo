import { DAYS } from '@/domain/data/catalog';
import styles from './week.module.css';

interface Props {
  weekStart: string;
  dinners: number;
  cooked: Record<number, boolean>;
  selected: number;
  onSelect: (day: number) => void;
}

/** Bande des 7 jours : jour choisi en sombre, point plein = dîner cuisiné, point vide = prévu. */
export function DayStrip({ weekStart, dinners, cooked, selected, onSelect }: Props) {
  const monday = new Date(`${weekStart}T12:00:00`);
  return (
    <div role="group" aria-label="Choisir un jour" className={styles.days}>
      {DAYS.map((name, day) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + day);
        const planned = day < dinners;
        const done = planned && Boolean(cooked[day]);
        const status = planned ? (done ? 'dîner cuisiné' : 'dîner prévu') : 'pas de dîner prévu';
        return (
          <button
            key={name}
            type="button"
            className={styles.dayButton}
            aria-pressed={day === selected}
            aria-label={`${name} ${date.getDate()}, ${status}`}
            disabled={!planned}
            onClick={() => onSelect(day)}
          >
            <span className={styles.dayShort}>{name.slice(0, 3).toUpperCase()}</span>
            <span className={planned ? styles.dayNum : styles.dayFree}>{planned ? date.getDate() : 'libre'}</span>
            <span className={styles.dayDot} data-state={planned ? (done ? 'done' : 'planned') : 'none'} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
