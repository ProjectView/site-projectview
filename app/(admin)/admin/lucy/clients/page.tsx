'use client'
import { useState, useEffect } from 'react'
import {
  Building2, Monitor, Mic, Search, ChevronDown, ChevronRight,
  Key, Shield, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock
} from 'lucide-react'
import Link from 'next/link'

interface Device {
  id: string
  licenseKey: string
  screenName: string
  type: string
  status: string
  fingerprint: string
  email: string
  expiresAt: string | null
  meetingCount: number
  lastMeeting: string | null
  createdAt: string | null
}

interface Client {
  name: string
  devices: Device[]
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch { return iso }
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

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    trial: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid:  'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${map[type] ?? 'bg-white/[0.05] text-ink-tertiary border-white/[0.08]'}`}>
      {type === 'trial' ? 'Essai' : 'Payant'}
    </span>
  )
}

function DeviceRow({ device }: { device: Device }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 hover:bg-white/[0.02] rounded-lg transition-colors">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
        <Monitor className="w-4 h-4 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-ink-primary">{device.screenName}</span>
          <StatusBadge status={device.status} />
          <TypeBadge type={device.type} />
        </div>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="text-xs font-mono text-ink-tertiary">{device.licenseKey || '—'}</span>
          {device.email && <span className="text-xs text-ink-tertiary">{device.email}</span>}
        </div>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <div className="flex items-center gap-1 text-xs text-ink-secondary">
            <Mic className="w-3 h-3" />
            <span className="font-medium">{device.meetingCount}</span>
          </div>
          <p className="text-[10px] text-ink-tertiary">réunions</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-ink-secondary">{fmtDate(device.lastMeeting)}</p>
          <p className="text-[10px] text-ink-tertiary">dernière réunion</p>
        </div>
        <div className="text-right hidden lg:block">
          <p className="text-xs text-ink-secondary">{fmtDate(device.expiresAt)}</p>
          <p className="text-[10px] text-ink-tertiary">expiration</p>
        </div>
      </div>
    </div>
  )
}

function ClientRow({ client }: { client: Client }) {
  const [open, setOpen] = useState(false)
  const totalMeetings = client.devices.reduce((s, d) => s + d.meetingCount, 0)
  const activeCount   = client.devices.filter(d => d.status === 'active').length

  return (
    <div className="bg-dark-surface border border-white/[0.08] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-brand-teal" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink-primary">{client.name}</p>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs text-ink-tertiary">
              {client.devices.length} device{client.devices.length > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {activeCount} actif{activeCount > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-tertiary">
              <Mic className="w-3 h-3" />
              {totalMeetings} réunion{totalMeetings > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <Link
          href={`/admin/lucy/clients/${encodeURIComponent(client.name)}`}
          onClick={e => e.stopPropagation()}
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-medium transition-colors flex-shrink-0"
        >
          Gérer
        </Link>
        {open
          ? <ChevronDown className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
          : <ChevronRight className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="border-t border-white/[0.06] divide-y divide-white/[0.04] px-2 pb-2">
          {client.devices.length === 0 ? (
            <p className="text-xs text-ink-tertiary text-center py-4">Aucun device</p>
          ) : (
            client.devices.map(d => <DeviceRow key={d.id} device={d} />)
          )}
        </div>
      )}
    </div>
  )
}

export default function LucyClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr]         = useState('')
  const [search, setSearch]   = useState('')

  async function fetchClients() {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/lucy/clients')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setClients(data.clients ?? [])
    } catch {
      setErr('Impossible de charger les clients.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClients() }, [])

  const filtered = clients.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.devices.some(d =>
        d.licenseKey.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.screenName.toLowerCase().includes(q)
      )
    )
  })

  const totalDevices  = clients.reduce((s, c) => s + c.devices.length, 0)
  const totalMeetings = clients.reduce((s, c) => s + c.devices.reduce((ss, d) => ss + d.meetingCount, 0), 0)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-primary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-teal" />
            Clients Lucy
          </h1>
          <p className="text-sm text-ink-tertiary mt-0.5">
            {clients.length} client{clients.length > 1 ? 's' : ''} · {totalDevices} device{totalDevices > 1 ? 's' : ''} · {totalMeetings} réunion{totalMeetings > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchClients}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-dark-surface border border-white/[0.08] rounded-lg text-sm text-ink-secondary hover:text-ink-primary hover:border-white/[0.15] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input
          type="text"
          placeholder="Rechercher client, device, email, clé…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-dark-surface border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/40 transition-colors"
        />
      </div>

      {err && (
        <div className="flex items-center gap-2 p-4 bg-red-500/[0.08] border border-red-500/20 rounded-xl mb-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {err}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-ink-tertiary">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" />
          <p className="text-sm">Chargement…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-tertiary">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? 'Aucun résultat.' : 'Aucun client.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => <ClientRow key={c.name} client={c} />)}
        </div>
      )}
    </div>
  )
}
