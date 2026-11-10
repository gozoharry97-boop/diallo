'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import styles from './recipe.module.css';

const noopSubscribe = () => () => {};

/** Garde l'écran allumé pendant la cuisine (API Screen Wake Lock, si le navigateur la propose). */
export function WakeLockSwitch() {
  const supported = useSyncExternalStore(noopSubscribe, () => 'wakeLock' in navigator, () => false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on || !supported) return;
    let lock: WakeLockSentinel | null = null;
    const acquire = () => navigator.wakeLock.request('screen').then((l) => (lock = l)).catch(() => setOn(false));
    acquire();
    // Le verrou est relâché quand l'onglet passe en arrière-plan : on le reprend au retour.
    const onVisible = () => document.visibilityState === 'visible' && acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      lock?.release().catch(() => {});
    };
  }, [on, supported]);

  if (!supported) return null;
  return (
    <label className={styles.switch}>
      Écran allumé
      <span className={styles.switchControl}>
        <input type="checkbox" role="switch" checked={on} onChange={() => setOn((v) => !v)} />
        <span className={styles.switchTrack} aria-hidden="true" />
      </span>
    </label>
  );
}
