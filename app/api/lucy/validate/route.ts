import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { findLicenseByKey, upsertDevice } from '@/lib/lucy-licenses'

// POST /api/lucy/validate — Validation licence + fingerprint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { licenseKey, fingerprint, deviceName, deviceOS, appVersion } = body

    if (!licenseKey || !fingerprint) {
      return NextResponse.json(
        { valid: false, error: 'licenseKey et fingerprint sont obligatoires.' },
        { status: 400 },
      )
    }

    const license = await findLicenseByKey(licenseKey)

    if (!license) {
      return NextResponse.json({ valid: false, error: 'Licence introuvable.' }, { status: 403 })
    }

    if (license.status !== 'active') {
      return NextResponse.json(
        { valid: false, error: `Licence ${license.status}.` },
        { status: 403 },
      )
    }

    const now = Date.now()
    const expTs = license.expiresAt ? new Date(license.expiresAt).getTime() : 0
    if (expTs < now) {
      const db = getAdminFirestore()
      await db.collection('licenses').doc(license.id).update({ status: 'expired' })
      return NextResponse.json({ valid: false, error: 'Licence expiree.' }, { status: 403 })
    }

    if (license.fingerprint && license.fingerprint !== fingerprint) {
      return NextResponse.json(
        { valid: false, error: 'Licence activee sur un autre appareil.' },
        { status: 403 },
      )
    }

    const db = getAdminFirestore()
    const updates: Record<string, unknown> = { lastValidation: Timestamp.now() }
    if (!license.fingerprint) {
      updates.fingerprint = fingerprint
      updates.activatedAt = Timestamp.now()
    }
    if (deviceName) updates.deviceName = deviceName

    await db.collection('licenses').doc(license.id).update(updates)

    await upsertDevice({
      fingerprint,
      name: deviceName || license.deviceName,
      os: deviceOS || license.deviceOS,
      licenseId: license.id,
      appVersion,
    })

    return NextResponse.json({
      valid: true,
      type: license.type,
      expiresAt: license.expiresAt.toDate().toISOString(),
      features: license.features,
    })
  } catch (err) {
    console.error('[/api/lucy/validate] Erreur:', err)
    return NextResponse.json({ valid: false, error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
