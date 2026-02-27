import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Lazy singleton — Firebase Admin n'est initialisé qu'au premier appel,
 * jamais pendant la phase de build Next.js (collecte de pages statiques).
 */
function getAdminApp() {
  if (getApps().length > 0) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin : variables d\'environnement manquantes (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).'
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

/**
 * Vérifie le cookie de session Firebase sur une requête API.
 * Retourne null si valide, sinon retourne une réponse 401.
 */
export async function checkAdminSession(
  request: NextRequest
): Promise<NextResponse | null> {
  const sessionCookie = request.cookies.get('__session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return null; // Valid — continue
  } catch {
    return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  }
}
