import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import {
  updateAppointmentStatus,
  deleteAppointment,
} from '@/lib/firestore-appointments';
import type { AppointmentStatus } from '@/lib/firestore-appointments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STATUSES: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled'];

// PATCH /api/admin/agenda/[id] — Update status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
    }

    await updateAppointmentStatus(id, status as AppointmentStatus);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/agenda/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await deleteAppointment(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
