import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  try {
    const db = getAdminFirestore()

    // ── Licences ──────────────────────────────────────────────
    const licensesSnap = await db.collection('licenses').get()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const licenses = licensesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

    // ── Réunions : nb meetings par licenseKey ─────────────────
    const meetingsSnap = await db.collection('meetings').select('licenseKey', 'date').get()
    const meetingCounts: Record<string, number> = {}
    const lastMeetingDate: Record<string, string> = {}

    meetingsSnap.docs.forEach(d => {
      const { licenseKey, date } = d.data()
      if (!licenseKey) return
      meetingCounts[licenseKey] = (meetingCounts[licenseKey] ?? 0) + 1
      if (!lastMeetingDate[licenseKey] || date > lastMeetingDate[licenseKey]) {
        lastMeetingDate[licenseKey] = date
      }
    })

    // ── Groupement par clientName ─────────────────────────────
    const clientMap: Record<string, {
      name: string
      devices: {
        id: string
        licenseKey: string
        screenName: string
        type: string
        status: string
        fingerprint: string
        email: string
        expiresAt: string | null
        meetingCount: number
        lastMeeting: string | null
        createdAt: string | null
      }[]
    }> = {}

    for (const lic of licenses) {
      const name = lic.clientName || 'Sans nom'
      if (!clientMap[name]) {
        clientMap[name] = { name, devices: [] }
      }
      const key = lic.key || lic.licenseKey || ''
      clientMap[name].devices.push({
        id:           lic.id,
        licenseKey:   key,
        screenName:   lic.screenName || lic.deviceName || '—',
        type:         lic.type || 'trial',
        status:       lic.status || 'active',
        fingerprint:  lic.fingerprint || '',
        email:        lic.email || '',
        expiresAt:    lic.expiresAt?.toDate?.()?.toISOString() ?? lic.expiresAt ?? null,
        meetingCount: meetingCounts[key] ?? 0,
        lastMeeting:  lastMeetingDate[key] ?? null,
        createdAt:    lic.createdAt?.toDate?.()?.toISOString() ?? lic.createdAt ?? null,
      })
    }

    const clients = Object.values(clientMap).sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ clients })
  } catch (err) {
    console.error('[lucy/clients]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
