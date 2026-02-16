'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FileText,
  Layers,
  MessageSquare,
  Globe,
  Plus,
  ExternalLink,
  Rocket,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { articles, solutions } from '@/lib/fallback-data';
import { Toast, ToastType } from '@/components/admin/Toast';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [messageCount, setMessageCount] = useState<string>('—');
  const [unreadCount, setUnreadCount] = useState(0);
  const [deploying, setDeploying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Fetch message count
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/admin/messages');
        if (res.ok) {
          const data = await res.json();
          setMessageCount(data.messages.length.toString());
          setUnreadCount(data.unreadCount);
        }
      } catch {
        // Keep default
      }
    }
    fetchMessages();
  }, []);

  // Deploy
  const handleDeploy = async () => {
    setDeploying(true);
    try {
      // We trigger deploy via a simple API call
      const res = await fetch('/api/admin/deploy', { method: 'POST' });
      if (res.ok) {
        setToast({ message: 'Déploiement déclenché avec succès !', type: 'success' });
      } else {
        throw new Error('Erreur');
      }
    } catch {
      setToast({ message: 'Erreur de déploiement. Vérifiez NETLIFY_BUILD_HOOK.', type: 'error' });
    } finally {
      setDeploying(false);
    }
  };

  const stats = [
    {
      label: 'Articles',
      value: articles.length.toString(),
      icon: FileText,
      gradient: 'from-[#0EA5E9] to-[#38BDF8]',
      href: '/admin/articles',
    },
    {
      label: 'Solutions',
      value: solutions.length.toString(),
      icon: Layers,
      gradient: 'from-[#A855F7] to-[#EC4899]',
      href: '/admin/articles',
    },
    {
      label: 'Messages',
      value: messageCount,
      badge: unreadCount > 0 ? unreadCount : undefined,
      icon: MessageSquare,
      gradient: 'from-[#F97316] to-[#EAB308]',
      href: '/admin/messages',
    },
    {
      label: 'Statut du site',
      value: 'En ligne',
      icon: Globe,
      gradient: 'from-[#22C55E] to-[#10B981]',
      href: '#',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bonjour{session?.user?.name ? `, ${session.user.name}` : ''} !
        </h1>
        <p className="text-ink-secondary text-sm mt-1">
          Voici un aperçu de votre site Projectview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-0.5 relative"
          >
            {/* Unread badge */}
            {'badge' in stat && stat.badge && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {stat.badge}
              </span>
            )}
            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono tracking-tight leading-none">
                  {stat.value}
                </p>
                <p className="text-xs text-ink-secondary mt-1">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          Voir le site
        </Link>
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {deploying ? (
            <>
              <div className="w-4 h-4 border-2 border-ink-tertiary/30 border-t-ink-secondary rounded-full animate-spin" />
              Déploiement...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Déployer
            </>
          )}
        </button>
      </div>

      {/* Recent Articles */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Articles récents
          </h2>
          <Link
            href="/admin/articles"
            className="text-xs text-brand-teal hover:text-brand-teal/80 transition-colors flex items-center gap-1"
          >
            Tout voir
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {articles.slice(0, 5).map((article) => (
            <Link
              key={article.slug}
              href={`/admin/articles/${article.slug}/edit`}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                  <span className="text-sm text-ink-primary truncate">{article.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal">
                  {article.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-ink-tertiary">
                  <Clock className="w-3 h-3" />
                  {article.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity feed placeholder */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary mb-4">
          Activité récente
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-ink-tertiary">
          <TrendingUp className="w-8 h-8 mb-3 opacity-30" />
          <p className="text-sm">L&apos;activité sera enregistrée ici.</p>
        </div>
      </div>
    </div>
  );
}
