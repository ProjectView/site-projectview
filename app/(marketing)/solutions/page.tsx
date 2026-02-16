import type { Metadata } from 'next';
import { SolutionsPageContent } from './SolutionsPageContent';

export const metadata: Metadata = {
  title: 'Nos Solutions — Projectview',
  description: 'Affichage dynamique, collaboration, présentation innovante et assistant IA. Découvrez nos solutions pour transformer vos espaces.',
};

export default function SolutionsPage() {
  return <SolutionsPageContent />;
}
