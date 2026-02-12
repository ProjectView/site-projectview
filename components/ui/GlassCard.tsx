'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: 'teal' | 'orange' | 'green' | 'gold' | 'red' | 'purple';
  hover?: boolean;
}

const accentBorderColors: Record<string, string> = {
  teal: 'border-t-brand-teal',
  orange: 'border-t-brand-orange',
  green: 'border-t-brand-green',
  gold: 'border-t-brand-gold',
  red: 'border-t-brand-red',
  purple: 'border-t-brand-purple',
};

export function GlassCard({
  children,
  className = '',
  accentColor,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        rounded-2xl
        bg-white/[0.04] border border-white/[0.08]
        ${accentColor ? `border-t-2 ${accentBorderColors[accentColor]}` : ''}
        ${hover ? 'transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
