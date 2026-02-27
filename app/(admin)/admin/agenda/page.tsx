'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  Mail,
  Phone,
  Building2,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  CalendarX,
  PlugZap,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Toast, ToastType } from '@/components/admin/Toast';
import type { Appointment, AppointmentStatus } from '@/lib/firestore-appointments';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatDateFull(dateStr: string): string {
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function isThisWeek(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return d >= startOfWeek && d <= endOfWeek;
  } catch {
    return false;
  }
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending:   { label: 'En attente',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  dot: 'bg-amber-400' },
  confirmed: { label: 'Confirmé',    bg: 'bg-green-500/10',  text: 'text-green-400',  dot: 'bg-green-400' },
  cancelled: { label: 'Annulé',      bg: 'bg-red-500/10',    text: 'text-red-400',    dot: 'bg-red-400' },
};

type FilterTab = 'all' | AppointmentStatus;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/agenda');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch {
      setToast({ message: 'Impossible de charger les rendez-vous.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     appointments.length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    thisWeek:  appointments.filter((a) => a.status !== 'cancelled' && isThisWeek(a.slot.date ?? null)).length,
  }), [appointments]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'all') return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const updateStatus = async (id: string, status: AppointmentStatus) => {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/agenda/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
      );
      const labels: Record<AppointmentStatus, string> = {
        confirmed: 'RDV confirmé.',
        cancelled: 'RDV annulé.',
        pending: 'RDV remis en attente.',
      };
      setToast({ message: labels[status], type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la mise à jour.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(deleteId + 'delete');
    try {
      const res = await fetch(`/api/admin/agenda/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur serveur');
      setAppointments((prev) => prev.filter((a) => a.id !== deleteId));
      setToast({ message: 'Rendez-vous supprimé.', type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la suppression.', type: 'error' });
    } finally {
      setDeleteId(null);
      setActionLoading(null);
    }
  };

  const appointmentToDelete = appointments.find((a) => a.id === deleteId);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer le rendez-vous"
        message={`Supprimer la demande de RDV de ${appointmentToDelete?.prospect.name || '—'}${appointmentToDelete?.slot.date ? ` du ${formatDateFull(appointmentToDelete.slot.date)}` : ''} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={actionLoading === deleteId + 'delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
          <p className="text-ink-secondary text-sm mt-1">
            Rendez-vous pris via le chatbot du site
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Future integrations — grayed out */}
          <div className="flex items-center gap-1.5 opacity-40 cursor-not-allowed" title="Bientôt disponible">
            <PlugZap className="w-4 h-4 text-ink-tertiary" />
            <span className="text-xs text-ink-tertiary hidden sm:inline">Sync calendriers</span>
          </div>
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total RDVs',    value: stats.total,     color: 'text-ink-primary',  bg: '' },
          { label: 'En attente',    value: stats.pending,   color: 'text-amber-400',    bg: 'bg-amber-500/5 border-amber-500/15' },
          { label: 'Confirmés',     value: stats.confirmed, color: 'text-green-400',    bg: 'bg-green-500/5 border-green-500/15' },
          { label: 'Cette semaine', value: stats.thisWeek,  color: 'text-brand-teal',   bg: 'bg-brand-teal/5 border-brand-teal/15' },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-4 ${s.bg || 'bg-white/[0.04] border-white/[0.08]'}`}
          >
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-xs text-ink-tertiary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] w-fit">
        {([
          { key: 'all',       label: 'Tous' },
          { key: 'pending',   label: 'En attente' },
          { key: 'confirmed', label: 'Confirmés' },
          { key: 'cancelled', label: 'Annulés' },
        ] as { key: FilterTab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === tab.key
                ? 'bg-white/[0.08] text-ink-primary'
                : 'text-ink-tertiary hover:text-ink-secondary'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className={`ml-1.5 text-[10px] font-mono ${filter === tab.key ? 'text-ink-secondary' : 'text-ink-tertiary'}`}>
                {appointments.filter((a) => a.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[1fr_180px_140px_100px_96px] px-6 py-3 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
          <span>Prospect & commentaire</span>
          <span>Contact</span>
          <span>Date & heure</span>
          <span>Statut</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-14">
            <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-ink-tertiary">
            <CalendarX className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {filter === 'all'
                ? "Aucun rendez-vous pour l'instant"
                : `Aucun RDV « ${STATUS_CONFIG[filter as AppointmentStatus]?.label || filter} »`}
            </p>
            <p className="text-xs mt-1 text-ink-tertiary">
              {filter === 'all'
                ? "Les RDVs pris via le chatbot apparaîtront ici."
                : "Modifiez le filtre pour voir d'autres rendez-vous."}
            </p>
          </div>
        )}

        {/* Rows */}
        {!loading && (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((appt) => {
              const st = STATUS_CONFIG[appt.status];
              const isActing = actionLoading?.startsWith(appt.id);

              return (
                <div
                  key={appt.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_180px_140px_100px_96px] items-start md:items-center px-6 py-4 hover:bg-white/[0.02] transition-colors gap-3 md:gap-0"
                >
                  {/* Prospect & comment */}
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-ink-primary truncate">
                      {appt.prospect.name}
                    </p>
                    {appt.prospect.company && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-ink-tertiary flex-shrink-0" />
                        <p className="text-xs text-ink-tertiary truncate">{appt.prospect.company}</p>
                      </div>
                    )}
                    {appt.prospect.comment ? (
                      <p className="text-xs text-ink-secondary mt-1.5 line-clamp-2 leading-relaxed italic">
                        {appt.prospect.comment}
                      </p>
                    ) : (
                      <p className="text-xs text-ink-tertiary mt-1 truncate">{appt.slot.subject}</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Mail className="w-3 h-3 text-ink-tertiary flex-shrink-0" />
                      <a
                        href={`mailto:${appt.prospect.email}`}
                        className="text-xs text-brand-teal hover:underline truncate"
                      >
                        {appt.prospect.email}
                      </a>
                    </div>
                    {appt.prospect.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-ink-tertiary flex-shrink-0" />
                        <span className="text-xs text-ink-secondary">{appt.prospect.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Date & time */}
                  <div className="space-y-1">
                    {appt.slot.date ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3 text-ink-tertiary flex-shrink-0" />
                          <span className="text-xs text-ink-primary capitalize">
                            {formatDate(appt.slot.date)}
                          </span>
                        </div>
                        {appt.slot.time && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-ink-tertiary flex-shrink-0" />
                            <span className="text-xs text-ink-secondary">
                              {appt.slot.time} · {appt.slot.duration} min
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3 text-amber-400/60 flex-shrink-0" />
                        <span className="text-xs text-amber-400/80 font-medium">À planifier</span>
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    {/* Confirm — only if pending */}
                    {appt.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(appt.id, 'confirmed')}
                        disabled={!!isActing}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-green-400 hover:bg-green-500/10 transition-all cursor-pointer disabled:opacity-40"
                        title="Confirmer"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {/* Re-open — only if confirmed or cancelled */}
                    {appt.status !== 'pending' && (
                      <button
                        onClick={() => updateStatus(appt.id, 'pending')}
                        disabled={!!isActing}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer disabled:opacity-40"
                        title="Remettre en attente"
                      >
                        <CalendarCheck className="w-4 h-4" />
                      </button>
                    )}
                    {/* Cancel — only if not already cancelled */}
                    {appt.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(appt.id, 'cancelled')}
                        disabled={!!isActing}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-40"
                        title="Annuler"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(appt.id)}
                      disabled={!!isActing}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-40"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Future integrations */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
        <div className="flex items-center gap-2 mb-3">
          <PlugZap className="w-4 h-4 text-ink-tertiary" />
          <h2 className="text-sm font-semibold text-ink-tertiary uppercase tracking-wider">
            Intégrations calendrier
          </h2>
          <span className="text-[10px] text-ink-tertiary bg-white/[0.06] px-2 py-0.5 rounded-full ml-auto">
            Bientôt disponible
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Google Calendar', color: '#4285F4' },
            { name: 'Microsoft Outlook', color: '#0078D4' },
            { name: 'Apple Calendar', color: '#FF3B30' },
          ].map((cal) => (
            <div
              key={cal.name}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] opacity-40 cursor-not-allowed"
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cal.color }}
              />
              <span className="text-xs text-ink-secondary">{cal.name}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-ink-tertiary mt-3">
          La synchronisation bidirectionnelle avec vos agendas sera disponible prochainement.
        </p>
      </div>
    </div>
  );
}
