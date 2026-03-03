'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  FileText, Users, CalendarCheck, BarChart3, UserCheck,
  Zap, Bell, Shuffle, Clock, TrendingDown, Rocket,
  ArrowDown, ChevronRight, CheckCircle2, Timer,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

// ─── Fade-up animation variant ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

// ─── Data ──────────────────────────────────────────────────────────────────────

const tickerItems = [
  { emoji: '💰', label: 'économisés', base: 1240, perSec: 0.14 },
  { emoji: '🕐', label: 'heures récupérées', base: 47, perSec: 0.005 },
  { emoji: '📧', label: 'relances envoyées', base: 320, perSec: 0.04 },
  { emoji: '📊', label: 'rapports générés', base: 86, perSec: 0.01 },
  { emoji: '🤝', label: 'leads traités', base: 145, perSec: 0.016 },
  { emoji: '⚡', label: 'workflows actifs', base: 28, perSec: 0.003 },
];

const weekTasks = [
  { day: 'Lun', time: '9h00', task: 'Relancer 8 factures impayées', minutes: 25, icon: FileText, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  { day: 'Mar', time: '10h30', task: 'Envoyer les rapports hebdo à 4 clients', minutes: 45, icon: BarChart3, color: 'text-brand-teal', bg: 'bg-brand-teal/10' },
  { day: 'Mer', time: '9h15', task: 'Suivre 12 prospects sans réponse', minutes: 30, icon: Users, color: 'text-brand-green', bg: 'bg-brand-green/10' },
  { day: 'Jeu', time: '14h00', task: 'Ressaisir les données dans le CRM', minutes: 60, icon: Shuffle, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
  { day: 'Ven', time: '11h00', task: 'Rappels manuels de rendez-vous', minutes: 20, icon: CalendarCheck, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
];
const totalMinutesPerWeek = weekTasks.reduce((s, t) => s + t.minutes, 0);
const totalHoursPerYear = Math.round((totalMinutesPerWeek / 60) * 52);

const automations = [
  {
    icon: FileText, title: 'Relance de factures', accent: '#D4842A',
    badge: '25 min/sem', desc: 'Plus jamais de facture oubliée.',
    nodes: ['Échéance', 'Email', 'SMS', 'Alerte'],
  },
  {
    icon: Users, title: 'Suivi prospects', accent: '#3B7A8C',
    badge: '30 min/sem', desc: 'Chaque lead reçoit la bonne attention.',
    nodes: ['Nouveau lead', 'J+1', 'J+7', 'CRM'],
  },
  {
    icon: CalendarCheck, title: 'Rappels rendez-vous', accent: '#6B9B37',
    badge: '20 min/sem', desc: 'Zéro no-show, zéro oubli.',
    nodes: ['Agenda', 'SMS J-1', 'Email', 'Confirm.'],
  },
  {
    icon: BarChart3, title: 'Rapports automatiques', accent: '#8B6914',
    badge: '45 min/sem', desc: 'Vos KPIs, livrés chaque lundi.',
    nodes: ['Lundi 8h', 'Données', 'PDF', 'Email'],
  },
  {
    icon: UserCheck, title: 'Onboarding client', accent: '#3B7A8C',
    badge: '60 min/client', desc: 'Un accueil parfait, automatiquement.',
    nodes: ['Signature', 'Bienvenue', 'Accès', 'Formation'],
  },
  {
    icon: Zap, title: 'Gestion leads entrants', accent: '#D4842A',
    badge: '40 min/sem', desc: 'Du chatbot au CRM en secondes.',
    nodes: ['Chatbot', 'Scoring', 'Attribution', 'CRM'],
  },
  {
    icon: Bell, title: 'Alertes & stock', accent: '#6B9B37',
    badge: '35 min/sem', desc: 'Anticipez, ne subissez plus.',
    nodes: ['Seuil', 'Notif.', 'Commande', 'Fournisseur'],
  },
  {
    icon: Shuffle, title: 'Synchro multi-outils', accent: '#8B6914',
    badge: '50 min/sem', desc: 'Vos outils parlent enfin la même langue.',
    nodes: ['Action A', 'Sync B', 'Sync C', 'Zéro ressaisie'],
  },
];

const steps = [
  {
    num: '01', title: 'Audit des processus', duration: '2h',
    desc: 'On cartographie ensemble vos tâches répétitives et on calcule le ROI potentiel avant de toucher à quoi que ce soit.',
    icon: Timer, color: 'text-brand-teal', bg: 'bg-brand-teal/10',
  },
  {
    num: '02', title: 'Configuration', duration: '1-2 semaines',
    desc: 'On connecte vos outils existants (email, CRM, facturation…). Zéro code de votre côté, zéro interruption d\'activité.',
    icon: Rocket, color: 'text-brand-orange', bg: 'bg-brand-orange/10',
  },
  {
    num: '03', title: 'Déploiement & formation', duration: 'En continu',
    desc: 'Tests, ajustements, prise en main de votre équipe. On reste disponibles pour faire évoluer les workflows avec vous.',
    icon: CheckCircle2, color: 'text-brand-green', bg: 'bg-brand-green/10',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Ticker horizontal défilant avec compteurs qui s'incrémentent depuis le chargement */
function LiveTicker() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 0.1), 100);
    return () => clearInterval(id);
  }, []);

  const allItems = [...tickerItems, ...tickerItems]; // double pour boucle infinie

  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-white/[0.06] bg-white/[0.02]">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-dark-bg to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      >
        {allItems.map((item, i) => {
          const val = Math.floor(item.base + item.perSec * elapsed * 10);
          return (
            <span key={i} className="flex items-center gap-2 text-sm font-medium text-ink-secondary flex-shrink-0">
              <span className="text-lg">{item.emoji}</span>
              <span className="font-mono font-bold text-ink-primary tabular-nums">
                {val.toLocaleString('fr-FR')}
              </span>
              <span>{item.label}</span>
              <span className="text-ink-tertiary/40 ml-4">·</span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

/** Timeline semaine avec stagger au scroll */
function WeekTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <Badge>VOTRE SEMAINE AUJOURD&apos;HUI</Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
            Le temps qui <GradientText>s&apos;évapore</GradientText> chaque semaine
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-ink-secondary max-w-xl mx-auto">
            Une semaine-type de votre équipe, tâche par tâche. Reconnaissez-vous ces moments ?
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative">
          {/* Line */}
          <div className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-brand-teal/40 via-brand-orange/30 to-brand-green/20" />

          <div className="space-y-8">
            {weekTasks.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} flex-row pl-16 sm:pl-0`}
              >
                {/* Day dot */}
                <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/[0.10] bg-dark-surface z-10">
                  <span className="text-xs font-bold text-ink-secondary">{task.day}</span>
                </div>

                {/* Card — alternates left/right on desktop */}
                <div className={`sm:w-[calc(50%-3rem)] ${i % 2 === 0 ? 'sm:mr-auto sm:text-right' : 'sm:ml-auto'} w-full`}>
                  <GlassCard className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${task.bg}`}>
                      <task.icon className={`w-5 h-5 ${task.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono text-ink-tertiary">{task.time}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">
                          {task.minutes} min
                        </span>
                      </div>
                      <p className="text-sm font-medium text-ink-primary mt-0.5">{task.task}</p>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-red-500/10 border border-red-500/20">
              <TrendingDown className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-300 font-medium">
                  = <span className="font-bold text-red-400">{Math.floor(totalMinutesPerWeek / 60)}h{totalMinutesPerWeek % 60}</span> perdues cette semaine
                </p>
                <p className="text-xs text-red-400/70 mt-0.5">
                  Soit <strong>{totalHoursPerYear}h par an</strong> — l&apos;équivalent de {Math.round(totalHoursPerYear / 8)} jours de travail
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Slider stylé */
function Slider({ label, value, min, max, step = 1, unit, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-ink-secondary">{label}</label>
        <span className="text-sm font-bold font-mono text-ink-primary tabular-nums">
          {value} <span className="text-ink-tertiary font-normal text-xs">{unit}</span>
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/[0.08]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-green transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(59,122,140,0.6)] border-2 border-brand-teal transition-all pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

/** Calculateur interactif */
function TimeCalculator() {
  const [invoices, setInvoices] = useState(20);
  const [prospects, setProspects] = useState(10);
  const [reports, setReports] = useState(5);
  const [team, setTeam] = useState(3);

  // Calcul basé sur des temps moyens réalistes
  const minsPerWeek = Math.round(
    (invoices * 4) / 4 +       // 4 min par facture, ramené à la semaine (mensuel÷4)
    prospects * 3 +              // 3 min par prospect/semaine
    (reports * 15) / 4 +         // 15 min par rapport, ramené à la semaine
    team * 5                     // 5 min de coordination par personne/semaine
  );
  const hoursPerWeek = Math.round((minsPerWeek / 60) * 10) / 10;
  const hoursPerYear = Math.round(hoursPerWeek * 52);
  const costPerYear = Math.round(hoursPerYear * 45 * team);

  return (
    <section className="relative py-24 px-6" id="calculateur">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-brand-teal/[0.06] blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp}><Badge>CALCULATEUR</Badge></motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
            Combien perdez-vous <GradientText>vraiment</GradientText> ?
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-ink-secondary max-w-lg mx-auto">
            Ajustez les curseurs selon votre activité — le calcul se fait en temps réel.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sliders */}
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            className="space-y-7"
          >
            <motion.div variants={fadeUp}>
              <Slider label="Factures à relancer par mois" value={invoices} min={0} max={100} unit="factures" onChange={setInvoices} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Slider label="Prospects à relancer par semaine" value={prospects} min={0} max={50} unit="prospects" onChange={setProspects} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Slider label="Rapports à générer par mois" value={reports} min={0} max={30} unit="rapports" onChange={setReports} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Slider label="Collaborateurs dans l'équipe" value={team} min={1} max={50} unit="personnes" onChange={setTeam} />
            </motion.div>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard accentColor="teal" className="p-8 text-center" hover={false}>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-6">Votre situation actuelle</p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="font-mono text-4xl font-bold text-brand-orange tabular-nums">
                    {hoursPerWeek}h
                  </p>
                  <p className="text-xs text-ink-tertiary mt-1">perdues / semaine</p>
                </div>
                <div>
                  <p className="font-mono text-4xl font-bold text-red-400 tabular-nums">
                    {hoursPerYear}h
                  </p>
                  <p className="text-xs text-ink-tertiary mt-1">perdues / an</p>
                </div>
              </div>

              <div className="py-5 px-6 rounded-xl bg-red-500/[0.08] border border-red-500/20 mb-6">
                <p className="font-mono text-3xl font-bold text-red-400 tabular-nums">
                  {costPerYear.toLocaleString('fr-FR')} €
                </p>
                <p className="text-xs text-ink-tertiary mt-1">coût estimé / an (45€/h chargé)</p>
              </div>

              <div className="py-4 px-5 rounded-xl bg-brand-teal/10 border border-brand-teal/20 mb-6">
                <p className="text-sm text-brand-teal font-medium leading-relaxed">
                  Avec l&apos;automatisation, récupérez{' '}
                  <strong className="font-bold">{Math.round(hoursPerYear * 0.8)}h</strong>{' '}
                  et jusqu&apos;à{' '}
                  <strong className="font-bold">{Math.round(costPerYear * 0.8).toLocaleString('fr-FR')} €</strong>{' '}
                  chaque année.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 rounded-full bg-gradient-to-r from-brand-teal via-brand-green to-brand-orange text-white font-semibold text-sm hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                Je veux récupérer ce temps <ChevronRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Mini workflow SVG animé dans chaque card */
function WorkflowAnimation({ nodes, accent }: { nodes: string[]; accent: string }) {
  const nodeCount = nodes.length;
  const width = 220;
  const height = 48;
  const nodeR = 16;
  const spacing = (width - nodeR * 2) / (nodeCount - 1);

  // Points (x, y) pour chaque nœud
  const points = nodes.map((_, i) => ({ x: nodeR + i * spacing, y: height / 2 }));

  // Path total (ligne entre tous les nœuds)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const pathLen = spacing * (nodeCount - 1);

  return (
    <div className="w-full flex justify-center my-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Background line */}
        <path d={pathD} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />

        {/* Animated accent line */}
        <motion.path
          d={pathD}
          stroke={accent}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray={pathLen}
          initial={{ strokeDashoffset: pathLen }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8 }}
          style={{ opacity: 0.6 }}
        />

        {/* Nodes */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={nodeR} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <motion.circle
              cx={p.x} cy={p.y} r={nodeR}
              fill="none" stroke={accent} strokeWidth="1.5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
              transition={{ duration: 1.8, delay: (i / (nodeCount - 1)) * 1.4, repeat: Infinity, repeatDelay: 0.8 + (1 - i / (nodeCount - 1)) * 1.4 }}
            />
          </g>
        ))}

        {/* Traveling dot — animates cx from first to last node on the horizontal line */}
        <motion.circle
          r={4}
          cy={height / 2}
          fill={accent}
          style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
          animate={{ cx: [points[0].x, points[points.length - 1].x] }}
          transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8 }}
        />
      </svg>
    </div>
  );
}

/** Labels sous les nœuds */
function WorkflowLabels({ nodes }: { nodes: string[] }) {
  return (
    <div className="flex justify-between px-1 mt-1">
      {nodes.map((n, i) => (
        <span key={i} className="text-[9px] text-ink-tertiary text-center" style={{ width: `${100 / nodes.length}%` }}>
          {n}
        </span>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AutomationPageContent() {
  return (
    <main className="relative">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-0 px-6 hero-mesh overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] rounded-full bg-brand-teal/[0.10] blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[250px] rounded-full bg-brand-orange/[0.08] blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <Badge>AUTOMATISATION · GAIN DE TEMPS · ROI MESURABLE</Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-serif tracking-tight"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 1.1 }}
            >
              Votre équipe mérite mieux<br />
              que les tâches <GradientText>répétitives</GradientText>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-ink-secondary max-w-2xl mx-auto leading-relaxed"
            >
              Chaque relance manuelle, chaque rapport copié-collé, chaque notification oubliée —
              c&apos;est du temps et de l&apos;argent qui s&apos;évaporent.{' '}
              <span className="text-ink-primary font-medium">Nous les automatisons.</span>
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#calculateur"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-teal via-brand-green to-brand-orange text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all"
              >
                Calculer mes heures perdues
                <ArrowDown className="w-4 h-4" />
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/[0.15] text-ink-secondary hover:text-ink-primary hover:border-white/[0.30] transition-all font-medium">
                Demander un audit gratuit
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="relative mx-auto mt-16 flex flex-col items-center gap-2 text-ink-tertiary"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────────────── */}
      <LiveTicker />

      {/* ── 2. WEEK TIMELINE ────────────────────────────────────────────────── */}
      <WeekTimeline />

      {/* ── 3. CALCULATEUR ──────────────────────────────────────────────────── */}
      <TimeCalculator />

      {/* ── 4. AUTOMATIONS GRID ─────────────────────────────────────────────── */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp}><Badge>NOS AUTOMATISATIONS</Badge></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              Ce que nous automatisons <GradientText>pour vous</GradientText>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-ink-secondary max-w-lg mx-auto">
              Chaque workflow est visualisé en temps réel — du déclencheur au résultat.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {automations.map((a, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-5 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.accent + '18' }}>
                      <a.icon className="w-5 h-5" style={{ color: a.accent }} />
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: a.accent + '18', color: a.accent }}
                    >
                      {a.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-ink-primary mt-3">{a.title}</h3>
                  <p className="text-xs text-ink-tertiary mt-1 flex-1">{a.desc}</p>

                  {/* Workflow animation */}
                  <div className="mt-3">
                    <WorkflowAnimation nodes={a.nodes} accent={a.accent} />
                    <WorkflowLabels nodes={a.nodes} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. STEPS ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="relative mx-auto max-w-5xl">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}><Badge>NOTRE MÉTHODE</Badge></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              De la réflexion au <GradientText>pilote automatique</GradientText>
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-brand-teal via-brand-orange to-brand-green" />

            <motion.div
              variants={stagger} initial="hidden" whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <GlassCard className="p-6 text-center relative" hover={false}>
                    {/* Step number */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 bg-gradient-to-br from-brand-teal/20 to-brand-orange/10 border border-white/[0.10]">
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div className="inline-block mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-white/[0.06] text-ink-tertiary">
                      ÉTAPE {step.num}
                    </div>
                    <h3 className="text-lg font-bold text-ink-primary mb-1">{step.title}</h3>
                    <div className="inline-flex items-center gap-1.5 mb-3 text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: step.bg }}>
                      <Clock className={`w-3 h-3 ${step.color}`} />
                      <span className={step.color}>{step.duration}</span>
                    </div>
                    <p className="text-sm text-ink-secondary leading-relaxed">{step.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. ROI STATS ─────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-orange/[0.06] blur-[140px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp}><Badge>LES CHIFFRES</Badge></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              Un ROI <GradientText>mesurable dès le premier mois</GradientText>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { num: '2-4h', label: 'récupérées / collab. / semaine', accent: 'brand-teal' },
              { num: '73%', label: "d'erreurs de saisie en moins", accent: 'brand-green' },
              { num: 'J+3', label: 'délai moyen de mise en place', accent: 'brand-orange' },
              { num: '12×', label: "retour sur investissement à 6 mois", accent: 'brand-gold' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-6 text-center" hover={false}>
                  <p className={`font-mono text-3xl font-bold text-${stat.accent} tabular-nums`}>{stat.num}</p>
                  <p className="text-xs text-ink-tertiary mt-2 leading-snug">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-brand-orange/[0.12] blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] rounded-full bg-brand-teal/[0.08] blur-[90px] pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp}><Badge>PASSEZ À L&apos;ACTION</Badge></motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight"
            >
              Votre premier workflow <br />
              automatisé, <GradientText>offert</GradientText>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-ink-secondary text-lg max-w-xl mx-auto">
              On identifie avec vous la tâche qui vous coûte le plus de temps et on l&apos;automatise.
              Gratuit, sans engagement, en moins d&apos;une semaine.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Réserver l&apos;audit gratuit
              </Button>
              <Button href="/solutions" variant="secondary">
                Voir nos solutions
              </Button>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-6 text-xs text-ink-tertiary">
              Réponse sous 24h · Sans engagement · 100% personnalisé
            </motion.p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
