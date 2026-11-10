# Contrôle qualité — Diallo (étape 6, 10/11/2026)

Périmètre : 14 écrans du canvas « Diallo — Ma semaine » (E01 à E13, E19, E20, E21, E06 ordinateur).
Méthode : revue UI selon 7 axes (hiérarchie, cohérence, affordance, densité, accessibilité, conventions, feedback), audit WCAG 2.2 AA sur le code des maquettes (contrastes calculés pour toutes les paires de couleurs, structure, formulaires, états, médias) et test des parcours de `journeys.md`.
Limite : les corrections sont faites sur le canvas, pas dans Figma (outils de dessin du connecteur indisponibles). Pas de test au lecteur d'écran réel : à faire sur le code (étape 7).

Règle de blocage : critère WCAG 2.2 AA non respecté, ou problème qui empêche de terminer un parcours.

## 1. Points bloquants corrigés

| # | Écran | Problème | Critère | Correction faite |
|---|---|---|---|---|
| B1 | E09 Courses | Articles cochés affichés à 55 % d'opacité : contraste 3,9:1 (nom, prix) et 2,5:1 (détail). | 1.4.3 Contraste (AA) | Opacité supprimée ; article coché = texte #555A72 barré (6,8:1). |
| B2 | E08 Fiche recette | Interrupteur « Écran allumé » éteint en #C5C8D6 : 1,7:1. Case réelle invisible, donc aucun focus visible au clavier. | 1.4.11 Contraste non textuel (AA), 2.4.7 Focus visible (AA) | État éteint en #6E7186 (4,8:1) ; contour de focus 3 px bleu sur l'interrupteur et sur tous les éléments de l'écran. |
| B3 | E06 Ma semaine (mobile et ordinateur) | Avancement du défi zéro gaspi donné seulement par 2 segments, dont un à 1,6:1 sur fond sombre. | 1.4.11 (AA), 1.4.1 Utilisation de la couleur (A) | Texte visible « 1 dîner sur 2 » ajouté ; segment vide éclairci ; segments masqués aux lecteurs d'écran. |
| B4 | E20 Importer | Étapes « à venir » signalées seulement par une pastille à 1,7:1, sans texte. | 1.4.11 (AA), 1.4.1 (A) | Libellé « À venir » ajouté, bordure de pastille à 4,8:1. |
| B5 | E20 Importer | Aucun message si le lien n'est pas TikTok, Instagram ou YouTube. | 3.3.1 Identification des erreurs (A) | Message d'erreur sous le champ (annoncé aux lecteurs d'écran), champ en rouge et marqué invalide, l'erreur disparaît dès qu'on corrige. |
| B6 | E20, E10, E09a | Bordures des champs de saisie à 1,3:1 : on ne voit pas où taper. | 1.4.11 (AA) | Bordures en #6E7186 (4,8:1). |
| B7 | E08 Fiche recette | Vidéos tierces : aucune indication de sous-titres. | 1.2.2 Sous-titres (A) | Mention « Sous-titres disponibles » ou « Sans sous-titres » par vidéo ; règle : les vidéos sous-titrées passent en premier. |
| B8 | E02–E05 Accueil guidé | Le bouton « Choisir » des continents ne menait nulle part : impossible de choisir une cuisine précise (parcours de Mariam). | Parcours bloqué | Chaque continent se déplie et montre ses cuisines à cocher ; le nombre choisi s'affiche ; « Ouvert à tout » se désactive automatiquement. |

## 2. Points conformes (vérifiés)

- Contrastes du texte : toutes les paires de la palette dépassent 4,5:1. Le plus faible est le vert de la marge sur le fond de page, à 5,4:1.
- Cibles tactiles : 44 px pour les actions principales, 32 px minimum pour les autres (seuil AA : 24 px).
- Langue (`lang="fr"`), un titre `h1` par écran, hiérarchie des titres, libellés des champs, `aria-pressed` sur les puces, `aria-expanded` sur les dépliants, messages d'état annoncés (reste à payer, enregistrement, ajout à la semaine, bulles de Diallo).
- Mascotte décrite avec son humeur ; icônes décoratives masquées aux lecteurs d'écran.
- Les couleurs ne sont jamais le seul indice : la marge et le dépassement, les écarts de prix (signes + et −) et les tampons (« Goûtée » ou « À découvrir ») sont toujours écrits en texte.
- Aucune animation non sollicitée ; l'analyse vidéo dure moins de 5 secondes et peut être annulée.

## 3. Améliorations restantes (non bloquantes)

### À faire dans le code (étape 7)
1. **Repères de page et lien d'évitement** : envelopper le contenu dans `<main>`, ajouter « Aller au contenu ». Critère 2.4.1 (A) : il est en partie couvert aujourd'hui par `<nav>` et les titres.
2. **Panneaux (Changer un dîner, Partager la liste)** : à coder en vraies boîtes de dialogue. Le focus doit rester dans le panneau, Échap doit le fermer et le focus doit revenir sur le bouton d'origine.
3. **Onglets vidéo** : appliquer le schéma ARIA complet (`aria-controls`, flèches gauche et droite, onglet actif seul dans l'ordre de tabulation).
4. **Mise en page fluide** : les maquettes font 390 px de large, le code doit s'adapter jusqu'à 320 px et supporter un zoom de 200 % (1.4.10, 1.4.4).
5. **Focus visible commun** : un même contour de 3 px #2F4BA8 sur tous les écrans, défini dans les design tokens. Pour l'instant, seule la fiche recette en a un ; les autres écrans gardent le contour par défaut du navigateur.
6. **Choix uniques** (supermarché, régime, temps) : les coder en groupes de boutons radio plutôt qu'en boutons à état.
7. **Vidéos** : n'intégrer que les lecteurs officiels, qui gèrent les sous-titres. Si aucune vidéo n'est sous-titrée, l'indiquer clairement.

### Design
8. **Annulation de « Recomposer la semaine »** (point C6 de `screens.md`) : message avec bouton « Annuler » pendant 10 secondes, à dessiner.
9. **Confirmation de « Tout effacer »** (Réglages) : boîte de dialogue qui nomme ce qui sera supprimé.
10. **Puces non sélectionnées** : leur bordure est à 1,3:1. C'est acceptable parce que le texte suffit à identifier le bouton, mais une bordure #9EA3B8 (environ 2,5:1) les rendrait plus visibles.
11. **Barre de budget** : la couleur plantain sur sa piste est à 1,6:1. L'information est aussi donnée en texte (marge), mais afficher le pourcentage à côté de la barre aiderait.
12. **Nombre d'articles** : « Ma semaine » annonce 15 articles (valeur modifiée à la main) alors que la liste de démonstration en compte 11. À aligner.
13. **Versions ordinateur** des écrans autres que « Ma semaine ».
14. **Annuler un retrait du placard** : un message avec « Annuler » quand on retire un produit.
15. **« Voir toutes les recettes compatibles »** dans « Changer un dîner » : l'état de liste complète reste à dessiner.

## 4. Tests à prévoir sur le code
- Parcours complet au clavier seul, puis avec VoiceOver (iOS et macOS) et TalkBack (Android).
- Analyse axe DevTools ou Lighthouse sur chaque écran, intégrée à la CI (Pa11y).
- Test en magasin avec 5 participants sur le parcours liste (hypothèses H2 et H5).
