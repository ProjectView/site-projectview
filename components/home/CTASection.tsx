'use client';

import { motion } from 'framer-motion';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function CTASection() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-teal/[0.08] blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-purple/[0.08] blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        className="relative mx-auto max-w-[800px] text-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div variants={fadeUp}>
          <Heading as="h2" size="section">
            Prêt à transformer vos{' '}
            <GradientText>espaces</GradientText>&nbsp;?
          </Heading>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-ink-secondary text-lg leading-relaxed mt-6 max-w-lg mx-auto"
        >
          Discutons de votre projet et découvrez comment nos solutions
          peuvent créer des expériences mémorables pour vos clients.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <Button variant="primary" href="/contact" className="gap-2 group">
            Prendre rendez-vous
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="secondary" href="/solutions">
            Explorer nos solutions
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
