import type { MetadataRoute } from 'next';
import { articles, solutions } from '@/lib/fallback-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://projectview.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/solutions`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/expertise`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Dynamic solution pages
  const solutionPages: MetadataRoute.Sitemap = solutions.map((s) => ({
    url: `${SITE_URL}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...solutionPages, ...blogPages];
}
