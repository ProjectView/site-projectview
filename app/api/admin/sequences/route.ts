import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllSequences, createSequence } from '@/lib/firestore-sequences';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/sequences
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const sequences = await getAllSequences();
    return NextResponse.json({ sequences });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/sequences
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Le nom est requis.' }, { status: 400 });
    }
    if (!Array.isArray(body.emails) || body.emails.length === 0) {
      return NextResponse.json({ error: 'Au moins un email est requis.' }, { status: 400 });
    }
    const sequence = await createSequence({
      name: body.name.trim(),
      description: body.description?.trim() ?? '',
      emails: body.emails,
    });
    return NextResponse.json({ sequence }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
