import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireRole } from '@/lib/rbac'
import {
  createUser,
  listUsersByOrg,
  listOrganizations,
  canActOnOrg,
} from '@/lib/firestore-users'
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/admin/users — superadmin: tous; admin_client: sa propre org + orgs enfants
export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response

  try {
    if (auth.user.globalRole === 'superadmin') {
      const db = getAdminFirestore()
      const snap = await db.collection('users').orderBy('email').get()
      const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      return NextResponse.json({ users })
    }

    // admin_client : sa propre org + enfants
    const own = await listUsersByOrg(auth.user.orgId)
    const db = getAdminFirestore()
    const childOrgsSnap = await db
      .collection('organizations')
      .where('parentOrgId', '==', auth.user.orgId)
      .get()
    const childIds = childOrgsSnap.docs.map((d) => d.id)
    const childUsers: Awaited<ReturnType<typeof listUsersByOrg>> = []
    for (const oid of childIds) {
      const u = await listUsersByOrg(oid)
      childUsers.push(...u)
    }
    return NextResponse.json({ users: [...own, ...childUsers] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/admin/users — créer un user (Auth + Firestore)
export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['superadmin', 'admin_client'])
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    const {
      email,
      password,
      displayName,
      orgId,
      globalRole,
      enabledApps,
      appRoles,
    } = body as {
      email?: string
      password?: string
      displayName?: string
      orgId?: string
      globalRole?: 'superadmin' | 'admin_client' | 'user_client'
      enabledApps?: Record<string, boolean>
      appRoles?: Record<string, string>
    }

    if (!email || !password || !displayName || !orgId || !globalRole) {
      return NextResponse.json(
        { error: 'email, password, displayName, orgId, globalRole requis.' },
        { status: 400 },
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 },
      )
    }

    // Admin_client ne peut pas créer de superadmin et doit cibler une org qu'il gère
    if (auth.user.globalRole !== 'superadmin') {
      if (globalRole === 'superadmin') {
        return NextResponse.json(
          { error: 'Seul un superadmin peut créer un superadmin.' },
          { status: 403 },
        )
      }
      const allowed = await canActOnOrg(auth.user, orgId)
      if (!allowed) {
        return NextResponse.json(
          { error: 'Vous ne pouvez pas créer un utilisateur dans cette organisation.' },
          { status: 403 },
        )
      }
    }

    // Création Auth
    const authSdk = getAdminAuth()
    const authUser = await authSdk.createUser({
      email: email.toLowerCase(),
      password,
      displayName,
    })

    // Création profil Firestore
    await createUser({
      uid: authUser.uid,
      email: email.toLowerCase(),
      displayName,
      orgId,
      globalRole,
      enabledApps,
      appRoles,
    })

    return NextResponse.json({ success: true, uid: authUser.uid }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
