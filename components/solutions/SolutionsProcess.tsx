'use client';

import { motion } from 'framer-motion';
import { Search, Palette, Rocket, Headphones } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const steps = [
  {
    number: '01',
    title: 'Diagnostic',
    description: "Nous analysons vos espaces, vos objectifs et votre audience pour identifier les leviers d'impact.",
    icon: Search,
    color: 'text-brand-teal',
    bg: 'bg-brand-teal/15',
  },
  {
    number: '02',
    title: 'Conception',
    description: "Nos experts conçoivent une solution sur mesure, intégrant matériel, logiciel et contenu.",
    icon: Palette,
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/15',
  },
  {
    number: '03',
    title: 'Déploiement',
    description: "Installation, configuration et formation de vos équipes pour une prise en main immédiate.",
    icon: Rocket,
    color: 'text-brand-green',
    bg: 'bg-brand-green/15',
  },
  {
    number: '04',
    title: 'Accompagnement',
    description: "Support technique 24/7, mises à jour et optimisation continue de vos performances.",
    icon: Headphones,
    color: 'text-brand-orange',
    bg: 'bg-brand-orange/15',
  },
];

export function SolutionsProcess() {
  return (
    <SectionWrapper glow="purple">
      <div className="text-center mb-16">
        <Badge>Notre Processus</Badge>
        <Heading as="h2" size="section" className="mt-6">
          Comment nous <GradientText>transformons</GradientText> vos espaces
        </Heading>
        <p className="text-ink-secondary mt-4 max-w-xl mx-auto">
          Un accompagnement de A à Z, du premier diagnostic au support continu.
        </p>
      </div>

      <motion.div
        className="relative"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Connecting line (desktop) */}
        <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange opacity-30 rounded-full" />

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.number} variants={fadeUp}>
                <div className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 text-center hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-300 h-full">
                  {/* Step number */}
                  <span className="font-mono font-bold text-3xl gradient-text">{step.number}</span>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl mx-auto mt-4 mb-4 flex items-center justify-center ${step.bg}`}>
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>

                  {/* Description */}
                  <p className="text-ink-secondary text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
