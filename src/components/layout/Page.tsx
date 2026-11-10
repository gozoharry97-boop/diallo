import Link from 'next/link';
import { Icon } from '../ui/Icon';
import styles from './layout.module.css';

export { styles as layout };

/** Contenu principal d'une page, cible du lien « Aller au contenu ». */
export function Page({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <main id="contenu" className={styles.page} style={narrow ? { maxWidth: '36rem' } : undefined}>
      {children}
    </main>
  );
}

export function Brand({ href = '/semaine' }: { href?: string }) {
  return (
    <Link href={href} className={styles.brand}>
      <span className={styles.brandMark} aria-hidden="true" />
      Diallo
    </Link>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={styles.back}>
      <Icon name="back" size={22} strokeWidth={2} />
      {children}
    </Link>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className={styles.header}>
      {subtitle && <p className={styles.headerSub}>{subtitle}</p>}
      <h1 className={styles.title}>{title}</h1>
      {children}
    </header>
  );
}

export function Section({ title, id, action, children }: { title: string; id: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.between}>
        <h2 id={id} className={styles.sectionTitle}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Loading() {
  return <p className={styles.loading} role="status">Chargement…</p>;
}
