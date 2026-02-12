'use client';

import { SolutionsHero } from '@/components/solutions/SolutionsHero';
import { SolutionsTabSelector } from '@/components/solutions/SolutionsTabSelector';
import { SolutionsStatsBar } from '@/components/solutions/SolutionsStatsBar';
import { SolutionsComparisonTable } from '@/components/solutions/SolutionsComparisonTable';
import { SolutionsProcess } from '@/components/solutions/SolutionsProcess';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';

export function SolutionsPageContent() {
  return (
    <main>
      <SolutionsHero />
      <SolutionsTabSelector />
      <SolutionsStatsBar />
      <SolutionsComparisonTable />
      <SolutionsProcess />

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-purple/[0.08] blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-[600px] text-center">
          <Heading as="h2" size="section">
            Un projet en tête&nbsp;?
          </Heading>
          <p className="text-ink-secondary mt-4 mb-8">
            Discutons de vos besoins et trouvons la solution idéale pour vos espaces.
          </p>
          <Button variant="primary" href="/contact">
            Prendre rendez-vous
          </Button>
        </div>
      </section>
    </main>
  );
}
