'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { SolutionCaseStudies } from '@/components/solutions/detail/SolutionCaseStudies';
import { SolutionFAQ } from '@/components/solutions/detail/SolutionFAQ';
import { OtherSolutions } from '@/components/solutions/detail/OtherSolutions';
import type { Solution } from '@/lib/fallback-data';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function SolutionDetailContent({ solution }: { solution: Solution }) {
  return (
    <>
      {/* Full description */}
      <SectionWrapper>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="flex-1 max-w-3xl">
            <Heading as="h2" size="section" className="mb-8">
              En <GradientText>détail</GradientText>
            </Heading>
            <p className="text-ink-secondary text-lg leading-relaxed">
              {solution.fullDescription}
            </p>
          </div>

          {/* Quick stat card */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 text-center sticky top-32">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-3">Impact mesuré</p>
              <p className="font-mono font-bold text-4xl gradient-text">{solution.badgeText}</p>
              <p className="text-ink-secondary text-sm mt-3">{solution.statLine}</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Key benefits grid */}
      <SectionWrapper glow="teal">
        <Heading as="h2" size="section" className="text-center mb-16">
          Avantages <GradientText>clés</GradientText>
        </Heading>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {solution.keyBenefits.map((benefit) => (
            <motion.div key={benefit.title} variants={fadeUp}>
              <GlassCard accentColor={solution.accentColor} className="p-8 h-full">
                <h3 className="font-heading font-bold text-xl mb-3">{benefit.title}</h3>
                <p className="text-ink-secondary text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </SectionWrapper>

      {/* Feature list */}
      <SectionWrapper>
        <Heading as="h2" size="section" className="text-center mb-16">
          Fonctionnalités
        </Heading>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {solution.features.map((feature) => (
            <motion.div
              key={feature.text}
              variants={fadeUp}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
            >
              <span className="text-2xl">{feature.emoji}</span>
              <span className="text-ink-secondary text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-ink-tertiary text-sm mt-8">
          {solution.statLine}
        </p>
      </SectionWrapper>

      {/* Case studies */}
      <SolutionCaseStudies solution={solution} />

      {/* FAQ */}
      <SolutionFAQ solutionSlug={solution.slug} />

      {/* Other solutions */}
      <OtherSolutions currentSlug={solution.slug} />

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-purple/[0.08] blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-[600px] text-center">
          <Heading as="h2" size="section">
            Prêt à passer à l&apos;action&nbsp;?
          </Heading>
          <p className="text-ink-secondary mt-4 mb-8">
            Contactez-nous pour une démonstration personnalisée de cette solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" href="/contact">
              Demander une démo
            </Button>
            <Button variant="secondary" href="/solutions">
              Voir toutes les solutions
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
