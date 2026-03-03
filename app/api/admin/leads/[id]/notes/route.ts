import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getNotes, addNote } from '@/lib/firestore-leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/leads/[id]/notes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id } = await params;
  try {
    const notes = await getNotes(id);
    return NextResponse.json({ notes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/leads/[id]/notes
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id } = await params;
  try {
    const body = await request.json();
    if (!body.content?.trim()) {
      return NextResponse.json({ error: 'Le contenu est requis.' }, { status: 400 });
    }
    const note = await addNote(id, {
      type: body.type ?? 'note',
      content: body.content.trim(),
      author: 'Admin',
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
