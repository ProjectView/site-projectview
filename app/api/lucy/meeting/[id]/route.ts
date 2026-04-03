import { NextResponse } from 'next/server';

// GET /api/lucy/meeting/[id] — Details reunion
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: Implémenter la récupération des détails
  return NextResponse.json({ message: 'Not implemented', id }, { status: 501 });
}
