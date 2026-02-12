'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Radio, Users, Presentation, Sparkles, ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { solutions, comparisonData } from '@/lib/fallback-data';

const iconMap: Record<string, React.ElementType> = {
  radio: Radio,
  users: Users,
  presentation: Presentation,
  sparkles: Sparkles,
};

const accentGradients: Record<string, string> = {
  teal: 'from-brand-teal to-brand-teal-light',
  orange: 'from-brand-orange to-brand-gold',
  green: 'from-brand-green to-brand-teal',
  gold: 'from-brand-orange to-brand-gold',
};

const accentBorders: Record<string, string> = {
  teal: 'border-t-brand-teal',
  orange: 'border-t-brand-orange',
  green: 'border-t-brand-green',
  gold: 'border-t-brand-gold',
};

const accentTextColors: Record<string, string> = {
  teal: 'text-brand-teal',
  orange: 'text-brand-orange',
  green: 'text-brand-green',
  gold: 'text-brand-gold',
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function SolutionsComparisonTable() {
  return (
    <SectionWrapper id="comparatif" glow="purple">
      <div className="text-center mb-12">
        <Badge>Comparatif</Badge>
        <Heading as="h2" size="section" className="mt-6">
          Comparez nos <GradientText>solutions</GradientText>
        </Heading>
        <p className="text-ink-secondary mt-4 max-w-xl mx-auto">
          Retrouvez en un coup d&apos;oeil les caractéristiques de chaque solution.
        </p>
      </div>

      {/* Table container — scrollable on mobile */}
      <div className="overflow-x-auto -mx-6 px-6">
        <motion.div
          className="min-w-[700px] rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="grid grid-cols-[160px_repeat(4,1fr)]">
            <div className="p-4 border-b border-white/[0.06]" />
            {solutions.map((s) => {
              const Icon = iconMap[s.icon] || Sparkles;
              return (
                <div
                  key={s.slug}
                  className={`p-4 border-b border-white/[0.06] border-t-2 ${accentBorders[s.accentColor]} text-center`}
                >
                  <div className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-gradient-to-br ${accentGradients[s.accentColor]} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="font-heading font-bold text-sm">{s.title.split(' ').slice(0, 2).join(' ')}</p>
                </div>
              );
            })}
          </motion.div>

          {/* Data rows */}
          {comparisonData.rows.map((row) => (
            <motion.div
              key={row.label}
              variants={fadeUp}
              className="grid grid-cols-[160px_repeat(4,1fr)] hover:bg-white/[0.02] transition-colors duration-200"
            >
              <div className="p-4 border-b border-white/[0.06] flex items-center">
                <span className="text-ink-secondary text-xs font-semibold uppercase tracking-wider">{row.label}</span>
              </div>
              {row.values.map((value, i) => (
                <div
                  key={`${row.label}-${i}`}
                  className="p-4 border-b border-white/[0.06] flex items-center justify-center text-center"
                >
                  <span className={`text-sm font-medium ${accentTextColors[solutions[i].accentColor]}`}>
                    {value}
                  </span>
                </div>
              ))}
            </motion.div>
          ))}

          {/* CTA row */}
          <motion.div variants={fadeUp} className="grid grid-cols-[160px_repeat(4,1fr)]">
            <div className="p-4" />
            {solutions.map((s) => (
              <div key={s.slug} className="p-4 flex items-center justify-center">
                <Link
                  href={`/solutions/${s.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold gradient-text group"
                >
                  En savoir plus
                  <ArrowRight className="w-3 h-3 text-brand-teal transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
