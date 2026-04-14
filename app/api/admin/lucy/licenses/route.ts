import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { getSessionUser, getAllowedOrgIds, applyOrgScope } from '@/lib/rbac'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateLicenseKey(): string {
  const seg = () => Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  return `LUCY-${seg()}-${seg()}-${seg()}`
}

// ── GET : liste les licences (scopées par orgId selon rôle) ────────────────
export async function GET(request: NextRequest) {
  const auth = await getSessionUser(request)
  if (!auth.ok) return auth.response

  try {
    const db = getAdminFirestore()
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const typeFilter   = searchParams.get('type')
    const search       = searchParams.get('search')?.toLowerCase().trim()

    const allowedOrgIds = await getAllowedOrgIds(auth.user)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = db.collection('licenses').orderBy('createdAt', 'desc')
    query = applyOrgScope(query, allowedOrgIds)

    if (statusFilter) query = query.where('status', '==', statusFilter)
    if (typeFilter)   query = query.where('type',   '==', typeFilter)

    const snap = await query.limit(200).get()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let licenses = snap.docs.map((d: any) => {
      const data = d.data()
      return {
        id:           d.id,
        key:          data.key || data.licenseKey || '',
        type:         data.type || 'trial',
        status:       data.status || 'active',
        email:        data.email || '',
        clientName:   data.clientName || '',
        screenName:   data.screenName || '',
        fingerprint:  data.fingerprint || '',
        monthlyPrice: data.monthlyPrice ?? (data.type === 'paid' ? 29 : 0),
        orgId:        data.orgId ?? null,
        expiresAt:    data.expiresAt?.toDate?.()?.toISOString() ?? data.expiresAt ?? null,
        createdAt:    data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
        features:     data.features ?? {},
      }
    })

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      licenses = licenses.filter((l: any) =>
        l.key.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        l.clientName.toLowerCase().includes(search) ||
        l.screenName.toLowerCase().includes(search)
      )
    }

    return NextResponse.json({ licenses, total: licenses.length })
  } catch (err) {
    console.error('[lucy/licenses GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── POST : créer une nouvelle licence ────────────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = await getSessionUser(request)
  if (!auth.ok) return auth.response

  try {
    const db   = getAdminFirestore()
    const body = await request.json()
    const {
      type         = 'paid',
      expiryDays   = 365,
      email        = '',
      clientName   = '',
      screenName   = '',
      monthlyPrice = type === 'paid' ? 29 : 0,
      orgId: bodyOrgId = null,
      features     = {
        maxDuration:   3600,
        multiLanguage: true,
        videoCapture:  true,
        claudeVision:  true,
      },
    } = body

    // orgId : superadmin peut choisir librement, sinon = org de l'utilisateur courant
    let orgId: string | null = bodyOrgId
    if (auth.user.role !== 'superadmin') {
      orgId = auth.user.orgId ?? null
    }

    // Générer une clé unique
    let key = generateLicenseKey()
    let attempts = 0
    while (attempts < 5) {
      const existing = await db.collection('licenses').where('key', '==', key).limit(1).get()
      if (existing.empty) break
      key = generateLicenseKey()
      attempts++
    }

    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)

    const docRef = await db.collection('licenses').add({
      key,
      type,
      status:       'active',
      email,
      clientName,
      screenName,
      fingerprint:  '',
      monthlyPrice,
      orgId,
      features,
      expiresAt,
      createdAt:    FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      license: {
        id:    docRef.id,
        key,
        type,
        status: 'active',
        email,
        clientName,
        screenName,
        monthlyPrice,
        orgId,
        expiresAt: expiresAt.toISOString(),
        features,
      }
    }, { status: 201 })
  } catch (err) {
    console.error('[lucy/licenses POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
