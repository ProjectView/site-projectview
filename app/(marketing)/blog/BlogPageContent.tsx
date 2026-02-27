'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import type { Article } from '@/lib/fallback-data';

type Category = { name: string; slug: string };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

interface BlogPageContentProps {
  articles: Article[];
  categories: Category[];
}

export function BlogPageContent({ articles, categories }: BlogPageContentProps) {
  const [activeCategory, setActiveCategory] = useState('tous');

  const filtered = activeCategory === 'tous'
    ? articles
    : articles.filter((a) => a.categorySlug === activeCategory);

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 hero-mesh">
        <div className="mx-auto max-w-[1280px] text-center">
          <Badge>Blog</Badge>
          <Heading as="h1" size="hero" className="mt-6">
            Dernières <GradientText>actualités</GradientText>
          </Heading>
          <p className="text-ink-secondary text-lg max-w-xl mx-auto mt-6 leading-relaxed">
            Tendances, conseils et retours d&apos;expérience sur la transformation
            digitale des espaces physiques.
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.slug
                    ? 'bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-[1280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {filtered.map((article) => (
                <motion.div key={article.slug} variants={fadeUp} layout>
                  <Link href={`/blog/${article.slug}`} className="group block h-full">
                    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 h-full flex flex-col">
                      {/* Cover image */}
                      <div className="relative aspect-[16/10] bg-dark-elevated overflow-hidden">
                        {article.coverImage ? (
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 via-brand-purple/5 to-brand-orange/10 group-hover:scale-105 transition-transform duration-500" />
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className="text-[10px] py-1 px-2.5">{article.category}</Badge>
                          <span className="text-ink-tertiary text-xs">{article.date}</span>
                          <span className="text-ink-tertiary text-xs ml-auto">{article.readTime}</span>
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-brand-teal transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-ink-secondary text-sm line-clamp-2 flex-1">
                          {article.excerpt}
                        </p>
                        <p className="text-xs text-ink-tertiary mt-4">
                          Par {article.author}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-ink-secondary py-20">
              Aucun article dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
