'use strict';

/**
 * Seed script for Projectview Strapi CMS
 *
 * Usage:
 *   1. Start Strapi: npm run develop
 *   2. In another terminal: node seed/seed.js
 *
 * Requires STRAPI_URL and STRAPI_API_TOKEN env vars, or uses defaults.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const headers = {
  'Content-Type': 'application/json',
  ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
};

async function create(endpoint, data) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /api/${endpoint} failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  return json.data;
}

async function seed() {
  console.log('🌱 Seeding Projectview Strapi...\n');

  // ── Categories ──
  console.log('📁 Creating categories...');
  const categories = {};
  const catData = [
    { name: 'Affichage Dynamique', slug: 'affichage-dynamique', description: 'Solutions d\'affichage dynamique et interactif', color: '#3B7A8C' },
    { name: 'Collaboration', slug: 'collaboration', description: 'Solutions de collaboration en entreprise', color: '#D4842A' },
    { name: 'Présentation Innovante', slug: 'presentation-innovante', description: 'Présentations immersives et VR', color: '#6B9B37' },
    { name: 'Assistant IA', slug: 'assistant-ia', description: 'Assistants IA personnalisés', color: '#8B6914' },
    { name: 'Tendances', slug: 'tendances', description: 'Tendances du marché et innovations', color: '#C65D3E' },
  ];
  for (const cat of catData) {
    const created = await create('categories', cat);
    categories[cat.slug] = created.id;
    console.log(`  ✓ ${cat.name}`);
  }

  // ── Authors ──
  console.log('\n✍️  Creating authors...');
  const authors = {};
  const authorData = [
    { name: 'Sophie Martin', bio: 'Experte en solutions d\'affichage dynamique chez Projectview. 10 ans d\'expérience dans la transformation digitale du retail.' },
    { name: 'Thomas Bernard', bio: 'Directeur technique et passionné de réalité virtuelle. Il conçoit les solutions immersives les plus innovantes du marché.' },
    { name: 'Claire Rousseau', bio: 'Spécialiste IA et automatisation chez Projectview. Elle accompagne les entreprises dans leur adoption de l\'intelligence artificielle.' },
    { name: 'Pierre Lefèvre', bio: 'Consultant en transformation digitale des espaces de travail. Expert en solutions de collaboration et de productivité.' },
  ];
  for (const author of authorData) {
    const created = await create('authors', author);
    authors[author.name] = created.id;
    console.log(`  ✓ ${author.name}`);
  }

  // ── Solutions ──
  console.log('\n🚀 Creating solutions...');
  const solutionData = [
    {
      title: 'Affichage Dynamique & Interactif',
      slug: 'affichage-dynamique',
      icon: 'radio',
      accent_color: 'teal',
      short_description: 'Dans un océan de sollicitations visuelles, votre communication se noie. Nos écrans dynamiques transforment chaque point de contact en expérience mémorable.',
      full_description: 'L\'affichage dynamique transforme vos espaces de communication en expériences visuelles captivantes. Nos écrans interactifs haute résolution, pilotés par une plateforme intuitive, diffusent vos contenus au bon moment, au bon endroit, à la bonne personne.\n\nDu showroom retail à la communication interne, chaque point de contact devient une opportunité d\'engagement. Notre technologie s\'adapte en temps réel aux flux de visiteurs, aux horaires et aux événements pour maximiser l\'impact de chaque message.',
      key_features: [
        { emoji: '💡', text: 'Dynamique : contenus animés, temps réel' },
        { emoji: '👆', text: 'Interactif : touchez, déclenchez' },
        { emoji: '🏪', text: 'Showrooms retail' },
        { emoji: '📱', text: 'Communication interne' },
      ],
      stats: { engagement: '+340%', badge: "+340% d'engagement" },
      badge_text: "+340% d'engagement",
      order: 1,
    },
    {
      title: 'Solutions de Collaboration',
      slug: 'collaboration',
      icon: 'users',
      accent_color: 'orange',
      short_description: 'Chaque minute perdue en connexion est une opportunité manquée. Nos solutions tout-en-un éliminent les frictions pour des réunions enfin productives.',
      full_description: 'Nos solutions de collaboration transforment vos salles de réunion en espaces de travail intelligents. Écrans visio tout-en-un, partage sans fil instantané, outils de co-création en temps réel — tout est pensé pour que la technologie disparaisse au profit de l\'échange.\n\nFini les câbles, les configurations interminables et les « vous m\'entendez ? ». Connectez-vous en un geste et concentrez-vous sur l\'essentiel : collaborer.',
      key_features: [
        { emoji: '📺', text: 'Écrans visio tout-en-un' },
        { emoji: '📡', text: 'Partage sans fil ultra-simplifié' },
        { emoji: '⚡', text: 'Connectez-vous en un geste' },
        { emoji: '🤝', text: 'Collaborez naturellement' },
      ],
      stats: { time_saved: '73%', badge: '73% de temps gagné' },
      badge_text: '73% de temps gagné',
      order: 2,
    },
    {
      title: 'Solutions de Présentation Innovante',
      slug: 'presentation-innovante',
      icon: 'presentation',
      accent_color: 'green',
      short_description: 'Vos clients hochent la tête mais ne se projettent pas. Nos solutions immersives transforment chaque présentation en expérience mémorable.',
      full_description: 'Nos solutions de présentation innovante transforment la manière dont vous présentez vos projets. Tables tactiles de négociation, écrans immersifs pour showrooms, casques VR pour visualiser un bien avant sa construction — vos clients ne regardent plus, ils vivent l\'expérience.\n\nL\'immersion crée l\'émotion, et l\'émotion déclenche la décision. Passez du PowerPoint à l\'expérience mémorable.',
      key_features: [
        { emoji: '🖥️', text: 'Écrans tactiles showroom' },
        { emoji: '🤝', text: 'Table tactile de négociation' },
        { emoji: '🏠', text: 'VR avant construction' },
      ],
      stats: { memorization: '89%', badge: '89% mémorisation' },
      badge_text: '89% mémorisation',
      order: 3,
    },
    {
      title: 'Assistant IA Personnalisé',
      slug: 'assistant-ia',
      icon: 'sparkles',
      accent_color: 'gold',
      short_description: 'Vos équipes perdent un temps précieux sur les mêmes questions. Notre assistant IA apprend de votre métier et répond 24/7 avec précision.',
      full_description: 'Notre assistant IA personnalisé apprend de votre métier, de vos produits et de votre culture d\'entreprise pour offrir des réponses précises et pertinentes à vos équipes et vos clients.\n\nDisponible 24/7, il automatise les tâches répétitives, recommande les bonnes solutions et libère du temps pour ce qui compte vraiment : la relation humaine. Intégré à vos outils existants, il s\'adapte et s\'améliore en continu.',
      key_features: [
        { emoji: '⚡', text: 'Réponses 24/7' },
        { emoji: '🎯', text: 'Recommandations personnalisées' },
        { emoji: '🤖', text: 'Processus automatisés' },
      ],
      stats: { time_saved: '10h/semaine', badge: '10h gagnées/semaine' },
      badge_text: '10h gagnées/semaine',
      order: 4,
    },
  ];
  for (const sol of solutionData) {
    await create('solutions', sol);
    console.log(`  ✓ ${sol.title}`);
  }

  // ── Articles ──
  console.log('\n📝 Creating articles...');
  const articleData = [
    {
      title: 'Comment l\'affichage dynamique transforme le retail en 2025',
      slug: 'affichage-dynamique-retail-2025',
      excerpt: 'Découvrez comment les écrans interactifs révolutionnent l\'expérience en magasin et augmentent l\'engagement client de manière spectaculaire.',
      content: 'L\'affichage dynamique n\'est plus un luxe réservé aux grandes enseignes. En 2025, cette technologie est devenue accessible et indispensable pour tout point de vente souhaitant se démarquer.\n\n## L\'ère de l\'expérience immersive\n\nLes consommateurs d\'aujourd\'hui ne veulent plus simplement acheter un produit. Ils recherchent une expérience. Les écrans interactifs permettent de créer cette expérience en transformant chaque visite en un moment mémorable.\n\n## Les chiffres parlent d\'eux-mêmes\n\nNos clients constatent en moyenne une augmentation de 340% de l\'engagement client après l\'installation d\'écrans dynamiques. Le temps passé en magasin augmente de 45%, et le panier moyen progresse de 23%.\n\n## Comment commencer ?\n\nLa mise en place d\'un système d\'affichage dynamique est plus simple qu\'on ne le pense. Notre équipe vous accompagne de la conception à l\'installation, en passant par la création de contenus sur mesure.',
      category: categories['affichage-dynamique'],
      author: authors['Sophie Martin'],
      seo_title: 'Affichage dynamique retail 2025 — Projectview',
      seo_description: 'Découvrez comment l\'affichage dynamique révolutionne l\'expérience retail en 2025.',
    },
    {
      title: 'VR immobilière : vendre un bien avant sa construction',
      slug: 'vr-immobiliere-vente-avant-construction',
      excerpt: 'La réalité virtuelle permet aux promoteurs de proposer des visites immersives de projets encore sur plan, transformant radicalement le processus de vente.',
      content: 'La réalité virtuelle révolutionne le secteur immobilier. Fini les maquettes en carton et les plans 2D difficiles à interpréter.\n\n## Visualiser l\'invisible\n\nGrâce à nos casques VR et à nos écrans immersifs, vos clients peuvent littéralement se promener dans un appartement qui n\'existe pas encore. Ils peuvent toucher les matériaux, changer les couleurs, ouvrir les fenêtres et admirer la vue.\n\n## Un taux de conversion inédit\n\nNos clients promoteurs immobiliers rapportent un taux de mémorisation de 89% après une visite VR, contre 20% pour une présentation classique. Le taux de réservation sur plan a augmenté de 67%.\n\n## La technologie au service de l\'émotion\n\nCe n\'est pas la technologie qui vend. C\'est l\'émotion qu\'elle procure. Quand un client se projette dans son futur chez-lui, la décision d\'achat devient naturelle.',
      category: categories['presentation-innovante'],
      author: authors['Thomas Bernard'],
      seo_title: 'VR immobilière — vendre avant construction — Projectview',
      seo_description: 'La réalité virtuelle pour vendre un bien immobilier avant sa construction.',
    },
    {
      title: 'L\'IA au service de la relation client B2B',
      slug: 'ia-relation-client-b2b',
      excerpt: 'Comment un assistant IA personnalisé peut réduire le temps de réponse et améliorer la satisfaction client dans un contexte professionnel.',
      content: 'L\'intelligence artificielle n\'est plus un concept futuriste. C\'est un outil concret qui transforme la relation client au quotidien.\n\n## Le défi du B2B\n\nDans le B2B, les questions sont techniques, les cycles de vente sont longs et chaque interaction compte. Un assistant IA bien entraîné peut répondre à 80% des questions récurrentes, libérant vos équipes pour les échanges à forte valeur ajoutée.\n\n## Des résultats mesurables\n\nNos clients gagnent en moyenne 10 heures par semaine grâce à l\'automatisation des réponses. La satisfaction client augmente de 34% grâce à des temps de réponse divisés par 5.\n\n## L\'humain augmenté, pas remplacé\n\nNotre philosophie est claire : l\'IA augmente vos équipes, elle ne les remplace pas. Elle gère le répétitif pour que vos collaborateurs se concentrent sur la créativité, la stratégie et la relation humaine.',
      category: categories['assistant-ia'],
      author: authors['Claire Rousseau'],
      seo_title: 'IA et relation client B2B — Projectview',
      seo_description: 'Comment un assistant IA personnalisé améliore la relation client B2B.',
    },
    {
      title: 'Les tendances de la collaboration hybride en 2025',
      slug: 'tendances-collaboration-hybride-2025',
      excerpt: 'Le travail hybride est là pour rester. Découvrez les technologies qui rendent la collaboration à distance aussi naturelle qu\'en présentiel.',
      content: 'Le travail hybride n\'est plus une tendance, c\'est la norme. Et les outils de collaboration doivent suivre.\n\n## Au-delà de la visioconférence\n\nLa visioconférence était la première étape. En 2025, la collaboration hybride va bien au-delà : tableaux blancs partagés, co-création en temps réel, espaces virtuels de travail.\n\n## L\'équipement fait la différence\n\nUne salle de réunion bien équipée change tout. Nos solutions tout-en-un éliminent les frictions techniques : pas de câble, pas de configuration, pas de « vous m\'entendez ? ». Le résultat : 73% de temps gagné en réunion.\n\n## Investir dans l\'expérience employé\n\nLes entreprises qui investissent dans des outils de collaboration performants attirent et retiennent les meilleurs talents. C\'est un investissement dans le capital humain.',
      category: categories['collaboration'],
      author: authors['Pierre Lefèvre'],
      seo_title: 'Collaboration hybride 2025 — Projectview',
      seo_description: 'Les tendances de la collaboration hybride en 2025.',
    },
    {
      title: 'Retail 2025 : l\'expérience client comme avantage compétitif',
      slug: 'retail-2025-experience-client',
      excerpt: 'Dans un monde où le e-commerce domine, le magasin physique doit se réinventer. L\'expérience immersive est la clé.',
      content: 'Le retail physique n\'est pas mort. Il se transforme. Et ceux qui embrassent cette transformation en sortent plus forts que jamais.\n\n## Le magasin comme lieu d\'expérience\n\nLe magasin du futur n\'est pas un entrepôt avec des étiquettes. C\'est un lieu d\'expérience où chaque visite crée un souvenir. L\'affichage dynamique, les écrans tactiles et la réalité augmentée transforment le parcours client.\n\n## Les KPIs qui comptent\n\nTemps passé en magasin, taux d\'interaction, score d\'expérience — les indicateurs du retail moderne vont au-delà du simple chiffre d\'affaires. Nos solutions permettent de mesurer et d\'optimiser chacun de ces indicateurs.\n\n## Une transformation accessible\n\nContrairement aux idées reçues, digitaliser un point de vente ne nécessite pas un budget colossal. Nos solutions modulaires s\'adaptent à toutes les tailles et tous les budgets.',
      category: categories['tendances'],
      author: authors['Sophie Martin'],
      seo_title: 'Retail 2025 et expérience client — Projectview',
      seo_description: 'L\'expérience client immersive comme avantage compétitif du retail en 2025.',
    },
    {
      title: 'Comment choisir sa table tactile de négociation',
      slug: 'choisir-table-tactile-negociation',
      excerpt: 'Guide complet pour sélectionner la table tactile idéale pour vos espaces de vente et de présentation.',
      content: 'La table tactile est devenue un outil incontournable dans les showrooms et les espaces de négociation. Mais comment choisir le bon modèle ?\n\n## Taille et résolution\n\nLa taille dépend de votre usage. Pour une négociation en face-à-face, un modèle 43 pouces suffit. Pour un showroom accueillant des groupes, visez 55 à 65 pouces. La résolution 4K est aujourd\'hui le standard minimum.\n\n## Technologie tactile\n\nLe capacitif offre la meilleure réactivité et supporte le multi-touch. L\'infrarouge est plus résistant pour un usage intensif. Notre recommandation : le capacitif projeté (PCAP) pour le meilleur équilibre.\n\n## Logiciel et contenu\n\nLe matériel n\'est rien sans le logiciel. Nos solutions incluent une plateforme de gestion de contenu intuitive qui vous permet de créer et de déployer vos présentations sans compétence technique.',
      category: categories['presentation-innovante'],
      author: authors['Thomas Bernard'],
      seo_title: 'Choisir sa table tactile — Guide Projectview',
      seo_description: 'Guide complet pour choisir la table tactile idéale pour vos espaces de vente.',
    },
  ];
  for (const article of articleData) {
    await create('articles', article);
    console.log(`  ✓ ${article.title}`);
  }

  // ── Testimonials ──
  console.log('\n💬 Creating testimonials...');
  const testimonialData = [
    { author_name: 'Marie Dupont', company: 'IntérieurDesign Lyon', role: 'Directrice Marketing', quote: 'Projectview a complètement transformé notre showroom. Nos clients passent désormais deux fois plus de temps à explorer nos produits.', rating: 5 },
    { author_name: 'Thomas Bernard', company: 'ArchiTech Solutions', role: 'CEO', quote: 'Les solutions de collaboration ont révolutionné nos réunions d\'équipe. On ne revient plus en arrière.', rating: 5 },
    { author_name: 'Sophie Martin', company: 'RetailGroup France', role: 'Responsable Innovation', quote: 'L\'assistant IA nous fait gagner un temps précieux au quotidien. Le support client est également irréprochable.', rating: 5 },
    { author_name: 'Pierre Lefèvre', company: 'Nexity Aménagement', role: 'Directeur Commercial', quote: 'La présentation VR de nos projets immobiliers a fait bondir notre taux de conversion de manière spectaculaire.', rating: 5 },
    { author_name: 'Claire Rousseau', company: 'Maison & Objet', role: 'Directrice Retail', quote: 'Un partenaire technologique qui comprend vraiment les enjeux de l\'expérience client en point de vente.', rating: 5 },
  ];
  for (const testimonial of testimonialData) {
    await create('testimonials', testimonial);
    console.log(`  ✓ ${testimonial.author_name}`);
  }

  // ── Case Studies ──
  console.log('\n📊 Creating case studies...');
  const caseStudyData = [
    { title: 'Showroom immersif pour un leader de l\'aménagement intérieur', slug: 'showroom-immersif-amenagement', description: 'Transformation complète d\'un showroom de 500m² avec écrans dynamiques, tables tactiles et réalité virtuelle. Le temps de visite a augmenté de 180% et le taux de conversion de 45%.', client_name: 'IntérieurDesign Lyon', industry: 'Aménagement', solutions_used: ['Affichage Dynamique', 'Présentation Innovante'], results_text: '+180% temps de visite, +45% conversions' },
    { title: 'Salles de réunion intelligentes pour un cabinet d\'architectes', slug: 'salles-reunion-architectes', description: 'Équipement de 12 salles de réunion avec solutions de collaboration tout-en-un. Les réunions sont devenues 73% plus courtes et 90% des participants les trouvent plus productives.', client_name: 'ArchiTech Solutions', industry: 'Architecture', solutions_used: ['Collaboration'], results_text: '-73% durée réunion, 90% satisfaction' },
    { title: 'Réseau d\'affichage dynamique pour une chaîne retail', slug: 'reseau-affichage-retail', description: 'Déploiement de 200 écrans dynamiques interactifs dans 35 points de vente. L\'engagement client a augmenté de 340% et le panier moyen de 23%.', client_name: 'RetailGroup France', industry: 'Retail', solutions_used: ['Affichage Dynamique'], results_text: '+340% engagement, +23% panier moyen' },
    { title: 'Assistant IA pour un promoteur immobilier national', slug: 'assistant-ia-promoteur-immobilier', description: 'Déploiement d\'un assistant IA personnalisé pour gérer les demandes prospects 24/7. Le temps de réponse est passé de 4h à 30 secondes.', client_name: 'Nexity Aménagement', industry: 'Immobilier', solutions_used: ['Assistant IA'], results_text: 'Réponse en 30s vs 4h, 80% automatisé' },
    { title: 'Espace de vente VR pour un constructeur de maisons', slug: 'espace-vente-vr-constructeur', description: 'Création d\'un espace de vente immersif avec visites VR de maisons sur plan. Le taux de réservation a augmenté de 67%.', client_name: 'Maisons de l\'Avenir', industry: 'Construction', solutions_used: ['Présentation Innovante', 'Affichage Dynamique'], results_text: '+67% réservations, 94% satisfaction' },
    { title: 'Communication interne digitale pour un groupe industriel', slug: 'communication-interne-groupe-industriel', description: 'Installation de 50 écrans d\'information dans les espaces communs de 8 sites industriels. L\'information atteint désormais 95% des collaborateurs.', client_name: 'IndustrieGroup', industry: 'Industrie', solutions_used: ['Affichage Dynamique', 'Collaboration'], results_text: '95% reach vs 30%, engagement x3' },
  ];
  for (const cs of caseStudyData) {
    await create('case-studies', cs);
    console.log(`  ✓ ${cs.title}`);
  }

  console.log('\n✅ Seed complete! All content has been created.\n');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
