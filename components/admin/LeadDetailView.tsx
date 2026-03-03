'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, Globe, Briefcase,
  Flag, Calendar, AlertCircle, Edit3, Trash2, UserCheck, UserPlus,
  MessageSquare, PhoneCall, RefreshCw, Plus, Loader2, X,
  Clock, CheckCircle2, CalendarCheck, Send, FileText,
} from 'lucide-react';
import { Toast, ToastType } from '@/components/admin/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { Lead, LeadStatus, LeadPriority, NoteType, LeadNote } from '@/lib/firestore-leads';

// ── Shared Config ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; dot: string }> = {
  nouveau:         { label: 'Nouveau',       color: 'text-sky-400',     bg: 'bg-sky-500/10',     dot: '#38bdf8' },
  contacte:        { label: 'Contacté',      color: 'text-violet-400',  bg: 'bg-violet-500/10',  dot: '#a78bfa' },
  'en-discussion': { label: 'En discussion', color: 'text-amber-400',   bg: 'bg-amber-500/10',   dot: '#fbbf24' },
  proposition:     { label: 'Proposition',   color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  dot: '#facc15' },
  gagne:           { label: 'Gagné',         color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: '#34d399' },
  perdu:           { label: 'Perdu',         color: 'text-red-400',     bg: 'bg-red-500/10',     dot: '#f87171' },
};

const STATUSES: LeadStatus[] = ['nouveau', 'contacte', 'en-discussion', 'proposition', 'gagne', 'perdu'];

const PRIORITY_CONFIG: Record<LeadPriority, { label: string; color: string; bg: string }> = {
  low:    { label: 'Basse',  color: 'text-ink-tertiary', bg: 'bg-white/[0.04]' },
  medium: { label: 'Moyenne', color: 'text-amber-400',   bg: 'bg-amber-500/10' },
  high:   { label: 'Haute',  color: 'text-red-400',      bg: 'bg-red-500/10' },
};

const SOURCE_LABELS: Record<string, string> = {
  'site-web': 'Site web', chatbot: 'Chatbot', referral: 'Référence',
  salon: 'Salon', cold: 'Prospection', autre: 'Autre',
};

const NOTE_CONFIG: Record<NoteType, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  note:    { label: 'Note',     color: 'text-ink-secondary',  bg: 'bg-white/[0.06]',   icon: FileText },
  appel:   { label: 'Appel',    color: 'text-brand-teal',     bg: 'bg-brand-teal/10',  icon: PhoneCall },
  email:   { label: 'Email',    color: 'text-violet-400',     bg: 'bg-violet-500/10',  icon: Send },
  reunion: { label: 'Réunion',  color: 'text-amber-400',      bg: 'bg-amber-500/10',   icon: CalendarCheck },
  relance: { label: 'Relance',  color: 'text-brand-orange',   bg: 'bg-brand-orange/10',icon: RefreshCw },
};

const NOTE_TYPES: NoteType[] = ['note', 'appel', 'email', 'reunion', 'relance'];

// ── Helpers ───────────────────────────────────────────────────────────────

function fullName(lead: Lead) {
  return `${lead.firstName} ${lead.lastName}`.trim();
}

function initials(lead: Lead) {
  return `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`.toUpperCase();
}

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso + (iso.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function isOverdue(date?: string) {
  if (!date) return false;
  return new Date(date + 'T00:00:00') < new Date(new Date().toDateString());
}

// ── Modal edit inline ─────────────────────────────────────────────────────

function inputStyle(hasError = false) {
  return `w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none transition-all ${
    hasError
      ? 'border-red-500/50 focus:border-red-500'
      : 'border-white/[0.08] focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20'
  }`;
}

// ── Main component ────────────────────────────────────────────────────────

interface LeadDetailViewProps {
  id: string;
  mode: 'prospect' | 'client';
}

export function LeadDetailView({ id, mode }: LeadDetailViewProps) {
  const router = useRouter();
  const backHref = mode === 'client' ? '/admin/clients' : '/admin/leads';
  const backLabel = mode === 'client' ? '← Clients' : '← Prospects';

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Note form
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>('note');
  const [noteContent, setNoteContent] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [editSaving, setEditSaving] = useState(false);

  // Delete / convert dialogs
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmConvert, setConfirmConvert] = useState(false);
  const [converting, setConverting] = useState(false);

  // Fetch
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadRes, notesRes] = await Promise.all([
        fetch(`/api/admin/leads/${id}`),
        fetch(`/api/admin/leads/${id}/notes`),
      ]);
      if (leadRes.ok) {
        const data = await leadRes.json();
        setLead(data.lead);
        setEditForm(data.lead);
      }
      if (notesRes.ok) {
        const data = await notesRes.json();
        setNotes(data.notes);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Add note
  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setNoteSubmitting(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: noteType, content: noteContent }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setNotes((prev) => [data.note, ...prev]);
      setNoteContent('');
      setNoteOpen(false);
      setToast({ message: 'Note ajoutée.', type: 'success' });
    } catch {
      setToast({ message: "Erreur lors de l'ajout.", type: 'error' });
    } finally { setNoteSubmitting(false); }
  };

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/admin/leads/${id}/notes/${noteId}`, { method: 'DELETE' });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch {
      setToast({ message: 'Erreur suppression note.', type: 'error' });
    }
  };

  // Inline status change
  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    const prev = lead.status;
    setLead((l) => l ? { ...l, status } : l);
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      setLead((l) => l ? { ...l, status: prev } : l);
      setToast({ message: 'Erreur mise à jour.', type: 'error' });
    }
  };

  // Inline priority change
  const handlePriorityChange = async (priority: LeadPriority | '') => {
    if (!lead) return;
    const prev = lead.priority;
    const newVal = priority || undefined;
    setLead((l) => l ? { ...l, priority: newVal } : l);
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newVal ?? null }),
      });
    } catch {
      setLead((l) => l ? { ...l, priority: prev } : l);
      setToast({ message: 'Erreur mise à jour.', type: 'error' });
    }
  };

  // Save edit
  const handleEditSave = async () => {
    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setLead(data.lead);
      setEditOpen(false);
      setToast({ message: 'Informations mises à jour.', type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la sauvegarde.', type: 'error' });
    } finally { setEditSaving(false); }
  };

  // Delete lead
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      router.push(backHref);
    } catch {
      setToast({ message: 'Erreur lors de la suppression.', type: 'error' });
      setDeleting(false);
    }
  };

  // Convert to client
  const handleConvert = async () => {
    setConverting(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}/convert`, { method: 'POST' });
      if (!res.ok) throw new Error('Erreur serveur');
      router.push(`/admin/clients/${id}`);
    } catch {
      setToast({ message: 'Erreur lors de la conversion.', type: 'error' });
      setConverting(false);
      setConfirmConvert(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-tertiary gap-3">
        <p className="text-lg font-semibold text-ink-primary">Fiche introuvable</p>
        <button onClick={() => router.push(backHref)}
          className="text-sm text-brand-teal hover:underline">{backLabel}</button>
      </div>
    );
  }

  const sc = STATUS_CONFIG[lead.status];
  const pc = lead.priority ? PRIORITY_CONFIG[lead.priority] : null;
  const overdue = isOverdue(lead.nextActionDate);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer cette fiche"
        message={`Supprimer définitivement la fiche de ${fullName(lead)} — ${lead.company} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={confirmConvert}
        title="Convertir en client"
        message={`Convertir ${fullName(lead)} (${lead.company}) en client ? La fiche sera déplacée dans la section Clients.`}
        confirmLabel="Convertir"
        variant="warning"
        loading={converting}
        onConfirm={handleConvert}
        onCancel={() => setConfirmConvert(false)}
      />

      {/* Back + actions header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button onClick={() => router.push(backHref)}
          className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditForm(lead); setEditOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:text-ink-primary hover:bg-white/[0.08] transition-all cursor-pointer">
            <Edit3 className="w-4 h-4" /> Modifier
          </button>
          {mode === 'prospect' && !lead.isClient && (
            <button onClick={() => setConfirmConvert(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer">
              <UserPlus className="w-4 h-4" /> Convertir en client
            </button>
          )}
          {lead.isClient && mode === 'prospect' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400">
              <UserCheck className="w-4 h-4" /> Client
            </span>
          )}
          <button onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white">{initials(lead)}</span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-ink-primary">{fullName(lead)}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
              <span className="text-ink-secondary font-medium">{lead.company}</span>
              {lead.sector && <span className="text-xs text-ink-tertiary bg-white/[0.06] px-2 py-0.5 rounded-full">{lead.sector}</span>}
            </div>
            {/* Quick links */}
            <div className="flex flex-wrap gap-3 mt-3">
              {lead.email && (
                <a href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-brand-teal transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </a>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-brand-teal transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {lead.phone}
                </a>
              )}
              {lead.website && (
                <a href={lead.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-brand-teal transition-colors">
                  <Globe className="w-3.5 h-3.5" /> {lead.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${sc.bg} ${sc.color}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.dot }} />
              {sc.label}
            </span>
            {pc && (
              <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${pc.bg} ${pc.color}`}>
                {pc.label}
              </span>
            )}
            {lead.isClient && (
              <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400">
                <UserCheck className="w-4 h-4" /> Client
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* LEFT — Notes timeline */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="font-semibold text-ink-primary flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-teal" />
                Historique & Interactions
                <span className="text-xs font-normal text-ink-tertiary">({notes.length})</span>
              </h2>
              <button onClick={() => setNoteOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 transition-all cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>

            {/* Add note form */}
            {noteOpen && (
              <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                {/* Type selector */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {NOTE_TYPES.map((t) => {
                    const nc = NOTE_CONFIG[t];
                    return (
                      <button key={t} onClick={() => setNoteType(t)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          noteType === t ? `${nc.bg} ${nc.color} ring-1 ring-current/30` : 'bg-white/[0.04] text-ink-tertiary hover:bg-white/[0.08]'
                        }`}>
                        <nc.icon className="w-3 h-3" />
                        {nc.label}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={`Ajouter une note de type "${NOTE_CONFIG[noteType].label}"...`}
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 resize-none transition-all"
                />
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button onClick={() => { setNoteOpen(false); setNoteContent(''); }}
                    className="px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer">
                    Annuler
                  </button>
                  <button onClick={handleAddNote} disabled={!noteContent.trim() || noteSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-brand-teal to-brand-purple text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer">
                    {noteSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enregistrement...</> : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {/* Feed */}
            <div className="divide-y divide-white/[0.04]">
              {notes.length === 0 && !noteOpen && (
                <div className="flex flex-col items-center justify-center py-12 text-ink-tertiary">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">Aucune interaction enregistrée</p>
                  <button onClick={() => setNoteOpen(true)}
                    className="mt-3 text-xs text-brand-teal hover:underline cursor-pointer">
                    Ajouter la première note
                  </button>
                </div>
              )}
              {notes.map((note) => {
                const nc = NOTE_CONFIG[note.type];
                const NoteIcon = nc.icon;
                return (
                  <div key={note.id} className="flex gap-4 px-6 py-4 group hover:bg-white/[0.02] transition-colors">
                    <div className={`w-8 h-8 rounded-full ${nc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <NoteIcon className={`w-4 h-4 ${nc.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-xs font-semibold ${nc.color}`}>{nc.label}</span>
                          <span className="text-xs text-ink-tertiary ml-2">{formatDateTime(note.createdAt)}</span>
                        </div>
                        <button onClick={() => handleDeleteNote(note.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm text-ink-primary mt-1 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Info cards */}
        <div className="space-y-4">

          {/* CRM Card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider flex items-center gap-2">
              <Flag className="w-3.5 h-3.5" /> CRM
            </h3>

            {/* Status inline select */}
            <div>
              <p className="text-xs text-ink-tertiary mb-1.5">Statut</p>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-teal/50 transition-colors cursor-pointer ${sc.color}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-dark-surface text-ink-primary">
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority inline select */}
            <div>
              <p className="text-xs text-ink-tertiary mb-1.5">Priorité</p>
              <select
                value={lead.priority ?? ''}
                onChange={(e) => handlePriorityChange(e.target.value as LeadPriority | '')}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-teal/50 transition-colors cursor-pointer text-ink-primary"
              >
                <option value="" className="bg-dark-surface">— Non définie —</option>
                <option value="low" className="bg-dark-surface">Basse</option>
                <option value="medium" className="bg-dark-surface">Moyenne</option>
                <option value="high" className="bg-dark-surface">Haute</option>
              </select>
            </div>

            {/* Source */}
            {lead.source && (
              <div>
                <p className="text-xs text-ink-tertiary mb-1">Source</p>
                <p className="text-sm text-ink-primary">{SOURCE_LABELS[lead.source] ?? lead.source}</p>
              </div>
            )}

            {/* Next action */}
            {(lead.nextAction || lead.nextActionDate) && (
              <div className={`rounded-xl p-3 ${overdue ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/[0.04] border border-white/[0.06]'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {overdue
                    ? <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    : <Calendar className="w-3.5 h-3.5 text-brand-teal" />}
                  <span className={`text-xs font-semibold ${overdue ? 'text-red-400' : 'text-brand-teal'}`}>
                    Prochaine action {overdue ? '— En retard' : ''}
                  </span>
                </div>
                {lead.nextAction && <p className="text-sm text-ink-primary">{lead.nextAction}</p>}
                {lead.nextActionDate && (
                  <p className={`text-xs mt-0.5 ${overdue ? 'text-red-300' : 'text-ink-tertiary'}`}>
                    {formatDate(lead.nextActionDate)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Contact info card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Contact
            </h3>
            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                <a href={`mailto:${lead.email}`} className="text-ink-primary hover:text-brand-teal transition-colors truncate">{lead.email}</a>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                <a href={`tel:${lead.phone}`} className="text-ink-primary hover:text-brand-teal transition-colors">{lead.phone}</a>
              </div>
            )}
            {lead.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-ink-tertiary flex-shrink-0 mt-0.5" />
                <span className="text-ink-secondary leading-relaxed">{lead.address}</span>
              </div>
            )}
            {lead.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                <a href={lead.website} target="_blank" rel="noopener noreferrer"
                  className="text-ink-primary hover:text-brand-teal transition-colors truncate">
                  {lead.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {lead.sector && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                <span className="text-ink-secondary">{lead.sector}</span>
              </div>
            )}
          </div>

          {/* Meta + contract card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Informations
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Créé le</span>
                <span className="text-ink-primary">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-tertiary">Modifié le</span>
                <span className="text-ink-primary">{formatDate(lead.updatedAt)}</span>
              </div>
              {lead.isClient && lead.clientSince && (
                <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Client depuis
                  </span>
                  <span className="text-emerald-400 font-medium">{formatDate(lead.clientSince)}</span>
                </div>
              )}
              {lead.contractValue && (
                <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-ink-tertiary">Valeur contrat</span>
                  <span className="text-ink-primary font-semibold">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(lead.contractValue)}
                  </span>
                </div>
              )}
              {lead.contractDate && (
                <div className="flex justify-between">
                  <span className="text-ink-tertiary">Signature</span>
                  <span className="text-ink-primary">{formatDate(lead.contractDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comment */}
          {lead.comment && (
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5">
              <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Commentaire
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed whitespace-pre-wrap">{lead.comment}</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative w-full max-w-2xl bg-dark-surface border border-white/[0.10] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-lg font-bold">Modifier — {lead.company}</h2>
              <button onClick={() => setEditOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <EditSection label="Identité">
                <div className="grid grid-cols-2 gap-3">
                  <EditField label="Prénom">
                    <input value={editForm.firstName ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                      className={inputStyle()} placeholder="Jean" />
                  </EditField>
                  <EditField label="Nom">
                    <input value={editForm.lastName ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                      className={inputStyle()} placeholder="Dupont" />
                  </EditField>
                </div>
              </EditSection>
              <EditSection label="Société">
                <div className="grid grid-cols-2 gap-3">
                  <EditField label="Nom de la société">
                    <input value={editForm.company ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))}
                      className={inputStyle()} placeholder="ACME Corp" />
                  </EditField>
                  <EditField label="Secteur">
                    <input value={editForm.sector ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, sector: e.target.value }))}
                      className={inputStyle()} placeholder="Retail, Construction..." />
                  </EditField>
                  <EditField label="Site web" className="col-span-2">
                    <input value={editForm.website ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, website: e.target.value }))}
                      className={inputStyle()} placeholder="https://..." />
                  </EditField>
                </div>
              </EditSection>
              <EditSection label="Contact">
                <div className="grid grid-cols-2 gap-3">
                  <EditField label="Email">
                    <input type="email" value={editForm.email ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputStyle()} />
                  </EditField>
                  <EditField label="Téléphone">
                    <input value={editForm.phone ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                      className={inputStyle()} />
                  </EditField>
                  <EditField label="Adresse" className="col-span-2">
                    <input value={editForm.address ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                      className={inputStyle()} />
                  </EditField>
                </div>
              </EditSection>
              <EditSection label="CRM">
                <div className="grid grid-cols-2 gap-3">
                  <EditField label="Prochaine action">
                    <input value={editForm.nextAction ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, nextAction: e.target.value }))}
                      className={inputStyle()} placeholder="Envoyer la proposition..." />
                  </EditField>
                  <EditField label="Date de relance">
                    <input type="date" value={editForm.nextActionDate ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, nextActionDate: e.target.value }))}
                      className={inputStyle()} />
                  </EditField>
                </div>
              </EditSection>
              <EditSection label="Commercial">
                <div className="grid grid-cols-2 gap-3">
                  <EditField label="Valeur contrat (€)">
                    <input type="number" value={editForm.contractValue ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, contractValue: e.target.value ? Number(e.target.value) : undefined }))}
                      className={inputStyle()} placeholder="5000" />
                  </EditField>
                  <EditField label="Date de signature">
                    <input type="date" value={editForm.contractDate ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, contractDate: e.target.value }))}
                      className={inputStyle()} />
                  </EditField>
                </div>
              </EditSection>
              <EditField label="Commentaire">
                <textarea value={editForm.comment ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, comment: e.target.value }))}
                  rows={3} className={inputStyle() + ' resize-y'} placeholder="Notes internes..." />
              </EditField>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
              <button onClick={() => setEditOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer">
                Annuler
              </button>
              <button onClick={handleEditSave} disabled={editSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer">
                {editSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Edit helpers ──────────────────────────────────────────────────────────

function EditSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-3">{label}</legend>
      {children}
    </fieldset>
  );
}

function EditField({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-ink-secondary">{label}</label>
      {children}
    </div>
  );
}
