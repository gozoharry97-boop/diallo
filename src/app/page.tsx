import Link from 'next/link';
import { CUISINES, DIETS } from '@/domain/data/catalog';
import { RECIPES } from '@/domain/data/recipes';
import { Brand, Page, layout } from '@/components/layout/Page';
import { Mascot } from '@/components/Mascot';
import { ButtonLink } from '@/components/ui/Button';
import { IconBadge, type BadgeTone } from '@/components/ui/IconBadge';
import type { IconName } from '@/components/ui/Icon';
import styles from './landing.module.css';

const BENEFITS: { icon: IconName; tone: BadgeTone; title: string; text: string }[] = [
  { icon: 'piggy', tone: 'piggy', title: 'Ton budget est tenu', text: 'Le total de ta liste reste sous la somme que tu choisis. Ce que tu économises va dans ta cagnotte.' },
  { icon: 'store', tone: 'store', title: 'Tes magasins, épiceries du monde comprises', text: 'Chaque produit va dans la liste du magasin où il coûte le moins cher : supermarché, Tang Frères, épicerie africaine ou orientale.' },
  { icon: 'passport', tone: 'passport', title: 'Un voyage chaque soir', text: `Plus de ${Math.floor(RECIPES.length / 10) * 10} recettes de ${CUISINES.length} cuisines : mafé, bibimbap, tajine, colombo, dahl… Un tampon dans ton passeport à chaque découverte.` },
  { icon: 'play', tone: 'neutral', title: 'Tes recettes TikTok, Insta ou YouTube', text: 'Colle le lien d’une vidéo : Diallo en tire la recette en 4 étapes et la liste de courses chiffrée.' },
  { icon: 'leaf', tone: 'pot', title: 'Moins de restes à jeter', text: 'Diallo se souvient de ton placard et des paquets entamés, et les finit avec toi la semaine suivante.' },
];

/** E01 — Page d'accueil publique. */
export default function LandingPage() {
  return (
    <Page narrow>
      <div className={layout.topbar}>
        <Brand href="/" />
        <Link href="/semaine" className={styles.signin}>Ouvrir ma semaine</Link>
      </div>

      <section className={styles.hero}>
        <Mascot mood="fier" size={132} />
        <h1 className={styles.title}>Tes dîners de la semaine, dans ton budget.</h1>
        <p className={styles.lead}>Diallo compose 3 à 7 dîners avec les prix de tes magasins, du Lidl à Tang Frères, et te prépare la liste de courses.</p>
        <ButtonLink href="/bienvenue" variant="primary" block>Composer ma semaine</ButtonLink>
        <p className={styles.reassure}>Gratuit, sans compte, en 2 minutes</p>
      </section>

      <section aria-labelledby="benefices" className={styles.section}>
        <h2 id="benefices" className={styles.h2}>Ce que Diallo fait pour toi</h2>
        <ul role="list" className={styles.benefits}>
          {BENEFITS.map((b) => (
            <li key={b.title} className={styles.benefit}>
              <IconBadge icon={b.icon} tone={b.tone} size={40} />
              <div>
                <h3 className={styles.h3}>{b.title}</h3>
                <p className={layout.muted}>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="regimes" className={styles.section}>
        <h2 id="regimes" className={styles.h2}>Pour toutes les façons de manger</h2>
        <ul role="list" className={styles.diets}>
          {[...DIETS.map((d) => d.name), 'Sans porc', 'Sans gluten', 'Sans arachides'].map((name) => <li key={name}>{name}</li>)}
        </ul>
      </section>

      <section className={`${layout.cardDark} ${styles.section}`}>
        <h2 className={styles.h2}>Prête ou prêt pour ta première semaine ?</h2>
        <p className={styles.darkLead}>4 questions, et Diallo s’occupe du reste.</p>
        <ButtonLink href="/bienvenue" variant="light" block>Composer ma semaine</ButtonLink>
      </section>

      <footer className={styles.footer}>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/mentions-legales#confidentialite">Confidentialité</Link>
      </footer>
    </Page>
  );
}
