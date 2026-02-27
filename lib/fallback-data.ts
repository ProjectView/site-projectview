// ==========================================
// Centralized fallback data for all pages
// Used when Strapi CMS is offline
// ==========================================

export interface Solution {
  title: string;
  slug: string;
  icon: string; // lucide icon name
  accentColor: 'teal' | 'orange' | 'green' | 'gold';
  badgeText: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  features: { emoji: string; text: string }[];
  statLine: string;
  keyBenefits: { title: string; description: string }[];
}

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  date: string;
  author: string;
  authorBio: string;
  readTime: string;
  coverImage?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  solutionsRelated: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CaseStudy {
  title: string;
  slug: string;
  description: string;
  client: string;
  industry: string;
  solutionsUsed: string[];
  results: string;
}

// ==========================================
// Solutions
// ==========================================

export const solutions: Solution[] = [
  {
    title: 'Affichage Dynamique & Interactif',
    slug: 'affichage-dynamique',
    icon: 'radio',
    accentColor: 'teal',
    badgeText: "+340% d'engagement",
    subtitle: 'Vos affiches statiques ? Ignorées. Vos produits phares ? Inaperçus.',
    shortDescription: 'Dans un océan de sollicitations visuelles, votre communication se noie.',
    fullDescription:
      "L'affichage dynamique transforme vos espaces de communication en expériences visuelles captivantes. Nos écrans interactifs haute résolution, pilotés par une plateforme intuitive, diffusent vos contenus au bon moment, au bon endroit, à la bonne personne. Du showroom retail à la communication interne, chaque point de contact devient une opportunité d'engagement. Notre technologie s'adapte en temps réel aux flux de visiteurs, aux horaires et aux événements pour maximiser l'impact de chaque message.",
    features: [
      { emoji: '💡', text: 'Dynamique : contenus animés, temps réel' },
      { emoji: '👆', text: 'Interactif : touchez, déclenchez' },
      { emoji: '🏪', text: 'Showrooms retail' },
      { emoji: '📱', text: 'Communication interne' },
    ],
    statLine: "340% d'engagement en plus. Chaque point de contact devient mémorable.",
    keyBenefits: [
      { title: 'Contenus dynamiques', description: 'Animations, vidéos et flux en temps réel qui captent l\'attention instantanément.' },
      { title: 'Interactivité tactile', description: 'Vos visiteurs deviennent acteurs de leur expérience avec nos écrans tactiles.' },
      { title: 'Gestion centralisée', description: 'Pilotez tous vos écrans depuis une seule plateforme, où que vous soyez.' },
      { title: 'Analytics intégrés', description: 'Mesurez l\'engagement et optimisez vos contenus grâce à nos tableaux de bord.' },
    ],
  },
  {
    title: 'Solutions de Collaboration',
    slug: 'collaboration',
    icon: 'users',
    accentColor: 'orange',
    badgeText: '73% de temps gagné',
    subtitle: 'Et si vos réunions devenaient enfin productives ?',
    shortDescription: 'Chaque minute perdue en connexion est une opportunité manquée.',
    fullDescription:
      "Nos solutions de collaboration transforment vos salles de réunion en espaces de travail intelligents. Écrans visio tout-en-un, partage sans fil instantané, outils de co-création en temps réel — tout est pensé pour que la technologie disparaisse au profit de l'échange. Fini les câbles, les configurations interminables et les « vous m'entendez ? ». Connectez-vous en un geste et concentrez-vous sur l'essentiel : collaborer.",
    features: [
      { emoji: '📺', text: 'Écrans visio tout-en-un' },
      { emoji: '📡', text: 'Partage sans fil ultra-simplifié' },
      { emoji: '⚡', text: 'Connectez-vous en un geste' },
      { emoji: '🤝', text: 'Collaborez naturellement' },
    ],
    statLine: '73% de temps gagné en réunion.',
    keyBenefits: [
      { title: 'Plug & Play', description: 'Aucune configuration nécessaire. Branchez, allumez, collaborez.' },
      { title: 'Partage sans fil', description: 'Partagez votre écran depuis n\'importe quel appareil en un clic.' },
      { title: 'Visioconférence HD', description: 'Caméra, micro et haut-parleurs intégrés pour des réunions fluides.' },
      { title: 'Tableau blanc digital', description: 'Brainstormez ensemble sur un canvas infini, même à distance.' },
    ],
  },
  {
    title: 'Solutions de Présentation Innovante',
    slug: 'presentation-innovante',
    icon: 'presentation',
    accentColor: 'green',
    badgeText: '89% mémorisation',
    subtitle: 'Arrêtez de présenter. Donnez vie à vos projets.',
    shortDescription: 'Vos clients hochent la tête mais ne se projettent pas.',
    fullDescription:
      "Nos solutions de présentation innovante transforment la manière dont vous présentez vos projets. Tables tactiles de négociation, écrans immersifs pour showrooms, casques VR pour visualiser un bien avant sa construction — vos clients ne regardent plus, ils vivent l'expérience. L'immersion crée l'émotion, et l'émotion déclenche la décision. Passez du PowerPoint à l'expérience mémorable.",
    features: [
      { emoji: '🖥️', text: 'Écrans tactiles showroom' },
      { emoji: '🤝', text: 'Table tactile de négociation' },
      { emoji: '🏠', text: 'VR avant construction' },
    ],
    statLine: "89% de mémorisation. L'immersion qui convertit.",
    keyBenefits: [
      { title: 'Tables tactiles', description: 'Présentez vos projets sur une surface interactive qui impressionne.' },
      { title: 'Réalité virtuelle', description: 'Faites visiter un bien immobilier avant même la première pierre.' },
      { title: 'Configurateurs 3D', description: 'Vos clients personnalisent leur projet en temps réel.' },
      { title: 'Présentations immersives', description: 'Des murs d\'images aux écrans transparents, créez l\'effet wow.' },
    ],
  },
  {
    title: 'Assistant IA Personnalisé',
    slug: 'assistant-ia',
    icon: 'sparkles',
    accentColor: 'gold',
    badgeText: '10h gagnées/semaine',
    subtitle: 'Prise en charge immédiate 24/7, pour chaque utilisateur.',
    shortDescription: 'Vos équipes perdent un temps précieux sur les mêmes questions.',
    fullDescription:
      "Notre assistant IA personnalisé apprend de votre métier, de vos produits et de votre culture d'entreprise pour offrir des réponses précises et pertinentes à vos équipes et vos clients. Disponible 24/7, il automatise les tâches répétitives, recommande les bonnes solutions et libère du temps pour ce qui compte vraiment : la relation humaine. Intégré à vos outils existants, il s'adapte et s'améliore en continu.",
    features: [
      { emoji: '⚡', text: 'Réponses 24/7' },
      { emoji: '🎯', text: 'Recommandations personnalisées' },
      { emoji: '🤖', text: 'Processus automatisés' },
    ],
    statLine: '10h gagnées par semaine.',
    keyBenefits: [
      { title: 'Disponible 24/7', description: 'Vos clients et équipes obtiennent des réponses instantanées, jour et nuit.' },
      { title: 'Auto-apprentissage', description: 'L\'IA s\'améliore en continu en apprenant de chaque interaction.' },
      { title: 'Intégration native', description: 'Se connecte à vos CRM, ERP et outils de communication existants.' },
      { title: 'Multilingue', description: 'Communiquez avec vos clients internationaux sans barrière linguistique.' },
    ],
  },
];

// ==========================================
// Articles
// ==========================================

export const categories = [
  { name: 'Tous', slug: 'tous' },
  { name: 'Affichage Dynamique', slug: 'affichage-dynamique' },
  { name: 'Collaboration', slug: 'collaboration' },
  { name: 'Présentation Innovante', slug: 'presentation-innovante' },
  { name: 'Assistant IA', slug: 'assistant-ia' },
  { name: 'Tendances', slug: 'tendances' },
];

export const articles: Article[] = [];

// ==========================================
// Testimonials
// ==========================================

export const testimonials: Testimonial[] = [
  {
    quote: "Projectview a complètement transformé notre showroom. Nos clients passent désormais deux fois plus de temps à explorer nos produits.",
    author: 'Marie Dupont',
    role: 'Directrice Marketing',
    company: 'IntérieurDesign Lyon',
    rating: 5,
    solutionsRelated: ['affichage-dynamique', 'presentation-innovante'],
  },
  {
    quote: "Les solutions de collaboration ont révolutionné nos réunions d'équipe. On ne revient plus en arrière.",
    author: 'Thomas Bernard',
    role: 'CEO',
    company: 'ArchiTech Solutions',
    rating: 5,
    solutionsRelated: ['collaboration'],
  },
  {
    quote: "L'assistant IA nous fait gagner un temps précieux au quotidien. Le support client est également irréprochable.",
    author: 'Sophie Martin',
    role: 'Responsable Innovation',
    company: 'RetailGroup France',
    rating: 5,
    solutionsRelated: ['assistant-ia', 'affichage-dynamique'],
  },
  {
    quote: "La présentation VR de nos projets immobiliers a fait bondir notre taux de conversion de manière spectaculaire.",
    author: 'Pierre Lefèvre',
    role: 'Directeur Commercial',
    company: 'Nexity Aménagement',
    rating: 5,
    solutionsRelated: ['presentation-innovante'],
  },
  {
    quote: "Un partenaire technologique qui comprend vraiment les enjeux de l'expérience client en point de vente.",
    author: 'Claire Rousseau',
    role: 'Directrice Retail',
    company: 'Maison & Objet',
    rating: 5,
    solutionsRelated: ['affichage-dynamique'],
  },
];

// ==========================================
// Case Studies
// ==========================================

export const caseStudies: CaseStudy[] = [
  {
    title: 'Showroom immersif pour un leader de l\'aménagement intérieur',
    slug: 'showroom-immersif-amenagement',
    description: 'Transformation complète d\'un showroom de 500m² avec écrans dynamiques, tables tactiles et réalité virtuelle. Le temps de visite a augmenté de 180% et le taux de conversion de 45%.',
    client: 'IntérieurDesign Lyon',
    industry: 'Aménagement',
    solutionsUsed: ['Affichage Dynamique', 'Présentation Innovante'],
    results: '+180% temps de visite, +45% conversions',
  },
  {
    title: 'Salles de réunion intelligentes pour un cabinet d\'architectes',
    slug: 'salles-reunion-architectes',
    description: 'Équipement de 12 salles de réunion avec solutions de collaboration tout-en-un. Les réunions sont devenues 73% plus courtes et 90% des participants les trouvent plus productives.',
    client: 'ArchiTech Solutions',
    industry: 'Architecture',
    solutionsUsed: ['Collaboration'],
    results: '-73% durée réunion, 90% satisfaction',
  },
  {
    title: 'Réseau d\'affichage dynamique pour une chaîne retail',
    slug: 'reseau-affichage-retail',
    description: 'Déploiement de 200 écrans dynamiques interactifs dans 35 points de vente. L\'engagement client a augmenté de 340% et le panier moyen de 23%.',
    client: 'RetailGroup France',
    industry: 'Retail',
    solutionsUsed: ['Affichage Dynamique'],
    results: '+340% engagement, +23% panier moyen',
  },
  {
    title: 'Assistant IA pour un promoteur immobilier national',
    slug: 'assistant-ia-promoteur-immobilier',
    description: 'Déploiement d\'un assistant IA personnalisé pour gérer les demandes prospects 24/7. Le temps de réponse est passé de 4h à 30 secondes, et 80% des questions sont traitées automatiquement.',
    client: 'Nexity Aménagement',
    industry: 'Immobilier',
    solutionsUsed: ['Assistant IA'],
    results: 'Réponse en 30s vs 4h, 80% automatisé',
  },
  {
    title: 'Espace de vente VR pour un constructeur de maisons',
    slug: 'espace-vente-vr-constructeur',
    description: 'Création d\'un espace de vente immersif avec visites VR de maisons sur plan. Le taux de réservation a augmenté de 67% et la satisfaction client de 94%.',
    client: 'Maisons de l\'Avenir',
    industry: 'Construction',
    solutionsUsed: ['Présentation Innovante', 'Affichage Dynamique'],
    results: '+67% réservations, 94% satisfaction',
  },
  {
    title: 'Communication interne digitale pour un groupe industriel',
    slug: 'communication-interne-groupe-industriel',
    description: 'Installation de 50 écrans d\'information dans les espaces communs de 8 sites industriels. L\'information atteint désormais 95% des collaborateurs contre 30% auparavant.',
    client: 'IndustrieGroup',
    industry: 'Industrie',
    solutionsUsed: ['Affichage Dynamique', 'Collaboration'],
    results: '95% reach vs 30%, engagement x3',
  },
];

// ==========================================
// Helper functions
// ==========================================

export function getSolutionBySlug(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  if (categorySlug === 'tous') return articles;
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return articles.slice(0, limit);
  return articles
    .filter((a) => a.slug !== currentSlug && a.categorySlug === current.categorySlug)
    .slice(0, limit);
}

export function getCaseStudiesByIndustry(industry: string): CaseStudy[] {
  if (industry === 'tous') return caseStudies;
  return caseStudies.filter((cs) => cs.industry.toLowerCase() === industry.toLowerCase());
}

// Mapping from solution slug to the short names used in caseStudies.solutionsUsed
const solutionSlugToShortNames: Record<string, string[]> = {
  'affichage-dynamique': ['Affichage Dynamique'],
  'collaboration': ['Collaboration'],
  'presentation-innovante': ['Présentation Innovante'],
  'assistant-ia': ['Assistant IA'],
};

export function getCaseStudiesBySolution(solutionSlug: string): CaseStudy[] {
  const shortNames = solutionSlugToShortNames[solutionSlug] || [];
  return caseStudies.filter((cs) =>
    cs.solutionsUsed.some((used) => shortNames.includes(used))
  );
}

export function getTestimonialsBySolution(solutionSlug: string): Testimonial[] {
  return testimonials.filter((t) => t.solutionsRelated.includes(solutionSlug));
}

export function getOtherSolutions(currentSlug: string): Solution[] {
  return solutions.filter((s) => s.slug !== currentSlug);
}

export function getFAQBySolution(solutionSlug: string): FAQ[] {
  return faqBySolution[solutionSlug] || [];
}

// ==========================================
// FAQ Data
// ==========================================

export const faqBySolution: Record<string, FAQ[]> = {
  'affichage-dynamique': [
    {
      question: "Quels types d'écrans proposez-vous pour l'affichage dynamique ?",
      answer: "Nous proposons une gamme complète : écrans LED haute luminosité pour vitrines, écrans LCD tactiles pour showrooms, totems interactifs, murs d'images et écrans transparents. Chaque solution est adaptée à votre environnement et vos objectifs.",
    },
    {
      question: "Comment gérer les contenus diffusés sur les écrans ?",
      answer: "Notre plateforme de gestion centralisée vous permet de créer, programmer et diffuser vos contenus depuis n'importe quel appareil. Vous pouvez planifier des campagnes, cibler des zones géographiques et analyser les performances en temps réel.",
    },
    {
      question: "Quel est le délai moyen d'installation ?",
      answer: "Du diagnostic initial à la mise en service, comptez généralement 2 à 4 semaines selon la complexité du projet. Nous assurons l'installation, la configuration et la formation de vos équipes.",
    },
    {
      question: "Proposez-vous un support technique après l'installation ?",
      answer: "Oui, nous offrons un support technique réactif inclus dans tous nos contrats. Notre équipe intervient à distance ou sur site selon vos besoins, avec des temps de réponse garantis.",
    },
  ],
  'collaboration': [
    {
      question: "Vos solutions sont-elles compatibles avec Teams, Zoom et Google Meet ?",
      answer: "Absolument. Nos écrans de collaboration sont certifiés pour les principales plateformes de visioconférence : Microsoft Teams, Zoom, Google Meet et Webex. La connexion se fait en un clic.",
    },
    {
      question: "Faut-il une infrastructure réseau spécifique ?",
      answer: "Nos solutions fonctionnent sur une connexion réseau standard. Nous recommandons une bande passante minimum de 10 Mbps par salle pour une expérience optimale en visioconférence HD.",
    },
    {
      question: "Comment fonctionne le partage d'écran sans fil ?",
      answer: "Il suffit de se connecter au même réseau Wi-Fi que l'écran. Nos solutions supportent AirPlay, Miracast et notre application dédiée pour un partage instantané depuis tout appareil.",
    },
    {
      question: "Proposez-vous des formations pour les équipes ?",
      answer: "Oui, chaque déploiement inclut une session de formation pour vos équipes. Nous fournissons également des guides d'utilisation et un support dédié pour assurer une adoption rapide.",
    },
  ],
  'presentation-innovante': [
    {
      question: "La réalité virtuelle nécessite-t-elle un équipement spécial pour les clients ?",
      answer: "Non, nous fournissons l'ensemble du matériel nécessaire : casques VR dernière génération, contrôleurs et station de démonstration. Vos clients n'ont rien à apporter.",
    },
    {
      question: "Peut-on personnaliser les présentations VR avec nos propres projets ?",
      answer: "Bien sûr. Notre équipe de création 3D modélise vos projets sur mesure. Nous intégrons vos plans architecturaux, vos matériaux et vos finitions pour une immersion fidèle au projet final.",
    },
    {
      question: "Quelle est la taille minimale requise pour une table tactile ?",
      answer: "Nous proposons des tables à partir de 43 pouces pour les espaces compacts. Pour un showroom accueillant des groupes, nous recommandons 55 à 65 pouces. L'espace nécessaire autour est d'environ 2m².",
    },
    {
      question: "Les solutions de présentation fonctionnent-elles hors ligne ?",
      answer: "Oui, nos solutions stockent les contenus localement. Une fois configurées, elles fonctionnent parfaitement sans connexion internet, idéal pour les salons et événements.",
    },
  ],
  'assistant-ia': [
    {
      question: "Comment l'IA apprend-elle les spécificités de notre entreprise ?",
      answer: "Nous entraînons l'IA avec vos documents, FAQ, catalogue produits et historique d'interactions. L'apprentissage initial prend 1 à 2 semaines, puis l'IA s'améliore continuellement avec chaque échange.",
    },
    {
      question: "Les données de nos clients sont-elles sécurisées ?",
      answer: "Absolument. Nos serveurs sont hébergés en France, conformes au RGPD. Les données sont chiffrées au repos et en transit. Aucune donnée client n'est utilisée pour entraîner des modèles tiers.",
    },
    {
      question: "L'assistant peut-il être intégré à notre CRM existant ?",
      answer: "Oui, nous proposons des intégrations natives avec Salesforce, HubSpot, Pipedrive et la plupart des CRM du marché. Des intégrations sur mesure sont également possibles via notre API.",
    },
    {
      question: "Que se passe-t-il si l'IA ne connaît pas la réponse ?",
      answer: "L'assistant transfère automatiquement la conversation à un membre de votre équipe avec tout le contexte de l'échange. Vous pouvez configurer des règles d'escalade personnalisées.",
    },
  ],
};

// ==========================================
// Comparison Table Data
// ==========================================

export const comparisonData = {
  rows: [
    {
      label: 'Impact principal',
      values: ["+340% d'engagement", "73% de temps gagné", "89% de mémorisation", "10h gagnées/semaine"],
    },
    {
      label: 'Secteur idéal',
      values: ['Retail & Points de vente', 'Bureaux & Salles de réunion', 'Showrooms & Immobilier', 'Support & Service client'],
    },
    {
      label: 'Technologies',
      values: ['Écrans LED, LCD, tactiles', 'Visio, partage sans fil', 'VR, tables tactiles, 3D', 'IA conversationnelle'],
    },
    {
      label: 'Déploiement',
      values: ['2-4 semaines', '1-2 semaines', '3-6 semaines', '1-2 semaines'],
    },
    {
      label: 'Support',
      values: ['24/7', 'Heures ouvrées', 'Heures ouvrées', '24/7'],
    },
  ],
};
