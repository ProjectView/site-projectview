'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { Heading } from '@/components/ui/Heading';
import { GradientText } from '@/components/ui/GradientText';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Projectview a complètement transformé notre showroom. Nos clients passent désormais deux fois plus de temps à explorer nos produits.",
    author: 'Marie Dupont',
    role: 'Directrice Marketing',
    company: 'IntérieurDesign Lyon',
  },
  {
    quote: "Les solutions de collaboration ont révolutionné nos réunions d'équipe. On ne revient plus en arrière.",
    author: 'Thomas Bernard',
    role: 'CEO',
    company: 'ArchiTech Solutions',
  },
  {
    quote: "L'assistant IA nous fait gagner un temps précieux au quotidien. Le support client est également irréprochable.",
    author: 'Sophie Martin',
    role: 'Responsable Innovation',
    company: 'RetailGroup France',
  },
  {
    quote: "La présentation VR de nos projets immobiliers a fait bondir notre taux de conversion de manière spectaculaire.",
    author: 'Pierre Lefèvre',
    role: 'Directeur Commercial',
    company: 'Nexity Aménagement',
  },
  {
    quote: "Un partenaire technologique qui comprend vraiment les enjeux de l'expérience client en point de vente.",
    author: 'Claire Rousseau',
    role: 'Directrice Retail',
    company: 'Maison & Objet',
  },
];

const allTestimonials = [...testimonials, ...testimonials];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <SectionWrapper>
      <div className="text-center mb-16">
        <Badge>Ce qu&apos;ils en disent</Badge>
        <Heading as="h2" size="section" className="mt-6">
          Ils nous font <GradientText>confiance</GradientText>
        </Heading>
      </div>

      {/* Horizontal auto-scroll carousel */}
      <div className="relative overflow-hidden">
        <motion.div
          ref={scrollRef}
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ animationPlayState: 'running' }}
        >
          {allTestimonials.map((testimonial, i) => (
            <div
              key={`${testimonial.author}-${i}`}
              className="flex-shrink-0 w-[380px] rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8 hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-brand-purple/40 mb-4" />
              <p className="text-ink-primary text-lg leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-dark-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-dark-bg to-transparent" />
      </div>
    </SectionWrapper>
  );
}
