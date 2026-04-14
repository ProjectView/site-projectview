import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { getSessionUser, getAllowedOrgIds, applyOrgScope } from '@/lib/rbac'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await getSessionUser(request)
  if (!auth.ok) return auth.response

  try {
    const db = getAdminFirestore()
    const allowedOrgIds = await getAllowedOrgIds(auth.user)

    // ── Licences (scoped par orgId) ───────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let licensesQuery: any = db.collection('licenses')
    licensesQuery = applyOrgScope(licensesQuery, allowedOrgIds)
    const licensesSnap = await licensesQuery.get()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const licenses = licensesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as any[]

    // ── Réunions : nb meetings par licenseKey (scoped par orgId) ─
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let meetingsQuery: any = db.collection('meetings')
    meetingsQuery = applyOrgScope(meetingsQuery, allowedOrgIds)
    const meetingsSnap = await meetingsQuery.select('licenseKey', 'date').get()

    const meetingCounts: Record<string, number>   = {}
    const lastMeetingDate: Record<string, string> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meetingsSnap.docs.forEach((d: any) => {
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
        orgId: string | null
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
        orgId:        lic.orgId ?? null,
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
