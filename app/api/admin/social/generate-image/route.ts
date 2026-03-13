import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent';

export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const { prompt, format = 'landscape' } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'prompt est requis' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY manquant' }, { status: 500 });
    }

    const fullPrompt = buildSocialPrompt(prompt, format);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erreur Gemini API (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts;

    if (!parts?.length) {
      throw new Error('Aucune image générée par Gemini');
    }

    const imagePart = parts.find(
      (p: { inlineData?: { mimeType: string; data: string } }) =>
        p.inlineData?.mimeType?.startsWith('image/')
    );

    if (!imagePart?.inlineData?.data) {
      throw new Error('Aucune image trouvée dans la réponse Gemini');
    }

    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    const ext = imagePart.inlineData.mimeType === 'image/jpeg' ? 'jpg' : 'png';
    const fileName = `social-${Date.now()}.${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, fileName), imageBuffer);

    return NextResponse.json({ imagePath: `/images/uploads/${fileName}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildSocialPrompt(userPrompt: string, format: string): string {
  const aspectRatio =
    format === 'square'
      ? 'square (1:1), optimised for Instagram — strong central subject, bold crop'
      : 'landscape (1.91:1), optimised for Facebook and LinkedIn — wide scene with clear focal point';

  return `Create a social media photograph for the following concept. Format: ${aspectRatio}.

Concept: "${userPrompt}"

The image must feel authentic and human — like a real photograph, not a CGI render or generic stock image.

Visual approach:
- Translate the concept into a SPECIFIC, CONCRETE real-world scene. Show the idea, don't just symbolise it.
- Authentic environments: real offices, real showrooms, real products in use, real spaces with natural imperfections
- Human presence where relevant: hands touching a screen, silhouettes in a bright room, a person's back facing an impressive display — no faces
- Varied, natural lighting: window light, soft indoor light, a mix of warm and cool sources — whatever serves the concept
- Photography style that fits: reportage, architectural, lifestyle, product — choose based on the subject
- Bold composition that stops the scroll: strong contrast, interesting angle, something unexpected in the frame

Avoid:
- Dark backgrounds + floating glowing 3D objects
- Neon teal/purple sci-fi aesthetics
- Hollow "technology" clichés (handshakes, people pointing at charts, abstract circuits)
- Any text, logos, watermarks, or overlaid UI elements

Generate the image only, no text in the response.`;
}
