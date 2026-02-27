import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlugFS, getRelatedArticlesFS, getAllSlugs } from '@/lib/firestore-articles';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { BlogArticleContent } from './BlogArticleContent';

export const revalidate = 60;
export const dynamicParams = true;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://projectview.fr';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlugFS(slug);
  if (!article) return { title: 'Article introuvable — Projectview' };
  return {
    title: `${article.title} — Projectview Blog`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, related] = await Promise.all([
    getArticleBySlugFS(slug),
    getRelatedArticlesFS(slug),
  ]);
  if (!article) notFound();

  // Vérifier la visibilité publique de l'article
  const status = article.status ?? 'publie';
  const isVisible =
    status === 'publie' ||
    status === 'mis-en-avant' ||
    (status === 'programme' &&
      article.scheduledDate != null &&
      new Date(article.scheduledDate) <= new Date());
  if (!isVisible) notFound();

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        author={article.author}
        datePublished={article.date}
        url={`${SITE_URL}/blog/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: article.title, url: `${SITE_URL}/blog/${slug}` },
        ]}
      />
      <BlogArticleContent article={article} related={related} />
    </>
  );
}
