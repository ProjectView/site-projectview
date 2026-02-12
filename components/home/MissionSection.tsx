'use client';

import { motion } from 'framer-motion';
import { Award, Heart, Calendar, Headphones } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const missionStats = [
  { icon: Award, value: 500, suffix: '+', label: 'Expériences', gradient: 'from-brand-teal to-brand-teal-light' },
  { icon: Heart, value: 98, suffix: '%', label: 'Satisfaction', gradient: 'from-brand-purple to-brand-pink' },
  { icon: Calendar, value: 8, suffix: '+', label: 'Années', gradient: 'from-brand-green to-brand-teal' },
  { icon: Headphones, value: 24, suffix: '/7', label: 'Support IA', gradient: 'from-brand-orange to-brand-gold' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function MissionSection() {
  return (
    <SectionWrapper glow="purple">
      <motion.div
        className="text-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div variants={fadeUp}>
          <Badge>Notre Mission</Badge>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Heading as="h2" size="section" className="mt-8 max-w-4xl mx-auto">
            Nous ne vendons pas de la <GradientText>technologie</GradientText>.
            <br />
            Nous créons des <GradientText>émotions</GradientText>.
          </Heading>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-[700px] mx-auto mt-8 space-y-6">
          <p className="text-ink-secondary text-lg leading-relaxed">
            Chaque showroom devrait faire briller les yeux. Chaque réunion
            devrait déborder d&apos;idées. Chaque projet devrait susciter
            l&apos;enthousiasme dès le premier jour.
          </p>
          <p className="text-ink-secondary text-lg leading-relaxed">
            Nous accompagnons les professionnels de l&apos;aménagement, de la
            construction et du retail dans une transformation simple mais
            radicale&nbsp;: faire de leurs espaces des lieux où la technologie
            disparaît au profit de l&apos;expérience pure.
          </p>
        </motion.div>
      </motion.div>

      {/* 4 stat cards — modern with gradient icon bg */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {missionStats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 text-center hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-0.5">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold font-mono mt-4 gradient-text">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-ink-secondary text-sm mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
