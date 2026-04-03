import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getEditorialConfig, saveEditorialConfig } from '@/lib/firestore-editorial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const config = await getEditorialConfig();
    return NextResponse.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      activePlatforms,
      audience,
      targetSectors,
      themes,
      avoidTopics,
      tone,
      preferredFormats,
      postsPerPlatform,
      keyMoments,
      objectives,
      preferredCTA,
      inspirations,
      brandColorPrimary,
      brandColorSecondary,
      brandColorAccent,
      visualStyle,
      logoUrl,
    } = body;

    if (!activePlatforms?.length || !themes || !tone) {
      return NextResponse.json(
        { error: 'activePlatforms, themes et tone sont requis' },
        { status: 400 }
      );
    }

    await saveEditorialConfig({
      activePlatforms: activePlatforms ?? [],
      audience: audience ?? '',
      targetSectors: targetSectors ?? [],
      themes,
      avoidTopics: avoidTopics ?? '',
      tone,
      preferredFormats: preferredFormats ?? [],
      postsPerPlatform: postsPerPlatform ?? {},
      keyMoments: keyMoments ?? '',
      objectives: objectives ?? [],
      preferredCTA: preferredCTA ?? '',
      inspirations: inspirations ?? '',
      brandColorPrimary: brandColorPrimary ?? '#3B7A8C',
      brandColorSecondary: brandColorSecondary ?? '#6B9B37',
      brandColorAccent: brandColorAccent ?? '#D4842A',
      visualStyle: visualStyle ?? 'minimaliste',
      ...(logoUrl ? { logoUrl } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
