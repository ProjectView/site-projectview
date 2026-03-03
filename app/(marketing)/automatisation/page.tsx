import type { Metadata } from 'next';
import { AutomationPageContent } from './AutomationPageContent';

export const metadata: Metadata = {
  title: 'Automatisation | Projectview',
  description:
    'Récupérez des heures chaque semaine en automatisant vos tâches répétitives : relances factures, suivi prospects, rapports, rappels — Projectview déploie vos workflows en quelques jours.',
  openGraph: {
    title: 'Automatisation — Arrêtez de faire ce que les machines font mieux | Projectview',
    description:
      'Calculez le temps que vous perdez en tâches manuelles et découvrez comment Projectview l\'automatise pour vous.',
    url: 'https://projectview.fr/automatisation',
  },
};

export default function AutomatisationPage() {
  return <AutomationPageContent />;
}
