import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RETENTION_DAYS = 90
const WARNING_THRESHOLD = 76

function computeRetention(createdAt: string | null) {
  if (!createdAt) return { ageDays: 0, daysRemaining: RETENTION_DAYS, status: 'ok' as const }
  const created = new Date(createdAt)
  const now = new Date()
  const ageDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, RETENTION_DAYS - ageDays)
  const status = ageDays > RETENTION_DAYS ? 'expired' as const
    : ageDays >= WARNING_THRESHOLD ? 'warning' as const
    : 'ok' as const
  return { ageDays, daysRemaining, status }
}

type Params = { id: string }

export async function GET(
  request: NextRequest,
  segmentData: { params: Promise<Params> }
) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  const { id } = await segmentData.params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const db = getAdminFirestore()
    const doc = await db.collection('meetings').doc(id).get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const d = doc.data()!
    const createdAtStr = d.createdAt?.toDate?.()?.toISOString() ?? d.createdAt ?? null
    const retention = computeRetention(createdAtStr)

    return NextResponse.json({
      id:             doc.id,
      title:          d.title         ?? '',
      date:           d.date          ?? '',
      duration:       d.duration      ?? 0,
      participants:   d.participants  ?? [],
      clientName:     d.clientName    ?? '',
      deviceName:     d.deviceName    ?? '',
      summary:        d.summary       ?? '',
      transcript:     d.transcript    ?? '',
      audioUrl:       d.audioUrl      ?? '',
      cameraUrl:      d.cameraUrl     ?? '',
      screenUrl:      d.screenUrl     ?? '',
      nextcloudPath:  d.nextcloudPath ?? '',
      language:       d.language      ?? '',
      licenseKey:     d.licenseKey    ?? '',
      licenseId:      d.licenseId     ?? '',
      lucyVersion:    d.lucyVersion   ?? '',
      mode:           d.mode          ?? 'cloud',
      createdAt:      createdAtStr,
      syncedAt:       d.syncedAt?.toDate?.()?.toISOString()  ?? null,
      retention,
    })
  } catch (err) {
    console.error('[API /admin/lucy/meetings/[id] GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  segmentData: { params: Promise<Params> }
) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  const { id } = await segmentData.params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const db = getAdminFirestore()
    const doc = await db.collection('meetings').doc(id).get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await db.collection('meetings').doc(id).delete()
    return NextResponse.json({ deleted: true, id })
  } catch (err) {
    console.error('[API /admin/lucy/meetings/[id] DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
