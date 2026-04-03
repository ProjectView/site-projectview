import { NextResponse } from 'next/server';

// POST /api/lucy/meeting/[id]/transcribe — Declenche transcription + CR
export async function POST(request: Request, { params }: { params: { id: string } }) {
  // TODO: Implémenter AssemblyAI + Claude API
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
