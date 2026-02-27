import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/deploy — Trigger Netlify deploy
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

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
