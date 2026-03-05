'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Zap, Sparkles, BarChart3, Users, MessageSquare,
  FileText, Search, Mail, BookOpen, Upload, Calendar, Bot,
  TrendingUp, Edit3, Map, Layers, FlaskConical, Image, Grid3X3,
  Wand2, Building2, CheckCircle2, X, ChevronRight,
  Monitor, LayoutDashboard, Gauge, ShieldCheck, Star,
} from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { GlassCard } from '@/components/ui/GlassCard';

/* ─── Animation variants ───────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ─── Back-office features data ────────────────────────────────────── */

type FeatureStatus = 'live' | 'soon';
type FeatureCat = 'Tout' | 'Contenu' | 'SEO' | 'CRM & Leads' | 'IA & Chatbot' | 'Analytics' | 'Médias';

interface Feature {
  label: string;
  icon: React.ElementType;
  cat: FeatureCat;
  status: FeatureStatus;
  desc: string;
}

const FEATURES: Feature[] = [
  { label: 'Éditeur d\'articles',       icon: FileText,      cat: 'Contenu',     status: 'live', desc: 'Éditeur rich text avec media, SEO et preview.' },
  { label: 'Génération de contenu IA',  icon: Sparkles,      cat: 'Contenu',     status: 'soon', desc: 'Rédigez des articles en un prompt.' },
  { label: 'Planning éditorial',        icon: Calendar,      cat: 'Contenu',     status: 'soon', desc: 'Calendrier de publication drag & drop.' },
  { label: 'Gestion des médias',        icon: Image,         cat: 'Médias',      status: 'live', desc: 'Upload, génération IA, CDN optimisé.' },
  { label: 'Galerie organisée',         icon: Grid3X3,       cat: 'Médias',      status: 'soon', desc: 'Collections, tags, recherche par image.' },
  { label: 'Score SEO temps réel',      icon: TrendingUp,    cat: 'SEO',         status: 'live', desc: 'Analyse live : title, meta, H1, readability.' },
  { label: 'Éditeur meta & OG',         icon: Edit3,         cat: 'SEO',         status: 'live', desc: 'Open Graph, Twitter card, balises canonical.' },
  { label: 'Sitemap automatique',       icon: Map,           cat: 'SEO',         status: 'live', desc: 'Sitemap.xml généré à chaque publication.' },
  { label: 'Audit de contenu IA',       icon: Bot,           cat: 'SEO',         status: 'soon', desc: 'Détection de contenu mince, duplicates, gaps.' },
  { label: 'CRM Prospects',            icon: Users,         cat: 'CRM & Leads', status: 'live', desc: 'Fiches, statuts, notes, historique complet.' },
  { label: 'CRM Clients',              icon: Building2,     cat: 'CRM & Leads', status: 'live', desc: 'Conversion prospect → client en un clic.' },
  { label: 'Leadgen SIRENE',           icon: Search,        cat: 'CRM & Leads', status: 'live', desc: 'Découvrez des entreprises cibles par secteur.' },
  { label: 'Séquences email',          icon: Mail,          cat: 'CRM & Leads', status: 'live', desc: 'Cold outreach automatisé, multi-étapes.' },
  { label: 'Chatbot IA custom',        icon: MessageSquare, cat: 'IA & Chatbot', status: 'live', desc: 'Entraîné sur votre contenu, disponible 24/7.' },
  { label: 'Base de connaissance',     icon: BookOpen,      cat: 'IA & Chatbot', status: 'live', desc: 'Documents sources pour le chatbot.' },
  { label: 'Génération d\'images IA',  icon: Wand2,         cat: 'IA & Chatbot', status: 'live', desc: 'Images sur mesure depuis l\'admin.' },
  { label: 'A/B Testing',              icon: FlaskConical,  cat: 'IA & Chatbot', status: 'soon', desc: 'Testez vos CTAs, headlines et pages.' },
  { label: 'Dashboard Analytics',      icon: BarChart3,     cat: 'Analytics',   status: 'live', desc: 'Visiteurs, sources, pages populaires, temps réel.' },
  { label: 'Heatmaps',                 icon: Layers,        cat: 'Analytics',   status: 'soon', desc: 'Zones cliquées, scroll depth, rage clicks.' },
  { label: 'Rapports automatiques',    icon: FileText,      cat: 'Analytics',   status: 'soon', desc: 'Digest hebdo par email avec les KPIs clés.' },
  { label: 'Upload & CDN',             icon: Upload,        cat: 'Médias',      status: 'live', desc: 'Stockage cloud, compression automatique.' },
];

const CATS: FeatureCat[] = ['Tout', 'Contenu', 'SEO', 'CRM & Leads', 'IA & Chatbot', 'Analytics', 'Médias'];

/* ─── Process steps ────────────────────────────────────────────────── */

const STEPS = [
  { n: '01', emoji: '🔍', title: 'Audit & Discovery', desc: 'On analyse votre business, vos cibles et vos outils actuels. On identifie ensemble les briques prioritaires.' },
  { n: '02', emoji: '🎨', title: 'Design System',     desc: 'Palette, typographie, composants sur mesure. Un design qui vous ressemble et qui convertit.' },
  { n: '03', emoji: '⚙️', title: 'Développement',    desc: 'Next.js, TypeScript, Tailwind. Chaque brique testée, optimisée, documentée.' },
  { n: '04', emoji: '🚀', title: 'Déploiement',       desc: 'Vercel Edge, CDN global, domaine configuré. Votre site est live en quelques heures.' },
  { n: '05', emoji: '📈', title: 'Itération',         desc: 'Le back-office vous rend autonome. On ajoute les briques suivantes à votre rythme.' },
];

/* ─── Front pillars ─────────────────────────────────────────────────── */

const FRONT_PILLARS = [
  {
    icon: Gauge,
    accent: 'orange' as const,
    title: 'Performance',
    stat: '< 1s LCP',
    features: ['Core Web Vitals 100/100', 'next/image optimisé', 'ISR & Edge Runtime', 'Bundle < 100kb'],
  },
  {
    icon: TrendingUp,
    accent: 'teal' as const,
    title: 'SEO Technique',
    stat: 'Score 98+',
    features: ['Sitemap & robots.txt', 'JSON-LD structuré', 'Canonical & meta dynamiques', 'Open Graph complet'],
  },
  {
    icon: Monitor,
    accent: 'purple' as const,
    title: 'Design Premium',
    stat: '100% Custom',
    features: ['Animations Framer Motion', 'Glassmorphism system', 'Dark / Light mode', 'Responsive mobile first'],
  },
  {
    icon: ShieldCheck,
    accent: 'green' as const,
    title: 'Accessibilité',
    stat: 'WCAG AA',
    features: ['Contraste conforme AA', 'Navigation clavier', 'Focus visible & skip links', 'Semantic HTML'],
  },
];

/* ─── Testimonials data ─────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    quote: "Notre site génère maintenant 3× plus de demandes. Le back-office est une révélation — je modifie tout moi-même en 2 minutes.",
    name: 'Marie D.',
    role: 'Directrice Marketing',
    company: 'AtelierBois Lyon',
  },
  {
    quote: "En 3 semaines, site live avec CRM opérationnel et chatbot configuré. L'équipe Projectview est redoutablement efficace.",
    name: 'Karim B.',
    role: 'CEO',
    company: 'InnoSpace Paris',
  },
  {
    quote: "J'avais peur de la complexité. Finalement c'est moi qui gère tout depuis le back-office. Incroyable.",
    name: 'Sophie L.',
    role: 'Architecte',
    company: 'Studio Lumière',
  },
];

/* ─── Demo tabs ─────────────────────────────────────────────────────── */

type DemoTab = 'dashboard' | 'crm' | 'articles' | 'chatbot' | 'seo';

const DEMO_TABS: { id: DemoTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'crm',       label: 'CRM',       icon: Users },
  { id: 'articles',  label: 'Articles',  icon: FileText },
  { id: 'chatbot',   label: 'Chatbot',   icon: MessageSquare },
  { id: 'seo',       label: 'SEO',       icon: TrendingUp },
];

/* ─── Typing targets ────────────────────────────────────────────────── */

const TYPING_TARGETS = ['architectes', 'retailers', 'showrooms', 'constructeurs', 'promoteurs', 'startups'];

/* ══════════════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════════════════════════════ */

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #3B7A8C, #6B9B37, #D4842A)',
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════
   STICKY CTA BAR
══════════════════════════════════════════════════════════════════════ */

function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const ctaRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ctaRef.current = document.getElementById('cta-section');
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const show = scrollY > 600;

      if (ctaRef.current) {
        const rect = ctaRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          setVisible(false);
          return;
        }
      }

      setVisible(show);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl bg-dark-surface/85 border border-white/[0.12] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
        >
          <Link
            href="/contact"
            className="flex items-center gap-2 text-sm font-semibold text-ink-primary hover:text-brand-teal transition-colors whitespace-nowrap"
          >
            Démarrer mon projet
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 rounded-full whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            Devis gratuit · 48h
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="ml-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/[0.08] text-ink-tertiary hover:text-ink-secondary transition-colors"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HOTSPOT COMPONENT
══════════════════════════════════════════════════════════════════════ */

interface HotspotProps {
  id: string;
  tooltip: string;
  active: boolean;
  onToggle: (id: string) => void;
  above?: boolean;
}

function Hotspot({ id, tooltip, active, onToggle, above = false }: HotspotProps) {
  return (
    <div className="relative flex items-center justify-center z-10">
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(id); }}
        className="relative flex items-center justify-center w-6 h-6 cursor-pointer"
        aria-label="En savoir plus"
      >
        {/* Pulsing ring */}
        <motion.span
          className="absolute w-5 h-5 rounded-full bg-brand-orange/35"
          animate={{ scale: [1, 1.9, 1.9], opacity: [0.7, 0, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
        {/* Inner dot */}
        <span className="relative w-2.5 h-2.5 rounded-full bg-brand-orange shadow-[0_0_6px_rgba(212,132,42,0.7)]" />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: above ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: above ? 4 : -4 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute ${above ? 'bottom-8' : 'top-8'} left-1/2 -translate-x-1/2 z-30 w-52 rounded-xl border border-white/[0.15] bg-dark-elevated p-3 shadow-2xl`}
          >
            <p className="text-[11px] text-ink-secondary leading-relaxed">{tooltip}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */

export function PlatformeContent() {
  return (
    <main className="overflow-hidden">
      <ScrollProgressBar />
      <StickyCTA />
      <HeroSection />
      <ProblemeSection />
      <TestimonialsSection />
      <FrontSection />
      <BackOfficeSection />
      <BriqueSection />
      <DemoSection />
      <CtaSection />
    </main>
  );
}

/* ─── 1. HERO ───────────────────────────────────────────────────────── */

function HeroSection() {
  const [targetIdx, setTargetIdx] = useState(0);
  const [displayTarget, setDisplayTarget] = useState(TYPING_TARGETS[0]);

  useEffect(() => {
    const id = setInterval(() => {
      setTargetIdx((i) => {
        const next = (i + 1) % TYPING_TARGETS.length;
        setDisplayTarget(TYPING_TARGETS[next]);
        return next;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 pt-24 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="hero-mesh absolute inset-0 opacity-60" />
        <div className="gradient-orb absolute -top-40 -left-40 w-[700px] h-[700px] bg-brand-teal/10 blur-[120px]" />
        <div className="gradient-orb absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-brand-orange/8 blur-[120px]" />
        <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/6 blur-[100px]" />
      </div>

      <div className="max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div className="space-y-8" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0}>
              <Badge>Sur mesure · Brick by brick · Full-stack</Badge>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="space-y-3">
              <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-bold tracking-tight leading-[1.05]">
                Votre site.
              </h1>
              <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-bold tracking-tight leading-[1.05]">
                <GradientText>Réinventé</GradientText> de A à Z.
              </h1>
            </motion.div>

            <motion.p variants={fadeUp} custom={2} className="text-lg text-ink-secondary leading-relaxed max-w-xl">
              La Plateforme, c&apos;est un front au niveau des meilleurs sites du monde
              et un back-office complet pour piloter votre activité —
              construit <span className="text-ink-primary font-medium">brique par brique</span>, exactement pour vous.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex items-center gap-2 text-sm text-ink-tertiary">
              <span>Fait sur mesure pour les</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={targetIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <GradientText>{displayTarget}</GradientText>
                </motion.span>
              </AnimatePresence>
              <span>.</span>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">
                Démarrer mon projet <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/contact" variant="secondary">
                Parler à un expert
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} custom={5} className="flex flex-wrap gap-6 pt-4 border-t border-white/[0.06]">
              {[
                { value: '100%', label: 'Sur mesure' },
                { value: '24/7', label: 'Actif & performant' },
                { value: '∞', label: 'Évolutif' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold font-mono gradient-text">{value}</p>
                  <p className="text-xs text-ink-tertiary mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — floating UI mockups */}
          <motion.div
            className="relative h-[520px] hidden lg:block"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <motion.div
              className="absolute top-0 left-0 w-[370px] rounded-2xl overflow-hidden border border-white/[0.10] shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'perspective(1000px) rotateY(-4deg) rotateX(3deg)' }}
            >
              <div className="bg-dark-elevated px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-3 bg-white/[0.06] rounded-md px-3 py-1 text-[10px] text-ink-tertiary font-mono">
                  projectview.fr
                </div>
              </div>
              <div className="bg-[#0A0A0B] p-5 space-y-4 h-[280px] overflow-hidden">
                <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
                <div className="h-8 w-48 rounded-xl bg-gradient-to-r from-brand-teal/30 to-brand-purple/20" />
                <div className="h-3 w-36 rounded-full bg-white/[0.04]" />
                <div className="h-3 w-32 rounded-full bg-white/[0.04]" />
                <div className="flex gap-2 mt-2">
                  <div className="h-9 w-28 rounded-full bg-gradient-to-r from-brand-teal to-brand-purple opacity-80" />
                  <div className="h-9 w-28 rounded-full border border-white/[0.10]" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {['from-brand-teal/20', 'from-brand-purple/20', 'from-brand-orange/20'].map((g, i) => (
                    <div key={i} className={`h-16 rounded-xl bg-gradient-to-br ${g} to-transparent border border-white/[0.06]`} />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-0 right-0 w-[330px] rounded-2xl overflow-hidden border border-white/[0.12] shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{ transform: 'perspective(1000px) rotateY(4deg) rotateX(-2deg)' }}
            >
              <div className="bg-dark-surface px-4 py-3 flex items-center gap-3 border-b border-white/[0.06]">
                <LayoutDashboard className="w-4 h-4 text-brand-teal" />
                <span className="text-xs font-medium text-ink-secondary">Back-office</span>
                <div className="ml-auto flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/[0.15]" />)}
                </div>
              </div>
              <div className="flex bg-[#0D0D10] h-[260px]">
                <div className="w-12 bg-dark-surface/50 flex flex-col items-center py-3 gap-3 border-r border-white/[0.05]">
                  {[BarChart3, FileText, Users, MessageSquare, Zap].map((Icon, i) => (
                    <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-brand-teal/20' : ''}`}>
                      <Icon className={`w-3.5 h-3.5 ${i === 0 ? 'text-brand-teal' : 'text-ink-tertiary'}`} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Visiteurs', value: '1 284', color: 'text-brand-teal' },
                      { label: 'Leads', value: '37', color: 'text-brand-orange' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                        <p className="text-[10px] text-ink-tertiary">{label}</p>
                        <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-1.5">
                    {['Article publié · SEO 94', 'Lead importé · Solar SAS', 'Chatbot · 12 messages'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-brand-green' : i === 1 ? 'bg-brand-teal' : 'bg-brand-purple'}`} />
                        <p className="text-[10px] text-ink-secondary truncate">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-brand-teal/0 via-brand-teal/40 to-brand-orange/0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. PROBLÈME ───────────────────────────────────────────────────── */

function ProblemeSection() {
  const old = [
    'Mis à jour 1x/an par une agence (facturée 3 000€)',
    'Zéro visibilité sur vos visiteurs',
    'Aucun outil pour capturer des leads',
    'Chatbot générique ou inexistant',
    'SEO figé, contenu mort',
  ];
  const next = [
    'Contenu modifié en 2 clics depuis votre back-office',
    'Analytics temps réel + heatmaps à venir',
    'CRM intégré, capture automatique de prospects',
    'Chatbot IA entraîné sur votre business',
    'SEO piloté, génération de contenu IA incluse',
  ];

  return (
    <SectionWrapper glow="none" className="py-32 px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}><Badge>Le constat</Badge></motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight leading-tight">
            Votre site vitrine vous coûte de l&apos;argent.
            <br />
            <GradientText>Il devrait en rapporter.</GradientText>
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <X className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-semibold text-ink-secondary">Site vitrine classique</h3>
            </div>
            <ul className="space-y-3">
              {old.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-tertiary">
                  <X className="w-4 h-4 text-red-500/50 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="rounded-2xl border border-brand-teal/25 bg-brand-teal/[0.04] p-8 space-y-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-teal" />
              </div>
              <h3 className="font-semibold text-ink-primary">La Plateforme</h3>
            </div>
            <ul className="space-y-3 relative">
              {next.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-secondary">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

/* ─── 2b. TESTIMONIALS ──────────────────────────────────────────────── */

function TestimonialsSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {TESTIMONIALS.map(({ quote, name, role, company }, i) => (
            <motion.div key={name} variants={fadeUp} custom={i}>
              <GlassCard className="p-6 h-full space-y-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  ))}
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-1 border-t border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal/30 to-brand-purple/20 flex items-center justify-center text-xs font-bold text-brand-teal">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-primary">{name}</p>
                    <p className="text-[11px] text-ink-tertiary">{role} · {company}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 3. FRONT ──────────────────────────────────────────────────────── */

function FrontSection() {
  return (
    <SectionWrapper glow="teal" className="py-32 px-6">
      <div className="max-w-[1280px] mx-auto space-y-16">
        <motion.div
          className="text-center space-y-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}><Badge>Le front-end</Badge></motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight">
            Un design qui impose le <GradientText>respect</GradientText>.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-lg max-w-xl mx-auto">
            Chaque pixel est pensé pour convertir. Chaque milliseconde est optimisée pour Google.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {FRONT_PILLARS.map(({ icon: Icon, accent, title, stat, features }, i) => (
            <motion.div key={title} variants={fadeUp} custom={i}>
              <GlassCard accentColor={accent} className="p-8 h-full space-y-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-${accent}/10 border border-brand-${accent}/20`}>
                    <Icon className={`w-6 h-6 text-brand-${accent}`} />
                  </div>
                  <span className={`text-2xl font-bold font-mono text-brand-${accent}`}>{stat}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink-primary mb-4">{title}</h3>
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink-secondary">
                        <ChevronRight className={`w-3.5 h-3.5 text-brand-${accent} flex-shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

/* ─── 4. BACK-OFFICE ────────────────────────────────────────────────── */

function BackOfficeSection() {
  const [activeTab, setActiveTab] = useState<FeatureCat>('Tout');

  const visible = FEATURES.filter((f) => activeTab === 'Tout' || f.cat === activeTab);
  const liveCount = FEATURES.filter((f) => f.status === 'live').length;
  const soonCount = FEATURES.filter((f) => f.status === 'soon').length;

  return (
    <SectionWrapper glow="none" className="py-32 px-6 bg-dark-surface/30">
      <div className="max-w-[1280px] mx-auto space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}><Badge>Le back-office</Badge></motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight">
            Tous les outils. <GradientText>Un seul endroit.</GradientText>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-lg max-w-xl mx-auto">
            Chaque brique est disponible à la carte. Vous choisissez ce dont vous avez besoin.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-6 pt-2">
            <span className="flex items-center gap-2 text-sm text-ink-secondary">
              <span className="w-2 h-2 rounded-full bg-brand-green inline-block" />
              {liveCount} outils disponibles
            </span>
            <span className="flex items-center gap-2 text-sm text-ink-secondary">
              <span className="w-2 h-2 rounded-full bg-brand-orange inline-block" />
              {soonCount} en développement
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                activeTab === cat
                  ? 'bg-brand-teal/15 border-brand-teal/40 text-brand-teal'
                  : 'bg-white/[0.04] border-white/[0.08] text-ink-secondary hover:border-white/[0.18] hover:text-ink-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div
          key={activeTab}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {visible.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.label} variants={fadeUp} custom={i}>
                <div className={`group relative rounded-2xl border p-5 transition-all duration-300 ${
                  f.status === 'live'
                    ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.05]'
                    : 'bg-white/[0.015] border-dashed border-white/[0.06] opacity-70 hover:opacity-90'
                }`}>
                  <div className="absolute top-4 right-4">
                    {f.status === 'live' ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                        Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-full">
                        Bientôt
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-teal/10 group-hover:border-brand-teal/20 transition-all">
                      <Icon className="w-5 h-5 text-ink-tertiary group-hover:text-brand-teal transition-colors" />
                    </div>
                    <div className="min-w-0 pr-12">
                      <p className="font-semibold text-sm text-ink-primary">{f.label}</p>
                      <p className="text-xs text-ink-tertiary mt-1 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

/* ─── 5. BRICK BY BRICK ─────────────────────────────────────────────── */

function BriqueSection() {
  return (
    <SectionWrapper glow="orange" className="py-32 px-6">
      <div className="max-w-[1280px] mx-auto space-y-16">
        <motion.div
          className="text-center space-y-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}><Badge>L&apos;approche</Badge></motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight">
            Construit brique <GradientText>par brique</GradientText>.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-lg max-w-lg mx-auto">
            Pas de template. Pas de compromis. Chaque feature est pensée pour votre métier.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[calc(10%+20px)] right-[calc(10%+20px)] h-px bg-gradient-to-r from-brand-teal/0 via-brand-teal/30 to-brand-orange/0" />
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {STEPS.map(({ n, emoji, title, desc }, i) => (
              <motion.div key={n} variants={fadeUp} custom={i} className="flex flex-col items-center text-center lg:items-start lg:text-left gap-4">
                <div className="w-20 h-20 rounded-2xl bg-dark-surface border border-white/[0.08] flex flex-col items-center justify-center gap-0.5 flex-shrink-0">
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-[10px] font-mono text-ink-tertiary">{n}</span>
                </div>
                <div>
                  <h3 className="font-bold text-ink-primary mb-2">{title}</h3>
                  <p className="text-sm text-ink-tertiary leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}

/* ─── 6. INTERACTIVE DEMO ───────────────────────────────────────────── */

function DemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTab>('dashboard');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  function toggleHotspot(id: string) {
    setActiveHotspot((prev) => (prev === id ? null : id));
  }

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      onClick={() => setActiveHotspot(null)}
    >
      <div className="absolute inset-0 -z-10">
        <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-teal/6 blur-[140px]" />
      </div>

      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 space-y-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}><Badge>Essayez par vous-même</Badge></motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight">
            Explorez votre futur <GradientText>back-office</GradientText>.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-lg max-w-lg mx-auto">
            Naviguez entre les modules. Cliquez sur les{' '}
            <span className="inline-flex items-center gap-1 text-brand-orange font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-orange inline-block" />
              points orange
            </span>
            {' '}pour découvrir chaque feature.
          </motion.p>
        </motion.div>

        {/* App Window */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="rounded-2xl border border-white/[0.10] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.5)]">
            {/* Title bar */}
            <div className="bg-dark-elevated px-5 py-3 flex items-center gap-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[11px] text-ink-tertiary font-medium mx-auto">Back-office · Projectview</span>
            </div>

            {/* Body */}
            <div className="flex bg-[#0D0D10]" style={{ minHeight: 460 }}>
              {/* Sidebar — desktop */}
              <nav className="hidden lg:flex w-44 flex-col bg-dark-surface/50 border-r border-white/[0.05] py-3 flex-shrink-0">
                {DEMO_TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={(e) => { e.stopPropagation(); setActiveTab(id); setActiveHotspot(null); }}
                    className={`flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all cursor-pointer text-left ${
                      activeTab === id
                        ? 'bg-brand-teal/15 text-brand-teal'
                        : 'text-ink-tertiary hover:text-ink-secondary hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>

              {/* Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile tab bar */}
                <div className="lg:hidden flex gap-1 overflow-x-auto p-2 border-b border-white/[0.05] flex-shrink-0">
                  {DEMO_TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={(e) => { e.stopPropagation(); setActiveTab(id); setActiveHotspot(null); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                        activeTab === id ? 'bg-brand-teal/15 text-brand-teal' : 'text-ink-tertiary'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="p-5 space-y-4"
                    >

                      {/* ─── DASHBOARD ─── */}
                      {activeTab === 'dashboard' && (
                        <>
                          <div className="grid grid-cols-2 gap-2.5">
                            {[
                              { label: 'Visiteurs', value: '1 284', color: 'text-brand-teal', hs: null as string | null },
                              { label: 'Leads', value: '37', color: 'text-brand-orange', hs: 'dashboard-1' as string | null },
                              { label: 'Articles', value: '12', color: 'text-brand-green', hs: null as string | null },
                              { label: 'Score SEO', value: '94', color: 'text-brand-purple', hs: null as string | null },
                            ].map(({ label, value, color, hs }) => (
                              <div key={label} className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                                <p className="text-[10px] text-ink-tertiary mb-0.5">{label}</p>
                                <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
                                {hs && (
                                  <div className="absolute top-2 right-2">
                                    <Hotspot id={hs} tooltip="Chaque visiteur qui remplit un formulaire entre directement dans votre CRM avec ses coordonnées." active={activeHotspot === hs} onToggle={toggleHotspot} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                            <p className="text-[10px] font-medium text-ink-tertiary mb-3">Visites — 7 derniers jours</p>
                            <div className="flex items-end gap-1.5 h-14">
                              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div
                                  key={i}
                                  style={{ height: `${h}%` }}
                                  className="flex-1 rounded-t bg-brand-teal/25 hover:bg-brand-teal/45 transition-colors"
                                />
                              ))}
                            </div>
                            <div className="absolute top-3 right-3">
                              <Hotspot id="dashboard-2" tooltip="Analytics temps réel : sources de trafic, pages populaires, durée de session, taux de rebond." active={activeHotspot === 'dashboard-2'} onToggle={toggleHotspot} above />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {[
                              { dot: 'bg-brand-green', text: 'Article publié · "Guide SEO 2025" — Score 94' },
                              { dot: 'bg-brand-teal', text: 'Lead importé · InnoSolar SAS · Paris 75' },
                              { dot: 'bg-brand-purple', text: 'Chatbot · 12 messages · 3 leads qualifiés' },
                            ].map(({ dot, text }) => (
                              <div key={text} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.04] last:border-0">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                                <p className="text-[11px] text-ink-secondary truncate">{text}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* ─── CRM ─── */}
                      {activeTab === 'crm' && (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-ink-primary">Prospects</h3>
                              <span className="text-[10px] bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-2 py-0.5 rounded-full font-medium">24</span>
                            </div>
                            <button className="text-[11px] bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-2.5 py-1 rounded-lg cursor-default">
                              + Ajouter
                            </button>
                          </div>

                          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                            <div className="grid grid-cols-3 bg-white/[0.02] border-b border-white/[0.05] px-3 py-2">
                              {['Nom & Entreprise', 'Statut', 'Ajouté le'].map((h) => (
                                <p key={h} className="text-[10px] font-medium text-ink-tertiary">{h}</p>
                              ))}
                            </div>
                            {[
                              { nom: 'Marie D.', co: 'AtelierBois', statut: 'Chaud', date: '12 mars', hs: 'crm-2' as string | null },
                              { nom: 'Karim B.', co: 'InnoSpace', statut: 'Contacté', date: '10 mars', hs: null as string | null },
                              { nom: 'Thomas R.', co: 'BuildCo', statut: 'Nouveau', date: '8 mars', hs: null as string | null },
                              { nom: 'Sophie L.', co: 'Arch.Studio', statut: 'Chaud', date: '5 mars', hs: null as string | null },
                            ].map(({ nom, co, statut, date, hs }) => (
                              <div key={nom} className="grid grid-cols-3 px-3 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                                <div>
                                  <p className="text-[11px] text-ink-primary">{nom}</p>
                                  <p className="text-[10px] text-ink-tertiary">{co}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                    statut === 'Chaud' ? 'bg-brand-orange/10 text-brand-orange' :
                                    statut === 'Contacté' ? 'bg-brand-teal/10 text-brand-teal' :
                                    'bg-white/[0.06] text-ink-tertiary'
                                  }`}>{statut}</span>
                                  {hs && <Hotspot id={hs} tooltip="Pipeline CRM : faites passer vos prospects de Nouveau → Contacté → Chaud d'un simple clic." active={activeHotspot === hs} onToggle={toggleHotspot} />}
                                </div>
                                <p className="text-[11px] text-ink-tertiary self-center">{date}</p>
                              </div>
                            ))}
                          </div>

                          <div className="relative flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/[0.06]">
                            <Users className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
                            <p className="text-[11px] text-ink-tertiary">Cliquez sur une ligne pour ouvrir la fiche complète</p>
                            <div className="ml-auto">
                              <Hotspot id="crm-1" tooltip="Fiche prospect : notes, historique des échanges, documents, assignation de séquences email automatisées." active={activeHotspot === 'crm-1'} onToggle={toggleHotspot} above />
                            </div>
                          </div>
                        </>
                      )}

                      {/* ─── ARTICLES ─── */}
                      {activeTab === 'articles' && (
                        <>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-ink-primary">
                              Articles <span className="text-ink-tertiary font-normal">(12)</span>
                            </h3>
                            <div className="relative flex items-center gap-2">
                              <button className="text-[11px] bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-lg cursor-default">
                                + Nouvel article
                              </button>
                              <Hotspot id="articles-2" tooltip="Éditeur rich text avec preview en direct. Images, vidéos, blocs code. Publiez en un clic." active={activeHotspot === 'articles-2'} onToggle={toggleHotspot} above />
                            </div>
                          </div>

                          <div className="space-y-2">
                            {[
                              { title: 'Guide SEO complet pour PME en 2025', score: 94, status: 'Publié', date: '12 mars', hs: 'articles-1' as string | null },
                              { title: 'Comment digitaliser son showroom ?', score: 78, status: 'Publié', date: '8 mars', hs: null as string | null },
                              { title: "L'impact du chatbot IA sur les ventes", score: 61, status: 'Brouillon', date: '5 mars', hs: null as string | null },
                            ].map(({ title, score, status, date, hs }) => (
                              <div key={title} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.10] transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-medium text-ink-primary truncate">{title}</p>
                                  <p className="text-[10px] text-ink-tertiary mt-0.5">{date}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="relative flex items-center gap-1">
                                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg ${
                                      score >= 85 ? 'bg-brand-green/10 text-brand-green' :
                                      score >= 65 ? 'bg-brand-orange/10 text-brand-orange' :
                                      'bg-red-500/10 text-red-400'
                                    }`}>{score}</span>
                                    {hs && <Hotspot id={hs} tooltip="Score SEO calculé en temps réel : title, H1, mots-clés, lisibilité, balises meta, liens internes." active={activeHotspot === hs} onToggle={toggleHotspot} above />}
                                  </div>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    status === 'Publié' ? 'bg-brand-green/10 text-brand-green' : 'bg-white/[0.06] text-ink-tertiary'
                                  }`}>{status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* ─── CHATBOT ─── */}
                      {activeTab === 'chatbot' && (
                        <>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-ink-primary">Chatbot IA</h3>
                            <div className="relative flex items-center gap-2">
                              <span className="flex items-center gap-1.5 text-[10px] font-medium text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-full">
                                <BookOpen className="w-3 h-3" />
                                8 documents sources
                              </span>
                              <Hotspot id="chatbot-2" tooltip="Ajoutez des PDF, URLs ou textes depuis le back-office. Le chatbot se met à jour instantanément." active={activeHotspot === 'chatbot-2'} onToggle={toggleHotspot} above />
                            </div>
                          </div>

                          <div className="bg-[#0A0A0B] rounded-xl border border-white/[0.06] p-4 space-y-3">
                            {[
                              { from: 'user', text: 'Quels sont vos délais de livraison ?' },
                              { from: 'bot', text: 'Nos projets sont livrés en 3 à 4 semaines selon la complexité. Un appel de découverte gratuit permet d\'avoir une estimation précise.', hs: 'chatbot-1' as string | null },
                              { from: 'user', text: 'Proposez-vous de la maintenance après livraison ?' },
                              { from: 'bot', text: 'Oui, notre back-office vous rend autonome pour les mises à jour courantes. Nous proposons aussi des contrats de support mensuel.', hs: null as string | null },
                            ].map(({ from, text, hs }, i) => (
                              <div key={i} className={`flex ${from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`relative max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                                  from === 'user'
                                    ? 'bg-brand-teal/15 rounded-tr-sm'
                                    : 'bg-white/[0.05] rounded-tl-sm'
                                }`}>
                                  <p className="text-[11px] text-ink-secondary leading-relaxed">{text}</p>
                                  {hs && (
                                    <div className="absolute -top-2 -right-2">
                                      <Hotspot id={hs} tooltip="Le chatbot est entraîné sur VOS contenus et FAQ. Il répond comme un expert de votre business, 24h/24." active={activeHotspot === hs} onToggle={toggleHotspot} above />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* ─── SEO ─── */}
                      {activeTab === 'seo' && (
                        <>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-ink-primary">Audit SEO</h3>
                            <span className="text-[10px] text-ink-tertiary">Dernière analyse : il y a 2 min</span>
                          </div>

                          <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-center space-y-3">
                            <p className="text-[10px] text-ink-tertiary font-medium">Score global</p>
                            <p className="text-5xl font-bold font-mono text-brand-green">94</p>
                            <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full w-[94%] bg-gradient-to-r from-brand-teal to-brand-green rounded-full" />
                            </div>
                            <p className="text-[10px] text-ink-secondary">Excellent · 94 / 100</p>
                            <div className="absolute top-3 right-3">
                              <Hotspot id="seo-1" tooltip="Score calculé automatiquement à chaque publication. Corrigez les problèmes en direct depuis l'éditeur." active={activeHotspot === 'seo-1'} onToggle={toggleHotspot} above />
                            </div>
                          </div>

                          <div className="space-y-2">
                            {[
                              { ok: true,  label: 'Meta title optimisé', hs: null as string | null },
                              { ok: true,  label: 'Open Graph configuré', hs: null as string | null },
                              { ok: true,  label: 'Sitemap XML à jour', hs: null as string | null },
                              { ok: false, label: 'Alt images manquantes (3)', hs: 'seo-2' as string | null },
                              { ok: true,  label: 'JSON-LD structuré présent', hs: null as string | null },
                            ].map(({ ok, label, hs }) => (
                              <div key={label} className={`flex items-center gap-3 p-2.5 rounded-lg ${ok ? '' : 'bg-amber-500/[0.04] border border-amber-500/10'}`}>
                                <span className={`text-sm flex-shrink-0 ${ok ? 'text-brand-green' : 'text-amber-400'}`}>{ok ? '✓' : '⚠'}</span>
                                <p className={`text-[11px] flex-1 ${ok ? 'text-ink-secondary' : 'text-amber-400'}`}>{label}</p>
                                {hs && <Hotspot id={hs} tooltip="Chaque problème est listé avec le lien direct vers la page à corriger. Résolvez en 2 clics." active={activeHotspot === hs} onToggle={toggleHotspot} above />}
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 7. CTA ────────────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section id="cta-section" className="relative py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="hero-mesh absolute inset-0 opacity-50" />
        <div className="gradient-orb absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-teal/12 blur-[100px]" />
        <div className="gradient-orb absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-brand-orange/10 blur-[100px]" />
      </div>

      <motion.div
        className="max-w-3xl mx-auto text-center space-y-8"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <motion.div variants={fadeUp}><Badge>Passez à l&apos;action</Badge></motion.div>

        <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight leading-tight">
          Prêt à passer au <GradientText>niveau supérieur</GradientText> ?
        </motion.h2>

        <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-xl leading-relaxed">
          La Plateforme est construite sur mesure. Chaque projet est unique. Parlons du vôtre.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-4">
          <Button href="/contact" variant="primary" className="text-base px-8 py-4">
            Démarrer mon projet <ArrowRight className="w-5 h-5" />
          </Button>
          <Button href="/contact" variant="secondary" className="text-base px-8 py-4">
            Voir une démo
          </Button>
        </motion.div>

        <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-ink-tertiary pt-4">
          {['Devis sous 48h', 'Premier appel offert', "Pas d'engagement"].map((g) => (
            <span key={g} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              {g}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
