'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Facebook,
  Instagram,
  Linkedin,
  Calendar,
  Clock,
  Send,
  Trash2,
  Edit2,
  ImageIcon,
  Sparkles,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { CustomDatePicker } from '@/components/admin/CustomDatePicker';

// ── Types ──────────────────────────────────────────────────────────────────

type Platform = 'facebook' | 'instagram' | 'linkedin';
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'partial';

interface PlatformResult {
  success: boolean;
  postId?: string;
  error?: string;
}

interface SocialPost {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  platformResults?: {
    facebook?: PlatformResult;
    instagram?: PlatformResult;
    linkedin?: PlatformResult;
  };
  createdAt: string;
  updatedAt: string;
}

// ── Config ─────────────────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    bg: 'bg-blue-600/15',
    border: 'border-blue-600/30',
    text: 'text-blue-400',
    maxChars: 63206,
    Icon: Facebook,
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    bg: 'bg-pink-600/15',
    border: 'border-pink-600/30',
    text: 'text-pink-400',
    maxChars: 2200,
    Icon: Instagram,
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    bg: 'bg-sky-600/15',
    border: 'border-sky-600/30',
    text: 'text-sky-400',
    maxChars: 3000,
    Icon: Linkedin,
  },
} as const;

const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  draft: {
    label: 'Brouillon',
    bg: 'bg-white/[0.06]',
    text: 'text-ink-secondary',
    dot: 'bg-ink-secondary',
  },
  scheduled: {
    label: 'Planifié',
    bg: 'bg-brand-teal/15',
    text: 'text-brand-teal-light',
    dot: 'bg-brand-teal',
  },
  published: {
    label: 'Publié',
    bg: 'bg-brand-green/15',
    text: 'text-brand-green',
    dot: 'bg-brand-green',
  },
  partial: {
    label: 'Partiel',
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  failed: {
    label: 'Échec',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getEffectiveMaxChars(platforms: Platform[]): number {
  if (!platforms.length) return 3000;
  return Math.min(...platforms.map((p) => PLATFORM_CONFIG[p].maxChars));
}

// ── Platform Icons Row ─────────────────────────────────────────────────────

function PlatformIcons({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="flex gap-1">
      {platforms.map((p) => {
        const cfg = PLATFORM_CONFIG[p];
        return (
          <span
            key={p}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}
          >
            <cfg.Icon className="w-3 h-3" />
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PostStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
        type === 'success'
          ? 'bg-brand-green/15 border-brand-green/30 text-brand-green'
          : 'bg-red-500/15 border-red-500/30 text-red-400'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Compose Modal ─────────────────────────────────────────────────────────

interface ComposeModalProps {
  post?: SocialPost | null;
  onClose: () => void;
  onSaved: () => void;
}

function ComposeModal({ post, onClose, onSaved }: ComposeModalProps) {
  const [content, setContent] = useState(post?.content ?? '');
  const [platforms, setPlatforms] = useState<Platform[]>(post?.platforms ?? ['facebook']);
  const [mediaUrl, setMediaUrl] = useState(post?.mediaUrl ?? '');
  const [mediaType, setMediaType] = useState<'image' | 'video'>(post?.mediaType ?? 'image');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>(
    post?.scheduledAt ? 'later' : 'now'
  );
  const [scheduledDate, setScheduledDate] = useState(
    post?.scheduledAt ? post.scheduledAt.slice(0, 10) : ''
  );
  const [scheduledTime, setScheduledTime] = useState(
    post?.scheduledAt ? post.scheduledAt.slice(11, 16) : '09:00'
  );

  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxChars = getEffectiveMaxChars(platforms);
  const isOverLimit = content.length > maxChars;

  function togglePlatform(p: Platform) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMediaUrl(data.path);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload');
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleGenerateImage() {
    if (!aiPrompt.trim()) return;
    setGeneratingImage(true);
    setError('');
    try {
      const format = platforms.includes('instagram') && !platforms.includes('facebook') && !platforms.includes('linkedin')
        ? 'square'
        : 'landscape';
      const res = await fetch('/api/admin/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, format }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMediaUrl(data.imagePath);
      setMediaType('image');
      setShowAiPanel(false);
      setAiPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur génération image');
    } finally {
      setGeneratingImage(false);
    }
  }

  function buildPayload(status: 'draft' | 'scheduled') {
    const scheduledAt =
      scheduleMode === 'later' && scheduledDate
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined;
    return {
      content,
      platforms,
      ...(mediaUrl ? { mediaUrl, mediaType } : {}),
      status: scheduleMode === 'later' ? 'scheduled' : status,
      ...(scheduledAt ? { scheduledAt } : {}),
    };
  }

  async function handleSaveDraft() {
    if (!content.trim() || !platforms.length) {
      setError('Contenu et réseaux sont requis');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const method = post ? 'PATCH' : 'POST';
      const url = post ? `/api/admin/social/${post.id}` : '/api/admin/social';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload('draft')),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublishNow() {
    if (!content.trim() || !platforms.length) {
      setError('Contenu et réseaux sont requis');
      return;
    }
    setPublishing(true);
    setError('');
    try {
      // Save first (or update)
      const method = post ? 'PATCH' : 'POST';
      const url = post ? `/api/admin/social/${post.id}` : '/api/admin/social';
      const saveRes = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...buildPayload('draft'), status: 'draft' }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) throw new Error(saved.error);

      const postId = post?.id ?? saved.id;

      // Then publish
      const publishRes = await fetch(`/api/admin/social/${postId}/publish`, {
        method: 'POST',
      });
      const publishData = await publishRes.json();
      if (!publishRes.ok) throw new Error(publishData.error);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur publication');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-surface border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-ink-primary">
            {post ? 'Modifier le post' : 'Nouveau post'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Platform selector */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-3">
              Réseaux sociaux
            </label>
            <div className="flex gap-3">
              {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((p) => {
                const cfg = PLATFORM_CONFIG[p];
                const selected = platforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selected
                        ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                        : 'bg-white/[0.03] border-white/[0.08] text-ink-secondary hover:border-white/[0.15]'
                    }`}
                  >
                    <cfg.Icon className="w-4 h-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-ink-secondary uppercase tracking-wider">
                Contenu
              </label>
              <span
                className={`text-xs tabular-nums ${
                  isOverLimit
                    ? 'text-red-400'
                    : content.length > maxChars * 0.9
                    ? 'text-yellow-400'
                    : 'text-ink-tertiary'
                }`}
              >
                {content.length.toLocaleString()} / {maxChars.toLocaleString()}
                {platforms.length > 0 && (
                  <span className="ml-1 text-ink-tertiary">
                    (limite {platforms.find((p) => PLATFORM_CONFIG[p].maxChars === maxChars) ?? ''})
                  </span>
                )}
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Rédigez votre post..."
              className="w-full bg-dark-elevated border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ink-primary placeholder-ink-tertiary resize-none focus:outline-none focus:border-brand-teal/50 transition-colors"
            />
          </div>

          {/* Media section */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-3">
              Média (optionnel)
            </label>

            {mediaUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-dark-elevated">
                {mediaType === 'image' ? (
                  <img
                    src={mediaUrl}
                    alt="Aperçu"
                    className="w-full max-h-64 object-cover"
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    className="w-full max-h-64"
                    controls
                  />
                )}
                <button
                  onClick={() => { setMediaUrl(''); }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-ink-secondary hover:text-ink-primary hover:border-white/[0.15] transition-all disabled:opacity-50"
                >
                  {uploadingFile ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Uploader
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/quicktime"
                  className="hidden"
                  onChange={handleUpload}
                />

                <button
                  onClick={() => setShowAiPanel(!showAiPanel)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    showAiPanel
                      ? 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                      : 'border-white/[0.08] bg-white/[0.03] text-ink-secondary hover:text-ink-primary hover:border-white/[0.15]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Générer avec IA
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAiPanel ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}

            {/* AI prompt panel */}
            {showAiPanel && !mediaUrl && (
              <div className="mt-3 p-4 bg-dark-elevated rounded-xl border border-white/[0.06] space-y-3">
                <p className="text-xs text-ink-secondary">
                  Décrivez l&apos;image à générer via Gemini Nano Banana Pro.
                  {platforms.includes('instagram') && !platforms.includes('facebook') && !platforms.includes('linkedin')
                    ? ' Format carré (1:1) optimisé pour Instagram.'
                    : ' Format paysage (1.91:1) optimisé pour Facebook et LinkedIn.'}
                </p>
                <div className="flex gap-2">
                  <input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateImage(); }}
                    placeholder="Ex: Écran tactile moderne dans un showroom lumineux..."
                    className="flex-1 bg-dark-bg border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-brand-gold/50 transition-colors"
                  />
                  <button
                    onClick={handleGenerateImage}
                    disabled={generatingImage || !aiPrompt.trim()}
                    className="px-4 py-2 rounded-lg bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-sm font-medium hover:bg-brand-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {generatingImage ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Générer
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-3">
              Publication
            </label>
            <div className="flex gap-3 mb-4">
              {['now', 'later'].map((m) => (
                <button
                  key={m}
                  onClick={() => setScheduleMode(m as 'now' | 'later')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    scheduleMode === m
                      ? 'bg-brand-teal/15 border-brand-teal/30 text-brand-teal-light'
                      : 'border-white/[0.08] bg-white/[0.03] text-ink-secondary hover:border-white/[0.15]'
                  }`}
                >
                  {m === 'now' ? (
                    <><Send className="w-4 h-4" /> Publier maintenant</>
                  ) : (
                    <><Calendar className="w-4 h-4" /> Planifier</>
                  )}
                </button>
              ))}
            </div>

            {scheduleMode === 'later' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ink-tertiary mb-1.5">Date</label>
                  <CustomDatePicker
                    value={scheduledDate}
                    onChange={setScheduledDate}
                  />
                </div>
                <div>
                  <label className="block text-xs text-ink-tertiary mb-1.5">Heure</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary pointer-events-none" />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-dark-elevated border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instagram warning */}
          {platforms.includes('instagram') && !mediaUrl && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Instagram requiert une image pour publier. Ajoutez un média ci-dessus.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] transition-colors"
          >
            Annuler
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={saving || !content.trim() || !platforms.length}
              className="px-4 py-2 rounded-xl border border-white/[0.10] bg-white/[0.04] text-sm text-ink-primary hover:bg-white/[0.08] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              {scheduleMode === 'later' ? 'Planifier' : 'Brouillon'}
            </button>
            {scheduleMode === 'now' && (
              <button
                onClick={handlePublishNow}
                disabled={publishing || !content.trim() || !platforms.length || isOverLimit}
                className="px-5 py-2 rounded-xl bg-brand-teal text-white text-sm font-medium hover:bg-brand-teal-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {publishing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Publier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────

interface PostCardProps {
  post: SocialPost;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
  publishing: boolean;
}

function PostCard({ post, onEdit, onDelete, onPublish, publishing }: PostCardProps) {
  const isDue =
    post.status === 'scheduled' &&
    post.scheduledAt &&
    new Date(post.scheduledAt) <= new Date();

  return (
    <div className="bg-dark-surface border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.10] transition-all group">
      {/* Media preview */}
      {post.mediaUrl && post.mediaType === 'image' && (
        <div className="aspect-video overflow-hidden bg-dark-elevated">
          <img
            src={post.mediaUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      {post.mediaUrl && post.mediaType === 'video' && (
        <div className="aspect-video bg-dark-elevated flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Eye className="w-6 h-6 text-ink-secondary" />
          </div>
        </div>
      )}
      {!post.mediaUrl && (
        <div className="aspect-video bg-dark-elevated flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-ink-tertiary" />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Status + platforms */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={post.status} />
          <PlatformIcons platforms={post.platforms} />
        </div>

        {/* Content preview */}
        <p className="text-sm text-ink-secondary line-clamp-3">{post.content}</p>

        {/* Date info */}
        <div className="text-xs text-ink-tertiary flex items-center gap-1.5">
          {post.status === 'scheduled' && post.scheduledAt && (
            <>
              <Calendar className="w-3.5 h-3.5" />
              <span className={isDue ? 'text-yellow-400' : ''}>
                {isDue ? 'En attente — ' : 'Planifié : '}
                {formatDate(post.scheduledAt)}
              </span>
            </>
          )}
          {post.status === 'published' && post.publishedAt && (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-brand-green" />
              <span>Publié le {formatDate(post.publishedAt)}</span>
            </>
          )}
          {post.status === 'draft' && (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span>Créé le {formatDate(post.createdAt)}</span>
            </>
          )}
        </div>

        {/* Platform results for partial/failed */}
        {(post.status === 'partial' || post.status === 'failed') && post.platformResults && (
          <div className="space-y-1">
            {(Object.entries(post.platformResults) as [Platform, PlatformResult][]).map(
              ([platform, result]) => (
                <div key={platform} className="flex items-center gap-2 text-xs">
                  {result.success ? (
                    <CheckCircle className="w-3.5 h-3.5 text-brand-green" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span className="capitalize text-ink-secondary">{PLATFORM_CONFIG[platform]?.label}</span>
                  {!result.success && result.error && (
                    <span className="text-red-400 truncate">{result.error}</span>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Éditer
          </button>
          {post.status !== 'published' && (
            <button
              onClick={onPublish}
              disabled={publishing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-brand-teal hover:text-brand-teal-light hover:bg-brand-teal/10 transition-colors disabled:opacity-50"
            >
              {publishing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Publier
            </button>
          )}
          <button
            onClick={onDelete}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

type FilterTab = 'all' | PostStatus;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'draft', label: 'Brouillons' },
  { id: 'scheduled', label: 'Planifiés' },
  { id: 'published', label: 'Publiés' },
  { id: 'failed', label: 'Échecs' },
  { id: 'partial', label: 'Partiels' },
];

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<SocialPost | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/social');
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handlePublish(post: SocialPost) {
    setPublishingId(post.id);
    try {
      const res = await fetch(`/api/admin/social/${post.id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const status: PostStatus = data.results?.status ?? 'published';
      setToast({
        message:
          status === 'published'
            ? 'Post publié avec succès !'
            : status === 'partial'
            ? 'Post partiellement publié (voir détails)'
            : 'Échec de la publication',
        type: status === 'failed' ? 'error' : 'success',
      });
      await loadPosts();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Erreur publication',
        type: 'error',
      });
    } finally {
      setPublishingId(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/admin/social/${id}`, { method: 'DELETE' });
      setToast({ message: 'Post supprimé', type: 'success' });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setToast({ message: 'Erreur suppression', type: 'error' });
    } finally {
      setDeleteConfirmId(null);
    }
  }

  const filtered =
    activeFilter === 'all' ? posts : posts.filter((p) => p.status === activeFilter);

  const counts: Record<FilterTab, number> = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    published: posts.filter((p) => p.status === 'published').length,
    failed: posts.filter((p) => p.status === 'failed').length,
    partial: posts.filter((p) => p.status === 'partial').length,
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary">Réseaux Sociaux</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Créez et publiez vos posts sur Facebook, Instagram et LinkedIn
          </p>
        </div>
        <button
          onClick={() => { setEditPost(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-medium hover:bg-brand-teal-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Nouveau post
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-dark-elevated rounded-xl border border-white/[0.06] w-fit mb-8 flex-wrap">
        {FILTER_TABS.map((tab) => {
          const count = counts[tab.id];
          if (tab.id !== 'all' && count === 0) return null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-white/[0.08] text-ink-primary'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeFilter === tab.id ? 'bg-white/10' : 'bg-white/[0.05]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="w-8 h-8 text-ink-tertiary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-ink-tertiary" />
          </div>
          <p className="text-ink-secondary font-medium">Aucun post</p>
          <p className="text-sm text-ink-tertiary mt-1">
            {activeFilter === 'all'
              ? 'Créez votre premier post avec le bouton ci-dessus'
              : `Aucun post avec le statut "${STATUS_CONFIG[activeFilter as PostStatus]?.label ?? activeFilter}"`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              publishing={publishingId === post.id}
              onEdit={() => { setEditPost(post); setShowModal(true); }}
              onDelete={() => setDeleteConfirmId(post.id)}
              onPublish={() => handlePublish(post)}
            />
          ))}
        </div>
      )}

      {/* Compose modal */}
      {showModal && (
        <ComposeModal
          post={editPost}
          onClose={() => { setShowModal(false); setEditPost(null); }}
          onSaved={() => {
            loadPosts();
            setToast({ message: 'Post sauvegardé', type: 'success' });
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-surface border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-ink-primary mb-2">Supprimer ce post ?</h3>
            <p className="text-sm text-ink-secondary mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.10] text-sm text-ink-secondary hover:text-ink-primary transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-400 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
