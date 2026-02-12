'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { getFAQBySolution } from '@/lib/fallback-data';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function SolutionFAQ({ solutionSlug }: { solutionSlug: string }) {
  const faqs = getFAQBySolution(solutionSlug);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <Badge>FAQ</Badge>
        <Heading as="h2" size="section" className="mt-6">
          Questions <GradientText>fréquentes</GradientText>
        </Heading>
      </div>

      <motion.div
        className="max-w-3xl mx-auto space-y-3"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`
                rounded-xl bg-white/[0.04] border transition-all duration-300
                ${isOpen ? 'border-white/[0.14] bg-white/[0.06]' : 'border-white/[0.08]'}
              `}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
              >
                <span className="font-medium text-sm text-ink-primary">{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-ink-tertiary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-ink-secondary text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
