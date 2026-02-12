'use client';

import { type LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  accentColor?: 'teal' | 'orange' | 'green' | 'gold' | 'purple';
  className?: string;
}

const accentBgColors: Record<string, string> = {
  teal: 'bg-brand-teal/15 text-brand-teal',
  orange: 'bg-brand-orange/15 text-brand-orange',
  green: 'bg-brand-green/15 text-brand-green',
  gold: 'bg-brand-gold/15 text-brand-gold',
  purple: 'bg-brand-purple/15 text-brand-purple',
};

export function StatCard({
  icon: Icon,
  value,
  suffix = '',
  prefix = '',
  label,
  accentColor = 'teal',
  className = '',
}: StatCardProps) {
  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${accentBgColors[accentColor]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-3xl font-bold gradient-text">
            <AnimatedCounter
              target={value}
              suffix={suffix}
              prefix={prefix}
            />
          </div>
          <p className="text-ink-secondary text-sm mt-1">{label}</p>
        </div>
      </div>
    </GlassCard>
  );
}
