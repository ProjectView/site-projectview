import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllDocuments, addDocument, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/knowledge-base';
import { extractTextFromFile } from '@/lib/extract-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET — Liste tous les documents
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const kb = getAllDocuments();
  return NextResponse.json(kb);
}

// POST — Upload d'un nouveau document
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier le type MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Type non supporté : ${file.type}. Types acceptés : PDF, PNG, JPEG, TXT.` },
        { status: 400 }
      );
    }

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum : ${MAX_FILE_SIZE / 1024 / 1024} Mo.` },
        { status: 400 }
      );
    }

    // Lire le buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extraire le texte
    const extractedText = await extractTextFromFile(buffer, file.type, file.name);

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Aucun texte n'a pu être extrait de ce fichier." },
        { status: 400 }
      );
    }

    // Sauvegarder
    const doc = addDocument(file.name, file.type, buffer, extractedText);

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
