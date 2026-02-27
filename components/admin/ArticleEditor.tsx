'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  FileText,
  Tag,
  User,
  Clock,
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image,
  ImagePlus,
  Loader2,
  BarChart2,
} from 'lucide-react';
import NextImage from 'next/image';
import { categories } from '@/lib/fallback-data';
import type { Article } from '@/lib/fallback-data';
import { Toast, ToastType } from './Toast';
import { ImageUploadModal } from './ImageUploadModal';
import { SeoPanel, computeSeoScore } from './SeoPanel';

interface ArticleEditorProps {
  initialData?: Article;
  mode: 'create' | 'edit';
}

const authors = [
  { name: 'Sophie Martin', bio: "Experte en solutions d'affichage dynamique chez Projectview" },
  { name: 'Thomas Bernard', bio: 'Directeur technique et passionné de réalité virtuelle' },
  { name: 'Claire Rousseau', bio: 'Spécialiste IA et automatisation chez Projectview' },
  { name: 'Pierre Lefèvre', bio: 'Consultant en transformation digitale des espaces de travail' },
];

// Simple markdown to HTML for preview
function markdownToHtml(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-brand-teal">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Images — must come BEFORE links to avoid conflict
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<figure class="my-4"><img src="$2" alt="$1" class="w-full rounded-xl object-cover" /><figcaption class="text-center text-xs text-ink-tertiary mt-1 italic">$1</figcaption></figure>'
    )
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-teal underline">$1</a>')
    // Image prompt callouts — render as a simple notice in preview
    .replace(
      /\[IMAGE: ([^\|]+)\|\|[^\]]+\]/g,
      '<div class="my-4 rounded-xl border border-dashed border-brand-teal/30 bg-brand-teal/5 px-4 py-3 text-xs text-brand-teal font-mono">🖼️ $1</div>'
    )
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-brand-teal/40 pl-4 italic text-ink-secondary my-4">$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\* )(.+)$/gm, '<li class="ml-4 list-disc">$2</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br/>');

  // Wrap in paragraph
  html = `<p class="mb-4">${html}</p>`;

  return html;
}

export function ArticleEditor({ initialData, mode }: ArticleEditorProps) {
  const router = useRouter();
  const [rightPanel, setRightPanel] = useState<'preview' | 'seo'>('preview');
  const [seoScore, setSeoScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categorySlug, setCategorySlug] = useState(initialData?.categorySlug || '');
  const [authorIndex, setAuthorIndex] = useState(() => {
    if (initialData?.author) {
      const idx = authors.findIndex((a) => a.name === initialData.author);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [generatingImage, setGeneratingImage] = useState(false);

  // Image upload modal
  const [showImageModal, setShowImageModal] = useState(false);
  // Textarea ref + saved cursor position for image insertion
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const savedCursorPos = useRef<number>(0);

  const selectedCategory = categories.find((c) => c.slug === categorySlug);
  const selectedAuthor = authors[authorIndex];

  // Debounced SEO score for tab badge
  useEffect(() => {
    const t = setTimeout(() => {
      setSeoScore(computeSeoScore(title, excerpt, content, coverImage));
    }, 400);
    return () => clearTimeout(t);
  }, [title, excerpt, content, coverImage]);

  // Generate cover image with Gemini
  const handleGenerateImage = async () => {
    if (!title.trim()) {
      setToast({ message: 'Ajoutez un titre avant de générer l\'image.', type: 'error' });
      return;
    }

    setGeneratingImage(true);
    setToast({ message: 'Génération de l\'image en cours... Cela peut prendre 10-20 secondes.', type: 'info' });

    try {
      // Generate slug for filename
      const slugForImage = initialData?.slug || title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const res = await fetch('/api/admin/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim() || title.trim(),
          slug: slugForImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur de génération');
      }

      setCoverImage(data.imagePath);
      setToast({ message: 'Image générée avec succès !', type: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setToast({ message, type: 'error' });
    } finally {
      setGeneratingImage(false);
    }
  };

  // Open image modal — save current cursor position
  const handleOpenImageModal = useCallback(() => {
    savedCursorPos.current = textareaRef.current?.selectionStart ?? content.length;
    setShowImageModal(true);
  }, [content.length]);

  // Insert image markdown at saved cursor position
  const handleImageConfirm = useCallback((path: string, alt: string) => {
    setShowImageModal(false);
    const imageMarkdown = `\n\n![${alt}](${path})\n\n`;
    setContent((prev) => {
      const pos = savedCursorPos.current;
      return prev.slice(0, pos) + imageMarkdown + prev.slice(pos);
    });
    // Restore focus
    setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        const newPos = savedCursorPos.current + imageMarkdown.length;
        ta.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }, []);

  // Insert markdown at cursor inside the textarea
  const insertMarkdown = useCallback((prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const newValue =
      textarea.value.substring(0, start) + prefix + selected + suffix + textarea.value.substring(end);

    setContent(newValue);

    setTimeout(() => {
      textarea.focus();
      const pos = start + prefix.length + selected.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  }, []);

  // Save article
  const handleSave = async () => {
    if (!title.trim()) {
      setToast({ message: 'Le titre est requis.', type: 'error' });
      return;
    }
    if (!content.trim()) {
      setToast({ message: 'Le contenu est requis.', type: 'error' });
      return;
    }
    if (!categorySlug) {
      setToast({ message: 'La catégorie est requise.', type: 'error' });
      return;
    }

    setSaving(true);

    try {
      const url = mode === 'create'
        ? '/api/admin/articles'
        : `/api/admin/articles/${initialData?.slug}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const body = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: selectedCategory?.name || '',
        categorySlug,
        author: selectedAuthor.name,
        authorBio: selectedAuthor.bio,
        coverImage: coverImage || undefined,
        ...(mode === 'edit' && {
          originalTitle: initialData?.title,
          date: initialData?.date,
        }),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur serveur');
      }

      setToast({
        message: mode === 'create'
          ? 'Article publié avec succès !'
          : 'Article mis à jour avec succès !',
        type: 'success',
      });

      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/articles');
        router.refresh();
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setToast({ message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Image upload modal */}
      {showImageModal && (
        <ImageUploadModal
          onConfirm={handleImageConfirm}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/articles')}
            className="flex items-center gap-2 text-ink-secondary hover:text-ink-primary transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className="text-xl font-bold tracking-tight">
            {mode === 'create' ? 'Nouvel article' : 'Modifier l\'article'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publication...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {mode === 'create' ? 'Publier' : 'Enregistrer'}
            </>
          )}
        </button>
      </div>

      {/* Main content area */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Editor side */}
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Le titre de votre article..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-lg font-semibold text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 transition-all"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              Extrait
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumé court de l'article (affiché dans les listes)..."
              rows={2}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 transition-all resize-none"
            />
          </div>

          {/* Category + Author row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" />
                Catégorie
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-teal/50 transition-all cursor-pointer appearance-none"
              >
                <option value="" className="bg-dark-surface">Choisir...</option>
                {categories.filter((c) => c.slug !== 'tous').map((cat) => (
                  <option key={cat.slug} value={cat.slug} className="bg-dark-surface">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" />
                Auteur
              </label>
              <select
                value={authorIndex}
                onChange={(e) => setAuthorIndex(Number(e.target.value))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-teal/50 transition-all cursor-pointer appearance-none"
              >
                {authors.map((author, i) => (
                  <option key={author.name} value={i} className="bg-dark-surface">
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Markdown toolbar */}
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <ToolbarButton icon={Heading1} label="H1" onClick={() => insertMarkdown('# ')} />
            <ToolbarButton icon={Heading2} label="H2" onClick={() => insertMarkdown('## ')} />
            <div className="w-px h-5 bg-white/[0.08] mx-1" />
            <ToolbarButton icon={Bold} label="Gras" onClick={() => insertMarkdown('**', '**')} />
            <ToolbarButton icon={Italic} label="Italique" onClick={() => insertMarkdown('*', '*')} />
            <div className="w-px h-5 bg-white/[0.08] mx-1" />
            <ToolbarButton icon={List} label="Liste" onClick={() => insertMarkdown('- ')} />
            <ToolbarButton icon={ListOrdered} label="Liste num." onClick={() => insertMarkdown('1. ')} />
            <ToolbarButton icon={Quote} label="Citation" onClick={() => insertMarkdown('> ')} />
            <div className="w-px h-5 bg-white/[0.08] mx-1" />
            <ToolbarButton icon={Link2} label="Lien" onClick={() => insertMarkdown('[', '](url)')} />
            <ToolbarButton icon={Image} label="Insérer une image" onClick={handleOpenImageModal} />
          </div>

          {/* Content textarea */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              Contenu
            </label>
            <ContentTextarea
              value={content}
              onChange={setContent}
              textareaRef={textareaRef}
            />
          </div>

          {/* Cover image generation */}
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-ink-secondary uppercase tracking-wider">
                <ImagePlus className="w-3.5 h-3.5" />
                Image de couverture
              </label>
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={generatingImage || !title.trim()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-teal/15 text-brand-teal hover:bg-brand-teal/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generatingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-3.5 h-3.5" />
                    Générer avec Gemini
                  </>
                )}
              </button>
            </div>

            {coverImage ? (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-dark-elevated">
                <NextImage
                  src={coverImage}
                  alt="Couverture de l'article"
                  fill
                  className="object-cover"
                  sizes="600px"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] flex items-center justify-center">
                <p className="text-xs text-ink-tertiary">
                  {generatingImage ? 'Génération en cours...' : 'Aucune image — cliquez sur "Générer avec Gemini"'}
                </p>
              </div>
            )}
          </div>

          {/* Meta info */}
          {initialData && (
            <div className="flex items-center gap-4 text-xs text-ink-tertiary">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {initialData.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {initialData.readTime} de lecture
              </div>
            </div>
          )}
        </div>

        {/* Right panel — Aperçu / SEO tabs */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden sticky top-24 max-h-[calc(100vh-160px)] flex flex-col">
          {/* Tab header */}
          <div className="flex items-center gap-1 px-4 pt-4 pb-0 flex-shrink-0">
            <button
              type="button"
              onClick={() => setRightPanel('preview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                rightPanel === 'preview'
                  ? 'bg-white/[0.08] text-ink-primary'
                  : 'text-ink-tertiary hover:text-ink-secondary hover:bg-white/[0.04]'
              }`}
            >
              Aperçu
            </button>
            <button
              type="button"
              onClick={() => setRightPanel('seo')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                rightPanel === 'seo'
                  ? 'bg-white/[0.08] text-ink-primary'
                  : 'text-ink-tertiary hover:text-ink-secondary hover:bg-white/[0.04]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Analyse SEO
              {/* Score badge */}
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  seoScore >= 70
                    ? 'bg-brand-green/15 text-brand-green'
                    : seoScore >= 40
                    ? 'bg-brand-orange/15 text-brand-orange'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {seoScore}
              </span>
            </button>
            <div className="flex-1 h-px bg-white/[0.06] ml-2 mt-1 self-end mb-[9px]" />
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6 pt-5">
            {rightPanel === 'preview' ? (
              <>
                <div className="mb-6">
                  {selectedCategory && (
                    <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-brand-teal/15 text-brand-teal mb-3">
                      {selectedCategory.name}
                    </span>
                  )}
                  <h1 className="text-2xl font-bold tracking-tight mb-3">
                    {title || 'Titre de l\'article'}
                  </h1>
                  {excerpt && (
                    <p className="text-ink-secondary text-sm mb-4 italic">{excerpt}</p>
                  )}
                  {coverImage && (
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-dark-elevated mb-4">
                      <NextImage
                        src={coverImage}
                        alt="Couverture"
                        fill
                        className="object-cover"
                        sizes="600px"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-ink-tertiary mb-6 pb-4 border-b border-white/[0.06]">
                    <span>Par {selectedAuthor.name}</span>
                    <span>·</span>
                    <span>{initialData?.date || 'Aujourd\'hui'}</span>
                  </div>
                </div>
                <div
                  className="prose-custom text-sm text-ink-primary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(content || 'Commencez à écrire...') }}
                />
              </>
            ) : (
              <SeoPanel
                title={title}
                excerpt={excerpt}
                content={content}
                coverImage={coverImage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Simple auto-resizing content textarea ─────────────────────────────────────
function ContentTextarea({
  value,
  onChange,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  textareaRef: { current: HTMLTextAreaElement | null };
}) {
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.max(ta.scrollHeight, 480)}px`;
    }
  }, [value, textareaRef]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Commencez à rédiger votre article en markdown…&#10;&#10;## Titre de section&#10;&#10;Votre texte ici…"
      className="w-full min-h-[480px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm font-mono text-ink-primary placeholder:text-ink-tertiary/50 outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 transition-all leading-relaxed"
      style={{ overflow: 'hidden', resize: 'vertical' }}
      spellCheck={false}
    />
  );
}

// Toolbar button sub-component
function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex items-center justify-center w-8 h-8 rounded-md text-ink-tertiary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
