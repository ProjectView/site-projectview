import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getArticleBySlug } from '@/lib/fallback-data';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { BlogArticleContent } from './BlogArticleContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://projectview.fr';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const article = getArticleBySlug(slug);
    if (!article) return { title: 'Article introuvable — Projectview' };
    return {
      title: `${article.title} — Projectview Blog`,
      description: article.excerpt,
    };
  });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

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
      <BlogArticleContent article={article} />
    </>
  );
}
