import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Note: 'standalone' output is for Docker only — incompatible with Netlify
  // output: 'standalone',

  // Allow preview tool to load /_next/* chunks from different origin in dev
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  images: {
    // Allow images from Strapi
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.projectview.fr',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
  },

  // Performance: compress responses
  compress: true,

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Empêcher le navigateur de cacher le HTML des pages.
          // Sans ça, après un redéploiement le browser peut charger du vieux HTML
          // qui référence des chunks JS/CSS supprimés → 404 → site cassé.
          // Note: la règle suivante (js|css|...) override ce header pour les
          // assets statiques, donc ils restent immutably cached.
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(js|css|woff2|woff|ttf|ico|svg|png|jpg|jpeg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
