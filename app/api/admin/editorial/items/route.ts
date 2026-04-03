import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllEditorialItems, createEditorialItem } from '@/lib/firestore-editorial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const items = await getAllEditorialItems();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { date, theme, platform, format, objective, status } = body;

    if (!date || !theme) {
      return NextResponse.json({ error: 'date et theme sont requis' }, { status: 400 });
    }

    const item = await createEditorialItem({
      date,
      theme,
      platform: platform ?? [],
      ...(format ? { format } : {}),
      ...(objective ? { objective } : {}),
      status: status ?? 'planifie',
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
