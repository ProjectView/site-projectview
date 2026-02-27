'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── French locale data ──────────────────────────────────────────────────────
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAYS_FR = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

// Monday-first index: Mon=0 … Sun=6
function getMondayIndex(dayIndex: number): number {
  return (dayIndex + 6) % 7;
}

interface CustomDatePickerProps {
  value: string; // ISO date: YYYY-MM-DD or ''
  onChange: (date: string) => void;
}

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Derive initial view from value or today
  const initialDate = useMemo(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return { year: y, month: m - 1 };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [viewYear, setViewYear] = useState(initialDate.year);
  const [viewMonth, setViewMonth] = useState(initialDate.month);

  // Build calendar grid (6 weeks × 7 days, Monday-first)
  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = getMondayIndex(firstOfMonth.getDay()); // days to pad at start
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    const cells: (Date | null)[] = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startOffset + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        cells.push(null);
      } else {
        cells.push(new Date(viewYear, viewMonth, dayNumber));
      }
    }
    return cells;
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function handleSelectDay(date: Date) {
    if (date < today) return; // past — disabled
    onChange(toISO(date));
  }

  const selectedISO = value;

  return (
    <div className="w-64 bg-dark-elevated border border-white/[0.10] rounded-2xl shadow-xl p-4 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-ink-primary">
          {MONTHS_FR[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all"
          aria-label="Mois suivant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_FR.map((d) => (
          <div
            key={d}
            className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {calendarDays.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="h-8" />;
          }

          const iso = toISO(date);
          const isPast = date < today;
          const isToday = iso === toISO(today);
          const isSelected = iso === selectedISO;

          let cellClass =
            'h-8 w-full flex items-center justify-center rounded-lg text-xs font-medium transition-all ';

          if (isSelected) {
            cellClass += 'bg-brand-teal text-white font-semibold shadow-[0_0_12px_rgba(59,122,140,0.5)]';
          } else if (isPast) {
            cellClass += 'text-ink-tertiary/40 cursor-not-allowed';
          } else if (isToday) {
            cellClass +=
              'text-brand-teal ring-1 ring-brand-teal/50 font-semibold cursor-pointer hover:bg-brand-teal/10';
          } else {
            cellClass +=
              'text-ink-secondary cursor-pointer hover:bg-white/[0.06] hover:text-ink-primary';
          }

          return (
            <button
              key={iso}
              type="button"
              disabled={isPast}
              onClick={() => handleSelectDay(date)}
              className={cellClass}
              aria-label={`Sélectionner le ${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`}
              aria-pressed={isSelected}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selected date display */}
      {selectedISO && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] text-center">
          <span className="text-xs text-ink-secondary">
            Programmé le{' '}
            <span className="text-brand-teal font-semibold">
              {new Date(selectedISO + 'T00:00:00').toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
