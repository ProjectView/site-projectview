import { NextResponse } from 'next/server';

// GET /api/lucy/meetings — Liste reunions d un client
export async function GET(request: Request) {
  // TODO: Implémenter la liste avec pagination
  return NextResponse.json({ meetings: [], total: 0 });
}
