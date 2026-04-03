'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  RefreshCw,
  Settings2,
  Bot,
  Send,
  Loader2,
  Check,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface EditorialItem {
  id: string;
  date: string;
  theme: string;
  platform: string[];
  format?: string;
  objective?: string;
  status: 'planifie' | 'en-cours' | 'genere';
  linkedSlug?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface EditorialConfig {
  activePlatforms: string[];
  audience: string;
  targetSectors: string[];
  themes: string;
  avoidTopics: string;
  tone: string;
  preferredFormats: string[];
  postsPerPlatform: Record<string, number>;
  keyMoments: string;
  objectives: string[];
  preferredCTA: string;
  inspirations: string;
  brandColorPrimary: string;
  brandColorSecondary: string;
  brandColorAccent: string;
  visualStyle: string;
  logoUrl?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

// Platform brand colors
const PLATFORM_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  instagram: { bg: 'bg-pink-500/20', text: 'text-pink-400', label: 'IN' },
  linkedin: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'LI' },
  facebook: { bg: 'bg-blue-600/20', text: 'text-blue-300', label: 'FB' },
  tiktok: { bg: 'bg-white/10', text: 'text-white', label: 'TK' },
};

const FORMAT_LABELS: Record<string, string> = {
  carousel: '🔄',
  photo: '📸',
  video: '🎬',
  citation: '💬',
  story: '⭕',
  infographie: '📊',
};

// ── Calendar Helpers ───────────────────────────────────────────────────────────

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function toDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

function isPast(dateStr: string) {
  return new Date(dateStr + 'T00:00:00') < new Date(new Date().toDateString());
}

// ── Platform Badge ─────────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: string }) {
  const p = PLATFORM_COLORS[platform] ?? { bg: 'bg-white/10', text: 'text-ink-secondary', label: platform.slice(0, 2).toUpperCase() };
  return (
    <span className={`inline-flex items-center justify-center px-1 py-0.5 rounded text-[9px] font-bold ${p.bg} ${p.text}`}>
      {p.label}
    </span>
  );
}

// ── Social Post Card (calendar cell) ──────────────────────────────────────────

function SocialPostCard({
  item,
  onClick,
}: {
  item: EditorialItem;
  onClick: () => void;
}) {
  const statusStyles = {
    planifie: 'border-white/[0.08] bg-white/[0.02]',
    'en-cours': 'border-brand-orange/30 bg-brand-orange/[0.04]',
    genere: 'border-green-500/30 bg-green-500/[0.04]',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-1.5 hover:border-white/[0.2] transition-all cursor-pointer group ${statusStyles[item.status]}`}
    >
      {/* Platform badges + format */}
      <div className="flex items-center gap-1 mb-1">
        {(item.platform ?? []).slice(0, 3).map((p) => (
          <PlatformBadge key={p} platform={p} />
        ))}
        {item.format && (
          <span className="ml-auto text-[10px] opacity-60">{FORMAT_LABELS[item.format] ?? ''}</span>
        )}
        {item.status === 'genere' && (
          <Check className="w-2.5 h-2.5 text-green-400 ml-auto flex-shrink-0" />
        )}
      </div>
      {/* Theme */}
      <p className="text-[10px] leading-tight text-ink-secondary group-hover:text-ink-primary transition-colors line-clamp-2">
        {item.theme}
      </p>
    </button>
  );
}

// ── Day Popover ────────────────────────────────────────────────────────────────

function DayPopover({
  items,
  onSelectItem,
  onClose,
}: {
  items: EditorialItem[];
  onSelectItem: (item: EditorialItem) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute z-30 top-full left-0 mt-1 w-64 bg-dark-elevated border border-white/[0.1] rounded-xl shadow-2xl p-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-ink-secondary">{items.length} posts</p>
        <button onClick={onClose} className="text-ink-tertiary hover:text-ink-primary cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <SocialPostCard key={item.id} item={item} onClick={() => { onSelectItem(item); onClose(); }} />
        ))}
      </div>
    </div>
  );
}

// ── Typeform Questionnaire ─────────────────────────────────────────────────────

type QuestionnaireAnswers = {
  activePlatforms: string[];
  audience: string;
  targetSectors: string[];
  themes: string;
  avoidTopics: string;
  tone: string;
  preferredFormats: string[];
  postsPerPlatform: Record<string, number>;
  keyMoments: string;
  objectives: string[];
  preferredCTA: string;
  inspirations: string;
  brandColorPrimary: string;
  brandColorSecondary: string;
  brandColorAccent: string;
  visualStyle: string;
};

const DEFAULT_ANSWERS: QuestionnaireAnswers = {
  activePlatforms: [],
  audience: '',
  targetSectors: [],
  themes: '',
  avoidTopics: '',
  tone: '',
  preferredFormats: [],
  postsPerPlatform: {},
  keyMoments: '',
  objectives: [],
  preferredCTA: '',
  inspirations: '',
  brandColorPrimary: '#3B7A8C',
  brandColorSecondary: '#6B9B37',
  brandColorAccent: '#D4842A',
  visualStyle: '',
};

function TypeformQuestionnaire({
  onComplete,
  initialConfig,
}: {
  onComplete: (config: EditorialConfig) => Promise<void>;
  initialConfig?: EditorialConfig | null;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => {
    if (!initialConfig) return DEFAULT_ANSWERS;
    return {
      activePlatforms: initialConfig.activePlatforms ?? [],
      audience: initialConfig.audience ?? '',
      targetSectors: initialConfig.targetSectors ?? [],
      themes: initialConfig.themes ?? '',
      avoidTopics: initialConfig.avoidTopics ?? '',
      tone: initialConfig.tone ?? '',
      preferredFormats: initialConfig.preferredFormats ?? [],
      postsPerPlatform: initialConfig.postsPerPlatform ?? {},
      keyMoments: initialConfig.keyMoments ?? '',
      objectives: initialConfig.objectives ?? [],
      preferredCTA: initialConfig.preferredCTA ?? '',
      inspirations: initialConfig.inspirations ?? '',
      brandColorPrimary: initialConfig.brandColorPrimary ?? '#3B7A8C',
      brandColorSecondary: initialConfig.brandColorSecondary ?? '#6B9B37',
      brandColorAccent: initialConfig.brandColorAccent ?? '#D4842A',
      visualStyle: initialConfig.visualStyle ?? '',
    };
  });
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('');

  const TOTAL_STEPS = 16; // 0=welcome, 1-15=questions, 16=generating

  const goTo = (nextStep: number, dir: 'forward' | 'back' = 'forward') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 280);
  };

  const next = () => goTo(step + 1, 'forward');
  const back = () => goTo(step - 1, 'back');

  const toggleItem = (key: keyof QuestionnaireAnswers, value: string) => {
    const arr = (answers[key] as string[]) ?? [];
    setAnswers((prev) => ({
      ...prev,
      [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
    }));
  };

  const canContinue = (): boolean => {
    if (step === 0) return true;
    if (step === 1) return answers.activePlatforms.length > 0;
    if (step === 2) return answers.audience.trim().length > 0;
    if (step === 4) return answers.themes.trim().length > 0;
    if (step === 6) return answers.tone.length > 0;
    if (step === 14) return answers.visualStyle.length > 0;
    return true; // optional questions always allow continue
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const messages = [
      'Analyse de votre stratégie…',
      'Création des thèmes pour Instagram…',
      'Optimisation du calendrier LinkedIn…',
      'Répartition intelligente des posts…',
      'Finalisation du planning 3 mois…',
    ];
    let i = 0;
    setGenMessage(messages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setGenMessage(messages[i]);
    }, 1800);

    try {
      await onComplete({
        activePlatforms: answers.activePlatforms,
        audience: answers.audience,
        targetSectors: answers.targetSectors,
        themes: answers.themes,
        avoidTopics: answers.avoidTopics,
        tone: answers.tone,
        preferredFormats: answers.preferredFormats,
        postsPerPlatform: answers.postsPerPlatform,
        keyMoments: answers.keyMoments,
        objectives: answers.objectives,
        preferredCTA: answers.preferredCTA,
        inspirations: answers.inspirations,
        brandColorPrimary: answers.brandColorPrimary,
        brandColorSecondary: answers.brandColorSecondary,
        brandColorAccent: answers.brandColorAccent,
        visualStyle: answers.visualStyle,
      });
    } finally {
      clearInterval(interval);
      setGenerating(false);
    }
  };

  const progress = step === 0 ? 0 : Math.round((step / 15) * 100);

  const slideClass = animating
    ? direction === 'forward'
      ? 'opacity-0 translate-x-8'
      : 'opacity-0 -translate-x-8'
    : 'opacity-100 translate-x-0';

  return (
    <div className="fixed inset-0 z-50 bg-dark-bg flex flex-col">
      {/* Progress bar */}
      {step > 0 && (
        <div className="h-0.5 bg-white/[0.06] w-full">
          <div
            className="h-full bg-gradient-to-r from-brand-teal via-brand-green to-brand-orange transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Back button */}
      {step > 0 && !generating && (
        <button
          onClick={back}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
      )}

      {/* Step counter */}
      {step > 0 && step < 16 && (
        <div className="absolute top-6 right-6 text-xs text-ink-tertiary">
          {step} / 15
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div
          className={`w-full max-w-xl transition-all duration-300 ease-out ${slideClass}`}
        >
          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎯</div>
              <div>
                <h1 className="text-3xl font-bold text-ink-primary mb-3">
                  Créons votre stratégie<br />réseaux sociaux
                </h1>
                <p className="text-ink-secondary text-lg">
                  En quelques minutes, on génère un planning éditorial complet sur 3 mois, adapté à votre marque et vos objectifs.
                </p>
              </div>
              <button
                onClick={next}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-teal text-white text-lg font-semibold hover:bg-brand-teal-light transition-colors cursor-pointer"
              >
                Commencer <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ── Step 1: Active platforms ── */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">📱</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Sur quels réseaux êtes-vous actif ?</h2>
                <p className="text-ink-secondary">Sélectionnez tous ceux que vous utilisez ou souhaitez développer.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'instagram', label: 'Instagram', icon: '📸', desc: 'Photos, carousels, reels' },
                  { id: 'linkedin', label: 'LinkedIn', icon: '💼', desc: 'B2B, articles, actualités' },
                  { id: 'facebook', label: 'Facebook', icon: '👥', desc: 'Communauté, événements' },
                  { id: 'tiktok', label: 'TikTok', icon: '🎵', desc: 'Vidéos courtes, tendances' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleItem('activePlatforms', p.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      answers.activePlatforms.includes(p.id)
                        ? 'border-brand-teal bg-brand-teal/10 text-ink-primary'
                        : 'border-white/[0.08] bg-white/[0.02] text-ink-secondary hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <div className="font-semibold text-sm">{p.label}</div>
                    <div className="text-xs text-ink-tertiary mt-0.5">{p.desc}</div>
                    {answers.activePlatforms.includes(p.id) && (
                      <div className="mt-2 flex justify-end">
                        <Check className="w-4 h-4 text-brand-teal" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <ContinueButton onClick={next} disabled={!canContinue()} />
            </div>
          )}

          {/* ── Step 2: Audience ── */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">👥</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Décrivez vos clients idéaux</h2>
                <p className="text-ink-secondary">Qui sont-ils ? Quel est leur métier, leurs défis quotidiens ?</p>
              </div>
              <textarea
                value={answers.audience}
                onChange={(e) => setAnswers((p) => ({ ...p, audience: e.target.value }))}
                placeholder="Ex: Directeurs d'agences immobilières et architectes d'intérieur, qui cherchent à moderniser leurs showrooms et améliorer l'expérience client..."
                rows={4}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50 resize-none"
              />
              <ContinueButton onClick={next} disabled={!canContinue()} />
            </div>
          )}

          {/* ── Step 3: Target sectors ── */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">🏢</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Dans quels secteurs opèrent-ils ?</h2>
                <p className="text-ink-secondary">Sélectionnez tous les secteurs pertinents.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Retail', 'Architecture', 'Immobilier', 'Construction', 'Entreprises', 'Hôtellerie', 'Santé', 'Éducation'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleItem('targetSectors', s)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      answers.targetSectors.includes(s)
                        ? 'bg-brand-teal/20 border border-brand-teal/50 text-brand-teal'
                        : 'bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:border-white/[0.2]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <ContinueButton onClick={next} />
            </div>
          )}

          {/* ── Step 4: Themes ── */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">✍️</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Quels sujets voulez-vous aborder ?</h2>
                <p className="text-ink-secondary">Thématiques, expertises que vous souhaitez partager sur vos réseaux.</p>
              </div>
              <textarea
                value={answers.themes}
                onChange={(e) => setAnswers((p) => ({ ...p, themes: e.target.value }))}
                placeholder="Ex: transformation digitale des espaces de vente, avant/après de nos réalisations, conseils pour choisir ses écrans interactifs, coulisses de nos installations..."
                rows={4}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50 resize-none"
              />
              <ContinueButton onClick={next} disabled={!canContinue()} />
            </div>
          )}

          {/* ── Step 5: Avoid topics ── */}
          {step === 5 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Y a-t-il des sujets à éviter ?</h2>
                <p className="text-ink-secondary">Sujets sensibles, concurrents, thèmes hors charte… <span className="text-ink-tertiary">(optionnel)</span></p>
              </div>
              <textarea
                value={answers.avoidTopics}
                onChange={(e) => setAnswers((p) => ({ ...p, avoidTopics: e.target.value }))}
                placeholder="Ex: prix et tarifs, comparaisons avec des concurrents, sujets politiques..."
                rows={3}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50 resize-none"
              />
              <ContinueButton onClick={next} label="Continuer" />
            </div>
          )}

          {/* ── Step 6: Tone ── */}
          {step === 6 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">🎭</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Quel ton souhaitez-vous adopter ?</h2>
                <p className="text-ink-secondary">La voix de votre marque sur les réseaux sociaux.</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'professionnel', label: 'Professionnel', desc: 'Sérieux, fiable, expertise affirmée' },
                  { id: 'inspirant', label: 'Inspirant', desc: 'Élève la réflexion, donne envie d\'agir' },
                  { id: 'pédagogique', label: 'Pédagogique', desc: 'Explique, démystifie, éduque' },
                  { id: 'expert', label: 'Expert', desc: 'Pointu, technique, référence du secteur' },
                  { id: 'storytelling', label: 'Storytelling', desc: 'Raconte des histoires, émotionnel, humain' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setAnswers((p) => ({ ...p, tone: t.id })); setTimeout(next, 200); }}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      answers.tone === t.id
                        ? 'border-brand-teal bg-brand-teal/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-ink-primary">{t.label}</div>
                      <div className="text-xs text-ink-tertiary mt-0.5">{t.desc}</div>
                    </div>
                    {answers.tone === t.id && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 7: Preferred formats ── */}
          {step === 7 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Quels formats privilégiez-vous ?</h2>
                <p className="text-ink-secondary">Sélectionnez vos formats de contenu favoris.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'carousel', label: 'Carousels', icon: '🔄' },
                  { id: 'photo', label: 'Photos', icon: '📸' },
                  { id: 'video', label: 'Vidéos', icon: '🎬' },
                  { id: 'citation', label: 'Citations', icon: '💬' },
                  { id: 'story', label: 'Stories', icon: '⭕' },
                  { id: 'infographie', label: 'Infographies', icon: '📊' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleItem('preferredFormats', f.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      answers.preferredFormats.includes(f.id)
                        ? 'border-brand-teal bg-brand-teal/10 text-ink-primary'
                        : 'border-white/[0.08] bg-white/[0.02] text-ink-secondary hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="text-xl mb-1">{f.icon}</div>
                    <div className="text-xs font-medium">{f.label}</div>
                  </button>
                ))}
              </div>
              <ContinueButton onClick={next} />
            </div>
          )}

          {/* ── Step 8: Posts per platform ── */}
          {step === 8 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">📅</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Combien de posts par semaine ?</h2>
                <p className="text-ink-secondary">Définissez votre rythme pour chaque réseau actif.</p>
              </div>
              <div className="space-y-4">
                {answers.activePlatforms.map((platform) => {
                  const current = answers.postsPerPlatform[platform] ?? 2;
                  const icons: Record<string, string> = { instagram: '📸', linkedin: '💼', facebook: '👥', tiktok: '🎵' };
                  return (
                    <div key={platform} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icons[platform] ?? '📱'}</span>
                        <span className="text-sm font-medium text-ink-primary capitalize">{platform}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAnswers((p) => ({ ...p, postsPerPlatform: { ...p.postsPerPlatform, [platform]: Math.max(0, current - 1) } }))}
                          className="w-7 h-7 rounded-lg bg-white/[0.06] text-ink-secondary hover:text-ink-primary flex items-center justify-center cursor-pointer transition-colors"
                        >−</button>
                        <span className="text-lg font-bold text-ink-primary w-4 text-center">{current}</span>
                        <button
                          type="button"
                          onClick={() => setAnswers((p) => ({ ...p, postsPerPlatform: { ...p.postsPerPlatform, [platform]: Math.min(14, current + 1) } }))}
                          className="w-7 h-7 rounded-lg bg-white/[0.06] text-ink-secondary hover:text-ink-primary flex items-center justify-center cursor-pointer transition-colors"
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <ContinueButton onClick={next} />
            </div>
          )}

          {/* ── Step 9: Key moments ── */}
          {step === 9 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">📌</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Vos moments clés dans l'année ?</h2>
                <p className="text-ink-secondary">Salons, lancements, périodes stratégiques… <span className="text-ink-tertiary">(optionnel)</span></p>
              </div>
              <textarea
                value={answers.keyMoments}
                onChange={(e) => setAnswers((p) => ({ ...p, keyMoments: e.target.value }))}
                placeholder="Ex: Salon Bâtimat en novembre, lancement d'une nouvelle gamme en juin, rentrée septembre avec des offres spéciales..."
                rows={3}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50 resize-none"
              />
              <ContinueButton onClick={next} label="Continuer" />
            </div>
          )}

          {/* ── Step 10: Objectives ── */}
          {step === 10 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Quels sont vos objectifs ?</h2>
                <p className="text-ink-secondary">Ce que vous cherchez à accomplir avec votre présence sur les réseaux.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'Notoriété', icon: '📢' },
                  { id: 'Génération de leads', icon: '🎣' },
                  { id: 'Fidélisation', icon: '❤️' },
                  { id: 'Recrutement', icon: '🤝' },
                  { id: 'Trafic site web', icon: '🌐' },
                  { id: 'Engagement communauté', icon: '💬' },
                ].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleItem('objectives', o.id)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      answers.objectives.includes(o.id)
                        ? 'bg-brand-orange/20 border border-brand-orange/50 text-brand-orange'
                        : 'bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:border-white/[0.2]'
                    }`}
                  >
                    <span>{o.icon}</span> {o.id}
                  </button>
                ))}
              </div>
              <ContinueButton onClick={next} />
            </div>
          )}

          {/* ── Step 11: CTA ── */}
          {step === 11 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">💡</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Votre call-to-action principal ?</h2>
                <p className="text-ink-secondary">L'action que vous voulez que les gens fassent après avoir vu vos posts.</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'visiter-site', label: 'Visiter le site', desc: 'Découvrir vos solutions en ligne' },
                  { id: 'prendre-rdv', label: 'Prendre rendez-vous', desc: 'Planifier une démo ou une consultation' },
                  { id: 'contacter-equipe', label: 'Contacter l\'équipe', desc: 'Envoyer un message ou appeler' },
                  { id: 'decouvrir-solutions', label: 'Découvrir nos solutions', desc: 'Explorer votre catalogue de produits' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setAnswers((p) => ({ ...p, preferredCTA: c.id })); setTimeout(next, 200); }}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      answers.preferredCTA === c.id
                        ? 'border-brand-teal bg-brand-teal/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-ink-primary">{c.label}</div>
                      <div className="text-xs text-ink-tertiary mt-0.5">{c.desc}</div>
                    </div>
                    {answers.preferredCTA === c.id && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 12: Inspirations ── */}
          {step === 12 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">⭐</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Des comptes ou marques qui vous inspirent ?</h2>
                <p className="text-ink-secondary">Références visuelles ou éditoriales que vous aimez. <span className="text-ink-tertiary">(optionnel)</span></p>
              </div>
              <textarea
                value={answers.inspirations}
                onChange={(e) => setAnswers((p) => ({ ...p, inspirations: e.target.value }))}
                placeholder="Ex: @schneider_electric pour leur pédagogie, Legrand pour leur style épuré, Philips Lighting pour les visuels..."
                rows={3}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50 resize-none"
              />
              <ContinueButton onClick={next} label="Continuer" />
            </div>
          )}

          {/* ── Step 13: Brand colors ── */}
          {step === 13 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Quelles sont vos couleurs de marque ?</h2>
                <p className="text-ink-secondary">Elles seront utilisées pour guider la génération de vos visuels.</p>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'brandColorPrimary' as const, label: 'Couleur primaire', desc: 'Couleur principale de votre marque' },
                  { key: 'brandColorSecondary' as const, label: 'Couleur secondaire', desc: 'Couleur d\'accompagnement' },
                  { key: 'brandColorAccent' as const, label: 'Couleur d\'accent', desc: 'Pour les CTA et highlights' },
                ].map((c) => (
                  <div key={c.key} className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-white/10 flex-shrink-0"
                      style={{ backgroundColor: answers[c.key] }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink-primary">{c.label}</div>
                      <div className="text-xs text-ink-tertiary">{c.desc}</div>
                    </div>
                    <input
                      type="color"
                      value={answers[c.key]}
                      onChange={(e) => setAnswers((p) => ({ ...p, [c.key]: e.target.value }))}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={answers[c.key]}
                      onChange={(e) => setAnswers((p) => ({ ...p, [c.key]: e.target.value }))}
                      className="w-20 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-xs font-mono text-ink-primary focus:outline-none focus:border-brand-teal/50 uppercase"
                      maxLength={7}
                    />
                  </div>
                ))}
              </div>
              <ContinueButton onClick={next} />
            </div>
          )}

          {/* ── Step 14: Visual style ── */}
          {step === 14 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">🖼️</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Quel est votre style visuel ?</h2>
                <p className="text-ink-secondary">L'ambiance générale de votre identité graphique sur les réseaux.</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'minimaliste', label: 'Minimaliste', desc: 'Épuré, espaces, sobre — moins c\'est plus', icon: '◻️' },
                  { id: 'bold', label: 'Bold & graphique', desc: 'Impact visuel fort, couleurs vives, typographies puissantes', icon: '⬛' },
                  { id: 'editorial', label: 'Éditorial', desc: 'Photographique, soigné, storytelling visuel', icon: '📰' },
                  { id: 'lifestyle', label: 'Lifestyle', desc: 'Authentique, humain, couleurs douces et naturelles', icon: '🌿' },
                  { id: 'corporate', label: 'Corporate', desc: 'Professionnel, structuré, tons neutres', icon: '🏢' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setAnswers((p) => ({ ...p, visualStyle: s.id })); setTimeout(next, 200); }}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      answers.visualStyle === s.id
                        ? 'border-brand-teal bg-brand-teal/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-ink-primary">{s.label}</div>
                      <div className="text-xs text-ink-tertiary mt-0.5">{s.desc}</div>
                    </div>
                    {answers.visualStyle === s.id && <Check className="w-4 h-4 text-brand-teal flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 15: Logo upload (optional) ── */}
          {step === 15 && (
            <div className="space-y-8">
              <div>
                <div className="text-4xl mb-4">📎</div>
                <h2 className="text-2xl font-bold text-ink-primary mb-2">Uploadez votre logo</h2>
                <p className="text-ink-secondary">Il sera utilisé comme référence pour la cohérence visuelle. <span className="text-ink-tertiary">(optionnel)</span></p>
              </div>
              <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center">
                <div className="text-3xl mb-3">🖼️</div>
                <p className="text-sm text-ink-tertiary">Fonctionnalité disponible prochainement</p>
                <p className="text-xs text-ink-tertiary mt-1">PNG, SVG, JPG — max 2 Mo</p>
              </div>
              <ContinueButton onClick={handleGenerate} label="🚀 Générer mon planning" loading={generating} />
            </div>
          )}

          {/* ── Generating state ── */}
          {generating && (
            <div className="text-center space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-brand-teal/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-brand-teal animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink-primary mb-2">Claude génère votre planning…</h2>
                <p className="text-ink-secondary text-sm transition-all duration-500">{genMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContinueButton({
  onClick,
  disabled,
  label = 'Continuer',
  loading = false,
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {label} {!loading && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}

// ── Item Modal ─────────────────────────────────────────────────────────────────

function ItemModal({
  item,
  defaultDate,
  onSave,
  onDelete,
  onGenerateSocial,
  onClose,
}: {
  item?: EditorialItem;
  defaultDate?: string;
  onSave: (data: Partial<EditorialItem>) => Promise<void>;
  onDelete?: () => Promise<void>;
  onGenerateSocial?: () => Promise<void>;
  onClose: () => void;
}) {
  const [theme, setTheme] = useState(item?.theme ?? '');
  const [date, setDate] = useState(item?.date ?? defaultDate ?? '');
  const [platform, setPlatform] = useState<string[]>(item?.platform ?? []);
  const [format, setFormat] = useState(item?.format ?? '');
  const [objective, setObjective] = useState(item?.objective ?? '');
  const [status, setStatus] = useState<EditorialItem['status']>(item?.status ?? 'planifie');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);

  const togglePlatform = (p: string) =>
    setPlatform((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ theme, date, platform, format: format || undefined, objective: objective || undefined, status });
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleteLoading(true);
    try { await onDelete(); } finally { setDeleteLoading(false); }
  };

  const handleGenerate = async () => {
    if (!onGenerateSocial) return;
    setGenLoading(true);
    try { await onGenerateSocial(); } finally { setGenLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dark-elevated border border-white/[0.08] rounded-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h3 className="font-semibold text-ink-primary">{item ? 'Modifier le post' : 'Ajouter un post'}</h3>
          <button onClick={onClose} className="text-ink-tertiary hover:text-ink-primary cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-xs font-medium text-ink-tertiary mb-1.5">Idée / Thème du post</label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: Avant/après d'une installation showroom avec nos écrans interactifs"
              rows={3}
              required
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50 resize-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-ink-tertiary mb-1.5">Date de publication</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/50 [color-scheme:dark]"
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-xs font-medium text-ink-tertiary mb-1.5">Plateformes</label>
            <div className="flex gap-2">
              {['instagram', 'linkedin', 'facebook', 'tiktok'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                    platform.includes(p)
                      ? 'bg-brand-teal/20 border border-brand-teal/50 text-brand-teal'
                      : 'bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:border-white/[0.15]'
                  }`}
                >
                  {p.slice(0, 2).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-medium text-ink-tertiary mb-1.5">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/50"
            >
              <option value="">— Choisir un format —</option>
              <option value="carousel">🔄 Carousel</option>
              <option value="photo">📸 Photo</option>
              <option value="video">🎬 Vidéo</option>
              <option value="citation">💬 Citation</option>
              <option value="story">⭕ Story</option>
              <option value="infographie">📊 Infographie</option>
            </select>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs font-medium text-ink-tertiary mb-1.5">Objectif <span className="text-ink-tertiary font-normal">(optionnel)</span></label>
            <input
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ex: notoriété, engagement, leads..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50"
            />
          </div>

          {/* Status (edit mode) */}
          {item && (
            <div>
              <label className="block text-xs font-medium text-ink-tertiary mb-1.5">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EditorialItem['status'])}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-teal/50"
              >
                <option value="planifie">Planifié</option>
                <option value="en-cours">En cours</option>
                <option value="genere">Généré</option>
              </select>
            </div>
          )}

          {/* Generate action */}
          {item && item.status !== 'genere' && onGenerateSocial && (
            <div className="pt-1 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={genLoading}
                className="w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange hover:bg-brand-orange/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {genLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Générer le post social
              </button>
            </div>
          )}

          {/* Linked slug */}
          {item?.linkedSlug && (
            <a
              href="/admin/social"
              className="flex items-center gap-2 text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Voir le post généré →
            </a>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 pt-1">
            {item && onDelete && (
              <button type="button" onClick={handleDelete} disabled={deleteLoading} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50">
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            )}
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-brand-teal text-white hover:bg-brand-teal-light transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {item ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel, loading }: { message: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-elevated border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
          <p className="text-sm text-ink-secondary">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer">Annuler</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2 rounded-lg text-sm bg-brand-orange text-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function EditorialPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [items, setItems] = useState<EditorialItem[]>([]);
  const [config, setConfig] = useState<EditorialConfig | null>(null);
  const [loadingItems, setLoadingItems] = useState(true);

  // Modals
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<EditorialItem | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [regenerateLoading, setRegenerateLoading] = useState(false);
  const [overflowDay, setOverflowDay] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Load data ──────────────────────────────────────────────────────────────

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    setLoadingItems(true);
    try {
      const [itemsRes, configRes] = await Promise.all([
        fetch('/api/admin/editorial/items'),
        fetch('/api/admin/editorial/config'),
      ]);
      const itemsData = await itemsRes.json();
      const configData = await configRes.json();
      if (Array.isArray(itemsData)) setItems(itemsData);
      if (configData.config) {
        setConfig(configData.config);
      } else {
        setShowQuestionnaire(true);
      }
    } catch { /* silent */ }
    finally { setLoadingItems(false); }
  }, []);

  const loadChat = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/editorial/chat');
      const data = await res.json();
      if (Array.isArray(data)) setChatMessages(data);
    } catch { /* silent */ }
    finally { setChatInitialized(true); }
  }, []);

  useEffect(() => { loadData(); loadChat(); }, [loadData, loadChat]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  // ── Calendar ───────────────────────────────────────────────────────────────

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
  };

  const itemsByDate = items.reduce<Record<string, EditorialItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  // ── CRUD ───────────────────────────────────────────────────────────────────

  const handleAddItem = async (data: Partial<EditorialItem>) => {
    const res = await fetch('/api/admin/editorial/items', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur lors de la création');
    const newItem = await res.json();
    setItems((prev) => [...prev, newItem]);
    setSelectedDay(null);
  };

  const handleUpdateItem = async (id: string, data: Partial<EditorialItem>) => {
    const res = await fetch(`/api/admin/editorial/items/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour');
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    setSelectedItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    const res = await fetch(`/api/admin/editorial/items/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItem(null);
  };

  // ── Questionnaire + Generate ───────────────────────────────────────────────

  const handleQuestionnaireComplete = async (newConfig: EditorialConfig) => {
    const configRes = await fetch('/api/admin/editorial/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newConfig),
    });
    if (!configRes.ok) throw new Error('Erreur lors de la sauvegarde');
    setConfig(newConfig);

    const genRes = await fetch('/api/admin/editorial/generate', { method: 'POST' });
    if (!genRes.ok) throw new Error('Erreur lors de la génération');
    const genData = await genRes.json();
    if (Array.isArray(genData.items)) {
      setItems(genData.items);
      if (genData.items.length > 0) {
        const firstDate = new Date(genData.items[0].date + 'T00:00:00');
        setCurrentYear(firstDate.getFullYear());
        setCurrentMonth(firstDate.getMonth());
      }
    }
    setShowQuestionnaire(false);
  };

  const handleRegenerate = async () => {
    setRegenerateLoading(true);
    try {
      const genRes = await fetch('/api/admin/editorial/generate', { method: 'POST' });
      const genData = await genRes.json();
      if (!genRes.ok) {
        showToast(genData.error ?? 'Erreur lors de la régénération');
        return;
      }
      if (Array.isArray(genData.items)) {
        setItems(genData.items);
        showToast(`${genData.items.length} posts générés avec succès`, 'success');
        if (genData.items.length > 0) {
          const firstDate = new Date(genData.items[0].date + 'T00:00:00');
          setCurrentYear(firstDate.getFullYear());
          setCurrentMonth(firstDate.getMonth());
        }
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setRegenerateLoading(false);
      setConfirmRegenerate(false);
    }
  };

  // ── Generate social post from item ────────────────────────────────────────

  const handleGenerateSocial = async (item: EditorialItem) => {
    const res = await fetch('/api/admin/social', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        content: item.theme,
        platforms: item.platform ?? [],
        status: 'draft',
      }),
    });
    if (!res.ok) throw new Error('Erreur lors de la création du post');
    const post = await res.json();
    await handleUpdateItem(item.id, { status: 'genere', linkedSlug: post.id });
    window.open('/admin/social', '_blank');
  };

  // ── Chat ───────────────────────────────────────────────────────────────────

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput.trim(), timestamp: new Date().toISOString() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/admin/editorial/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue.', timestamp: new Date().toISOString() }]);
    } finally { setChatLoading(false); }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const totalGenerated = items.filter((i) => i.status === 'genere').length;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (showQuestionnaire) {
    return <TypeformQuestionnaire onComplete={handleQuestionnaireComplete} initialConfig={config} />;
  }

  return (
    <div className="flex h-full min-h-screen bg-dark-bg text-ink-primary">
      {/* ── Left: Calendar ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink-primary">Planning Réseaux Sociaux</h1>
            <p className="text-sm text-ink-tertiary mt-0.5">
              {loadingItems ? 'Chargement…' : `${items.length} posts planifiés · ${totalGenerated} générés`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:text-ink-primary hover:border-white/[0.15] transition-all cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              Reconfigurer
            </button>
            {config && (
              <button
                onClick={() => setConfirmRegenerate(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:text-ink-primary hover:border-white/[0.15] transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Régénérer
              </button>
            )}
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-ink-primary">{MONTHS_FR[currentMonth]} {currentYear}</h2>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_FR.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-ink-tertiary py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06]">
          {calendarDays.map((day, idx) => {
            const dateStr = day ? toDateStr(day) : null;
            const dayItems = dateStr ? (itemsByDate[dateStr] ?? []) : [];
            const isToday = dateStr === toDateStr(today);
            const past = dateStr ? isPast(dateStr) : false;
            const showOverflow = overflowDay === dateStr;

            return (
              <div
                key={idx}
                className={`bg-dark-surface min-h-[120px] p-1.5 relative ${
                  day ? 'cursor-pointer hover:bg-white/[0.01] transition-colors' : ''
                } ${isToday ? 'ring-1 ring-inset ring-brand-teal/30' : ''}`}
                onClick={() => {
                  if (!day) return;
                  setOverflowDay(null);
                  setSelectedDay(dateStr);
                }}
              >
                {day && (
                  <>
                    {/* Date number */}
                    <div className={`text-xs font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-brand-teal text-white' : past ? 'text-ink-tertiary' : 'text-ink-secondary'
                    }`}>
                      {day.getDate()}
                    </div>

                    {/* Cards */}
                    <div className="space-y-1">
                      {dayItems.slice(0, 2).map((item) => (
                        <div key={item.id} onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>
                          <SocialPostCard item={item} onClick={() => setSelectedItem(item)} />
                        </div>
                      ))}

                      {/* Overflow badge */}
                      {dayItems.length > 2 && (
                        <button
                          className="w-full text-center text-[10px] text-ink-tertiary hover:text-ink-secondary bg-white/[0.03] border border-white/[0.06] rounded-md py-0.5 cursor-pointer transition-colors"
                          onClick={(e) => { e.stopPropagation(); setOverflowDay(showOverflow ? null : dateStr); }}
                        >
                          +{dayItems.length - 2} posts
                        </button>
                      )}

                      {/* Overflow popover */}
                      {showOverflow && (
                        <DayPopover
                          items={dayItems}
                          onSelectItem={(item) => { setSelectedItem(item); setOverflowDay(null); }}
                          onClose={() => setOverflowDay(null)}
                        />
                      )}
                    </div>

                    {/* Add hint on empty days */}
                    {dayItems.length === 0 && (
                      <div className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <Plus className="w-3.5 h-3.5 text-ink-tertiary" />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 text-xs text-ink-tertiary">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-400" />Instagram</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />LinkedIn</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-300" />Facebook</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/40" />TikTok</div>
          <div className="flex items-center gap-1.5 ml-4"><Check className="w-3 h-3 text-green-400" />Généré</div>
        </div>
      </div>

      {/* ── Right: Chat ─────────────────────────────────────────────────────── */}
      <div className="w-[360px] flex-shrink-0 border-l border-white/[0.06] flex flex-col bg-dark-surface">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-brand-teal" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-primary">Agent Éditorial</p>
            <p className="text-xs text-ink-tertiary">Conseils stratégie réseaux sociaux</p>
          </div>
          <div className="ml-auto px-2 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-medium uppercase tracking-wide">IA</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!chatInitialized ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-5 h-5 animate-spin text-ink-tertiary" /></div>
          ) : chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-4">
              <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-teal" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-secondary mb-1">Votre stratège social</p>
                <p className="text-xs text-ink-tertiary">Demandez des idées de posts, des analyses de votre planning, ou des conseils pour chaque réseau.</p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                {['Quels formats marchent le mieux sur LinkedIn ?', 'Suggère 5 idées de carousels Instagram', 'Mon planning est-il cohérent ?'].map((s) => (
                  <button key={s} onClick={() => setChatInput(s)} className="text-left text-xs px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-ink-tertiary hover:text-ink-secondary hover:border-white/[0.1] transition-all cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-brand-teal text-white rounded-br-md' : 'bg-white/[0.06] text-ink-primary rounded-bl-md'
                }`}>
                  {msg.content.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))
          )}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <div key={delay} className="w-1.5 h-1.5 rounded-full bg-ink-tertiary animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendChat} className="p-4 border-t border-white/[0.06]">
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Posez votre question…"
              disabled={chatLoading}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-brand-teal/50 disabled:opacity-50"
            />
            <button type="submit" disabled={chatLoading || !chatInput.trim()} className="w-10 h-10 rounded-xl bg-brand-teal text-white flex items-center justify-center hover:bg-brand-teal-light transition-colors disabled:opacity-40 cursor-pointer flex-shrink-0">
              {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {selectedDay && !selectedItem && (
        <ItemModal
          defaultDate={selectedDay}
          onSave={handleAddItem}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onSave={(data) => handleUpdateItem(selectedItem.id, data)}
          onDelete={() => handleDeleteItem(selectedItem.id)}
          onGenerateSocial={() => handleGenerateSocial(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {confirmRegenerate && (
        <ConfirmDialog
          message="Cette action va supprimer tous les posts existants et régénérer un planning complet. Êtes-vous sûr ?"
          onConfirm={handleRegenerate}
          onCancel={() => setConfirmRegenerate(false)}
          loading={regenerateLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
          toast.type === 'success'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
