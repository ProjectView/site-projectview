'use client';

import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'teal' | 'orange' | 'purple' | 'none';
  id?: string;
}

const glowStyles: Record<string, string> = {
  teal: 'before:absolute before:inset-0 before:glow-teal before:pointer-events-none before:-z-10',
  orange: 'before:absolute before:inset-0 before:glow-orange before:pointer-events-none before:-z-10',
  purple: 'before:absolute before:inset-0 before:glow-purple before:pointer-events-none before:-z-10',
  none: '',
};

export function SectionWrapper({
  children,
  className = '',
  glow = 'none',
  id,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
      className={`relative py-32 px-6 ${glowStyles[glow]} ${className}`}
    >
      <div className="mx-auto max-w-[1280px]">{children}</div>
    </motion.section>
  );
}
