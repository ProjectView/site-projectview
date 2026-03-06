'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin error boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-dark-bg">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <span className="text-lg">⚠️</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-ink-primary">Erreur dans le back-office</h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Un problème est survenu. Rechargez la page ou revenez au tableau de bord.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-teal/15 text-brand-teal border border-brand-teal/25 hover:bg-brand-teal/25 transition-colors cursor-pointer"
          >
            Recharger la page
          </button>
          <button
            onClick={reset}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.04] text-ink-secondary border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Réessayer
          </button>
          <Link
            href="/admin"
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            ← Tableau de bord
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-ink-tertiary font-mono">Ref : {error.digest}</p>
        )}
      </div>
    </div>
  );
}
