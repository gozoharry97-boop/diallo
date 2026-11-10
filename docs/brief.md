# Brief — Diallo

## Produit
Application web qui compose les dîners de la semaine dans un budget fixé par l'utilisateur, avec la liste de courses chiffrée aux prix de ses magasins.

## Problème résolu
- « On mange quoi ce soir ? » : charge mentale quotidienne et manque d'idées.
- Courses qui dépassent le budget : achats impulsifs, gaspillage, paquets entamés oubliés.
- Les apps de menus existantes ignorent les épiceries spécialisées (asiatiques, africaines, orientales) et proposent surtout une cuisine européenne.

## Cible prioritaire
1. **Étudiants petit budget** : seuls ou en colocation, 15 à 35 € par semaine pour les dîners.
2. **Jeunes actifs** : peu de temps, envie de varier sans réfléchir.
3. **Diaspora et curieux du monde** : cuisines africaines, asiatiques, maghrébines, antillaises ; courses partagées entre supermarché et épiceries spécialisées (Tang Frères, Paris Store, épicerie africaine…).

## Support
Web (responsive, mobile d'abord dans l'usage : la liste de courses s'utilise en magasin).

## Base existante
Prototype React « Popote » : 105 recettes, 18 cuisines, 7 régimes (dont végan, keto, carnivore), exclusions (allergènes, porc, piment), supermarché principal + épiceries spécialisées avec routage du produit vers le magasin le moins cher, liste par magasin et par rayon, placard qui réutilise les restes. Prix estimés par indice d'enseigne.

## Concept (mis à jour le 10/11/2026)
Application ludique : **Diallo est une mascotte** qui accompagne l'utilisateur à chaque étape (accueil, budget, courses, cuisine, bilan). Mécaniques de jeu au service des objectifs de la recherche : tenir son budget, finir ses restes, découvrir des cuisines.

## Fonctionnalités vidéo (ajoutées le 10/11/2026)
1. **Vidéos de la recette proposée** : sur chaque fiche recette, Diallo propose des vidéos du même plat trouvées sur YouTube, TikTok ou Instagram, lues dans l'app (intégration officielle, jamais hébergées par Diallo), avec le créateur crédité et un lien vers l'original.
2. **Import d'une vidéo des réseaux** : l'utilisateur colle (ou partage) un lien TikTok, Instagram ou YouTube ; Diallo en tire une **recette « cocotte-minute »** (ingrédients et étapes résumés, adaptés au foyer), signale ce qui est incertain, puis génère **la liste de courses chiffrée selon ses enseignes**, avec ce qu'il a déjà au placard. La recette peut remplacer un dîner de la semaine ou alimenter seulement la liste.

## Exigence pour le code (étape 7)
- **L'application récupère les catalogues de produits et de prix des supermarchés** (et, si possible, des épiceries spécialisées) au lieu de prix estimés.
- Point à traiter à l'étape 7 : choisir la source (API ou flux partenaires, agrégateurs, open data comme Open Food Facts / Open Prices, relevés) et vérifier les conditions d'utilisation de chaque enseigne avant toute collecte automatique.

- **Vidéos — points à vérifier à l'étape 7, avant de coder** (hypothèses, non vérifiées à ce stade) :
  - *Trouver des vidéos* : YouTube propose une API de recherche ; TikTok et Instagram ne semblent pas offrir de recherche publique ouverte aux applis tierces. Piste : recherche YouTube automatique + sélection de liens TikTok/Instagram faite à la main par recette.
  - *Afficher* : uniquement via les lecteurs intégrés officiels (embed / oEmbed) de chaque plateforme.
  - *Importer* : lire ce que les plateformes exposent légalement (titre, légende, description, sous-titres quand une API les fournit). Télécharger la vidéo pour l'analyser est probablement contraire à leurs conditions : à exclure sauf autorisation. Extraction des ingrédients et étapes par un modèle d'IA (sortie structurée), puis rapprochement avec le catalogue produits et prix des enseignes.
  - *Partager depuis TikTok/Instagram vers Diallo* : possible pour une appli web installée (Web Share Target), mais le support dépend des navigateurs (meilleur sur Android).
  - *Droits* : résumer une recette (liste d'ingrédients, étapes reformulées) en créditant le créateur et en renvoyant vers sa vidéo ; ne jamais copier le texte ni les images.

## Contraintes connues
- Prix réels : pas d'API publique des enseignes ; source de données à définir (voir exigence ci-dessus).
- Modèle économique de référence (concurrent Pimzi) : premier menu gratuit, puis abonnement mensuel ou accès à vie.

## Figma
https://www.figma.com/design/Z6n2LF7oqMfmMg00LaUnGE/Diallo?node-id=0-1
