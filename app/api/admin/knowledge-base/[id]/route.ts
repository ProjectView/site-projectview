import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { removeDocument, getDocumentById } from '@/lib/knowledge-base';

export const runtime = 'nodejs';

// DELETE — Supprimer un document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

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
