import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { updateSequence, deleteSequence, duplicateSequence } from '@/lib/firestore-sequences';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH /api/admin/sequences/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id } = await params;
  try {
    const body = await request.json();

    // Action spéciale : dupliquer
    if (body._action === 'duplicate') {
      const sequence = await duplicateSequence(id);
      return NextResponse.json({ sequence });
    }

    const sequence = await updateSequence(id, body);
    return NextResponse.json({ sequence });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/sequences/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id } = await params;
  try {
    await deleteSequence(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
