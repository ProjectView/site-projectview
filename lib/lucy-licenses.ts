import { FieldValue } from 'firebase-admin/firestore'
import { getAdminFirestore } from './firebase-admin'

export const TRIAL_DURATION_DAYS = 30

export const DEFAULT_FEATURES = {
  maxDuration: 180,
  multiLanguage: true,
  videoCapture: true,
  claudeVision: true,
}

export interface LicenseDoc {
  key: string
  type: 'trial' | 'subscription'
  status: 'active' | 'expired' | 'suspended' | 'revoked'
  email: string
  clientName: string
  screenName?: string
  fingerprint: string | null
  deviceName: string
  deviceOS: string
  createdAt: FirebaseFirestore.Timestamp
  activatedAt: FirebaseFirestore.Timestamp | null
  expiresAt: FirebaseFirestore.Timestamp
  lastValidation: FirebaseFirestore.Timestamp | null
  stripeSubscriptionId: string | null
  stripeCustomerId: string | null
  features: typeof DEFAULT_FEATURES
}

/** Genere une cle format LUCY-XXXX-XXXX-XXXX (sans I, O, 0, 1) */
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segment = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `LUCY-${segment()}-${segment()}-${segment()}`
}

/** Verifie si une trial existe deja pour ce fingerprint */
export async function trialExistsForFingerprint(fingerprint: string): Promise<boolean> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('licenses')
    .where('fingerprint', '==', fingerprint)
    .where('type', '==', 'trial')
    .limit(1)
    .get()
  return !snap.empty
}

/** Verifie si une trial existe deja pour cet email */
export async function trialExistsForEmail(email: string): Promise<boolean> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('licenses')
    .where('email', '==', email)
    .where('type', '==', 'trial')
    .limit(1)
    .get()
  return !snap.empty
}

/** Cherche une licence par cle — retourne null si non trouvee */
export async function findLicenseByKey(
  key: string,
): Promise<(LicenseDoc & { id: string }) | null> {
  const db = getAdminFirestore()
  const snap = await db.collection('licenses').where('key', '==', key).limit(1).get()
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...(snap.docs[0].data() as LicenseDoc) }
}

/** Cree ou met a jour le document device dans Firestore */
export async function upsertDevice(params: {
  fingerprint: string
  name: string
  os: string
  licenseId: string
  appVersion?: string
}): Promise<void> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('devices')
    .where('fingerprint', '==', params.fingerprint)
    .limit(1)
    .get()

  const data = {
    fingerprint: params.fingerprint,
    name: params.name,
    os: params.os,
    licenseId: params.licenseId,
    appVersion: params.appVersion || '1.0.0',
    lastSeen: FieldValue.serverTimestamp(),
    whisperModelInstalled: false,
  }

  if (snap.empty) {
    await db.collection('devices').add(data)
  } else {
    await snap.docs[0].ref.update(data)
  }
}

/** Notifie via N8N (non-bloquant — silencieux en cas d'erreur) */
export async function notifyN8N(event: string, payload: Record<string, unknown>): Promise<void> {
  const webhook = process.env.N8N_WEBHOOK_LUCY
  if (!webhook) return
  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...payload }),
    })
  } catch {
    // Silencieux — N8N est optionnel
  }
}
