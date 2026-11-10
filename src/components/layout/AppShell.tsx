'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppState } from '@/state/store';
import { Icon, type IconName } from '../ui/Icon';
import { Brand, Loading } from './Page';
import styles from './layout.module.css';

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: '/semaine', label: 'Ma semaine', icon: 'calendar' },
  { href: '/courses', label: 'Courses', icon: 'cart' },
  { href: '/placard', label: 'Placard', icon: 'pantry' },
  { href: '/reglages', label: 'Réglages', icon: 'settings' },
];

/** Cadre de l'application : navigation (barre basse sur mobile, latérale sur ordinateur). */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated } = useAppState();
  const ready = hydrated && state.profile;

  useEffect(() => {
    if (hydrated && !state.profile) router.replace('/bienvenue');
  }, [hydrated, state.profile, router]);

  return (
    <div className={styles.shell}>
      <nav className={styles.nav} aria-label="Navigation principale">
        <span className={styles.navBrand}>
          <Brand />
        </span>
        <ul className={styles.navList}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink} aria-current={pathname.startsWith(link.href) ? 'page' : undefined}>
                <Icon name={link.icon} size={24} />
                <span>{link.label}</span>
                <span className={styles.navMark} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.navFooter}>
          <Link href="/mentions-legales">Mentions légales</Link>
        </p>
      </nav>
      <div className={styles.main}>{ready ? children : <Loading />}</div>
    </div>
  );
}
