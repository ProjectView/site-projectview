import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllConversations } from '@/lib/firestore-conversations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await checkAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const conversations = await getAllConversations();
    return NextResponse.json(conversations);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
