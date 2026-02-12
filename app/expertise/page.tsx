import type { Metadata } from 'next';
import { ExpertisePageContent } from './ExpertisePageContent';

export const metadata: Metadata = {
  title: 'Expertise — Projectview',
  description: 'Découvrez nos études de cas et retours d\'expérience clients dans l\'aménagement, le retail, l\'architecture et l\'immobilier.',
};

export default function ExpertisePage() {
  return <ExpertisePageContent />;
}
