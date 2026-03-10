import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getConversationById, deleteConversation } from '@/lib/firestore-conversations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await checkAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await getConversationById(id);
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation introuvable' }, { status: 404 });
  }

  return NextResponse.json(conversation);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await checkAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteConversation(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Conversation introuvable' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
