/**
 * Strapi v4 API client
 *
 * - Bearer token authentication
 * - ISR with revalidate: 60
 * - Graceful fallback on failure (returns null so callers use fallback-data)
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiItem<T> {
  id: number;
  attributes: T;
}

async function fetchStrapi<T>(
  endpoint: string,
  params: Record<string, string> = {},
  revalidate = 60,
): Promise<StrapiResponse<T> | null> {
  const url = new URL(`/api/${endpoint}`, STRAPI_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      next: { revalidate },
    });

    if (!res.ok) {
      console.warn(`[Strapi] ${endpoint} returned ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.warn(`[Strapi] Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

// ─── Articles ───

export async function getArticles() {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('articles', {
    'populate': '*',
    'sort': 'publishedAt:desc',
    'pagination[pageSize]': '25',
  });
}

export async function getArticleBySlug(slug: string) {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('articles', {
    'filters[slug][$eq]': slug,
    'populate': '*',
  });
}

// ─── Solutions ───

export async function getSolutions() {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('solutions', {
    'populate': '*',
    'sort': 'order:asc',
  });
}

export async function getSolutionBySlug(slug: string) {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('solutions', {
    'filters[slug][$eq]': slug,
    'populate': '*',
  });
}

// ─── Categories ───

export async function getCategories() {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('categories', {
    'populate': '*',
  });
}

// ─── Testimonials ───

export async function getTestimonials() {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('testimonials', {
    'populate': '*',
  });
}

// ─── Case Studies ───

export async function getCaseStudies() {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('case-studies', {
    'populate': '*',
  });
}

// ─── Authors ───

export async function getAuthors() {
  return fetchStrapi<StrapiItem<Record<string, unknown>>[]>('authors', {
    'populate': '*',
  });
}
