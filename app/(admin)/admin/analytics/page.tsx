'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Eye,
  MousePointerClick,
  Clock,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DailyPoint {
  date: string;
  views: number;
  visitors: number;
}

interface TopPage {
  path: string;
  title: string;
  views: number;
  avgDuration: number;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgDuration: number;
  avgPagesPerSession: number;
  dailyBreakdown: DailyPoint[];
  topPages: TopPage[];
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  referrers: { source: string; count: number }[];
  today: { views: number; visitors: number };
}

type Range = '7d' | '30d' | '90d';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(iso: string, short = false): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', short ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'long' });
}

function shortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// ── SVG Line Chart ─────────────────────────────────────────────────────────────

function LineChart({ data }: { data: DailyPoint[] }) {
  const W = 800;
  const H = 220;
  const PAD = { top: 20, right: 20, bottom: 36, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[220px] text-ink-tertiary text-sm">
        <Eye className="w-8 h-8 mb-2 opacity-30" />
        <span>Aucune donnée pour cette période</span>
      </div>
    );
  }

  const maxViews = Math.max(...data.map((d) => d.views), 1);
  const maxVisitors = Math.max(...data.map((d) => d.visitors), 1);
  const maxVal = Math.max(maxViews, maxVisitors, 1);

  // Scale helpers
  const xScale = (i: number) => (i / (data.length - 1)) * innerW;
  const yScale = (v: number) => innerH - (v / maxVal) * innerH;

  // Build polyline points
  const viewsPoints = data.map((d, i) => `${xScale(i)},${yScale(d.views)}`).join(' ');
  const visitorsPoints = data.map((d, i) => `${xScale(i)},${yScale(d.visitors)}`).join(' ');

  // Build fill path (area)
  const viewsArea = [
    `M ${xScale(0)},${yScale(data[0].views)}`,
    ...data.slice(1).map((d, i) => `L ${xScale(i + 1)},${yScale(d.views)}`),
    `L ${xScale(data.length - 1)},${innerH}`,
    `L 0,${innerH}`,
    'Z',
  ].join(' ');

  // Y-axis labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t));

  // X-axis labels — show first, last, and some in between
  const xLabelIndices = (() => {
    const step = Math.max(1, Math.floor(data.length / 6));
    const indices: number[] = [];
    for (let i = 0; i < data.length; i += step) indices.push(i);
    if (!indices.includes(data.length - 1)) indices.push(data.length - 1);
    return indices;
  })();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      preserveAspectRatio="none"
      style={{ height: '220px' }}
    >
      <defs>
        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B7A8C" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3B7A8C" stopOpacity="0" />
        </linearGradient>
        <clipPath id="chartClip">
          <rect x="0" y="0" width={innerW} height={innerH} />
        </clipPath>
      </defs>

      <g transform={`translate(${PAD.left},${PAD.top})`}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={0} y1={yScale(tick)}
              x2={innerW} y2={yScale(tick)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
              strokeDasharray={i === 0 ? 'none' : '4 4'}
            />
            <text
              x={-8} y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize={10}
            >
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <g clipPath="url(#chartClip)">
          <path d={viewsArea} fill="url(#viewsGrad)" />
        </g>

        {/* Lines */}
        <g clipPath="url(#chartClip)">
          <polyline
            points={viewsPoints}
            fill="none"
            stroke="#3B7A8C"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            points={visitorsPoints}
            fill="none"
            stroke="#6B9B37"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="none"
          />
        </g>

        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(d.views)} r={3} fill="#3B7A8C" />
            <circle cx={xScale(i)} cy={yScale(d.visitors)} r={3} fill="#6B9B37" />
          </g>
        ))}

        {/* X-axis labels */}
        {xLabelIndices.map((i) => (
          <text
            key={i}
            x={xScale(i)}
            y={innerH + 20}
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize={10}
          >
            {shortDate(data[i].date)}
          </text>
        ))}
      </g>
    </svg>
  );
}

// ── Donut Chart (devices) ─────────────────────────────────────────────────────

function DonutChart({ mobile, tablet, desktop }: { mobile: number; tablet: number; desktop: number }) {
  const total = mobile + tablet + desktop || 1;
  const R = 56;
  const circ = 2 * Math.PI * R;
  const cx = 80;
  const cy = 80;

  const segments = [
    { label: 'Desktop', value: desktop, color: '#3B7A8C', icon: Monitor },
    { label: 'Mobile', value: mobile, color: '#D4842A', icon: Smartphone },
    { label: 'Tablette', value: tablet, color: '#6B9B37', icon: Tablet },
  ];

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circ;
    const gap = circ - dash;
    const arc = { ...seg, pct, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-8">
      {/* SVG Donut */}
      <div className="relative flex-shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* BG ring */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={14} />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={arc.color}
              strokeWidth={14}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="butt"
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize={18} fontWeight="bold" fontFamily="'JetBrains Mono', monospace">
            {total.toLocaleString('fr')}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10}>
            sessions
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 flex-1">
        {arcs.map((arc) => {
          const Icon = arc.icon;
          return (
            <div key={arc.label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${arc.color}20` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: arc.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-ink-secondary">{arc.label}</span>
                  <span className="text-xs font-mono font-medium text-ink-primary">{Math.round(arc.pct * 100)}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${arc.pct * 100}%`, background: arc.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: number; // positive = up, negative = down
}

function KpiCard({ label, value, sub, icon: Icon, color, trend }: KpiProps) {
  return (
    <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold font-mono text-ink-primary tabular-nums">{value}</div>
        <div className="text-xs text-ink-secondary mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-ink-tertiary mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (r: Range) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur API');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Impossible de charger les données analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const rangeLabel: Record<Range, string> = { '7d': '7 jours', '30d': '30 jours', '90d': '90 jours' };

  // Top referrer
  const topSource = data?.referrers?.[0]?.source ?? '—';

  // Max views for top pages bar
  const maxPageViews = Math.max(...(data?.topPages?.map((p) => p.views) ?? [1]), 1);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">Analytics</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Analyse approfondie du trafic et des performances
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Range tabs */}
          <div className="flex items-center bg-dark-elevated border border-white/[0.06] rounded-lg p-1 gap-1">
            {(['7d', '30d', '90d'] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  range === r
                    ? 'bg-white/[0.08] text-ink-primary'
                    : 'text-ink-tertiary hover:text-ink-secondary'
                }`}
              >
                {rangeLabel[r]}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchData(range)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink-secondary hover:text-ink-primary border border-white/[0.06] rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Empty state hint */}
      {!loading && !error && data?.totalViews === 0 && (
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6 text-center">
          <Eye className="w-10 h-10 mx-auto mb-3 text-ink-tertiary opacity-40" />
          <p className="text-sm text-ink-secondary font-medium">Aucune donnée pour cette période</p>
          <p className="text-xs text-ink-tertiary mt-1">
            Les données s'accumuleront dès que le site sera en production et que des visiteurs parcourront les pages.
          </p>
        </div>
      )}

      {/* KPI Cards — row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Visiteurs uniques"
          value={loading ? '—' : (data?.uniqueVisitors ?? 0).toLocaleString('fr')}
          sub={`Sur les ${rangeLabel[range]}`}
          icon={Users}
          color="#3B7A8C"
        />
        <KpiCard
          label="Pages vues"
          value={loading ? '—' : (data?.totalViews ?? 0).toLocaleString('fr')}
          sub={`Aujourd'hui : ${data?.today?.views ?? 0}`}
          icon={Eye}
          color="#6B9B37"
        />
        <KpiCard
          label="Pages / session"
          value={loading ? '—' : (data?.avgPagesPerSession ?? 0).toFixed(1)}
          sub="Moyenne sur la période"
          icon={MousePointerClick}
          color="#D4842A"
        />
        <KpiCard
          label="Durée moyenne"
          value={loading ? '—' : formatDuration(data?.avgDuration ?? 0)}
          sub="Temps passé / session"
          icon={Clock}
          color="#8B6914"
        />
        <KpiCard
          label="Top source"
          value={loading ? '—' : topSource}
          sub="Principal canal d'acquisition"
          icon={TrendingUp}
          color="#6B9B37"
        />
      </div>

      {/* Traffic chart */}
      <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-ink-primary">Évolution du trafic</h2>
            <p className="text-xs text-ink-tertiary mt-0.5">{rangeLabel[range]} — vues et visiteurs uniques</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 text-xs text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full bg-[#3B7A8C] inline-block" /> Vues
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full bg-[#6B9B37] inline-block" /> Visiteurs
            </span>
          </div>
        </div>
        {loading ? (
          <div className="h-[220px] flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-ink-tertiary" />
          </div>
        ) : (
          <LineChart data={data?.dailyBreakdown ?? []} />
        )}
      </div>

      {/* Row: Top pages + Device breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top pages */}
        <div className="lg:col-span-2 bg-dark-elevated border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-ink-primary">Pages les plus consultées</h2>
            <span className="text-xs text-ink-tertiary">Top {data?.topPages?.length ?? 0}</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-white/[0.03] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !data?.topPages?.length ? (
            <p className="text-sm text-ink-tertiary text-center py-8">Aucune page consultée</p>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_60px_70px] gap-3 px-2 pb-1 border-b border-white/[0.04]">
                <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wide">Page</span>
                <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wide text-right">Vues</span>
                <span className="text-[11px] font-medium text-ink-tertiary uppercase tracking-wide text-right">Durée</span>
              </div>
              {data.topPages.map((page, i) => {
                const pct = Math.round((page.views / maxPageViews) * 100);
                return (
                  <div key={page.path} className="grid grid-cols-[1fr_60px_70px] gap-3 items-center px-2 py-1.5 rounded-lg hover:bg-white/[0.03] group transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-ink-tertiary w-4 flex-shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-ink-primary truncate font-medium">
                              {page.title || page.path}
                            </p>
                            <a
                              href={page.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="w-3 h-3 text-ink-tertiary hover:text-brand-teal" />
                            </a>
                          </div>
                          <div className="mt-1 h-1 rounded-full bg-white/[0.04]">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: i === 0 ? '#3B7A8C' : 'rgba(59,122,140,0.5)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-ink-secondary text-right">{page.views.toLocaleString('fr')}</div>
                    <div className="text-xs font-mono text-ink-tertiary text-right">{formatDuration(page.avgDuration)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Device breakdown */}
        <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-ink-primary">Répartition appareils</h2>
            <p className="text-xs text-ink-tertiary mt-0.5">Sessions par type d'appareil</p>
          </div>
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin text-ink-tertiary" />
            </div>
          ) : (
            <DonutChart
              mobile={data?.deviceBreakdown?.mobile ?? 0}
              tablet={data?.deviceBreakdown?.tablet ?? 0}
              desktop={data?.deviceBreakdown?.desktop ?? 0}
            />
          )}
        </div>
      </div>

      {/* Row: Referrers */}
      <div className="bg-dark-elevated border border-white/[0.06] rounded-xl p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-ink-primary">Sources de trafic</h2>
          <p className="text-xs text-ink-tertiary mt-0.5">D'où viennent vos visiteurs</p>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-white/[0.03] rounded animate-pulse" />
            ))}
          </div>
        ) : !data?.referrers?.length ? (
          <p className="text-sm text-ink-tertiary text-center py-6">Aucune donnée de source</p>
        ) : (
          <div className="space-y-3">
            {(() => {
              const maxCount = Math.max(...data.referrers.map((r) => r.count), 1);
              const total = data.referrers.reduce((s, r) => s + r.count, 0) || 1;
              return data.referrers.map((ref, i) => {
                const pct = Math.round((ref.count / maxCount) * 100);
                const share = Math.round((ref.count / total) * 100);
                return (
                  <div key={ref.source} className="flex items-center gap-4">
                    <div className="w-28 flex-shrink-0 text-xs text-ink-secondary font-medium truncate">{ref.source}</div>
                    <div className="flex-1 h-6 bg-white/[0.04] rounded overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 rounded transition-all duration-700 flex items-center"
                        style={{
                          width: `${pct}%`,
                          background: i === 0 ? '#3B7A8C' : `rgba(59,122,140,${0.7 - i * 0.1})`,
                        }}
                      />
                    </div>
                    <div className="w-20 flex-shrink-0 flex items-center justify-end gap-2">
                      <span className="text-xs font-mono text-ink-secondary">{ref.count.toLocaleString('fr')}</span>
                      <span className="text-[11px] font-mono text-ink-tertiary w-8 text-right">{share}%</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-ink-tertiary text-center pb-2">
        Données collectées via le tracker first-party Projectview · Les visiteurs en navigation privée peuvent ne pas être comptabilisés
      </p>
    </div>
  );
}
