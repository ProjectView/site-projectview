import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Lazy singleton — Firebase client n'est initialisé qu'au premier appel,
 * jamais pendant le SSR ou la phase de build Next.js.
 */
function getClientApp() {
  if (getApps().length > 0) return getApp();

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  // Pendant le build (SSR), les variables NEXT_PUBLIC peuvent être absentes.
  // On retourne null pour signaler l'absence de config, la page gèrera le cas.
  if (!apiKey) return null;

  return initializeApp({
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

export function getClientAuth() {
  const app = getClientApp();
  if (!app) return null;
  return getAuth(app);
}
