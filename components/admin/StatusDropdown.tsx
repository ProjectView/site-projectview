'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, Check, AlertTriangle } from 'lucide-react';
import type { ArticleStatus } from '@/lib/fallback-data';
import { CustomDatePicker } from '@/components/admin/CustomDatePicker';

// ── Status config ────────────────────────────────────────────────────────────
export interface StatusConfig {
  label: string;
  color: string;       // text color class
  bg: string;          // background class
  ring: string;        // ring class
  dot: string;         // dot bg class (inline style hex)
}

export const STATUS_CONFIG: Record<ArticleStatus, StatusConfig> = {
  'publie': {
    label: 'Publié',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/25',
    dot: '#34d399',
  },
  'mis-en-avant': {
    label: 'Mis en avant',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    ring: 'ring-yellow-500/25',
    dot: '#facc15',
  },
  'programme': {
    label: 'Programmé',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    ring: 'ring-sky-500/25',
    dot: '#38bdf8',
  },
  'en-cours': {
    label: 'En cours',
    color: 'text-brand-teal',
    bg: 'bg-brand-teal/10',
    ring: 'ring-brand-teal/25',
    dot: '#3B7A8C',
  },
  'brouillon': {
    label: 'Brouillon',
    color: 'text-ink-secondary',
    bg: 'bg-white/[0.04]',
    ring: 'ring-white/10',
    dot: '#8B8B8E',
  },
  'proposition': {
    label: 'Proposition',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/25',
    dot: '#a78bfa',
  },
  'invisible': {
    label: 'Invisible',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    ring: 'ring-red-500/20',
    dot: '#f87171',
  },
};

const STATUS_ORDER: ArticleStatus[] = [
  'publie',
  'mis-en-avant',
  'programme',
  'en-cours',
  'brouillon',
  'proposition',
  'invisible',
];

// ── Component ────────────────────────────────────────────────────────────────
interface StatusDropdownProps {
  slug: string;
  currentStatus: ArticleStatus;
  scheduledDate?: string;
  featuredCount: number; // total current "mis-en-avant" in the list
  onStatusChange: (slug: string, status: ArticleStatus, scheduledDate?: string) => void;
}

export function StatusDropdown({
  slug,
  currentStatus,
  scheduledDate,
  featuredCount,
  onStatusChange,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ArticleStatus | null>(null);
  const [pickedDate, setPickedDate] = useState<string>(scheduledDate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function openDropdown() {
    setOpen(true);
    setPendingStatus(null);
    setPickedDate(scheduledDate ?? '');
    setError(null);
  }

  function closeDropdown() {
    setOpen(false);
    setPendingStatus(null);
    setError(null);
  }

  function handleStatusClick(status: ArticleStatus) {
    if (status === currentStatus) {
      closeDropdown();
      return;
    }
    if (status === 'programme') {
      // Show date picker inline before confirming
      setPendingStatus('programme');
      setPickedDate(scheduledDate ?? '');
      return;
    }
    // For all other statuses, apply immediately
    applyStatus(status);
  }

  async function applyStatus(status: ArticleStatus, date?: string) {
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { status };
      if (status === 'programme' && date) body.scheduledDate = date;

      const res = await fetch(`/api/admin/articles/${slug}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Erreur lors de la mise à jour');
        return;
      }

      onStatusChange(slug, status, date);
      closeDropdown();
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  }

  function handleConfirmSchedule() {
    if (!pickedDate) {
      setError('Veuillez sélectionner une date.');
      return;
    }
    applyStatus('programme', pickedDate);
  }

  const cfg = STATUS_CONFIG[currentStatus];

  // Can the user select "mis-en-avant"?
  // Only disabled if featuredCount >= 3 AND current article is not already mis-en-avant
  const featuredDisabled =
    currentStatus !== 'mis-en-avant' && featuredCount >= 3;

  return (
    <div ref={ref} className="relative">
      {/* Trigger badge */}
      <button
        type="button"
        onClick={open ? closeDropdown : openDropdown}
        disabled={saving}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 transition-all cursor-pointer
          ${cfg.bg} ${cfg.color} ${cfg.ring}
          hover:ring-2 hover:brightness-110
          disabled:opacity-60 disabled:cursor-not-allowed`}
        title="Changer le statut"
      >
        {saving ? (
          <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
        ) : (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: cfg.dot }}
          />
        )}
        <span className="leading-none">{cfg.label}</span>
        <ChevronDown
          className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 min-w-[220px]">
          <div className="rounded-2xl border border-white/[0.10] bg-dark-elevated shadow-2xl overflow-hidden">
            {/* Status list */}
            <div className="p-1.5">
              {STATUS_ORDER.map((status) => {
                const s = STATUS_CONFIG[status];
                const isActive = status === currentStatus;
                const isDisabled = status === 'mis-en-avant' && featuredDisabled;

                return (
                  <button
                    key={status}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleStatusClick(status)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all
                      ${isActive
                        ? `${s.bg} ${s.color} font-semibold`
                        : isDisabled
                        ? 'text-ink-tertiary/40 cursor-not-allowed'
                        : 'text-ink-secondary hover:bg-white/[0.05] hover:text-ink-primary cursor-pointer'
                      }`}
                    title={isDisabled ? 'Maximum 3 articles "Mis en avant" atteint' : undefined}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isDisabled ? '#5C5C5F' : s.dot }}
                    />
                    <span className="flex-1">{s.label}</span>
                    {isActive && <Check className={`w-3.5 h-3.5 flex-shrink-0 ${s.color}`} />}
                    {isDisabled && (
                      <span className="text-[10px] text-ink-tertiary/60 leading-none">max 3</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Inline date picker for "Programmé" */}
            {pendingStatus === 'programme' && (
              <>
                <div className="border-t border-white/[0.06] px-3 pt-3 pb-1">
                  <p className="text-[11px] text-ink-tertiary font-medium uppercase tracking-wider mb-2">
                    Date de publication
                  </p>
                  <CustomDatePicker value={pickedDate} onChange={setPickedDate} />
                </div>

                {/* Error */}
                {error && (
                  <div className="mx-3 mb-2 flex items-center gap-1.5 text-[11px] text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Confirm / Cancel */}
                <div className="flex gap-2 p-3 pt-1">
                  <button
                    type="button"
                    onClick={closeDropdown}
                    className="flex-1 py-2 rounded-xl text-xs text-ink-secondary hover:text-ink-primary hover:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={!pickedDate || saving}
                    onClick={handleConfirmSchedule}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30
                      hover:bg-sky-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      'Programmer'
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Error (non-schedule) */}
            {error && pendingStatus !== 'programme' && (
              <div className="px-3 pb-3 flex items-center gap-1.5 text-[11px] text-red-400">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
