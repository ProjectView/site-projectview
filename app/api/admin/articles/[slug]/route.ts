import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getArticleBySlugFS, updateArticleFS, deleteArticleFS } from '@/lib/firestore-articles';
import { generateSlug, estimateReadTime } from '@/lib/admin-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/articles/[slug]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { slug } = await params;

  const article = await getArticleBySlugFS(slug);
  if (!article) {
    return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 });
  }
  return NextResponse.json({ article });
}

// PUT /api/admin/articles/[slug]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { slug } = await params;

  try {
    const body = await request.json();
    const { title, excerpt, content, category, categorySlug, author, authorBio, date, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Titre et contenu sont requis.' }, { status: 400 });
    }

    const newSlug = title !== body.originalTitle ? generateSlug(title) : slug;

    const updatedArticle = {
      title: title.trim(),
      slug: newSlug,
      excerpt: (excerpt || '').trim(),
      content: content.trim(),
      category: (category || '').trim(),
      categorySlug: (categorySlug || '').trim(),
      date: date || '',
      author: (author || 'Admin').trim(),
      authorBio: (authorBio || '').trim(),
      readTime: estimateReadTime(content),
      ...(coverImage && { coverImage }),
    };

    await updateArticleFS(slug, updatedArticle);

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/articles/[slug]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { slug } = await params;

  try {
    await deleteArticleFS(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la suppression';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
