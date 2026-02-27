import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getChatbotConfig, saveChatbotConfig } from '@/lib/chatbot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/chatbot — Get chatbot config
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const config = getChatbotConfig();
    return NextResponse.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/chatbot — Update chatbot config
export async function PUT(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const config = saveChatbotConfig(body);
    return NextResponse.json({ success: true, config });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
