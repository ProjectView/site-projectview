/**
 * Extraction de texte depuis différents types de fichiers.
 * - PDF : via pdf-parse
 * - TXT : lecture directe UTF-8
 * - PNG/JPEG : OpenAI Vision (gpt-4o-mini)
 */

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  switch (mimeType) {
    case 'text/plain':
      return extractFromText(buffer);
    case 'application/pdf':
      return extractFromPDF(buffer);
    case 'image/png':
    case 'image/jpeg':
      return extractFromImage(buffer, mimeType);
    default:
      throw new Error(`Type de fichier non supporté pour l'extraction : ${mimeType}`);
  }
}

// ─── TXT ──────────────────────────────────────────────────

function extractFromText(buffer: Buffer): string {
  return buffer.toString('utf-8').trim();
}

// ─── PDF ──────────────────────────────────────────────────

async function extractFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid edge runtime issues
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  await parser.destroy();
  return result.text.trim();
}

// ─── Images (OpenAI Vision) ──────────────────────────────

async function extractFromImage(buffer: Buffer, mimeType: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY manquant — nécessaire pour extraire le texte des images.');
  }

  const base64 = buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Extrais tout le texte visible dans cette image. Si c'est un schéma ou un diagramme, décris-le en détail. Réponds uniquement avec le contenu extrait, sans commentaire.",
            },
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Erreur OpenAI Vision : ${response.status} — ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}
