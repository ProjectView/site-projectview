import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ─── Types ────────────────────────────────────────────────
export interface KnowledgeDocument {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  extractedText: string;
  tokenEstimate: number;
  createdAt: string;
}

interface KnowledgeBase {
  documents: KnowledgeDocument[];
  totalTokenEstimate: number;
}

// ─── Constants ────────────────────────────────────────────
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
export const MAX_DOCUMENTS = 50;
export const MAX_TOTAL_TOKENS = 120_000;
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
];

const DATA_DIR = path.join(process.cwd(), 'data');
const KB_JSON = path.join(DATA_DIR, 'knowledge-base.json');
const KB_FILES_DIR = path.join(DATA_DIR, 'knowledge-base');

// ─── Helpers ──────────────────────────────────────────────

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(KB_FILES_DIR)) fs.mkdirSync(KB_FILES_DIR, { recursive: true });
}

function readKB(): KnowledgeBase {
  ensureDirs();
  if (!fs.existsSync(KB_JSON)) {
    const empty: KnowledgeBase = { documents: [], totalTokenEstimate: 0 };
    fs.writeFileSync(KB_JSON, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(KB_JSON, 'utf-8'));
}

function writeKB(kb: KnowledgeBase) {
  ensureDirs();
  kb.totalTokenEstimate = kb.documents.reduce((sum, d) => sum + d.tokenEstimate, 0);
  fs.writeFileSync(KB_JSON, JSON.stringify(kb, null, 2));
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'application/pdf': '.pdf',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'text/plain': '.txt',
  };
  return map[mimeType] || '.bin';
}

// ─── CRUD ─────────────────────────────────────────────────

export function getAllDocuments(): KnowledgeBase {
  return readKB();
}

export function getDocumentById(id: string): KnowledgeDocument | null {
  const kb = readKB();
  return kb.documents.find((d) => d.id === id) || null;
}

export function addDocument(
  originalName: string,
  mimeType: string,
  fileBuffer: Buffer,
  extractedText: string
): KnowledgeDocument {
  const kb = readKB();

  // Validations
  if (kb.documents.length >= MAX_DOCUMENTS) {
    throw new Error(`Limite atteinte : maximum ${MAX_DOCUMENTS} documents.`);
  }

  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux : maximum ${MAX_FILE_SIZE / 1024 / 1024} Mo.`);
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Type de fichier non supporté : ${mimeType}`);
  }

  const tokenEstimate = estimateTokens(extractedText);
  if (kb.totalTokenEstimate + tokenEstimate > MAX_TOTAL_TOKENS) {
    throw new Error(
      `Limite de tokens dépassée. Actuellement ${kb.totalTokenEstimate.toLocaleString()} / ${MAX_TOTAL_TOKENS.toLocaleString()} tokens. Ce fichier ajouterait ~${tokenEstimate.toLocaleString()} tokens.`
    );
  }

  const id = crypto.randomUUID();
  const storedName = `${id}${getExtension(mimeType)}`;

  // Sauvegarder le fichier sur disque
  ensureDirs();
  fs.writeFileSync(path.join(KB_FILES_DIR, storedName), fileBuffer);

  const doc: KnowledgeDocument = {
    id,
    originalName,
    storedName,
    mimeType,
    size: fileBuffer.length,
    extractedText,
    tokenEstimate,
    createdAt: new Date().toISOString(),
  };

  kb.documents.push(doc);
  writeKB(kb);

  return doc;
}

export function removeDocument(id: string): boolean {
  const kb = readKB();
  const idx = kb.documents.findIndex((d) => d.id === id);
  if (idx === -1) return false;

  const doc = kb.documents[idx];

  // Supprimer le fichier du disque
  const filePath = path.join(KB_FILES_DIR, doc.storedName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  kb.documents.splice(idx, 1);
  writeKB(kb);

  return true;
}

// ─── Context Builder (CAG) ────────────────────────────────

export function buildKnowledgeContext(): string {
  const kb = readKB();
  if (kb.documents.length === 0) return '';

  const sections = kb.documents.map(
    (doc) => `[Document: ${doc.originalName}]\n${doc.extractedText}`
  );

  return (
    '\n\n--- BASE DE CONNAISSANCES ---\n' +
    sections.join('\n\n') +
    '\n--- FIN DE LA BASE DE CONNAISSANCES ---'
  );
}
