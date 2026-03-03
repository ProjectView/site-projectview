import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { convertToClient } from '@/lib/firestore-leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/leads/[id]/convert
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id } = await params;
  try {
    const lead = await convertToClient(id);
    return NextResponse.json({ lead });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
