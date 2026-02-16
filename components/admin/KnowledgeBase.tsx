'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  Image,
  File,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface KnowledgeDocument {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  extractedText: string;
  tokenEstimate: number;
  createdAt: string;
}

interface KnowledgeBaseData {
  documents: KnowledgeDocument[];
  totalTokenEstimate: number;
}

const MAX_TOTAL_TOKENS = 120_000;
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
];

// ─── Helpers ──────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFileIcon(mimeType: string) {
  if (mimeType === 'application/pdf') return <FileText className="w-5 h-5 text-red-400" />;
  if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-400" />;
  return <File className="w-5 h-5 text-gray-400" />;
}

function getMimeLabel(mimeType: string): string {
  const map: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'text/plain': 'TXT',
  };
  return map[mimeType] || mimeType;
}

// ─── Component ────────────────────────────────────────────

export function KnowledgeBase() {
  const [data, setData] = useState<KnowledgeBaseData>({ documents: [], totalTokenEstimate: 0 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Fetch documents ───────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/knowledge-base');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      console.error('Erreur chargement base de connaissances');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ─── Upload ────────────────────────────────────────────
  const handleUpload = async (files: FileList | File[]) => {
    setError('');

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Type non supporté : ${file.name}. Acceptés : PDF, PNG, JPEG, TXT.`);
        return;
      }
    }

    setUploading(true);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(
        fileArray.length > 1
          ? `Extraction ${i + 1}/${fileArray.length} : ${file.name}...`
          : `Extraction en cours : ${file.name}...`
      );

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/knowledge-base', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Erreur lors de l\'upload');
          break;
        }
      } catch {
        setError(`Erreur réseau pour ${file.name}`);
        break;
      }
    }

    setUploading(false);
    setUploadProgress('');
    fetchDocuments();
  };

  // ─── Delete ────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/knowledge-base/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDocuments();
        if (expandedId === id) setExpandedId(null);
      } else {
        const json = await res.json();
        setError(json.error || 'Erreur lors de la suppression');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Drag & Drop ──────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // ─── Token bar ─────────────────────────────────────────
  const tokenPercent = Math.min((data.totalTokenEstimate / MAX_TOTAL_TOKENS) * 100, 100);
  const tokenWarning = tokenPercent > 80;

  // ─── Render ────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white">Base de connaissances</h3>
        <p className="text-sm text-white/50 mt-1">
          Uploadez des documents pour enrichir les réponses du chatbot. Le contenu est injecté
          automatiquement dans le contexte de chaque conversation.
        </p>
      </div>

      {/* Token Progress Bar */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Tokens utilisés</span>
          <span className="text-sm font-mono text-white/70">
            {data.totalTokenEstimate.toLocaleString()} / {MAX_TOTAL_TOKENS.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              tokenWarning
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-brand-teal to-brand-green'
            }`}
            style={{ width: `${tokenPercent}%` }}
          />
        </div>
        {tokenWarning && (
          <div className="flex items-center gap-2 mt-2 text-orange-400 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Attention : plus de 80% de la capacité utilisée</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300 flex-1">{error}</p>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragOver
              ? 'border-brand-teal bg-brand-teal/10'
              : 'border-white/[0.12] hover:border-white/[0.25] bg-white/[0.02] hover:bg-white/[0.04]'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
            <p className="text-sm text-white/70">{uploadProgress}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <Upload className="w-6 h-6 text-white/40" />
            </div>
            <div>
              <p className="text-sm text-white/70">
                Glissez vos fichiers ici ou{' '}
                <span className="text-brand-teal hover:underline">parcourir</span>
              </p>
              <p className="text-xs text-white/40 mt-1">PDF, PNG, JPEG, TXT — 10 Mo max par fichier</p>
            </div>
          </div>
        )}
      </div>

      {/* Document List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
        </div>
      ) : data.documents.length === 0 ? (
        <div className="text-center py-8 text-white/30 text-sm">
          Aucun document dans la base de connaissances
        </div>
      ) : (
        <div className="space-y-2">
          {data.documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden transition-colors hover:border-white/[0.12]"
            >
              {/* Document Row */}
              <div className="flex items-center gap-3 p-3">
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                  {getFileIcon(doc.mimeType)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{doc.originalName}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                    <span className="px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px] font-medium uppercase">
                      {getMimeLabel(doc.mimeType)}
                    </span>
                    <span>{formatFileSize(doc.size)}</span>
                    <span>·</span>
                    <span>~{doc.tokenEstimate.toLocaleString()} tokens</span>
                    <span>·</span>
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                    className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                    title="Voir le texte extrait"
                  >
                    {expandedId === doc.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Preview */}
              {expandedId === doc.id && (
                <div className="border-t border-white/[0.06] p-3">
                  <p className="text-xs text-white/40 mb-2 font-medium">Texte extrait :</p>
                  <div className="max-h-48 overflow-y-auto bg-white/[0.02] rounded-lg p-3">
                    <pre className="text-xs text-white/60 whitespace-pre-wrap font-sans leading-relaxed">
                      {doc.extractedText.length > 3000
                        ? doc.extractedText.slice(0, 3000) + '\n\n[... tronqué pour l\'aperçu]'
                        : doc.extractedText}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-white/30">
        {data.documents.length} document{data.documents.length !== 1 ? 's' : ''} · Le contenu est
        automatiquement injecté dans le contexte du chatbot à chaque conversation.
      </p>
    </div>
  );
}
