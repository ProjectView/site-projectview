import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { removeDocument, getDocumentById } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

// DELETE — Supprimer un document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id } = await params;

  const doc = getDocumentById(id);
  if (!doc) {
    return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
  }

  const success = removeDocument(id);
  if (!success) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
