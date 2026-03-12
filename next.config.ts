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

  // Security headers only — cache strategy managed in netlify.toml
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
    ];
  },
};

export default nextConfig;
