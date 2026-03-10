import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

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
      ? 'square format (1:1 aspect ratio), optimized for Instagram'
      : 'landscape format (1.91:1 aspect ratio), optimized for Facebook and LinkedIn';

  return `Generate a professional social media image for the following concept. The image should be ${aspectRatio}.

Concept: "${userPrompt}"

Style requirements:
- Modern, premium aesthetic with clean lines
- Dark/moody atmosphere with warm accent colors (teal, orange, green tones)
- Abstract or conceptual — do NOT include any text, logos, or watermarks
- Professional photography or 3D render style
- Suitable for a technology company focused on interactive displays, VR, AI, and collaboration
- High contrast, cinematic lighting
- No people's faces visible, no stock photo feel
- Bold, eye-catching composition that works on social media

Generate the image only, no text in the response.`;
}
