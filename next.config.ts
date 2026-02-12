import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output for Docker deployment
  output: 'standalone',

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
