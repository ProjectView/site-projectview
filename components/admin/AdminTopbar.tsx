'use client';

import { usePathname } from 'next/navigation';
import { Menu, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const pageNames: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/articles': 'Articles',
  '/admin/articles/new': 'Nouvel article',
  '/admin/messages': 'Messages',
  '/admin/chatbot': 'Chatbot',
  '/admin/settings': 'Paramètres',
};

interface AdminTopbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function AdminTopbar({ sidebarCollapsed, onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();

  // Resolve page name (support dynamic routes like /admin/articles/[slug]/edit)
  let pageName = pageNames[pathname] || '';
  if (!pageName && pathname.startsWith('/admin/articles/') && pathname.endsWith('/edit')) {
    pageName = 'Modifier l\'article';
  }
  if (!pageName) pageName = 'Admin';

  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-dark-bg/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-[68px]' : 'ml-64'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/[0.06] text-ink-secondary cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-tertiary">Admin</span>
          <span className="text-ink-tertiary">/</span>
          <span className="text-ink-primary font-medium">{pageName}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Deploy status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-ink-secondary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green" />
          </span>
          En ligne
        </div>

        {/* View site link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voir le site</span>
        </Link>
      </div>
    </header>
  );
}
