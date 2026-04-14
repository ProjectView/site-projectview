'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Search,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { Toast, ToastType } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

type OrgType = 'projectview' | 'reseller' | 'client_final'
type GlobalRole = 'superadmin' | 'admin_client' | 'user_client'

interface OrgRow {
  id: string
  name: string
  type: OrgType
  parentOrgId: string | null
  axonautId: string | null
  plan: string | null
}

const TYPE_LABEL: Record<OrgType, string> = {
  projectview: 'ProjectView',
  reseller: 'Revendeur',
  client_final: 'Client final',
}

const TYPE_CLASSES: Record<OrgType, string> = {
  projectview: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  reseller: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  client_final: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

const PLAN_CLASSES: Record<string, string> = {
  starter: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  pro: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  enterprise: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

function getCurrentRole(): GlobalRole | null {
  if (typeof document === 'undefined') return null
  try {
    const raw = document.cookie
      .split('; ')
      .find((c) => c.startsWith('__user_info='))
      ?.split('=')[1]
    if (!raw) return null
    const info = JSON.parse(decodeURIComponent(raw))
    return (info.globalRole as GlobalRole) ?? null
  } catch {
    return null
  }
}

// ── Helpers hiérarchie ──────────────────────────────────────────────────────

interface OrgNode extends OrgRow {
  children: OrgNode[]
}

function buildTree(orgs: OrgRow[]): OrgNode[] {
  const map = new Map<string, OrgNode>()
  orgs.forEach((o) => map.set(o.id, { ...o, children: [] }))
  const roots: OrgNode[] = []
  map.forEach((node) => {
    if (node.parentOrgId && map.has(node.parentOrgId)) {
      map.get(node.parentOrgId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  // trier chaque niveau alphabétiquement
  const sort = (nodes: OrgNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    nodes.forEach((n) => sort(n.children))
  }
  sort(roots)
  return roots
}

function flattenWithDepth(
  nodes: OrgNode[],
  depth = 0,
): { node: OrgNode; depth: number }[] {
  const result: { node: OrgNode; depth: number }[] = []
  nodes.forEach((n) => {
    result.push({ node: n, depth })
    result.push(...flattenWithDepth(n.children, depth + 1))
  })
  return result
}

// ── Page principale ─────────────────────────────────────────────────────────

export default function OrganisationsPage() {
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOrg, setEditOrg] = useState<OrgRow | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<OrgRow | null>(null)
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set())
  const [currentRole, setCurrentRole] = useState<GlobalRole | null>(null)

  useEffect(() => {
    setCurrentRole(getCurrentRole())
  }, [])

  const loadOrgs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orgs')
      if (res.ok) {
        const { orgs } = await res.json()
        setOrgs(orgs || [])
      }
    } catch {
      setToast({ message: 'Erreur chargement', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrgs()
  }, [])

  const tree = useMemo(() => buildTree(orgs), [orgs])

  const rows = useMemo(() => {
    const flat = flattenWithDepth(tree)
    if (!search.trim()) {
      // filtrer les noeuds dont le parent est réduit
      const visible: typeof flat = []
      const hiddenIds = new Set<string>()
      flat.forEach(({ node, depth }) => {
        if (node.parentOrgId && hiddenIds.has(node.parentOrgId)) {
          hiddenIds.add(node.id)
          return
        }
        if (collapsedIds.has(node.id)) hiddenIds.add(node.id)
        visible.push({ node, depth })
      })
      return visible
    }
    // mode recherche : liste plate filtrée, pas de hiérarchie visuelle
    const s = search.toLowerCase()
    return flat.filter(({ node }) => node.name.toLowerCase().includes(s))
  }, [tree, search, collapsedIds])

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDelete = async (org: OrgRow) => {
    const res = await fetch(`/api/admin/orgs/${org.id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Organisation supprimée.', type: 'success' })
      setConfirmDelete(null)
      await loadOrgs()
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Erreur' }))
      setToast({ message: error || 'Erreur suppression', type: 'error' })
      setConfirmDelete(null)
    }
  }

  const isSuperadmin = currentRole === 'superadmin'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-teal" />
            Organisations
          </h1>
          <p className="text-sm text-ink-tertiary mt-1">
            Hiérarchie des organisations et paramètres RBAC.
          </p>
        </div>
        {isSuperadmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle organisation
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une organisation…"
          className="w-full pl-10 pr-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50"
        />
      </div>

      {/* Stats rapides */}
      {!loading && (
        <div className="flex gap-4 text-sm text-ink-tertiary">
          <span>{orgs.length} organisation{orgs.length > 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{orgs.filter((o) => o.type === 'client_final').length} clients finaux</span>
          <span>·</span>
          <span>{orgs.filter((o) => o.type === 'reseller').length} revendeurs</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-ink-tertiary">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nom</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Plan</th>
              <th className="text-left px-4 py-3 font-medium">Axonaut ID</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-ink-tertiary">
                  Chargement…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-ink-tertiary">
                  Aucune organisation.
                </td>
              </tr>
            ) : (
              rows.map(({ node, depth }) => {
                const hasChildren = node.children.length > 0
                const isCollapsed = collapsedIds.has(node.id)
                return (
                  <tr key={node.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-1"
                        style={{ paddingLeft: `${depth * 20}px` }}
                      >
                        {hasChildren && !search ? (
                          <button
                            onClick={() => toggleCollapse(node.id)}
                            className="text-ink-tertiary hover:text-ink-primary transition-colors flex-shrink-0"
                          >
                            {isCollapsed ? (
                              <ChevronRight className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <span className="w-4 flex-shrink-0" />
                        )}
                        <span className="font-medium text-ink-primary">{node.name}</span>
                        {hasChildren && (
                          <span className="ml-1 text-xs text-ink-tertiary">
                            ({node.children.length})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${TYPE_CLASSES[node.type]}`}
                      >
                        {TYPE_LABEL[node.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {node.plan ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${PLAN_CLASSES[node.plan] ?? 'bg-white/5 text-ink-secondary border-white/10'}`}
                        >
                          {node.plan}
                        </span>
                      ) : (
                        <span className="text-ink-tertiary text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-tertiary font-mono text-xs">
                      {node.axonautId ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setEditOrg(node)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-ink-secondary rounded text-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Modifier
                      </button>
                      {isSuperadmin && (
                        <button
                          onClick={() => setConfirmDelete(node)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {createOpen && (
        <OrgModal
          title="Nouvelle organisation"
          orgs={orgs}
          currentRole={currentRole}
          onClose={() => setCreateOpen(false)}
          onSuccess={async () => {
            setCreateOpen(false)
            setToast({ message: 'Organisation créée.', type: 'success' })
            await loadOrgs()
          }}
          onError={(m) => setToast({ message: m, type: 'error' })}
        />
      )}

      {editOrg && (
        <OrgModal
          title={`Modifier · ${editOrg.name}`}
          orgs={orgs}
          currentRole={currentRole}
          initial={editOrg}
          onClose={() => setEditOrg(null)}
          onSuccess={async () => {
            setEditOrg(null)
            setToast({ message: 'Organisation mise à jour.', type: 'success' })
            await loadOrgs()
          }}
          onError={(m) => setToast({ message: m, type: 'error' })}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          open={true}
          title="Supprimer l'organisation ?"
          message={`"${confirmDelete.name}" sera supprimée définitivement. Cette action est irréversible.`}
          confirmLabel="Supprimer"
          variant="danger"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

// ── Modal create/edit ────────────────────────────────────────────────────────

function OrgModal({
  title,
  orgs,
  currentRole,
  initial,
  onClose,
  onSuccess,
  onError,
}: {
  title: string
  orgs: OrgRow[]
  currentRole: GlobalRole | null
  initial?: OrgRow
  onClose: () => void
  onSuccess: () => void
  onError: (m: string) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<OrgType>(initial?.type ?? 'client_final')
  const [parentOrgId, setParentOrgId] = useState<string>(initial?.parentOrgId ?? '')
  const [axonautId, setAxonautId] = useState(initial?.axonautId ?? '')
  const [plan, setPlan] = useState(initial?.plan ?? '')
  const [saving, setSaving] = useState(false)

  // filtrer pour éviter les cycles : exclure l'org elle-même et ses descendants
  const parentOptions = useMemo(() => {
    if (!initial) return orgs
    const tree = buildTree(orgs)
    const descendants = new Set<string>()
    const collect = (nodes: OrgNode[]) => {
      nodes.forEach((n) => {
        descendants.add(n.id)
        collect(n.children)
      })
    }
    const startNode = flattenWithDepth(tree).find((r) => r.node.id === initial.id)
    if (startNode) collect(startNode.node.children)
    return orgs.filter((o) => o.id !== initial.id && !descendants.has(o.id))
  }, [orgs, initial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        name,
        type,
        parentOrgId: parentOrgId || null,
        axonautId: axonautId.trim() || null,
        plan: plan.trim() || null,
      }
      const url = initial ? `/api/admin/orgs/${initial.id}` : '/api/admin/orgs'
      const method = initial ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) onSuccess()
      else {
        const { error } = await res.json().catch(() => ({ error: 'Erreur' }))
        onError(error || 'Erreur')
      }
    } finally {
      setSaving(false)
    }
  }

  const isSuperadmin = currentRole === 'superadmin'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-elevated border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-surface-elevated">
          <h2 className="text-lg font-semibold text-ink-primary">{title}</h2>
          <button onClick={onClose} className="text-ink-tertiary hover:text-ink-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Nom de l'organisation">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Acme Corp"
            />
          </Field>

          <Field label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OrgType)}
              className="input"
              disabled={!isSuperadmin}
            >
              <option value="projectview">ProjectView</option>
              <option value="reseller">Revendeur</option>
              <option value="client_final">Client final</option>
            </select>
          </Field>

          <Field label="Organisation parente (optionnel)">
            <select
              value={parentOrgId}
              onChange={(e) => setParentOrgId(e.target.value)}
              className="input"
              disabled={!isSuperadmin}
            >
              <option value="">— Aucune (racine) —</option>
              {parentOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} · {TYPE_LABEL[o.type]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Plan (optionnel)">
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="input"
            >
              <option value="">— Aucun —</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </Field>

          <Field label="Axonaut ID (optionnel)">
            <input
              type="text"
              value={axonautId}
              onChange={(e) => setAxonautId(e.target.value)}
              className="input font-mono"
              placeholder="12345"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement…' : initial ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
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
        :global(.input:disabled) {
          opacity: 0.5;
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-tertiary mb-1">{label}</span>
      {children}
    </label>
  )
}
