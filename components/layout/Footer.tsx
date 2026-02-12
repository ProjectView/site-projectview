'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';

const solutions = [
  { label: 'Affichage Dynamique', href: '/solutions/affichage-dynamique' },
  { label: 'Collaboration', href: '/solutions/collaboration' },
  { label: 'Présentation Innovante', href: '/solutions/presentation-innovante' },
  { label: 'Assistant IA', href: '/solutions/assistant-ia' },
];

const resources = [
  { label: 'Blog', href: '/blog' },
  { label: 'Expertise', href: '/expertise' },
  { label: 'FAQ', href: '#' },
];

export function Footer() {
  return (
    <footer className="relative bg-dark-surface">
      {/* Gradient top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />

      <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-10">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 — Company info */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold tracking-tight inline-block">
              Project<GradientText>view</GradientText>
            </Link>
            <p className="text-ink-secondary text-sm leading-relaxed">
              Nous transformons vos espaces physiques en environnements interactifs qui captivent et convertissent.
            </p>
            <div className="space-y-2 text-sm text-ink-secondary">
              <a
                href="mailto:contact@projectview.fr"
                className="flex items-center gap-2 hover:text-ink-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-teal" />
                contact@projectview.fr
              </a>
              <a
                href="tel:+33777300658"
                className="flex items-center gap-2 hover:text-ink-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-teal" />
                0 777 300 658
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                <span>6 rue de Genève, 69800 Saint Priest</span>
              </div>
            </div>
          </div>

          {/* Column 2 — Solutions */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="space-y-3">
              {solutions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-secondary hover:text-ink-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Ressources</h4>
            <ul className="space-y-3">
              {resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-secondary hover:text-ink-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-ink-secondary mb-4">
              Recevez nos dernières actualités et innovations.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
              />
              <button
                type="submit"
                className="rounded-full px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-opacity flex-shrink-0 flex items-center gap-1"
              >
                OK
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-tertiary">
            &copy; {new Date().getFullYear()} Projectview. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
