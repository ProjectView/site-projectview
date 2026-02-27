/**
 * Ajoute des encarts image (prompts Nano Banana Pro) dans chaque article Firestore.
 * Usage: node scripts/add-image-prompts.mjs
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Insère un bloc image après le premier bloc contenant `markerText`. */
function insertAfterMarker(content, markerText, imageBlock) {
  const blocks = content.split('\n\n');
  const idx = blocks.findIndex((b) => b.includes(markerText));
  if (idx === -1) {
    console.warn(`    ⚠ Marqueur introuvable: "${markerText.slice(0, 60)}..."`);
    return content;
  }
  blocks.splice(idx + 1, 0, imageBlock);
  return blocks.join('\n\n');
}

/** Construit un bloc [IMAGE:] sur une seule ligne. */
const img = (titre, prompt) => `[IMAGE: ${titre} || ${prompt}]`;

// ─── Patches par article ──────────────────────────────────────────────────────

const patches = [
  {
    slug: 'comment-les-ecrans-interactifs-revolutionnent-l',
    insertions: [
      {
        after: 'le temps passé devant le point de communication double ou triple en quelques semaines.',
        image: img(
          'Showroom retail avec grand écran interactif lumineux',
          'Cinematic photo of a sleek modern French retail showroom, a large bright interactive touchscreen displaying animated product content in the center, warm amber and teal ambient lighting, dark premium interior design with marble floors, luxury atmosphere, customers browsing in background, photorealistic commercial photography, 16:9 --style photorealistic'
        ),
      },
      {
        after: "une augmentation moyenne de 340 % de l'engagement et une hausse de 23 % du panier moyen dans les espaces équipés d'écrans interactifs.",
        image: img(
          'Client configurant un produit en touchant un écran 4K haute résolution',
          "Close-up of a customer's hands gently touching a large high-resolution 4K touchscreen in a luxury French showroom, interactively exploring a digital product catalog, warm golden color grading, soft bokeh background with premium retail shelving, photorealistic commercial photography 16:9"
        ),
      },
      {
        after: "l'information affichée sur écran dynamique atteint 95 % des collaborateurs, contre seulement 30 % pour les supports papier classiques.",
        image: img(
          "Espace commun d'entreprise avec écrans d'affichage dynamique",
          'Modern French corporate break room with large digital display screens showing internal KPI dashboards and company announcements on the walls, employees naturally glancing at the screens during a coffee break, clean minimalist open-plan office design, warm natural lighting, photorealistic architectural photography 16:9'
        ),
      },
    ],
  },

  {
    slug: 'vr-immobiliere-vente-avant-construction',
    insertions: [
      {
        after: "La visite VR résout ces deux problèmes d'un coup.",
        image: img(
          'Agent immobilier présentant un casque VR à un couple',
          'Professional French real estate agent warmly presenting a modern VR headset to a smiling couple in a premium real estate sales office, elegant interior with a large tactile table displaying floor plans in the background, warm soft professional lighting, authentic happy expressions, photorealistic commercial photography 16:9'
        ),
      },
      {
        after: "Cette différence psychologique est déterminante dans la décision d'achat.",
        image: img(
          "Vue immersive à la première personne d'un appartement en réalité virtuelle",
          "First-person perspective view inside a stunningly photorealistic VR visualization of a modern high-end French apartment, floor-to-ceiling windows overlooking a Lyon cityscape, high-end interior design with warm golden hour sunlight streaming in, ultra-realistic architectural visualization, immersive 16:9"
        ),
      },
      {
        after: "Ce duo VR + table tactile représente aujourd'hui le standard des espaces de vente immobiliers les plus performants.",
        image: img(
          "Négociation immobilière collaborative autour d'une table tactile",
          'Real estate agent and an engaged couple gathered around a large glossy 55-inch interactive touch table displaying a residential development floor plan with 3D building model, modern French real estate sales office, warm professional lighting, natural conversation body language, photorealistic 16:9'
        ),
      },
    ],
  },

  {
    slug: 'ia-relation-client-b2b',
    insertions: [
      {
        after: "L'intelligence artificielle rend cette réactivité possible à toute heure, sans augmenter les effectifs.",
        image: img(
          "Interface d'assistant IA professionnel sur écran d'entreprise",
          'Clean modern business computer screen showing an elegant AI chat assistant interface with professional French dialogue responses, dark sleek UI design with subtle teal accents, ambient office lighting in background, professional B2B workspace setup, photorealistic commercial photography 16:9'
        ),
      },
      {
        after: 'qui sait orienter vers le bon interlocuteur humain quand la demande le nécessite.',
        image: img(
          'Tableau de bord analytique de satisfaction client en temps réel',
          'Beautiful dark analytics dashboard on a widescreen ultrawide monitor displaying customer satisfaction metrics, response time reduction graphs from hours to seconds, and automation rate indicators labeled in French, modern open-plan office environment, dark UI theme with gradient teal-green data visualizations, photorealistic 16:9'
        ),
      },
      {
        after: "L'équipe commerciale et support se retrouve libérée des tâches répétitives et peut se concentrer sur les demandes à forte valeur ajoutée",
        image: img(
          'Équipe commerciale concentrée sur une négociation à forte valeur ajoutée',
          'Two French B2B sales professionals in a bright collaborative modern office, having an engaged and genuine high-value client consultation, leaning forward with enthusiasm, professional business attire, warm natural office lighting through large windows, photorealistic 16:9'
        ),
      },
    ],
  },

  {
    slug: 'tendances-collaboration-hybride-2025',
    insertions: [
      {
        after: "La résoudre est l'enjeu central de la collaboration hybride en 2025.",
        image: img(
          'Salle de réunion hybride moderne et parfaitement équipée',
          'Modern hybrid meeting room with a large 4K display showing a grid of remote video participants, four in-room team members sitting around a sleek conference table with premium AV equipment, French corporate environment, warm professional lighting, photorealistic architectural photography 16:9'
        ),
      },
      {
        after: "les participants distants voient et entendent aussi bien que s'ils étaient dans la pièce.",
        image: img(
          'Barre vidéo intelligente avec caméra grand angle en salle de réunion',
          'Premium all-in-one video bar with wide-angle AI conference camera mounted elegantly above a large 4K conference display, automatically framing the speaking participant on screen, sleek modern conference room with remote participants grid visible, photorealistic product photography 16:9'
        ),
      },
      {
        after: 'toutes ces activités qui semblaient réservées au présentiel deviennent naturellement hybrides.',
        image: img(
          'Annotation collaborative simultanée en session hybride',
          'Split-view of a productive hybrid meeting: in-room participants and remote attendees simultaneously drawing annotations on a shared architectural document displayed on a large interactive screen, engaged expressions, modern French collaborative workspace, warm lighting, photorealistic 16:9'
        ),
      },
    ],
  },

  {
    slug: 'retail-2025-experience-client',
    insertions: [
      {
        after: "Ce qu'on vend en magasin, c'est une émotion.",
        image: img(
          'Magasin retail futuriste avec écrans immersifs et atmosphère luxe',
          'Futuristic French luxury retail store interior with multiple large immersive interactive displays integrated into the architecture, warm atmospheric lighting in amber and gold tones, beautifully arranged products, customers exploring digital product experiences, cinematic wide-angle photography, aspirational and warm atmosphere 16:9'
        ),
      },
      {
        after: "pour qu'ils se concentrent sur ce qu'un écran ne peut pas faire : créer une relation, conseiller avec empathie, fidéliser.",
        image: img(
          'Conseiller de vente avec une tablette interactive, accompagnant un client',
          'Warm and authentic photo of a friendly French store advisor smiling and showing personalized product recommendations on a sleek interactive tablet to a satisfied customer in a modern retail environment, genuine human connection and trust, professional welcoming atmosphere, photorealistic 16:9'
        ),
      },
      {
        after: "Les enseignes qui l'adoptent observent des hausses significatives du taux de transformation et de la valeur du panier moyen.",
        image: img(
          "Écran dynamique intelligent affichant des recommandations au passage d'un client",
          "Sleek modern digital display in a French retail store instantly showing personalized product recommendations as a customer walks by, proximity detection technology visible concept, warm store ambient lighting, phygital retail technology concept, premium commercial photography 16:9"
        ),
      },
    ],
  },

  {
    slug: 'choisir-table-tactile-negociation',
    insertions: [
      {
        after: 'Ce guide vous donne les clés pour faire le bon choix.',
        image: img(
          'Comparatif de tables tactiles de différentes tailles en showroom',
          'Clean modern technology showroom displaying three professional touch tables of different sizes — 43-inch, 55-inch, and 75-inch — side by side, illuminated from above, minimal white environment, subtle size comparison labels, premium product photography 16:9'
        ),
      },
      {
        after: "Pour un usage showroom et négociation, l'infrarouge représente le meilleur rapport qualité-prix dans la majorité des cas.",
        image: img(
          'Interaction tactile précise sur surface de table 4K professionnelle',
          "Macro close-up of a business person's hand with a stylus annotating architectural floor plans on the glossy surface of a 4K professional touch table, sharp precise contact point in focus, shallow depth of field with blurred office background, premium product photography 16:9"
        ),
      },
      {
        after: "C'est souvent là que se joue la vraie différence entre une installation transformante et un équipement sous-exploité.",
        image: img(
          "Professionnels de l'immobilier en négociation autour d'une table tactile",
          "Three professional real estate agents gathered around a 55-inch touch table displaying an interactive residential floor plan with embedded 3D visualization, modern French real estate sales office, engaged professional discussion with genuine interest, business attire, warm professional lighting, photorealistic 16:9"
        ),
      },
    ],
  },
];

// ─── Application des patches ──────────────────────────────────────────────────

console.log('\nAjout des encarts image dans les articles Firestore...\n');

for (const patch of patches) {
  const docRef = db.collection('articles').doc(patch.slug);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log(`  ✗ Article introuvable : ${patch.slug}`);
    continue;
  }

  let { content } = doc.data();
  let inserted = 0;

  for (const ins of patch.insertions) {
    const before = content;
    content = insertAfterMarker(content, ins.after, ins.image);
    if (content !== before) inserted++;
  }

  await docRef.update({ content, updatedAt: new Date().toISOString() });
  console.log(`  ✓ ${patch.slug}  (${inserted}/${patch.insertions.length} images insérées)`);
}

console.log('\nTerminé !\n');
process.exit(0);
