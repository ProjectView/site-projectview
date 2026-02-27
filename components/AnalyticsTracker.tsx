'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getOrCreateSessionId(): string {
  try {
    let sid = localStorage.getItem('pv_sid');
    if (!sid) {
      // Generate a UUID v4-like ID
      sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem('pv_sid', sid);
    }
    return sid;
  } catch {
    return 'anonymous';
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Never track admin pages
    if (pathname.startsWith('/admin')) return;

    const sessionId = getOrCreateSessionId();
    const startTime = Date.now();
    const title = typeof document !== 'undefined' ? document.title : '';
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    // Track page view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, title, sessionId, referrer }),
    }).catch(() => {/* silently ignore */});

    // Track time on page via beforeunload (sendBeacon for reliability)
    const handleUnload = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      if (duration < 2) return; // skip bounces < 2s
      const payload = JSON.stringify({ path: pathname, title, sessionId, referrer, duration });
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', new Blob([payload], { type: 'application/json' }));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [pathname]);

  return null;
}
