import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { articles as localArticles } from '@/lib/fallback-data';
import {
  getArticlesFromGitHub,
  updateArticle,
  removeArticle,
  generateSlug,
  estimateReadTime,
} from '@/lib/admin-api';

export const runtime = 'nodejs';

// Check auth
async function checkAuth(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  return null;
}

// GET /api/admin/articles/[slug] — Get a single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { slug } = await params;

  try {
    let article;
    try {
      const result = await getArticlesFromGitHub();
      article = result.articles.find((a) => a.slug === slug);
    } catch {
      article = localArticles.find((a) => a.slug === slug);
    }

    if (!article) {
      return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/articles/[slug] — Update an article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { slug } = await params;

  try {
    const body = await request.json();
    const { title, excerpt, content, category, categorySlug, author, authorBio, date, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Titre et contenu sont requis.' },
        { status: 400 }
      );
    }

    // If title changed, generate new slug
    const newSlug = title !== body.originalTitle ? generateSlug(title) : slug;
    const readTime = estimateReadTime(content);

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
      readTime,
      ...(coverImage && { coverImage }),
    };

    await updateArticle(slug, updatedArticle);

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/articles/[slug] — Delete an article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  const { slug } = await params;

  try {
    await removeArticle(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la suppression';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
