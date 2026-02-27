'use client';

import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown } from 'lucide-react';

// ── French stop-words ─────────────────────────────────────────────────────────
const FR_STOP = new Set([
  'le','la','les','de','du','des','un','une','en','et','à','au','aux','que','qui',
  'pour','par','sur','dans','est','il','elle','ils','elles','nous','vous','on','se',
  'si','mais','ou','donc','or','ni','car','je','tu','me','te','lui','leur','leurs',
  'mon','ma','mes','ton','ta','tes','son','sa','ses','notre','votre','ce','cet',
  'cette','ces','avec','sans','plus','moins','très','bien','aussi','tout','tous',
  'toute','toutes','pas','ne','même','être','avoir','faire','comme','après','avant',
  'pendant','depuis','selon','vers','entre','sous','lors','dont','cela','afin',
  'ainsi','alors','assez','autre','beaucoup','ça','chaque','ci','comment','dans',
  'déjà','derrière','devant','encore','enfin','eux','fois','hors','ici','jamais',
  'jusqu','maintenant','malgré','où','parce','parmi','peu','peut','plutôt',
  'pourquoi','puis','quand','quoi','rien','seul','seulement','sinon','soit',
  'souvent','surtout','tandis','tant','tel','telle','tels','telles','toujours',
  'toutefois','trop','vos','votre','leurs','lors','très','chez','via','lors',
  'dès','lors','dont','dont','leur','plus','bien','très','tout','fait','être',
  'cette','cette','cette','leur','leur','leur',
]);

// ── Strip markdown to plain text ──────────────────────────────────────────────
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,3} (.+)$/gm, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[[^\]]+\]\([^)]+\)/g, '')
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[IMAGE:[^\]]+\]/g, '')
    .replace(/^> /gm, '')
    .replace(/^[-*] /gm, '')
    .replace(/^\d+\. /gm, '');
}

// ── Keyword extraction ────────────────────────────────────────────────────────
export interface Keyword {
  word: string;
  score: number; // weighted frequency
  inTitle: boolean;
  inHeading: boolean;
}

function extractKeywords(title: string, content: string): Keyword[] {
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const titleNorm = normalize(title);
  const headingsText = (content.match(/^## .+$/gm) || []).join(' ');
  const headingsNorm = normalize(headingsText);
  const plainNorm = normalize(stripMarkdown(content));

  // Tokenise all text (title ×3, headings ×2, body ×1)
  const tokens = [
    ...normalize(title).split(/[\s\W]+/).map((w) => ({ w, weight: 3 })),
    ...headingsNorm.split(/[\s\W]+/).map((w) => ({ w, weight: 2 })),
    ...plainNorm.split(/[\s\W]+/).map((w) => ({ w, weight: 1 })),
  ].filter(({ w }) => w.length >= 4 && !FR_STOP.has(w));

  const freq: Record<string, number> = {};
  for (const { w, weight } of tokens) {
    freq[w] = (freq[w] || 0) + weight;
  }

  return Object.entries(freq)
    .filter(([, s]) => s >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)
    .map(([word, score]) => ({
      word,
      score,
      inTitle: titleNorm.includes(word),
      inHeading: headingsNorm.includes(word),
    }));
}

// ── SEO Checks ────────────────────────────────────────────────────────────────
interface SeoCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  tip: string;
  points: number;
  earned: number;
}

function runChecks(
  title: string,
  excerpt: string,
  content: string,
  coverImage: string,
): SeoCheck[] {
  const plain = stripMarkdown(content);
  const words = plain.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const headings = (content.match(/^## .+$/gm) || []).length;
  const images = content.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
  const imagesWithAlt = images.filter((img) => !/^!\[\]/.test(img) && !/!\[\]/.test(img));
  const tLen = title.length;
  const eLen = excerpt.length;

  // Keyword in title check
  const kws = extractKeywords(title, content);
  const titleNorm = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const keywordInTitle = kws.slice(0, 3).some((kw) => titleNorm.includes(kw.word));

  return [
    {
      id: 'title_length',
      label: `Titre — ${tLen} caractères`,
      status: tLen >= 40 && tLen <= 65 ? 'pass' : tLen > 0 ? 'warn' : 'fail',
      tip:
        tLen === 0
          ? 'Le titre est vide. Rédigez un titre entre 40 et 65 caractères.'
          : tLen < 40
          ? `Titre trop court (${tLen} car.). Visez 40-65 caractères pour un meilleur taux de clic.`
          : tLen > 65
          ? `Titre trop long (${tLen} car.). Google le tronque au-delà de 65 caractères. Raccourcissez-le.`
          : 'Longueur de titre idéale pour le référencement.',
      points: 15,
      earned: tLen >= 40 && tLen <= 65 ? 15 : tLen > 0 ? 7 : 0,
    },
    {
      id: 'excerpt',
      label: `Meta description — ${eLen} caractères`,
      status: eLen >= 120 && eLen <= 160 ? 'pass' : eLen > 0 ? 'warn' : 'fail',
      tip:
        eLen === 0
          ? "L'extrait est vide. Il sera utilisé comme meta description (120-160 car. idéal)."
          : eLen < 120
          ? `Extrait trop court (${eLen} car.). Développez-le pour atteindre 120-160 caractères.`
          : eLen > 160
          ? `Extrait trop long (${eLen} car.). Google le tronquera dans les résultats. Limitez-le à 160 car.`
          : 'Longueur de meta description idéale.',
      points: 15,
      earned: eLen >= 120 && eLen <= 160 ? 15 : eLen >= 50 ? 7 : 0,
    },
    {
      id: 'word_count',
      label: `Longueur du contenu — ${wordCount} mots`,
      status: wordCount >= 800 ? 'pass' : wordCount >= 400 ? 'warn' : 'fail',
      tip:
        wordCount < 200
          ? `Article très court (${wordCount} mots). Google privilégie les contenus de 800+ mots.`
          : wordCount < 400
          ? `Contenu insuffisant (${wordCount} mots). Enrichissez-le pour atteindre au moins 400 mots.`
          : wordCount < 800
          ? `Contenu correct (${wordCount} mots). Visez 800+ mots pour un meilleur classement.`
          : `Excellente longueur (${wordCount} mots). Les articles longs sont favorisés par Google.`,
      points: 20,
      earned:
        wordCount >= 800 ? 20 : wordCount >= 400 ? 12 : wordCount >= 200 ? 6 : 0,
    },
    {
      id: 'headings',
      label: `Structure H2 — ${headings} section${headings > 1 ? 's' : ''}`,
      status: headings >= 3 ? 'pass' : headings >= 1 ? 'warn' : 'fail',
      tip:
        headings === 0
          ? 'Aucun titre de section (##). Structurez votre article avec des titres H2 pour améliorer la lisibilité et le SEO.'
          : headings < 3
          ? `Seulement ${headings} titre(s) ##. Ajoutez-en pour mieux structurer l'article (recommandé : ≥ 3 sections).`
          : `Bonne structure avec ${headings} sections H2.`,
      points: 15,
      earned: headings >= 3 ? 15 : headings >= 1 ? 8 : 0,
    },
    {
      id: 'images',
      label:
        images.length === 0
          ? 'Images dans le contenu — aucune'
          : `Images avec texte alternatif — ${imagesWithAlt.length}/${images.length}`,
      status:
        images.length > 0 && imagesWithAlt.length === images.length
          ? 'pass'
          : images.length > 0
          ? 'warn'
          : 'fail',
      tip:
        images.length === 0
          ? "Aucune image dans l'article. Ajoutez des visuels pour améliorer l'engagement et le SEO."
          : imagesWithAlt.length < images.length
          ? `${images.length - imagesWithAlt.length} image(s) sans texte alternatif. Renseignez l'attribut alt pour toutes les images.`
          : 'Toutes les images ont un texte alternatif. Parfait !',
      points: 10,
      earned:
        images.length > 0 && imagesWithAlt.length === images.length
          ? 10
          : images.length > 0
          ? 5
          : 0,
    },
    {
      id: 'cover_image',
      label: 'Image de couverture',
      status: coverImage ? 'pass' : 'fail',
      tip: coverImage
        ? "Image de couverture définie. Elle sera affichée dans les résultats de recherche et les partages."
        : "Aucune image de couverture. Elle améliore la visibilité dans les résultats Google et sur les réseaux sociaux.",
      points: 10,
      earned: coverImage ? 10 : 0,
    },
    {
      id: 'keyword_in_title',
      label: 'Mot-clé principal dans le titre',
      status: keywordInTitle ? 'pass' : content.length > 100 ? 'fail' : 'warn',
      tip: keywordInTitle
        ? 'Le mot-clé principal apparaît dans le titre. Excellent !'
        : content.length < 100
        ? 'Rédigez du contenu pour que les mots-clés puissent être analysés.'
        : "Le mot-clé principal détecté n'est pas dans le titre. Adaptez votre titre pour inclure votre terme cible.",
      points: 15,
      earned: keywordInTitle ? 15 : 0,
    },
  ];
}

// ── Score circle ──────────────────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70 ? '#6B9B37' : score >= 40 ? '#D4842A' : '#C65D3E';
  const label =
    score >= 70 ? 'Bon' : score >= 40 ? 'Moyen' : 'Faible';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold font-mono leading-none"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-ink-tertiary mt-0.5">
            / 100
          </span>
        </div>
      </div>
      <span
        className="text-xs font-semibold tracking-wide"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Check item ────────────────────────────────────────────────────────────────
function CheckItem({ check }: { check: SeoCheck }) {
  const [open, setOpen] = useState(false);

  const Icon =
    check.status === 'pass'
      ? CheckCircle2
      : check.status === 'warn'
      ? AlertCircle
      : XCircle;

  const iconColor =
    check.status === 'pass'
      ? 'text-brand-green'
      : check.status === 'warn'
      ? 'text-brand-orange'
      : 'text-red-400';

  return (
    <div className="rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/[0.03] transition-colors rounded-lg group cursor-pointer"
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
        <span className="flex-1 text-xs text-ink-secondary leading-snug">
          {check.label}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-mono font-semibold ${iconColor}`}>
            {check.earned}/{check.points}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-ink-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0">
          <p className="text-[11px] text-ink-tertiary leading-relaxed bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04]">
            {check.tip}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main SeoPanel ─────────────────────────────────────────────────────────────
interface SeoPanelProps {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
}

export function SeoPanel({ title, excerpt, content, coverImage }: SeoPanelProps) {
  // Debounce inputs 400ms so we don't recompute on every keystroke
  const [debounced, setDebounced] = useState({ title, excerpt, content, coverImage });

  useEffect(() => {
    const t = setTimeout(
      () => setDebounced({ title, excerpt, content, coverImage }),
      400,
    );
    return () => clearTimeout(t);
  }, [title, excerpt, content, coverImage]);

  const { score, checks, keywords } = useMemo(() => {
    const c = runChecks(
      debounced.title,
      debounced.excerpt,
      debounced.content,
      debounced.coverImage,
    );
    const kws = extractKeywords(debounced.title, debounced.content);
    return {
      score: c.reduce((s, ch) => s + ch.earned, 0),
      checks: c,
      keywords: kws,
    };
  }, [debounced]);

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="flex flex-col items-center pt-2">
        <ScoreCircle score={score} />
        <p className="text-[10px] uppercase tracking-widest text-ink-tertiary mt-3 text-center">
          Score SEO
        </p>
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ink-tertiary mb-2.5 font-medium">
            Mots-clés détectés
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span
                key={kw.word}
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-mono ${
                  kw.inTitle
                    ? 'bg-brand-teal/10 border-brand-teal/30 text-brand-teal'
                    : kw.inHeading
                    ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple'
                    : 'bg-white/[0.04] border-white/[0.08] text-ink-tertiary'
                }`}
                title={`Score pondéré : ${kw.score}`}
              >
                {kw.word}
                {kw.inTitle && (
                  <span className="text-[9px] opacity-70">T</span>
                )}
                {!kw.inTitle && kw.inHeading && (
                  <span className="text-[9px] opacity-70">H</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-ink-tertiary/60 mt-2">
            <span className="text-brand-teal/70">■</span> dans le titre&ensp;
            <span className="text-brand-purple/70">■</span> dans un H2&ensp;
            <span className="text-ink-tertiary/40">■</span> dans le corps
          </p>
        </div>
      )}

      {keywords.length === 0 && content.length < 100 && (
        <p className="text-xs text-ink-tertiary italic text-center px-2">
          Rédigez du contenu pour voir les mots-clés analysés.
        </p>
      )}

      {/* Checklist */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-tertiary mb-2 font-medium">
          Critères ({checks.filter((c) => c.status === 'pass').length}/{checks.length} validés)
        </p>
        <div className="space-y-0.5">
          {checks.map((check) => (
            <CheckItem key={check.id} check={check} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Export score helper (used by ArticleEditor to show badge on tab) ──────────
export function computeSeoScore(
  title: string,
  excerpt: string,
  content: string,
  coverImage: string,
): number {
  return runChecks(title, excerpt, content, coverImage).reduce(
    (s, c) => s + c.earned,
    0,
  );
}
