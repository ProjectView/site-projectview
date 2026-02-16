import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { generateArticleImage } from '@/lib/generate-image';

export const runtime = 'nodejs';

// POST — Generate a banner image for an article
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

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
