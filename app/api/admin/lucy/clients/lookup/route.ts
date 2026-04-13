import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// GET /api/admin/lucy/clients/lookup
// Returns:
//   lookup: { [clientName | display]: company }
//   licenseKeyLookup: { [licenseKey]: company }
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request)
  if (authError) return authError
  const db = getAdminFirestore()
  try {
    // 1. Build clientName -> company from lucy_clients
    const snap = await db.collection('lucy_clients').select('name', 'company').get()
    const lookup: Record<string, string> = {}
    snap.docs.forEach(doc => {
      const { name, company } = doc.data()
      if (name) lookup[name] = company || ''
    })
    // 2. Build licenseKey -> company via licenses -> clientName -> lookup
    const licSnap = await db.collection('licenses').select('key', 'licenseKey', 'clientName').get()
    const licenseKeyLookup: Record<string, string> = {}
    licSnap.docs.forEach(doc => {
      const d = doc.data()
      const licKey = d.key || d.licenseKey || ''
      const displayName = d.clientName || 'Sans nom'
      if (licKey) licenseKeyLookup[licKey] = lookup[displayName] ?? ''
    })
    return NextResponse.json({ lookup, licenseKeyLookup })
  } catch (err) {
    console.error('[lucy/clients/lookup GET]', err)
    return NextResponse.json({ lookup: {}, licenseKeyLookup: {} })
  }
}
