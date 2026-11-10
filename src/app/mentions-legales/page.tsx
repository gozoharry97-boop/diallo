import { BackLink, Page, PageHeader, layout } from '@/components/layout/Page';

export const metadata = { title: 'Mentions légales et confidentialité' };

/** E13 — Mentions légales et confidentialité (les [champs] sont à compléter avant la mise en ligne). */
export default function LegalPage() {
  return (
    <Page narrow>
      <BackLink href="/">Accueil</BackLink>
      <PageHeader title="Mentions légales et confidentialité" />

      <section id="confidentialite" className={`${layout.card} mt-5`} aria-labelledby="donnees">
        <h2 id="donnees" className={layout.sectionTitle}>Tes données, en bref</h2>
        <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.6 }}>
          <li>Tes réglages, ton placard et tes progrès restent sur ton appareil. Pas de compte, pas de mot de passe.</li>
          <li>Ton régime et tes allergies servent uniquement à choisir tes recettes. Ils ne sont ni envoyés ni vendus.</li>
          <li>Une liste partagée par lien ne contient que les articles et les cases cochées ; elle expire après 30 jours.</li>
          <li>Quand tu importes une vidéo, son lien et sa description publique sont envoyés à notre service d’analyse (Claude, d’Anthropic) pour en tirer la recette.</li>
          <li>Les vidéos se chargent seulement quand tu touches « Lire » : la plateforme (YouTube, TikTok, Instagram) peut alors déposer des cookies.</li>
          <li>Tu peux tout effacer à tout moment depuis Réglages.</li>
        </ul>
      </section>

      <section className={layout.card} style={{ marginTop: 'var(--space-4)', lineHeight: 1.6 }} aria-labelledby="editeur">
        <h2 id="editeur" className={layout.sectionTitle}>Éditeur du site</h2>
        <p>[NOM OU RAISON SOCIALE]<br />[ADRESSE]<br />[SIRET]<br />Directeur de la publication : [NOM]</p>
        <h2 className={`${layout.sectionTitle} mt-5`}>Hébergement</h2>
        <p>[HÉBERGEUR, ADRESSE]</p>
        <h2 className={`${layout.sectionTitle} mt-5`}>Prix affichés</h2>
        <p>
          Les prix viennent d’Open Prices (Open Food Facts, données ouvertes sous licence ODbL) quand ils existent, sinon d’estimations par enseigne. Ils peuvent varier de ±10 % en magasin et sont donnés à titre indicatif.
        </p>
        <h2 className={`${layout.sectionTitle} mt-5`}>Contact et droits RGPD</h2>
        <p>Pour exercer tes droits d’accès, de rectification ou d’effacement : [ADRESSE E-MAIL].</p>
      </section>
    </Page>
  );
}
