'use client';

import { TrendingUp, Clock, Eye, Sparkles } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export function ComponentShowcase() {
  return (
    <>
      {/* Section: GlassCards */}
      <SectionWrapper id="components" glow="teal">
        <Heading as="h2" size="section" className="text-center mb-16">
          Design System — <GradientText>Phase 2</GradientText>
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard accentColor="teal" className="p-8">
            <h3 className="font-heading text-xl mb-2">GlassCard — Teal accent</h3>
            <p className="text-ink-secondary text-sm">
              Backdrop blur, subtle border, colored top accent. Hover to see the lift and border glow.
            </p>
          </GlassCard>

          <GlassCard accentColor="orange" className="p-8">
            <h3 className="font-heading text-xl mb-2">GlassCard — Orange accent</h3>
            <p className="text-ink-secondary text-sm">
              Same glass morphism with a warm orange top border accent.
            </p>
          </GlassCard>

          <GlassCard accentColor="green" className="p-8">
            <h3 className="font-heading text-xl mb-2">GlassCard — Green accent</h3>
            <p className="text-ink-secondary text-sm">
              Whisper-thin and elegant, not heavy frosted glass.
            </p>
          </GlassCard>

          <GlassCard accentColor="gold" className="p-8">
            <h3 className="font-heading text-xl mb-2">GlassCard — Gold accent</h3>
            <p className="text-ink-secondary text-sm">
              Each card supports optional accent colors and hover transitions.
            </p>
          </GlassCard>
        </div>
      </SectionWrapper>

      {/* Section: StatCards + AnimatedCounter */}
      <SectionWrapper glow="orange">
        <Heading as="h2" size="section" className="text-center mb-16">
          Compteurs <GradientText>animés</GradientText>
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            value={340}
            suffix="%"
            prefix="+"
            label="Engagement client"
            accentColor="teal"
          />
          <StatCard
            icon={Clock}
            value={73}
            suffix="%"
            label="Temps gagné"
            accentColor="orange"
          />
          <StatCard
            icon={Eye}
            value={89}
            suffix="%"
            label="Mémorisation"
            accentColor="green"
          />
          <StatCard
            icon={Sparkles}
            value={10}
            suffix="h"
            label="Gagnées / semaine"
            accentColor="gold"
          />
        </div>

        {/* Standalone counter demo */}
        <div className="text-center mt-16">
          <p className="text-ink-secondary text-sm uppercase tracking-widest mb-4">
            AnimatedCounter standalone
          </p>
          <div className="text-6xl font-bold gradient-text">
            <AnimatedCounter target={500} suffix="+" />
          </div>
          <p className="text-ink-secondary mt-2">Expériences créées</p>
        </div>
      </SectionWrapper>
    </>
  );
}
