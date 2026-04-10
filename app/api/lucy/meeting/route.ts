import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { findLicenseByKey } from '@/lib/lucy-licenses'

interface PulseMeetingData {
  id: string
  title: string
  date: string
  duration: number
  participants: string[]
  clientName: string
  deviceName: string
  transcript?: string
  summary?: string
  audioUrl?: string
  nextcloudPath?: string
  language?: string
  createdAt: string
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const licenseKey = authHeader.slice(7).trim()

    const body = await request.json() as PulseMeetingData
    if (!body.id || !body.title || !body.date) {
      return NextResponse.json({ error: 'Missing required fields: id, title, date' }, { status: 400 })
    }

    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 401 })
    }
    if (license.status === 'expired' || license.status === 'revoked') {
      return NextResponse.json({ error: 'License expired or revoked' }, { status: 403 })
    }
    // Auto-expire check
    if (license.expiresAt && license.expiresAt.toDate() < new Date()) {
      const db = getAdminFirestore()
      await db.collection('licenses').doc(license.id).update({ status: 'expired' })
      return NextResponse.json({ error: 'License expired' }, { status: 403 })
    }

    const db = getAdminFirestore()
    const meetingRef = db.collection('meetings').doc(body.id)

    await meetingRef.set({
      licenseId: license.id,
      licenseKey,
      title: body.title,
      date: body.date,
      duration: body.duration ?? 0,
      participants: body.participants ?? [],
      clientName: body.clientName ?? license.clientName ?? '',
      deviceName: body.deviceName ?? '',
      transcript: body.transcript ?? '',
      summary: body.summary ?? '',
      audioUrl: body.audioUrl ?? '',
      nextcloudPath: body.nextcloudPath ?? '',
      language: body.language ?? 'fr',
      createdAt: body.createdAt ?? body.date,
      syncedAt: Timestamp.now(),
    }, { merge: true })

    return NextResponse.json({ meetingId: body.id, synced: true })
  } catch (err) {
    console.error('[API /lucy/meeting POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
