import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { articles as localArticles, categories } from '@/lib/fallback-data';
import {
  injectArticle,
  generateSlug,
  formatDateFR,
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

// GET /api/admin/articles — List all articles
export async function GET(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    // Try GitHub first, fall back to local data
    let articles;
    try {
      const { getArticlesFromGitHub } = await import('@/lib/admin-api');
      const result = await getArticlesFromGitHub();
      articles = result.articles;
    } catch {
      // GitHub not configured or unreachable — use local data
      articles = localArticles;
    }

    return NextResponse.json({ articles, categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/articles — Create a new article
export async function POST(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, excerpt, content, category, categorySlug, author, authorBio, coverImage } = body;

    // Validate required fields
    if (!title || !content || !category || !categorySlug) {
      return NextResponse.json(
        { error: 'Titre, contenu, catégorie sont requis.' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const date = formatDateFR();
    const readTime = estimateReadTime(content);

    const article = {
      title: title.trim(),
      slug,
      excerpt: (excerpt || '').trim(),
      content: content.trim(),
      category: category.trim(),
      categorySlug: categorySlug.trim(),
      date,
      author: (author || 'Admin').trim(),
      authorBio: (authorBio || '').trim(),
      readTime,
      ...(coverImage && { coverImage }),
    };

    await injectArticle(article);

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la création';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
