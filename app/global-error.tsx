'use client';

// Global error boundary — catches errors in the root layout itself.
// Must render its own <html> and <body> since it replaces the entire layout.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <head>
        <title>Une erreur est survenue — Projectview</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #0A0A0B;
            color: #EDEDEF;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .container { max-width: 480px; width: 100%; text-align: center; }
          .icon { font-size: 3rem; margin-bottom: 24px; }
          h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 12px; }
          p { color: #8B8B8E; font-size: 0.9rem; line-height: 1.6; margin-bottom: 32px; }
          .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
          button, a {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 20px; border-radius: 999px; font-size: 0.875rem; font-weight: 500;
            cursor: pointer; text-decoration: none; border: none; transition: opacity 0.2s;
          }
          button:hover, a:hover { opacity: 0.8; }
          .btn-primary {
            background: linear-gradient(135deg, #3B7A8C, #6B9B37);
            color: #fff;
          }
          .btn-secondary {
            background: transparent;
            color: #8B8B8E;
            border: 1px solid rgba(255,255,255,0.10);
          }
          .digest { margin-top: 24px; font-size: 0.7rem; color: #5C5C5F; font-family: monospace; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon">⚡</div>
          <h1>Une erreur est survenue</h1>
          <p>
            Un problème inattendu s&apos;est produit lors du chargement de la page.
            Rechargez la page pour récupérer le contenu le plus récent.
          </p>
          <div className="actions">
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Recharger la page
            </button>
            <button className="btn-secondary" onClick={reset}>
              Réessayer
            </button>
          </div>
          {error.digest && (
            <p className="digest">Ref : {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
