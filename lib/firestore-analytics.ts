/**
 * Firestore analytics helpers.
 * Collection: `analytics`
 * Each document represents one page-view event.
 */
import '@/lib/firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export interface AnalyticsEvent {
  type: 'view';
  path: string;
  title: string;
  sessionId: string;
  timestamp: string; // ISO
  device: 'mobile' | 'tablet' | 'desktop';
  referrer: string;
  duration: number; // seconds
}

export interface DailyPoint {
  date: string; // 'YYYY-MM-DD'
  views: number;
  visitors: number; // unique sessionIds that day
}

export interface TopPage {
  path: string;
  title: string;
  views: number;
  avgDuration: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  avgDuration: number; // seconds
  avgPagesPerSession: number;
  dailyBreakdown: DailyPoint[];
  topPages: TopPage[];
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  referrers: { source: string; count: number }[];
}

function db() {
  return getFirestore();
}

function cutoffDate(rangeDays: number): Date {
  return new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function trackEvent(event: Omit<AnalyticsEvent, 'type'>): Promise<void> {
  try {
    await db()
      .collection('analytics')
      .add({ ...event, type: 'view' });
  } catch {
    // Silently fail — analytics must never break the site
  }
}

// ── Read & aggregate ──────────────────────────────────────────────────────────

/**
 * Fetch all events in the given range and return aggregated summary.
 * @param rangeDays  7 | 30 | 90
 */
export async function getAnalyticsSummary(
  rangeDays: number = 30,
): Promise<AnalyticsSummary> {
  const cutoff = cutoffDate(rangeDays);
  const empty: AnalyticsSummary = {
    totalViews: 0,
    uniqueVisitors: 0,
    avgDuration: 0,
    avgPagesPerSession: 0,
    dailyBreakdown: [],
    topPages: [],
    deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
    referrers: [],
  };

  try {
    const snap = await db()
      .collection('analytics')
      .where('timestamp', '>=', cutoff.toISOString())
      .orderBy('timestamp', 'desc')
      .limit(50000) // safety cap
      .get();

    if (snap.empty) return empty;

    const events = snap.docs.map((d) => d.data() as AnalyticsEvent);

    // Unique visitors
    const sessions = new Set(events.map((e) => e.sessionId));
    const uniqueVisitors = sessions.size;

    // Average duration (only events with duration > 0)
    const withDuration = events.filter((e) => e.duration > 0);
    const avgDuration =
      withDuration.length > 0
        ? Math.round(
            withDuration.reduce((s, e) => s + e.duration, 0) / withDuration.length,
          )
        : 0;

    // Pages per session
    const pagesPerSession = new Map<string, number>();
    for (const e of events) {
      pagesPerSession.set(e.sessionId, (pagesPerSession.get(e.sessionId) || 0) + 1);
    }
    const avgPagesPerSession =
      sessions.size > 0
        ? +(
            Array.from(pagesPerSession.values()).reduce((s, n) => s + n, 0) /
            sessions.size
          ).toFixed(1)
        : 0;

    // Daily breakdown — generate all days in range
    const dailyMap = new Map<string, { views: number; sessions: Set<string> }>();
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { views: 0, sessions: new Set() });
    }
    for (const e of events) {
      const key = e.timestamp.slice(0, 10);
      if (dailyMap.has(key)) {
        const entry = dailyMap.get(key)!;
        entry.views++;
        entry.sessions.add(e.sessionId);
      }
    }
    const dailyBreakdown: DailyPoint[] = Array.from(dailyMap.entries())
      .map(([date, { views, sessions: s }]) => ({
        date,
        views,
        visitors: s.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top pages
    const pageMap = new Map<string, { title: string; count: number; totalDuration: number }>();
    for (const e of events) {
      const existing = pageMap.get(e.path);
      if (existing) {
        existing.count++;
        existing.totalDuration += e.duration;
      } else {
        pageMap.set(e.path, { title: e.title || e.path, count: 1, totalDuration: e.duration });
      }
    }
    const topPages: TopPage[] = Array.from(pageMap.entries())
      .map(([path, { title, count, totalDuration }]) => ({
        path,
        title,
        views: count,
        avgDuration: count > 0 ? Math.round(totalDuration / count) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Device breakdown
    const deviceBreakdown = { mobile: 0, tablet: 0, desktop: 0 };
    for (const e of events) {
      if (e.device in deviceBreakdown) {
        deviceBreakdown[e.device as keyof typeof deviceBreakdown]++;
      }
    }

    // Referrers
    const refMap = new Map<string, number>();
    for (const e of events) {
      const source = parseReferrer(e.referrer);
      refMap.set(source, (refMap.get(source) || 0) + 1);
    }
    const referrers = Array.from(refMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalViews: events.length,
      uniqueVisitors,
      avgDuration,
      avgPagesPerSession,
      dailyBreakdown,
      topPages,
      deviceBreakdown,
      referrers,
    };
  } catch {
    return empty;
  }
}

/**
 * Returns unique visitor count for today only (for the dashboard KPI).
 */
export async function getTodayStats(): Promise<{ views: number; visitors: number }> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const snap = await db()
      .collection('analytics')
      .where('timestamp', '>=', `${today}T00:00:00.000Z`)
      .get();
    const sessions = new Set(snap.docs.map((d) => (d.data() as AnalyticsEvent).sessionId));
    return { views: snap.size, visitors: sessions.size };
  } catch {
    return { views: 0, visitors: 0 };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseReferrer(ref: string): string {
  if (!ref || ref === '') return 'Direct';
  try {
    const url = new URL(ref);
    const host = url.hostname.replace(/^www\./, '');
    const known: Record<string, string> = {
      'google.com': 'Google',
      'google.fr': 'Google',
      'bing.com': 'Bing',
      'linkedin.com': 'LinkedIn',
      'facebook.com': 'Facebook',
      'instagram.com': 'Instagram',
      't.co': 'Twitter / X',
      'twitter.com': 'Twitter / X',
    };
    return known[host] || host;
  } catch {
    return 'Autre';
  }
}
