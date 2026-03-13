import type { Metadata } from 'next';
import { ContactPageContent } from './ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact — Projectview',
  description: "Contactez Projectview pour discuter de votre projet. 18 rue Jules Ferry, 69360 Saint Symphorien d'Ozon — contact@projectview.fr — 0 777 300 658",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
