import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireRole } from '@/lib/rbac'
import {
  getUser,
  updateUser,
  toggleUserApp,
  setUserAppRole,
  canActOnOrg,
} from '@/lib/firestore-users'
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PATCH /api/admin/users/[id]
// Body possible: { displayName?, globalRole?, password?, disabled?, enabledApps?, appRoles? }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response
  const { id } = await params

  try {
    const target = await getUser(id)
    if (!target) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 })
    }

    // Admin_client ne peut agir que sur les users de ses orgs gérées
    if (auth.user.globalRole !== 'superadmin') {
      const allowed = await canActOnOrg(auth.user, target.orgId)
      if (!allowed) {
        return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 })
      }
    }

    const body = (await request.json()) as {
      displayName?: string
      globalRole?: 'superadmin' | 'admin_client' | 'user_client'
      password?: string
      disabled?: boolean
      enabledApps?: Record<string, boolean>
      appRoles?: Record<string, string>
    }

    // Seul superadmin peut promouvoir/rétrograder superadmin
    if (body.globalRole && auth.user.globalRole !== 'superadmin') {
      if (body.globalRole === 'superadmin' || target.globalRole === 'superadmin') {
        return NextResponse.json(
          { error: 'Seul un superadmin peut gérer ce rôle.' },
          { status: 403 },
        )
      }
    }

    // Password -> Firebase Auth
    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
          { status: 400 },
        )
      }
      await getAdminAuth().updateUser(id, { password: body.password })
    }

    // Disabled -> Auth + Firestore
    if (typeof body.disabled === 'boolean') {
      await getAdminAuth().updateUser(id, { disabled: body.disabled })
    }

    // Patch Firestore user doc
    const patch: Record<string, unknown> = {}
    if (body.displayName !== undefined) patch.displayName = body.displayName
    if (body.globalRole !== undefined) patch.globalRole = body.globalRole
    if (typeof body.disabled === 'boolean') patch.disabled = body.disabled
    if (body.enabledApps !== undefined) patch.enabledApps = body.enabledApps
    if (body.appRoles !== undefined) patch.appRoles = body.appRoles
    if (Object.keys(patch).length > 0) {
      await updateUser(id, patch as Parameters<typeof updateUser>[1])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] — supprime Auth + Firestore
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response
  const { id } = await params

  try {
    if (id === auth.user.uid) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte.' },
        { status: 400 },
      )
    }

    const target = await getUser(id)
    if (!target) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 })
    }

    if (auth.user.globalRole !== 'superadmin') {
      if (target.globalRole === 'superadmin') {
        return NextResponse.json(
          { error: 'Seul un superadmin peut supprimer un superadmin.' },
          { status: 403 },
        )
      }
      const allowed = await canActOnOrg(auth.user, target.orgId)
      if (!allowed) {
        return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 })
      }
    }

    // Supprime Firestore d'abord, puis Auth (ordre : moins risqué si Auth échoue)
    const db = getAdminFirestore()
    await db.collection('users').doc(id).delete()
    await getAdminAuth()
      .deleteUser(id)
      .catch(() => {
        // Si le user Auth n'existe déjà plus, on ignore
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
