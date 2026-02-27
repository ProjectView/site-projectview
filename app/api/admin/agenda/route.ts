import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllAppointments } from '@/lib/firestore-appointments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/agenda — All appointments, newest first
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const appointments = await getAllAppointments();
    return NextResponse.json({ appointments });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
