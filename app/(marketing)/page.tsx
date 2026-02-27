import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/home/HeroSection';
import { getAllArticles } from '@/lib/firestore-articles';

export const revalidate = 60;

const MissionSection = dynamic(() =>
  import('@/components/home/MissionSection').then((m) => m.MissionSection),
);
const SolutionsGrid = dynamic(() =>
  import('@/components/home/SolutionsGrid').then((m) => m.SolutionsGrid),
);
const TestimonialsSection = dynamic(() =>
  import('@/components/home/TestimonialsSection').then((m) => m.TestimonialsSection),
);
const BlogPreview = dynamic(() =>
  import('@/components/home/BlogPreview').then((m) => m.BlogPreview),
);
const CTASection = dynamic(() =>
  import('@/components/home/CTASection').then((m) => m.CTASection),
);

export default async function Home() {
  const articles = await getAllArticles();

  return (
    <main>
      <HeroSection />
      <MissionSection />
      <SolutionsGrid />
      <TestimonialsSection />
      <BlogPreview articles={articles} />
      <CTASection />
    </main>
  );
}
