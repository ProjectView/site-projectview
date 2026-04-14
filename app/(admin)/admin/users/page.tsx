'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users, Plus, Trash2, Key, Shield, Save, X, Search } from 'lucide-react'
import { Toast, ToastType } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

type GlobalRole = 'superadmin' | 'admin_client' | 'user_client'

interface UserRow {
  id: string
  email: string
  displayName: string
  orgId: string
  globalRole: GlobalRole
  enabledApps?: Record<string, boolean>
  appRoles?: Record<string, string>
  disabled?: boolean
  lastLoginAt?: { _seconds: number } | null
}

interface AppRow {
  id: string
  slug: string
  name: string
  availableRoles: string[]
  order: number
}

interface OrgRow {
  id: string
  name: string
  type: 'projectview' | 'reseller' | 'client_final'
}

const ROLE_LABEL: Record<GlobalRole, string> = {
  superadmin: 'Superadmin',
  admin_client: 'Admin client',
  user_client: 'Utilisateur',
}

const ROLE_CLASSES: Record<GlobalRole, string> = {
  superadmin: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  admin_client: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  user_client: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [apps, setApps] = useState<AppRow[]>([])
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [currentRole, setCurrentRole] = useState<GlobalRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null)

  // Lit le rôle courant depuis le cookie __user_info (côté client)
  useEffect(() => {
    try {
      const raw = document.cookie
        .split('; ')
        .find((c) => c.startsWith('__user_info='))
        ?.split('=')[1]
      if (raw) {
        const info = JSON.parse(decodeURIComponent(raw))
        if (info.globalRole) setCurrentRole(info.globalRole as GlobalRole)
      }
    } catch {
      // ignore
    }
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [uRes, aRes, oRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/apps'),
        fetch('/api/admin/orgs'),
      ])
      if (uRes.ok) {
        const { users } = await uRes.json()
        setUsers(users || [])
      }
      if (aRes.ok) {
        const { apps } = await aRes.json()
        setApps(apps || [])
      }
      if (oRes.ok) {
        const { orgs } = await oRes.json()
        setOrgs(orgs || [])
      }
    } catch (e) {
      setToast({ message: 'Erreur chargement', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const orgName = (id: string) => orgs.find((o) => o.id === id)?.name || id

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const s = search.toLowerCase()
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(s) ||
        u.displayName?.toLowerCase().includes(s) ||
        orgName(u.orgId).toLowerCase().includes(s),
    )
  }, [users, search, orgs])

  const handleDelete = async (u: UserRow) => {
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Utilisateur supprimé.', type: 'success' })
      setConfirmDelete(null)
      await loadAll()
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Erreur' }))
      setToast({ message: error || 'Erreur suppression', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-teal" />
            Utilisateurs & accès
          </h1>
          <p className="text-sm text-ink-tertiary mt-1">
            Gestion des rôles globaux, activation des SaaS par utilisateur.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par email, nom, organisation…"
          className="w-full pl-10 pr-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50"
        />
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-ink-tertiary">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Utilisateur</th>
              <th className="text-left px-4 py-3 font-medium">Organisation</th>
              <th className="text-left px-4 py-3 font-medium">Rôle global</th>
              <th className="text-left px-4 py-3 font-medium">Apps activées</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-ink-tertiary">
                  Chargement…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-ink-tertiary">
                  Aucun utilisateur.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const enabledCount = Object.values(u.enabledApps || {}).filter(Boolean).length
                return (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink-primary">{u.displayName}</div>
                      <div className="text-xs text-ink-tertiary">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{orgName(u.orgId)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${ROLE_CLASSES[u.globalRole]}`}
                      >
                        {ROLE_LABEL[u.globalRole]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {enabledCount} / {apps.length}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setEditUser(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-ink-secondary rounded text-xs"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Gérer
                      </button>
                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <CreateUserModal
          orgs={orgs}
          apps={apps}
          currentRole={currentRole}
          onClose={() => setCreateOpen(false)}
          onSuccess={async () => {
            setCreateOpen(false)
            setToast({ message: 'Utilisateur créé.', type: 'success' })
            await loadAll()
          }}
          onError={(m) => setToast({ message: m, type: 'error' })}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          apps={apps}
          currentRole={currentRole}
          onClose={() => setEditUser(null)}
          onSuccess={async () => {
            setEditUser(null)
            setToast({ message: 'Utilisateur mis à jour.', type: 'success' })
            await loadAll()
          }}
          onError={(m) => setToast({ message: m, type: 'error' })}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          open={true}
          title="Supprimer l'utilisateur ?"
          message={`${confirmDelete.displayName} (${confirmDelete.email}) sera supprimé définitivement de Firebase Auth et Firestore.`}
          confirmLabel="Supprimer"
          variant="danger"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// Create modal
// ============================================================
function CreateUserModal({
  orgs,
  apps,
  currentRole,
  onClose,
  onSuccess,
  onError,
}: {
  orgs: OrgRow[]
  apps: AppRow[]
  currentRole: GlobalRole | null
  onClose: () => void
  onSuccess: () => void
  onError: (m: string) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [orgId, setOrgId] = useState(orgs[0]?.id || '')
  const [globalRole, setGlobalRole] = useState<GlobalRole>('user_client')
  const [enabledApps, setEnabledApps] = useState<Record<string, boolean>>({})
  const [appRoles, setAppRoles] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const roleOptions: GlobalRole[] =
    currentRole === 'superadmin'
      ? ['superadmin', 'admin_client', 'user_client']
      : ['admin_client', 'user_client']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          displayName,
          orgId,
          globalRole,
          enabledApps,
          appRoles,
        }),
      })
      if (res.ok) onSuccess()
      else {
        const { error } = await res.json().catch(() => ({ error: 'Erreur' }))
        onError(error || 'Erreur création')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Nouvel utilisateur" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nom affiché">
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Mot de passe (min. 6)">
          <input
            type="text"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input font-mono"
          />
        </Field>
        <Field label="Organisation">
          <select
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="input"
            required
          >
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} · {o.type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Rôle global">
          <select
            value={globalRole}
            onChange={(e) => setGlobalRole(e.target.value as GlobalRole)}
            className="input"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
        <AppsMatrix
          apps={apps}
          enabledApps={enabledApps}
          appRoles={appRoles}
          onToggle={(slug, v) => setEnabledApps((p) => ({ ...p, [slug]: v }))}
          onRole={(slug, r) => setAppRoles((p) => ({ ...p, [slug]: r }))}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Annuler
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Création…' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ============================================================
// Edit modal
// ============================================================
function EditUserModal({
  user,
  apps,
  currentRole,
  onClose,
  onSuccess,
  onError,
}: {
  user: UserRow
  apps: AppRow[]
  currentRole: GlobalRole | null
  onClose: () => void
  onSuccess: () => void
  onError: (m: string) => void
}) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [globalRole, setGlobalRole] = useState<GlobalRole>(user.globalRole)
  const [password, setPassword] = useState('')
  const [enabledApps, setEnabledApps] = useState<Record<string, boolean>>(
    user.enabledApps || {},
  )
  const [appRoles, setAppRoles] = useState<Record<string, string>>(user.appRoles || {})
  const [disabled, setDisabled] = useState<boolean>(!!user.disabled)
  const [saving, setSaving] = useState(false)

  const canEditRole =
    currentRole === 'superadmin' || user.globalRole !== 'superadmin'

  const roleOptions: GlobalRole[] =
    currentRole === 'superadmin'
      ? ['superadmin', 'admin_client', 'user_client']
      : ['admin_client', 'user_client']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        displayName,
        enabledApps,
        appRoles,
        disabled,
      }
      if (canEditRole) body.globalRole = globalRole
      if (password) body.password = password
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) onSuccess()
      else {
        const { error } = await res.json().catch(() => ({ error: 'Erreur' }))
        onError(error || 'Erreur mise à jour')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`Gérer · ${user.email}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nom affiché">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Rôle global">
          <select
            value={globalRole}
            onChange={(e) => setGlobalRole(e.target.value as GlobalRole)}
            disabled={!canEditRole}
            className="input disabled:opacity-50"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nouveau mot de passe (laisser vide pour ne pas changer)">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input font-mono"
            placeholder="········"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink-secondary">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
            className="rounded"
          />
          Compte désactivé
        </label>
        <AppsMatrix
          apps={apps}
          enabledApps={enabledApps}
          appRoles={appRoles}
          onToggle={(slug, v) => setEnabledApps((p) => ({ ...p, [slug]: v }))}
          onRole={(slug, r) => setAppRoles((p) => ({ ...p, [slug]: r }))}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Annuler
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ============================================================
// Shared sub-components
// ============================================================
function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-elevated border border-white/10 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-surface-elevated">
          <h2 className="text-lg font-semibold text-ink-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-tertiary hover:text-ink-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: var(--ink-primary, #e2e8f0);
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgba(20, 184, 166, 0.5);
        }
        :global(.btn-primary) {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #14b8a6;
          color: white;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        :global(.btn-primary:hover) {
          background: #0f9488;
        }
        :global(.btn-primary:disabled) {
          opacity: 0.5;
        }
        :global(.btn-ghost) {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          color: var(--ink-secondary, #94a3b8);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        :global(.btn-ghost:hover) {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-tertiary mb-1">{label}</span>
      {children}
    </label>
  )
}

function AppsMatrix({
  apps,
  enabledApps,
  appRoles,
  onToggle,
  onRole,
}: {
  apps: AppRow[]
  enabledApps: Record<string, boolean>
  appRoles: Record<string, string>
  onToggle: (slug: string, v: boolean) => void
  onRole: (slug: string, role: string) => void
}) {
  if (apps.length === 0) return null
  return (
    <div>
      <div className="text-xs font-medium text-ink-tertiary mb-2">
        Applications activées
      </div>
      <div className="border border-white/10 rounded-lg divide-y divide-white/5">
        {apps.map((app) => {
          const on = !!enabledApps[app.slug]
          return (
            <div
              key={app.slug}
              className="flex items-center gap-3 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => onToggle(app.slug, e.target.checked)}
                className="rounded"
              />
              <div className="flex-1">
                <div className="text-ink-primary">{app.name}</div>
                <div className="text-xs text-ink-tertiary">{app.slug}</div>
              </div>
              {on && app.availableRoles.length > 0 && (
                <select
                  value={appRoles[app.slug] || app.availableRoles[0]}
                  onChange={(e) => onRole(app.slug, e.target.value)}
                  className="input !w-auto !py-1 text-xs"
                >
                  {app.availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
