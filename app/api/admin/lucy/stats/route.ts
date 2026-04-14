import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { getSessionUser, getAllowedOrgIds, applyOrgScope } from '@/lib/rbac'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_PAID_PRICE = 29 // €/mois par défaut

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

    const activeLicenses = licenses.filter(l => l.status === 'active')
    const clientNames    = new Set(licenses.map(l => l.clientName).filter(Boolean))
    const activeDevices  = activeLicenses.length
    const trialLicenses  = activeLicenses.filter(l => l.type === 'trial').length
    const paidActive     = activeLicenses.filter(l => l.type === 'paid')
    const monthlyRevenue = paidActive.reduce(
      (sum, l) => sum + (typeof l.monthlyPrice === 'number' ? l.monthlyPrice : DEFAULT_PAID_PRICE),
      0
    )

    // ── Réunions (scoped par orgId) ───────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let meetingsQuery: any = db.collection('meetings')
    meetingsQuery = applyOrgScope(meetingsQuery, allowedOrgIds)
    const meetingsSnap = await meetingsQuery.select('date').get()
    const totalMeetings = meetingsSnap.size

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoff = sevenDaysAgo.toISOString().split('T')[0]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentMeetings = meetingsSnap.docs.filter((d: any) => {
      const date = d.data().date
      return typeof date === 'string' && date >= cutoff
    }).length

    return NextResponse.json({
      clients:        clientNames.size,
      activeDevices,
      trialLicenses,
      paidLicenses:   paidActive.length,
      monthlyRevenue,
      totalLicenses:  licenses.length,
      totalMeetings,
      recentMeetings,
    })
  } catch (err) {
    console.error('[lucy/stats]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
