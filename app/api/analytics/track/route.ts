import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/firestore-analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple in-memory rate limit: sessionId+path → last event timestamp
const recentEvents = new Map<string, number>();
const DEDUP_MS = 3000; // ignore duplicate path+session within 3s

function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/Mobile|Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile/.test(ua)) return 'mobile';
  if (/Tablet|iPad|Android(?!.*Mobile)/.test(ua)) return 'tablet';
  return 'desktop';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, title = '', sessionId = '', referrer = '', duration } = body as {
      path: string;
      title?: string;
      sessionId?: string;
      referrer?: string;
      duration?: number;
    };

    if (!path || !sessionId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Deduplicate: same session + path within DEDUP_MS
    const key = `${sessionId}:${path}`;
    const now = Date.now();
    const last = recentEvents.get(key);
    if (last && now - last < DEDUP_MS && !duration) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    recentEvents.set(key, now);

    // Prune old entries every ~100 requests to avoid memory leak
    if (recentEvents.size > 500) {
      const cutoff = now - 60_000;
      for (const [k, ts] of recentEvents) {
        if (ts < cutoff) recentEvents.delete(k);
      }
    }

    const ua = request.headers.get('user-agent') || '';
    const device = detectDevice(ua);

    await trackEvent({
      path,
      title,
      sessionId,
      referrer,
      device,
      duration: typeof duration === 'number' ? duration : 0,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Never fail publicly
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
