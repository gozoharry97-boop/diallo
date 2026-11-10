'use client';

import { useId } from 'react';
import styles from './ui.module.css';

export interface Choice<T extends string | number> {
  value: T;
  label: string;
  detail?: string;
}

interface BaseProps<T extends string | number> {
  legend: string;
  hint?: string;
  options: readonly Choice<T>[];
  layout?: 'chips' | 'cards';
  hideLegend?: boolean;
}

/** Choix unique : boutons radio natifs présentés en puces (flèches du clavier incluses). */
export function RadioChips<T extends string | number>({ legend, hint, options, value, onChange, layout = 'chips', hideLegend }: BaseProps<T> & { value: T; onChange: (value: T) => void }) {
  const name = useId();
  return (
    <fieldset className={styles.fieldset}>
      <legend className={hideLegend ? 'visually-hidden' : styles.legend}>{legend}</legend>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={layout === 'cards' ? styles.cards : styles.chips}>
        {options.map((o) => (
          <label key={String(o.value)} className={styles.chip}>
            <input type="radio" name={name} checked={o.value === value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
            {o.detail && <span className={styles.chipDetail}>{o.detail}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Choix multiple : cases à cocher natives présentées en puces. */
export function CheckChips<T extends string | number>({ legend, hint, options, values, onToggle, layout = 'chips', hideLegend }: BaseProps<T> & { values: readonly T[]; onToggle: (value: T) => void }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={hideLegend ? 'visually-hidden' : styles.legend}>{legend}</legend>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={layout === 'cards' ? styles.cards : styles.chips}>
        {options.map((o) => (
          <label key={String(o.value)} className={styles.chip}>
            <input type="checkbox" checked={values.includes(o.value)} onChange={() => onToggle(o.value)} />
            <span>{o.label}</span>
            {o.detail && <span className={styles.chipDetail}>{o.detail}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
