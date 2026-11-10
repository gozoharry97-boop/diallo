import Link from 'next/link';
import styles from './ui.module.css';

type Variant = 'primary' | 'dark' | 'outline' | 'soft' | 'light' | 'success' | 'link';

interface Common {
  variant?: Variant;
  block?: boolean;
  danger?: boolean;
  className?: string;
  children: React.ReactNode;
}

const classes = ({ variant = 'soft', block, danger, className }: Omit<Common, 'children'>) =>
  [styles.button, styles[variant], block && styles.block, danger && styles.danger, className].filter(Boolean).join(' ');

/** Bouton d'action. */
export function Button({ variant, block, danger, className, children, type = 'button', ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, block, danger, className })} {...rest}>
      {children}
    </button>
  );
}

/** Lien de navigation qui a l'apparence d'un bouton. */
export function ButtonLink({ href, variant, block, danger, className, children, ...rest }: Common & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const external = /^https?:/.test(href);
  if (external) {
    return (
      <a href={href} className={classes({ variant, block, danger, className })} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes({ variant, block, danger, className })} {...rest}>
      {children}
    </Link>
  );
}
