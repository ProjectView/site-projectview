import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import {
  getEditorialConfig,
  createEditorialItem,
  deleteAllEditorialItems,
  type EditorialItem,
} from '@/lib/firestore-editorial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-6';

// Meilleurs jours par plateforme (bonnes pratiques)
const PLATFORM_BEST_DAYS: Record<string, number[]> = {
  linkedin: [1, 3, 4, 5],    // Lun, Mer, Jeu, Ven (0=Dim, 1=Lun...)
  instagram: [2, 4, 6, 0],   // Mar, Jeu, Sam, Dim
  facebook: [1, 2, 3, 4, 5], // Lun–Ven
  tiktok: [2, 4, 5, 0],      // Mar, Jeu, Ven, Dim
};

async function callClaude(systemPrompt: string, userPrompt: string, maxTokens = 6000): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY manquant dans .env.local');

  const res = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erreur Claude API (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

function isGoodDayForPlatform(dayOfWeek: number, platform: string): boolean {
  const goodDays = PLATFORM_BEST_DAYS[platform] ?? [1, 2, 3, 4, 5];
  return goodDays.includes(dayOfWeek);
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const config = await getEditorialConfig();
    if (!config) {
      return NextResponse.json({ error: 'Configuration éditoriale introuvable' }, { status: 400 });
    }

    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Defensive: support old config schema (postsPerPlatform may be missing)
    const activePlatforms = config.activePlatforms?.length
      ? config.activePlatforms
      : ['instagram', 'linkedin'];

    const postsPerPlatform = config.postsPerPlatform ?? {};

    // Build platform frequency summary
    const frequencySummary = Object.entries(postsPerPlatform).length
      ? Object.entries(postsPerPlatform).map(([p, n]) => `${p}: ${n} posts/semaine`).join(', ')
      : `${activePlatforms.join(', ')}: 3 posts/semaine chacun`;

    // Visual style guidance for content descriptions
    const visualStyleGuide: Record<string, string> = {
      minimaliste: 'épuré, espaces blancs, peu d\'éléments, mise en page sobre',
      bold: 'typographies fortes, couleurs vives, contraste élevé, impact visuel immédiat',
      editorial: 'photographique, mise en scène soignée, storytelling visuel',
      lifestyle: 'authentique, quotidien, humain, couleurs douces et naturelles',
      corporate: 'professionnel, structuré, tons neutres, sérieux et fiable',
    };

    const systemPrompt = `Tu es un expert en stratégie de contenu réseaux sociaux B2B, spécialisé dans les solutions technologiques pour espaces physiques (affichage dynamique, collaboration, VR, IA). Tu crées des plannings de posts pour Projectview, destinés à des professionnels de l'aménagement, construction et retail.`;

    const userPrompt = `Génère un planning de posts réseaux sociaux pour Projectview sur 3 mois (du ${startDate} au ${endDate}).

## Paramètres de la stratégie

**Réseaux actifs :** ${activePlatforms.join(', ')}
**Audience cible :** ${config.audience || 'Professionnels de l\'aménagement et du retail'}
**Secteurs :** ${(config.targetSectors ?? []).join(', ') || 'Tous secteurs'}
**Thématiques principales :** ${config.themes || 'Solutions technologiques pour espaces physiques'}
**Sujets à éviter :** ${config.avoidTopics || 'Aucun'}
**Ton de communication :** ${config.tone || 'professionnel'}
**Formats privilégiés :** ${(config.preferredFormats ?? []).join(', ') || 'Variés'}
**Fréquence :** ${frequencySummary}
**Moments clés :** ${config.keyMoments || 'Aucun'}
**Objectifs :** ${(config.objectives ?? []).join(', ') || 'Notoriété'}
**Call-to-action principal :** ${config.preferredCTA || 'Découvrir nos solutions'}
**Inspirations :** ${config.inspirations || 'Non renseigné'}

## Charte graphique
**Couleurs :** Primaire ${config.brandColorPrimary || '#3B7A8C'}, Secondaire ${config.brandColorSecondary || '#6B9B37'}, Accent ${config.brandColorAccent || '#D4842A'}
**Style visuel :** ${config.visualStyle || 'professionnel'} — ${visualStyleGuide[config.visualStyle ?? ''] ?? 'moderne et professionnel'}

## Règles de planification par plateforme
- **LinkedIn** : positionner les posts les Lundi, Mercredi, Jeudi, Vendredi (audience pro, jours ouvrés)
- **Instagram** : positionner les posts les Mardi, Jeudi, Samedi, Dimanche (audience plus large, week-ends OK)
- **Facebook** : flexible, tous les jours ouvrés
- **TikTok** : Mardi, Jeudi, Vendredi, Dimanche

## Règles de contenu
- Respecter la fréquence par plateforme demandée
- Assurer une bonne diversité thématique (ne pas répéter le même sujet 2 fois de suite)
- Varier les formats selon les préférences (${config.preferredFormats.join(', ') || 'carousels, photos, citations'})
- Intégrer les moments clés quand pertinent
- Le thème doit être une idée de post concrète et actionnable (pas un sujet abstrait)
- Tenir compte du style visuel ${config.visualStyle} dans la description des thèmes

Génère entre 50 et 80 items au total.

## Format de sortie

Retourne UNIQUEMENT un JSON valide, sans markdown, sans explication :
[
  {
    "date": "YYYY-MM-DD",
    "theme": "Description précise et actionnable du post",
    "platform": ["instagram"],
    "format": "carousel",
    "objective": "notoriété"
  }
]

Formats possibles : carousel, photo, video, citation, story, infographie
Plateformes possibles parmi : ${config.activePlatforms.join(', ')}
Un post peut être multi-plateforme (ex: ["instagram", "linkedin"]) s'il est pertinent sur les deux.`;

    const raw = await callClaude(systemPrompt, userPrompt, 6000);

    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Réponse inattendue de Claude');

    const generatedItems = JSON.parse(jsonMatch[0]) as Array<{
      date: string;
      theme: string;
      platform: string[];
      format?: string;
      objective?: string;
    }>;

    // Clear existing items and replace
    await deleteAllEditorialItems();

    const savedItems: EditorialItem[] = [];
    for (const item of generatedItems) {
      // Validate that date respects platform best days (soft validation — Claude should handle this)
      const d = new Date(item.date + 'T00:00:00');
      const dayOfWeek = d.getDay();
      const primaryPlatform = item.platform?.[0] ?? 'linkedin';

      // Only skip if the day is completely wrong for ALL platforms in the item
      const hasGoodDay = item.platform?.some((p) => isGoodDayForPlatform(dayOfWeek, p)) ?? true;
      if (!hasGoodDay) continue; // silently skip misplaced items

      const saved = await createEditorialItem({
        date: item.date,
        theme: item.theme,
        platform: item.platform ?? [primaryPlatform],
        ...(item.format ? { format: item.format } : {}),
        ...(item.objective ? { objective: item.objective } : {}),
        status: 'planifie',
      });
      savedItems.push(saved);
    }

    return NextResponse.json({ count: savedItems.length, items: savedItems });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Editorial generation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
