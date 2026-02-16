'use client';

import { useState, useEffect } from 'react';
import {
  Bot,
  ToggleLeft,
  ToggleRight,
  MessageCircle,
  Palette,
  BrainCircuit,
  Save,
  Sparkles,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { Toast, ToastType } from '@/components/admin/Toast';
import { KnowledgeBase } from '@/components/admin/KnowledgeBase';

interface ChatbotConfig {
  enabled: boolean;
  welcomeMessage: string;
  systemPrompt: string;
  model: string;
  position: 'bottom-right' | 'bottom-left';
  accentColor: string;
  maxTokens: number;
  temperature: number;
}

const MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', desc: 'Rapide et économique' },
  { value: 'gpt-4o', label: 'GPT-4o', desc: 'Plus performant' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', desc: 'Haute qualité' },
];

const COLORS = [
  { value: '#3B7A8C', label: 'Teal (défaut)' },
  { value: '#6B9B37', label: 'Vert' },
  { value: '#D4842A', label: 'Orange' },
  { value: '#A855F7', label: 'Violet' },
  { value: '#EC4899', label: 'Rose' },
];

export default function ChatbotPage() {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Fetch config
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/chatbot');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Save config
  const handleSave = async () => {
    if (!config) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/chatbot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error('Erreur serveur');

      setToast({ message: 'Configuration sauvegardée !', type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la sauvegarde.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Toggle enabled
  const toggleEnabled = () => {
    if (config) {
      setConfig({ ...config, enabled: !config.enabled });
    }
  };

  if (loading || !config) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chatbot</h1>
          <p className="text-ink-secondary text-sm mt-1">
            Configurez le chatbot IA pour les visiteurs de votre site.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {/* Status card */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              config.enabled
                ? 'bg-green-500/15'
                : 'bg-white/[0.04]'
            }`}>
              <Bot className={`w-6 h-6 ${config.enabled ? 'text-green-400' : 'text-ink-tertiary'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold">Chatbot Visiteurs</p>
              <p className={`text-xs ${config.enabled ? 'text-green-400' : 'text-ink-tertiary'}`}>
                {config.enabled ? 'Actif — visible sur le site' : 'Désactivé'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleEnabled}
            className="cursor-pointer transition-transform hover:scale-105"
            title={config.enabled ? 'Désactiver' : 'Activer'}
          >
            {config.enabled ? (
              <ToggleRight className="w-10 h-10 text-green-400" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-ink-tertiary" />
            )}
          </button>
        </div>
      </div>

      {/* Model selection */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="w-4 h-4 text-ink-tertiary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Modèle IA
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MODELS.map((model) => (
            <button
              key={model.value}
              onClick={() => setConfig({ ...config, model: model.value })}
              className={`rounded-xl p-4 text-left border transition-all cursor-pointer ${
                config.model === model.value
                  ? 'bg-brand-teal/10 border-brand-teal/30'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <p className="text-sm font-medium">{model.label}</p>
              <p className="text-xs text-ink-tertiary mt-1">{model.desc}</p>
            </button>
          ))}
        </div>

        {/* Temperature & Max tokens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
              Température ({config.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full accent-brand-teal"
            />
            <div className="flex justify-between text-[10px] text-ink-tertiary mt-1">
              <span>Précis</span>
              <span>Créatif</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
              Tokens max
            </label>
            <input
              type="number"
              min={50}
              max={2000}
              step={50}
              value={config.maxTokens}
              onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) || 500 })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary outline-none focus:border-brand-teal/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* System prompt */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-ink-tertiary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Prompt système
          </h2>
        </div>
        <p className="text-xs text-ink-tertiary">
          Définit la personnalité et les instructions de base du chatbot. Les visiteurs ne voient pas ce texte.
        </p>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
          rows={6}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 transition-all resize-y font-mono leading-relaxed"
        />
      </div>

      {/* Knowledge Base */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-ink-tertiary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Base de connaissances
          </h2>
        </div>
        <KnowledgeBase />
      </div>

      {/* Welcome message */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-ink-tertiary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Message d&apos;accueil
          </h2>
        </div>
        <p className="text-xs text-ink-tertiary">
          Premier message affiché aux visiteurs quand ils ouvrent le chatbot.
        </p>
        <input
          type="text"
          value={config.welcomeMessage}
          onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-ink-primary outline-none focus:border-brand-teal/50 transition-all"
        />
      </div>

      {/* Appearance */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-ink-tertiary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            Apparence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Position */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
              Position
            </label>
            <div className="flex gap-2">
              {(['bottom-right', 'bottom-left'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setConfig({ ...config, position: pos })}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    config.position === pos
                      ? 'bg-brand-teal/10 border-brand-teal/30 text-brand-teal'
                      : 'bg-white/[0.02] border-white/[0.06] text-ink-secondary hover:border-white/[0.12]'
                  }`}
                >
                  {pos === 'bottom-right' ? 'Bas-droite' : 'Bas-gauche'}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
              Couleur accent
            </label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setConfig({ ...config, accentColor: color.value })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all cursor-pointer ${
                    config.accentColor === color.value
                      ? 'border-white scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary mb-4">
          Aperçu
        </h2>
        <div className="relative bg-dark-bg rounded-xl border border-white/[0.06] h-64 overflow-hidden">
          {/* Fake page content */}
          <div className="p-6 opacity-20">
            <div className="h-3 w-32 bg-white/20 rounded mb-3" />
            <div className="h-2 w-full bg-white/10 rounded mb-2" />
            <div className="h-2 w-3/4 bg-white/10 rounded mb-2" />
            <div className="h-2 w-5/6 bg-white/10 rounded" />
          </div>

          {/* Chat bubble */}
          <div
            className={`absolute bottom-4 ${config.position === 'bottom-right' ? 'right-4' : 'left-4'}`}
          >
            {/* Chat window preview */}
            <div className="w-72 rounded-xl bg-dark-surface border border-white/[0.08] shadow-2xl mb-3 overflow-hidden">
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ backgroundColor: config.accentColor + '20' }}
              >
                <Bot className="w-4 h-4" style={{ color: config.accentColor }} />
                <span className="text-xs font-medium">Assistant Projectview</span>
              </div>
              <div className="px-4 py-3">
                <div
                  className="text-xs p-2.5 rounded-lg mb-2 max-w-[200px]"
                  style={{ backgroundColor: config.accentColor + '15', color: config.accentColor }}
                >
                  {config.welcomeMessage.slice(0, 60)}{config.welcomeMessage.length > 60 ? '...' : ''}
                </div>
              </div>
            </div>

            {/* FAB button */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: config.accentColor, marginLeft: config.position === 'bottom-right' ? 'auto' : '0' }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
