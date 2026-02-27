import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_COOKIE_NAME = '__session';
const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000; // 5 jours

// POST /api/admin/session — Crée un cookie de session à partir d'un ID token Firebase
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Token manquant.' }, { status: 400 });
    }

    // Vérifier l'ID token et créer un session cookie (5 jours)
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    // Décoder le token pour récupérer les infos utilisateur
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const userInfo = JSON.stringify({
      email: decoded.email || '',
      uid: decoded.uid,
      name: decoded.name || decoded.email?.split('@')[0] || 'Admin',
    });

    const response = NextResponse.json({ success: true });

    // Cookie httpOnly pour l'authentification server-side
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    });

    // Cookie lisible côté client pour afficher les infos utilisateur
    response.cookies.set('__user_info', userInfo, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    });

    return response;
  } catch (error) {
    console.error('Erreur création session:', error);
    return NextResponse.json(
      { error: 'Token invalide ou expiré.' },
      { status: 401 }
    );
  }
}

// DELETE /api/admin/session — Supprime le cookie de session (déconnexion)
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set('__user_info', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
