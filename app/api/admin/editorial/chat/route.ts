import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import {
  getEditorialConfig,
  getAllEditorialItems,
  getEditorialChatHistory,
  appendEditorialChatMessages,
  type ChatMessage,
} from '@/lib/firestore-editorial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-6';

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const messages = await getEditorialChatHistory();
    return NextResponse.json(messages);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { message } = body as { message: string };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message est requis' }, { status: 400 });
    }

    // Fetch context in parallel
    const [config, items, history] = await Promise.all([
      getEditorialConfig(),
      getAllEditorialItems(),
      getEditorialChatHistory(),
    ]);

    // Build planning summary for context
    const itemsSummary = items.length > 0
      ? items
          .slice(0, 60)
          .map((i) => `- ${i.date} | 📱 ${i.platform?.join(', ')} | ${i.format ? `[${i.format}]` : ''} "${i.theme}" [${i.status}]`)
          .join('\n')
      : 'Aucun item planifié pour le moment.';

    const configSummary = config
      ? `Thématiques : ${config.themes}\nTon : ${config.tone}\nRéseaux actifs : ${config.activePlatforms?.join(', ')}\nFréquence : ${Object.entries(config.postsPerPlatform ?? {}).map(([p, n]) => `${p}: ${n}/sem`).join(', ')}\nMoments clés : ${config.keyMoments || 'Non renseignés'}\nSecteurs : ${config.targetSectors?.join(', ')}\nObjectifs : ${config.objectives?.join(', ')}\nStyle visuel : ${config.visualStyle}`
      : 'Configuration non définie.';

    const systemPrompt = `Tu es un expert en stratégie de contenu et marketing de contenu B2B, spécialisé dans les solutions technologiques pour espaces physiques (affichage dynamique, collaboration, VR, IA). Tu conseilles l'équipe de Projectview sur sa stratégie éditoriale.

Tu as accès au contexte complet du planning éditorial :

## Configuration éditoriale
${configSummary}

## Planning actuel (${items.length} items)
${itemsSummary}

Ton rôle :
- Conseiller sur la cohérence éditoriale et la diversité des contenus
- Suggérer des thèmes d'articles ou posts sociaux pertinents
- Identifier les opportunités manquées ou les déséquilibres dans le planning
- Recommander des ajustements de timing (moments clés, saisonnalité)
- Proposer des angles différenciants et des formats innovants
- Donner des conseils SEO concrets sur les thèmes proposés

Réponds en français, de façon concise et actionnelle. Sois direct et pratique, pas théorique.`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY manquant dans .env.local');

    // Use last 20 messages as conversation history
    const recentHistory = history.slice(-20);
    const claudeMessages = [
      ...recentHistory.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: message },
    ];

    const res = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        system: systemPrompt,
        messages: claudeMessages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Erreur Claude API (${res.status}): ${err}`);
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text ?? '';

    const now = new Date().toISOString();
    const newMessages: ChatMessage[] = [
      { role: 'user', content: message, timestamp: now },
      { role: 'assistant', content: reply, timestamp: now },
    ];

    await appendEditorialChatMessages(newMessages);

    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Editorial chat error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
