# Architecture et inventaire des écrans — Diallo

Entrées : `brief.md` (web), `journeys.md` (6 phases, besoins P1 et P2).
Méthode : une première version de l'architecture (v1, reprise du prototype), critiquée selon les heuristiques de Nielsen, les lois UX et l'architecture de l'information, puis corrigée (v2, version retenue).

---

## 1. Architecture retenue (v2)

```
Accueil (page publique)
 └── Démarrer ─► Parcours d'accueil, 4 étapes
                  1 Magasins ─► 2 Cuisines ─► 3 Alimentation ─► 4 Foyer et budget
                                                                  │
                                                                  ▼
┌──────────────────────── Application (navigation principale) ─────────────────────────┐
│  Ma semaine            Courses              Placard              Réglages             │
│   ├ Changer un dîner    └ Partager la liste  └ Ajouter un produit └ Pages légales     │
│   ├ Fiche recette                                                                      │
│   └ Bilan de la semaine ─► nouvelle semaine                                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
P2 : Compte (connexion par lien e-mail) · Abonnement · Mes économies · Corriger mes prix
```

**Navigation**
- 4 entrées principales : Ma semaine, Courses, Placard, Réglages. Toujours le texte avec l'icône.
- Sur mobile : barre en bas de l'écran. Sur ordinateur (à partir de 1024 px) : colonne latérale à gauche, avec la semaine et la liste côte à côte possibles.
- Profondeur maximale : 2 niveaux. Toute fonction P1 est accessible en 2 clics au plus depuis Ma semaine.

**Vocabulaire contrôlé** (un mot par concept, partout)
| Concept | Terme | À ne pas utiliser |
|---|---|---|
| Le plan de 3 à 7 dîners | la semaine | menu, planning |
| Régénérer tout le plan | Recomposer la semaine | Nouveau menu, Régénérer |
| Remplacer un plat | Changer ce dîner | Swap, Remplacer |
| Ce que l'utilisateur a déjà | le placard | stock, inventaire |
| Retirer un produit de la liste | Je l'ai déjà | — |
| Fin de semaine | Terminer la semaine | Semaine suivante, Clôturer |

---

## 2. Critique de la v1 et corrections

La v1 reprenait le prototype : page d'accueil, 5 étapes d'accueil (Magasins, Foyer, Cuisines, Préférences, Budget), puis 4 onglets avec la recette dépliée dans la carte du dîner, le remplacement en panneau et la fin de semaine en bas de la liste de courses.

| # | Problème constaté | Principe | Gravité | Correction intégrée |
|---|---|---|---|---|
| C1 | Le nombre de personnes est demandé deux étapes avant le budget, alors que le minimum réaliste en dépend : l'utilisateur doit s'en souvenir. | Mémoire de travail, loi de proximité | 3 | Fusion **Foyer et budget** sur une seule étape. L'accueil passe de 5 à 4 étapes. |
| C2 | L'étape Préférences mélange régime, 11 exclusions et temps de cuisine : trop de décisions sur un écran. | Loi de Hick, surcharge cognitive | 2 | Étape **Alimentation** en 3 blocs titrés ; régime par défaut « Je mange de tout », exclusions repliées sous « J'ai des allergies ou des interdits ». |
| C3 | 18 cuisines affichées d'un bloc. | Loi de Miller, loi de Hick | 2 | Choix par défaut « Ouvert à tout » ; cuisines regroupées par continent et repliables. |
| C4 | La recette s'ouvre dans la carte du dîner. En cuisine (phase 5), il faut un texte lisible de loin et une page qui reste affichée. | Posture produit, adéquation au contexte | 3 | Écran dédié **Fiche recette** avec sa propre adresse, grande typographie, étapes numérotées, écran maintenu allumé. |
| C5 | « Passer à la semaine suivante » est en bas de la liste de courses, sous les articles : peu d'utilisateurs le verront. Or c'est ce qui alimente le placard. | Faux plancher, règle pic-fin | 3 | Écran **Bilan de la semaine**, proposé depuis Ma semaine à partir du dernier dîner : restes envoyés au placard, économie de la semaine, puis nouvelle semaine. |
| C6 | « Recomposer la semaine » remplace tout le plan, et les cases cochées, sans retour possible. | H3 Contrôle et liberté | 3 | Annulation possible pendant 10 secondes (message avec bouton « Annuler »). |
| C7 | Enregistrer les réglages recompose la semaine sans prévenir. | H5 Prévention des erreurs | 3 | Au moment d'enregistrer : choix entre « Appliquer maintenant (recompose la semaine) » et « À partir de la semaine prochaine ». |
| C8 | Sur le web, on compose souvent la semaine sur ordinateur et on fait les courses téléphone en main. Sans compte, la liste reste sur l'ordinateur. Awa partage aussi ses courses en colocation. | Adéquation au contexte (parcours Lucas, Awa) | 3 | **Partager la liste** en P1 (lien en lecture avec cases à cocher, sans compte). Le compte complet reste en P2. |
| C9 | Le cas « budget impossible » (moment de vérité n° 2) n'a pas d'écran conçu, seulement une note. | H9 Récupération après erreur | 3 | État dédié de Ma semaine : écart affiché, 3 actions proposées (augmenter le budget, ajouter une épicerie, élargir les cuisines). |
| C10 | Rien ne permet de vérifier l'écart entre le total annoncé et le ticket réel (moment de vérité n° 3). | H1 Visibilité de l'état du système | 2 | P2 : **Corriger mes prix** (saisie du total réel). En P1 : mention « prix estimés à ±10 % » visible sur le total. |
| C11 | La liste de remplacement affiche toutes les recettes compatibles (jusqu'à 100). | Surcharge de choix | 2 | 5 suggestions en tête (même budget, cuisine différente), puis « Voir toutes » avec filtre par continent. |
| C12 | Aucune page légale pour un site public qui stocke des préférences alimentaires (donnée potentiellement sensible). | Obligation légale (RGPD) | 3 | **Pages légales** P1 : mentions légales, confidentialité. |
| C13 | La barre d'onglets en bas est un modèle mobile ; sur ordinateur, elle gaspille l'espace. | Loi de Jakob, posture | 2 | Navigation adaptative : barre en bas sur mobile, colonne latérale sur ordinateur. |

---

## 3. Inventaire des écrans

Profils : A = Awa, L = Lucas, M = Mariam.

### P1 — indispensables au MVP

| ID | Écran | Rôle | Profils | Vient de | Mène à | États à concevoir |
|---|---|---|---|---|---|---|
| E01 | **Accueil** (page publique) | Expliquer la promesse en 5 secondes : dîners de la semaine dans ton budget, avec tes magasins, y compris les épiceries du monde. | Tous | Moteur de recherche, lien partagé | E02 | Normal |
| E02 | **Accueil 1/4 — Magasins** | Choisir le supermarché principal et, en option, des épiceries spécialisées. | Tous (moment de vérité de M) | E01 | E03 | Aucun magasin choisi (bouton désactivé) |
| E03 | **Accueil 2/4 — Cuisines** | Choisir ses cuisines ou rester « Ouvert à tout ». | Tous | E02 | E04 | Défaut « Ouvert à tout » |
| E04 | **Accueil 3/4 — Alimentation** | Régime, exclusions (repliées), temps maximum. Nombre de recettes compatibles affiché en direct. | Tous | E03 | E05 | Moins de 3 recettes compatibles (alerte, bouton désactivé) |
| E05 | **Accueil 4/4 — Foyer et budget** | Personnes, nombre de dîners, budget avec le minimum réaliste calculé en direct. | Tous (moment de vérité de A) | E04 | E06 | Budget sous le minimum (avertissement non bloquant) |
| E06 | **Ma semaine** | Écran pivot : total en forme de ticket (budget, marge, placard déduit), dîners du lundi au dimanche, accès à chaque recette et au remplacement. | Tous | E05, navigation | E07, E08, E10, E12 | Chargement ; normal ; budget impossible (C9) ; moins de dîners que demandé ; semaine terminée (bouton Bilan) |
| E07 | **Changer un dîner** (panneau) | 5 suggestions puis toutes les recettes, avec le nouveau total de la semaine pour chacune. | Tous | E06 | E06 | Aucune alternative ; alternative hors budget (désactivée, motif affiché) |
| E08 | **Fiche recette** | Cuisiner : temps, ingrédients aux bonnes quantités pour le foyer, étapes numérotées. | Tous (moment de vérité de L et M) | E06 | E06 (dîner suivant ou précédent) | Normal ; mode cuisine (écran maintenu allumé) |
| E09 | **Courses** | Liste découpée par magasin (sous-total), puis par rayon. Prix, case à cocher, « Je l'ai déjà », reste à payer. | Tous (moment de vérité n° 3) | Navigation | E09a, E06 | Liste vide (tout est au placard) ; tout coché |
| E09a | **Partager la liste** (panneau) | Créer un lien vers la liste pour l'ouvrir sur son téléphone ou la partager en colocation. | L, A | E09 | E09 | Lien copié |
| E10 | **Placard** | Voir et ajuster ce qu'on a déjà ; ajouter un produit ; recomposer la semaine avec le placard. | A, M | Navigation, E12 | E06 | Placard vide (incite à ajouter ou à utiliser « Je l'ai déjà ») |
| E11 | **Réglages** | Modifier magasins, cuisines, alimentation, foyer et budget ; choisir quand appliquer (C7) ; tout effacer. | Tous | Navigation | E06, E13 | Modifications non enregistrées |
| E12 | **Bilan de la semaine** | Clore la semaine : économie réalisée, restes envoyés au placard, puis nouvelle semaine. | A, M | E06 | E06 (nouvelle semaine), E10 | Aucun reste |
| E13 | **Pages légales** | Mentions légales, confidentialité. | Tous | E01, E11 | — | — |

### P2 — après le MVP

| ID | Écran | Rôle | Profils | Dépend de |
|---|---|---|---|---|
| E14 | **Compte** (connexion par lien envoyé par e-mail) | Retrouver sa semaine sur tous ses appareils. | Tous | Backend |
| E15 | **Abonnement** | Premier menu gratuit, puis abonnement ou accès à vie. | Tous | H6 (test de prix) |
| E16 | **Mes économies** | Historique : économies par semaine, comparaison avec la livraison. | L | E14 |
| E17 | **Corriger mes prix** | Saisir le total réel du ticket pour recaler les prix. | Tous | Source de prix (H3) |
| E18 | **Restes pour le midi** (option dans Réglages et Ma semaine) | Prévoir une portion de plus pour le lendemain midi. | L | H8 |

---

## 4. Parcours clés à travers les écrans

- **Première visite (tous)** : E01 → E02 → E03 → E04 → E05 → E06. Objectif : moins de 2 minutes.
- **Semaine type** : E06 (ajuster avec E07) → E09 en magasin → E08 chaque soir → E12 → E06.
- **Composer sur ordinateur, acheter sur téléphone (Lucas)** : E06 → E09 → E09a → lien ouvert sur le téléphone.
- **Budget impossible (Awa)** : E05 (avertissement) → E06 état « budget impossible » → action proposée (E11 ou ajustement direct).

## 4 bis. Impact du concept ludique (10/11/2026)
- **E06 Ma semaine** : bulle de Diallo en tête, série, cagnotte, passeport, défi de la semaine, bouton « Je l'ai cuisiné » sur chaque dîner.
- **E02 à E05 Accueil** : Diallo pose les questions une à une (ton conversationnel).
- **E12 Bilan de la semaine** : devient le moment fort (règle pic-fin) — tampons gagnés, cagnotte, série.
- **Nouvel écran E19 Mes progrès** (P1 léger) : passeport des cuisines, cagnotte, séries, défis réussis ; accessible depuis la bulle et les tuiles de progrès de E06, pas d'entrée dans la navigation principale.

## 4 ter. Fonctionnalités vidéo (10/11/2026) — P1
| ID | Écran | Rôle | Profils | Vient de | Mène à | États |
|---|---|---|---|---|---|---|
| E08 (maj) | **Fiche recette + « En vidéo »** | Voir le plat en vidéo : onglets YouTube / TikTok / Instagram, lecteur intégré, créateur crédité, « Ouvrir sur… », rappel que les quantités sont adaptées au foyer. | Tous | E06 | — | Aucune vidéo trouvée (section masquée) ; vidéo indisponible |
| E20 | **Importer une vidéo** | Coller ou partager un lien ; analyse « ça mijote » en 4 étapes ; historique des imports. | Tous (surtout L et M) | E06 (carte « Vu une recette sur les réseaux ? »), partage depuis l'appli sociale | E21 | Collage ; analyse en cours (annulable) ; aucune recette trouvée ; vidéo privée ou lien invalide |
| E21 | **Recette cocotte-minute** | Recette résumée en 4 étapes max, points « à vérifier », achats par magasin avec prix, déjà au placard, restes réutilisés ; choix du jour remplacé avec impact sur le budget ; ou ajout à la liste seule. | Tous | E20 | E06, E09 | Normal ; ajoutée (avec Annuler) ; hors budget pour tous les jours |

Entrée secondaire à ajouter : « Coller un lien de vidéo » dans E07 Changer un dîner.

## 5. Écran représentatif proposé pour l'étape 5
**E06 Ma semaine** : écran pivot vu à chaque visite, il porte le total (identité visuelle du ticket), les cartes de dîner et la navigation. S'il est validé, il fixe le style de tous les autres écrans.
