import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllClients } from '@/lib/firestore-leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/clients — List all clients
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const clients = await getAllClients();
    return NextResponse.json({ clients });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
