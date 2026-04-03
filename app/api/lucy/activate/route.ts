import { NextResponse } from 'next/server';

// POST /api/lucy/activate — Activation licence sur device
export async function POST(request: Request) {
  // TODO: Implémenter l activation de licence
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
