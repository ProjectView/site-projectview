import { NextResponse } from 'next/server';

// POST /api/lucy/trial — Creation licence d essai 30j
export async function POST(request: Request) {
  // TODO: Implémenter la création de trial
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
