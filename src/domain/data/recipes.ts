// Généré depuis le prototype Popote, puis maintenu à la main.
import type { Recipe } from '../types';

export const RECIPES: Recipe[] = [
  {
    id: "pouletcitron", name: "Poulet rôti citron & pommes de terre", cuisine: "fr", minutes: 45, protein: "poulet",
    ingredients: {cuisses: 250,pdt: 250,citrons: 0.5,ail: 0.1},
    steps: [
      "Coupe les pommes de terre en quartiers, dispose-les avec les cuisses dans un plat.",
      "Arrose de citron, ajoute l'ail écrasé, sel, poivre, un filet d'huile.",
      "Enfourne 40 min à 200 °C.",
    ],
  },
  {
    id: "quiche", name: "Quiche aux poireaux", cuisine: "fr", minutes: 50, protein: "oeuf",
    ingredients: {pate: 0.25,poireaux: 150,oeufs: 1,creme: 40,lait: 50,fromage: 20},
    steps: [
      "Fais fondre les poireaux émincés 10 min.",
      "Mélange œufs, crème, lait, fromage et poireaux.",
      "Verse sur la pâte, 30 min à 190 °C.",
    ],
  },
  {
    id: "parmentier", name: "Hachis parmentier", cuisine: "fr", minutes: 50, protein: "boeuf",
    ingredients: {boeuf: 100,pdt: 250,lait: 50,beurre: 10,fromage: 20,oignons: 30},
    steps: [
      "Cuis les pommes de terre, écrase-les avec lait et beurre.",
      "Fais revenir oignon et bœuf.",
      "Monte le plat, parsème de fromage, 20 min à 200 °C.",
    ],
  },
  {
    id: "soupepoireaux", name: "Soupe poireaux-pommes de terre", cuisine: "fr", minutes: 35, protein: "legume",
    ingredients: {poireaux: 150,pdt: 150,bouillon: 0.25,creme: 20},
    steps: [
      "Fais suer les poireaux.",
      "Ajoute pommes de terre, bouillon et eau, 25 min.",
      "Mixe avec la crème.",
    ],
  },
  {
    id: "veloute", name: "Velouté de butternut & lentilles", cuisine: "fr", minutes: 35, protein: "legumineuse",
    ingredients: {butternut: 250,coco: 50,oignons: 30,bouillon: 0.25,lentillesC: 30},
    steps: [
      "Fais revenir la courge en cubes avec l'oignon.",
      "Ajoute lentilles, bouillon et eau à hauteur, 25 min.",
      "Mixe avec le lait de coco.",
    ],
  },
  {
    id: "cabillaud", name: "Cabillaud & purée de carottes", cuisine: "fr", minutes: 30, protein: "poisson",
    ingredients: {cabillaud: 130,carottes: 200,pdt: 150,beurre: 10},
    steps: [
      "Cuis carottes et pommes de terre 20 min à l'eau.",
      "Écrase-les avec le beurre.",
      "Poêle le cabillaud 4 min par face.",
    ],
  },
  {
    id: "gratin", name: "Gratin dauphinois & salade", cuisine: "fr", minutes: 55, protein: "fromage",
    ingredients: {pdt: 300,creme: 60,lait: 60,fromage: 30,ail: 0.1},
    steps: [
      "Tranche finement les pommes de terre.",
      "Range-les dans un plat frotté d'ail, couvre de lait et crème.",
      "Parsème de fromage, 45 min à 180 °C.",
    ],
  },
  {
    id: "lentillessaucisse", name: "Lentilles, carottes & saucisse", cuisine: "fr", minutes: 40, protein: "porc",
    ingredients: {lentillesV: 80,saucisse: 100,carottes: 80,oignons: 40},
    steps: [
      "Fais revenir oignon et saucisse en rondelles.",
      "Ajoute lentilles, carottes et deux fois leur volume d'eau.",
      "Cuis 25 min.",
    ],
  },
  {
    id: "ratatouille", name: "Ratatouille & œufs pochés", cuisine: "fr", minutes: 45, protein: "oeuf",
    ingredients: {courgettes: 120,aubergine: 120,poivrons: 0.5,tomates: 150,oignons: 40,oeufs: 2},
    steps: [
      "Coupe tous les légumes en dés.",
      "Fais-les mijoter 35 min avec huile d'olive et herbes.",
      "Creuse des puits, casse les œufs, couvre 6 min.",
    ],
  },
  {
    id: "steakoeufs", name: "Steak haché & œufs au plat", cuisine: "fr", minutes: 15, protein: "boeuf",
    ingredients: {boeuf: 150,oeufs: 2,beurre: 10},
    steps: [
      "Façonne les steaks, saisis-les 3 min par face.",
      "Fais cuire les œufs au beurre dans la même poêle.",
      "Sale et poivre.",
    ],
  },
  {
    id: "pouletbeurre", name: "Cuisses de poulet rôties au beurre", cuisine: "fr", minutes: 45, protein: "poulet",
    ingredients: {cuisses: 300,beurre: 15},
    steps: [
      "Badigeonne les cuisses de beurre fondu, sale et poivre.",
      "Enfourne 40 min à 210 °C en arrosant deux fois.",
    ],
  },
  {
    id: "saumonbeurre", name: "Saumon poêlé au beurre", cuisine: "fr", minutes: 15, protein: "poisson",
    ingredients: {saumon: 150,beurre: 15},
    steps: [
      "Poêle le saumon côté peau 5 min.",
      "Retourne, ajoute le beurre et arrose 3 min.",
    ],
  },
  {
    id: "cabillaudbeurre", name: "Cabillaud au beurre noisette", cuisine: "fr", minutes: 15, protein: "poisson",
    ingredients: {cabillaud: 170,beurre: 15},
    steps: [
      "Poêle le cabillaud 4 min par face.",
      "Fais blondir le beurre et verse-le dessus.",
    ],
  },
  {
    id: "omelette", name: "Omelette jambon-fromage", cuisine: "fr", minutes: 10, protein: "oeuf",
    ingredients: {oeufs: 3,jambon: 40,fromage: 25},
    steps: [
      "Bats les œufs, verse dans une poêle chaude.",
      "Ajoute jambon et fromage, plie l'omelette.",
    ],
  },
  {
    id: "cotesporc", name: "Côtes de porc grillées", cuisine: "fr", minutes: 20, protein: "porc",
    ingredients: {cotesporc: 220,beurre: 10},
    steps: [
      "Saisis les côtes 5 min par face.",
      "Finis au beurre, laisse reposer 2 min.",
    ],
  },
  {
    id: "onepot", name: "One-pot pâtes crémeuses à la tomate", cuisine: "it", minutes: 20, protein: "fromage",
    ingredients: {pates: 110,tomatesC: 100,creme: 40,oignons: 30,fromage: 20},
    steps: [
      "Mets pâtes, tomates, oignon et 25 cl d'eau par personne dans une sauteuse.",
      "Cuis à couvert en remuant jusqu'à absorption.",
      "Ajoute crème et fromage hors du feu.",
    ],
  },
  {
    id: "carbo", name: "Carbonara", cuisine: "it", minutes: 15, protein: "porc",
    ingredients: {pates: 110,lardons: 50,oeufs: 1,fromage: 20},
    steps: [
      "Cuis les pâtes, fais dorer les lardons.",
      "Mélange œufs et fromage.",
      "Hors du feu, mélange tout avec un peu d'eau de cuisson.",
    ],
  },
  {
    id: "gnocchis", name: "Gnocchis poêlés, courgette & feta", cuisine: "it", minutes: 20, protein: "fromage",
    ingredients: {gnocchi: 150,courgettes: 150,feta: 40},
    steps: [
      "Poêle les gnocchis 6 min.",
      "Ajoute la courgette en dés, 5 min.",
      "Émiette la feta.",
    ],
  },
  {
    id: "pastaepinards", name: "Pâtes crémeuses aux épinards", cuisine: "it", minutes: 20, protein: "fromage",
    ingredients: {pates: 110,epinards: 100,creme: 40,fromage: 20,ail: 0.1},
    steps: [
      "Cuis les pâtes.",
      "Réchauffe épinards et ail, ajoute la crème.",
      "Mélange avec pâtes et fromage.",
    ],
  },
  {
    id: "risotto", name: "Risotto aux champignons", cuisine: "it", minutes: 35, protein: "fromage",
    ingredients: {riz: 90,champignons: 100,oignons: 40,fromage: 25,bouillon: 0.5,beurre: 10},
    steps: [
      "Nacre le riz avec l'oignon dans le beurre.",
      "Ajoute le bouillon louche par louche, 18 min.",
      "Incorpore champignons poêlés et fromage.",
    ],
  },
  {
    id: "pastathon", name: "Pâtes au thon & tomate", cuisine: "it", minutes: 20, protein: "poisson",
    ingredients: {pates: 110,thon: 60,tomatesC: 100,oignons: 30},
    steps: [
      "Cuis les pâtes.",
      "Fais revenir l'oignon, ajoute tomates et thon, 10 min.",
      "Mélange.",
    ],
  },
  {
    id: "pesto", name: "Pâtes au pesto & courgettes", cuisine: "it", minutes: 15, protein: "fromage",
    ingredients: {pates: 110,pesto: 35,courgettes: 120},
    steps: [
      "Cuis les pâtes.",
      "Poêle la courgette en rondelles.",
      "Mélange avec le pesto.",
    ],
  },
  {
    id: "bolo", name: "Pâtes à la bolognaise", cuisine: "it", minutes: 35, protein: "boeuf",
    ingredients: {pates: 110,boeuf: 100,tomatesC: 130,oignons: 30,carottes: 40},
    steps: [
      "Fais revenir oignon et carotte râpée, puis le bœuf.",
      "Ajoute les tomates, mijote 20 min.",
      "Sers sur les pâtes.",
    ],
  },
  {
    id: "tortilla", name: "Tortilla de pommes de terre", cuisine: "es", minutes: 30, protein: "oeuf",
    ingredients: {oeufs: 2.5,pdt: 200,oignons: 50},
    steps: [
      "Cuis pommes de terre en fines tranches et oignon à la poêle, 15 min.",
      "Verse les œufs battus.",
      "Cuis à feu doux, retourne à l'aide d'une assiette.",
    ],
  },
  {
    id: "paella", name: "Paella poulet-chorizo", cuisine: "es", minutes: 45, protein: "poulet",
    ingredients: {riz: 85,poulet: 90,chorizo: 30,poivrons: 0.3,petitspois: 50,tomatesC: 60},
    steps: [
      "Fais dorer poulet et chorizo, ajoute poivron et tomates.",
      "Verse le riz, paprika, 2,5 fois son volume d'eau.",
      "Cuis 20 min sans remuer, ajoute les petits pois à mi-cuisson.",
    ],
  },
  {
    id: "paellamer", name: "Paella aux crevettes", cuisine: "es", minutes: 40, protein: "mer",
    ingredients: {riz: 85,crevettes: 90,poivrons: 0.3,petitspois: 50,tomatesC: 60,citrons: 0.25},
    steps: [
      "Fais revenir poivron et tomates, ajoute riz et 2,5 volumes d'eau.",
      "Cuis 15 min, ajoute crevettes et petits pois.",
      "Encore 5 min, sers avec du citron.",
    ],
  },
  {
    id: "moussaka", name: "Moussaka express", cuisine: "med", minutes: 50, protein: "boeuf",
    ingredients: {aubergine: 200,boeuf: 100,tomatesC: 100,oignons: 30,yaourt: 60,fromage: 20},
    steps: [
      "Rôtis les aubergines en tranches 15 min au four.",
      "Prépare une sauce bœuf-tomate-oignon à la cannelle.",
      "Alterne les couches, couvre de yaourt et fromage, 25 min à 200 °C.",
    ],
  },
  {
    id: "grecque", name: "Salade grecque & pita grillée", cuisine: "med", minutes: 15, protein: "fromage",
    ingredients: {tomates: 150,concombre: 0.4,feta: 50,olives: 25,pita: 1,oignons: 20},
    steps: [
      "Coupe tomates, concombre et oignon.",
      "Ajoute olives et feta, huile d'olive, origan.",
      "Sers avec la pita grillée.",
    ],
  },
  {
    id: "saumonfeta", name: "Saumon, courgettes & feta", cuisine: "med", minutes: 25, protein: "poisson",
    ingredients: {saumon: 125,courgettes: 200,feta: 30,citrons: 0.25},
    steps: [
      "Poêle les courgettes en rondelles 8 min.",
      "Cuis le saumon 4 min par face.",
      "Émiette la feta, arrose de citron.",
    ],
  },
  {
    id: "goulash", name: "Goulash de bœuf", cuisine: "nord", minutes: 60, protein: "boeuf",
    ingredients: {boeufmij: 140,pdt: 150,poivrons: 0.4,oignons: 50,tomatesC: 60},
    steps: [
      "Fais dorer le bœuf en cubes et l'oignon avec 1 c. à s. de paprika.",
      "Ajoute tomates, poivron, eau à hauteur, mijote 40 min.",
      "Ajoute les pommes de terre, encore 15 min.",
    ],
  },
  {
    id: "bortsch", name: "Bortsch (soupe de betterave)", cuisine: "nord", minutes: 40, protein: "legume",
    ingredients: {betterave: 150,chou: 100,pdt: 100,carottes: 50,oignons: 30,creme: 20},
    steps: [
      "Fais revenir oignon et carotte.",
      "Ajoute chou émincé, pommes de terre, eau, 25 min.",
      "Ajoute la betterave en dés, sers avec la crème.",
    ],
  },
  {
    id: "boulettes", name: "Boulettes suédoises & purée", cuisine: "nord", minutes: 40, protein: "boeuf",
    ingredients: {boeuf: 120,pdt: 250,creme: 40,lait: 50},
    steps: [
      "Façonne des boulettes, dore-les à la poêle.",
      "Déglace à la crème, mijote 10 min.",
      "Sers avec une purée au lait.",
    ],
  },
  {
    id: "saumonpdt", name: "Saumon, pommes de terre & aneth", cuisine: "nord", minutes: 30, protein: "poisson",
    ingredients: {saumon: 125,pdt: 200,creme: 30,herbes: 0.2},
    steps: [
      "Cuis les pommes de terre 20 min.",
      "Poêle le saumon.",
      "Mélange crème et aneth ciselé pour la sauce.",
    ],
  },
  {
    id: "mafe", name: "Mafé de poulet", cuisine: "ao", minutes: 50, protein: "poulet",
    ingredients: {cuisses: 200,patearachide: 40,tomatesC: 80,carottes: 80,patatedouce: 100,oignons: 40,riz: 70},
    steps: [
      "Fais dorer le poulet avec l'oignon.",
      "Délaye la pâte d'arachide dans l'eau, ajoute tomates et légumes.",
      "Mijote 35 min, sers avec le riz.",
    ],
  },
  {
    id: "mafevege", name: "Mafé de légumes", cuisine: "ao", minutes: 45, protein: "legume",
    ingredients: {patearachide: 40,patatedouce: 150,carottes: 80,chou: 80,tomatesC: 80,oignons: 40,riz: 70},
    steps: [
      "Fais revenir l'oignon.",
      "Ajoute pâte d'arachide délayée, tomates et légumes en morceaux.",
      "Mijote 30 min, sers avec le riz.",
    ],
  },
  {
    id: "yassa", name: "Poulet yassa", cuisine: "ao", minutes: 50, protein: "poulet",
    ingredients: {cuisses: 220,oignons: 150,citrons: 0.75,moutarde: 10,riz: 75},
    steps: [
      "Marine le poulet avec citron, moutarde et oignons émincés (idéalement la veille).",
      "Dore le poulet, puis fais fondre les oignons 15 min.",
      "Remets le poulet et la marinade, mijote 20 min.",
    ],
  },
  {
    id: "yassapoisson", name: "Yassa de poisson", cuisine: "ao", minutes: 40, protein: "poisson",
    ingredients: {tilapia: 150,oignons: 150,citrons: 0.75,moutarde: 10,riz: 75},
    steps: [
      "Fais fondre les oignons avec citron et moutarde, 15 min.",
      "Pose le poisson dessus, couvre 12 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "thieb", name: "Thiéboudienne express", cuisine: "ao", minutes: 60, protein: "poisson",
    ingredients: {tilapia: 150,rizbrise: 85,concentre: 25,chou: 80,carottes: 80,aubergine: 60,oignons: 30},
    steps: [
      "Fais revenir oignon et concentré, ajoute eau et légumes, 20 min.",
      "Poche le poisson 10 min dans le bouillon, réserve avec les légumes.",
      "Cuis le riz brisé dans le bouillon, 20 min.",
    ],
  },
  {
    id: "attieke", name: "Attiéké & poisson braisé", cuisine: "ao", minutes: 30, protein: "poisson",
    ingredients: {attieke: 150,tilapia: 170,tomates: 100,oignons: 40,citrons: 0.25},
    steps: [
      "Assaisonne le poisson, grille-le au four 20 min.",
      "Prépare une salade tomate-oignon au citron.",
      "Réchauffe l'attiéké à la vapeur ou au micro-ondes.",
    ],
  },
  {
    id: "alloco", name: "Alloco & poulet grillé", cuisine: "ao", minutes: 30, protein: "poulet",
    ingredients: {plantain: 200,poulet: 130,tomates: 80,oignons: 30},
    steps: [
      "Coupe les bananes plantain mûres en tronçons, dore-les à la poêle.",
      "Grille le poulet assaisonné.",
      "Sers avec une sauce tomate-oignon.",
    ],
  },
  {
    id: "allocooeufs", name: "Alloco, œufs & sauce tomate", cuisine: "ao", minutes: 25, protein: "oeuf",
    ingredients: {plantain: 200,oeufs: 2,tomates: 120,oignons: 40},
    steps: [
      "Dore les bananes plantain en tronçons.",
      "Fais une sauce tomate-oignon, casse les œufs dedans.",
      "Couvre 6 min.",
    ],
  },
  {
    id: "jollof", name: "Riz jollof au poulet", cuisine: "ao", minutes: 50, protein: "poulet", spicy: true,
    ingredients: {riz: 85,tomatesC: 120,concentre: 15,poivrons: 0.5,oignons: 50,cuisses: 180},
    steps: [
      "Mixe tomates, poivron et oignon, fais réduire 15 min avec le concentré.",
      "Dore le poulet, ajoute la sauce, le riz et l'eau.",
      "Cuis 25 min à couvert à feu doux.",
    ],
  },
  {
    id: "jollofvege", name: "Riz jollof aux haricots", cuisine: "ao", minutes: 45, protein: "legumineuse", spicy: true,
    ingredients: {riz: 85,tomatesC: 120,concentre: 15,poivrons: 0.5,oignons: 50,niebe: 50},
    steps: [
      "Fais tremper puis cuire les haricots 30 min (ou la veille).",
      "Fais réduire la sauce tomate-poivron-oignon.",
      "Ajoute riz, haricots et eau, 25 min.",
    ],
  },
  {
    id: "gombo", name: "Sauce gombo au bœuf", cuisine: "ao", minutes: 55, protein: "boeuf",
    ingredients: {gombo: 120,boeufmij: 120,tomatesC: 60,oignons: 30,huilepalme: 10,riz: 70},
    steps: [
      "Fais dorer le bœuf avec l'oignon, ajoute tomates et eau, 30 min.",
      "Ajoute gombos et huile de palme, 15 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "niebeplantain", name: "Haricots niébé & plantain", cuisine: "ao", minutes: 50, protein: "legumineuse",
    ingredients: {niebe: 80,plantain: 150,tomatesC: 80,oignons: 40,huilepalme: 10},
    steps: [
      "Cuis les haricots 40 min.",
      "Prépare une sauce tomate-oignon à l'huile de palme, ajoute les haricots.",
      "Sers avec les plantains dorés.",
    ],
  },
  {
    id: "moambe", name: "Poulet moambé", cuisine: "ac", minutes: 50, protein: "poulet",
    ingredients: {cuisses: 220,huilepalme: 20,tomatesC: 60,oignons: 40,riz: 70},
    steps: [
      "Dore le poulet avec l'oignon.",
      "Ajoute huile de palme, tomates et un peu d'eau.",
      "Mijote 35 min, sers avec le riz.",
    ],
  },
  {
    id: "pondu", name: "Pondu (saka-saka) & riz", cuisine: "ac", minutes: 45, protein: "legume",
    ingredients: {saka: 150,huilepalme: 15,oignons: 40,patearachide: 20,riz: 70},
    steps: [
      "Cuis les feuilles de manioc 30 min avec l'oignon.",
      "Ajoute huile de palme et pâte d'arachide, 10 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "pondupoisson", name: "Saka-saka au poisson", cuisine: "ac", minutes: 50, protein: "poisson",
    ingredients: {saka: 150,tilapia: 120,huilepalme: 15,oignons: 40,riz: 70},
    steps: [
      "Cuis les feuilles de manioc 30 min avec l'oignon.",
      "Ajoute l'huile de palme et le poisson en morceaux, 12 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "misirwot", name: "Misir wot (lentilles éthiopiennes)", cuisine: "ae", minutes: 35, protein: "legumineuse", spicy: true,
    ingredients: {lentillesC: 90,oignons: 80,concentre: 15,ail: 0.1,riz: 60},
    steps: [
      "Fais fondre longuement les oignons, ajoute ail et épices berbéré (ou paprika fort).",
      "Ajoute concentré, lentilles et eau, 20 min.",
      "Sers avec du riz ou de l'injera.",
    ],
  },
  {
    id: "pilau", name: "Pilau kényan au bœuf", cuisine: "ae", minutes: 50, protein: "boeuf",
    ingredients: {riz: 85,boeufmij: 110,oignons: 50,tomates: 60,ail: 0.1},
    steps: [
      "Dore le bœuf et l'oignon avec cumin, cannelle, cardamome.",
      "Ajoute tomates et eau, mijote 20 min.",
      "Verse le riz, cuis 20 min à couvert.",
    ],
  },
  {
    id: "sukuma", name: "Sukuma wiki (chou sauté) & œufs", cuisine: "ae", minutes: 25, protein: "oeuf",
    ingredients: {chou: 200,tomates: 100,oignons: 40,oeufs: 2},
    steps: [
      "Fais revenir l'oignon et les tomates.",
      "Ajoute le chou émincé, 10 min.",
      "Sers avec des œufs brouillés.",
    ],
  },
  {
    id: "couscous", name: "Couscous de légumes", cuisine: "ma", minutes: 40, protein: "legumineuse",
    ingredients: {semoule: 80,poischiches: 80,carottes: 100,courgettes: 100,tomatesC: 60},
    steps: [
      "Mijote légumes, tomates et pois chiches 25 min avec ras-el-hanout.",
      "Réhydrate la semoule à l'eau bouillante salée.",
      "Sers ensemble.",
    ],
  },
  {
    id: "couscousmerguez", name: "Couscous merguez & poulet", cuisine: "ma", minutes: 50, protein: "agneau",
    ingredients: {semoule: 80,merguez: 80,cuisses: 120,carottes: 80,courgettes: 80,poischiches: 50},
    steps: [
      "Dore le poulet, ajoute légumes, pois chiches, épices et eau, 35 min.",
      "Grille les merguez.",
      "Sers avec la semoule.",
    ],
  },
  {
    id: "tajine", name: "Tajine poulet, citron confit & olives", cuisine: "ma", minutes: 55, protein: "poulet",
    ingredients: {cuisses: 230,citronconfit: 20,olives: 30,oignons: 60,pdt: 120},
    steps: [
      "Dore le poulet avec l'oignon, gingembre, curcuma.",
      "Ajoute un peu d'eau et les pommes de terre, 30 min.",
      "Ajoute citron confit et olives, 10 min.",
    ],
  },
  {
    id: "chakchouka", name: "Chakchouka", cuisine: "ma", minutes: 25, protein: "oeuf",
    ingredients: {oeufs: 2,tomatesC: 200,poivrons: 0.5,oignons: 40,feta: 25},
    steps: [
      "Fais fondre oignon et poivron avec cumin et paprika.",
      "Ajoute les tomates, 10 min.",
      "Casse les œufs dessus, couvre 6 min.",
    ],
  },
  {
    id: "harira", name: "Harira", cuisine: "ma", minutes: 45, protein: "legumineuse",
    ingredients: {lentillesV: 40,poischiches: 60,tomatesC: 120,pates: 20,oignons: 30,herbes: 0.2},
    steps: [
      "Fais revenir l'oignon avec gingembre et curcuma.",
      "Ajoute lentilles, tomates et 40 cl d'eau par personne, 30 min.",
      "Ajoute pois chiches, vermicelles et herbes, 8 min.",
    ],
  },
  {
    id: "kefta", name: "Tajine de kefta aux œufs", cuisine: "ma", minutes: 35, protein: "boeuf",
    ingredients: {boeuf: 120,tomatesC: 150,oignons: 30,oeufs: 1},
    steps: [
      "Façonne des boulettes avec le bœuf, cumin, paprika.",
      "Fais mijoter la sauce tomate-oignon, ajoute les boulettes, 15 min.",
      "Casse les œufs dessus, couvre 6 min.",
    ],
  },
  {
    id: "merguezoeufs", name: "Merguez grillées & œufs", cuisine: "ma", minutes: 15, protein: "agneau",
    ingredients: {merguez: 120,oeufs: 2},
    steps: [
      "Grille les merguez 10 min.",
      "Fais cuire les œufs dans le jus de cuisson.",
    ],
  },
  {
    id: "agneau", name: "Épaule d'agneau rôtie", cuisine: "ma", minutes: 60, protein: "agneau",
    ingredients: {agneau: 220,beurre: 5},
    steps: [
      "Frotte l'agneau de sel et beurre.",
      "Rôtis 55 min à 180 °C, laisse reposer 10 min.",
    ],
  },
  {
    id: "tajinelegumes", name: "Tajine de légumes & pois chiches", cuisine: "ma", minutes: 45, protein: "legumineuse",
    ingredients: {pdt: 100,carottes: 100,courgettes: 100,poischiches: 80,olives: 20,semoule: 60},
    steps: [
      "Fais revenir les légumes avec ras-el-hanout.",
      "Ajoute pois chiches, olives et un peu d'eau, 30 min.",
      "Sers avec la semoule.",
    ],
  },
  {
    id: "cantonais", name: "Riz cantonais", cuisine: "cn", minutes: 20, protein: "porc",
    ingredients: {riz: 80,oeufs: 1,jambon: 40,petitspois: 60,soja: 10},
    steps: [
      "Cuis le riz (idéalement la veille).",
      "Fais une omelette fine, coupe-la en lanières.",
      "Saute riz, petits pois, jambon, omelette et soja.",
    ],
  },
  {
    id: "wok", name: "Wok de nouilles au poulet", cuisine: "cn", minutes: 20, protein: "poulet",
    ingredients: {nouilles: 70,poulet: 100,poivrons: 0.5,carottes: 80,soja: 15},
    steps: [
      "Cuis les nouilles 4 min.",
      "Saisis le poulet, puis carottes et poivron en julienne.",
      "Ajoute nouilles et soja, 2 min.",
    ],
  },
  {
    id: "mapo", name: "Mapo tofu", cuisine: "cn", minutes: 25, protein: "tofu", spicy: true,
    ingredients: {tofu: 150,porchache: 50,soja: 15,riz: 75},
    steps: [
      "Fais revenir le porc avec ail, gingembre et piment.",
      "Ajoute tofu en dés, soja et un peu d'eau, 8 min.",
      "Sers sur le riz.",
    ],
  },
  {
    id: "kungpao", name: "Poulet kung pao", cuisine: "cn", minutes: 25, protein: "poulet", spicy: true,
    ingredients: {poulet: 130,cacahuetes: 20,poivrons: 0.5,soja: 15,riz: 75},
    steps: [
      "Saisis le poulet en dés avec piments séchés.",
      "Ajoute poivron, soja, un peu de sucre et vinaigre.",
      "Parsème de cacahuètes, sers avec le riz.",
    ],
  },
  {
    id: "boeufbrocoli", name: "Bœuf sauté au brocoli", cuisine: "cn", minutes: 25, protein: "boeuf",
    ingredients: {boeuflam: 110,brocoli: 150,saucehuitre: 15,riz: 75},
    steps: [
      "Saisis le bœuf à feu vif, réserve.",
      "Saute le brocoli 4 min avec un peu d'eau.",
      "Remets le bœuf, ajoute la sauce d'huître.",
    ],
  },
  {
    id: "tofu", name: "Tofu sauté, riz & brocoli", cuisine: "cn", minutes: 20, protein: "tofu",
    ingredients: {tofu: 130,riz: 75,brocoli: 150,soja: 15},
    steps: [
      "Fais dorer le tofu en dés.",
      "Ajoute le brocoli et un peu d'eau, couvre 5 min.",
      "Laque au soja, sers avec le riz.",
    ],
  },
  {
    id: "teriyaki", name: "Donburi poulet teriyaki", cuisine: "jp", minutes: 25, protein: "poulet",
    ingredients: {poulet: 130,soja: 20,riz: 85,gingembre: 5,paksoi: 80},
    steps: [
      "Saisis le poulet, ajoute soja, un peu de sucre et gingembre râpé.",
      "Réduis jusqu'à ce que ça nappe.",
      "Sers sur le riz avec le pak-choï sauté.",
    ],
  },
  {
    id: "udonmiso", name: "Soupe udon, miso & tofu", cuisine: "jp", minutes: 20, protein: "tofu",
    ingredients: {udon: 150,miso: 20,tofu: 80,paksoi: 80},
    steps: [
      "Fais chauffer 40 cl d'eau par personne, ajoute pak-choï et tofu.",
      "Ajoute les udon 3 min.",
      "Hors du feu, délaye le miso.",
    ],
  },
  {
    id: "saumonlaque", name: "Saumon laqué, riz & brocoli", cuisine: "jp", minutes: 25, protein: "poisson",
    ingredients: {saumon: 125,riz: 75,brocoli: 150,soja: 15},
    steps: [
      "Lance le riz, cuis le brocoli à la vapeur.",
      "Poêle le saumon, ajoute soja et un peu de miel en fin de cuisson.",
      "Sers ensemble.",
    ],
  },
  {
    id: "yakisoba", name: "Yakisoba au porc", cuisine: "jp", minutes: 20, protein: "porc",
    ingredients: {nouilles: 80,chou: 80,carottes: 50,porchache: 60,soja: 15},
    steps: [
      "Cuis les nouilles.",
      "Saute porc, chou et carotte.",
      "Ajoute nouilles et soja, 2 min.",
    ],
  },
  {
    id: "bibimbap", name: "Bibimbap au bœuf", cuisine: "kr", minutes: 35, protein: "boeuf", spicy: true,
    ingredients: {riz: 85,boeuf: 80,oeufs: 1,epinards: 60,carottes: 60,gochujang: 15,sesame: 5},
    steps: [
      "Cuis le riz. Saute séparément bœuf, carottes et épinards.",
      "Cuis un œuf au plat.",
      "Dispose sur le riz avec gochujang et huile de sésame.",
    ],
  },
  {
    id: "bibimtofu", name: "Bibimbap au tofu", cuisine: "kr", minutes: 30, protein: "tofu", spicy: true,
    ingredients: {riz: 85,tofu: 100,epinards: 60,carottes: 60,germes: 60,gochujang: 15,sesame: 5},
    steps: [
      "Cuis le riz, dore le tofu.",
      "Saute séparément carottes, épinards et pousses de soja.",
      "Dispose sur le riz avec gochujang et sésame.",
    ],
  },
  {
    id: "kimchirice", name: "Riz sauté au kimchi & œuf", cuisine: "kr", minutes: 15, protein: "oeuf", spicy: true,
    ingredients: {riz: 85,kimchi: 80,oeufs: 1,sesame: 5},
    steps: [
      "Saute le kimchi 3 min.",
      "Ajoute le riz froid, saute 5 min.",
      "Sers avec un œuf au plat et un filet de sésame.",
    ],
  },
  {
    id: "currythai", name: "Curry rouge thaï au poulet", cuisine: "se", minutes: 25, protein: "poulet", spicy: true,
    ingredients: {poulet: 120,coco: 100,currypaste: 15,poivrons: 0.3,riz: 75},
    steps: [
      "Fais revenir la pâte de curry 1 min.",
      "Ajoute lait de coco, poulet et poivron, 12 min.",
      "Sers sur le riz.",
    ],
  },
  {
    id: "currythaiveg", name: "Curry rouge thaï au tofu", cuisine: "se", minutes: 25, protein: "tofu", spicy: true,
    ingredients: {tofu: 100,coco: 100,currypaste: 15,courgettes: 100,riz: 75},
    steps: [
      "Choisis une pâte de curry sans crevettes si tu es végan.",
      "Fais revenir la pâte, ajoute coco, tofu et courgette, 12 min.",
      "Sers sur le riz.",
    ],
  },
  {
    id: "padthai", name: "Pad thaï aux crevettes", cuisine: "se", minutes: 25, protein: "mer",
    ingredients: {nouillesriz: 80,crevettes: 80,oeufs: 1,germes: 60,cacahuetes: 15,nuocmam: 10,citronvert: 0.3},
    steps: [
      "Fais tremper les nouilles 10 min dans l'eau chaude.",
      "Saute crevettes, puis œuf brouillé, nouilles, nuoc-mâm et un peu de sucre.",
      "Ajoute pousses de soja, cacahuètes et citron vert.",
    ],
  },
  {
    id: "padthaitofu", name: "Pad thaï au tofu", cuisine: "se", minutes: 25, protein: "tofu",
    ingredients: {nouillesriz: 80,tofu: 100,germes: 60,cacahuetes: 15,soja: 15,citronvert: 0.3},
    steps: [
      "Fais tremper les nouilles 10 min.",
      "Dore le tofu, ajoute nouilles, soja et un peu de sucre.",
      "Ajoute pousses, cacahuètes et citron vert.",
    ],
  },
  {
    id: "bobun", name: "Bo bun au bœuf", cuisine: "se", minutes: 30, protein: "boeuf",
    ingredients: {nouillesriz: 70,boeuflam: 100,carottes: 60,concombre: 0.25,cacahuetes: 15,nuocmam: 15,herbes: 0.2},
    steps: [
      "Cuis les vermicelles, rince-les à l'eau froide.",
      "Saisis le bœuf avec oignon et citronnelle si tu en as.",
      "Dresse sur crudités et herbes, arrose de sauce nuoc-mâm.",
    ],
  },
  {
    id: "porccaramel", name: "Porc au caramel", cuisine: "se", minutes: 40, protein: "porc",
    ingredients: {cotesporc: 150,nuocmam: 10,oignons: 30,riz: 75},
    steps: [
      "Fais un caramel brun avec 1 c. à s. de sucre par personne.",
      "Ajoute porc en cubes, oignon, nuoc-mâm et un peu d'eau.",
      "Mijote 30 min, sers avec le riz.",
    ],
  },
  {
    id: "dahl", name: "Dahl de lentilles corail", cuisine: "in", minutes: 30, protein: "legumineuse",
    ingredients: {lentillesC: 80,coco: 60,tomatesC: 100,oignons: 50,riz: 70},
    steps: [
      "Fais revenir l'oignon avec cumin et curcuma.",
      "Ajoute lentilles, tomates, coco et deux volumes d'eau.",
      "Cuis 20 min, sers avec le riz.",
    ],
  },
  {
    id: "currycoco", name: "Curry coco pois chiches & épinards", cuisine: "in", minutes: 25, protein: "legumineuse",
    ingredients: {poischiches: 110,coco: 100,tomatesC: 100,epinards: 80,oignons: 50,riz: 75},
    steps: [
      "Fais revenir l'oignon avec le curry.",
      "Ajoute tomates, coco, pois chiches et épinards.",
      "Mijote 15 min, sers sur le riz.",
    ],
  },
  {
    id: "chana", name: "Chana masala", cuisine: "in", minutes: 30, protein: "legumineuse", spicy: true,
    ingredients: {poischiches: 150,tomatesC: 120,oignons: 50,gingembre: 5,riz: 70},
    steps: [
      "Fais revenir oignon, gingembre, garam masala et piment.",
      "Ajoute tomates et pois chiches, 20 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "tikka", name: "Poulet tikka masala", cuisine: "in", minutes: 40, protein: "poulet",
    ingredients: {poulet: 130,yaourt: 50,tomatesC: 100,creme: 30,oignons: 40,riz: 75},
    steps: [
      "Marine le poulet dans yaourt et épices tikka 15 min.",
      "Grille-le, puis mijote-le dans une sauce tomate-oignon 15 min.",
      "Ajoute la crème, sers avec le riz.",
    ],
  },
  {
    id: "palak", name: "Palak paneer", cuisine: "in", minutes: 30, protein: "fromage",
    ingredients: {paneer: 90,epinards: 150,oignons: 40,creme: 20,gingembre: 5},
    steps: [
      "Dore le paneer en cubes, réserve.",
      "Fais revenir oignon et gingembre, ajoute épinards et garam masala, 10 min.",
      "Mixe grossièrement, ajoute crème et paneer.",
    ],
  },
  {
    id: "aloogobi", name: "Aloo gobi (chou-fleur & pomme de terre)", cuisine: "in", minutes: 35, protein: "legume",
    ingredients: {choufleur: 200,pdt: 150,tomates: 80,oignons: 40},
    steps: [
      "Fais revenir l'oignon avec cumin et curcuma.",
      "Ajoute pommes de terre, chou-fleur, tomates et un fond d'eau.",
      "Couvre 25 min.",
    ],
  },
  {
    id: "currychoufleur", name: "Poulet curry coco & chou-fleur", cuisine: "in", minutes: 30, protein: "poulet",
    ingredients: {poulet: 130,coco: 80,choufleur: 200},
    steps: [
      "Fais rôtir le chou-fleur 20 min au four.",
      "Saisis le poulet, ajoute curry et coco, 10 min.",
      "Sers ensemble.",
    ],
  },
  {
    id: "mujadara", name: "Moujaddara (lentilles, riz & oignons)", cuisine: "mo", minutes: 45, protein: "legumineuse",
    ingredients: {lentillesV: 70,riz: 50,oignons: 120},
    steps: [
      "Cuis les lentilles 15 min.",
      "Ajoute le riz, cumin et eau, 20 min.",
      "Sers sous une montagne d'oignons caramélisés.",
    ],
  },
  {
    id: "shawarma", name: "Shawarma de poulet en pita", cuisine: "mo", minutes: 30, protein: "poulet",
    ingredients: {poulet: 130,pita: 1.5,yaourt: 40,tomates: 60,concombre: 0.25},
    steps: [
      "Marine le poulet avec cumin, paprika, citron.",
      "Saisis-le en lanières.",
      "Garnis les pitas avec crudités et sauce yaourt.",
    ],
  },
  {
    id: "falafel", name: "Falafels au four, houmous & pita", cuisine: "mo", minutes: 40, protein: "legumineuse",
    ingredients: {poischiches: 180,tahini: 20,pita: 1,tomates: 60,herbes: 0.25},
    steps: [
      "Mixe la moitié des pois chiches avec herbes, oignon, cumin. Forme des boulettes, 20 min à 200 °C.",
      "Mixe le reste avec tahini, citron et ail pour le houmous.",
      "Sers avec pita et tomates.",
    ],
  },
  {
    id: "taboule", name: "Taboulé libanais & œufs durs", cuisine: "mo", minutes: 25, protein: "oeuf",
    ingredients: {boulgour: 70,tomates: 120,concombre: 0.3,herbes: 0.5,citrons: 0.5,oeufs: 2},
    steps: [
      "Fais gonfler le boulgour à l'eau chaude.",
      "Mélange avec tomates, concombre, beaucoup d'herbes, citron et huile.",
      "Sers avec les œufs durs.",
    ],
  },
  {
    id: "tacos", name: "Tacos express au bœuf", cuisine: "lat", minutes: 20, protein: "boeuf",
    ingredients: {tortillas: 2,boeuf: 110,poivrons: 0.5,tomates: 80,fromage: 25},
    steps: [
      "Saisis le bœuf avec paprika et cumin, ajoute le poivron.",
      "Coupe les tomates en dés.",
      "Garnis les tortillas.",
    ],
  },
  {
    id: "chili", name: "Chili con carne", cuisine: "lat", minutes: 40, protein: "boeuf", spicy: true,
    ingredients: {boeuf: 100,haricots: 100,tomatesC: 130,oignons: 50,poivrons: 0.3,riz: 70},
    steps: [
      "Fais dorer oignon et bœuf avec les épices.",
      "Ajoute tomates, poivron, haricots.",
      "Mijote 25 min, sers avec le riz.",
    ],
  },
  {
    id: "chilisin", name: "Chili sin carne", cuisine: "lat", minutes: 35, protein: "legumineuse", spicy: true,
    ingredients: {haricots: 160,tomatesC: 130,oignons: 50,poivrons: 0.5,riz: 70},
    steps: [
      "Fais revenir oignon et poivron avec les épices.",
      "Ajoute tomates et haricots.",
      "Mijote 20 min, sers avec le riz.",
    ],
  },
  {
    id: "burritobowl", name: "Burrito bowl aux haricots noirs", cuisine: "lat", minutes: 25, protein: "legumineuse",
    ingredients: {riz: 75,haricotsnoirs: 120,mais: 50,avocat: 0.5,tomates: 60,citronvert: 0.25},
    steps: [
      "Cuis le riz avec un peu de citron vert.",
      "Réchauffe les haricots avec cumin.",
      "Dresse avec maïs, avocat et tomates.",
    ],
  },
  {
    id: "feijoada", name: "Feijoada (haricots noirs & saucisse)", cuisine: "lat", minutes: 45, protein: "porc",
    ingredients: {haricotsnoirs: 150,saucisse: 100,oignons: 40,riz: 70},
    steps: [
      "Fais dorer saucisse et oignon.",
      "Ajoute haricots, laurier, un peu d'eau, 30 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "arrozpollo", name: "Arroz con pollo", cuisine: "lat", minutes: 50, protein: "poulet",
    ingredients: {riz: 85,cuisses: 200,poivrons: 0.4,petitspois: 50,tomatesC: 60},
    steps: [
      "Dore le poulet, ajoute poivron et tomates.",
      "Ajoute riz, curcuma, 2 volumes d'eau.",
      "Cuis 25 min à couvert, ajoute les petits pois en fin de cuisson.",
    ],
  },
  {
    id: "colombo", name: "Colombo de poulet", cuisine: "ant", minutes: 50, protein: "poulet", spicy: true,
    ingredients: {cuisses: 220,pdt: 120,courgettes: 80,oignons: 40,riz: 60},
    steps: [
      "Dore le poulet avec oignon et poudre de colombo.",
      "Ajoute légumes et eau à mi-hauteur.",
      "Mijote 35 min, sers avec le riz.",
    ],
  },
  {
    id: "rougail", name: "Rougail saucisses", cuisine: "ant", minutes: 40, protein: "porc", spicy: true,
    ingredients: {saucisse: 130,tomates: 150,oignons: 50,gingembre: 5,riz: 75},
    steps: [
      "Fais dorer les saucisses en tronçons.",
      "Ajoute oignon, gingembre, piment puis tomates.",
      "Mijote 25 min, sers avec le riz.",
    ],
  },
  {
    id: "rizharicots", name: "Riz haricots rouges & poulet", cuisine: "ant", minutes: 50, protein: "poulet",
    ingredients: {riz: 80,haricots: 100,cuisses: 180,oignons: 30},
    steps: [
      "Dore le poulet assaisonné, ajoute de l'eau, 30 min.",
      "Cuis le riz avec les haricots et leur jus, thym et oignon.",
      "Sers ensemble.",
    ],
  },
  {
    id: "sauceschien", name: "Poisson grillé sauce chien", cuisine: "ant", minutes: 30, protein: "poisson",
    ingredients: {tilapia: 160,citronvert: 0.5,oignons: 30,herbes: 0.2,riz: 75},
    steps: [
      "Marine le poisson au citron vert, grille-le 15 min.",
      "Mélange oignon, herbes, citron vert, huile et eau chaude pour la sauce chien.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "burger", name: "Burger maison & potatoes", cuisine: "us", minutes: 35, protein: "boeuf",
    ingredients: {painburger: 1,boeuf: 130,fromage: 25,tomates: 50,pdt: 200},
    steps: [
      "Rôtis les potatoes 25 min à 210 °C.",
      "Saisis les steaks, ajoute le fromage.",
      "Monte les burgers avec tomate.",
    ],
  },
  {
    id: "burgerveg", name: "Burger aux haricots noirs", cuisine: "us", minutes: 40, protein: "legumineuse",
    ingredients: {painburger: 1,haricotsnoirs: 130,oeufs: 0.5,mais: 30,tomates: 50,pdt: 200},
    steps: [
      "Écrase haricots, maïs, œuf et cumin, forme des galettes.",
      "Dore-les 4 min par face, rôtis les potatoes.",
      "Monte les burgers.",
    ],
  },
  {
    id: "burgersanspain", name: "Burger sans pain au fromage", cuisine: "us", minutes: 15, protein: "boeuf",
    ingredients: {boeuf: 170,fromage: 30,oeufs: 1},
    steps: [
      "Saisis les steaks 3 min par face.",
      "Ajoute le fromage pour qu'il fonde.",
      "Sers avec un œuf au plat.",
    ],
  },
  {
    id: "macncheese", name: "Mac & cheese", cuisine: "us", minutes: 25, protein: "fromage",
    ingredients: {pates: 110,lait: 120,fromage: 50,beurre: 10},
    steps: [
      "Cuis les pâtes.",
      "Fais fondre beurre, lait et fromage en sauce.",
      "Mélange, gratine 10 min si tu as le temps.",
    ],
  },
  {
    id: "crevettesbeurre", name: "Crevettes sautées au beurre & œuf", cuisine: "us", minutes: 15, protein: "mer",
    ingredients: {crevettes: 130,beurre: 10,oeufs: 1},
    steps: [
      "Saute les crevettes au beurre 4 min.",
      "Sers avec un œuf mollet.",
    ],
  },
];

export const RECIPES_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
