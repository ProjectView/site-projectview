import { NextResponse } from 'next/server';
import { createMessage } from '@/lib/messages';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, company, solution, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis.' },
        { status: 400 },
      );
    }

    // Persist message locally
    await createMessage({ name, email, phone, company, solution, message });

    // Forward to N8N webhook if configured
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl && !webhookUrl.includes('your-n8n')) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || '',
          company: company || '',
          solution: solution || '',
          message,
          timestamp: new Date().toISOString(),
          source: 'projectview.fr',
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message.' },
      { status: 500 },
    );
  }
}
