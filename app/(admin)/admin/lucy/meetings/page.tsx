'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mic, Search, Calendar, Users, Clock, ChevronLeft, ChevronRight,
  ExternalLink, Monitor, Camera, Shield, Trash2, AlertTriangle, X
} from 'lucide-react'

interface Retention {
  ageDays: number
  daysRemaining: number
  status: 'ok' | 'warning' | 'expired'
}

interface Meeting {
  id: string; title: string; date: string; duration: number
  participants: string[]; clientName: string; deviceName: string
  summary: string; language: string; licenseKey: string
  audioUrl: string; cameraUrl: string; screenUrl: string
  nextcloudPath: string; mode: string
  retention: Retention
}

interface MRes { meetings: Meeting[]; total: number; page: number; limit: number; pages: number }

const MODE_COLORS: Record<string, string> = {
  local: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cloud: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hybrid: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  hybride: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

function dur(s: number) {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  if (m >= 60) { const h = Math.floor(m / 60); return `${h}h${(m % 60).toString().padStart(2, '0')}` }
  return `${m} min`
}

function fmt(d: string) {
  try { return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d)) }
  catch { return d }
}

export default function AdminLucyMeetingsPage() {
  const router = useRouter()
  const [data, setData] = useState<MRes | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selected, setSelected] = useState<Meeting | null>(null)
  const [companyLookup, setCompanyLookup] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/admin/lucy/clients/lookup')
      .then(r => r.json())
      .then(d => setCompanyLookup(d.lookup ?? {}))
      .catch(() => {})
  }, [])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async (p: number, q: string, f: string, t: string) => {
    setLoading(true); setErr('')
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' })
      if (q) params.set('search', q)
      if (f) params.set('from', f)
      if (t) params.set('to', t)
      const r = await fetch(`/api/admin/lucy/meetings?${params}`)
      if (!r.ok) { const j = await r.json(); throw new Error(j.error || 'Erreur') }
      setData(await r.json())
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Erreur') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load(page, search, from, to) }, [page, search, from, to, load])

  function applySearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  function applyDates() { setPage(1); load(1, search, from, to) }

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      const r = await fetch(`/api/admin/lucy/meetings/${id}`, { method: 'DELETE' })
      if (!r.ok) { const j = await r.json(); throw new Error(j.error || 'Erreur') }
      setDeleteId(null)
      setSelected(null)
      // Reload list
      load(page, search, from, to)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Erreur suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink-primary">Lucy — Réunions</h1>
          <p className="text-sm text-ink-tertiary">
            {data ? `${data.total} réunion${data.total !== 1 ? 's' : ''} enregistrée${data.total !== 1 ? 's' : ''}` : 'Chargement…'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={applySearch} className="flex gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Client, titre, participant…"
              className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-white/[0.08] rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/30 rounded-lg text-brand-teal text-sm font-medium hover:bg-brand-teal/20 transition-colors">
            Chercher
          </button>
        </form>
        <div className="flex gap-2 items-center">
          <Calendar className="w-4 h-4 text-ink-tertiary" />
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            className="px-3 py-2 bg-dark-surface border border-white/[0.08] rounded-lg text-sm text-ink-primary focus:outline-none focus:border-brand-teal/50" />
          <span className="text-ink-tertiary text-sm">→</span>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            className="px-3 py-2 bg-dark-surface border border-white/[0.08] rounded-lg text-sm text-ink-primary focus:outline-none focus:border-brand-teal/50" />
          <button onClick={applyDates} className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-ink-secondary hover:text-ink-primary transition-colors">
            Filtrer
          </button>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-4">{err}</div>
      )}

      {/* Table */}
      <div className="bg-dark-surface border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Réunion</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider hidden md:table-cell">Mode</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider hidden lg:table-cell">Durée</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider hidden xl:table-cell">Rétention</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data && [0, 1, 2, 3, 4].map(i => (
              <tr key={i} className="border-b border-white/[0.04]">
                {[0, 1, 2, 3, 4, 5].map(j => (
                  <td key={j} className="px-4 py-3"><div className="h-4 bg-white/[0.04] rounded animate-pulse" /></td>
                ))}
              </tr>
            ))}
            {data && data.meetings.map(m => {
              const modeClass = MODE_COLORS[m.mode?.toLowerCase()] ?? 'bg-white/[0.04] text-ink-tertiary border-white/[0.08]'
              return (
                <tr key={m.id}
                  onClick={() => setSelected(m)}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-4 h-4 text-brand-teal" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-ink-primary truncate block max-w-[200px]">
                          {m.title || 'Sans titre'}
                        </span>
                        {/* Media indicators */}
                        <div className="flex gap-1 mt-0.5">
                          {m.audioUrl && <Mic className="w-3 h-3 text-brand-purple/50" />}
                          {m.cameraUrl && <Camera className="w-3 h-3 text-blue-400/50" />}
                          {m.screenUrl && <Monitor className="w-3 h-3 text-emerald-400/50" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-ink-secondary">{companyLookup[m.clientName] || m.clientName || '—'}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${modeClass}`}>
                      {(m.mode || 'cloud').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-ink-tertiary" />
                      <span className="text-sm text-ink-secondary">{dur(m.duration)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-ink-secondary">{fmt(m.date)}</span>
                      {m.retention?.status === 'warning' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                          {m.retention.daysRemaining}j
                        </span>
                      )}
                      {m.retention?.status === 'expired' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
                          Exp.
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className={`text-xs font-mono ${
                      m.retention?.status === 'expired' ? 'text-red-400' :
                      m.retention?.status === 'warning' ? 'text-amber-400' :
                      'text-ink-tertiary'
                    }`}>
                      {m.retention?.daysRemaining ?? '—'}j / 90j
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {data && data.meetings.length === 0 && (
          <div className="text-center py-16 text-ink-tertiary">
            <Mic className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune réunion trouvée.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-ink-tertiary">
            Page {data.page} / {data.pages} — {data.total} réunion{data.total !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-dark-surface border border-white/[0.08] rounded-lg text-sm text-ink-secondary hover:text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}
              className="flex items-center gap-1 px-3 py-1.5 bg-dark-surface border border-white/[0.08] rounded-lg text-sm text-ink-secondary hover:text-ink-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick-preview drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => { setSelected(null); setDeleteId(null) }} />
          <div className="w-full max-w-lg bg-dark-surface border-l border-white/[0.08] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => { setSelected(null); setDeleteId(null) }} className="flex items-center gap-2 text-sm text-ink-tertiary hover:text-ink-primary transition-colors">
                <ChevronLeft className="w-4 h-4" /> Fermer
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleteId(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Supprimer
                </button>
                <button
                  onClick={() => router.push(`/admin/lucy/meetings/${selected.id}`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-brand-teal/10 border border-brand-teal/30 rounded-lg text-brand-teal text-sm hover:bg-brand-teal/20 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Voir le détail
                </button>
              </div>
            </div>

            {/* Delete confirm */}
            {deleteId === selected.id && (
              <div className="mb-4 p-3 bg-red-500/[0.08] rounded-xl border border-red-500/20 flex items-center justify-between gap-3">
                <p className="text-xs text-red-400 font-medium">Supprimer cette réunion ?</p>
                <div className="flex gap-2">
                  <button onClick={() => setDeleteId(null)} className="px-2.5 py-1 bg-white/[0.06] border border-white/[0.1] rounded text-xs text-ink-tertiary">Annuler</button>
                  <button onClick={() => handleDelete(selected.id)} disabled={deleting}
                    className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400 font-semibold disabled:opacity-50">
                    {deleting ? '…' : 'Confirmer'}
                  </button>
                </div>
              </div>
            )}

            {/* Retention banner */}
            {selected.retention?.status === 'warning' && (
              <div className="mb-4 p-3 bg-amber-500/[0.06] rounded-lg border border-amber-500/15 flex items-center gap-2 text-xs text-ink-secondary">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                Suppression dans <strong className="text-amber-400">{selected.retention.daysRemaining}j</strong>
              </div>
            )}
            {selected.retention?.status === 'expired' && (
              <div className="mb-4 p-3 bg-red-500/[0.06] rounded-lg border border-red-500/15 flex items-center gap-2 text-xs text-ink-secondary">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <strong className="text-red-400">Rétention expirée</strong> — téléchargez avant suppression
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center flex-shrink-0">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink-primary">{selected.title || 'Sans titre'}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-ink-tertiary">{fmt(selected.date)}</p>
                  {selected.mode && (
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${MODE_COLORS[selected.mode?.toLowerCase()] ?? 'bg-white/[0.04] text-ink-tertiary border-white/[0.08]'}`}>
                      {selected.mode.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Media badges */}
            <div className="flex gap-1.5 mb-4">
              {selected.audioUrl && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                  <Mic className="w-3 h-3" /> Audio
                </span>
              )}
              {selected.cameraUrl && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Camera className="w-3 h-3" /> Caméra
                </span>
              )}
              {selected.screenUrl && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Monitor className="w-3 h-3" /> Écran
                </span>
              )}
            </div>

            <div className="space-y-4">
              {([
                ['Client', companyLookup[selected.clientName] || selected.clientName || '—'],
                ['Device', selected.deviceName || '—'],
                ['Durée', dur(selected.duration)],
                ['Langue', selected.language || '—'],
                ['Participants', selected.participants?.join(', ') || '—'],
                ['Rétention', `${selected.retention?.daysRemaining ?? '—'}j / 90j`],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between items-start gap-4 py-3 border-b border-white/[0.04]">
                  <span className="text-sm text-ink-tertiary flex-shrink-0">{k}</span>
                  <span className="text-sm text-ink-primary text-right font-mono break-all">{v}</span>
                </div>
              ))}
            </div>

            {selected.summary && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-ink-secondary mb-3">Résumé</h3>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 text-sm text-ink-secondary leading-relaxed whitespace-pre-wrap">
                  {(() => {
                    try {
                      const p = JSON.parse(selected.summary)
                      return p.executive_summary || p.executiveSummary || p.summary || selected.summary
                    } catch { return selected.summary }
                  })()}
                </div>
              </div>
            )}

            <button
              onClick={() => router.push(`/admin/lucy/meetings/${selected.id}`)}
              className="mt-6 w-full py-2.5 bg-brand-teal/10 border border-brand-teal/30 rounded-xl text-brand-teal text-sm font-medium hover:bg-brand-teal/20 transition-colors flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> Ouvrir la page complète
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
