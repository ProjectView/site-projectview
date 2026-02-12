'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Radio, Users, Presentation, Sparkles, ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { getOtherSolutions } from '@/lib/fallback-data';
import { useCardTilt } from '@/hooks/useCardTilt';

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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function OtherSolutionCard({ solution }: { solution: ReturnType<typeof getOtherSolutions>[number] }) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useCardTilt(4);
  const Icon = iconMap[solution.icon] || Sparkles;

  return (
    <motion.div variants={fadeUp}>
      <div
        ref={ref}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <GlassCard accentColor={solution.accentColor} className="p-6 h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${accentGradients[solution.accentColor]} text-white`}>
              <Icon className="w-4 h-4" />
            </div>
            <Badge className="text-[10px]">{solution.badgeText}</Badge>
          </div>

          <h3 className="font-heading font-bold text-lg mb-2">{solution.title}</h3>
          <p className="text-ink-secondary text-sm leading-relaxed mb-4">{solution.subtitle}</p>

          <Link
            href={`/solutions/${solution.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold gradient-text group"
          >
            Découvrir
            <ArrowRight className="w-4 h-4 text-brand-teal transition-transform group-hover:translate-x-1" />
          </Link>
        </GlassCard>
      </div>
    </motion.div>
  );
}

export function OtherSolutions({ currentSlug }: { currentSlug: string }) {
  const others = getOtherSolutions(currentSlug);

  return (
    <SectionWrapper glow="teal">
      <div className="text-center mb-12">
        <Badge>Découvrir aussi</Badge>
        <Heading as="h2" size="section" className="mt-6">
          Nos autres <GradientText>solutions</GradientText>
        </Heading>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {others.map((s) => (
          <OtherSolutionCard key={s.slug} solution={s} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
