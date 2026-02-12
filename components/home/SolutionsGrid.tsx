'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Radio, Users, Presentation, Sparkles, ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { useCardTilt } from '@/hooks/useCardTilt';

interface SolutionData {
  title: string;
  slug: string;
  gradient: string;
  accentBorder: string;
  icon: React.ElementType;
  badge: string;
  subtitle: string;
  description: string;
  features: string[];
  stat: string;
}

const solutions: SolutionData[] = [
  {
    title: 'Affichage Dynamique & Interactif',
    slug: 'affichage-dynamique',
    gradient: 'from-brand-teal to-brand-teal-light',
    accentBorder: 'border-t-brand-teal',
    icon: Radio,
    badge: "+340% d'engagement",
    subtitle: 'Vos affiches statiques ? Ignorées. Vos produits phares ? Inaperçus.',
    description: 'Dans un océan de sollicitations visuelles, votre communication se noie.',
    features: [
      'Dynamique : contenus animés, temps réel',
      'Interactif : touchez, déclenchez',
      'Showrooms retail',
      'Communication interne',
    ],
    stat: "340% d'engagement en plus. Chaque point de contact devient mémorable.",
  },
  {
    title: 'Solutions de Collaboration',
    slug: 'collaboration',
    gradient: 'from-brand-purple to-brand-pink',
    accentBorder: 'border-t-brand-purple',
    icon: Users,
    badge: '73% de temps gagné',
    subtitle: 'Et si vos réunions devenaient enfin productives ?',
    description: 'Chaque minute perdue en connexion est une opportunité manquée.',
    features: [
      'Écrans visio tout-en-un',
      'Partage sans fil ultra-simplifié',
      'Connectez-vous en un geste',
      'Collaborez naturellement',
    ],
    stat: '73% de temps gagné en réunion.',
  },
  {
    title: 'Solutions de Présentation Innovante',
    slug: 'presentation-innovante',
    gradient: 'from-brand-green to-brand-teal',
    accentBorder: 'border-t-brand-green',
    icon: Presentation,
    badge: '89% mémorisation',
    subtitle: 'Arrêtez de présenter. Donnez vie à vos projets.',
    description: 'Vos clients hochent la tête mais ne se projettent pas.',
    features: [
      'Écrans tactiles showroom',
      'Table tactile de négociation',
      'VR avant construction',
    ],
    stat: "89% de mémorisation. L'immersion qui convertit.",
  },
  {
    title: 'Assistant IA Personnalisé',
    slug: 'assistant-ia',
    gradient: 'from-brand-orange to-brand-gold',
    accentBorder: 'border-t-brand-orange',
    icon: Sparkles,
    badge: '10h gagnées/semaine',
    subtitle: 'Prise en charge immédiate 24/7, pour chaque utilisateur.',
    description: 'Vos équipes perdent un temps précieux sur les mêmes questions.',
    features: [
      'Réponses 24/7',
      'Recommandations personnalisées',
      'Processus automatisés',
    ],
    stat: '10h gagnées par semaine.',
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function SolutionCard({ solution }: { solution: SolutionData }) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useCardTilt(6);

  return (
    <motion.div variants={fadeUp}>
      <div
        ref={ref}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-2xl bg-white/[0.04] border border-white/[0.08] border-t-2 ${solution.accentBorder} p-8 h-full flex flex-col transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]`}
      >
        {/* Header: icon + badge */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center`}>
            <solution.icon className="w-5 h-5 text-white" />
          </div>
          <Badge className="text-[10px]">{solution.badge}</Badge>
        </div>

        {/* Title + subtitle */}
        <h3 className="font-heading font-bold text-xl mb-2">{solution.title}</h3>
        <p className="text-ink-primary text-sm font-medium mb-1">{solution.subtitle}</p>
        <p className="text-ink-secondary text-sm mb-5">{solution.description}</p>

        {/* Feature list */}
        <ul className="space-y-2 mb-6 flex-1">
          {solution.features.map((feature) => (
            <li key={feature} className="text-ink-secondary text-sm flex items-start gap-2">
              <span className="text-brand-teal mt-0.5">&#8226;</span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Bottom: stat + link */}
        <div className="pt-5 border-t border-white/[0.06]">
          <p className="text-ink-secondary text-xs mb-3">{solution.stat}</p>
          <Link
            href={`/solutions/${solution.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold gradient-text group"
          >
            En savoir plus
            <ArrowRight className="w-3.5 h-3.5 text-brand-teal transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function SolutionsGrid() {
  return (
    <SectionWrapper>
      <div className="text-center mb-16">
        <Badge>Nos Solutions</Badge>
        <Heading as="h2" size="section" className="mt-6">
          Tout ce dont vous avez <GradientText>besoin</GradientText>
        </Heading>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {solutions.map((solution) => (
          <SolutionCard key={solution.slug} solution={solution} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
