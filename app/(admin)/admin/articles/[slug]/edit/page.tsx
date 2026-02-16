'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { articles as localArticles } from '@/lib/fallback-data';
import type { Article } from '@/lib/fallback-data';

export default function EditArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/admin/articles/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data.article);
        } else {
          // Fallback to local data
          const local = localArticles.find((a) => a.slug === slug);
          if (local) {
            setArticle(local);
          } else {
            setError('Article introuvable.');
          }
        }
      } catch {
        // Fallback to local data
        const local = localArticles.find((a) => a.slug === slug);
        if (local) {
          setArticle(local);
        } else {
          setError('Erreur de chargement.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-ink-tertiary">
        <p className="text-lg font-medium text-ink-primary mb-2">Article introuvable</p>
        <p className="text-sm">{error || `Aucun article avec le slug "${slug}".`}</p>
      </div>
    );
  }

  return <ArticleEditor mode="edit" initialData={article} />;
}
