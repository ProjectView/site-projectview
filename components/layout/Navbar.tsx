'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Expertise', href: '/expertise' },
  { label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-bg/70 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between h-16">
          {/* Logo — bold modern */}
          <Link href="/" className="flex items-baseline gap-0 text-xl font-bold tracking-tight">
            Project<GradientText>view</GradientText>
          </Link>

          {/* Desktop Nav — modern pill navigation */}
          <div className="hidden md:flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-1.5 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-1.5 text-sm text-ink-secondary hover:text-ink-primary transition-colors duration-200 rounded-full hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Login — admin access */}
            <Link
              href="/admin/login"
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] text-ink-secondary hover:text-ink-primary hover:bg-white/[0.08] transition-all duration-200"
              title="Espace admin"
            >
              <LogIn className="w-4 h-4" />
            </Link>

            {/* Contact CTA — modern gradient fill */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]"
            >
              Contact
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-35 h-full w-72 bg-dark-surface/95 backdrop-blur-2xl border-l border-white/[0.06] transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-2 pt-24 px-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg text-ink-secondary hover:text-ink-primary transition-colors py-3 border-b border-white/[0.06]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white"
          >
            Contact
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
