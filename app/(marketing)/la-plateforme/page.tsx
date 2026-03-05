import type { Metadata } from 'next';
import { PlatformeContent } from './PlatformeContent';

export const metadata: Metadata = {
  title: 'La Plateforme — Site premium + Back-office complet | Projectview',
  description:
    'Un front-end au niveau des meilleurs sites du monde et un back-office tout-en-un (CRM, SEO, IA, Analytics, Leadgen). Construit sur mesure, brique par brique.',
  openGraph: {
    title: 'La Plateforme — Projectview',
    description:
      'Front premium + back-office complet. Construit sur mesure, brique par brique.',
    url: 'https://projectview.fr/la-plateforme',
    siteName: 'Projectview',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function PlateformePage() {
  return <PlatformeContent />;
}
