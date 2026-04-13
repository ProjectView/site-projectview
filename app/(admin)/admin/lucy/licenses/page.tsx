'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Key, Plus, Search, Filter, CheckCircle, XCircle, Clock,
  Copy, Trash2, Edit2, RefreshCw, AlertCircle, Shield, X
} from 'lucide-react'

interface License {
  id: string
  key: string
  type: string
  status: string
  email: string
  clientName: string
  screenName: string
  fingerprint: string
  monthlyPrice: number
  expiresAt: string | null
  createdAt: string | null
  features: {
    maxDuration?: number
    multiLanguage?: boolean
    videoCapture?: boolean
    claudeVision?: boolean
  }
}

type ModalMode = 'create' | 'edit' | null

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch { return iso }
}

function isExpiringSoon(iso: string | null) {
  if (!iso) return false
  return new Date(iso).getTime() - Date.now() < 14 * 24 * 60 * 60 * 1000
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
    active:  { label: 'Active',   cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
    expired: { label: 'Expirée',  cls: 'bg-amber-500/10  text-amber-400  border-amber-500/20',  icon: Clock },
    revoked: { label: 'Révoquée', cls: 'bg-red-500/10    text-red-400    border-red-500/20',    icon: XCircle },
  }
  const cfg = map[status] ?? { label: status, cls: 'bg-white/[0.05] text-ink-tertiary border-white/[0.08]', icon: Shield }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${cfg.cls}`}>
      <cfg.icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  )
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} title="Copier" className="text-ink-tertiary hover:text-ink-primary transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

interface CreateFormData {
  type: string
  email: string
  clientName: string
  screenName: string
  expiryDays: number
  monthlyPrice: number
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (lic: License) => void }) {
  const [form, setForm] = useState<CreateFormData>({
    type: 'paid', email: '', clientName: '', screenName: '', expiryDays: 365, monthlyPrice: 29
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/lucy/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      onCreated(data.license)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-dark-surface border border-white/[0.12] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-ink-primary flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" /> Nouvelle licence
          </h2>
          <button onClick={onClose} className="text-ink-tertiary hover:text-ink-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs font-medium text-ink-tertiary block mb-1.5">Type</label>
            <div className="flex gap-2">
              {(['paid', 'trial'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t, expiryDays: t === 'trial' ? 30 : 365, monthlyPrice: t === 'trial' ? 0 : 29 }))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    form.type === t
                      ? t === 'paid' ? 'bg-brand-teal/10 border-brand-teal/40 text-brand-teal' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-white/[0.03] border-white/[0.08] text-ink-tertiary'
                  }`}
                >
                  {t === 'paid' ? 'Payante' : 'Essai gratuit'}
                </button>
              ))}
            </div>
          </div>

          {/* Client */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-tertiary block mb-1.5">Entreprise</label>
              <input
                type="text"
                value={form.clientName}
                onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                placeholder="ACME Corp"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-tertiary block mb-1.5">Nom device</label>
              <input
                type="text"
                value={form.screenName}
                onChange={e => setForm(f => ({ ...f, screenName: e.target.value }))}
                placeholder="Salle Confé A"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/40"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-ink-tertiary block mb-1.5">Email client</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="contact@acme.com"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/40"
            />
          </div>

          {/* Durée + Prix */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-tertiary block mb-1.5">Durée (jours)</label>
              <input
                type="number"
                value={form.expiryDays}
                onChange={e => setForm(f => ({ ...f, expiryDays: parseInt(e.target.value) || 30 }))}
                min={1}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-tertiary block mb-1.5">Prix mensuel (€)</label>
              <input
                type="number"
                value={form.monthlyPrice}
                onChange={e => setForm(f => ({ ...f, monthlyPrice: parseFloat(e.target.value) || 0 }))}
                min={0}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/40"
              />
            </div>
          </div>
        </div>

        {err && (
          <div className="mt-4 flex items-center gap-2 text-xs text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-lg p-2.5">
            <AlertCircle className="w-3.5 h-3.5" /> {err}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-ink-secondary hover:text-ink-primary transition-colors">
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 py-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-sm text-emerald-400 font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Génération…' : 'Créer la licence'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CreatedModal({ license, onClose }: { license: License; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-dark-surface border border-white/[0.12] rounded-2xl p-6 w-full max-w-sm mx-4 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="text-base font-bold text-ink-primary mb-1">Licence créée !</h2>
        <p className="text-xs text-ink-tertiary mb-4">Copiez cette clé et transmettez-la au client.</p>
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 mb-5">
          <span className="flex-1 text-sm font-mono font-semibold text-brand-teal tracking-wider">{license.key}</span>
          <CopyBtn text={license.key} />
        </div>
        <div className="text-xs text-ink-tertiary space-y-1 mb-5">
          <p>{license.clientName || 'Client'} · {license.type === 'trial' ? 'Essai' : 'Payant'}</p>
          <p>Expire le {fmtDate(license.expiresAt)}</p>
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-brand-teal/10 border border-brand-teal/30 rounded-xl text-sm text-brand-teal font-medium hover:bg-brand-teal/20 transition-colors">
          Fermer
        </button>
      </div>
    </div>
  )
}

export default function LucyLicensesPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading]   = useState(true)
  const [err, setErr]           = useState('')
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '')
  const [typeFilter, setTypeFilter]     = useState(searchParams.get('type') ?? '')
  const [modal, setModal]     = useState<ModalMode>(searchParams.get('action') === 'create' ? 'create' : null)
  const [created, setCreated] = useState<License | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchLicenses = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (typeFilter)   params.set('type', typeFilter)
      const res = await fetch(`/api/admin/lucy/licenses?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setLicenses(data.licenses ?? [])
    } catch {
      setErr('Impossible de charger les licences.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter])

  useEffect(() => { fetchLicenses() }, [fetchLicenses])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/lucy/licenses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLicenses(ls => ls.map(l => l.id === id ? { ...l, status } : l))
  }

  async function deleteLicense(id: string) {
    setDeleting(true)
    await fetch(`/api/admin/lucy/licenses/${id}`, { method: 'DELETE' })
    setLicenses(ls => ls.filter(l => l.id !== id))
    setDeleteId(null)
    setDeleting(false)
  }

  const filtered = licenses.filter(l => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.key.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.clientName.toLowerCase().includes(q) ||
      l.screenName.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-primary flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            Licences Lucy
          </h1>
          <p className="text-sm text-ink-tertiary mt-0.5">
            {licenses.length} licence{licenses.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-sm text-emerald-400 font-medium hover:bg-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Nouvelle licence
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            placeholder="Rechercher clé, client, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-surface border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink-tertiary" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-dark-surface border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/40"
          >
            <option value="">Tous statuts</option>
            <option value="active">Active</option>
            <option value="expired">Expirée</option>
            <option value="revoked">Révoquée</option>
          </select>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-dark-surface border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/40"
          >
            <option value="">Tous types</option>
            <option value="paid">Payante</option>
            <option value="trial">Essai</option>
          </select>
          <button onClick={fetchLicenses} disabled={loading} className="p-2 bg-dark-surface border border-white/[0.08] rounded-lg text-ink-tertiary hover:text-ink-primary transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {err && (
        <div className="flex items-center gap-2 p-4 bg-red-500/[0.08] border border-red-500/20 rounded-xl mb-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {err}
        </div>
      )}

      {/* Table */}
      <div className="bg-dark-surface border border-white/[0.08] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Clé de licence', 'Client', 'Type / Statut', 'Expiration', 'Prix/mois', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-ink-tertiary uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {loading ? (
              <tr><td colSpan={6} className="py-16 text-center text-sm text-ink-tertiary">Chargement…</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Key className="w-8 h-8 mx-auto mb-2 text-ink-tertiary opacity-30" />
                  <p className="text-sm text-ink-tertiary">Aucune licence trouvée</p>
                </td>
              </tr>
            ) : filtered.map(lic => (
              <tr key={lic.id} className={`hover:bg-white/[0.02] transition-colors ${deleteId === lic.id ? 'bg-red-500/[0.03]' : ''}`}>
                {/* Clé */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-brand-teal">{lic.key || '—'}</span>
                    {lic.key && <CopyBtn text={lic.key} />}
                  </div>
                  {lic.fingerprint && (
                    <p className="text-[10px] text-ink-tertiary mt-0.5 font-mono truncate max-w-[160px]" title={lic.fingerprint}>
                      fp: {lic.fingerprint.slice(0, 16)}…
                    </p>
                  )}
                </td>
                {/* Client */}
                <td className="px-4 py-3">
                  <p className="text-sm text-ink-primary">{lic.clientName || '—'}</p>
                  <p className="text-xs text-ink-tertiary">{lic.screenName || ''}</p>
                  <p className="text-xs text-ink-tertiary">{lic.email || ''}</p>
                </td>
                {/* Type / statut */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <span className={`self-start inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${lic.type === 'paid' ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {lic.type === 'paid' ? 'Payante' : 'Essai'}
                    </span>
                    <StatusBadge status={lic.status} />
                  </div>
                </td>
                {/* Expiration */}
                <td className="px-4 py-3">
                  <span className={`text-sm ${isExpiringSoon(lic.expiresAt) && lic.status === 'active' ? 'text-amber-400' : 'text-ink-secondary'}`}>
                    {fmtDate(lic.expiresAt)}
                  </span>
                  {isExpiringSoon(lic.expiresAt) && lic.status === 'active' && (
                    <p className="text-[10px] text-amber-400 mt-0.5">Expire bientôt</p>
                  )}
                </td>
                {/* Prix */}
                <td className="px-4 py-3">
                  <span className="text-sm text-ink-secondary">
                    {lic.type === 'paid' ? `${lic.monthlyPrice} €` : '—'}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-4 py-3">
                  {deleteId === lic.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteLicense(lic.id)}
                        disabled={deleting}
                        className="px-2.5 py-1 bg-red-500/15 border border-red-500/25 rounded-lg text-xs text-red-400 font-semibold disabled:opacity-50"
                      >
                        {deleting ? '…' : 'Confirmer'}
                      </button>
                      <button onClick={() => setDeleteId(null)} className="px-2.5 py-1 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-ink-tertiary">
                        Non
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {lic.status === 'active' ? (
                        <button
                          onClick={() => updateStatus(lic.id, 'revoked')}
                          title="Révoquer"
                          className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(lic.id, 'active')}
                          title="Réactiver"
                          className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/admin/lucy/licenses/${lic.id}`)}
                        title="Modifier"
                        className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(lic.id)}
                        title="Supprimer"
                        className="p-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-ink-tertiary hover:text-red-400 hover:border-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal === 'create' && (
        <CreateModal
          onClose={() => setModal(null)}
          onCreated={lic => {
            setModal(null)
            setCreated(lic)
            setLicenses(ls => [lic, ...ls])
          }}
        />
      )}
      {created && (
        <CreatedModal license={created} onClose={() => setCreated(null)} />
      )}
    </div>
  )
}
