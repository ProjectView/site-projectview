import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  const { id } = params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const db = getAdminFirestore()
    const doc = await db.collection('meetings').doc(id).get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const d = doc.data()!
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
      createdAt:      d.createdAt?.toDate?.()?.toISOString() ?? null,
      syncedAt:       d.syncedAt?.toDate?.()?.toISOString()  ?? null,
    })
  } catch (err) {
    console.error('[API /admin/lucy/meetings/[id] GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
