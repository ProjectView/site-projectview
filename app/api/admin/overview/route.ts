import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { requireRole } from '@/lib/rbac'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_PAID_PRICE = 29

export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['superadmin'])
  if (!auth.ok) return auth.response

  try {
    const db = getAdminFirestore()

    // ── Organisations ──────────────────────────────────────────────────────
    const orgsSnap = await db.collection('organizations').get()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgs = orgsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
    const totalOrgs = orgs.length
    const clientFinalCount = orgs.filter((o: any) => o.type === 'client_final').length
    const resellerCount    = orgs.filter((o: any) => o.type === 'reseller').length

    // ── Utilisateurs ──────────────────────────────────────────────────────
    const usersSnap  = await db.collection('users').select('uid').get()
    const totalUsers = usersSnap.size

    // ── Licences ──────────────────────────────────────────────────────────
    const licensesSnap = await db.collection('licenses').get()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const licenses     = licensesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
    const activeLicenses  = licenses.filter(l => l.status === 'active')
    const trialLicenses   = activeLicenses.filter(l => l.type === 'trial').length
    const paidLicenses    = activeLicenses.filter(l => l.type === 'paid')
    const monthlyRevenue  = paidLicenses.reduce(
      (sum, l) => sum + (typeof l.monthlyPrice === 'number' ? l.monthlyPrice : DEFAULT_PAID_PRICE),
      0
    )

    // ── Réunions ──────────────────────────────────────────────────────────
    const meetingsSnap   = await db.collection('meetings').select('date', 'orgId').get()
    const totalMeetings  = meetingsSnap.size
    const sevenDaysAgo   = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoff = sevenDaysAgo.toISOString().split('T')[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentMeetings = meetingsSnap.docs.filter((d: any) => {
      const date = d.data().date
      return typeof date === 'string' && date >= cutoff
    }).length

    // ── Breakdown par organisation ─────────────────────────────────────────
    const orgStats: Record<string, { licenses: number; meetings: number; revenue: number }> = {}
    for (const org of orgs) {
      orgStats[org.id] = { licenses: 0, meetings: 0, revenue: 0 }
    }
    for (const lic of activeLicenses) {
      if (lic.orgId && orgStats[lic.orgId] !== undefined) {
        orgStats[lic.orgId].licenses++
        if (lic.type === 'paid') {
          orgStats[lic.orgId].revenue +=
            typeof lic.monthlyPrice === 'number' ? lic.monthlyPrice : DEFAULT_PAID_PRICE
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const m of meetingsSnap.docs as any[]) {
      const data = m.data()
      if (data.orgId && orgStats[data.orgId] !== undefined) {
        orgStats[data.orgId].meetings++
      }
    }
    const orgBreakdown = orgs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((org: any) => ({
        id:       org.id,
        name:     org.name ?? '(sans nom)',
        type:     org.type ?? 'client_final',
        plan:     org.plan ?? 'starter',
        licenses: orgStats[org.id]?.licenses ?? 0,
        meetings: orgStats[org.id]?.meetings ?? 0,
        revenue:  orgStats[org.id]?.revenue  ?? 0,
      }))
      .sort((a, b) => b.licenses - a.licenses)

    return NextResponse.json({
      totalOrgs,
      clientFinalCount,
      resellerCount,
      totalUsers,
      totalLicenses:  licenses.length,
      activeLicenses: activeLicenses.length,
      trialLicenses,
      paidLicenses:   paidLicenses.length,
      monthlyRevenue,
      totalMeetings,
      recentMeetings,
      orgBreakdown,
    })
  } catch (err) {
    console.error('[overview]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
