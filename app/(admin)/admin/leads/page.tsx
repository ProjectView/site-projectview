'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Users, LayoutList, Columns, Search, Trash2, Edit3,
  Building2, Mail, Phone, MapPin, Calendar, Flag, RefreshCw,
  AlertCircle, X, Loader2, ChevronDown,
} from 'lucide-react';
import { Toast, ToastType } from '@/components/admin/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { Lead, LeadStatus, LeadSource, LeadPriority } from '@/lib/firestore-leads';

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; dot: string; border: string }> = {
  nouveau:        { label: 'Nouveau',        color: 'text-sky-400',     bg: 'bg-sky-500/10',     dot: '#38bdf8', border: 'border-sky-500/30' },
  contacte:       { label: 'Contacté',       color: 'text-violet-400',  bg: 'bg-violet-500/10',  dot: '#a78bfa', border: 'border-violet-500/30' },
  'en-discussion':{ label: 'En discussion',  color: 'text-amber-400',   bg: 'bg-amber-500/10',   dot: '#fbbf24', border: 'border-amber-500/30' },
  proposition:    { label: 'Proposition',    color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  dot: '#facc15', border: 'border-yellow-500/30' },
  gagne:          { label: 'Gagné',          color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: '#34d399', border: 'border-emerald-500/30' },
  perdu:          { label: 'Perdu',          color: 'text-red-400',     bg: 'bg-red-500/10',     dot: '#f87171', border: 'border-red-500/30' },
};

const STATUSES: LeadStatus[] = ['nouveau', 'contacte', 'en-discussion', 'proposition', 'gagne', 'perdu'];

const SOURCE_LABELS: Record<LeadSource, string> = {
  'site-web': 'Site web', chatbot: 'Chatbot', referral: 'Référence',
  salon: 'Salon', cold: 'Prospection', autre: 'Autre',
};

const PRIORITY_CONFIG: Record<LeadPriority, { label: string; color: string; bg: string }> = {
  low:    { label: 'Basse',  color: 'text-ink-tertiary',  bg: 'bg-white/[0.04]' },
  medium: { label: 'Moyenne',color: 'text-amber-400',     bg: 'bg-amber-500/10' },
  high:   { label: 'Haute',  color: 'text-red-400',       bg: 'bg-red-500/10' },
};

const EMPTY_FORM: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
  firstName: '', lastName: '', company: '', email: '', phone: '',
  address: '', comment: '', status: 'nouveau', source: undefined,
  priority: undefined, nextAction: '', nextActionDate: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fullName(lead: Lead) { return `${lead.firstName} ${lead.lastName}`.trim(); }

function isOverdue(date?: string) {
  if (!date) return false;
  return new Date(date + 'T00:00:00') < new Date(new Date().toDateString());
}

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'tous'>('tous');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  // Fetch
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) setLeads((await res.json()).leads);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  // Filtered list
  const filtered = useMemo(() => {
    let r = leads;
    if (filterStatus !== 'tous') r = r.filter((l) => l.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((l) =>
        l.company.toLowerCase().includes(q) ||
        fullName(l).toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    }
    return r;
  }, [leads, filterStatus, search]);

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur serveur');
      setLeads((prev) => prev.filter((l) => l.id !== deleteId));
      setToast({ message: 'Lead supprimé.', type: 'success' });
      setDeleteId(null);
    } catch {
      setToast({ message: 'Erreur lors de la suppression.', type: 'error' });
    } finally { setDeleting(false); }
  };

  // Inline status change (kanban)
  const handleStatusChange = async (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      setToast({ message: 'Erreur mise à jour statut.', type: 'error' });
      fetchLeads();
    }
  };

  // Modal save
  const handleSave = (saved: Lead) => {
    setLeads((prev) => {
      const exists = prev.find((l) => l.id === saved.id);
      return exists ? prev.map((l) => l.id === saved.id ? saved : l) : [saved, ...prev];
    });
    setToast({ message: editLead ? 'Lead mis à jour.' : 'Lead ajouté.', type: 'success' });
    setModalOpen(false);
    setEditLead(null);
  };

  const openAdd = () => { setEditLead(null); setModalOpen(true); };
  const openEdit = (lead: Lead) => { setEditLead(lead); setModalOpen(true); };
  const leadToDelete = leads.find((l) => l.id === deleteId);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer le lead"
        message={`Supprimer "${leadToDelete ? fullName(leadToDelete) + ' — ' + leadToDelete.company : ''}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-teal" />
            Prospects
          </h1>
          <p className="text-ink-secondary text-sm mt-1">
            {leads.length} lead{leads.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button onClick={fetchLeads} disabled={loading}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50"
            title="Rafraîchir">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {/* View toggle */}
          <div className="flex items-center rounded-lg bg-white/[0.04] border border-white/[0.08] p-0.5">
            <button onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${view === 'list' ? 'bg-white/[0.08] text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary'}`}>
              <LayoutList className="w-3.5 h-3.5" /> Liste
            </button>
            <button onClick={() => setView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${view === 'kanban' ? 'bg-white/[0.08] text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary'}`}>
              <Columns className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>
          {/* Add */}
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Ajouter un lead
          </button>
        </div>
      </div>

      {/* List view */}
      {view === 'list' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par société, nom ou email..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'tous')}
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-teal/50 transition-colors cursor-pointer min-w-[160px]">
              <option value="tous" className="bg-dark-surface">Tous les statuts</option>
              {STATUSES.map((s) => <option key={s} value={s} className="bg-dark-surface">{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1.2fr_120px_100px_120px_130px_88px] px-6 py-3 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-ink-tertiary rounded-t-2xl overflow-hidden">
              <span>Société / Contact</span>
              <span>Email</span>
              <span>Téléphone</span>
              <span>Statut</span>
              <span>Priorité</span>
              <span>Source</span>
              <span>Relance</span>
              <span className="text-right">Actions</span>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-ink-tertiary">
                <Users className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {leads.length === 0 ? 'Aucun lead pour le moment' : 'Aucun résultat'}
                </p>
                {leads.length === 0 && (
                  <button onClick={openAdd}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 transition-all cursor-pointer">
                    <Plus className="w-4 h-4" /> Ajouter votre premier lead
                  </button>
                )}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="divide-y divide-white/[0.04]">
                {filtered.map((lead, i) => {
                  const sc = STATUS_CONFIG[lead.status];
                  const pc = lead.priority ? PRIORITY_CONFIG[lead.priority] : null;
                  const overdue = isOverdue(lead.nextActionDate);
                  return (
                    <div key={lead.id}
                      onClick={() => router.push(`/admin/leads/${lead.id}`)}
                      className={`grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1.2fr_120px_100px_120px_130px_88px] items-center px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${i === filtered.length - 1 ? 'rounded-b-2xl' : ''}`}>
                      {/* Company + Name */}
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-brand-teal" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink-primary truncate">{lead.company}</p>
                          <p className="text-xs text-ink-tertiary truncate">{fullName(lead)}</p>
                        </div>
                      </div>
                      {/* Email */}
                      <div className="flex items-center gap-1.5 text-xs text-ink-secondary min-w-0">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0 text-ink-tertiary" />
                        <a href={`mailto:${lead.email}`} className="truncate hover:text-brand-teal transition-colors">{lead.email}</a>
                      </div>
                      {/* Phone */}
                      <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0 text-ink-tertiary" />
                        <span>{lead.phone || '—'}</span>
                      </div>
                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sc.dot }} />
                          {sc.label}
                        </span>
                      </div>
                      {/* Priority */}
                      <div>
                        {pc ? (
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${pc.bg} ${pc.color}`}>{pc.label}</span>
                        ) : <span className="text-xs text-ink-tertiary">—</span>}
                      </div>
                      {/* Source */}
                      <div className="text-xs text-ink-tertiary">
                        {lead.source ? SOURCE_LABELS[lead.source] : '—'}
                      </div>
                      {/* Next action date */}
                      <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-red-400' : 'text-ink-tertiary'}`}>
                        {overdue && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                        {lead.nextActionDate ? (
                          <span className="truncate">{formatDate(lead.nextActionDate)}</span>
                        ) : <span>—</span>}
                      </div>
                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(lead); }}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-brand-teal hover:bg-brand-teal/10 transition-all cursor-pointer"
                          title="Modifier">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(lead.id); }}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Kanban view */}
      {view === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STATUSES.map((status) => {
              const sc = STATUS_CONFIG[status];
              const colLeads = leads.filter((l) => l.status === status);
              return (
                <div key={status} className="w-72 flex flex-col gap-3">
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${sc.bg} border ${sc.border}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.dot }} />
                      <span className={`text-sm font-semibold ${sc.color}`}>{sc.label}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Add button for column */}
                  <button onClick={() => { setEditLead({ ...EMPTY_FORM as unknown as Lead, status }); setModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/[0.10] text-xs text-ink-tertiary hover:border-white/[0.20] hover:text-ink-secondary transition-all cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>

                  {/* Cards */}
                  <div className="flex flex-col gap-3">
                    {loading && (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
                      </div>
                    )}
                    {!loading && colLeads.length === 0 && (
                      <div className="text-center py-6 text-xs text-ink-tertiary/50">Aucun lead</div>
                    )}
                    {!loading && colLeads.map((lead) => (
                      <KanbanCard
                        key={lead.id}
                        lead={lead}
                        onEdit={openEdit}
                        onDelete={(id) => setDeleteId(id)}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <LeadModal
          lead={editLead}
          onClose={() => { setModalOpen(false); setEditLead(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ── Kanban Card ───────────────────────────────────────────────────────────────

function KanbanCard({ lead, onEdit, onDelete, onStatusChange }: {
  lead: Lead;
  onEdit: (l: Lead) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, s: LeadStatus) => void;
}) {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = useState(false);
  const overdue = isOverdue(lead.nextActionDate);
  const pc = lead.priority ? PRIORITY_CONFIG[lead.priority] : null;

  return (
    <div
      onClick={() => router.push(`/admin/leads/${lead.id}`)}
      className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 hover:border-white/[0.14] transition-all group cursor-pointer">
      {/* Priority indicator */}
      {lead.priority === 'high' && (
        <div className="absolute top-3 right-3">
          <Flag className="w-3.5 h-3.5 text-red-400" />
        </div>
      )}

      {/* Company + name */}
      <div className="mb-3 pr-5">
        <p className="text-sm font-semibold text-ink-primary leading-tight">{lead.company}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">{fullName(lead)}</p>
      </div>

      {/* Contact info */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <Mail className="w-3 h-3 flex-shrink-0 text-ink-tertiary" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <Phone className="w-3 h-3 flex-shrink-0 text-ink-tertiary" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Next action */}
      {lead.nextActionDate && (
        <div className={`flex items-center gap-1.5 text-xs mb-3 px-2 py-1.5 rounded-lg ${overdue ? 'bg-red-500/10 text-red-400' : 'bg-white/[0.04] text-ink-tertiary'}`}>
          {overdue ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <Calendar className="w-3.5 h-3.5 flex-shrink-0" />}
          <span>{overdue ? 'En retard — ' : ''}{formatDate(lead.nextActionDate)}</span>
        </div>
      )}

      {/* Source + Priority */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {lead.source && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-ink-tertiary">
            {SOURCE_LABELS[lead.source]}
          </span>
        )}
        {pc && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${pc.bg} ${pc.color}`}>
            {pc.label}
          </span>
        )}
      </div>

      {/* Bottom: status selector + actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        {/* Status selector */}
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setStatusOpen((o) => !o); }}
            className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full font-medium cursor-pointer transition-all
              ${STATUS_CONFIG[lead.status].bg} ${STATUS_CONFIG[lead.status].color}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_CONFIG[lead.status].dot }} />
            {STATUS_CONFIG[lead.status].label}
            <ChevronDown className={`w-3 h-3 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
          </button>
          {statusOpen && (
            <div className="absolute left-0 bottom-full mb-2 z-50 w-44 rounded-xl border border-white/[0.10] bg-dark-elevated shadow-xl overflow-hidden">
              {STATUSES.map((s) => {
                const sc = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, s); setStatusOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-all cursor-pointer
                      ${s === lead.status ? `${sc.bg} ${sc.color} font-semibold` : 'text-ink-secondary hover:bg-white/[0.05]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sc.dot }} />
                    {sc.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-tertiary hover:text-brand-teal hover:bg-brand-teal/10 transition-all cursor-pointer">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Lead Modal ────────────────────────────────────────────────────────────────

function LeadModal({ lead, onClose, onSave }: {
  lead: Lead | null;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}) {
  const isEdit = !!(lead?.id && lead.createdAt);
  const [form, setForm] = useState<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>(
    isEdit ? {
      firstName: lead!.firstName, lastName: lead!.lastName, company: lead!.company,
      email: lead!.email, phone: lead!.phone, address: lead!.address ?? '',
      comment: lead!.comment ?? '', status: lead!.status,
      source: lead!.source, priority: lead!.priority,
      nextAction: lead!.nextAction ?? '', nextActionDate: lead!.nextActionDate ?? '',
    } : (lead ? { ...EMPTY_FORM, status: (lead as Lead).status ?? 'nouveau' } : { ...EMPTY_FORM })
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Requis';
    if (!form.lastName.trim()) e.lastName = 'Requis';
    if (!form.company.trim()) e.company = 'Requis';
    if (!form.email.trim()) e.email = 'Requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/leads/${lead!.id}` : '/api/admin/leads';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur serveur');
      }
      const data = await res.json();
      onSave(data.lead);
    } catch (err) {
      setErrors({ _global: err instanceof Error ? err.message : 'Erreur inconnue' });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-dark-surface border border-white/[0.10] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold tracking-tight">
            {isEdit ? `Modifier — ${lead!.company}` : 'Ajouter un lead'}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {errors._global && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors._global}
            </div>
          )}

          {/* Identité */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-3 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Identité
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prénom *" error={errors.firstName}>
                <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
                  placeholder="Jean" className={input(!!errors.firstName)} />
              </Field>
              <Field label="Nom *" error={errors.lastName}>
                <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)}
                  placeholder="Dupont" className={input(!!errors.lastName)} />
              </Field>
            </div>
          </fieldset>

          {/* Société */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-3 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> Société
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nom de la société *" error={errors.company} className="col-span-2 sm:col-span-1">
                <input value={form.company} onChange={(e) => set('company', e.target.value)}
                  placeholder="ACME Corp" className={input(!!errors.company)} />
              </Field>
              <Field label="Source">
                <select value={form.source ?? ''} onChange={(e) => set('source', e.target.value || undefined)}
                  className={input(false)}>
                  <option value="">— Sélectionner —</option>
                  {(Object.entries(SOURCE_LABELS) as [LeadSource, string][]).map(([v, l]) =>
                    <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-3 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Contact
            </legend>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email *" error={errors.email}>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                    placeholder="jean@societe.fr" className={input(!!errors.email)} />
                </Field>
                <Field label="Téléphone">
                  <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
                    placeholder="06 12 34 56 78" className={input(false)} />
                </Field>
              </div>
              <Field label="Adresse">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                  <input value={form.address ?? ''} onChange={(e) => set('address', e.target.value)}
                    placeholder="12 rue de la Paix, 75001 Paris" className={input(false) + ' pl-10'} />
                </div>
              </Field>
            </div>
          </fieldset>

          {/* CRM */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-3 flex items-center gap-2">
              <Flag className="w-3.5 h-3.5" /> CRM
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Statut">
                <select value={form.status} onChange={(e) => set('status', e.target.value as LeadStatus)}
                  className={input(false)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                </select>
              </Field>
              <Field label="Priorité">
                <select value={form.priority ?? ''} onChange={(e) => set('priority', e.target.value || undefined)}
                  className={input(false)}>
                  <option value="">— Sélectionner —</option>
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </Field>
              <Field label="Prochaine action">
                <input value={form.nextAction ?? ''} onChange={(e) => set('nextAction', e.target.value)}
                  placeholder="Envoyer la proposition..." className={input(false)} />
              </Field>
              <Field label="Date de relance">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                  <input type="date" value={form.nextActionDate ?? ''} onChange={(e) => set('nextActionDate', e.target.value)}
                    className={input(false) + ' pl-10'} />
                </div>
              </Field>
            </div>
          </fieldset>

          {/* Comment */}
          <Field label="Commentaire">
            <textarea value={form.comment ?? ''} onChange={(e) => set('comment', e.target.value)}
              rows={3} placeholder="Notes internes sur ce lead..."
              className={input(false) + ' resize-y leading-relaxed'} />
          </Field>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer">
            Annuler
          </button>
          <button type="submit" form="lead-form" onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-50">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : (isEdit ? 'Mettre à jour' : 'Ajouter le lead')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Micro-helpers ─────────────────────────────────────────────────────────────

function Field({ label, children, error, className = '' }: {
  label: string; children: React.ReactNode; error?: string; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-ink-secondary">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function input(hasError: boolean) {
  return `w-full bg-white/[0.04] border rounded-lg px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none transition-all ${
    hasError
      ? 'border-red-500/50 focus:border-red-500/70'
      : 'border-white/[0.08] focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20'
  }`;
}
