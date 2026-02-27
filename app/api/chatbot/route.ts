import { NextResponse } from 'next/server';
import { getChatbotConfig } from '@/lib/chatbot';
import { buildKnowledgeContext } from '@/lib/knowledge-base';
import { createAppointment } from '@/lib/firestore-appointments';

// Regex to detect the booking marker emitted by the AI
const APPOINTMENT_REGEX = /<<APPOINTMENT_BOOKED:([\s\S]+?)>>/;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/chatbot — Public: get chatbot public config (enabled, welcome, position, color)
export async function GET() {
  try {
    const config = await getChatbotConfig();
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
    const config = await getChatbotConfig();

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

    // Clé API : priorité à la clé saisie dans l'admin, sinon variable d'env
    const apiKey = config.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API IA non configurée. Renseignez-la dans Admin → Chatbot.' },
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
    const rawReply: string = data.choices?.[0]?.message?.content || 'Désolé, je ne peux pas répondre pour le moment.';

    // ── Detect appointment booking marker ──────────────────────────────────────
    const match = rawReply.match(APPOINTMENT_REGEX);
    if (match) {
      // Strip the marker from the displayed reply
      const cleanReply = rawReply.replace(APPOINTMENT_REGEX, '').trim();

      try {
        const parsed = JSON.parse(match[1]);
        const appointment = await createAppointment({
          status: 'pending',
          prospect: {
            name: String(parsed.name || '').slice(0, 100),
            email: String(parsed.email || '').slice(0, 200),
            phone: parsed.phone && parsed.phone !== 'null' ? String(parsed.phone).slice(0, 30) : null,
            company: parsed.company && parsed.company !== 'null' ? String(parsed.company).slice(0, 100) : null,
            comment: parsed.comment && parsed.comment !== 'null' ? String(parsed.comment).slice(0, 1000) : null,
          },
          slot: {
            date: parsed.date && parsed.date !== 'null' ? String(parsed.date).slice(0, 10) : null,
            time: parsed.time && parsed.time !== 'null' ? String(parsed.time).slice(0, 5) : null,
            duration: Number(parsed.duration) || 60,
            subject: String(parsed.subject || 'Demande de démonstration Projectview').slice(0, 200),
            notes: parsed.notes && parsed.notes !== 'null' ? String(parsed.notes).slice(0, 500) : null,
          },
          source: 'chatbot',
        });

        return NextResponse.json({
          reply: cleanReply,
          appointmentBooked: {
            id: appointment.id,
            date: appointment.slot.date,
            time: appointment.slot.time,
            subject: appointment.slot.subject,
            name: appointment.prospect.name,
          },
        });
      } catch (bookingError) {
        console.error('Appointment booking error:', bookingError);
        // Don't fail the chat — just return the clean reply without booking confirmation
        return NextResponse.json({ reply: cleanReply });
      }
    }

    return NextResponse.json({ reply: rawReply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Erreur du chatbot. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
