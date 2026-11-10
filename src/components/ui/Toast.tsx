'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styles from './ui.module.css';

interface ToastOptions {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Durée d'affichage (10 s par défaut avec une action, pour laisser le temps d'annuler). */
  durationMs?: number;
}

const ToastContext = createContext<(options: ToastOptions) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((options: ToastOptions) => {
    clearTimeout(timer.current);
    setToast(options);
    timer.current = setTimeout(() => setToast(null), options.durationMs ?? (options.onAction ? 10000 : 4000));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div role="status" aria-live="polite">
        {toast && (
          <div className={styles.toast}>
            <span>{toast.message}</span>
            {toast.onAction && (
              <button
                type="button"
                className={styles.toastAction}
                onClick={() => {
                  toast.onAction?.();
                  setToast(null);
                }}
              >
                {toast.actionLabel ?? 'Annuler'}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
