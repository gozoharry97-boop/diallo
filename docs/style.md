# Style visuel — Diallo (étape 5, style validé le 10/11/2026)

## Écrans P1 produits (canvas « Diallo — Ma semaine », mobile 390 px)
E01 Accueil public · E02–E05 Accueil guidé (un écran à 4 étapes, interactif) · E06 Ma semaine (mobile + ordinateur) · E07 Changer un dîner · E08 Fiche recette · E09 Courses + E09a Partager la liste · E10 Placard · E11 Réglages (choix « maintenant / semaine prochaine ») · E12 Bilan de la semaine · E13 Pages légales · E19 Mes progrès.
Écrans reliés entre eux (prototype navigable). Version ordinateur à décliner sur le modèle de E06.
Données de démonstration : Awa, Lidl + Tang Frères, 1 personne, 25 €.

Maquette : canvas « Diallo — Ma semaine » (artefact Design), écran E06 en mobile (390 px) et ordinateur (1280 px).
Figma : les outils de lecture et d'écriture du connecteur n'étaient pas disponibles le 10/11/2026 ; report dans Figma à faire quand le connecteur sera complet.

## Couleurs
| Jeton | Valeur | Usage |
|---|---|---|
| fond | #F2F3F7 | Fond de page |
| surface | #FFFFFF | Cartes, ticket, navigation |
| encre | #171A33 | Texte principal, bouton principal |
| encre-douce | #555A72 | Texte secondaire (contraste 6,3:1 sur fond) |
| trait | #DCDFE8 | Bordures |
| gris-action | #ECEEF4 | Boutons secondaires, fond de barre |
| bissap | #A3214A | Marque (repère du logo, onglet actif) |
| plantain | #F2B33D | Barre de budget |
| gombo | #23704F | Marge positive |
| alerte | #B3261E | Dépassement de budget |
| alerte-fond | #FFF4D9 | Encart « budget impossible » |

## Typographie
- Familjen Grotesk (400 à 700) pour toute l'interface : titre d'écran 34 px (mobile) ou 40 px (ordinateur), titre de section 22 px, nom de plat 17 px, texte 15 px, légende 13 px.
- IBM Plex Mono, uniquement pour le ticket de caisse (14 px, total 20 px).

## Mascotte et jeu (v2, 10/11/2026)
- **Diallo, la petite marmite** : corps couleur d'accent, couvercle encre, joues plantain, vapeur. Trois humeurs : contente (semaine dans le budget), fière (tous les dîners cuisinés), inquiète (budget impossible). Elle parle dans une bulle, toujours pour aider, jamais pour culpabiliser.
- **Mécaniques**, chacune liée à un insight de la recherche :
  - Série « semaines dans le budget » (insight 1) — une série interrompue se met en pause, elle n'est jamais perdue.
  - Cagnotte : économies cumulées, marges et placard (insights 1 et 2).
  - Passeport des cuisines : tampon à chaque nouvelle cuisine (insight 5) ; badge « Nouveau tampon » sur le dîner.
  - Défi zéro gaspi de la semaine : finir un paquet entamé (insight 2).
  - « Je l'ai cuisiné » sur chaque dîner : alimente le compteur et le bilan.
- **Icônes des mécaniques** (trait 1,8 px, pastille arrondie de 32 px, teinte propre à chaque mécanique) : cagnotte = tirelire (fond #FBE7B5, trait #7A4F00) ; passeport = livret avec globe (#F6D3DC, #7A1A38) ; dîners cuisinés = marmite fumante (#D5ECDF, #1B5E40) ; défi zéro gaspi = feuille (#2A2E4F, #8FD3AE, sur la carte sombre).
- **Garde-fous** : pas de classement entre utilisateurs, pas de récompense liée au fait de dépenser, pas de message culpabilisant (public parfois en grande précarité).

## Principes
- Le ticket de caisse est l'unique élément expressif ; le reste reste sobre.
- Cibles tactiles de 44 px minimum ; libellés toujours avec texte.
- Pas d'émoji : chaque dîner porte un repère de cuisine (initiales sur une pastille teintée).
