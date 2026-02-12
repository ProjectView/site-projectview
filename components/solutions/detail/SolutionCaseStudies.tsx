'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCaseStudiesBySolution } from '@/lib/fallback-data';
import type { Solution } from '@/lib/fallback-data';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function SolutionCaseStudies({ solution }: { solution: Solution }) {
  const studies = getCaseStudiesBySolution(solution.slug);

  if (studies.length === 0) return null;

  return (
    <SectionWrapper glow="orange">
      <div className="text-center mb-12">
        <Badge>Cas Clients</Badge>
        <Heading as="h2" size="section" className="mt-6">
          Ils l&apos;ont <GradientText>adopté</GradientText>
        </Heading>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {studies.map((cs) => (
          <motion.div key={cs.slug} variants={fadeUp}>
            <GlassCard accentColor={solution.accentColor} className="p-6 md:p-8 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary">{cs.client}</span>
                <span className="text-ink-tertiary">·</span>
                <span className="text-xs text-ink-tertiary">{cs.industry}</span>
              </div>

              <h3 className="font-heading font-bold text-lg mb-3">{cs.title}</h3>

              <p className="text-ink-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                {cs.description}
              </p>

              {/* Results badge */}
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
                <span className="text-xs font-semibold gradient-text">{cs.results}</span>
              </div>

              {/* Solutions used */}
              <div className="flex flex-wrap gap-2 mt-4">
                {cs.solutionsUsed.map((used) => (
                  <span key={used} className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-ink-tertiary">
                    {used}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
