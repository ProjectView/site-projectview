/**
 * Script de seed — Importe les articles dans Firestore
 * Usage: node scripts/seed-articles.mjs
 */

import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ─── Charger .env.local ───────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

// ─── Contenu des articles ─────────────────────────────────────────────────────
const articles = [
  {
    title: "Comment les écrans interactifs révolutionnent l'expérience en magasin",
    slug: 'comment-les-ecrans-interactifs-revolutionnent-l',
    excerpt: "Découvrez comment les écrans interactifs transforment radicalement l'expérience client en point de vente, boostant l'engagement et les conversions.",
    content: `L'ère des affiches statiques est révolue. Dans les showrooms, les boutiques et les espaces professionnels d'aujourd'hui, les écrans interactifs sont devenus des acteurs incontournables de l'expérience client. Voici pourquoi et comment cette révolution silencieuse change tout.

## Une attention captée en moins de 3 secondes

Selon les études sur le comportement des consommateurs, un acheteur prend sa décision d'entrer ou de s'arrêter devant une vitrine en moins de 3 secondes. Les contenus statiques peinent à déclencher ce réflexe. À l'inverse, un écran dynamique affichant des contenus animés, contextuels et interactifs génère jusqu'à 400 % plus d'attention que son équivalent papier.

Chez Projectview, nous observons systématiquement ce phénomène chez nos clients retail : dès l'installation des premiers écrans interactifs, le temps passé devant le point de communication double ou triple en quelques semaines.

## Du spectateur à l'acteur : l'interactivité qui convertit

L'écran dynamique informe. L'écran interactif engage. La nuance est fondamentale.

Lorsqu'un client peut toucher un écran pour explorer un catalogue, configurer un produit, comparer des options ou demander une démonstration, il n'est plus passif — il est acteur de son expérience d'achat. Ce passage de la passivité à l'action est directement corrélé à une hausse des conversions.

Nos données clients montrent une augmentation moyenne de 340 % de l'engagement et une hausse de 23 % du panier moyen dans les espaces équipés d'écrans interactifs.

## Des contenus qui s'adaptent en temps réel

L'un des avantages les moins connus des solutions d'affichage dynamique modernes est leur capacité à adapter les contenus affichés en fonction du contexte : l'heure de la journée, la météo, le niveau de fréquentation, les promotions en cours ou même la présence détectée de clients devant l'écran.

Cette intelligence contextuelle transforme chaque écran en un vendeur silencieux qui adapte son discours à chaque situation — sans intervention humaine.

## Communication interne : un usage souvent négligé

Au-delà du retail, les écrans interactifs trouvent un usage puissant dans la communication interne des entreprises. Affichage des indicateurs de performance, diffusion des informations RH, annonces d'événements, formations interactives : l'écran remplace les panneaux d'affichage papier avec une efficacité décuplée.

Des études montrent que l'information affichée sur écran dynamique atteint 95 % des collaborateurs, contre seulement 30 % pour les supports papier classiques.

## Par où commencer ?

La mise en place d'une solution d'affichage interactif ne nécessite pas de révolutionner votre espace d'un coup. Projectview accompagne ses clients dans une démarche progressive : audit de l'espace, définition des objectifs, choix des emplacements stratégiques, création des contenus et formation des équipes.

Un seul écran bien placé, avec un contenu pertinent, peut transformer l'expérience client de votre point de vente. C'est souvent le meilleur point de départ.`,
    category: 'Affichage Dynamique',
    categorySlug: 'affichage-dynamique',
    date: '15 Jan 2025',
    author: 'Sophie Martin',
    authorBio: "Experte en solutions d'affichage dynamique chez Projectview",
    readTime: '5 min',
    coverImage: '/images/blog/affichage-dynamique-retail-2025.jpeg',
  },
  {
    title: 'VR immobilière : vendre un bien avant sa construction',
    slug: 'vr-immobiliere-vente-avant-construction',
    excerpt: "La réalité virtuelle permet aux promoteurs de proposer des visites immersives de projets encore sur plan, transformant radicalement le processus de vente.",
    content: `La réalité virtuelle révolutionne le secteur immobilier. Fini les maquettes en carton et les plans 2D difficiles à interpréter. Aujourd'hui, les promoteurs les plus innovants font visiter des appartements et des maisons qui n'existent pas encore — et vendent avant même de poser la première pierre.

## Visualiser l'invisible : le défi du neuf

Vendre un bien en VEFA (Vente en l'État Futur d'Achèvement) a toujours représenté un défi de taille. Comment convaincre un acheteur de s'engager sur des centaines de milliers d'euros pour un appartement qu'il ne peut pas voir, toucher, ni ressentir ?

Les plans architecturaux restent abstraits pour la majorité des acheteurs. Les perspectives 3D statiques manquent d'immersion. La visite VR résout ces deux problèmes d'un coup.

## Ce que permet concrètement la VR immobilière

Avec un casque de réalité virtuelle et une application dédiée, l'acheteur potentiel peut se promener librement dans son futur appartement, à l'échelle 1:1. Il peut regarder par les fenêtres, apprécier la hauteur sous plafond, évaluer la luminosité à différentes heures de la journée, changer les revêtements de sol ou la couleur des murs en temps réel.

Ce niveau d'immersion crée une projection émotionnelle immédiate. L'acheteur ne visualise plus un plan — il vit dans son futur chez-lui. Cette différence psychologique est déterminante dans la décision d'achat.

## Des chiffres qui parlent d'eux-mêmes

Les promoteurs qui ont déployé des espaces de vente VR avec Projectview observent systématiquement des résultats probants. Le taux de réservation sur plan augmente en moyenne de 67 %. Le délai moyen entre la première visite et la signature du contrat de réservation se réduit de 40 %.

Plus révélateur encore : les acheteurs ayant bénéficié d'une visite VR expriment un niveau de satisfaction nettement supérieur une fois livrés — car leurs attentes étaient précisément calibrées sur la réalité.

## La table tactile de négociation : le parfait complément

La visite VR s'intègre idéalement dans un espace de vente équipé d'une table tactile de négociation. Sur cette table, le commercial et le client peuvent explorer ensemble le plan de masse, sélectionner un lot, personnaliser les finitions et simuler le financement — le tout sur une interface intuitive et collaborative.

Ce duo VR + table tactile représente aujourd'hui le standard des espaces de vente immobiliers les plus performants.

## Une technologie accessible, pas réservée aux grands groupes

La réalité virtuelle immobilière n'est plus réservée aux promoteurs nationaux avec des budgets conséquents. Projectview propose des solutions modulables adaptées à toutes les tailles de structures, de l'agence indépendante au promoteur régional.

L'investissement est rapidement rentabilisé : une seule vente supplémentaire par trimestre, directement attribuable à la VR, suffit généralement à couvrir le coût annuel de la solution.`,
    category: 'Présentation Innovante',
    categorySlug: 'presentation-innovante',
    date: '8 Jan 2025',
    author: 'Thomas Bernard',
    authorBio: 'Directeur technique et passionné de réalité virtuelle',
    readTime: '4 min',
    coverImage: '/images/blog/vr-immobiliere-vente-avant-construction.jpeg',
  },
  {
    title: "L'IA au service de la relation client B2B",
    slug: 'ia-relation-client-b2b',
    excerpt: "Comment un assistant IA personnalisé peut réduire le temps de réponse et améliorer la satisfaction client dans un contexte professionnel.",
    content: `Dans un environnement B2B où la réactivité est devenue un critère de sélection à part entière, les entreprises qui répondent en minutes plutôt qu'en heures prennent un avantage concurrentiel décisif. L'intelligence artificielle rend cette réactivité possible à toute heure, sans augmenter les effectifs.

## Le problème que tout le monde connaît mais que personne ne mesure

Combien de leads votre équipe commerciale perd-elle chaque semaine faute de réponse assez rapide ? Combien de clients existants appellent votre support pour des questions récurrentes auxquelles une FAQ bien construite pourrait répondre en 30 secondes ?

Dans la majorité des entreprises B2B interrogées, 60 à 70 % des demandes entrantes portent sur les mêmes 20 sujets. Des questions sur les délais, les tarifs, les caractéristiques techniques, les conditions de SAV. Des informations que votre équipe maîtrise parfaitement — mais qui monopolisent un temps précieux.

## Un assistant IA entraîné sur votre réalité

L'assistant IA de Projectview n'est pas un chatbot générique. Il est entraîné sur vos propres documents : catalogues produits, fiches techniques, conditions générales, FAQ interne, historiques de tickets support, guides d'utilisation.

Le résultat : un assistant qui répond avec le vocabulaire de votre secteur, en respectant votre positionnement, et qui sait orienter vers le bon interlocuteur humain quand la demande le nécessite.

## 24h/24, 7j/7, sans temps d'attente

Le client B2B ne travaille pas toujours aux heures de bureau. Un directeur technique qui étudie vos solutions le soir ou le week-end apprécie de pouvoir obtenir des réponses précises immédiatement. Un prospect qui n'obtient pas de réponse rapide passe simplement à la concurrence.

L'assistant IA prend en charge ces interactions nocturnes et week-end sans surcoût, avec une qualité de réponse constante.

## Les résultats observés chez nos clients

Après déploiement d'un assistant IA personnalisé, nos clients observent en moyenne : une réduction de 80 % des demandes de premier niveau traitées par des humains, un temps de réponse moyen passant de plusieurs heures à moins de 30 secondes, et une augmentation de 35 % du score de satisfaction client mesuré en post-interaction.

L'équipe commerciale et support se retrouve libérée des tâches répétitives et peut se concentrer sur les demandes à forte valeur ajoutée : les négociations complexes, les demandes sur-mesure, la fidélisation des grands comptes.

## L'intégration dans votre écosystème existant

L'assistant IA Projectview s'intègre nativement dans les environnements les plus courants : site web, CRM (HubSpot, Salesforce), messagerie d'entreprise (Teams, Slack), ou même directement dans vos écrans interactifs en showroom.

Chaque interaction est tracée et analysée, fournissant à votre équipe des insights précieux sur les questions les plus fréquentes, les points de friction dans votre discours commercial, et les opportunités d'amélioration de vos supports.`,
    category: 'Assistant IA',
    categorySlug: 'assistant-ia',
    date: '2 Jan 2025',
    author: 'Claire Rousseau',
    authorBio: 'Spécialiste IA et automatisation chez Projectview',
    readTime: '6 min',
    coverImage: '/images/blog/ia-relation-client-b2b.jpeg',
  },
  {
    title: 'Les tendances de la collaboration hybride en 2025',
    slug: 'tendances-collaboration-hybride-2025',
    excerpt: "Le travail hybride est là pour rester. Découvrez les technologies qui rendent la collaboration à distance aussi naturelle qu'en présentiel.",
    content: `Le travail hybride n'est plus une parenthèse post-pandémique. C'est le nouveau mode de fonctionnement permanent de millions d'entreprises à travers le monde. En 2025, la question n'est plus "faut-il adopter le travail hybride ?" mais "comment le rendre vraiment efficace ?". La réponse passe en grande partie par la technologie de collaboration.

## La fracture entre présentiels et distants : le problème n°1

Dans la plupart des réunions hybrides mal équipées, il existe deux classes de participants : ceux qui sont dans la salle et ceux qui sont sur l'écran. Les premiers vivent la réunion pleinement. Les seconds peinent à suivre, à intervenir, à voir les documents partagés sur le tableau blanc physique.

Cette asymétrie d'expérience nuit à l'engagement, à la productivité et, à terme, à la cohésion d'équipe. La résoudre est l'enjeu central de la collaboration hybride en 2025.

## Les solutions qui effacent la distance

Les nouvelles solutions de collaboration tout-en-un — comme celles déployées par Projectview — intègrent dans un seul dispositif une caméra intelligente à grand angle, une barre audio à formation de faisceau, un écran haute résolution et un système de partage sans fil multiplateforme.

La caméra détecte automatiquement les personnes qui parlent et zoome sur elles. Le son est capté à 360° et retransmis sans écho ni effet de salle. Résultat : les participants distants voient et entendent aussi bien que s'ils étaient dans la pièce.

## Le partage de contenu : simple comme un geste

L'un des points de friction les plus courants en réunion hybride est le partage de contenu. Les câbles qui ne sont pas compatibles, les adaptateurs manquants, les pilotes à installer : chaque minute perdue en connexion est une minute gagnée sur l'ennui et perdue sur la productivité.

Les solutions modernes permettent un partage de contenu sans fil depuis n'importe quel appareil — PC Windows, Mac, iPad, smartphone Android — en moins de 5 secondes, sans application à installer.

## L'annotation collaborative en temps réel

En 2025, les meilleures salles de réunion hybrides permettent à tous les participants, qu'ils soient dans la salle ou à distance, d'annoter simultanément les documents partagés. Le brainstorming, la revue de design, la validation de documents : toutes ces activités qui semblaient réservées au présentiel deviennent naturellement hybrides.

## Ce que nos clients observent après équipement

Les entreprises qui ont fait confiance à Projectview pour équiper leurs salles de réunion rapportent des résultats homogènes : une réduction de 73 % du temps de connexion et de mise en route, une hausse de 90 % du taux de satisfaction des participants en réunion hybride, et une diminution significative des réunions "inutiles" — car lorsque la réunion est efficace, on en fait moins mais mieux.

## Quel budget prévoir en 2025 ?

La bonne nouvelle : les solutions de collaboration hybride de qualité professionnelle sont devenues nettement plus accessibles. Un équipement complet pour une salle de réunion standard (6 à 10 personnes) est aujourd'hui disponible à partir de quelques milliers d'euros, avec une installation en quelques heures et une prise en main immédiate.`,
    category: 'Collaboration',
    categorySlug: 'collaboration',
    date: '20 Déc 2024',
    author: 'Pierre Lefèvre',
    authorBio: 'Consultant en transformation digitale des espaces de travail',
    readTime: '5 min',
    coverImage: '/images/blog/tendances-collaboration-hybride-2025.jpeg',
  },
  {
    title: "Retail 2025 : l'expérience client réinventée par la technologie",
    slug: 'retail-2025-experience-client',
    excerpt: "Dans un monde où le e-commerce domine, le magasin physique doit se réinventer. L'expérience client devient le seul avantage concurrentiel durable.",
    content: `Le retail physique n'est pas mort — il se transforme. Face à la commodité du e-commerce, le magasin ne peut plus se contenter de stocker et de vendre des produits. Il doit devenir une destination, une expérience, un souvenir. En 2025, les enseignes qui tirent leur épingle du jeu ont toutes compris cette vérité fondamentale : ce qu'on vend en ligne, c'est un produit. Ce qu'on vend en magasin, c'est une émotion.

## Le magasin comme scène d'expérience

Les enseignes les plus innovantes repensent entièrement le rôle de leurs points de vente. Ce ne sont plus des entrepôts de produits accessibles au public — ce sont des scènes d'expérience soigneusement mises en scène pour créer des émotions, des souvenirs et du désir.

Un showroom d'aménagement intérieur où les clients peuvent projeter leurs propres photos sur les meubles exposés. Un magasin de sport où un écran interactif analyse votre foulée et recommande la chaussure idéale. Une boutique de cosmétiques où un miroir intelligent simule le rendu de différents maquillages sur votre visage.

Ces expériences ne peuvent pas être reproduites en ligne. C'est précisément leur force.

## La technologie au service de l'humain, pas à sa place

Une erreur fréquente consiste à voir la technologie en magasin comme un moyen de réduire les effectifs. Les enseignes les plus performantes adoptent une vision inverse : la technologie libère les vendeurs des tâches à faible valeur ajoutée — chercher une information produit, vérifier le stock, traiter une transaction basique — pour qu'ils se concentrent sur ce qu'un écran ne peut pas faire : créer une relation, conseiller avec empathie, fidéliser.

## Les données qui guident l'expérience

Les écrans interactifs et les solutions d'affichage dynamique modernes ne sont pas seulement des outils de communication — ce sont des capteurs d'attention. Combien de personnes s'arrêtent devant quel contenu ? Combien de temps regardent-elles ? Quels produits sont les plus touchés sur les bornes interactives ?

Ces données permettent d'optimiser en continu l'agencement, les contenus affichés et les offres proposées — avec une précision impossible à atteindre avec les méthodes traditionnelles.

## Personnalisation : le futur est déjà là

En 2025, les clients s'attendent à être reconnus et adressés personnellement, y compris en magasin physique. Les solutions de reconnaissance client (avec consentement) permettent d'afficher des recommandations personnalisées sur les écrans au moment où le client s'en approche.

Ce niveau de personnalisation, jadis réservé au digital, est désormais accessible dans le monde physique. Les enseignes qui l'adoptent observent des hausses significatives du taux de transformation et de la valeur du panier moyen.

## Par où commencer sa transformation ?

La transformation digitale du retail ne se fait pas en un jour. Projectview accompagne les enseignes dans une approche progressive, en commençant par les points de contact à plus fort impact : l'entrée du magasin, les zones de produits phares, et l'espace caisse ou conseil.

Chaque étape génère des données et des résultats mesurables, qui justifient les investissements suivants. C'est une transformation qui se finance elle-même.`,
    category: 'Tendances',
    categorySlug: 'tendances',
    date: '12 Déc 2024',
    author: 'Sophie Martin',
    authorBio: "Experte en solutions d'affichage dynamique chez Projectview",
    readTime: '4 min',
    coverImage: '/images/blog/retail-2025-experience-client.jpeg',
  },
  {
    title: 'Comment choisir sa table tactile de négociation',
    slug: 'choisir-table-tactile-negociation',
    excerpt: 'Guide complet pour sélectionner la table tactile idéale pour vos espaces de vente et de présentation.',
    content: `La table tactile est devenue un outil incontournable dans les showrooms et les espaces de négociation. Mais comment choisir le bon modèle ? Entre taille, résolution, système d'exploitation, logiciels et budget, les critères à évaluer sont nombreux. Ce guide vous donne les clés pour faire le bon choix.

## Taille et résolution : la base de tout

La taille dépend avant tout de votre usage et de la configuration de votre espace. Pour une négociation en face-à-face entre deux personnes, un modèle 43 pouces suffit amplement. Pour un showroom accueillant des groupes de 4 à 8 personnes autour de la table, visez 55 à 65 pouces. Pour des présentations à plusieurs parties prenantes debout autour de la table, les formats 75 pouces et au-delà s'imposent.

La résolution 4K (3840 × 2160 pixels) est aujourd'hui le standard recommandé pour toute table tactile professionnelle. Elle garantit une lisibilité parfaite des plans, des photos haute définition et des documents techniques, même en zoom maximum.

## Technologie tactile : capacitif ou infrarouge ?

Deux grandes technologies s'affrontent sur le marché : le tactile capacitif (comme les smartphones) et le tactile infrarouge (détection par grille de rayons IR).

Le capacitif offre une précision et une fluidité supérieures, idéales pour les applications de dessin ou d'annotation fine. L'infrarouge est plus adapté aux grandes surfaces, moins coûteux et fonctionne avec n'importe quel objet (doigt ganté, stylet non actif).

Pour un usage showroom et négociation, l'infrarouge représente le meilleur rapport qualité-prix dans la majorité des cas.

## Le système d'exploitation : Android ou Windows ?

Le choix du système d'exploitation conditionne les applications disponibles et les possibilités d'intégration.

Android offre une interface fluide, une consommation énergétique moindre et une large bibliothèque d'applications tactiles natives. Il est idéal si vous utilisez principalement des applications développées spécifiquement pour la table.

Windows ouvre l'accès à l'ensemble des logiciels métier classiques : logiciels de présentation immobilière, configurateurs 3D, tableurs, CRM. C'est le choix privilégié des entreprises souhaitant utiliser leurs outils existants directement sur la table.

## Les logiciels : le vrai différenciateur

La table tactile n'est qu'un écran sans les logiciels qui l'animent. C'est souvent là que se joue la vraie différence entre une installation transformante et un équipement sous-exploité.

Projectview propose et intègre les solutions logicielles les plus adaptées à votre secteur : configurateurs de produits, visites virtuelles, outils de co-design en temps réel, présentations commerciales interactives, et bien sûr notre assistant IA intégré pour répondre aux questions clients directement depuis la table.

## Durabilité et usage intensif

Une table tactile en environnement professionnel est utilisée plusieurs heures par jour, parfois par des dizaines de personnes différentes. Les critères de robustesse sont donc essentiels : verre trempé anti-rayures, certifications IP pour la résistance aux projections, châssis en aluminium, garantie constructeur d'au moins 3 ans.

Méfiez-vous des modèles d'entrée de gamme dont le coût d'achat attractif est rapidement compensé par des pannes fréquentes et des coûts de maintenance élevés.

## Notre recommandation

Pour la grande majorité des usages showroom et négociation en B2B, une table tactile 55 pouces 4K infrarouge sous Windows, avec un logiciel de présentation sectoriel adapté, représente le meilleur compromis performance/prix/évolutivité. C'est cette configuration que Projectview déploie le plus fréquemment chez ses clients, avec des résultats mesurables dès les premières semaines d'utilisation.`,
    category: 'Présentation Innovante',
    categorySlug: 'presentation-innovante',
    date: '5 Déc 2024',
    author: 'Thomas Bernard',
    authorBio: 'Directeur technique et passionné de réalité virtuelle',
    readTime: '7 min',
    coverImage: '/images/blog/choisir-table-tactile-negociation.jpeg',
  },
];

// ─── Seed Firestore ───────────────────────────────────────────────────────────
const now = new Date().toISOString();

console.log(`\nSeeding ${articles.length} articles into Firestore...\n`);

for (const article of articles) {
  await db.collection('articles').doc(article.slug).set({
    ...article,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`  ✓ ${article.title}`);
}

console.log('\nDone! All articles are now in Firestore.\n');
process.exit(0);
