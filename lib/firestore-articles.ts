// Firestore article storage — replaces GitHub-based storage
import { getAdminFirestore } from '@/lib/firebase-admin';
import { articles as fallbackArticles } from '@/lib/fallback-data';
import type { Article } from '@/lib/fallback-data';

function db() {
  return getAdminFirestore();
}

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  try {
    const snap = await db()
      .collection('articles')
      .orderBy('createdAt', 'desc')
      .get();

    if (snap.empty) return [...fallbackArticles];

    return snap.docs.map((doc) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, ...article } = doc.data();
      return article as Article;
    });
  } catch {
    return [...fallbackArticles];
  }
}

export async function getArticleBySlugFS(slug: string): Promise<Article | null> {
  try {
    const doc = await db().collection('articles').doc(slug).get();
    if (!doc.exists) {
      return fallbackArticles.find((a) => a.slug === slug) ?? null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...article } = doc.data()!;
    return article as Article;
  } catch {
    return fallbackArticles.find((a) => a.slug === slug) ?? null;
  }
}

export async function getRelatedArticlesFS(slug: string, limit = 3): Promise<Article[]> {
  const all = await getAllArticles();
  const current = all.find((a) => a.slug === slug);
  if (!current) return [];
  return all
    .filter((a) => a.slug !== slug && a.categorySlug === current.categorySlug)
    .slice(0, limit);
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const snap = await db().collection('articles').select().get();
    const fsSlugs = snap.docs.map((d) => d.id);
    const fallbackSlugs = fallbackArticles.map((a) => a.slug);
    return [...new Set([...fsSlugs, ...fallbackSlugs])];
  } catch {
    return fallbackArticles.map((a) => a.slug);
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

export async function createArticleFS(article: Article): Promise<void> {
  const now = new Date().toISOString();
  await db().collection('articles').doc(article.slug).set({
    ...article,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateArticleFS(slug: string, updated: Article): Promise<void> {
  const now = new Date().toISOString();
  if (slug !== updated.slug) {
    // Slug changed: delete old document, create new one
    await db().collection('articles').doc(slug).delete();
    await db().collection('articles').doc(updated.slug).set({
      ...updated,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db().collection('articles').doc(slug).set(
      { ...updated, updatedAt: now },
      { merge: true }
    );
  }
}

export async function deleteArticleFS(slug: string): Promise<void> {
  await db().collection('articles').doc(slug).delete();
}
