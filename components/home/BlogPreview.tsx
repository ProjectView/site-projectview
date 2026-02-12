'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Badge } from '@/components/ui/Badge';

interface Article {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

const fallbackArticles: Article[] = [
  {
    title: "Comment l'affichage dynamique transforme le retail en 2025",
    slug: 'affichage-dynamique-retail-2025',
    excerpt:
      "Découvrez comment les écrans interactifs révolutionnent l'expérience en magasin et augmentent l'engagement client.",
    category: 'Affichage Dynamique',
    date: '15 Jan 2025',
    image: '/blog-placeholder-1.jpg',
  },
  {
    title: 'VR immobilière : vendre un bien avant sa construction',
    slug: 'vr-immobiliere-vente-avant-construction',
    excerpt:
      'La réalité virtuelle permet aux promoteurs de proposer des visites immersives de projets encore sur plan.',
    category: 'Présentation Innovante',
    date: '8 Jan 2025',
    image: '/blog-placeholder-2.jpg',
  },
  {
    title: "L'IA au service de la relation client B2B",
    slug: 'ia-relation-client-b2b',
    excerpt:
      "Comment un assistant IA personnalisé peut réduire le temps de réponse et améliorer la satisfaction client.",
    category: 'Assistant IA',
    date: '2 Jan 2025',
    image: '/blog-placeholder-3.jpg',
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function BlogPreview() {
  const articles = fallbackArticles;

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
                {/* Image placeholder */}
                <div className="relative aspect-[16/10] bg-dark-elevated overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 via-brand-purple/5 to-brand-orange/10 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-ink-tertiary text-xs">Image</span>
                  </div>
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
