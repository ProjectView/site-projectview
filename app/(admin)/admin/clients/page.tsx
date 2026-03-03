'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCheck, Search, RefreshCw, Building2, Mail, Phone,
  AlertCircle, Calendar,
} from 'lucide-react';
import { Toast, ToastType } from '@/components/admin/Toast';
import type { Lead, LeadStatus } from '@/lib/firestore-leads';

// ── Config ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; dot: string }> = {
  nouveau:         { label: 'Nouveau',       color: 'text-sky-400',     bg: 'bg-sky-500/10',     dot: '#38bdf8' },
  contacte:        { label: 'Contacté',      color: 'text-violet-400',  bg: 'bg-violet-500/10',  dot: '#a78bfa' },
  'en-discussion': { label: 'En discussion', color: 'text-amber-400',   bg: 'bg-amber-500/10',   dot: '#fbbf24' },
  proposition:     { label: 'Proposition',   color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  dot: '#facc15' },
  gagne:           { label: 'Gagné',         color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: '#34d399' },
  perdu:           { label: 'Perdu',         color: 'text-red-400',     bg: 'bg-red-500/10',     dot: '#f87171' },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function fullName(lead: Lead) {
  return `${lead.firstName} ${lead.lastName}`.trim();
}

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso + (iso.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatCurrency(val?: number) {
  if (!val) return null;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients');
      if (res.ok) setClients((await res.json()).clients);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter((c) =>
      c.company.toLowerCase().includes(q) ||
      fullName(c).toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [clients, search]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            Clients
          </h1>
          <p className="text-ink-secondary text-sm mt-1">
            {clients.length} client{clients.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={fetchClients} disabled={loading}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50"
          title="Rafraîchir">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par société, nom ou email..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08]">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1.2fr_120px_140px_160px_100px] px-6 py-3 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-ink-tertiary rounded-t-2xl overflow-hidden">
          <span>Société / Contact</span>
          <span>Email</span>
          <span>Téléphone</span>
          <span>Statut</span>
          <span>Client depuis</span>
          <span>Valeur contrat</span>
          <span>Prochaine action</span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-ink-tertiary">
            <UserCheck className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {clients.length === 0
                ? 'Aucun client pour le moment — convertissez vos prospects depuis leurs fiches'
                : 'Aucun résultat'}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((client, i) => {
              const sc = STATUS_CONFIG[client.status];
              return (
                <div
                  key={client.id}
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                  className={`grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1.2fr_120px_140px_160px_100px] items-center px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${i === filtered.length - 1 ? 'rounded-b-2xl' : ''}`}
                >
                  {/* Société + nom */}
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-primary truncate">{client.company}</p>
                      <p className="text-xs text-ink-tertiary truncate">{fullName(client)}</p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-1.5 text-xs text-ink-secondary min-w-0">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0 text-ink-tertiary" />
                    <a href={`mailto:${client.email}`} onClick={(e) => e.stopPropagation()}
                      className="truncate hover:text-brand-teal transition-colors">{client.email}</a>
                  </div>
                  {/* Téléphone */}
                  <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0 text-ink-tertiary" />
                    <span>{client.phone || '—'}</span>
                  </div>
                  {/* Statut */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sc.dot }} />
                      {sc.label}
                    </span>
                  </div>
                  {/* Client depuis */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{formatDate(client.clientSince) ?? '—'}</span>
                  </div>
                  {/* Valeur contrat */}
                  <div className="text-xs">
                    {client.contractValue
                      ? <span className="text-ink-primary font-semibold">{formatCurrency(client.contractValue)}</span>
                      : <span className="text-ink-tertiary">—</span>}
                  </div>
                  {/* Prochaine action */}
                  <div className={`flex items-center gap-1.5 text-xs ${client.nextActionDate ? 'text-amber-400' : 'text-ink-tertiary'}`}>
                    {client.nextActionDate
                      ? <><Calendar className="w-3.5 h-3.5 flex-shrink-0" /><span>{formatDate(client.nextActionDate)}</span></>
                      : <span>—</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
