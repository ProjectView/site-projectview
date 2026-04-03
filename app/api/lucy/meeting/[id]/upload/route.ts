import { NextResponse } from 'next/server';

// POST /api/lucy/meeting/[id]/upload — Upload fichiers Nextcloud
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: Implémenter l upload vers Nextcloud
  return NextResponse.json({ message: 'Not implemented', id }, { status: 501 });
}
