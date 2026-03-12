import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { createArticleFS } from '@/lib/firestore-articles';
import { generateArticleImage, generateInlineImage } from '@/lib/generate-image';
import { generateSlug, formatDateFR, estimateReadTime } from '@/lib/admin-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-6';

const LENGTH_WORDS: Record<string, number> = {
  court: 500,
  moyen: 900,
  long: 1500,
};

// ── Claude API helper ──────────────────────────────────────────────────────────
async function callClaude(systemPrompt: string, userPrompt: string, maxTokens = 4000): Promise<string> {
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

// ── POST /api/admin/articles/generate ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { mode, theme, tone, length } = body as {
      mode: 'suggest' | 'generate';
      theme?: string;
      tone?: string;
      length?: 'court' | 'moyen' | 'long';
    };

    // ── Mode: suggest 3 topics ──────────────────────────────────────────────
    if (mode === 'suggest') {
      const systemPrompt = `Tu es un stratège de contenu expert pour Projectview, entreprise française spécialisée dans l'affichage dynamique interactif, les solutions de collaboration, la VR, et les assistants IA. Tu connais parfaitement leurs cibles : professionnels de l'aménagement, de la construction, de l'immobilier et du retail.`;

      const userPrompt = `Propose 3 idées d'articles de blog pertinents et engageants pour le site de Projectview. Ces articles doivent apporter de la valeur à leurs clients cibles (architectes, directeurs d'agences, managers, responsables retail).

Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans explication :
{"suggestions": ["Idée 1 claire et précise", "Idée 2 claire et précise", "Idée 3 claire et précise"]}`;

      const raw = await callClaude(systemPrompt, userPrompt, 300);

      // Extract JSON (Claude might add text around it)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Réponse inattendue de Claude');

      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ suggestions: parsed.suggestions });
    }

    // ── Mode: generate full article ─────────────────────────────────────────
    if (mode === 'generate') {
      if (!theme || !tone || !length) {
        return NextResponse.json(
          { error: 'theme, tone et length sont requis' },
          { status: 400 }
        );
      }

      const wordCount = LENGTH_WORDS[length] ?? 900;

      const systemPrompt = `Tu es un rédacteur expert pour Projectview, entreprise française spécialisée en affichage dynamique interactif, solutions de collaboration, VR et assistants IA personnalisés. Tes articles sont lus par des professionnels : architectes d'intérieur, directeurs immobiliers, managers retail, chefs de projet. Ton style est humain, expert, jamais robotique.`;

      const userPrompt = `Rédige un article de blog d'environ ${wordCount} mots, au ton "${tone}", sur le sujet suivant : "${theme}".

L'article doit :
- Sembler rédigé par un expert humain (pas de formules IA génériques)
- Avoir une structure claire avec des sous-titres ##
- Être divisé en paragraphes aérés et faciles à lire
- Inclure exactement 2 marqueurs d'image aux endroits les plus pertinents visuellement (après l'intro et à mi-article). Format : [IMAGE: description précise et visuelle de ce qu'on doit voir sur la photo]
- La description dans [IMAGE: ...] doit être une scène réaliste photographiable (ex: "Une grande salle de réunion moderne avec un écran tactile mural, deux collaborateurs qui pointent une présentation", pas "Une représentation abstraite de...")

Retourne UNIQUEMENT ce JSON valide, sans markdown, sans explication autour :
{
  "title": "Titre accrocheur et SEO-friendly",
  "excerpt": "2 phrases impactantes qui donnent envie de lire (max 280 caractères)",
  "content": "Le contenu complet en markdown avec les marqueurs [IMAGE: ...] inclus",
  "category": "Nom de la catégorie la plus adaptée",
  "categorySlug": "slug-de-la-categorie"
}`;

      const raw = await callClaude(systemPrompt, userPrompt, 4000);

      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Réponse inattendue de Claude');

      const article = JSON.parse(jsonMatch[0]) as {
        title: string;
        excerpt: string;
        content: string;
        category: string;
        categorySlug: string;
      };

      const slug = generateSlug(article.title);

      // ── Generate inline images ────────────────────────────────────────────
      const imageMarkerRegex = /\[IMAGE: ([^\]]+)\]/g;
      let processedContent = article.content;
      const markers: { marker: string; description: string; index: number }[] = [];

      let match;
      let imgIndex = 1;
      while ((match = imageMarkerRegex.exec(article.content)) !== null) {
        markers.push({ marker: match[0], description: match[1], index: imgIndex++ });
      }

      // Generate inline images in parallel (max 2)
      const inlineImageResults = await Promise.allSettled(
        markers.slice(0, 2).map(({ description, index }) =>
          generateInlineImage(description, `${slug}-${index}`)
        )
      );

      // Replace markers with actual image paths
      markers.slice(0, 2).forEach(({ marker, description }, i) => {
        const result = inlineImageResults[i];
        if (result.status === 'fulfilled') {
          processedContent = processedContent.replace(
            marker,
            `\n\n![${description.slice(0, 80)}](${result.value})\n\n`
          );
        } else {
          // Remove marker silently if generation failed
          processedContent = processedContent.replace(marker, '');
        }
      });

      // ── Generate cover image ──────────────────────────────────────────────
      let coverImage: string | undefined;
      try {
        coverImage = await generateArticleImage(article.title, article.excerpt, slug);
      } catch (err) {
        console.error('Cover image generation failed:', err);
        // Non-blocking — article saved without cover
      }

      // ── Save to Firestore ─────────────────────────────────────────────────
      await createArticleFS({
        title: article.title,
        slug,
        excerpt: article.excerpt,
        content: processedContent,
        category: article.category,
        categorySlug: article.categorySlug,
        date: formatDateFR(),
        author: 'Sophie Martin',
        authorBio: 'Experte en transformation digitale et technologies interactives.',
        readTime: estimateReadTime(processedContent),
        coverImage,
        status: 'brouillon',
      });

      return NextResponse.json({ slug });
    }

    return NextResponse.json({ error: 'Mode invalide' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Article generation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
