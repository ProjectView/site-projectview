// Firestore article storage — replaces GitHub-based storage
import { getAdminFirestore } from '@/lib/firebase-admin';
import { articles as fallbackArticles } from '@/lib/fallback-data';
import type { Article } from '@/lib/fallback-data';

function db() {
  return getAdminFirestore();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Vérifie si un article est visible publiquement (Publié, Mis en avant, ou Programmé échu) */
function isPubliclyVisible(article: Article): boolean {
  const status = article.status ?? 'publie'; // rétrocompatibilité : pas de statut = publié
  if (status === 'publie' || status === 'mis-en-avant') return true;
  if (status === 'programme' && article.scheduledDate) {
    return new Date(article.scheduledDate) <= new Date();
  }
  return false;
}

// ─── Read ────────────────────────────────────────────────────────────────────

/** Tous les articles (usage admin uniquement) */
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

/**
 * Articles visibles publiquement : Publié, Mis en avant, Programmé dont la date est passée.
 * Les "Mis en avant" sont placés en tête de liste (max 3), puis les autres.
 */
export async function getPublicArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  const visible = all.filter(isPubliclyVisible);

  // "Mis en avant" en premier (max 3), puis le reste trié par date décroissante
  const featured = visible
    .filter((a) => a.status === 'mis-en-avant')
    .slice(0, 3);
  const others = visible.filter((a) => a.status !== 'mis-en-avant');

  return [...featured, ...others];
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
  const all = await getPublicArticles();
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

/** Compte les articles avec le statut "mis-en-avant" */
export async function getFeaturedCount(): Promise<number> {
  try {
    const snap = await db()
      .collection('articles')
      .where('status', '==', 'mis-en-avant')
      .get();
    return snap.size;
  } catch {
    return 0;
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

export async function createArticleFS(article: Article): Promise<void> {
  const now = new Date().toISOString();
  await db().collection('articles').doc(article.slug).set({
    ...article,
    status: article.status ?? 'brouillon',
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

export async function updateArticleStatusFS(
  slug: string,
  status: Article['status'],
  scheduledDate?: string
): Promise<void> {
  const now = new Date().toISOString();
  const update: Record<string, unknown> = { status, updatedAt: now };
  if (status === 'programme' && scheduledDate) {
    update.scheduledDate = scheduledDate;
  } else {
    // Efface la date programmée si on change de statut
    update.scheduledDate = null;
  }
  await db().collection('articles').doc(slug).set(update, { merge: true });
}

export async function deleteArticleFS(slug: string): Promise<void> {
  await db().collection('articles').doc(slug).delete();
}
