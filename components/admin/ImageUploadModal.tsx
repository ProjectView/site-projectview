'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';

interface ImageUploadModalProps {
  onConfirm: (markdownPath: string, alt: string) => void;
  onClose: () => void;
}

export function ImageUploadModal({ onConfirm, onClose }: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Accept a File object ────────────────────────────────────────────────────
  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Le fichier doit être une image (JPG, PNG, WebP, GIF…).');
      return;
    }
    setError(null);
    setFile(f);
    // Auto-fill alt from filename (without extension)
    setAlt((prev) => prev || f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  // ── Drag & drop ─────────────────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  // ── Paste (Ctrl+V) ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) handleFile(f);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile]);

  // ── Close on Escape ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // ── Upload & insert ─────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi.');
      onConfirm(data.path, alt.trim() || 'image');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setAlt('');
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-dark-surface border border-white/[0.10] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-ink-primary tracking-tight">
            Insérer une image
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Drop zone or preview */}
          {!preview ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                aspect-[16/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3
                cursor-pointer transition-all duration-200 select-none
                ${dragging
                  ? 'border-brand-teal bg-brand-teal/[0.07] scale-[1.01]'
                  : 'border-white/[0.12] bg-white/[0.02] hover:border-white/[0.22] hover:bg-white/[0.04]'
                }
              `}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-brand-teal/20' : 'bg-white/[0.04]'}`}>
                <Upload className={`w-5 h-5 transition-colors ${dragging ? 'text-brand-teal' : 'text-ink-tertiary'}`} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-ink-secondary">
                  {dragging ? 'Relâchez pour déposer' : 'Glissez une image ici'}
                </p>
                <p className="text-xs text-ink-tertiary">ou cliquez pour parcourir</p>
                <p className="text-[11px] text-ink-tertiary/60 mt-0.5">
                  Ctrl+V pour coller depuis le presse-papiers
                </p>
              </div>
              <p className="text-[10px] text-ink-tertiary/50 uppercase tracking-widest">
                JPG · PNG · WebP · GIF
              </p>
            </div>
          ) : (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-dark-elevated group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="aperçu" className="w-full h-full object-cover" />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 border border-white/20 text-white text-xs font-medium hover:bg-black/90"
                >
                  <X className="w-3.5 h-3.5" />
                  Changer
                </button>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = '';
            }}
          />

          {/* Alt text */}
          <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold text-ink-tertiary block mb-1.5">
              Texte alternatif
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description de l'image pour l'accessibilité…"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/10 transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/[0.08] border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-ink-secondary bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!file || uploading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-green to-brand-orange text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Envoi…
                </>
              ) : (
                'Insérer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
