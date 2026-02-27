import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { categories } from '@/lib/fallback-data';
import { getAllArticles, createArticleFS } from '@/lib/firestore-articles';
import { generateSlug, formatDateFR, estimateReadTime } from '@/lib/admin-api';

export const runtime = 'nodejs';

// GET /api/admin/articles — List all articles
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const articles = await getAllArticles();
    return NextResponse.json({ articles, categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/articles — Create a new article
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, excerpt, content, category, categorySlug, author, authorBio, coverImage } = body;

    if (!title || !content || !category || !categorySlug) {
      return NextResponse.json(
        { error: 'Titre, contenu, catégorie sont requis.' },
        { status: 400 }
      );
    }

    const article = {
      title: title.trim(),
      slug: generateSlug(title),
      excerpt: (excerpt || '').trim(),
      content: content.trim(),
      category: category.trim(),
      categorySlug: categorySlug.trim(),
      date: formatDateFR(),
      author: (author || 'Admin').trim(),
      authorBio: (authorBio || '').trim(),
      readTime: estimateReadTime(content),
      ...(coverImage && { coverImage }),
    };

    await createArticleFS(article);

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la création';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
