import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// POST /api/admin/deploy — Trigger Netlify deploy
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const hookUrl = process.env.NETLIFY_BUILD_HOOK;
    if (!hookUrl || hookUrl === 'your-netlify-build-hook-url-here') {
      return NextResponse.json(
        { error: 'NETLIFY_BUILD_HOOK non configuré.' },
        { status: 400 }
      );
    }

    const response = await fetch(hookUrl, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`Netlify a répondu avec le statut ${response.status}`);
    }

    return NextResponse.json({ success: true, message: 'Déploiement déclenché.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
