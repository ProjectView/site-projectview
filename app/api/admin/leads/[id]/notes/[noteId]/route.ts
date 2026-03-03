import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { deleteNote } from '@/lib/firestore-leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// DELETE /api/admin/leads/[id]/notes/[noteId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id, noteId } = await params;
  try {
    await deleteNote(id, noteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
