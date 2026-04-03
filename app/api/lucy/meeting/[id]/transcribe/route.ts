import { NextResponse } from 'next/server';

// POST /api/lucy/meeting/[id]/transcribe — Declenche transcription + CR
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: Implémenter AssemblyAI + Claude API
  return NextResponse.json({ message: 'Not implemented', id }, { status: 501 });
}
