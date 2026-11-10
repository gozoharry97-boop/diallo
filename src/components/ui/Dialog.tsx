'use client';

import { useEffect, useId, useRef } from 'react';
import { Icon } from './Icon';
import styles from './ui.module.css';

/**
 * Dialogue natif (<dialog> modal) : focus piégé, Échap pour fermer,
 * focus rendu à l'élément d'origine à la fermeture.
 */
export function Dialog({ open, onClose, title, subtitle, children }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <>
          <div className={styles.dialogHandle} aria-hidden="true" />
          <div className={styles.dialogHeader}>
            <div>
              {subtitle && <p className={styles.dialogSubtitle}>{subtitle}</p>}
              <h2 id={titleId} className={styles.dialogTitle}>{title}</h2>
            </div>
            <button type="button" className={styles.iconButton} aria-label="Fermer" onClick={onClose}>
              <Icon name="close" />
            </button>
          </div>
          {children}
        </>
      )}
    </dialog>
  );
}
