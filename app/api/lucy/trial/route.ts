import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'
import {
  generateLicenseKey,
  trialExistsForFingerprint,
  trialExistsForEmail,
  upsertDevice,
  notifyN8N,
  DEFAULT_FEATURES,
  TRIAL_DURATION_DAYS,
} from '@/lib/lucy-licenses'

// POST /api/lucy/trial — Creation licence d'essai 30 jours
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fingerprint, deviceName, deviceOS, email, clientName, screenName } = body

    if (!fingerprint || !email || !deviceName) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : fingerprint, email, deviceName." },
        { status: 400 },
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (await trialExistsForFingerprint(fingerprint)) {
      return NextResponse.json(
        { error: "Une licence d'essai existe deja pour cet appareil." },
        { status: 409 },
      )
    }

    if (await trialExistsForEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Une licence d'essai existe deja pour cet email." },
        { status: 409 },
      )
    }

    const key = generateLicenseKey()
    const now = Timestamp.now()
    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000),
    )

    const db = getAdminFirestore()

    const licenseRef = await db.collection('licenses').add({
      key,
      type: 'trial',
      status: 'active',
      email: normalizedEmail,
      clientName: clientName || '',
      screenName: screenName || '',
      fingerprint,
      deviceName,
      deviceOS: deviceOS || 'unknown',
      createdAt: now,
      activatedAt: now,
      expiresAt,
      lastValidation: null,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      features: DEFAULT_FEATURES,
    })

    await upsertDevice({
      fingerprint,
      name: screenName || deviceName,
      os: deviceOS || 'unknown',
      licenseId: licenseRef.id,
    })

    notifyN8N('lucy.trial.created', {
      email: normalizedEmail,
      clientName: clientName || '',
      deviceName,
      licenseKey: key,
      expiresAt: expiresAt.toDate().toISOString(),
    }).catch(() => {})

    return NextResponse.json({
      licenseKey: key,
      expiresAt: expiresAt.toDate().toISOString(),
      features: DEFAULT_FEATURES,
    })
  } catch (err) {
    console.error('[/api/lucy/trial] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
