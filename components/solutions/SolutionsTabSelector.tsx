'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Radio, Users, Presentation, Sparkles, ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { solutions } from '@/lib/fallback-data';
import { useCardTilt } from '@/hooks/useCardTilt';

const iconMap: Record<string, React.ElementType> = {
  radio: Radio,
  users: Users,
  presentation: Presentation,
  sparkles: Sparkles,
};

const accentStyles: Record<string, { gradient: string; border: string; glow: string }> = {
  teal: { gradient: 'from-brand-teal to-brand-teal-light', border: 'border-t-brand-teal', glow: 'bg-brand-teal/[0.06]' },
  orange: { gradient: 'from-brand-orange to-brand-gold', border: 'border-t-brand-orange', glow: 'bg-brand-orange/[0.06]' },
  green: { gradient: 'from-brand-green to-brand-teal', border: 'border-t-brand-green', glow: 'bg-brand-green/[0.06]' },
  gold: { gradient: 'from-brand-orange to-brand-gold', border: 'border-t-brand-gold', glow: 'bg-brand-gold/[0.06]' },
};

function ActiveSolutionCard({ solution }: { solution: typeof solutions[number] }) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useCardTilt(4);
  const Icon = iconMap[solution.icon] || Sparkles;
  const accent = accentStyles[solution.accentColor];

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`rounded-2xl bg-white/[0.04] border border-white/[0.08] border-t-2 ${accent.border} p-8 md:p-10 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]`}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: info */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${accent.gradient} text-white shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <Badge className="text-[10px] mb-2">{solution.badgeText}</Badge>
              <h3 className="font-heading font-bold text-2xl">{solution.title}</h3>
            </div>
          </div>

          <p className="text-ink-primary font-medium mb-2">{solution.subtitle}</p>
          <p className="text-ink-secondary text-sm leading-relaxed mb-6">
            {solution.shortDescription}
          </p>

          <ul className="space-y-2 mb-6">
            {solution.features.map((f) => (
              <li key={f.text} className="text-ink-secondary text-sm flex items-start gap-2">
                <span>{f.emoji}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-ink-tertiary mb-6">{solution.statLine}</p>

          <Link
            href={`/solutions/${solution.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold gradient-text group"
          >
            En savoir plus
            <ArrowRight className="w-4 h-4 text-brand-teal transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Right: key benefits */}
        <div className="lg:w-72 flex-shrink-0 space-y-3">
          {solution.keyBenefits.slice(0, 3).map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
            >
              <p className="text-sm font-medium mb-1">{b.title}</p>
              <p className="text-xs text-ink-secondary">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SolutionsTabSelector() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SectionWrapper glow="teal">
      <Heading as="h2" size="section" className="text-center mb-4">
        Explorez nos <GradientText>solutions</GradientText>
      </Heading>
      <p className="text-ink-secondary text-center max-w-2xl mx-auto mb-12">
        Cliquez sur une solution pour découvrir comment elle peut transformer vos espaces.
      </p>

      {/* Tab bar */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {solutions.map((s, i) => {
          const Icon = iconMap[s.icon] || Sparkles;
          const isActive = i === activeIndex;

          return (
            <button
              key={s.slug}
              onClick={() => setActiveIndex(i)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                transition-all duration-300 cursor-pointer
                ${isActive
                  ? 'text-ink-primary'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04]'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.14]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.title.split(' ').slice(0, 2).join(' ')}</span>
                <span className="sm:hidden">{s.title.split(' ')[0]}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Active content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ActiveSolutionCard solution={solutions[activeIndex]} />
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
