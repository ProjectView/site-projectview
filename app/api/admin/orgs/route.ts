import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireRole } from '@/lib/rbac'
import {
  listOrganizations,
  listChildOrganizations,
  getOrganization,
} from '@/lib/firestore-users'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/admin/orgs — superadmin: toutes; admin_client: sa propre + enfants
export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response

  try {
    if (auth.user.globalRole === 'superadmin') {
      const orgs = await listOrganizations()
      return NextResponse.json({ orgs })
    }

    const own = await getOrganization(auth.user.orgId)
    const children = await listChildOrganizations(auth.user.orgId)
    const orgs = own ? [own, ...children] : children
    return NextResponse.json({ orgs })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
