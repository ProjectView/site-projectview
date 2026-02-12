import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Radio, Users, Presentation, Sparkles } from 'lucide-react';
import { solutions, getSolutionBySlug } from '@/lib/fallback-data';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { SolutionDetailContent } from './SolutionDetailContent';

const iconMap: Record<string, React.ElementType> = {
  radio: Radio,
  users: Users,
  presentation: Presentation,
  sparkles: Sparkles,
};

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const solution = getSolutionBySlug(slug);
    if (!solution) return { title: 'Solution introuvable — Projectview' };
    return {
      title: `${solution.title} — Projectview`,
      description: solution.subtitle + ' ' + solution.shortDescription,
    };
  });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();

  const Icon = iconMap[solution.icon] || Sparkles;

  const accentBg: Record<string, string> = {
    teal: 'bg-brand-teal/15 text-brand-teal',
    orange: 'bg-brand-orange/15 text-brand-orange',
    green: 'bg-brand-green/15 text-brand-green',
    gold: 'bg-brand-gold/15 text-brand-gold',
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 hero-mesh">
        <div className="mx-auto max-w-[1280px]">
          <Badge>{solution.badgeText}</Badge>
          <div className="flex items-center gap-4 mt-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${accentBg[solution.accentColor]}`}>
              <Icon className="w-7 h-7" />
            </div>
            <Heading as="h1" size="hero">
              {solution.title}
            </Heading>
          </div>
          <p className="text-ink-primary text-xl font-medium mt-6 max-w-2xl">
            {solution.subtitle}
          </p>
          <p className="text-ink-secondary text-lg mt-3 max-w-2xl leading-relaxed">
            {solution.shortDescription}
          </p>
          <div className="flex gap-4 mt-8">
            <Button variant="primary" href="/contact">
              Demander une démo
            </Button>
            <Button variant="secondary" href="/solutions">
              Toutes les solutions
            </Button>
          </div>
        </div>
      </section>

      {/* Full description + features grid + CTA — client component for animations */}
      <SolutionDetailContent solution={solution} />
    </main>
  );
}
