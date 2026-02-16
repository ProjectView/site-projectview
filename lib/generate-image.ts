import fs from 'fs';
import path from 'path';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

/**
 * Generate a blog article banner image using Gemini 2.5 Flash Image (Nano Banana).
 * Saves the image to public/images/blog/{slug}.png and returns the public path.
 */
export async function generateArticleImage(
  title: string,
  excerpt: string,
  slug: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY manquant dans .env.local');
  }

  const prompt = buildPrompt(title, excerpt);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erreur Gemini API (${response.status}): ${errText}`);
  }

  const data = await response.json();

  // Extract image from response parts
  const parts = data.candidates?.[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('Aucune image générée par Gemini');
  }

  const imagePart = parts.find(
    (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData?.mimeType?.startsWith('image/')
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error('Aucune image trouvée dans la réponse Gemini');
  }

  // Decode base64 and save to public/images/blog/
  const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const ext = imagePart.inlineData.mimeType === 'image/jpeg' ? 'jpg' : 'png';
  const fileName = `${slug}.${ext}`;

  const imagesDir = path.join(process.cwd(), 'public', 'images', 'blog');
  fs.mkdirSync(imagesDir, { recursive: true });

  const filePath = path.join(imagesDir, fileName);
  fs.writeFileSync(filePath, imageBuffer);

  return `/images/blog/${fileName}`;
}

function buildPrompt(title: string, excerpt: string): string {
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
