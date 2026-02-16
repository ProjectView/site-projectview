import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/settings';

export const runtime = 'nodejs';

// GET /api/admin/settings
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const settings = getSiteSettings();

    // Check integration statuses dynamically
    const integrations = {
      ...settings.integrations,
      n8nWebhook: process.env.N8N_WEBHOOK_URL || settings.integrations.n8nWebhook,
      githubConnected: !!process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your-github-token-here',
      netlifyConnected: !!process.env.NETLIFY_BUILD_HOOK && process.env.NETLIFY_BUILD_HOOK !== 'your-netlify-build-hook-url-here',
    };

    return NextResponse.json({ settings: { ...settings, integrations } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = saveSiteSettings(body);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
