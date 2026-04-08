/**
 * Next.js API Route — App Router
 * Fichier à placer dans : app/api/lucy/trial/route.ts
 *
 * Dépendances (déjà dans ton package.json si Firebase Admin est utilisé) :
 *   npm install firebase-admin uuid
 *
 * Variables d'environnement utilisées (déjà configurées sur Netlify) :
 *   FIREBASE_PROJECT_ID     → site-projectview
 *   FIREBASE_CLIENT_EMAIL   → firebase-adminsdk-fbsvc@site-projectview.iam.gserviceaccount.com
 *   FIREBASE_PRIVATE_KEY    → clé RSA (déjà dans Netlify)
 *
 * Endpoint accessible à : https://projectview.fr/api/lucy/trial
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

// ─── Firebase Admin (init une seule fois) ──────────────────────────────────
function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

// ─── Config ────────────────────────────────────────────────────────────────
const TRIAL_DAYS = 30;
const TRIAL_FEATURES = {
  maxDuration:   180,
  multiLanguage: true,
  videoCapture:  true,
  claudeVision:  true,
};

function generateLicenseKey(): string {
  const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LUCY-${seg()}-${seg()}-${seg()}`;
}

// ─── CORS helper ──────────────────────────────────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── OPTIONS (preflight CORS) ─────────────────────────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// ─── POST /api/lucy/trial ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fingerprint, deviceName, deviceOS, email, clientName, screenName } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!email?.includes('@'))
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400, headers: corsHeaders });
    if (!clientName?.trim() || clientName.trim().length < 2)
      return NextResponse.json({ error: 'Nom entreprise requis.' }, { status: 400, headers: corsHeaders });
    if (!screenName?.trim())
      return NextResponse.json({ error: 'Nom écran requis.' }, { status: 400, headers: corsHeaders });
    if (!fingerprint)
      return NextResponse.json({ error: 'Fingerprint manquant.' }, { status: 400, headers: corsHeaders });

    const db = getAdminDb();

    // ── Anti-abus : un trial actif par fingerprint ────────────────────────────
    const existing = await db
      .collection('lucy_licenses')
      .where('fingerprint', '==', fingerprint)
      .where('type', '==', 'trial')
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0].data();
      const expired = doc.expiresAt.toDate() < new Date();
      if (!expired) {
        return NextResponse.json(
          {
            error:      'Un essai existe déjà pour cet appareil.',
            licenseKey: doc.licenseKey,
            expiresAt:  doc.expiresAt.toDate().toISOString(),
          },
          { status: 409, headers: corsHeaders }
        );
      }
    }

    // ── Création de la licence ────────────────────────────────────────────────
    const licenseKey = generateLicenseKey();
    const now        = new Date();
    const expiresAt  = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
    const id         = uuidv4();

    await db.collection('lucy_licenses').doc(id).set({
      id,
      licenseKey,
      type:        'trial',
      status:      'active',
      fingerprint,
      deviceName:  deviceName  ?? '',
      deviceOS:    deviceOS    ?? '',
      email:       email.toLowerCase().trim(),
      clientName:  clientName.trim(),
      screenName:  screenName.trim(),
      createdAt:   Timestamp.fromDate(now),
      expiresAt:   Timestamp.fromDate(expiresAt),
      features:    TRIAL_FEATURES,
    });

    console.log(`[Lucy] Nouveau trial : ${email} | ${clientName} | ${screenName}`);

    return NextResponse.json(
      {
        licenseKey,
        type:       'trial',
        status:     'active',
        expiresAt:  expiresAt.toISOString(),
        features:   TRIAL_FEATURES,
        clientName: clientName.trim(),
        screenName: screenName.trim(),
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (err) {
    console.error('[Lucy] Erreur /api/lucy/trial:', err);
    return NextResponse.json(
      { error: 'Erreur serveur. Réessayez.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ─── GET /api/lucy/validate/[key] ─────────────────────────────────────────────
// Créer aussi : app/api/lucy/validate/[key]/route.ts
// avec la logique : chercher lucy_licenses où licenseKey == key
