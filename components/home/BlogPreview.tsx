'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';
import { articles as allArticles } from '@/lib/fallback-data';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function BlogPreview() {
  const articles = allArticles.slice(0, 3);

  return (
    <SectionWrapper>
      <div className="flex items-end justify-between mb-16">
        <div>
          <Badge>Blog</Badge>
          <Heading as="h2" size="section" className="mt-6">
            Dernières <GradientText>actualités</GradientText>
          </Heading>
        </div>
        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-ink-secondary hover:text-ink-primary transition-colors group"
        >
          Voir tout
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {articles.map((article) => (
          <motion.div key={article.slug} variants={fadeUp}>
            <Link href={`/blog/${article.slug}`} className="group block">
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]">
                {/* Cover image */}
                <div className="relative aspect-[16/10] bg-dark-elevated overflow-hidden">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 via-brand-purple/5 to-brand-orange/10 group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="text-[10px] py-1 px-2.5">{article.category}</Badge>
                    <span className="text-ink-tertiary text-xs">{article.date}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-brand-teal transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-ink-secondary text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile "voir tout" link */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-secondary hover:text-ink-primary transition-colors"
        >
          Voir tout
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
