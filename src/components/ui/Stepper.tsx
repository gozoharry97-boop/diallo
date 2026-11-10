'use client';

import { useId } from 'react';
import styles from './ui.module.css';

/** Compteur − / + avec bornes. La valeur est annoncée à chaque changement. */
export function Stepper({ label, value, min, max, onChange, unitLabel }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; unitLabel: [string, string] }) {
  const id = useId();
  return (
    <div className={styles.stepper} role="group" aria-labelledby={id}>
      <span id={id}>{label}</span>
      <span className={styles.stepperControls}>
        <button type="button" className={styles.stepperButton} aria-label={`${unitLabel[0]} de moins`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          −
        </button>
        <output className={styles.stepperValue} aria-live="polite">{value}</output>
        <button type="button" className={styles.stepperButton} aria-label={`${unitLabel[0]} de plus`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          +
        </button>
      </span>
    </div>
  );
}
