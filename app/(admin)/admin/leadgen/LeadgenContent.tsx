'use client';

import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import {
  Zap, Search, Upload, Mail, Send, RefreshCw, Plus, Trash2,
  Copy, Edit3, X, Loader2, CheckCircle2, AlertCircle, ChevronDown,
  ChevronUp, Users, FileText, Clock, Building2,
} from 'lucide-react';
import { Toast, ToastType } from '@/components/admin/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { EmailSequence, SequenceRun, SequenceEmail } from '@/lib/firestore-sequences';

// ── Types ─────────────────────────────────────────────────────────────────

interface HunterEmail {
  firstName: string;
  lastName: string;
  value: string;
  position: string;
  confidence: number;
  linkedin: string | null;
}

interface SireneCompany {
  siret: string;
  name: string;
  sector: string;
  city: string;
  postalCode: string;
  employees: string;
  guessDomain: string;
}

type Tab = 'importer' | 'sequences' | 'envois';

// ── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function inputCls(err = false) {
  return `w-full bg-white/[0.04] border rounded-lg px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none transition-all ${
    err ? 'border-red-500/50' : 'border-white/[0.08] focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20'
  }`;
}

// ── CSV Parsing ───────────────────────────────────────────────────────────

type CsvRow = Record<string, string>;

function parseCsv(text: string): { headers: string[]; rows: CsvRow[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(sep).map((v) => v.trim().replace(/^["']|["']$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
  return { headers, rows };
}

const CSV_FIELD_LABELS: Record<string, string> = {
  firstName: 'Prénom', lastName: 'Nom', email: 'Email', company: 'Société',
  phone: 'Téléphone', sector: 'Secteur', address: 'Adresse',
};
const CSV_FIELDS = Object.keys(CSV_FIELD_LABELS);

function autoMapHeaders(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const patterns: Record<string, RegExp> = {
    firstName: /pr.nom|first.?name|fname|given/i,
    lastName: /^nom$|last.?name|lname|family|surname/i,
    email: /email|e-mail|mail/i,
    company: /soci.t.|company|entreprise|org|organisation/i,
    phone: /t.l.|phone|mobile|portable/i,
    sector: /secteur|sector|industrie|industry|activit/i,
    address: /adresse|address|ville|city/i,
  };
  for (const header of headers) {
    for (const [field, regex] of Object.entries(patterns)) {
      if (regex.test(header) && !mapping[field]) {
        mapping[field] = header;
      }
    }
  }
  return mapping;
}

// ── Sector chips ──────────────────────────────────────────────────────────

const SECTOR_CHIPS = [
  { label: 'Installateur solaire',  q: 'installateur panneaux solaires',       icon: '☀️' },
  { label: 'Cuisiniste / Showroom', q: 'cuisiniste showroom cuisine',           icon: '🍳' },
  { label: 'Agence immobilière',    q: 'agence immobilière',                   icon: '🏠' },
  { label: 'Promoteur immobilier',  q: 'promoteur immobilier construction',     icon: '🏗️' },
  { label: 'Architecte',           q: 'cabinet architecture architecte',       icon: '📐' },
  { label: 'Retail / Mode',         q: 'boutique prêt-à-porter enseigne mode', icon: '👗' },
  { label: 'Concessionnaire auto',  q: 'concessionnaire automobile',           icon: '🚗' },
  { label: 'Centre commercial',     q: 'centre commercial galerie',            icon: '🛍️' },
  { label: 'Salle de sport',        q: 'salle de sport fitness',               icon: '💪' },
  { label: 'Hôtel',                 q: 'hôtel hébergement',                    icon: '🏨' },
  { label: 'Coworking',             q: 'espace coworking bureau partagé',      icon: '💼' },
  { label: 'ESN / IT / Conseil',    q: 'entreprise services numériques IT',    icon: '💻' },
  { label: 'Aménagement intérieur', q: 'décorateur intérieur agencement',      icon: '🛋️' },
  { label: 'Santé / Clinique',      q: 'clinique cabinet médical',             icon: '🏥' },
  { label: 'Paysagiste / BTP',      q: 'paysagiste entreprise bâtiment',       icon: '🌿' },
];

// ── Main Component ────────────────────────────────────────────────────────

export function LeadgenContent() {
  const [tab, setTab] = useState<Tab>('importer');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="w-6 h-6 text-brand-orange" />
          Leadgen
        </h1>
        <p className="text-ink-secondary text-sm mt-1">
          Trouvez, importez et contactez vos prospects directement depuis le back-office.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit">
        {([
          { key: 'importer', label: 'Importer', icon: Upload },
          { key: 'sequences', label: 'Séquences email', icon: Mail },
          { key: 'envois', label: 'Envois', icon: Send },
        ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              tab === key
                ? 'bg-white/[0.10] text-ink-primary shadow-sm'
                : 'text-ink-tertiary hover:text-ink-secondary'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'importer' && <ImportTab setToast={setToast} />}
      {tab === 'sequences' && <SequencesTab setToast={setToast} />}
      {tab === 'envois' && <EnvoisTab setToast={setToast} />}
    </div>
  );
}

// ── Import Tab ────────────────────────────────────────────────────────────

function ImportTab({ setToast }: { setToast: (t: { message: string; type: ToastType } | null) => void }) {
  const [prefillDomain, setPrefillDomain] = useState('');
  const hunterRef = useRef<HTMLDivElement>(null);

  const handleSelectDomain = (domain: string) => {
    setPrefillDomain(domain);
    setTimeout(() => {
      hunterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="space-y-6">
      <SireneSection setToast={setToast} onSelectDomain={handleSelectDomain} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HunterSection ref={hunterRef} setToast={setToast} prefillDomain={prefillDomain} />
        <CsvSection setToast={setToast} />
      </div>
    </div>
  );
}

// Hunter.io section
const HunterSection = forwardRef<HTMLDivElement, {
  setToast: (t: { message: string; type: ToastType } | null) => void;
  prefillDomain?: string;
}>(function HunterSection({ setToast, prefillDomain }, ref) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HunterEmail[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (prefillDomain) setDomain(prefillDomain);
  }, [prefillDomain]);

  const handleSearch = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setResults([]);
    setSelected(new Set());
    setSearched(true);
    try {
      const res = await fetch('/api/admin/leadgen/hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim(), limit: 10 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur Hunter.io');
      setResults(data.emails);
      if (data.emails.length === 0) setToast({ message: 'Aucun email trouvé pour ce domaine.', type: 'info' });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Erreur', type: 'error' });
    } finally { setLoading(false); }
  };

  const toggleSelect = (email: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
  };

  const handleImport = async () => {
    const toImport = results.filter((r) => selected.has(r.value));
    if (!toImport.length) return;
    setImporting(true);
    let imported = 0;
    for (const email of toImport) {
      try {
        const res = await fetch('/api/admin/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: email.firstName || 'Inconnu',
            lastName: email.lastName || '',
            email: email.value,
            company: domain,
            phone: '',
            source: 'cold',
            priority: 'medium',
            comment: email.position ? `Poste : ${email.position}` : '',
          }),
        });
        if (res.ok) imported++;
      } catch { /* skip */ }
    }
    setToast({ message: `${imported} prospect${imported > 1 ? 's' : ''} importé${imported > 1 ? 's' : ''} dans le CRM.`, type: 'success' });
    setSelected(new Set());
    setImporting(false);
  };

  return (
    <div ref={ref} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-ink-primary flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-teal" />
          Trouver les emails (Hunter.io)
        </h2>
        <p className="text-xs text-ink-tertiary mt-1">Hunter.io — 25 recherches gratuites/mois</p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <input
            value={domain}
            onChange={(e) => { setDomain(e.target.value); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="acme.fr, entreprise.com..."
            className={inputCls()}
          />
          {prefillDomain && domain === prefillDomain && (
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Domaine suggéré depuis SIRENE — vérifiez avant de lancer
            </p>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !domain.trim()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 disabled:opacity-50 transition-all cursor-pointer flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Chercher
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-tertiary">{results.length} email{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}</span>
            <button onClick={() => setSelected(results.length === selected.size ? new Set() : new Set(results.map((r) => r.value)))}
              className="text-xs text-brand-teal hover:underline cursor-pointer">
              {selected.size === results.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {results.map((r) => (
              <div
                key={r.value}
                onClick={() => toggleSelect(r.value)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selected.has(r.value)
                    ? 'bg-brand-teal/10 border-brand-teal/30'
                    : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                  selected.has(r.value) ? 'bg-brand-teal border-brand-teal' : 'border-white/20'
                }`}>
                  {selected.has(r.value) && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary">
                    {r.firstName} {r.lastName}
                    {r.position && <span className="text-ink-tertiary font-normal ml-1">— {r.position}</span>}
                  </p>
                  <p className="text-xs text-ink-secondary truncate">{r.value}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  r.confidence >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                  r.confidence >= 70 ? 'bg-amber-500/10 text-amber-400' :
                  'bg-white/[0.06] text-ink-tertiary'
                }`}>{r.confidence}%</span>
              </div>
            ))}
          </div>
          {selected.size > 0 && (
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-teal to-brand-purple text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {importing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Import en cours...</>
                : <><Users className="w-4 h-4" /> Importer {selected.size} prospect{selected.size > 1 ? 's' : ''}</>}
            </button>
          )}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-8 text-ink-tertiary">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucun email trouvé pour ce domaine</p>
        </div>
      )}
    </div>
  );
});

// ── SIRENE section ────────────────────────────────────────────────────────

function SireneSection({ setToast, onSelectDomain }: {
  setToast: (t: { message: string; type: ToastType } | null) => void;
  onSelectDomain: (domain: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<SireneCompany[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (p = 1) => {
    const q = (query.trim() + (city.trim() ? ` ${city.trim()}` : '')).trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ q, page: String(p) });
      const res = await fetch(`/api/admin/leadgen/sirene?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur SIRENE');
      setCompanies(data.companies);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Erreur', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-ink-primary flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-green" />
          Découvrir des entreprises
        </h2>
        <p className="text-xs text-ink-tertiary mt-1">
          Base SIRENE (api.gouv.fr) — 100% gratuit, entreprises françaises actives
        </p>
      </div>

      {/* Sector chips */}
      <div className="flex flex-wrap gap-1.5">
        {SECTOR_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => setQuery(chip.q)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              query === chip.q
                ? 'bg-brand-green/15 border-brand-green/40 text-brand-green'
                : 'bg-white/[0.04] border-white/[0.08] text-ink-secondary hover:border-white/[0.20] hover:text-ink-primary'
            }`}
          >
            <span>{chip.icon}</span>
            {chip.label}
          </button>
        ))}
      </div>

      {/* Search row */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Secteur ou type d'entreprise..."
          className={inputCls() + ' flex-1'}
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ville (optionnel)"
          className={inputCls() + ' w-36 flex-shrink-0'}
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-green/10 text-brand-green hover:bg-brand-green/20 disabled:opacity-50 transition-all cursor-pointer flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Rechercher
        </button>
      </div>

      {/* Results table */}
      {companies.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-ink-tertiary">
            {total.toLocaleString('fr-FR')} entreprise{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''} — page {page}/{totalPages}
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="text-xs w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.04]">
                  <th className="px-3 py-2.5 text-left text-ink-tertiary font-medium">Nom</th>
                  <th className="px-3 py-2.5 text-left text-ink-tertiary font-medium hidden md:table-cell">Secteur</th>
                  <th className="px-3 py-2.5 text-left text-ink-tertiary font-medium">Ville</th>
                  <th className="px-3 py-2.5 text-left text-ink-tertiary font-medium hidden sm:table-cell">Effectif</th>
                  <th className="px-3 py-2.5 text-left text-ink-tertiary font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {companies.map((c) => (
                  <tr key={c.siret} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-3 max-w-[180px]">
                      <p className="font-medium text-ink-primary truncate">{c.name}</p>
                      <p className="text-ink-tertiary font-mono text-[11px] truncate">{c.guessDomain}</p>
                    </td>
                    <td className="px-3 py-3 text-ink-secondary hidden md:table-cell max-w-[160px]">
                      <span className="line-clamp-2 leading-snug">{c.sector}</span>
                    </td>
                    <td className="px-3 py-3 text-ink-secondary whitespace-nowrap">
                      {c.city}{c.postalCode ? ` (${c.postalCode.slice(0, 2)})` : ''}
                    </td>
                    <td className="px-3 py-3 text-ink-tertiary hidden sm:table-cell whitespace-nowrap">
                      {c.employees || '—'}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => onSelectDomain(c.guessDomain)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Search className="w-3 h-3" />→ Hunter.io
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleSearch(page - 1)}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg text-xs text-ink-secondary bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] disabled:opacity-40 transition-all cursor-pointer"
              >
                ← Précédent
              </button>
              <span className="text-xs text-ink-tertiary">Page {page} / {totalPages}</span>
              <button
                onClick={() => handleSearch(page + 1)}
                disabled={page >= totalPages || loading}
                className="px-3 py-1.5 rounded-lg text-xs text-ink-secondary bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] disabled:opacity-40 transition-all cursor-pointer"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      )}

      {searched && !loading && companies.length === 0 && (
        <div className="text-center py-8 text-ink-tertiary">
          <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucune entreprise trouvée pour cette recherche</p>
        </div>
      )}
    </div>
  );
}

// CSV section
function CsvSection({ setToast }: { setToast: (t: { message: string; type: ToastType } | null) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers: h, rows: r } = parseCsv(text);
      setHeaders(h);
      setRows(r);
      setMapping(autoMapHeaders(h));
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) processFile(file);
    else setToast({ message: 'Veuillez déposer un fichier .csv', type: 'error' });
  };

  const handleImport = async () => {
    if (!rows.length) return;
    setImporting(true);
    let imported = 0;
    for (const row of rows) {
      const get = (field: string) => (mapping[field] ? row[mapping[field]] ?? '' : '');
      const email = get('email');
      const firstName = get('firstName') || 'Inconnu';
      const company = get('company') || 'Inconnu';
      if (!email) continue;
      try {
        const res = await fetch('/api/admin/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName: get('lastName'),
            email,
            company,
            phone: get('phone'),
            address: get('address'),
            sector: get('sector'),
            source: 'cold',
            priority: 'medium',
          }),
        });
        if (res.ok) imported++;
      } catch { /* skip */ }
    }
    setToast({ message: `${imported}/${rows.length} prospect${imported > 1 ? 's' : ''} importé${imported > 1 ? 's' : ''}.`, type: 'success' });
    setRows([]);
    setHeaders([]);
    setMapping({});
    setImporting(false);
  };

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-ink-primary flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-orange" />
          Import CSV
        </h2>
        <p className="text-xs text-ink-tertiary mt-1">Importez votre propre liste de prospects</p>
      </div>

      {rows.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-brand-orange/50 bg-brand-orange/5' : 'border-white/[0.12] hover:border-white/[0.22] hover:bg-white/[0.02]'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-ink-tertiary" />
          <p className="text-sm text-ink-secondary font-medium">Glissez votre CSV ici</p>
          <p className="text-xs text-ink-tertiary mt-1">ou cliquez pour choisir un fichier</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mapping */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-2">Correspondance des colonnes</p>
            <div className="grid grid-cols-2 gap-2">
              {CSV_FIELDS.map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-xs text-ink-tertiary">{CSV_FIELD_LABELS[field]}</label>
                  <select
                    value={mapping[field] ?? ''}
                    onChange={(e) => setMapping((m) => ({ ...m, [field]: e.target.value }))}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-ink-primary outline-none focus:border-brand-teal/50 cursor-pointer"
                  >
                    <option value="">— Ignorer —</option>
                    {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-2">
              Aperçu ({Math.min(rows.length, 5)}/{rows.length} lignes)
            </p>
            <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
              <table className="text-xs w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.04]">
                    {CSV_FIELDS.filter((f) => mapping[f]).map((f) => (
                      <th key={f} className="px-3 py-2 text-left text-ink-tertiary font-medium">{CSV_FIELD_LABELS[f]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      {CSV_FIELDS.filter((f) => mapping[f]).map((f) => (
                        <td key={f} className="px-3 py-2 text-ink-secondary truncate max-w-[120px]">
                          {row[mapping[f]] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setRows([]); setHeaders([]); setMapping({}); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer">
              <X className="w-4 h-4" /> Annuler
            </button>
            <button onClick={handleImport} disabled={importing}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-orange to-brand-teal text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer">
              {importing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Import...</>
                : <><Users className="w-4 h-4" /> Importer {rows.length} ligne{rows.length > 1 ? 's' : ''}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sequences Tab ─────────────────────────────────────────────────────────

function SequencesTab({ setToast }: { setToast: (t: { message: string; type: ToastType } | null) => void }) {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editSeq, setEditSeq] = useState<EmailSequence | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSequences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sequences');
      if (res.ok) setSequences((await res.json()).sequences);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSequences(); }, [fetchSequences]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/sequences/${deleteId}`, { method: 'DELETE' });
      setSequences((prev) => prev.filter((s) => s.id !== deleteId));
      setToast({ message: 'Séquence supprimée.', type: 'success' });
      setDeleteId(null);
    } catch {
      setToast({ message: 'Erreur lors de la suppression.', type: 'error' });
    } finally { setDeleting(false); }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sequences/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'duplicate' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSequences((prev) => [data.sequence, ...prev]);
        setToast({ message: 'Séquence dupliquée.', type: 'success' });
      }
    } catch {
      setToast({ message: 'Erreur duplication.', type: 'error' });
    }
  };

  const handleSave = (saved: EmailSequence) => {
    setSequences((prev) => {
      const exists = prev.find((s) => s.id === saved.id);
      return exists ? prev.map((s) => s.id === saved.id ? saved : s) : [saved, ...prev];
    });
    setToast({ message: editSeq ? 'Séquence mise à jour.' : 'Séquence créée.', type: 'success' });
    setEditorOpen(false);
    setEditSeq(null);
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer la séquence"
        message="Supprimer cette séquence email ? Cette action est irréversible."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-secondary">{sequences.length} séquence{sequences.length > 1 ? 's' : ''}</p>
        <button
          onClick={() => { setEditSeq(null); setEditorOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nouvelle séquence
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
        </div>
      )}

      {!loading && sequences.length === 0 && (
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] py-16 text-center text-ink-tertiary">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Aucune séquence créée</p>
          <button onClick={() => setEditorOpen(true)}
            className="mt-4 text-xs text-brand-teal hover:underline cursor-pointer">
            Créer la première séquence
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sequences.map((seq) => (
          <div key={seq.id} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 hover:border-white/[0.14] transition-all">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-ink-primary text-sm leading-tight">{seq.name}</h3>
                {seq.description && <p className="text-xs text-ink-tertiary mt-0.5 line-clamp-2">{seq.description}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setEditSeq(seq); setEditorOpen(true); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-tertiary hover:text-brand-teal hover:bg-brand-teal/10 transition-all cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDuplicate(seq.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-tertiary hover:text-brand-orange hover:bg-brand-orange/10 transition-all cursor-pointer">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteId(seq.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-tertiary">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {seq.emails.length} email{seq.emails.length > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                J+0 → J+{seq.emails[seq.emails.length - 1]?.delayDays ?? 0}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1">
              {seq.emails.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-ink-secondary">
                  <span className="text-brand-teal font-mono w-8 flex-shrink-0">J+{e.delayDays}</span>
                  <span className="truncate">{e.subject}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editorOpen && (
        <SequenceEditor
          sequence={editSeq}
          onClose={() => { setEditorOpen(false); setEditSeq(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ── Sequence Editor Modal ─────────────────────────────────────────────────

const VARIABLES = ['{{prenom}}', '{{nom}}', '{{societe}}', '{{email}}', '{{telephone}}'];

const EMPTY_EMAIL: SequenceEmail = { subject: '', body: '', delayDays: 0 };

function SequenceEditor({ sequence, onClose, onSave }: {
  sequence: EmailSequence | null;
  onClose: () => void;
  onSave: (s: EmailSequence) => void;
}) {
  const isEdit = !!sequence;
  const [name, setName] = useState(sequence?.name ?? '');
  const [description, setDescription] = useState(sequence?.description ?? '');
  const [emails, setEmails] = useState<SequenceEmail[]>(sequence?.emails ?? [{ ...EMPTY_EMAIL }]);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Requis';
    emails.forEach((em, i) => {
      if (!em.subject.trim()) e[`subject_${i}`] = 'Requis';
      if (!em.body.trim()) e[`body_${i}`] = 'Requis';
    });
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/sequences/${sequence!.id}` : '/api/admin/sequences';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), emails }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      onSave(data.sequence);
    } catch {
      setErrors({ _global: 'Erreur lors de la sauvegarde.' });
    } finally { setSaving(false); }
  };

  const addEmail = () => {
    const lastDelay = emails[emails.length - 1]?.delayDays ?? 0;
    setEmails((prev) => [...prev, { ...EMPTY_EMAIL, delayDays: lastDelay + 3 }]);
    setExpanded(emails.length);
  };

  const removeEmail = (i: number) => {
    setEmails((prev) => prev.filter((_, idx) => idx !== i));
    if (expanded >= i) setExpanded(Math.max(0, expanded - 1));
  };

  const updateEmail = (i: number, field: keyof SequenceEmail, value: string | number) => {
    setEmails((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
    setErrors((prev) => { const next = { ...prev }; delete next[`${field}_${i}`]; return next; });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-dark-surface border border-white/[0.10] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold">{isEdit ? 'Modifier la séquence' : 'Nouvelle séquence'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {errors._global && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" /> {errors._global}
            </div>
          )}

          {/* Variables hint */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-ink-tertiary">Variables :</span>
            {VARIABLES.map((v) => (
              <span key={v} className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-brand-teal border border-white/[0.08]">{v}</span>
            ))}
          </div>

          {/* Name + description */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-ink-secondary block mb-1.5">Nom de la séquence *</label>
              <input value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => { const n = { ...p }; delete n.name; return n; }); }}
                placeholder="Séquence Cold Retail..." className={inputCls(!!errors.name)} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-ink-secondary block mb-1.5">Description (optionnelle)</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Relance pour les enseignes retail..." className={inputCls()} />
            </div>
          </div>

          {/* Email steps */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary">Étapes ({emails.length})</p>
            {emails.map((em, i) => (
              <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                {/* Step header */}
                <div
                  onClick={() => setExpanded(expanded === i ? -1 : i)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-brand-teal font-semibold w-12">J+{em.delayDays}</span>
                    <span className="text-sm text-ink-primary truncate max-w-xs">{em.subject || 'Sans objet'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {emails.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); removeEmail(i); }}
                        className="w-6 h-6 flex items-center justify-center rounded text-ink-tertiary hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {expanded === i ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
                  </div>
                </div>
                {/* Step body */}
                {expanded === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06]">
                    <div className="grid grid-cols-4 gap-3 pt-3">
                      <div className="col-span-1">
                        <label className="text-xs font-medium text-ink-secondary block mb-1.5">Délai (jours)</label>
                        <input type="number" min={0} value={em.delayDays}
                          onChange={(e) => updateEmail(i, 'delayDays', Number(e.target.value))}
                          className={inputCls()} />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-medium text-ink-secondary block mb-1.5">Objet *</label>
                        <input value={em.subject} onChange={(e) => updateEmail(i, 'subject', e.target.value)}
                          placeholder="Objet de l'email..." className={inputCls(!!errors[`subject_${i}`])} />
                        {errors[`subject_${i}`] && <p className="text-xs text-red-400 mt-1">{errors[`subject_${i}`]}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink-secondary block mb-1.5">Corps *</label>
                      <textarea value={em.body} onChange={(e) => updateEmail(i, 'body', e.target.value)}
                        rows={6} placeholder={`Bonjour {{prenom}},\n\nJe me permets de vous contacter...`}
                        className={inputCls(!!errors[`body_${i}`]) + ' resize-y font-mono text-xs leading-relaxed'} />
                      {errors[`body_${i}`] && <p className="text-xs text-red-400 mt-1">{errors[`body_${i}`]}</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addEmail}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/[0.12] text-sm text-ink-tertiary hover:border-white/[0.24] hover:text-ink-secondary transition-all cursor-pointer w-full justify-center">
              <Plus className="w-4 h-4" /> Ajouter une étape
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</> : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Envois Tab ────────────────────────────────────────────────────────────

function EnvoisTab({ setToast }: { setToast: (t: { message: string; type: ToastType } | null) => void }) {
  const [runs, setRuns] = useState<SequenceRun[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRuns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sequences/runs');
      if (res.ok) setRuns((await res.json()).runs);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRuns(); }, [fetchRuns]);

  const handleResend = async (run: SequenceRun) => {
    try {
      const res = await fetch('/api/admin/sequences/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequenceId: run.sequenceId, leadIds: [run.leadId] }),
      });
      if (!res.ok) throw new Error('Erreur');
      setToast({ message: 'Séquence renvoyée à N8N.', type: 'success' });
      fetchRuns();
    } catch {
      setToast({ message: 'Erreur lors du renvoi.', type: 'error' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-secondary">{runs.length} envoi{runs.length > 1 ? 's' : ''}</p>
        <button onClick={fetchRuns} disabled={loading}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] transition-all cursor-pointer">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08]">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1.5fr_1.2fr_1fr_100px_160px_80px] px-6 py-3 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-ink-tertiary rounded-t-2xl">
          <span>Prospect</span>
          <span>Séquence</span>
          <span>Société</span>
          <span>Statut</span>
          <span>Envoyé le</span>
          <span></span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
          </div>
        )}

        {!loading && runs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-ink-tertiary">
            <Send className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Aucun envoi pour le moment</p>
          </div>
        )}

        {!loading && runs.length > 0 && (
          <div className="divide-y divide-white/[0.04]">
            {runs.map((run, i) => (
              <div key={run.id}
                className={`grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr_1fr_100px_160px_80px] items-center px-6 py-4 hover:bg-white/[0.02] transition-colors ${i === runs.length - 1 ? 'rounded-b-2xl' : ''}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-brand-teal" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-primary truncate">{run.leadName}</p>
                    <p className="text-xs text-ink-tertiary truncate">{run.leadEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-ink-secondary min-w-0">
                  <FileText className="w-3.5 h-3.5 flex-shrink-0 text-ink-tertiary" />
                  <span className="truncate">{run.sequenceName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-ink-tertiary" />
                  <span className="truncate">{run.leadCompany}</span>
                </div>
                <div>
                  {run.status === 'envoyé' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Envoyé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400">
                      <AlertCircle className="w-3 h-3" /> Erreur
                    </span>
                  )}
                </div>
                <div className="text-xs text-ink-tertiary">{formatDate(run.createdAt)}</div>
                <div className="flex justify-end">
                  {run.status === 'erreur' && (
                    <button onClick={() => handleResend(run)}
                      className="flex items-center gap-1 text-xs text-brand-teal hover:text-brand-teal/80 transition-colors cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" /> Renvoyer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
