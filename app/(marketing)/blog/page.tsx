import type { Metadata } from 'next';
import { getPublicArticles } from '@/lib/firestore-articles';
import { categories } from '@/lib/fallback-data';
import { BlogPageContent } from './BlogPageContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog — Projectview',
  description: "Actualités, tendances et conseils sur l'affichage dynamique, la collaboration, la présentation innovante et l'IA.",
};

export default async function BlogPage() {
  const articles = await getPublicArticles();
  return <BlogPageContent articles={articles} categories={categories} />;
}
