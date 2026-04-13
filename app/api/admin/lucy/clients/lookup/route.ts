import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/admin/lucy/clients/lookup
// Returns { lookup: { [clientName]: company } }
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  const db = getAdminFirestore()
  try {
    const snap = await db.collection('lucy_clients').select('name', 'company').get()
    const lookup: Record<string, string> = {}
    snap.docs.forEach(doc => {
      const { name, company } = doc.data()
      if (name) lookup[name] = company || ''
    })
    return NextResponse.json({ lookup })
  } catch (err) {
    console.error('[lucy/clients/lookup GET]', err)
    return NextResponse.json({ lookup: {} })
  }
}
