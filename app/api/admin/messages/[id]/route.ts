import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import {
  getMessageById,
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,
} from '@/lib/messages';

export const runtime = 'nodejs';

async function checkAuth(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  return null;
}

// GET /api/admin/messages/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const message = await getMessageById(id);
    if (!message) {
      return NextResponse.json({ error: 'Message introuvable.' }, { status: 404 });
    }

    // Auto-mark as read when viewed
    await markMessageAsRead(id);

    return NextResponse.json({ message: { ...message, read: true } });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/messages/[id] — Toggle read/unread
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const { read } = body;

    let success;
    if (read) {
      success = await markMessageAsRead(id);
    } else {
      success = await markMessageAsUnread(id);
    }

    if (!success) {
      return NextResponse.json({ error: 'Message introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/messages/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const success = await deleteMessage(id);
    if (!success) {
      return NextResponse.json({ error: 'Message introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
