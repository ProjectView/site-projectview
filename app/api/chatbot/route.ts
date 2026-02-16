import { NextResponse } from 'next/server';
import { getChatbotConfig } from '@/lib/chatbot';
import { buildKnowledgeContext } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

// GET /api/chatbot — Public: get chatbot public config (enabled, welcome, position, color)
export async function GET() {
  try {
    const config = getChatbotConfig();
    // Only expose public-safe fields
    return NextResponse.json({
      enabled: config.enabled,
      welcomeMessage: config.welcomeMessage,
      position: config.position,
      accentColor: config.accentColor,
    });
  } catch {
    return NextResponse.json({ enabled: false });
  }
}

// POST /api/chatbot — Public: chat with the AI assistant
export async function POST(request: Request) {
  try {
    const config = getChatbotConfig();

    if (!config.enabled) {
      return NextResponse.json(
        { error: 'Le chatbot est actuellement désactivé.' },
        { status: 503 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages requis.' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API IA non configurée.' },
        { status: 500 }
      );
    }

    // Build enriched system prompt with knowledge base (CAG)
    const knowledgeContext = buildKnowledgeContext();
    const enrichedSystemPrompt = config.systemPrompt + knowledgeContext;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: enrichedSystemPrompt },
          ...messages.slice(-10), // Last 10 messages for context
        ],
        max_tokens: config.maxTokens || 500,
        temperature: config.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Désolé, je ne peux pas répondre pour le moment.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Erreur du chatbot. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
