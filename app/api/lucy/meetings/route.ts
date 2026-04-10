import { NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { findLicenseByKey } from '@/lib/lucy-licenses'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const licenseKey = authHeader.slice(7).trim()

    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 401 })
    }
    if (license.status === 'expired' || license.status === 'revoked') {
      return NextResponse.json({ error: 'License expired or revoked' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const from = searchParams.get('from')  // ISO date string
    const to = searchParams.get('to')      // ISO date string

    const db = getAdminFirestore()
    let query = db.collection('meetings')
      .where('licenseId', '==', license.id)
      .orderBy('date', 'desc')

    if (from) query = query.where('date', '>=', from) as typeof query
    if (to)   query = query.where('date', '<=', to) as typeof query

    // Total count (separate query)
    const countSnap = await query.count().get()
    const total = countSnap.data().count

    // Paginated results
    const offset = (page - 1) * limit
    const snap = await query.offset(offset).limit(limit).get()

    const meetings = snap.docs.map(doc => {
      const d = doc.data()
      return {
        id: doc.id,
        title: d.title,
        date: d.date,
        duration: d.duration,
        participants: d.participants,
        clientName: d.clientName,
        deviceName: d.deviceName,
        summary: d.summary,
        audioUrl: d.audioUrl,
        nextcloudPath: d.nextcloudPath,
        language: d.language,
        createdAt: d.createdAt,
        syncedAt: d.syncedAt?.toDate?.()?.toISOString() ?? null,
      }
    })

    return NextResponse.json({
      meetings,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[API /lucy/meetings GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
