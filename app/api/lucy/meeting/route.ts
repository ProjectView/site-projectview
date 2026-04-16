import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { findLicenseByKey } from '@/lib/lucy-licenses'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Payload envoyé par pulseSync.ts (Lucy App ≥ 0.3.0)
interface PulseMeetingPayload {
  id: string
  title: string
  date: string
  duration?: number
  language?: string
  // Noms de champs Lucy App
  client?: string
  device?: string
  // Noms legacy (compatibilité)
  clientName?: string
  deviceName?: string
  participants?: string[]
  summary?: Record<string, unknown> | string
  transcript?: string
  // Media URLs format Lucy App
  media_urls?: { audio?: string; camera?: string; screen?: string }
  // Format legacy
  audioUrl?: string
  nextcloudPath?: string
  createdAt?: string
  synced_at?: string
  lucy_version?: string
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const licenseKey = authHeader.slice(7).trim()
    const body = await request.json() as PulseMeetingPayload

    if (!body.id || !body.title || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, date' },
        { status: 400 }
      )
    }

    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 401 })
    }
    if (license.status === 'expired' || license.status === 'revoked') {
      return NextResponse.json({ error: 'License expired or revoked' }, { status: 403 })
    }

    // Auto-expire check
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      const db = getAdminFirestore()
      await db.collection('licenses').doc(license.id).update({ status: 'expired' })
      return NextResponse.json({ error: 'License expired' }, { status: 403 })
    }

    // Normalisation des champs (compatibilité pulseSync.ts + legacy)
    const clientName = body.clientName || body.client || license.clientName || ''
    const deviceName = body.deviceName || body.device || ''
    const audioUrl   = body.audioUrl   || body.media_urls?.audio  || ''
    const cameraUrl  = body.media_urls?.camera || ''
    const screenUrl  = body.media_urls?.screen || ''
    const createdAt  = body.createdAt  || body.synced_at || body.date
    // orgId hérité de la licence (RBAC) — peut être null (licence orpheline)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgId = (license as any).orgId ?? null

    // summary peut être un objet JSON (nouveau format) ou une string (legacy)
    const summaryStr =
      typeof body.summary === 'object' && body.summary !== null
        ? JSON.stringify(body.summary)
        : (body.summary ?? '')

    const db = getAdminFirestore()
    const meetingRef = db.collection('meetings').doc(body.id)
    await meetingRef.set({
      licenseId:     license.id,
      licenseKey,
      orgId,
      title:         body.title,
      date:          body.date,
      duration:      body.duration      ?? 0,
      participants:  body.participants  ?? [],
      clientName,
      deviceName,
      transcript:    body.transcript    ?? '',
      summary:       summaryStr,
      audioUrl,
      cameraUrl,
      screenUrl,
      nextcloudPath: body.nextcloudPath ?? '',
      language:      body.language      ?? 'fr',
      lucyVersion:   body.lucy_version  ?? '',
      createdAt,
      syncedAt:      Timestamp.now(),
    }, { merge: true })

    return NextResponse.json({ meetingId: body.id, synced: true })
  } catch (err) {
    console.error('[API /lucy/meeting POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
