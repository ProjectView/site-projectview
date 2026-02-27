import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllMessages, getUnreadCount } from '@/lib/messages';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const messages = await getAllMessages();
    const unreadCount = await getUnreadCount();

    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
