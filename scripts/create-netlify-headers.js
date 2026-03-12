/**
 * Postbuild script: creates .next/_headers so Netlify CDN serves
 * CSS/JS static assets with the correct MIME types.
 *
 * Why: @netlify/plugin-nextjs routes requests through Edge Functions,
 * which can override Content-Type to text/plain. A _headers file in
 * the publish directory (.next/) is processed before Edge Functions
 * and ensures the correct MIME type is always returned.
 */

const fs = require('fs');
const path = require('path');

const headers = `\
/_next/static/chunks/*.css
  Content-Type: text/css; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/_next/static/css/*.css
  Content-Type: text/css; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/_next/static/chunks/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/_next/static/chunks/*.mjs
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/_next/static/media/*
  Cache-Control: public, max-age=31536000, immutable
`;

const outPath = path.join('.next', '_headers');
fs.writeFileSync(outPath, headers, 'utf8');
console.log('✓ Created .next/_headers with MIME type rules');
