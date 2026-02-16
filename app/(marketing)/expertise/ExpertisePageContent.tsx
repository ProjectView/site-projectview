'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { caseStudies } from '@/lib/fallback-data';

const industries = [
  'tous',
  'Aménagement',
  'Architecture',
  'Retail',
  'Immobilier',
  'Construction',
  'Industrie',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export function ExpertisePageContent() {
  const [activeIndustry, setActiveIndustry] = useState('tous');

  const filtered = activeIndustry === 'tous'
    ? caseStudies
    : caseStudies.filter((cs) => cs.industry === activeIndustry);

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 hero-mesh">
        <div className="mx-auto max-w-[1280px] text-center">
          <Badge>Expertise</Badge>
          <Heading as="h1" size="hero" className="mt-6">
            Nos réalisations <GradientText>concrètes</GradientText>
          </Heading>
          <p className="text-ink-secondary text-lg max-w-xl mx-auto mt-6 leading-relaxed">
            Découvrez comment nous avons transformé les espaces de nos clients
            à travers des projets concrets et mesurables.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap gap-2 justify-center">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setActiveIndustry(ind)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer capitalize ${
                  activeIndustry === ind
                    ? 'bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {ind === 'tous' ? 'Tous les secteurs' : ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies grid */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-[1280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndustry}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {filtered.map((cs) => (
                <motion.div key={cs.slug} variants={fadeUp} layout>
                  <GlassCard accentColor="teal" className="p-8 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="text-[10px]">{cs.industry}</Badge>
                      <span className="text-xs text-ink-tertiary">{cs.client}</span>
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3">{cs.title}</h3>
                    <p className="text-ink-secondary text-sm leading-relaxed mb-4 flex-1">
                      {cs.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cs.solutionsUsed.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full text-[10px] bg-white/[0.06] border border-white/[0.06] text-ink-secondary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                      <p className="text-sm font-medium gradient-text">{cs.results}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-ink-secondary py-20">
              Aucune étude de cas dans ce secteur pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-purple/[0.08] blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-[600px] text-center">
          <Heading as="h2" size="section">
            Votre projet est <GradientText>unique</GradientText>
          </Heading>
          <p className="text-ink-secondary mt-4 mb-8">
            Parlons-en et construisons ensemble la solution qui vous ressemble.
          </p>
          <Button variant="primary" href="/contact">
            Discuter de votre projet
          </Button>
        </div>
      </section>
    </main>
  );
}
