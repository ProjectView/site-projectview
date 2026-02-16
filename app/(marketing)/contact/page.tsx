import type { Metadata } from 'next';
import { ContactPageContent } from './ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact — Projectview',
  description: 'Contactez Projectview pour discuter de votre projet. 6 rue de Genève, 69800 Saint Priest — contact@projectview.fr — 0 777 300 658',
};

export default function ContactPage() {
  return <ContactPageContent />;
}
