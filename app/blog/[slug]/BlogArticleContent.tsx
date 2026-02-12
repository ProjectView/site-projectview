'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Linkedin, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import type { Article } from '@/lib/fallback-data';
import { getRelatedArticles } from '@/lib/fallback-data';

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5">
      <div
        className="h-full bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function renderContent(content: string) {
  // Simple markdown-like rendering for fallback content
  return content.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="font-heading font-bold text-2xl mt-12 mb-4" id={`section-${i}`}>
          {block.replace('## ', '')}
        </h2>
      );
    }
    return (
      <p key={i} className="text-ink-secondary text-base leading-relaxed mb-6">
        {block}
      </p>
    );
  });
}

function extractHeadings(content: string): { text: string; id: string }[] {
  return content
    .split('\n\n')
    .map((block, i) => {
      if (block.startsWith('## ')) {
        return { text: block.replace('## ', ''), id: `section-${i}` };
      }
      return null;
    })
    .filter(Boolean) as { text: string; id: string }[];
}

export function BlogArticleContent({ article }: { article: Article }) {
  const related = getRelatedArticles(article.slug, 3);
  const headings = extractHeadings(article.content);

  return (
    <main>
      <ReadingProgressBar />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6 hero-mesh">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          <Badge className="mb-4">{article.category}</Badge>
          <Heading as="h1" size="hero" className="max-w-4xl">
            {article.title}
          </Heading>
          <div className="flex items-center gap-4 mt-6 text-sm text-ink-secondary">
            <span>Par {article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime} de lecture</span>
          </div>
        </div>
      </section>

      {/* Cover image placeholder */}
      <section className="px-6">
        <div className="mx-auto max-w-[1280px]">
          <div className="w-full aspect-[21/9] rounded-2xl bg-dark-elevated overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-brand-teal/10 via-brand-purple/5 to-brand-orange/10" />
          </div>
        </div>
      </section>

      {/* Body + TOC sidebar */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-[1280px] flex gap-16">
          {/* Main content */}
          <article className="max-w-[720px] flex-1">
            {renderContent(article.content)}
          </article>

          {/* Sticky TOC sidebar */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-xs uppercase tracking-widest text-ink-tertiary mb-4">
                  Sommaire
                </p>
                <nav className="space-y-2 border-l border-white/[0.08] pl-4">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className="block text-sm text-ink-secondary hover:text-ink-primary transition-colors"
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>

                {/* Share buttons */}
                <div className="mt-8 pt-8 border-t border-white/[0.08]">
                  <p className="text-xs uppercase tracking-widest text-ink-tertiary mb-4">
                    Partager
                  </p>
                  <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-full glass flex items-center justify-center text-ink-secondary hover:text-brand-teal transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-full glass flex items-center justify-center text-ink-secondary hover:text-brand-teal transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-full glass flex items-center justify-center text-ink-secondary hover:text-brand-teal transition-colors">
                      <Twitter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-[1280px]">
            <Heading as="h2" size="subsection" className="mb-8">
              Articles <GradientText>similaires</GradientText>
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group">
                  <GlassCard className="p-6 h-full">
                    <Badge className="text-[10px] py-1 px-2.5 mb-3">{r.category}</Badge>
                    <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-brand-teal transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-ink-secondary text-sm line-clamp-2">{r.excerpt}</p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="relative py-24 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-brand-purple/[0.08] blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-[500px] text-center">
          <Heading as="h2" size="subsection">
            Restez informé
          </Heading>
          <p className="text-ink-secondary text-sm mt-3 mb-6">
            Recevez nos derniers articles directement dans votre boîte mail.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal transition-colors"
            />
            <button className="rounded-full px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-opacity flex-shrink-0">
              OK
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
