# CLAUDE.md — Projectview.fr Website (v2 — Modern Premium)

## Project Overview

Build the website for **Projectview** (https://projectview.fr/), a French company that transforms physical spaces into interactive experiences using touchscreens, dynamic displays, collaboration solutions, VR, and AI assistants.

**Tagline:** "La technologie au service de l'émotion"
**Mission:** "Nous ne vendons pas de la technologie. Nous créons des émotions."
**Target:** Professionals in interior design, construction, retail, architecture, real estate.
**Location:** 6 rue de Genève, 69800 Saint Priest — contact@projectview.fr — 0 777 300 658

---

## Tech Stack

- **Next.js 14+** (App Router, TypeScript, Server Components)
- **Tailwind CSS** for styling
- **Framer Motion** for animations and scroll-triggered reveals
- **Strapi v4** (headless CMS, self-hosted, PostgreSQL)
- **Docker Compose** for local dev (Next.js + Strapi + PostgreSQL)
- **Vercel** deploy target for frontend

---

## Design Direction — "Warm Premium Minimalism"

The design language is inspired by **Linear, Vercel, Framer, and Stripe** but with a WARM twist that reflects Projectview's human-centric brand. Think Linear's precision meets a luxury hospitality website.

### Core Aesthetic Principles

1. **Dark/Light duality** — Default to a sophisticated DARK theme with warm undertones (not pure black — use #0A0A0B or #111113 with subtle warm noise). Offer a light mode toggle with the warm cream palette.

2. **Typographic hierarchy is king** — Massive display headings (clamp 48-80px), tight letter-spacing (-0.03em), generous line-height. Use a premium font pairing:
   - **Headings:** `"Instrument Serif"` from Google Fonts (elegant, editorial, distinctive) OR `"Playfair Display"` for a more luxurious feel
   - **Body:** `"Satoshi"` (from fontshare.com via CDN: https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap) or `"General Sans"`
   - **Mono/accent:** `"JetBrains Mono"` from Google Fonts for stat numbers
   - NEVER use Inter, Roboto, Arial, system fonts

3. **Gradient accents, not gradient backgrounds** — Use subtle animated gradients ONLY on keywords, borders, and accent elements. The brand gradient is: `linear-gradient(135deg, #3B7A8C, #6B9B37, #D4842A)` (teal → green → orange). Apply on highlighted words in headings, CTA button borders, hover glows, stat number colors.

4. **Glow and light effects** — Subtle radial gradient glows behind key sections (like Linear's hero). Use CSS `radial-gradient` with very low opacity brand colors to create depth. Example: a soft teal glow behind the hero heading, an orange glow behind the CTA section.

5. **Glassmorphism done right** — Cards use `backdrop-filter: blur(16px)` with `background: rgba(255,255,255,0.03)` (dark mode) or `rgba(255,255,255,0.7)` (light mode), with 1px border of `rgba(255,255,255,0.08)`. Whisper-thin and elegant, NOT heavy frosted glass.

6. **Micro-interactions everywhere** — Buttons: subtle scale(1.02) + glow on hover. Cards: lift + border-glow on hover. Links: gradient underline animation. Numbers: spring-physics counting animation.

7. **Grid and spacing** — 12-column grid, max-width 1280px, generous padding (sections: py-32 to py-40). Asymmetric layouts where possible.

8. **Noise texture overlay** — Very subtle SVG noise texture over the entire page (opacity: 0.015-0.03) for premium print/grain feel. Small detail, massive difference.

9. **Scroll-triggered animations** — Every section fades in with Framer Motion `whileInView`. Use staggered children with `staggerChildren: 0.1`. Headings slide up, cards fade in from bottom, stats count up.

10. **One wow moment per page** — Homepage hero: animated gradient mesh/aurora background. Solutions: 3D card tilt on hover. Blog: masonry layout with smooth filtering. Contact: magnetic cursor effect on submit button.

---

## Color System

```js
// tailwind.config.ts
colors: {
  // Dark theme base
  dark: {
    bg: '#0A0A0B',
    surface: '#141416',
    elevated: '#1C1C1F',
    border: 'rgba(255, 255, 255, 0.08)',
    'border-hover': 'rgba(255, 255, 255, 0.15)',
  },
  // Light theme base  
  light: {
    bg: '#FAFAF7',
    surface: '#FFFFFF',
    elevated: '#F5F3EF',
    border: '#E8E4DE',
    'border-hover': '#D4D0C8',
  },
  // Brand
  brand: {
    teal: '#3B7A8C',
    'teal-light': '#5BA3B5',
    'teal-dark': '#2A5A68',
    green: '#6B9B37',
    orange: '#D4842A',
    gold: '#8B6914',
    red: '#C65D3E',
  },
  // Text
  ink: {
    primary: '#EDEDEF',
    secondary: '#8B8B8E',
    tertiary: '#5C5C5F',
    'light-primary': '#1A1A1A',
    'light-secondary': '#636E72',
  },
}
```

### CSS Variables (globals.css)
```css
:root {
  --gradient-brand: linear-gradient(135deg, #3B7A8C, #6B9B37, #D4842A);
  --gradient-glow-teal: radial-gradient(ellipse at center, rgba(59, 122, 140, 0.15), transparent 70%);
  --gradient-glow-orange: radial-gradient(ellipse at center, rgba(212, 132, 42, 0.12), transparent 70%);
  --gradient-mesh: radial-gradient(at 20% 50%, rgba(59, 122, 140, 0.12) 0%, transparent 50%),
                   radial-gradient(at 80% 20%, rgba(107, 155, 55, 0.08) 0%, transparent 50%),
                   radial-gradient(at 60% 80%, rgba(212, 132, 42, 0.08) 0%, transparent 50%);
}
```

---

## Build Order

### Phase 1 — Project Setup
1. `npx create-next-app@latest projectview-site --typescript --tailwind --app --src-dir=false`
2. Install: `framer-motion lucide-react`
3. Configure Tailwind with the full color system
4. Set up fonts in `app/layout.tsx`: Instrument Serif (headings), Satoshi via CDN (body), JetBrains Mono (stats)
5. Create `app/globals.css` with CSS variables, noise overlay, gradient definitions, dark theme as default
6. Implement dark/light theme toggle with `next-themes` or custom context

### Phase 2 — Design System Components
Create `components/ui/`:

**`NoiseOverlay.tsx`** — fixed full-screen noise texture at z-50, pointer-events-none, opacity 0.02. Use inline SVG data URI with feTurbulence filter.

**`GradientText.tsx`** — wraps text with brand gradient via `background-clip: text; -webkit-text-fill-color: transparent;`

**`Badge.tsx`** — pill with glass effect, subtle border, small caps text

**`Button.tsx`** — Two variants:
  - Primary: dark bg with gradient border (1px), white text. Hover: glow + slight scale(1.02)
  - Secondary: transparent with gradient border, gradient text. Hover: fill with gradient bg
  - Both: rounded-full (pill shape), px-6 py-3, font-medium

**`GlassCard.tsx`** — backdrop-blur-xl, subtle 1px border, optional colored top-border accent (2px), hover: border brightens + lift translateY(-2px)

**`StatCard.tsx`** — extends GlassCard: icon in colored rounded square, big number in JetBrains Mono with gradient color, label in secondary text

**`AnimatedCounter.tsx`** — Intersection Observer trigger, spring easing, supports suffixes (%, x, +, /7), JetBrains Mono font

**`SectionWrapper.tsx`** — Framer Motion whileInView fade-up, optional background glow, consistent max-width/padding

**`Heading.tsx`** — responsive sizes (hero: clamp 3rem-5rem, section: clamp 2rem-3.5rem), tight tracking, supports GradientText children

### Phase 3 — Layout

**`Navbar.tsx`:**
- Fixed, backdrop-blur-xl, transparent bg → slightly opaque on scroll
- Logo: "Project" regular + "view" in gradient text
- Nav: Accueil, Solutions, Expertise, Blog — hover underline animation
- "Contact" CTA: gradient border pill
- Mobile: slide-in drawer from right with blur backdrop, animated hamburger → X

**`Footer.tsx`:**
- Dark surface bg (#141416)
- 4-column grid: Company info, Solutions, Resources, Newsletter
- Newsletter: email input with gradient border + submit
- Social icons, copyright, legal links
- Top border: 1px gradient line full width

### Phase 4 — Homepage Sections

Build each as a separate component in `components/home/`:

**`HeroSection.tsx`** — THE wow moment:
- Full viewport height (min-h-screen), flex center
- Animated gradient mesh background (slow-moving radial gradients, CSS animation 20s cycle)
- Left side (55%):
  - Badge: "Innovation · Expérience · Impact" — glass pill
  - H1: "La technologie au service de" + line break + GradientText("l'émotion") — massive clamp(3.5rem, 5vw, 5.5rem)
  - Subtitle: "Nous transformons vos espaces physiques en environnements interactifs qui captivent, engagent et convertissent." — secondary text color
  - Two CTAs
- Right side (45%):
  - 3 StatCards stacked with staggered offset (each +20px right, +10px down)
  - Animate in from right, stagger 0.15s
  - Floating idle animation (translateY ±5px, 6s ease-in-out infinite)
  - Stats: +340% Engagement client | 73% Temps gagné | 2.5x Plus de conversions
- Bottom: animated scroll chevron

**`MissionSection.tsx`:**
- Badge: "NOTRE MISSION"
- H2: "Nous ne vendons pas de la" GradientText("technologie") "." / "Nous créons des" GradientText("émotions") "."
- Two paragraphs centered, max-w-700px:
  - "Chaque showroom devrait faire briller les yeux. Chaque réunion devrait déborder d'idées. Chaque projet devrait susciter l'enthousiasme dès le premier jour."
  - "Nous accompagnons les professionnels de l'aménagement, de la construction et du retail dans une transformation simple mais radicale : faire de leurs espaces des lieux où la technologie disparaît au profit de l'expérience pure."
- 4 stat glass cards in a row with animated counters: 500+ Expériences | 98% Satisfaction | 8+ Années | 24/7 Support IA
- Background: subtle teal glow behind heading

**`SolutionsGrid.tsx`:**
- Heading: "Nos solutions"
- 2x2 grid of GlassCards (gap-6)
- Each card:
  - Icon (colored rounded-xl square 48px)
  - Metric badge top-right
  - Title, subtitle, description, feature list (4 items with emoji + text)
  - Bottom stat line + "En savoir plus →" link
  - 3D tilt effect on hover (CSS perspective + rotateX/Y via custom `useCardTilt` hook)
- Staggered scroll reveal

**Solution data:**

1. **Affichage Dynamique & Interactif** — accent: teal — icon: broadcast — badge: "+340% d'engagement"
   - Subtitle: "Vos affiches statiques ? Ignorées. Vos produits phares ? Inaperçus."
   - Desc: "Dans un océan de sollicitations visuelles, votre communication se noie."
   - Features: 💡 Dynamique : contenus animés, temps réel | 👆 Interactif : touchez, déclenchez | 🏪 Showrooms retail | 📱 Communication interne
   - Stat: "340% d'engagement en plus. Chaque point de contact devient mémorable."

2. **Solutions de Collaboration** — accent: orange — icon: users — badge: "73% de temps gagné"
   - Subtitle: "Et si vos réunions devenaient enfin productives ?"
   - Desc: "Chaque minute perdue en connexion est une opportunité manquée."
   - Features: 📺 Écrans visio tout-en-un | 📡 Partage sans fil ultra-simplifié | ⚡ Connectez-vous en un geste | 🤝 Collaborez naturellement
   - Stat: "73% de temps gagné en réunion."

3. **Solutions de Présentation Innovante** — accent: green — icon: presentation — badge: "89% mémorisation"
   - Subtitle: "Arrêtez de présenter, Donnez vie à vos projets"
   - Desc: "Vos clients hochent la tête mais ne se projettent pas."
   - Features: 🖥️ Écrans tactiles showroom | 🤝 Table tactile de négociation | 🏠 VR avant construction
   - Stat: "89% de mémorisation. L'immersion qui convertit."

4. **Assistant IA Personnalisé** — accent: gold — icon: sparkles — badge: "10h gagnées/semaine"
   - Subtitle: "Prise en charge immédiate 24/7, pour chaque utilisateur"
   - Desc: "Vos équipes perdent un temps précieux sur les mêmes questions."
   - Features: ⚡ Réponses 24/7 | 🎯 Recommandations personnalisées | 🤖 Processus automatisés
   - Stat: "10h gagnées par semaine."

**`TestimonialsSection.tsx`:**
- Badge: "CE QU'ILS EN DISENT"
- Horizontal auto-scroll carousel, pause on hover
- GlassCards with quote (italic, large), author name/role/company, avatar
- Data from CMS with fallback

**`BlogPreview.tsx`:**
- Heading: "Dernières actualités" + "Voir tout →"
- 3 article cards: cover image (zoom on hover), category badge, title, excerpt (line-clamp-2), date
- From CMS with fallback

**`CTASection.tsx`:**
- Full-width centered, gradient mesh background or large glow
- H2: "Prêt à transformer vos espaces ?" with gradient keywords
- Subtitle + two large CTAs

### Phase 5 — Inner Pages

**`/solutions`** — All 4 solutions as expanded cards, links to `/solutions/[slug]`

**`/solutions/[slug]`** — Hero + full description (CMS) + feature grid + case studies + CTA

**`/blog`** — Hero + category filter tabs (glass pills) + article grid (3 cols) + pagination

**`/blog/[slug]`** — Reading progress bar (thin gradient line top), header (badge + huge title + author + date), cover image, body (rich text, max-w-720px, beautiful typography), sticky TOC sidebar, share buttons, related articles, newsletter CTA

**`/expertise`** — Case studies grid, filterable by industry/solution

**`/contact`** — Split layout:
- Left: form (floating labels, gradient border on focus) — Nom, Email, Téléphone, Entreprise, Solution dropdown, Message, Submit with magnetic hover effect
- Right: address + phone + email + dark-styled Google Maps embed + social links
- POST to `/api/contact` → N8N webhook

### Phase 6 — Strapi CMS
- Create `strapi/` directory at project root
- Strapi v4 + PostgreSQL
- Content types:
  - **Article**: title, slug, excerpt, content (richtext), cover (media), author (relation), category (relation), seo_title, seo_description, publishedAt
  - **Category**: name, slug, description, color
  - **Author**: name, bio, avatar (media)
  - **CaseStudy**: title, slug, description, images (media multiple), client_name, industry, solutions_used, results_text
  - **Testimonial**: author_name, company, role, quote, avatar (media), rating (integer)
  - **Solution**: title, slug, icon, accent_color, short_description, full_description (richtext), key_features (JSON), stats (JSON), badge_text, order (integer)
- Seed with realistic French content

### Phase 7 — Integration and Polish
- `lib/strapi.ts` — API client with Bearer auth, error handling, ISR (revalidate: 60), fallback on failure
- `lib/fallback-data.ts` — complete static dataset mirroring CMS
- `app/api/contact/route.ts` — POST → N8N webhook from env var
- SEO: dynamic meta tags, JSON-LD (Organization, Article, BreadcrumbList), sitemap.xml, robots.txt, canonical URLs
- `docker-compose.yml` for local dev (next + strapi + postgres)
- Performance: next/image optimization, lazy load below-fold, minimize bundle
- Accessibility: WCAG AA contrast (especially dark mode), keyboard nav, gradient focus outlines
- Final: `next build` must pass, Lighthouse > 90

---

## Key Implementation Snippets

### Noise Overlay
```tsx
export function NoiseOverlay() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.02]"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
  );
}
```

### Gradient Text
```tsx
export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-green to-brand-orange ${className}`}>
      {children}
    </span>
  );
}
```

### Hero Gradient Mesh (CSS)
```css
.hero-mesh {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(59, 122, 140, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(107, 155, 55, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(212, 132, 42, 0.08) 0%, transparent 50%);
  animation: meshMove 20s ease-in-out infinite;
}
@keyframes meshMove {
  0%, 100% { background-position: 0% 0%, 100% 0%, 50% 100%; }
  33% { background-position: 100% 50%, 0% 100%, 80% 0%; }
  66% { background-position: 50% 100%, 50% 0%, 0% 50%; }
}
```

### 3D Card Tilt Hook
```tsx
import { useRef, useState } from 'react';
export function useCardTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({ transform: `perspective(800px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`, transition: 'transform 0.15s ease-out' });
  };
  const handleMouseLeave = () => {
    setStyle({ transform: 'perspective(800px) rotateY(0) rotateX(0) scale(1)', transition: 'transform 0.4s ease-out' });
  };
  return { ref, style, handleMouseMove, handleMouseLeave };
}
```

---

## Environment Variables

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-token-here
N8N_WEBHOOK_URL=https://your-n8n/webhook/projectview-contact
NEXT_PUBLIC_SITE_URL=https://projectview.fr
```

---

## Critical Reminders

- ALL content is in **French**
- Dark mode is DEFAULT — light mode is the toggle option
- Premium, warm, human — NOT cold corporate. Warmth comes from color accents (teal, green, orange, gold) against dark base
- Fonts MUST be distinctive: Instrument Serif + Satoshi + JetBrains Mono
- Every section needs scroll animation (fade up, staggered reveals)
- Noise overlay is subtle but ESSENTIAL for premium feel
- Gradient text on KEY words only, not everywhere
- Glass cards: whisper-thin, not heavy frosted
- Site MUST work when Strapi is offline (fallback data)
- Test `next build` after each phase
- Lighthouse target: > 90 all metrics
- WCAG AA contrast ratios in both themes
