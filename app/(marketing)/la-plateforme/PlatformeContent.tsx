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

/* ─── Typing targets ────────────────────────────────────────────────── */

const TYPING_TARGETS = ['architectes', 'retailers', 'showrooms', 'constructeurs', 'promoteurs', 'startups'];

/* ─── Helpers ───────────────────────────────────────────────────────── */

function formatEur(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

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
    // Find the final CTA section by its id
    ctaRef.current = document.getElementById('cta-section');
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const show = scrollY > 600;

      // Hide when near the final CTA section
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
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
      <RoiSection />
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
      {/* Mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="hero-mesh absolute inset-0 opacity-60" />
        <div className="gradient-orb absolute -top-40 -left-40 w-[700px] h-[700px] bg-brand-teal/10 blur-[120px]" />
        <div className="gradient-orb absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-brand-orange/8 blur-[120px]" />
        <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/6 blur-[100px]" />
      </div>

      <div className="max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
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

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-ink-secondary leading-relaxed max-w-xl"
            >
              La Plateforme, c&apos;est un front au niveau des meilleurs sites du monde
              et un back-office complet pour piloter votre activité —
              construit <span className="text-ink-primary font-medium">brique par brique</span>, exactement pour vous.
            </motion.p>

            {/* Typing animation */}
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

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              custom={5}
              className="flex flex-wrap gap-6 pt-4 border-t border-white/[0.06]"
            >
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
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Front mockup — browser window */}
            <motion.div
              className="absolute top-0 left-0 w-[370px] rounded-2xl overflow-hidden border border-white/[0.10] shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'perspective(1000px) rotateY(-4deg) rotateX(3deg)' }}
            >
              {/* Browser chrome */}
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
              {/* Page preview */}
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

            {/* Back-office mockup — app window */}
            <motion.div
              className="absolute bottom-0 right-0 w-[330px] rounded-2xl overflow-hidden border border-white/[0.12] shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{ transform: 'perspective(1000px) rotateY(4deg) rotateX(-2deg)' }}
            >
              {/* Title bar */}
              <div className="bg-dark-surface px-4 py-3 flex items-center gap-3 border-b border-white/[0.06]">
                <LayoutDashboard className="w-4 h-4 text-brand-teal" />
                <span className="text-xs font-medium text-ink-secondary">Back-office</span>
                <div className="ml-auto flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/[0.15]" />)}
                </div>
              </div>
              {/* Sidebar + content */}
              <div className="flex bg-[#0D0D10] h-[260px]">
                {/* Sidebar */}
                <div className="w-12 bg-dark-surface/50 flex flex-col items-center py-3 gap-3 border-r border-white/[0.05]">
                  {[BarChart3, FileText, Users, MessageSquare, Zap].map((Icon, i) => (
                    <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-brand-teal/20' : 'hover:bg-white/[0.04]'}`}>
                      <Icon className={`w-3.5 h-3.5 ${i === 0 ? 'text-brand-teal' : 'text-ink-tertiary'}`} />
                    </div>
                  ))}
                </div>
                {/* Content */}
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

            {/* Connector line */}
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
          <motion.h2
            variants={fadeUp} custom={1}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight leading-tight"
          >
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
          {/* Old */}
          <motion.div
            variants={fadeUp} custom={0}
            className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-8 space-y-5"
          >
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

          {/* New */}
          <motion.div
            variants={fadeUp} custom={1}
            className="rounded-2xl border border-brand-teal/25 bg-brand-teal/[0.04] p-8 space-y-5 relative overflow-hidden"
          >
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
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-ink-secondary leading-relaxed italic">
                  &ldquo;{quote}&rdquo;
                </p>
                {/* Author */}
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
          <motion.h2
            variants={fadeUp} custom={1}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight"
          >
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
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}><Badge>Le back-office</Badge></motion.div>
          <motion.h2
            variants={fadeUp} custom={1}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight"
          >
            Tous les outils. <GradientText>Un seul endroit.</GradientText>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-lg max-w-xl mx-auto">
            Chaque brique est disponible à la carte. Vous choisissez ce dont vous avez besoin.
          </motion.p>
          {/* Counter */}
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

        {/* Tab selector */}
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

        {/* Feature grid */}
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
                  {/* Status badge */}
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
          <motion.h2
            variants={fadeUp} custom={1}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight"
          >
            Construit brique <GradientText>par brique</GradientText>.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-lg max-w-lg mx-auto">
            Pas de template. Pas de compromis. Chaque feature est pensée pour votre métier.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[calc(10%+20px)] right-[calc(10%+20px)] h-px bg-gradient-to-r from-brand-teal/0 via-brand-teal/30 to-brand-orange/0" />

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {STEPS.map(({ n, emoji, title, desc }, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center lg:items-start lg:text-left gap-4"
              >
                {/* Number circle */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-dark-surface border border-white/[0.08] flex flex-col items-center justify-center gap-0.5 flex-shrink-0">
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-[10px] font-mono text-ink-tertiary">{n}</span>
                  </div>
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

/* ─── 6. ROI CALCULATOR ─────────────────────────────────────────────── */

function RoiSection() {
  const [agenceBudget, setAgenceBudget] = useState(3000);
  const [leadsPerMonth, setLeadsPerMonth] = useState(20);
  const [clientValue, setClientValue] = useState(5000);

  const opportunite = leadsPerMonth * 12 * clientValue * 0.08;
  const total = agenceBudget + opportunite;

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/8 blur-[120px]" />
      </div>

      <div className="max-w-[1280px] mx-auto">
        <motion.div
          className="text-center mb-12 space-y-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}><Badge>Le calculateur</Badge></motion.div>
          <motion.h2
            variants={fadeUp} custom={1}
            className="text-[clamp(2rem,4.5vw,3.75rem)] font-bold tracking-tight"
          >
            Combien vous coûte <GradientText>vraiment</GradientText> votre site ?
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-ink-secondary text-lg max-w-xl mx-auto">
            Ajustez les curseurs selon votre situation. Voyez le manque à gagner en temps réel.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-3xl border border-white/[0.10] bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 space-y-8">
            {/* Sliders */}
            <div className="space-y-7">
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-ink-secondary">Budget agence / an</label>
                  <span className="text-sm font-bold font-mono text-brand-orange">{formatEur(agenceBudget)}</span>
                </div>
                <input
                  type="range" min={500} max={10000} step={500}
                  value={agenceBudget}
                  onChange={(e) => setAgenceBudget(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#D4842A' }}
                />
                <p className="text-[11px] text-ink-tertiary">Ce que vous payez pour maintenir votre site actuel</p>
              </div>

              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-ink-secondary">Leads manqués / mois</label>
                  <span className="text-sm font-bold font-mono text-brand-teal">{leadsPerMonth}</span>
                </div>
                <input
                  type="range" min={0} max={100} step={5}
                  value={leadsPerMonth}
                  onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#3B7A8C' }}
                />
                <p className="text-[11px] text-ink-tertiary">Visiteurs qui quittent votre site sans laisser leurs coordonnées</p>
              </div>

              {/* Slider 3 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-ink-secondary">Valeur moyenne d&apos;un client</label>
                  <span className="text-sm font-bold font-mono text-brand-green">{formatEur(clientValue)}</span>
                </div>
                <input
                  type="range" min={500} max={20000} step={500}
                  value={clientValue}
                  onChange={(e) => setClientValue(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#6B9B37' }}
                />
                <p className="text-[11px] text-ink-tertiary">Chiffre d&apos;affaires moyen généré par client signé</p>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/[0.05] p-6 space-y-3 text-center">
              <p className="text-sm text-ink-tertiary">Manque à gagner estimé / an</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={total}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="text-[clamp(2.5rem,6vw,4rem)] font-bold font-mono text-brand-orange leading-none"
                >
                  {formatEur(total)}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs text-ink-tertiary max-w-xs mx-auto">
                dont {formatEur(opportunite)} de revenus potentiels non capturés
                (taux de conversion moyen 8 %)
              </p>
            </div>

            {/* CTA */}
            <div className="text-center space-y-3">
              <Button href="/contact" variant="primary" className="w-full sm:w-auto">
                Demander mon devis personnalisé <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-ink-tertiary">Premier appel offert · Devis sous 48h · Sans engagement</p>
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
      {/* Background */}
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
        <motion.div variants={fadeUp}>
          <Badge>Passez à l&apos;action</Badge>
        </motion.div>

        <motion.h2
          variants={fadeUp} custom={1}
          className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight leading-tight"
        >
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

        {/* Guarantees */}
        <motion.div
          variants={fadeUp} custom={4}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-ink-tertiary pt-4"
        >
          {[
            'Devis sous 48h',
            'Premier appel offert',
            'Pas d\'engagement',
          ].map((g) => (
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
