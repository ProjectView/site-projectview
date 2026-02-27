import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getFeaturedCount, updateArticleStatusFS, getArticleBySlugFS } from '@/lib/firestore-articles';
import type { ArticleStatus } from '@/lib/fallback-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STATUSES: ArticleStatus[] = [
  'en-cours',
  'publie',
  'mis-en-avant',
  'programme',
  'brouillon',
  'proposition',
  'invisible',
];

// PATCH /api/admin/articles/[slug]/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { slug } = await params;

  try {
    const body = await request.json();
    const { status, scheduledDate } = body as {
      status: ArticleStatus;
      scheduledDate?: string;
    };

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide.' },
        { status: 400 }
      );
    }

    // Vérification : max 3 articles "Mis en avant"
    if (status === 'mis-en-avant') {
      const article = await getArticleBySlugFS(slug);
      // Ne compter que si l'article n'était pas déjà "mis-en-avant"
      if (article?.status !== 'mis-en-avant') {
        const count = await getFeaturedCount();
        if (count >= 3) {
          return NextResponse.json(
            { error: 'Limite atteinte : 3 articles "Mis en avant" maximum.' },
            { status: 409 }
          );
        }
      }
    }

    // Validation date pour le statut "programme"
    if (status === 'programme' && !scheduledDate) {
      return NextResponse.json(
        { error: 'Une date de publication est requise pour le statut "Programmé".' },
        { status: 400 }
      );
    }

    await updateArticleStatusFS(slug, status, scheduledDate);

    return NextResponse.json({ success: true, status, scheduledDate });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
