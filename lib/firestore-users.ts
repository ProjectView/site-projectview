import { FieldValue } from 'firebase-admin/firestore'
import { getAdminFirestore, getAdminAuth } from './firebase-admin'

// ==========================================
// Types RBAC — ProjectView Pulse
// ==========================================

export type GlobalRole = 'superadmin' | 'admin_client' | 'user_client'

export type AppSlug = string // 'lucy' | 'saas2' | ... (extensible)

/** Rôles par SaaS — chaque SaaS définit ses propres rôles dans apps/{slug}.availableRoles */
export type AppRole = string

export interface OrganizationDoc {
  name: string
  type: 'projectview' | 'reseller' | 'client_final'
  parentOrgId: string | null // reseller -> client_final
  axonautId: string | null
  plan: string | null
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
}

export interface UserDoc {
  email: string
  displayName: string
  orgId: string
  globalRole: GlobalRole
  /** Feature flags — détermine les items visibles dans la sidebar */
  enabledApps: Record<AppSlug, boolean>
  /** Rôle au sein de chaque SaaS — valeurs tirées de apps/{slug}.availableRoles */
  appRoles: Record<AppSlug, AppRole>
  createdAt: FirebaseFirestore.Timestamp
  lastLoginAt: FirebaseFirestore.Timestamp | null
  disabled: boolean
}

export interface AppDoc {
  slug: AppSlug
  name: string
  icon: string // clé lucide-react ou URL
  route: string // route interne, ex. '/app/lucy'
  landingPage: string | null // URL publique de la LP
  availableRoles: AppRole[]
  requiresLicense: boolean
  /** Activation par défaut à la création d'un user, selon son rôle global */
  enabledByDefault: Partial<Record<GlobalRole, boolean>>
  order: number // ordre d'affichage dans la sidebar
  active: boolean // si false, caché pour tout le monde
  createdAt: FirebaseFirestore.Timestamp
}

// ==========================================
// Organizations
// ==========================================

export async function getOrganization(
  orgId: string,
): Promise<(OrganizationDoc & { id: string }) | null> {
  const db = getAdminFirestore()
  const snap = await db.collection('organizations').doc(orgId).get()
  if (!snap.exists) return null
  return { id: snap.id, ...(snap.data() as OrganizationDoc) }
}

export async function listOrganizations(): Promise<
  (OrganizationDoc & { id: string })[]
> {
  const db = getAdminFirestore()
  const snap = await db.collection('organizations').orderBy('name').get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as OrganizationDoc) }))
}

export async function listChildOrganizations(
  parentOrgId: string,
): Promise<(OrganizationDoc & { id: string })[]> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('organizations')
    .where('parentOrgId', '==', parentOrgId)
    .get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as OrganizationDoc) }))
}

export async function createOrganization(params: {
  name: string
  type: OrganizationDoc['type']
  parentOrgId?: string | null
  axonautId?: string | null
  plan?: string | null
}): Promise<string> {
  const db = getAdminFirestore()
  const doc = db.collection('organizations').doc()
  const now = FieldValue.serverTimestamp() as unknown as FirebaseFirestore.Timestamp
  await doc.set({
    name: params.name,
    type: params.type,
    parentOrgId: params.parentOrgId ?? null,
    axonautId: params.axonautId ?? null,
    plan: params.plan ?? null,
    createdAt: now,
    updatedAt: now,
  } satisfies OrganizationDoc)
  return doc.id
}

export async function updateOrganization(
  orgId: string,
  patch: Partial<Omit<OrganizationDoc, 'createdAt' | 'updatedAt'>>,
): Promise<void> {
  const db = getAdminFirestore()
  await db
    .collection('organizations')
    .doc(orgId)
    .update({ ...patch, updatedAt: FieldValue.serverTimestamp() })
}

// ==========================================
// Users
// ==========================================

export async function getUser(uid: string): Promise<(UserDoc & { id: string }) | null> {
  const db = getAdminFirestore()
  const snap = await db.collection('users').doc(uid).get()
  if (!snap.exists) return null
  return { id: snap.id, ...(snap.data() as UserDoc) }
}

export async function getUserByEmail(
  email: string,
): Promise<(UserDoc & { id: string }) | null> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('users')
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...(doc.data() as UserDoc) }
}

export async function listUsersByOrg(
  orgId: string,
): Promise<(UserDoc & { id: string })[]> {
  const db = getAdminFirestore()
  const snap = await db
    .collection('users')
    .where('orgId', '==', orgId)
    .orderBy('email')
    .get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as UserDoc) }))
}

/**
 * Crée un user Firestore pour un UID Firebase Auth existant.
 * Calcule les enabledApps par défaut à partir du globalRole + des apps actives.
 */
export async function createUser(params: {
  uid: string
  email: string
  displayName: string
  orgId: string
  globalRole: GlobalRole
  enabledApps?: Record<AppSlug, boolean>
  appRoles?: Record<AppSlug, AppRole>
}): Promise<void> {
  const db = getAdminFirestore()

  // Si enabledApps non fourni, on dérive depuis apps.enabledByDefault
  let enabledApps = params.enabledApps
  if (!enabledApps) {
    const appsSnap = await db.collection('apps').where('active', '==', true).get()
    enabledApps = {}
    for (const a of appsSnap.docs) {
      const data = a.data() as AppDoc
      enabledApps[data.slug] = data.enabledByDefault?.[params.globalRole] ?? false
    }
  }

  await db
    .collection('users')
    .doc(params.uid)
    .set({
      email: params.email.toLowerCase(),
      displayName: params.displayName,
      orgId: params.orgId,
      globalRole: params.globalRole,
      enabledApps,
      appRoles: params.appRoles ?? {},
      createdAt: FieldValue.serverTimestamp(),
      lastLoginAt: null,
      disabled: false,
    } as unknown as UserDoc)
}

export async function updateUser(
  uid: string,
  patch: Partial<Omit<UserDoc, 'createdAt' | 'email'>>,
): Promise<void> {
  const db = getAdminFirestore()
  await db.collection('users').doc(uid).update(patch)
}

/** Active/désactive une app pour un user précis */
export async function toggleUserApp(
  uid: string,
  slug: AppSlug,
  enabled: boolean,
): Promise<void> {
  const db = getAdminFirestore()
  await db
    .collection('users')
    .doc(uid)
    .update({ [`enabledApps.${slug}`]: enabled })
}

/** Définit le rôle applicatif d'un user sur un SaaS donné */
export async function setUserAppRole(
  uid: string,
  slug: AppSlug,
  role: AppRole,
): Promise<void> {
  const db = getAdminFirestore()
  await db
    .collection('users')
    .doc(uid)
    .update({ [`appRoles.${slug}`]: role })
}

export async function touchUserLogin(uid: string): Promise<void> {
  const db = getAdminFirestore()
  await db
    .collection('users')
    .doc(uid)
    .update({ lastLoginAt: FieldValue.serverTimestamp() })
    .catch(() => {
      // Si le doc n'existe pas encore (premier login), on ignore.
    })
}

// ==========================================
// Apps (registre des SaaS)
// ==========================================

export async function listApps(opts?: {
  onlyActive?: boolean
}): Promise<(AppDoc & { id: string })[]> {
  const db = getAdminFirestore()
  let q: FirebaseFirestore.Query = db.collection('apps')
  if (opts?.onlyActive) q = q.where('active', '==', true)
  const snap = await q.orderBy('order').get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as AppDoc) }))
}

export async function getApp(slug: AppSlug): Promise<(AppDoc & { id: string }) | null> {
  const db = getAdminFirestore()
  const snap = await db.collection('apps').where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...(doc.data() as AppDoc) }
}

export async function upsertApp(params: {
  slug: AppSlug
  name: string
  icon: string
  route: string
  landingPage?: string | null
  availableRoles: AppRole[]
  requiresLicense?: boolean
  enabledByDefault?: Partial<Record<GlobalRole, boolean>>
  order?: number
  active?: boolean
}): Promise<string> {
  const db = getAdminFirestore()
  const existing = await getApp(params.slug)
  const payload: Omit<AppDoc, 'createdAt'> & { createdAt?: FirebaseFirestore.Timestamp } = {
    slug: params.slug,
    name: params.name,
    icon: params.icon,
    route: params.route,
    landingPage: params.landingPage ?? null,
    availableRoles: params.availableRoles,
    requiresLicense: params.requiresLicense ?? false,
    enabledByDefault: params.enabledByDefault ?? {},
    order: params.order ?? 100,
    active: params.active ?? true,
  }

  if (existing) {
    await db.collection('apps').doc(existing.id).update(payload)
    return existing.id
  }
  const doc = db.collection('apps').doc()
  await doc.set({ ...payload, createdAt: FieldValue.serverTimestamp() })
  return doc.id
}

// ==========================================
// Helpers UID -> session payload enrichi
// ==========================================

export interface SessionUser {
  uid: string
  email: string
  displayName: string
  orgId: string
  globalRole: GlobalRole
  enabledApps: Record<AppSlug, boolean>
  appRoles: Record<AppSlug, AppRole>
}

/**
 * Charge le profil RBAC d'un utilisateur à partir de son UID Firebase Auth.
 * Retourne null si le doc user n'existe pas encore (premier login).
 */
export async function getSessionUserFromUid(uid: string): Promise<SessionUser | null> {
  const user = await getUser(uid)
  if (!user) return null
  return {
    uid: user.id,
    email: user.email,
    displayName: user.displayName,
    orgId: user.orgId,
    globalRole: user.globalRole,
    enabledApps: user.enabledApps ?? {},
    appRoles: user.appRoles ?? {},
  }
}

/**
 * Vérifie si un user peut agir sur une organisation cible.
 * - superadmin : tout
 * - admin_client : sa propre org + toutes les orgs dont parentOrgId == sa propre orgId
 * - user_client : sa propre org uniquement
 */
export async function canActOnOrg(
  sessionUser: SessionUser,
  targetOrgId: string,
): Promise<boolean> {
  if (sessionUser.globalRole === 'superadmin') return true
  if (sessionUser.orgId === targetOrgId) return true
  if (sessionUser.globalRole === 'admin_client') {
    const target = await getOrganization(targetOrgId)
    return target?.parentOrgId === sessionUser.orgId
  }
  return false
}
