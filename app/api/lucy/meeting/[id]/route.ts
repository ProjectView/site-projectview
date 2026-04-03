import { NextResponse } from 'next/server';

// GET /api/lucy/meeting/[id] — Details reunion
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // TODO: Implémenter la récupération des détails
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
