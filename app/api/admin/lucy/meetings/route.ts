import { NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Fetch a larger window for client-side search filtering
    const fetchLimit = search ? 500 : limit
    const fetchOffset = search ? 0 : (page - 1) * limit

    const snap = await query.offset(fetchOffset).limit(fetchLimit).get()

    let meetings = snap.docs.map((doc: any) => {
      const d = doc.data()
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
        nextcloudPath:  d.nextcloudPath,
        language:       d.language,
        licenseKey:     d.licenseKey,
        createdAt:      d.createdAt,
        syncedAt:       d.syncedAt?.toDate?.()?.toISOString() ?? null,
      }
    })

    // Client-side search filter
    if (search) {
      meetings = meetings.filter((m: any) =>
        m.clientName?.toLowerCase().includes(search) ||
        m.title?.toLowerCase().includes(search) ||
        m.deviceName?.toLowerCase().includes(search) ||
        m.participants?.some((p: string) => p.toLowerCase().includes(search))
      )
    }

    const total = search ? meetings.length : (await query.count().get()).data().count
    const paged = search ? meetings.slice((page - 1) * limit, page * limit) : meetings

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
