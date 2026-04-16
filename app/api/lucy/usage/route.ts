import { NextResponse } from 'next/server'
import { findLicenseByKey } from '@/lib/lucy-licenses'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// GET /api/lucy/usage — retourne le quota mensuel de la licence
export async function GET(request: Request) {
  try {
    const licenseKey = request.headers.get('x-lucy-key')
    if (!licenseKey) {
      return NextResponse.json({ error: 'x-lucy-key manquant.' }, { status: 401 })
    }
    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ error: 'Licence introuvable.' }, { status: 403 })
    }
    if (license.status !== 'active') {
      return NextResponse.json({ error: 'Licence ' + license.status + '.' }, { status: 403 })
    }
    const db = getAdminFirestore()
    const snap = await db.collection('lucyLicenses').doc(license.id).get()
    const data = snap.data() ?? {}
    const currentMonth = new Date().toISOString().slice(0, 7)
    const used = data.meetingsUsedMonth === currentMonth
      ? (data.meetingsUsedThisMonth ?? 0)
      : 0
    return NextResponse.json({
      used,
      max: license.features?.maxMeetingsPerMonth ?? null,
      month: currentMonth,
      plan: license.plan,
    })
  } catch (err) {
    console.error('[/api/lucy/usage GET] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}

// POST /api/lucy/usage — incremente le compteur de reunions du mois
export async function POST(request: Request) {
  try {
    const licenseKey = request.headers.get('x-lucy-key')
    if (!licenseKey) {
      return NextResponse.json({ error: 'x-lucy-key manquant.' }, { status: 401 })
    }
    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ error: 'Licence introuvable.' }, { status: 403 })
    }
    if (license.status !== 'active') {
      return NextResponse.json({ error: 'Licence ' + license.status + '.' }, { status: 403 })
    }
    const expTs = license.expiresAt ? new Date(license.expiresAt as string).getTime() : 0
    if (expTs > 0 && expTs < Date.now()) {
      return NextResponse.json({ error: 'Licence expiree.' }, { status: 403 })
    }
    const db = getAdminFirestore()
    const docRef = db.collection('lucyLicenses').doc(license.id)
    const snap = await docRef.get()
    const data = snap.data() ?? {}
    const currentMonth = new Date().toISOString().slice(0, 7)
    const isNewMonth = data.meetingsUsedMonth !== currentMonth
    const currentUsed: number = isNewMonth ? 0 : (data.meetingsUsedThisMonth ?? 0)
    const max: number | null = license.features?.maxMeetingsPerMonth ?? null
    if (max !== null && currentUsed >= max) {
      return NextResponse.json(
        { error: 'Quota mensuel atteint (' + max + ' reunions).', used: currentUsed, max },
        { status: 429 },
      )
    }
    if (isNewMonth) {
      await docRef.update({ meetingsUsedThisMonth: 1, meetingsUsedMonth: currentMonth })
    } else {
      await docRef.update({
        meetingsUsedThisMonth: FieldValue.increment(1),
        meetingsUsedMonth: currentMonth,
      })
    }
    return NextResponse.json({
      success: true,
      used: currentUsed + 1,
      max,
      month: currentMonth,
      plan: license.plan,
    })
  } catch (err) {
    console.error('[/api/lucy/usage POST] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
