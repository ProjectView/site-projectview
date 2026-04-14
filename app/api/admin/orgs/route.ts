import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireRole } from '@/lib/rbac'
import {
  listOrganizations,
  listChildOrganizations,
  getOrganization,
  createOrganization,
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

// POST /api/admin/orgs — créer une organisation
export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response

  try {
    const body = (await request.json()) as {
      name?: string
      type?: 'projectview' | 'reseller' | 'client_final'
      parentOrgId?: string | null
      axonautId?: string | null
      plan?: string | null
    }

    if (!body.name?.trim() || !body.type) {
      return NextResponse.json({ error: 'name et type sont requis.' }, { status: 400 })
    }

    if (auth.user.globalRole !== 'superadmin') {
      if (!body.parentOrgId || body.parentOrgId !== auth.user.orgId) {
        return NextResponse.json(
          { error: 'Vous ne pouvez créer des organisations que sous la vôtre.' },
          { status: 403 },
        )
      }
    }

    const id = await createOrganization({
      name: body.name.trim(),
      type: body.type,
      parentOrgId: body.parentOrgId ?? null,
      axonautId: body.axonautId ?? null,
      plan: body.plan ?? null,
    })

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
