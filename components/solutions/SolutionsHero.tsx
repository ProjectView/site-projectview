'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.4 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const heroStats = [
  { icon: TrendingUp, value: '+340%', label: 'Engagement client', color: 'text-brand-teal', bg: 'bg-brand-teal/15' },
  { icon: Clock, value: '73%', label: 'Temps gagné', color: 'text-brand-orange', bg: 'bg-brand-orange/15' },
  { icon: Brain, value: '89%', label: 'Mémorisation', color: 'text-brand-green', bg: 'bg-brand-green/15' },
];

export function SolutionsHero() {
  return (
    <section className="relative min-h-[75vh] flex items-center pt-28 pb-20 px-6 hero-mesh overflow-hidden">
      <div className="mx-auto max-w-[1280px] w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <Badge>Nos Solutions</Badge>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <Heading as="h1" size="hero" className="mt-6">
                Des solutions pour chaque <GradientText>espace</GradientText>
              </Heading>
            </motion.div>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-ink-secondary text-lg max-w-xl mt-6 leading-relaxed lg:mx-0 mx-auto"
            >
              Écrans dynamiques, collaboration intelligente, présentations immersives
              et intelligence artificielle — nous avons la solution pour transformer
              chaque espace en expérience mémorable.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start"
            >
              <Button variant="primary" href="#comparatif">
                Comparer les solutions
              </Button>
              <Button variant="secondary" href="/contact">
                Nous contacter
              </Button>
            </motion.div>
          </div>

          {/* Right: floating stat cards */}
          <div className="relative w-full lg:w-auto flex-shrink-0">
            <div className="flex flex-col gap-4 items-center lg:items-end">
              {heroStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    custom={i}
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    className="animate-float"
                    style={{ animationDelay: `${i * 0.8}s` }}
                  >
                    <div
                      className={`
                        flex items-center gap-4 px-6 py-4 rounded-2xl
                        bg-white/[0.04] border border-white/[0.08]
                        backdrop-blur-xl
                        hover:bg-white/[0.06] hover:border-white/[0.14]
                        transition-all duration-300
                        ${i === 0 ? 'lg:translate-x-4' : i === 2 ? 'lg:-translate-x-4' : ''}
                      `}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className={`font-mono font-bold text-2xl ${stat.color}`}>{stat.value}</p>
                        <p className="text-ink-secondary text-xs">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Decorative gradient orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-teal/[0.06] blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-brand-orange/[0.05] blur-[60px] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
