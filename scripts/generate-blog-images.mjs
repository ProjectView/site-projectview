#!/usr/bin/env node

/**
 * One-shot script: Generate banner images for all existing blog articles
 * using Gemini 2.0 Flash image generation.
 *
 * Usage: node scripts/generate-blog-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'blog');

const GEMINI_API_KEY = 'AIzaSyDR-ib0LvoJ63LdLVAGXVmoU9ro48Kv3w4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

const articles = [
  {
    slug: 'affichage-dynamique-retail-2025',
    title: "Comment l'affichage dynamique transforme le retail en 2025",
    excerpt: "Découvrez comment les écrans interactifs révolutionnent l'expérience en magasin et augmentent l'engagement client de manière spectaculaire.",
  },
  {
    slug: 'vr-immobiliere-vente-avant-construction',
    title: 'VR immobilière : vendre un bien avant sa construction',
    excerpt: 'La réalité virtuelle permet aux promoteurs de proposer des visites immersives de projets encore sur plan.',
  },
  {
    slug: 'ia-relation-client-b2b',
    title: "L'IA au service de la relation client B2B",
    excerpt: "Comment un assistant IA personnalisé peut réduire le temps de réponse et améliorer la satisfaction client dans un contexte professionnel.",
  },
  {
    slug: 'tendances-collaboration-hybride-2025',
    title: 'Les tendances de la collaboration hybride en 2025',
    excerpt: "Le travail hybride est là pour rester. Découvrez les technologies qui rendent la collaboration à distance aussi naturelle qu'en présentiel.",
  },
  {
    slug: 'retail-2025-experience-client',
    title: "Retail 2025 : l'expérience client comme avantage compétitif",
    excerpt: "Dans un monde où le e-commerce domine, le magasin physique doit se réinventer. L'expérience immersive est la clé.",
  },
  {
    slug: 'choisir-table-tactile-negociation',
    title: 'Comment choisir sa table tactile de négociation',
    excerpt: 'Guide complet pour sélectionner la table tactile idéale pour vos espaces de vente et de présentation.',
  },
];

function buildPrompt(title, excerpt) {
  return `Generate a professional, modern blog banner image for the following article. The image should be wide format (16:9 aspect ratio), visually striking, and suitable as a hero/cover image for a tech blog.

Article title: "${title}"
Article summary: "${excerpt}"

Style requirements:
- Modern, premium aesthetic with clean lines
- Dark/moody atmosphere with warm accent colors (teal, orange, green tones)
- Abstract or conceptual — do NOT include any text, logos, or watermarks
- Professional photography or 3D render style
- Suitable for a technology company website focused on interactive displays, VR, AI, and collaboration
- High contrast, cinematic lighting
- No people's faces, no stock photo feel

Generate the image only, no text in the response.`;
}

async function generateImage(article) {
  const prompt = buildPrompt(article.title, article.excerpt);

  console.log(`  Calling Gemini API...`);

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error('No parts in Gemini response');
  }

  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart?.inlineData?.data) {
    throw new Error('No image data in Gemini response');
  }

  const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const ext = imagePart.inlineData.mimeType === 'image/jpeg' ? 'jpg' : 'png';
  const fileName = `${article.slug}.${ext}`;
  const filePath = path.join(IMAGES_DIR, fileName);

  fs.writeFileSync(filePath, imageBuffer);

  return `/images/blog/${fileName}`;
}

async function main() {
  console.log('🎨 Generating blog article banner images with Gemini 2.0 Flash\n');

  // Ensure output directory exists
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const results = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`[${i + 1}/${articles.length}] ${article.title}`);

    // Check if image already exists
    const existingPng = path.join(IMAGES_DIR, `${article.slug}.png`);
    const existingJpg = path.join(IMAGES_DIR, `${article.slug}.jpg`);
    if (fs.existsSync(existingPng) || fs.existsSync(existingJpg)) {
      const ext = fs.existsSync(existingPng) ? 'png' : 'jpg';
      console.log(`  ⏭️  Already exists, skipping\n`);
      results.push({ slug: article.slug, path: `/images/blog/${article.slug}.${ext}` });
      continue;
    }

    try {
      const imagePath = await generateImage(article);
      console.log(`  ✅ Saved: ${imagePath}\n`);
      results.push({ slug: article.slug, path: imagePath });

      // Wait 2 seconds between requests to avoid rate limits
      if (i < articles.length - 1) {
        console.log(`  ⏳ Waiting 2s...\n`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}\n`);
      results.push({ slug: article.slug, path: null, error: error.message });
    }
  }

  console.log('\n📊 Results:');
  console.log('─'.repeat(60));
  for (const r of results) {
    if (r.path) {
      console.log(`  ✅ ${r.slug} → ${r.path}`);
    } else {
      console.log(`  ❌ ${r.slug} → ${r.error}`);
    }
  }

  // Output coverImage mappings for fallback-data.ts
  console.log('\n📝 Add these coverImage fields to fallback-data.ts:');
  for (const r of results) {
    if (r.path) {
      console.log(`  coverImage: '${r.path}',`);
    }
  }
}

main().catch(console.error);
