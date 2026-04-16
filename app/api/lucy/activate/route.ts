import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { findLicenseByKey, upsertDevice } from '@/lib/lucy-licenses'

// POST /api/lucy/activate — Activation licence sur un device specifique
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { licenseKey, fingerprint, deviceName, deviceOS } = body

    if (!licenseKey || !fingerprint || !deviceName) {
      return NextResponse.json(
        { error: 'Champs obligatoires : licenseKey, fingerprint, deviceName.' },
        { status: 400 },
      )
    }

    const license = await findLicenseByKey(licenseKey)

    if (!license) {
      return NextResponse.json({ error: 'Licence introuvable.' }, { status: 404 })
    }

    if (license.status !== 'active') {
      return NextResponse.json({ error: `Licence ${license.status}.` }, { status: 403 })
    }

    const expTs = license.expiresAt ? new Date(license.expiresAt).getTime() : 0
    if (expTs < Date.now()) {
      return NextResponse.json({ error: 'Licence expiree.' }, { status: 403 })
    }

    if (license.fingerprint && license.fingerprint !== fingerprint) {
      return NextResponse.json(
        { error: 'Cette licence est deja activee sur un autre appareil.' },
        { status: 409 },
      )
    }

    const db = getAdminFirestore()
    const isFirstActivation = !license.fingerprint

    await db.collection('licenses').doc(license.id).update({
      fingerprint,
      deviceName,
      deviceOS: deviceOS || 'unknown',
      activatedAt: isFirstActivation ? Timestamp.now() : license.activatedAt,
      lastValidation: Timestamp.now(),
    })

    await upsertDevice({
      fingerprint,
      name: deviceName,
      os: deviceOS || 'unknown',
      licenseId: license.id,
    })

    return NextResponse.json({
      activated: true,
      licenseKey: license.key,
      type: license.type,
      expiresAt: license.expiresAt.toDate().toISOString(),
      features: license.features,
    })
  } catch (err) {
    console.error('[/api/lucy/activate] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
