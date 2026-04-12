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

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10))
    const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const from   = searchParams.get('from')
    const to     = searchParams.get('to')
    const search = searchParams.get('search')?.toLowerCase().trim()

    const db = getAdminFirestore()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = db.collection('meetings').orderBy('date', 'desc')

    if (from) query = query.where('date', '>=', from)
    if (to)   query = query.where('date', '<=', to)

    const fetchLimit  = search ? 500 : limit
    const fetchOffset = search ? 0   : (page - 1) * limit

    const snap = await query.offset(fetchOffset).limit(fetchLimit).get()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let meetings = snap.docs.map((doc: any) => {
      const d = doc.data()
      const createdAtStr = d.createdAt?.toDate?.()?.toISOString() ?? d.createdAt ?? null
      return {
        id:             doc.id,
        title:          d.title,
        date:           d.date,
        duration:       d.duration,
        participants:   d.participants,
        clientName:     d.clientName,
        deviceName:     d.deviceName,
        summary:        d.summary,
        audioUrl:       d.audioUrl,
        cameraUrl:      d.cameraUrl ?? '',
        screenUrl:      d.screenUrl ?? '',
        nextcloudPath:  d.nextcloudPath,
        language:       d.language,
        licenseKey:     d.licenseKey,
        mode:           d.mode ?? 'cloud',
        createdAt:      createdAtStr,
        syncedAt:       d.syncedAt?.toDate?.()?.toISOString() ?? null,
        retention:      computeRetention(createdAtStr),
      }
    })

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meetings = meetings.filter((m: any) =>
        m.clientName?.toLowerCase().includes(search) ||
        m.title?.toLowerCase().includes(search) ||
        m.deviceName?.toLowerCase().includes(search) ||
        m.participants?.some((p: string) => p.toLowerCase().includes(search))
      )
    }

    const total  = search ? meetings.length : (await query.count().get()).data().count
    const paged  = search ? meetings.slice((page - 1) * limit, page * limit) : meetings

    return NextResponse.json({
      meetings: paged,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[API /admin/lucy/meetings GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
