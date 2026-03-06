'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Page-level error boundary — catches errors in Server Components and page renders.
// The root layout (Navbar, Footer) is preserved.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev; could be replaced with an error tracking service
    console.error('[Error boundary]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-32">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto">
          <span className="text-2xl">⚡</span>
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-ink-primary tracking-tight">
            Une erreur est survenue
          </h1>
          <p className="text-ink-secondary leading-relaxed">
            Un problème inattendu s&apos;est produit. Si l&apos;erreur persiste,
            rechargez la page pour récupérer le contenu le plus récent.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-brand-teal/15 text-brand-teal border border-brand-teal/30 hover:bg-brand-teal/25 transition-colors cursor-pointer"
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

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="text-xs text-ink-tertiary font-mono">
            Ref : {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
