'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  FileText,
  Clock,
  Search,
  Trash2,
  Edit3,
  Eye,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { articles as localArticles, categories } from '@/lib/fallback-data';
import type { Article } from '@/lib/fallback-data';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Toast, ToastType } from '@/components/admin/Toast';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(localArticles);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('tous');
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Fetch articles from API
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
      }
    } catch {
      // Use local articles as fallback
      setArticles(localArticles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter and search
  const filtered = useMemo(() => {
    let result = articles;

    if (filterCategory !== 'tous') {
      result = result.filter((a) => a.categorySlug === filterCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      );
    }

    return result;
  }, [articles, filterCategory, search]);

  // Delete article
  const handleDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/articles/${deleteSlug}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur serveur');
      }

      setToast({ message: 'Article supprimé avec succès.', type: 'success' });
      setDeleteSlug(null);
      fetchArticles();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setToast({ message, type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const articleToDelete = articles.find((a) => a.slug === deleteSlug);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!deleteSlug}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer "${articleToDelete?.title}" ? Cette action est irréversible et sera publiée sur GitHub.`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteSlug(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-ink-secondary text-sm mt-1">
            {filtered.length} article{filtered.length > 1 ? 's' : ''}{' '}
            {filterCategory !== 'tous' || search ? 'trouvé(s)' : 'publiés'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchArticles}
            disabled={loading}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nouvel article
          </Link>
        </div>
      </div>

      {/* Search + Filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-8 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-teal/50 transition-colors cursor-pointer appearance-none min-w-[180px]"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug} className="bg-dark-surface">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
          <span>Titre</span>
          <span>Catégorie</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-ink-tertiary">
            <FileText className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">Aucun article trouvé</p>
            <p className="text-xs mt-1">
              {search || filterCategory !== 'tous'
                ? 'Essayez de modifier vos filtres.'
                : 'Créez votre premier article.'}
            </p>
          </div>
        )}

        {/* Rows */}
        {!loading && (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((article) => (
              <div
                key={article.slug}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors group"
              >
                {/* Title + Author */}
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-ink-tertiary flex-shrink-0 hidden sm:block" />
                  <div className="min-w-0">
                    <p className="text-sm text-ink-primary truncate font-medium">{article.title}</p>
                    <p className="text-xs text-ink-tertiary truncate">{article.author}</p>
                  </div>
                </div>

                {/* Category */}
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal whitespace-nowrap w-fit">
                  {article.category}
                </span>

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-ink-tertiary whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {article.date}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-white/[0.06] transition-all"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/articles/${article.slug}/edit`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-brand-teal hover:bg-brand-teal/10 transition-all"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteSlug(article.slug)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
