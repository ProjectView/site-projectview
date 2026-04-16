/**
 * lucy-licenses.ts
 *
 * Helpers pour gérer les licences Lucy dans Firestore.
 * Collection principale : `lucyLicenses`
 */

import { FieldValue } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'

// ── Types ────────────────────────────────────────────────────────────────────

export type AllowedOperatingMode = 'online' | 'offline' | 'hybrid'

export interface LicenseFeatures {
  maxDuration:          number
  multiLanguage:        boolean
  videoCapture:         boolean
  claudeVision:         boolean
  maxMeetingsPerMonth:  number | null
  allowedModes:         AllowedOperatingMode[]
  maxDevices:           number | null
}

export type FirestoreTimestampLike = { toDate(): Date }

export interface LucyLicense {
  id:           string
  key:          string
  type:         'trial' | 'subscription'
  status:       'active' | 'expired' | 'revoked' | 'suspended'
  orgId?:       string
  plan:         'trial' | 'starter' | 'pro' | 'business' | 'enterprise'
  fingerprint?: string
  deviceName?:  string
  deviceOS?:    string
  email?:       string
  clientName?:  string
  screenName?:  string
  expiresAt:    string | FirestoreTimestampLike
  activatedAt?: string | FirestoreTimestampLike
  features:     LicenseFeatures
  createdAt:    string
  updatedAt:    string
}

/** @deprecated Use LucyLicense instead */
export interface LicenseDoc {
  key:                    string
  type:                   string
  status:                 string
  email:                  string
  clientName:             string
  screenName:             string
  fingerprint:            string
  deviceName:             string
  deviceOS:               string
  createdAt:              string
  activatedAt:            string
  expiresAt:              string
  lastValidation:         string
  stripeSubscriptionId?:  string
  stripeCustomerId?:      string
  features:               Record<string, unknown>
}

// ── Gamme tarifaire ──────────────────────────────────────────────────────────

export const PLAN_FEATURES: Record<LucyLicense['plan'], LicenseFeatures> = {
  trial: {
    maxDuration:         3600,
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        true,
    maxMeetingsPerMonth: 10,
    allowedModes:        ['online', 'hybrid', 'offline'],
    maxDevices:          2,
  },
  starter: {
    maxDuration:         3600,
    multiLanguage:       false,
    videoCapture:        false,
    claudeVision:        false,
    maxMeetingsPerMonth: 15,
    allowedModes:        ['online'],
    maxDevices:          1,
  },
  pro: {
    maxDuration:         7200,
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        false,
    maxMeetingsPerMonth: 40,
    allowedModes:        ['online', 'hybrid'],
    maxDevices:          2,
  },
  business: {
    maxDuration:         14400,
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        true,
    maxMeetingsPerMonth: null,
    allowedModes:        ['online', 'hybrid', 'offline'],
    maxDevices:          5,
  },
  enterprise: {
    maxDuration:         0,
    multiLanguage:       true,
    videoCapture:        true,
    claudeVision:        true,
    maxMeetingsPerMonth: null,
    allowedModes:        ['online', 'hybrid', 'offline'],
    maxDevices:          null,
  },
}

/** @deprecated Utiliser PLAN_FEATURES.trial.maxDuration */
export const TRIAL_DURATION_DAYS = 30

/** @deprecated Utiliser PLAN_FEATURES.trial */
export const DEFAULT_FEATURES = PLAN_FEATURES.trial

// ── Cache en mémoire (TTL ~5 min) ────────────────────────────────────────────

interface CacheEntry { license: LucyLicense; expiresAt: number }
const licenseCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 5 * 60 * 1000

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Génère une clé de licence aléatoire (format LCY-XXXX...).
 * @deprecated La génération est faite directement dans trial/route.ts via crypto.
 */
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = 'LCY-'
  for (let i = 0; i < 24; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}

/**
 * Vérifie si un essai existe déjà pour ce fingerprint.
 * @deprecated Logique désormais inline dans trial/route.ts (idempotent).
 */
export async function trialExistsForFingerprint(fingerprint: string): Promise<boolean> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('lucyLicenses')
    .where('fingerprint', '==', fingerprint)
    .where('type', '==', 'trial')
    .limit(1)
    .get()
  return !snap.empty
}

/**
 * Vérifie si un essai existe déjà pour cet email.
 * @deprecated Logique désormais inline dans trial/route.ts (idempotent).
 */
export async function trialExistsForEmail(email: string): Promise<boolean> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('lucyLicenses')
    .where('email', '==', email)
    .where('type', '==', 'trial')
    .limit(1)
    .get()
  return !snap.empty
}

/**
 * Trouve une licence par sa clé secrète.
 * Résultat mis en cache 5 min pour éviter trop de lectures Firestore.
 * Retourne null si la clé est introuvable.
 */
export async function findLicenseByKey(key: string): Promise<LucyLicense | null> {
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
    id:          doc.id,
    key:         data.key,
    type:        data.type        ?? 'subscription',
    status:      data.status      ?? 'active',
    orgId:       data.orgId,
    plan:        data.plan        ?? 'trial',
    fingerprint: data.fingerprint,
    deviceName:  data.deviceName,
    deviceOS:    data.deviceOS,
    email:       data.email,
    clientName:  data.clientName,
    screenName:  data.screenName,
    expiresAt:   data.expiresAt   ?? '',
    activatedAt: data.activatedAt,
    features:    data.features    ?? PLAN_FEATURES[data.plan ?? 'trial'],
    createdAt:   data.createdAt   ?? new Date().toISOString(),
    updatedAt:   data.updatedAt   ?? new Date().toISOString(),
  }

  licenseCache.set(key, { license, expiresAt: Date.now() + CACHE_TTL_MS })
  return license
}

/** Invalide le cache pour une clé donnée (ex : après changement de plan). */
export function invalidateLicenseCache(key: string): void {
  licenseCache.delete(key)
}

/**
 * Enregistre ou met à jour un device dans la collection devices.
 * Appelé depuis activate/route.ts et validate/route.ts.
 */
export async function upsertDevice(params: {
  fingerprint:  string
  name:         string
  os?:          string
  licenseId:    string
  appVersion?:  string
}): Promise<void> {
  const db = getAdminFirestore()
  const { fingerprint, name, os, licenseId, appVersion } = params

  const snap = await db
    .collection('devices')
    .where('fingerprint', '==', fingerprint)
    .limit(1)
    .get()

  const now = new Date().toISOString()

  if (snap.empty) {
    await db.collection('devices').add({
      fingerprint,
      name,
      os:          os         ?? 'unknown',
      licenseId,
      appVersion:  appVersion ?? '',
      createdAt:   now,
      updatedAt:   now,
    })
  } else {
    await snap.docs[0].ref.update({
      name,
      os:          os         ?? 'unknown',
      licenseId,
      ...(appVersion ? { appVersion } : {}),
      updatedAt:   FieldValue.serverTimestamp(),
    })
  }
}

/**
 * Notifie N8N d'un événement (webhook).
 * @deprecated Non utilisé en production.
 */
export async function notifyN8N(
  event:   string,
  payload: Record<string, unknown>
): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) return
  try {
    await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ event, ...payload }),
    })
  } catch (e) {
    console.warn('[notifyN8N] failed:', e)
  }
}
