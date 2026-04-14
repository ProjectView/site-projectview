import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireRole } from '@/lib/rbac'
import { listApps } from '@/lib/firestore-users'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/admin/apps — liste des SaaS enregistrés (actifs)
export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response

  try {
    const apps = await listApps({ onlyActive: true })
    return NextResponse.json({ apps })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
