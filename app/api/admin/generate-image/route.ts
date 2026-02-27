import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { generateArticleImage } from '@/lib/generate-image';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST — Generate a banner image for an article
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const { title, excerpt, slug } = await request.json();

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Titre et slug requis' },
        { status: 400 }
      );
    }

    const imagePath = await generateArticleImage(
      title,
      excerpt || title,
      slug
    );

    return NextResponse.json({ imagePath });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Image generation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
