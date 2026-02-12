import type { Metadata } from 'next';
import { BlogPageContent } from './BlogPageContent';

export const metadata: Metadata = {
  title: 'Blog — Projectview',
  description: 'Actualités, tendances et conseils sur l\'affichage dynamique, la collaboration, la présentation innovante et l\'IA.',
};

export default function BlogPage() {
  return <BlogPageContent />;
}
