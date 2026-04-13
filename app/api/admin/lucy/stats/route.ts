import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_PAID_PRICE = 29 // €/mois par défaut

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  try {
    const db = getAdminFirestore()

    // ── Licences ──────────────────────────────────────────────
    const licensesSnap = await db.collection('licenses').get()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const licenses = licensesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

    const activeLicenses  = licenses.filter(l => l.status === 'active')
    const clientNames     = new Set(licenses.map(l => l.clientName).filter(Boolean))
    const activeDevices   = activeLicenses.length
    const trialLicenses   = activeLicenses.filter(l => l.type === 'trial').length
    const paidActive      = activeLicenses.filter(l => l.type === 'paid')
    const monthlyRevenue  = paidActive.reduce(
      (sum, l) => sum + (typeof l.monthlyPrice === 'number' ? l.monthlyPrice : DEFAULT_PAID_PRICE),
      0
    )

    // ── Réunions ──────────────────────────────────────────────
    const meetingsSnap = await db.collection('meetings').select('date').get()
    const totalMeetings = meetingsSnap.size

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoff = sevenDaysAgo.toISOString().split('T')[0]
    const recentMeetings = meetingsSnap.docs.filter(d => {
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
