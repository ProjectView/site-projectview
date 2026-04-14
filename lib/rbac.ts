import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getAdminAuth } from './firebase-admin'
import {
  canActOnOrg,
  getSessionUserFromUid,
  type AppSlug,
  type GlobalRole,
  type SessionUser,
} from './firestore-users'

// ==========================================
// RBAC helpers — wrappers session + rôles
// ==========================================

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: NextResponse }

const unauthorized = (msg: string, status = 401): NextResponse =>
  NextResponse.json({ error: msg }, { status })

/**
 * Vérifie le cookie __session, décode le UID, charge le profil RBAC.
 * À utiliser au début de chaque route API protégée.
 */
export async function getSessionUser(request: NextRequest): Promise<AuthResult> {
  const cookie = request.cookies.get('__session')?.value
  if (!cookie) return { ok: false, response: unauthorized('Non autorisé.', 401) }

  let uid: string
  try {
    const decoded = await getAdminAuth().verifySessionCookie(cookie, true)
    uid = decoded.uid
  } catch {
    return { ok: false, response: unauthorized('Session expirée.', 401) }
  }

  const user = await getSessionUserFromUid(uid)
  if (!user) {
    return {
      ok: false,
      response: unauthorized('Profil RBAC introuvable. Contactez un administrateur.', 403),
    }
  }
  return { ok: true, user }
}

/** Exige un rôle global parmi la liste fournie (ex. ['superadmin', 'admin_client']) */
export async function requireRole(
  request: NextRequest,
  roles: GlobalRole[],
): Promise<AuthResult> {
  const r = await getSessionUser(request)
  if (!r.ok) return r
  if (!roles.includes(r.user.globalRole)) {
    return {
      ok: false,
      response: unauthorized('Privilèges insuffisants pour cette action.', 403),
    }
  }
  return r
}

/** Exige que l'utilisateur puisse agir sur l'organisation cible (voir canActOnOrg) */
export async function requireOrgAccess(
  request: NextRequest,
  targetOrgId: string,
): Promise<AuthResult> {
  const r = await getSessionUser(request)
  if (!r.ok) return r
  const allowed = await canActOnOrg(r.user, targetOrgId)
  if (!allowed) {
    return {
      ok: false,
      response: unauthorized('Accès refusé à cette organisation.', 403),
    }
  }
  return r
}

/** Exige que l'app (sidebar item) soit activée pour cet utilisateur */
export async function requireApp(
  request: NextRequest,
  slug: AppSlug,
): Promise<AuthResult> {
  const r = await getSessionUser(request)
  if (!r.ok) return r
  if (!r.user.enabledApps?.[slug]) {
    return {
      ok: false,
      response: unauthorized(`App « ${slug} » non activée pour cet utilisateur.`, 403),
    }
  }
  return r
}

// ==========================================
// Helpers booléens — utilisables côté UI (Server Components)
// ==========================================

export const isSuperadmin = (u: SessionUser): boolean => u.globalRole === 'superadmin'
export const isAdminClient = (u: SessionUser): boolean => u.globalRole === 'admin_client'
export const isUserClient = (u: SessionUser): boolean => u.globalRole === 'user_client'

/** True si l'utilisateur a accès à AU MOINS une des apps données */
export function hasAnyApp(u: SessionUser, slugs: AppSlug[]): boolean {
  return slugs.some((s) => u.enabledApps?.[s] === true)
}

/** True si l'utilisateur a un rôle applicatif spécifique sur un SaaS donné */
export function hasAppRole(u: SessionUser, slug: AppSlug, role: string): boolean {
  return u.appRoles?.[slug] === role
}

// ==========================================
// Scoping helpers — listes d'orgs accessibles
// ==========================================

import { listChildOrganizations } from './firestore-users'

/**
 * Retourne la liste des orgIds qu'un utilisateur peut voir.
 *
 * - superadmin       → null (aucun filtre — accès global)
 * - admin_client     → [orgId propre, ...orgIds des enfants directs]
 * - user_client      → [orgId propre]
 *
 * Les appelants doivent traiter `null` comme « pas de filtre »,
 * un tableau vide comme « aucun accès » (⇒ résultat vide).
 */
export async function getAllowedOrgIds(
  user: SessionUser,
): Promise<string[] | null> {
  if (user.globalRole === 'superadmin') return null
  if (user.globalRole === 'user_client') return [user.orgId]
  // admin_client : propre org + enfants directs
  const children = await listChildOrganizations(user.orgId)
  return [user.orgId, ...children.map((c) => c.id)]
}

/**
 * Helper Firestore pour appliquer le filtre orgId selon le rôle.
 * Retourne la query telle quelle pour superadmin.
 *
 * ⚠️ Limite Firestore : `where('orgId', 'in', ...)` max 10 valeurs.
 * Pour > 10 orgs, faire plusieurs queries et fusionner côté application.
 */
export function applyOrgScope<T extends FirebaseFirestore.Query>(
  query: T,
  allowedOrgIds: string[] | null,
): T {
  if (allowedOrgIds === null) return query // superadmin
  if (allowedOrgIds.length === 0) {
    // Aucune org → renvoyer une query impossible (sentinelle)
    return query.where('orgId', '==', '__NONE__') as T
  }
  if (allowedOrgIds.length === 1) {
    return query.where('orgId', '==', allowedOrgIds[0]) as T
  }
  return query.where('orgId', 'in', allowedOrgIds.slice(0, 10)) as T
}
