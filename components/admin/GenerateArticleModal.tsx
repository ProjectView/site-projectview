'use client';

import { useState } from 'react';
import { X, Sparkles, Lightbulb, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: (slug: string) => void;
}

const TONES = [
  { value: 'professionnel', label: 'Professionnel', desc: 'Formel, expert, crédible' },
  { value: 'pédagogique', label: 'Pédagogique', desc: 'Clair, accessible, explicatif' },
  { value: 'storytelling', label: 'Storytelling', desc: 'Narratif, engageant, humain' },
  { value: 'expert', label: 'Expert', desc: 'Technique, approfondi, référence' },
  { value: 'inspirant', label: 'Inspirant', desc: 'Motivant, visionnaire, impact' },
];

const LENGTHS = [
  { value: 'court', label: 'Court', desc: '~500 mots', sub: '3-4 min de lecture' },
  { value: 'moyen', label: 'Moyen', desc: '~900 mots', sub: '5-7 min de lecture' },
  { value: 'long', label: 'Long', desc: '~1 500 mots', sub: '10-12 min de lecture' },
];

const LOADING_STEPS = [
  'Rédaction de l\'article avec Claude...',
  'Génération des illustrations dans l\'article...',
  'Génération de l\'image de couverture...',
  'Sauvegarde en brouillon...',
];

export function GenerateArticleModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleSuggest() {
    setLoadingSuggest(true);
    setSuggestions([]);
    try {
      const res = await fetch('/api/admin/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'suggest' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suggestion');
    } finally {
      setLoadingSuggest(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setLoadingStep(0);

    // Simulate progress steps (the API handles everything sequentially)
    const stepIntervals = [8000, 25000, 45000]; // approximate durations
    stepIntervals.forEach((delay, i) => {
      setTimeout(() => setLoadingStep(i + 1), delay);
    });

    try {
      const res = await fetch('/api/admin/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'generate', theme, tone, length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setLoadingStep(3);
      setTimeout(() => onSuccess(data.slug), 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de génération');
      setGenerating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!generating ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-dark-surface border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal/20 to-brand-orange/20 border border-white/[0.08] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-teal" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink-primary">Générer un article avec l&apos;IA</h2>
              {!generating && (
                <p className="text-xs text-ink-tertiary">
                  Étape {step}/3 —{' '}
                  {step === 1 ? 'Choisir le sujet' : step === 2 ? 'Choisir le ton' : 'Choisir la longueur'}
                </p>
              )}
            </div>
          </div>
          {!generating && (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ── Generating state ── */}
          {generating ? (
            <div className="space-y-5">
              <p className="text-sm text-ink-secondary text-center">
                Votre article est en cours de création. Cela prend environ 60 secondes.
              </p>
              <div className="space-y-3">
                {LOADING_STEPS.map((label, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      {i < loadingStep ? (
                        <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                      ) : i === loadingStep ? (
                        <Loader2 className="w-5 h-5 text-brand-orange animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        i < loadingStep
                          ? 'text-brand-teal'
                          : i === loadingStep
                          ? 'text-ink-primary'
                          : 'text-ink-tertiary'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-400">{error}</p>
                    <button
                      onClick={() => { setGenerating(false); setError(null); }}
                      className="text-xs text-red-300 underline mt-1 cursor-pointer"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ── Step 1: Theme ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary mb-2">
                      De quoi parle cet article ?
                    </label>
                    <textarea
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="Ex : Comment l'affichage dynamique transforme l'expérience client en showroom..."
                      rows={3}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors resize-none"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/[0.06]" />
                    <span className="relative flex justify-center">
                      <span className="px-3 bg-dark-surface text-xs text-ink-tertiary">ou</span>
                    </span>
                  </div>

                  <div>
                    <button
                      onClick={handleSuggest}
                      disabled={loadingSuggest}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loadingSuggest ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lightbulb className="w-4 h-4 text-brand-orange" />
                      )}
                      {loadingSuggest ? 'Génération des idées...' : 'Suggère-moi 3 idées'}
                    </button>

                    {suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => setTheme(s)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer border ${
                              theme === s
                                ? 'border-brand-teal/50 bg-brand-teal/10 text-ink-primary'
                                : 'border-white/[0.08] bg-white/[0.02] text-ink-secondary hover:bg-white/[0.06] hover:text-ink-primary'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 2: Tone ── */}
              {step === 2 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-ink-secondary mb-3">Quel ton souhaitez-vous ?</p>
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all cursor-pointer border ${
                        tone === t.value
                          ? 'border-brand-teal/50 bg-brand-teal/10'
                          : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="text-left">
                        <span className={`font-medium ${tone === t.value ? 'text-brand-teal' : 'text-ink-primary'}`}>
                          {t.label}
                        </span>
                        <span className="text-xs text-ink-tertiary ml-2">{t.desc}</span>
                      </div>
                      {tone === t.value && <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Step 3: Length ── */}
              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-ink-secondary mb-3">Quelle longueur souhaitez-vous ?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {LENGTHS.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setLength(l.value)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl text-sm transition-all cursor-pointer border ${
                          length === l.value
                            ? 'border-brand-teal/50 bg-brand-teal/10'
                            : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className={`font-semibold ${length === l.value ? 'text-brand-teal' : 'text-ink-primary'}`}>
                          {l.label}
                        </span>
                        <span className="text-xs text-ink-secondary mt-0.5">{l.desc}</span>
                        <span className="text-xs text-ink-tertiary mt-0.5">{l.sub}</span>
                      </button>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-ink-secondary space-y-1">
                    <div className="flex gap-2">
                      <span className="text-ink-tertiary">Sujet :</span>
                      <span className="text-ink-primary line-clamp-2">{theme}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-ink-tertiary">Ton :</span>
                      <span className="text-ink-primary capitalize">{tone}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!generating && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
            <button
              onClick={() => { if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3); else onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-ink-secondary hover:text-ink-primary hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Annuler' : 'Retour'}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                disabled={
                  (step === 1 && !theme.trim()) ||
                  (step === 2 && !tone)
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-white/[0.06] border border-white/[0.08] text-ink-primary hover:bg-white/[0.1] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!length}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                Générer l&apos;article
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
