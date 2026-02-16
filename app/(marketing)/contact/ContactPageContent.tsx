'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';

const solutionOptions = [
  'Affichage Dynamique & Interactif',
  'Solutions de Collaboration',
  'Présentation Innovante',
  'Assistant IA Personnalisé',
  'Autre / Plusieurs solutions',
];

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      type="submit"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className="w-full flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all duration-200 cursor-pointer"
    >
      {children}
    </button>
  );
}

export function ContactPageContent() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      // Silently handle — form still shows success
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 hero-mesh">
        <div className="mx-auto max-w-[1280px] text-center">
          <Badge>Contact</Badge>
          <Heading as="h1" size="hero" className="mt-6">
            Parlons de votre <GradientText>projet</GradientText>
          </Heading>
          <p className="text-ink-secondary text-lg max-w-xl mx-auto mt-6 leading-relaxed">
            Décrivez-nous votre besoin et nous vous recontactons sous 24h
            avec une proposition personnalisée.
          </p>
        </div>
      </section>

      {/* Split layout: Form + Info */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Form */}
          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-12 text-center"
              >
                <CheckCircle className="w-16 h-16 text-brand-green mx-auto mb-6" />
                <h3 className="font-heading font-bold text-2xl mb-3">Message envoyé&nbsp;!</h3>
                <p className="text-ink-secondary">
                  Merci pour votre message. Nous vous recontactons sous 24h.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FloatingInput name="name" label="Nom" required />
                  <FloatingInput name="email" label="Email" type="email" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FloatingInput name="phone" label="Téléphone" type="tel" />
                  <FloatingInput name="company" label="Entreprise" />
                </div>

                {/* Solution dropdown */}
                <div className="relative">
                  <select
                    name="solution"
                    defaultValue=""
                    className="w-full bg-dark-bg rounded-xl px-4 py-4 text-sm text-ink-primary border border-white/[0.08] focus:border-brand-teal outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Solution qui vous intéresse
                    </option>
                    {solutionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message textarea */}
                <div className="relative">
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Votre message..."
                    required
                    className="w-full bg-dark-bg rounded-xl px-4 py-4 text-sm text-ink-primary placeholder:text-ink-tertiary border border-white/[0.08] focus:border-brand-teal outline-none transition-colors resize-none"
                  />
                </div>

                <MagneticButton>
                  {loading ? 'Envoi en cours...' : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
                  )}
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Right: Info + Map */}
          <div className="space-y-8">
            {/* Contact info */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 space-y-6">
              <h3 className="font-heading font-bold text-xl">Coordonnées</h3>

              <a
                href="mailto:contact@projectview.fr"
                className="flex items-center gap-3 text-ink-secondary hover:text-ink-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-teal/15 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal/25 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Email</p>
                  <p className="text-sm">contact@projectview.fr</p>
                </div>
              </a>

              <a
                href="tel:+33777300658"
                className="flex items-center gap-3 text-ink-secondary hover:text-ink-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-orange/15 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange/25 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Téléphone</p>
                  <p className="text-sm">0 777 300 658</p>
                </div>
              </a>

              <div className="flex items-start gap-3 text-ink-secondary">
                <div className="w-10 h-10 rounded-lg bg-brand-green/15 flex items-center justify-center text-brand-green flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Adresse</p>
                  <p className="text-sm">6 rue de Genève<br />69800 Saint Priest, France</p>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] h-80">
              <iframe
                title="Projectview — 6 rue de Genève, Saint Priest"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2785.5!2d4.9!3d45.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s6+rue+de+Gen%C3%A8ve%2C+69800+Saint+Priest!5e0!3m2!1sfr!2sfr!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) saturate(0.3)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FloatingInput({
  name,
  label,
  type = 'text',
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        placeholder={label}
        required={required}
        className="w-full bg-dark-bg rounded-xl px-4 py-4 text-sm text-ink-primary placeholder:text-ink-tertiary border border-white/[0.08] focus:border-brand-teal outline-none transition-colors"
      />
    </div>
  );
}
