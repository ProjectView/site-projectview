import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllRuns } from '@/lib/firestore-sequences';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/sequences/runs
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const runs = await getAllRuns();
    return NextResponse.json({ runs });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
