import { Icon } from '../ui/Icon';
import styles from './courses.module.css';

/** Ligne de liste : case « dans le caddie » (bouton à état), détail et prix. */
export function ShoppingItem({ name, detail, price, done, onToggle, onOwned }: { name: string; detail: string; price: string; done: boolean; onToggle: () => void; onOwned?: () => void }) {
  return (
    <li className={`${styles.item} ${done ? styles.done : ''}`}>
      <button type="button" className={styles.check} aria-pressed={done} aria-label={`Dans le caddie : ${name}`} onClick={onToggle}>
        <span className={styles.box} aria-hidden="true">
          {done && <Icon name="check" size={16} strokeWidth={3} />}
        </span>
      </button>
      <div className={styles.itemBody}>
        <p className={styles.itemName}>{name}</p>
        <p className={styles.itemDetail}>{detail}</p>
        {onOwned && !done && (
          <button type="button" className={styles.owned} onClick={onOwned}>
            Je l’ai déjà<span className="visually-hidden"> : {name}</span>
          </button>
        )}
      </div>
      <span className={styles.price}>{price}</span>
    </li>
  );
}
