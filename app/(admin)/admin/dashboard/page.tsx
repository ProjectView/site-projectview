'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  Users,
  Eye,
  Plus,
  ExternalLink,
  Rocket,
  ArrowRight,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart2,
  Loader2,
} from 'lucide-react';
import { computeSeoScore } from '@/components/admin/SeoPanel';
import { Toast, ToastType } from '@/components/admin/Toast';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DailyPoint { date: string; views: number; visitors: number }
interface TopPage { path: string; title: string; views: number; avgDuration: number }
interface Message {
  id: string; name: string; email: string; solution: string;
  message: string; createdAt: string; read: boolean;
}
interface DashboardData {
  totalViews: number;
  uniqueVisitors: number;
  avgDuration: number;
  dailyBreakdown: DailyPoint[];
  topPages: TopPage[];
  today: { views: number; visitors: number };
}

interface ArticleItem {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  slug: string;
  category: string;
  date: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getUserInfo() {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(/(?:^|;\s*)__user_info=([^;]*)/);
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match[1])) as { name?: string; email?: string };
  } catch { return null; }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

// ── Mini spark line ────────────────────────────────────────────────────────────
function SparkLine({ data, color = '#3B7A8C' }: { data: number[]; color?: string }) {
  if (data.length < 2) return <div className="w-[80px] h-[28px]" />;
  const max = Math.max(...data, 1);
  const w = 80; const h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-70 flex-shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── KPI card ───────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, gradient, trend, spark }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ className?: string }>; gradient: string;
  trend?: 'up' | 'down' | 'flat'; spark?: number[];
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-brand-green' : trend === 'down' ? 'text-red-400' : 'text-ink-tertiary';
  const isEmpty = value === 0 || value === '0' || value === '0/100';

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 flex flex-col gap-3 hover:bg-white/[0.06] transition-colors">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {spark && <SparkLine data={spark} />}
      </div>
      <div>
        <p className={`text-2xl font-bold font-mono tracking-tight leading-none ${isEmpty ? 'text-ink-tertiary' : ''}`}>
          {isEmpty ? '—' : value}
        </p>
        <p className="text-xs text-ink-secondary mt-1">{label}</p>
      </div>
      {(sub || trend) && (
        <div className="flex items-center gap-1.5">
          {trend && !isEmpty && <TrendIcon className={`w-3 h-3 ${trendColor}`} />}
          {sub && <p className="text-[11px] text-ink-tertiary">{sub}</p>}
        </div>
      )}
    </div>
  );
}

// ── Dashboard page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<DashboardData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveArticles, setLiveArticles] = useState<ArticleItem[]>([]);

  useEffect(() => { setUserInfo(getUserInfo()); }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [aRes, mRes, artRes] = await Promise.all([
          fetch('/api/admin/analytics?range=7d'),
          fetch('/api/admin/messages'),
          fetch('/api/admin/articles'),
        ]);
        if (aRes.ok) setAnalytics(await aRes.json());
        if (mRes.ok) {
          const d = await mRes.json();
          setMessages(d.messages || []);
          setUnreadCount(d.unreadCount || 0);
        }
        if (artRes.ok) {
          const d = await artRes.json();
          setLiveArticles(d.articles || []);
        }
      } catch { /* keep empty */ }
      setLoading(false);
    }
    load();
  }, []);

  // Average SEO score from live Firestore articles
  const avgSeo = liveArticles.length > 0
    ? Math.round(
        liveArticles.reduce(
          (s, a) => s + computeSeoScore(a.title, a.excerpt, a.content, a.coverImage || ''), 0,
        ) / liveArticles.length,
      )
    : 0;

  const spark7d = analytics?.dailyBreakdown.map((d) => d.visitors) ?? [];

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const res = await fetch('/api/admin/deploy', { method: 'POST' });
      if (res.ok) setToast({ message: 'Déploiement déclenché !', type: 'success' });
      else throw new Error();
    } catch {
      setToast({ message: 'Erreur de déploiement. Vérifiez NETLIFY_BUILD_HOOK.', type: 'error' });
    } finally { setDeploying(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bonjour{userInfo?.name ? `, ${userInfo.name}` : ''} 👋
          </h1>
          <p className="text-ink-secondary text-sm mt-1">
            Vue d&apos;ensemble — 7 derniers jours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all">
            <Plus className="w-3.5 h-3.5" />Nouvel article
          </Link>
          <Link href="/" target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all">
            <ExternalLink className="w-3.5 h-3.5" />Site
          </Link>
          <button onClick={handleDeploy} disabled={deploying}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50">
            {deploying
              ? <><div className="w-3.5 h-3.5 border border-ink-tertiary/30 border-t-ink-secondary rounded-full animate-spin" />Déploiement...</>
              : <><Rocket className="w-3.5 h-3.5" />Déployer</>}
          </button>
        </div>
      </div>

      {/* KPI cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-ink-tertiary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Visiteurs uniques (7j)"
            value={analytics?.uniqueVisitors ?? 0}
            sub={analytics?.today && analytics.today.visitors > 0 ? `${analytics.today.visitors} aujourd'hui` : 'En attente de données'}
            icon={Users}
            gradient="from-brand-teal to-[#5BA3B5]"
            trend={analytics?.uniqueVisitors ? 'up' : 'flat'}
            spark={spark7d}
          />
          <KpiCard
            label="Pages vues (7j)"
            value={analytics?.totalViews ?? 0}
            sub={analytics?.today && analytics.today.views > 0 ? `${analytics.today.views} aujourd'hui` : undefined}
            icon={Eye}
            gradient="from-[#6B9B37] to-[#8BC34A]"
            trend={analytics?.totalViews ? 'up' : 'flat'}
          />
          <KpiCard
            label="Demandes reçues"
            value={messages.length}
            sub={unreadCount > 0 ? `${unreadCount} non lu${unreadCount > 1 ? 'e(s)' : ''}` : 'Toutes lues'}
            icon={MessageSquare}
            gradient="from-brand-orange to-[#E8A045]"
            trend={unreadCount > 0 ? 'up' : 'flat'}
          />
          <KpiCard
            label="Score SEO moyen"
            value={avgSeo ? `${avgSeo}/100` : 0}
            sub={`Sur ${liveArticles.length} article${liveArticles.length > 1 ? 's' : ''}`}
            icon={BarChart2}
            gradient={avgSeo >= 70 ? 'from-[#6B9B37] to-[#4CAF50]' : avgSeo >= 40 ? 'from-brand-orange to-[#E8A045]' : 'from-[#C65D3E] to-[#E57373]'}
          />
        </div>
      )}

      {/* Middle row */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top pages */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-ink-primary">Pages les plus consultées</h2>
              <Link href="/admin/analytics"
                className="text-xs text-brand-teal hover:text-brand-teal/80 transition-colors flex items-center gap-1">
                Détails <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {!analytics || analytics.topPages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-ink-tertiary gap-2">
                <TrendingUp className="w-7 h-7 opacity-25" />
                <p className="text-xs">Les données s&apos;accumuleront en production.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {analytics.topPages.slice(0, 5).map((page, i) => {
                  const pct = analytics.topPages[0].views > 0
                    ? (page.views / analytics.topPages[0].views) * 100 : 0;
                  return (
                    <div key={page.path} className="flex items-center gap-4 px-5 py-3">
                      <span className="text-xs font-mono text-ink-tertiary w-4 text-right flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-ink-primary truncate font-medium">
                          {page.title || page.path}
                        </p>
                        <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full bg-brand-teal/50" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-mono font-semibold text-ink-primary">{page.views}</p>
                        <p className="text-[10px] text-ink-tertiary">vues</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent messages */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-ink-primary flex items-center gap-2">
                Dernières demandes
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange">
                    {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </h2>
              <Link href="/admin/messages"
                className="text-xs text-brand-teal hover:text-brand-teal/80 transition-colors flex items-center gap-1">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-ink-tertiary gap-2">
                <MessageSquare className="w-7 h-7 opacity-25" />
                <p className="text-xs">Aucune demande reçue.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {messages.slice(0, 4).map((msg) => (
                  <Link key={msg.id} href="/admin/messages"
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${!msg.read ? 'bg-brand-orange' : 'bg-white/[0.08]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-ink-primary truncate">{msg.name}</p>
                        <p className="text-[10px] text-ink-tertiary flex-shrink-0">{formatDate(msg.createdAt)}</p>
                      </div>
                      {msg.solution && <p className="text-[10px] text-brand-teal mt-0.5">{msg.solution}</p>}
                      <p className="text-[11px] text-ink-secondary line-clamp-1 mt-0.5">{msg.message}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom: Recent articles */}
      {!loading && (
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-ink-primary">Articles récents</h2>
            <Link href="/admin/articles"
              className="text-xs text-brand-teal hover:text-brand-teal/80 transition-colors flex items-center gap-1">
              Gérer <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {liveArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-ink-tertiary gap-2">
              <FileText className="w-7 h-7 opacity-25" />
              <p className="text-xs">Aucun article publié.</p>
            </div>
          ) : (
          <div className="divide-y divide-white/[0.04]">
            {liveArticles.slice(0, 5).map((article) => {
              const seo = computeSeoScore(article.title, article.excerpt, article.content, article.coverImage || '');
              const sc = seo >= 70 ? 'text-brand-green' : seo >= 40 ? 'text-brand-orange' : 'text-red-400';
              return (
                <Link key={article.slug} href={`/admin/articles/${article.slug}/edit`}
                  className="grid grid-cols-[1fr_auto_auto_64px] items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                    <span className="text-sm text-ink-primary truncate font-medium">{article.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal whitespace-nowrap">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-ink-tertiary whitespace-nowrap">
                    <Clock className="w-3 h-3" />{article.date}
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono font-semibold ${sc}`}>{seo}</span>
                    <span className="text-[10px] text-ink-tertiary">/100</span>
                  </div>
                </Link>
              );
            })}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
