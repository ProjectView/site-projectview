'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Marketing error boundary]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-32">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center mx-auto">
          <span className="text-2xl">⚡</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-ink-primary tracking-tight">
            Oups, une erreur inattendue
          </h1>
          <p className="text-ink-secondary leading-relaxed">
            Cette page a rencontré un problème. Rechargez pour obtenir
            la version la plus récente du site.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-brand-teal to-brand-green text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            Recharger la page
          </button>
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/[0.05] text-ink-secondary border border-white/[0.10] hover:bg-white/[0.10] transition-colors cursor-pointer"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/[0.05] text-ink-secondary border border-white/[0.10] hover:bg-white/[0.10] transition-colors"
          >
            Accueil
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-ink-tertiary font-mono">Ref : {error.digest}</p>
        )}
      </div>
    </div>
  );
}
