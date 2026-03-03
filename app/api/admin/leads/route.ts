import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllLeads, createLead } from '@/lib/firestore-leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/leads — List all leads
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const leads = await getAllLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/leads — Create a lead
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.firstName || !body.lastName || !body.company || !body.email) {
      return NextResponse.json(
        { error: 'Prénom, nom, société et email sont requis.' },
        { status: 400 }
      );
    }

    const lead = await createLead(body);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
