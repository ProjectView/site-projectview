import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/leadgen/hunter
// Proxy vers Hunter.io domain-search API
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { domain, limit = 10 } = body;

    if (!domain?.trim()) {
      return NextResponse.json({ error: 'Le domaine est requis.' }, { status: 400 });
    }

    const apiKey = process.env.HUNTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'HUNTER_API_KEY non configurée.' }, { status: 500 });
    }

    const url = new URL('https://api.hunter.io/v2/domain-search');
    url.searchParams.set('domain', domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''));
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('limit', String(Math.min(limit, 20)));

    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.errors?.[0]?.details ?? `Hunter.io erreur ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const emails = (data?.data?.emails ?? []).map((e: Record<string, unknown>) => ({
      firstName: e.first_name ?? '',
      lastName: e.last_name ?? '',
      value: e.value ?? '',
      position: e.position ?? '',
      confidence: e.confidence ?? 0,
      linkedin: e.linkedin ?? null,
    }));

    return NextResponse.json({ emails, domain: data?.data?.domain ?? domain });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
