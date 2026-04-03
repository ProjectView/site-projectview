import { NextResponse } from 'next/server';

// POST /api/lucy/meeting/[id]/upload — Upload fichiers Nextcloud
export async function POST(request: Request, { params }: { params: { id: string } }) {
  // TODO: Implémenter l upload vers Nextcloud
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
