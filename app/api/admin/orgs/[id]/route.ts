import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireRole } from '@/lib/rbac'
import {
  getOrganization,
  updateOrganization,
  listUsersByOrg,
  listChildOrganizations,
} from '@/lib/firestore-users'
import { getAdminFirestore } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PATCH /api/admin/orgs/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const org = await getOrganization(id)
    if (!org) {
      return NextResponse.json({ error: 'Organisation introuvable.' }, { status: 404 })
    }

    if (auth.user.globalRole !== 'superadmin') {
      if (id !== auth.user.orgId && org.parentOrgId !== auth.user.orgId) {
        return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 })
      }
    }

    const body = (await request.json()) as {
      name?: string
      type?: 'projectview' | 'reseller' | 'client_final'
      parentOrgId?: string | null
      axonautId?: string | null
      plan?: string | null
    }

    const patch: Parameters<typeof updateOrganization>[1] = {}
    if (body.name !== undefined) patch.name = body.name.trim()
    if (body.type !== undefined) patch.type = body.type
    if ('parentOrgId' in body) patch.parentOrgId = body.parentOrgId ?? null
    if ('axonautId' in body) patch.axonautId = body.axonautId ?? null
    if ('plan' in body) patch.plan = body.plan ?? null

    await updateOrganization(id, patch)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/admin/orgs/[id] — superadmin uniquement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(request, ['superadmin'])
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const users = await listUsersByOrg(id)
    if (users.length > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer : ${users.length} utilisateur(s) rattach�(s).` },
        { status: 409 },
      )
    }

    const children = await listChildOrganizations(id)
    if (children.length > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer : ${children.length} sous-organisation(s) existante(s).` },
        { status: 409 },
      )
    }

    const db = getAdminFirestore()
    await db.collection('organizations').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
