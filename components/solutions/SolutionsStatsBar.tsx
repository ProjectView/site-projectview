'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Brain, Zap } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stats = [
  { icon: TrendingUp, value: 340, prefix: '+', suffix: '%', label: "Engagement client", color: 'text-brand-teal', bg: 'bg-brand-teal/15', borderColor: 'border-t-brand-teal' },
  { icon: Clock, value: 73, suffix: '%', label: 'Temps de réunion gagné', color: 'text-brand-orange', bg: 'bg-brand-orange/15', borderColor: 'border-t-brand-orange' },
  { icon: Brain, value: 89, suffix: '%', label: 'Taux de mémorisation', color: 'text-brand-green', bg: 'bg-brand-green/15', borderColor: 'border-t-brand-green' },
  { icon: Zap, value: 10, suffix: 'h', label: 'Gagnées par semaine', color: 'text-brand-gold', bg: 'bg-brand-gold/15', borderColor: 'border-t-brand-gold' },
];

export function SolutionsStatsBar() {
  return (
    <SectionWrapper>
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className={`
                rounded-2xl bg-white/[0.04] border border-white/[0.08] border-t-2 ${stat.borderColor}
                p-5 md:p-6 text-center
                hover:bg-white/[0.06] hover:border-white/[0.14]
                transition-all duration-300
              `}
            >
              <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`font-mono font-bold text-3xl md:text-4xl ${stat.color}`}>
                <AnimatedCounter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2000}
                />
              </div>
              <p className="text-ink-secondary text-xs mt-2">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
