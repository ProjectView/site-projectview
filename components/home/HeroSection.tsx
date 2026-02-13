'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, TrendingUp, Monitor, BrainCircuit, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/* ───────── animation variants ───────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.6 + i * 0.12, type: 'spring' as const, stiffness: 200, damping: 20 },
  }),
};

/* ───────── stat data ───────── */

const stats = [
  { icon: TrendingUp, value: '+340%', label: "Engagement client", gradient: 'from-[#0EA5E9] to-[#38BDF8]' },
  { icon: Zap, value: '73%', label: 'Temps gagné', gradient: 'from-[#A855F7] to-[#EC4899]' },
  { icon: Sparkles, value: '2.5x', label: 'Plus de conversions', gradient: 'from-[#F97316] to-[#EAB308]' },
];

/* ───────── floating tech icons ───────── */

const floatingIcons = [
  { icon: Monitor, x: '12%', y: '22%', size: 20, delay: 0, gradient: 'from-[#0EA5E9]/20 to-[#0EA5E9]/5' },
  { icon: BrainCircuit, x: '85%', y: '18%', size: 22, delay: 1.5, gradient: 'from-[#A855F7]/20 to-[#A855F7]/5' },
  { icon: Layers, x: '8%', y: '70%', size: 18, delay: 3, gradient: 'from-[#F97316]/20 to-[#F97316]/5' },
  { icon: Sparkles, x: '90%', y: '65%', size: 16, delay: 0.8, gradient: 'from-[#22C55E]/20 to-[#22C55E]/5' },
];

/* ───────── component ───────── */

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Mouse position as motion values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for fluid movement
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  // Parallax transforms for different layers (deeper = more movement)
  const orbX1 = useTransform(smoothX, [0, 1], [-40, 40]);
  const orbY1 = useTransform(smoothY, [0, 1], [-30, 30]);
  const orbX2 = useTransform(smoothX, [0, 1], [30, -30]);
  const orbY2 = useTransform(smoothY, [0, 1], [25, -25]);
  const orbX3 = useTransform(smoothX, [0, 1], [-20, 20]);
  const orbY3 = useTransform(smoothY, [0, 1], [-35, 35]);
  const gridX = useTransform(smoothX, [0, 1], [-8, 8]);
  const gridY = useTransform(smoothY, [0, 1], [-8, 8]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Layer 1: Gradient orbs (parallax, mouse-reactive) ── */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-100"
        style={{
          top: '10%',
          left: '5%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
          x: orbX1,
          y: orbY1,
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          bottom: '5%',
          right: '0%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          x: orbX2,
          y: orbY2,
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[400px] rounded-full"
        style={{
          top: '40%',
          left: '35%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
          x: orbX3,
          y: orbY3,
        }}
      />

      {/* ── Layer 2: Dot grid (subtle parallax) ── */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          x: gridX,
          y: gridY,
        }}
      />

      {/* ── Layer 3: Floating tech icons (decorative) ── */}
      {isMounted &&
        floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:flex items-center justify-center"
            style={{ left: item.x, top: item.y }}
            custom={i}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} border border-white/[0.06] backdrop-blur-sm flex items-center justify-center`}
              animate={{ y: [-6, 6, -6], rotate: [0, 3, -3, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: item.delay,
              }}
            >
              <item.icon className="text-white/40" style={{ width: item.size, height: item.size }} />
            </motion.div>
          </motion.div>
        ))}

      {/* ── Main content ── */}
      <div className="relative mx-auto max-w-[1280px] w-full px-6 pt-28 pb-20 lg:pt-32 lg:pb-0 z-10">
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-ink-secondary mb-10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green" />
            </span>
            La technologie au service de l&apos;innovation
          </motion.div>

          {/* ── MAIN HEADING — massive, bold, impactful ── */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-heading font-black tracking-[-0.05em] leading-[0.9]"
            style={{ fontSize: 'clamp(3.5rem, 8.5vw, 7.5rem)' }}
          >
            <span className="block">Transformez</span>
            <span className="block">vos espaces</span>
            <span className="block gradient-text" style={{ paddingBottom: '0.05em' }}>
              en expériences
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-ink-secondary text-base md:text-lg leading-relaxed mt-8 max-w-xl"
          >
            Écrans tactiles, affichage dynamique, collaboration intelligente,
            réalité virtuelle et IA — nous créons des environnements interactifs
            qui captivent et convertissent.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            <Button variant="primary" href="/solutions" className="gap-2 group text-base px-8 py-3.5">
              Découvrir nos solutions
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" href="/contact" className="text-base px-8 py-3.5">
              Nous contacter
            </Button>
          </motion.div>

          {/* ── Stat cards — bigger, bolder ── */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="w-full mt-20 md:mt-24"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                >
                  <div className="group relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                    {/* Gradient accent line at top */}
                    <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />

                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-black font-mono tracking-tight leading-none">{stat.value}</p>
                        <p className="text-xs text-ink-secondary mt-1">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-white/40"
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
