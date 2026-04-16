/**
 * lucy-licenses.ts
 *
 * Helpers pour gérer les licences Lucy dans Firestore.
 * Collection : `lucyLicenses` — document id = licenseId aléatoire
 *
 * Document shape :
 * {
 *   id:        string,          // = doc.id
 *   key:       string,          // clé secrète partagée avec le client
 *   type:      'trial' | 'subscription',
 *   status:    'active' | 'expired' | 'revoked' | 'suspended',
 *   orgId:     string,          // organisation Pulse
 *   plan:      'trial' | 'starter' | 'pro' | 'business' | 'enterprise',
 *   expiresAt: string,          // ISO 8601
 *   features:  LicenseFeatures,
 *   createdAt: string,
 *   updatedAt: string,
 * }
 */

import { getAdminFirestore } from '@/lib/firebase-admin'

export type AllowedOperatingMode = 'online' | 'offline' | 'hybrid'

export interface LicenseFeatures {
  maxDuration:          number               // secondes max par réunion
  multiLanguage:        boolean
  videoCapture:         boolean
  claudeVision:         boolean
  /** null = illimité */
  maxMeetingsPerMonth:  number | null
  /** modes de traitement autorisés */
  allowedModes:         AllowedOperatingMode[]
  /** null = illimité */
  maxDevices:           number | null
}

export interface LucyLicense {
  id:        string
  key:       string
  type:      'trial' | 'subscription'
  status:    'active' | 'expired' | 'revoked' | 'suspended'
  orgId?:    string
  plan:      'trial' | 'starter' | 'pro' | 'business' | 'enterprise'
  expiresAt: string
  features:  LicenseFeatures
  createdAt: string
  updatedAt: string
}

// ── Gamme tarifaire ──────────────────────────────────────────────────────────

export const PLAN_FEATURES: Record<LucyLicense['plan'], LicenseFeatures> = {
  /** Essai gratuit — toutes les fonctionnalités, limité à 10 réunions/mois */
  trial: {
    maxDuration:         3600,
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        true,
    maxMeetingsPerMonth: 10,
    allowedModes:        ['online', 'hybrid', 'offline'],
    maxDevices:          2,
  },
  /** Starter 29 €/mois — Cloud uniquement, 15 réunions/mois */
  starter: {
    maxDuration:         3600,
    multiLanguage:       false,
    videoCapture:        false,
    claudeVision:        false,
    maxMeetingsPerMonth: 15,
    allowedModes:        ['online'],
    maxDevices:          1,
  },
  /** Pro 49 €/mois — Cloud + Hybride, 40 réunions/mois */
  pro: {
    maxDuration:         7200,
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        false,
    maxMeetingsPerMonth: 40,
    allowedModes:        ['online', 'hybrid'],
    maxDevices:          2,
  },
  /** Business 89 €/mois — Tous modes, illimité */
  business: {
    maxDuration:         14400,
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        true,
    maxMeetingsPerMonth: null,
    allowedModes:        ['online', 'hybrid', 'offline'],
    maxDevices:          5,
  },
  /** Enterprise 129 €/mois — Tous modes, illimité, flotte gérée */
  enterprise: {
    maxDuration:         0,    // 0 = pas de limite
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        true,
    maxMeetingsPerMonth: null,
    allowedModes:        ['online', 'hybrid', 'offline'],
    maxDevices:          null,
  },
}

// ── Cache en mémoire (TTL ~5 min) ────────────────────────────────────────────

interface CacheEntry { license: LucyLicense; expiresAt: number }
const licenseCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 5 * 60 * 1000

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Trouve une licence par sa clé secrète.
 * Résultat mis en cache 5 min pour éviter trop de lectures Firestore.
 * Retourne `null` si la clé est introuvable.
 */
export async function findLicenseByKey(key: string): Promise<LucyLicense | null> {
  // Cache hit
  const cached = licenseCache.get(key)
  if (cached && Date.now() < cached.expiresAt) return cached.license

  const db = getAdminFirestore()
  const snap = await db
    .collection('lucyLicenses')
    .where('key', '==', key)
    .limit(1)
    .get()

  if (snap.empty) return null

  const doc  = snap.docs[0]
  const data = doc.data()

  const license: LucyLicense = {
    id:        doc.id,
    key:       data.key,
    type:      data.type       ?? 'subscription',
    status:    data.status     ?? 'active',
    orgId:     data.orgId,
    plan:      data.plan       ?? 'trial',
    expiresAt: data.expiresAt  ?? '',
    features:  data.features   ?? PLAN_FEATURES[data.plan ?? 'trial'],
    createdAt: data.createdAt  ?? new Date().toISOString(),
    updatedAt: data.updatedAt  ?? new Date().toISOString(),
  }

  licenseCache.set(key, { license, expiresAt: Date.now() + CACHE_TTL_MS })
  return license
}

/** Invalide le cache pour une clé donnée (ex : après changement de plan). */
export function invalidateLicenseCache(key: string): void {
  licenseCache.delete(key)
}
