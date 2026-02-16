import type { Metadata } from 'next';
import { Montserrat, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Projectview — La technologie au service de l\'émotion',
  description:
    'Nous transformons vos espaces physiques en environnements interactifs qui captivent, engagent et convertissent. Écrans tactiles, affichage dynamique, collaboration, VR et IA.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://projectview.fr'),
  openGraph: {
    title: 'Projectview — La technologie au service de l\'émotion',
    description:
      'Nous transformons vos espaces physiques en environnements interactifs qui captivent, engagent et convertissent.',
    siteName: 'Projectview',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      className={`${montserrat.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-dark-bg text-ink-primary antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
