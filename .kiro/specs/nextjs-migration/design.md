# Design Document — Next.js Migration

## Overview

Migrasi portfolio Alaika dari arsitektur **Vite + React 18 SPA** ke **Next.js 15 App Router** dengan empat tujuan utama:

1. **SEO** — server-side metadata, Open Graph, JSON-LD structured data, sitemap, robots.txt
2. **Visual Parity 100%** — tidak ada perubahan tampilan, animasi, atau interaktivitas dari baseline Vite
3. **Modularisasi** — memecah monolith `App.jsx` (~700 baris) menjadi komponen per-section yang terpisah
4. **Core Web Vitals** — font optimization via `next/font`, image optimization via `next/image`, code splitting via `next/dynamic`

Semua perubahan bersifat **structural** — logika bisnis, konstanta physics, animasi, dan CSS custom properties dipreserve secara identik.

---

## Architecture

### Before: Vite + React 18 SPA

```
Client Browser
     │
     ▼
index.html (HTML shell)
     │
     ▼
main.jsx → App.jsx (monolith ~700 lines)
     │
     ├── Navbar (inline, ~120 lines)
     ├── Hero Canvas (inline, ~250 lines)
     ├── AboutSection (inline)
     ├── ExperienceSection (inline)
     ├── ProjectsSection (imported from ui/)
     ├── RepositorySection (imported from ui/)
     ├── ArtikelSection (inline)
     ├── TestimonialSection (inline)
     ├── ContactSection (inline)
     └── Footer (inline)
```

**Masalah:**
- Tidak ada server-rendered HTML → mesin pencari melihat halaman kosong
- Semua JS diload di awal → First Contentful Paint lambat
- Single file monolith → sulit di-maintain

### After: Next.js 15 App Router

```
Request
   │
   ▼
Next.js Server (RSC by default)
   │
   ├── src/app/layout.tsx [SERVER]
   │     ├── Font injection (next/font)
   │     ├── Metadata export (SEO)
   │     ├── JSON-LD script
   │     └── Global CSS import
   │
   ├── src/app/page.tsx [SERVER SHELL]
   │     ├── <main> wrapper
   │     └── Section assembly (ordered)
   │
   └── Client Components (SSR-disabled via next/dynamic)
         ├── HeroSection ("use client", ssr: false)
         ├── NavbarWrapper ("use client")
         └── [other interactive sections]

Client Browser
   │
   ├── Server HTML (prerendered shell) → FCP fast
   ├── Hydration (client components only)
   └── Interactive behavior restored
```

### Struktur Folder Target

```
porto_web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← App Shell (font, metadata, global CSS)
│   │   ├── page.tsx            ← Section assembly
│   │   ├── sitemap.ts          ← Dynamic sitemap
│   │   └── robots.ts           ← Robots.txt
│   │
│   ├── components/
│   │   ├── sections/           ← NEW: per-section components
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── ExperienceSection.jsx
│   │   │   ├── ProjectsSection.jsx     ← re-export wrapper
│   │   │   ├── RepositorySection.jsx   ← re-export wrapper
│   │   │   ├── ArtikelSection.jsx
│   │   │   ├── TestimonialSection.jsx
│   │   │   ├── ContactSection.jsx
│   │   │   └── FooterSection.jsx
│   │   │
│   │   └── ui/                 ← UNCHANGED: existing components
│   │       ├── resizable-navbar.jsx
│   │       ├── id-card-lanyard.jsx
│   │       ├── contribution-skyline.tsx
│   │       ├── stagger-testimonials.jsx
│   │       ├── card-18.jsx
│   │       ├── wave-path.jsx
│   │       ├── projects-section.jsx
│   │       ├── repository-section.jsx
│   │       ├── button.jsx
│   │       └── timeline.jsx
│   │
│   ├── lib/
│   │   └── utils.js            ← UNCHANGED
│   │
│   └── index.css               ← UNCHANGED (semua CSS vars, keyframes, rules)
│
├── public/                     ← UNCHANGED (frames/, center.webp, foto-layard.png)
├── next.config.js              ← NEW
├── tsconfig.json               ← NEW (replaces vite.config.js)
└── package.json                ← UPDATED (next deps)
```

---

## Components and Interfaces

### Component Classification

Setiap komponen diklasifikasikan sebagai **Server Component (SC)** atau **Client Component (CC)** berdasarkan kebutuhan browser API dan React hooks.

#### Rule: Kapan Harus `"use client"`

Komponen HARUS Client Component jika menggunakan:
- `useState`, `useReducer`, `useEffect`, `useLayoutEffect`, `useRef`
- Browser APIs: `window`, `document`, `navigator`, `Canvas`, `requestAnimationFrame`
- Event handlers yang perlu interaktivitas (pointer, mouse, keyboard)
- `motion.*` dari `motion/react` (Framer Motion)
- `useScroll`, `useSpring`, `useMotionValueEvent` dari Motion
- External library yang mengakses browser globals

#### Classification Table

| File | Type | Reason |
|------|------|--------|
| `src/app/layout.tsx` | **Server** | Hanya metadata + font injection, tidak ada client state |
| `src/app/page.tsx` | **Server** | Assembly shell, tidak ada interaktivitas langsung |
| `src/app/sitemap.ts` | **Server** | Pure data function |
| `src/app/robots.ts` | **Server** | Pure data function |
| `src/components/sections/HeroSection.jsx` | **Client (ssr:false)** | Canvas API, requestAnimationFrame, mouse events, useState, useRef |
| `src/components/sections/AboutSection.jsx` | **Client** | motion.* elements (FadeInUp), IDCardLanyard yang membutuhkan canvas |
| `src/components/sections/ExperienceSection.jsx` | **Client** | motion.* elements (FadeInUp, AnimatePresence) |
| `src/components/sections/ProjectsSection.jsx` | **Client** | Wrapper re-export, projects-section.jsx menggunakan motion.* |
| `src/components/sections/RepositorySection.jsx` | **Client** | Wrapper re-export, useEffect untuk GitHub fetch, ContributionSkyline canvas |
| `src/components/sections/ArtikelSection.jsx` | **Client** | motion.* elements, framer-motion dalam card-18.jsx |
| `src/components/sections/TestimonialSection.jsx` | **Client** | StaggerTestimonials menggunakan useState, useEffect, window.matchMedia |
| `src/components/sections/ContactSection.jsx` | **Client** | useState (form state, sent state), handleSubmit |
| `src/components/sections/FooterSection.jsx` | **Client** | onClick handlers untuk smooth scroll |
| `src/components/ui/resizable-navbar.jsx` | **Client** | useScroll, useMotionValueEvent, useState, AnimatePresence |
| `src/components/ui/id-card-lanyard.jsx` | **Client** | Canvas API, requestAnimationFrame, pointer events, ResizeObserver |
| `src/components/ui/contribution-skyline.tsx` | **Client** (already has `"use client"`) | Canvas 2D, IntersectionObserver, ResizeObserver, MutationObserver |
| `src/components/ui/stagger-testimonials.jsx` | **Client** | useState, useEffect, window.matchMedia |
| `src/components/ui/card-18.jsx` | **Client** | framer-motion (whileHover) |
| `src/components/ui/wave-path.jsx` | **Client** (already has `"use client"`) | useEffect, useRef, window.innerWidth, requestAnimationFrame |
| `src/components/ui/projects-section.jsx` | **Client** | motion.* elements (whileInView) |
| `src/components/ui/repository-section.jsx` | **Client** | useState, useEffect, fetch |
| `src/components/ui/timeline.jsx` | **Client** (already has `"use client"`) | useLayoutEffect, GSAP ScrollTrigger, window.matchMedia |

#### NavbarWrapper Pattern

Navbar di `App.jsx` saat ini dirender di dalam JSX App secara langsung bersama Hero. Di Next.js, karena Navbar adalah Client Component tapi tidak boleh di dalam `<main>`, strukturnya:

```tsx
// src/app/page.tsx (Server Component)
import NavbarWrapper from '@/components/sections/NavbarWrapper';
import HeroSection from '@/components/sections/HeroSection'; // loaded via next/dynamic

export default function Page() {
  return (
    <>
      <NavbarWrapper />    {/* "use client" — fixed positioned, outside <main> */}
      <main>
        <HeroSection />
        {/* ... sections */}
      </main>
    </>
  );
}
```

---

## Data Models

### Font Configuration

```typescript
// next/font configuration model
interface FontConfig {
  variable: string;        // CSS variable name, e.g. '--font-jakarta'
  subsets: string[];       // ['latin']
  display: 'swap' | 'block' | 'fallback' | 'optional';
  weight: string[];        // e.g. ['300', '400', '500', '600', '700']
}

// PlusJakartaSans: FontConfig
const jakartaConfig: FontConfig = {
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
};

// DancingScript: FontConfig
const dancingConfig: FontConfig = {
  variable: '--font-dancing',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
};
```

### Metadata Object Model

```typescript
// Next.js Metadata API
interface SiteMetadata {
  title: { default: string; template: string };
  description: string;
  openGraph: {
    title: string;
    description: string;
    type: 'website';
    locale: string;
    url: string;
    siteName: string;
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
  };
  robots: { index: boolean; follow: boolean };
  metadataBase: URL;
  alternates: { canonical: string };
}
```

### JSON-LD Structured Data Models

```typescript
// Person schema
interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;           // 'Alaika'
  jobTitle: string;       // 'Full Stack Developer'
  url: string;            // canonical URL
  sameAs: string[];       // [github, linkedin]
  knowsAbout: string[];   // 5-15 technology items
  address: {
    '@type': 'PostalAddress';
    addressCountry: 'ID';
  };
}

// WebSite schema
interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;           // 'Alaika'
  url: string;            // canonical URL
  description: string;    // root description
}
```

### Sitemap Entry Model

```typescript
// Next.js MetadataRoute.Sitemap
type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: 'monthly';
  priority: number;       // 1.0 untuk /, 0.7 untuk sections
};

const SECTION_ANCHORS = [
  '#about', '#experience', '#project', 
  '#repository', '#artikel', '#contact'
] as const;
```

---

## App Router Structure — Code Skeletons

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
        pathname: '/**',
      },
    ],
  },
  // Path alias @/ → src/ sudah di-handle oleh tsconfig.json
};

module.exports = nextConfig;
```

### `tsconfig.json` / `jsconfig.json`

```json
{
  "compilerOptions": {
    "strict": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  "exclude": ["node_modules"]
}
```

### `src/app/layout.tsx` — Font, Metadata, JSON-LD

```tsx
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Dancing_Script } from 'next/font/google';
import '@/index.css';

// ── Font Definitions ─────────────────────────────────────────────────────────
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-dancing',
});

// ── Metadata ─────────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaika.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Alaika — Full Stack Developer & Creative Technologist',
    template: '%s | Alaika',
  },
  description:
    'Full Stack Engineer specializing in high-performance web systems, interactive canvas architectures, and luxury digital design. Based in Indonesia.',
  openGraph: {
    title: 'Alaika — Full Stack Developer & Creative Technologist',
    description:
      'Full Stack Engineer specializing in high-performance web systems, interactive canvas architectures, and luxury digital design. Based in Indonesia.',
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Alaika',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alaika — Full Stack Developer & Creative Technologist',
    description:
      'Full Stack Engineer specializing in high-performance web systems, interactive canvas architectures, and luxury digital design. Based in Indonesia.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

// ── JSON-LD Structured Data ───────────────────────────────────────────────────
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alaika',
  jobTitle: 'Full Stack Developer',
  url: SITE_URL,
  sameAs: [
    'https://github.com/Alaika10',
    'https://linkedin.com/in/alaika',
  ],
  knowsAbout: [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Go',
    'Python', 'WebGL', 'Canvas API', 'AWS', 'Docker',
    'Kubernetes', 'PostgreSQL', 'Computer Vision',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ID',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Alaika',
  url: SITE_URL,
  description:
    'Full Stack Engineer specializing in high-performance web systems, interactive canvas architectures, and luxury digital design. Based in Indonesia.',
};

// ── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dancingScript.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

**Catatan penting pada font CSS mapping:**

Setelah `next/font` menghasilkan CSS variables `--font-jakarta` dan `--font-dancing`, CSS di `src/index.css` perlu memetakan variabel tersebut ke font-family yang digunakan elemen-elemen spesifik. Karena `src/index.css` tidak boleh dimodifikasi, mapping dilakukan di `body` HTML element:

```tsx
// Di layout.tsx — body menerima className dari next/font
// yang menyuntikkan CSS variable ke :root scope
<body className={`${plusJakartaSans.variable} ${dancingScript.variable}`}>
```

Lalu tambahkan CSS override di `src/index.css` (di bawah rule yang ada, TANPA menghapus apapun):

```css
/* ── next/font CSS variable mapping ─────────────── */
/* Mapping next/font variables ke font-family rules */
html, body {
  font-family: var(--font-jakarta, 'Plus Jakarta Sans'), -apple-system, sans-serif;
}
.name-heading,
.loader-title,
.footer-logo,
.about-title em,
.idcl-sig .idcl-script {
  font-family: var(--font-dancing, 'Dancing Script'), cursive;
}
```

Karena `src/index.css` tidak boleh dimodifikasi, alternatifnya adalah menambahkan CSS tambahan di `src/app/globals-override.css` yang diimpor setelah `index.css` di `layout.tsx`.

### `src/app/page.tsx` — Section Assembly

```tsx
// Server Component — hanya assembly, tidak ada client logic
import dynamic from 'next/dynamic';
import NavbarWrapper from '@/components/sections/NavbarWrapper';
import FooterSection from '@/components/sections/FooterSection';
import WavePathSection from '@/components/sections/WavePathSection';

// Canvas-heavy / browser-API sections: SSR disabled
const HeroSection = dynamic(
  () => import('@/components/sections/HeroSection'),
  {
    ssr: false,
    loading: () => (
      // Placeholder dengan tinggi sama untuk mencegah CLS
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#e5e7e7',
        }}
        aria-hidden="true"
      />
    ),
  },
);

// Sections dengan motion.* — SSR diperbolehkan tapi perlu "use client"
// Tidak perlu ssr: false karena tidak menggunakan Browser-only APIs di render
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import RepositorySection from '@/components/sections/RepositorySection';
import ArtikelSection from '@/components/sections/ArtikelSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <>
      {/* Navbar: fixed position, rendered outside <main> */}
      <NavbarWrapper />

      {/* Main content: semantically correct wrapper */}
      <main>
        {/* Hero: browser-only Canvas, SSR disabled */}
        <HeroSection />

        {/* About + Experience: combined dalam AboutSection */}
        <AboutSection />

        {/* Wave divider */}
        <div className="wave-divider wave-divider--light">
          {/* WavePath dirender di client untuk interaktivitas */}
        </div>

        {/* Projects */}
        <ProjectsSection />

        {/* Repository + Contribution Skyline */}
        <RepositorySection />

        {/* Artikel */}
        <ArtikelSection />

        {/* Testimonials */}
        <TestimonialSection />

        {/* Wave divider ke dark section */}
        <div className="wave-divider wave-divider--dark">
          {/* WavePath untuk transisi ke Contact */}
        </div>

        {/* Contact */}
        <ContactSection />
      </main>

      {/* Footer: outside <main> per semantic HTML */}
      <FooterSection />
    </>
  );
}
```

**Catatan tentang `WavePath`:** Komponen ini menggunakan `useRef` dan `window` — sudah ada `"use client"`. Untuk assembly di `page.tsx` (server component), bisa diimport langsung karena Next.js akan detect bahwa WavePath adalah client component dan render di client. Alternatifnya buat `WaveSection` wrapper kecil dengan `"use client"`.

### `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaika.dev';

const SECTION_ANCHORS = [
  '#about',
  '#experience',
  '#project',
  '#repository',
  '#artikel',
  '#contact',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseEntry = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  };

  const sectionEntries = SECTION_ANCHORS.map((anchor) => ({
    url: `${SITE_URL}/${anchor}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [baseEntry, ...sectionEntries];
}
```

### `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaika.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

---

## next/dynamic Lazy Loading Strategy

### Prinsip

Komponen canvas berat menggunakan `next/dynamic` dengan `{ ssr: false }` untuk dua alasan:
1. **Mencegah server-side error** — `window`, `canvas.getContext()`, `requestAnimationFrame` tidak tersedia di Node.js
2. **Code splitting** — JS bundle untuk canvas engine hanya diload setelah halaman pertama kali dirender

### HeroSection — Priority SSR Disabled

HeroSection adalah komponen paling berat (~400 baris logic) dan menggunakan:
- `window.innerWidth`, `window.innerHeight` pada initial render
- `requestAnimationFrame` dalam render loop
- `new Image()` untuk preloading frames
- `canvas.getContext('2d')`

```tsx
// Di src/app/page.tsx
const HeroSection = dynamic(
  () => import('@/components/sections/HeroSection'),
  {
    ssr: false,
    loading: () => (
      <div
        className="hero-section-wrapper"
        style={{ backgroundColor: 'var(--bg-color, #e5e7e7)' }}
        aria-label="Loading portfolio..."
        role="progressbar"
      >
        {/* Shell dengan height yang sama persis untuk CLS = 0 */}
        {/* CSS class hero-section-wrapper sudah define height: 100vh */}
      </div>
    ),
  },
);
```

**Loading fallback design:** Placeholder harus `height: 100vh` dan `background-color: #e5e7e7` — identik dengan hero section final, sehingga CLS = 0 karena tidak ada layout shift ketika komponen hydrate.

### IDCardLanyard — Lazy dalam AboutSection

IDCardLanyard tidak perlu disable SSR secara top-level karena sudah di dalam `AboutSection` yang adalah client component. Namun untuk code splitting agar bundle awal lebih kecil:

```tsx
// Di src/components/sections/AboutSection.jsx
"use client";

import dynamic from 'next/dynamic';

const IDCardLanyard = dynamic(
  () => import('@/components/ui/id-card-lanyard').then(m => ({ default: m.IDCardLanyard })),
  {
    ssr: false,
    loading: () => (
      // Placeholder sticky container dengan dimensi sama
      <div
        className="about-card-placeholder"
        style={{
          position: 'sticky',
          top: '88px',
          height: '520px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '18px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
        aria-hidden="true"
      />
    ),
  },
);
```

### ContributionSkyline — Lazy dalam RepositorySection

ContributionSkyline sudah memiliki `"use client"` di `contribution-skyline.tsx`. Karena RepositorySection adalah client component yang melakukan GitHub fetch di useEffect, ContributionSkyline bisa diimport secara lazy untuk code splitting:

```tsx
// Di src/components/sections/RepositorySection.jsx
"use client";

// Re-export dari ui/ yang sudah ada — ContributionSkyline sudah "use client"
// Tidak perlu lazy loading tambahan karena RepositorySection sendiri sudah lazy
export { RepositorySection } from '@/components/ui/repository-section';
```

Alternatif jika ingin code splitting lebih agresif — bungkus ContributionSkyline dalam dynamic import di dalam repository-section.jsx:

```tsx
// Di src/components/ui/repository-section.jsx (tambahan)
const ContributionSkyline = dynamic(
  () => import('@/components/ui/contribution-skyline'),
  {
    ssr: false,
    loading: () => (
      <div
        className="mb-14 rounded-3xl bg-white/85 border border-black/[0.08]"
        style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="Loading GitHub activity chart..."
      >
        <div className="text-sm text-gray-400">Loading activity skyline...</div>
      </div>
    ),
  },
);
```

### Summary: next/dynamic Usage

| Component | SSR | Loading Fallback Height | Reason |
|-----------|-----|-------------------------|--------|
| `HeroSection` | `false` | `100vh` | Canvas + window + rAF |
| `IDCardLanyard` | `false` | `520px` | Canvas + pointer events + ResizeObserver |
| `ContributionSkyline` | `false` | `400px` | Canvas 2D + IntersectionObserver |

---

## Font System Design

### Problem dengan Approach Saat Ini

`App.jsx` saat ini tidak eksplisit me-load font — portfolio bergantung pada Google Fonts CDN link yang ada di `index.html`. Di Next.js, link ini harus dihapus dan diganti dengan `next/font/google` untuk:
1. Self-hosting font (tidak ada CDN dependency)
2. Zero layout shift (font diload synchronously dengan CSS)
3. Menghilangkan preconnect link ke `fonts.googleapis.com`

### CSS Variable Mapping Strategy

```
next/font generates:
  --font-jakarta: 'Plus Jakarta Sans'  (injected ke <html> element via className)
  --font-dancing: 'Dancing Script'     (injected ke <html> element via className)

CSS rules yang sudah ada dan HARUS TETAP BERFUNGSI:
  font-family: 'Plus Jakarta Sans', sans-serif;   → harus resolve ke --font-jakarta
  font-family: 'Dancing Script', cursive;          → harus resolve ke --font-dancing
```

**Pendekatan yang dipilih:** Karena `src/index.css` tidak boleh dimodifikasi, CSS rules yang menggunakan nama font literal (`'Plus Jakarta Sans'`, `'Dancing Script'`) tetap berfungsi karena `next/font` men-serve font tersebut dari domain yang sama dengan nama font yang sama. Nama font tidak berubah — hanya hosting-nya yang berubah dari CDN ke self-hosted.

Artinya:
- `font-family: 'Plus Jakarta Sans', sans-serif;` di `index.css` tetap match dengan font yang di-serve next/font
- `font-family: 'Dancing Script', cursive;` di `.name-heading` tetap match

CSS variables (`--font-jakarta`, `--font-dancing`) diperlukan **hanya jika** ada elemen baru yang ingin menggunakan font via variable. Untuk visual parity, tidak perlu mengubah CSS yang ada.

### Fallback Strategy

Jika `next/font` gagal load (rare, karena self-hosted):
- `display: 'swap'` memastikan teks terlihat dengan system font dahulu, kemudian swap ke font yang ter-load
- Fallback chain di CSS: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Fallback untuk Dancing Script: `cursive` (browser default cursive font)

### IDCardLanyard Font Exception

`IDCardLanyard` (file: `id-card-lanyard.jsx`) memuat Archivo, Work Sans, JetBrains Mono, Caveat via Google Fonts CDN secara lazy di dalam `useEffect`. Ini adalah **desain yang dipertahankan** karena:
1. Font-font ini hanya digunakan di dalam komponen ini
2. Loading via `useEffect` mencegah render blocking
3. Requirement 8.4 secara eksplisit menyatakan behavior ini harus dipertahankan: "BUKAN melalui @import di CSS level yang dapat memblokir rendering"

Ini bukan regression — link preconnect yang dilarang di requirement 3.6 adalah untuk **halaman utama** (`src/app/layout.tsx`), bukan untuk lazy-loaded component-level fonts.

---

## Metadata & SEO System

### Architecture

```
src/app/layout.tsx
    │
    ├── export const metadata  ← Next.js Metadata API
    │     ├── title.default    → <title>Alaika — Full Stack Developer...</title>
    │     ├── title.template   → <title>Page Name | Alaika</title>
    │     ├── description      → <meta name="description" ...>
    │     ├── openGraph        → <meta property="og:*" ...>
    │     ├── twitter          → <meta name="twitter:*" ...>
    │     ├── robots           → <meta name="robots" content="index,follow">
    │     ├── metadataBase     → Resolves relative URLs
    │     └── alternates       → <link rel="canonical" ...>
    │
    └── JSON-LD <script> tags  ← Injected in <head> via dangerouslySetInnerHTML
          ├── Person schema
          └── WebSite schema
```

### Environment Variable Fallback

```typescript
// Pattern yang digunakan di layout.tsx, sitemap.ts, robots.ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaika.dev';
```

Ini memastikan bahwa bahkan tanpa environment variable, `metadataBase` selalu valid dan sitemap URLs tidak pernah mengandung `undefined` atau `localhost`.

---

## Image Optimization Strategy

### Inventory Gambar

| Gambar | Location | Type | next/image Treatment |
|--------|----------|------|---------------------|
| `foto-layard.png` | `public/` | Profile photo di IDCard | `<Image>` dengan `width={182} height={112}` |
| `center.webp` | `public/` | Canvas frame (loaded via `new Image()`) | **TIDAK** — di-load oleh Canvas API, bukan `<img>` |
| `frames/frame_*.webp` (64 files) | `public/` | Canvas frames | **TIDAK** — di-load oleh Canvas API |
| GitHub avatar | External URL | Repo section avatar | `<Image>` dengan `width={48} height={48}` |
| Testimonial photos | External Unsplash | Testimonial cards | `<Image>` dengan dimensi eksplisit |
| Project thumbnails | External Unsplash | Project rows | `<Image fill>` dengan wrapper `relative` |

### Implementasi Per-Lokasi

#### IDCardLanyard — foto-layard.png

```jsx
// src/components/ui/id-card-lanyard.jsx
// SEBELUM:
<img src={photoUrl} alt={name} />

// SESUDAH:
import Image from 'next/image';
// ...
<Image
  src={photoUrl}
  alt={`${name} — ID card photo`}
  width={182}
  height={112}
  style={{ objectFit: 'cover', objectPosition: 'center top' }}
/>
```

Namun karena `id-card-lanyard.jsx` adalah komponen JSX yang tidak menggunakan TypeScript, dan `next/image` membutuhkan `width`/`height` yang eksplisit, perlu diperhatikan bahwa foto-layard.png memiliki dimensi yang mungkin berbeda. Dimensi di CSS adalah `width: 100%; height: 112px` — gunakan `fill` prop:

```jsx
<div className="idcl-photo" style={{ position: 'relative' }}>
  <Image
    src={photoUrl}
    alt={`${name} — profile photo`}
    fill
    style={{ objectFit: 'cover', objectPosition: 'center top' }}
  />
</div>
```

#### RepositorySection — GitHub Avatar

```jsx
// src/components/ui/repository-section.jsx
// SEBELUM:
<img
  src={`https://avatars.githubusercontent.com/u/128287471?v=4`}
  alt={GITHUB_USERNAME}
  className="w-12 h-12 rounded-full border border-black/10 object-cover"
/>

// SESUDAH:
<Image
  src={`https://avatars.githubusercontent.com/u/128287471?v=4`}
  alt={`${GITHUB_USERNAME} GitHub avatar`}
  width={48}
  height={48}
  className="rounded-full border border-black/10"
  style={{ objectFit: 'cover' }}
/>
```

#### ProjectsSection — Unsplash Thumbnails

```jsx
// src/components/ui/projects-section.jsx
// SEBELUM:
<div className="proj-thumb">
  <img src={p.image} alt={p.title} loading="lazy" />
</div>

// SESUDAH:
<div className="proj-thumb" style={{ position: 'relative' }}>
  <Image
    src={p.image}
    alt={p.title}
    fill
    style={{ objectFit: 'cover' }}
    sizes="96px"
  />
</div>
```

#### Testimonial Cards — Unsplash Photos

```jsx
// src/components/ui/stagger-testimonials.jsx
// SEBELUM:
<img
  src={testimonial.imgSrc}
  alt={testimonial.by.split(',')[0]}
  className="mb-4 h-14 w-12 object-cover object-top"
/>

// SESUDAH:
<Image
  src={testimonial.imgSrc}
  alt={testimonial.by.split(',')[0]}
  width={48}
  height={56}
  className="mb-4"
  style={{ objectFit: 'cover', objectPosition: 'top' }}
/>
```

### Canvas Frames — TIDAK Dioptimasi via next/image

Frame WebP di `public/frames/` dan `center.webp` di-load melalui `new Image()` di dalam Canvas render loop. Ini **bukan** elemen `<img>` HTML, sehingga `next/image` tidak berlaku. Optimization untuk canvas frames:
- Format sudah WebP (optimal)
- Loading dikontrol manual via preloader dengan progress tracking
- Tidak ada CLS karena canvas memiliki height: 100vh yang fixed

---

## Migration Approach

### Strategy: Incremental, Zero-Downtime

Pendekatan yang digunakan adalah **parallel development** — proyek Next.js dibuat baru secara terpisah, bukan mengubah project Vite yang ada. Ini memastikan:
- Vite project tetap berjalan selama migrasi
- Rollback mudah jika ada masalah
- Zero-downtime deployment

### Migration Order (File-by-File)

**Phase 1: Foundation (tidak ada visible changes)**

1. Init Next.js project: `npx create-next-app@latest --no-app` lalu konfigurasi manual ke App Router
2. Copy `src/index.css` → `src/index.css` (identical)
3. Copy `tailwind.config.js` → `tailwind.config.js` (+ extend content paths)
4. Copy semua `src/components/ui/*.{jsx,tsx}` (unchanged)
5. Copy `src/lib/utils.js` (unchanged)
6. Copy `public/` directory (all assets)
7. Create `next.config.js`
8. Create `tsconfig.json`/`jsconfig.json`

**Phase 2: App Shell**

9. Create `src/app/layout.tsx` (font, metadata, JSON-LD)
10. Create `src/app/sitemap.ts`
11. Create `src/app/robots.ts`

**Phase 3: Section Components**

Dibuat secara berurutan dengan `"use client"` directive — extract dari `App.jsx`:

12. Create `FooterSection.jsx` (paling sederhana — tidak ada canvas/physics)
13. Create `ContactSection.jsx` (hanya form state)
14. Create `TestimonialSection.jsx` (wrapper untuk StaggerTestimonials)
15. Create `ArtikelSection.jsx` (wrapper untuk BlogPostCard)
16. Create `ExperienceSection.jsx` (extract dari AboutSection inline)
17. Create `AboutSection.jsx` (IDCardLanyard + skills grid)
18. Create `ProjectsSection.jsx` (re-export wrapper)
19. Create `RepositorySection.jsx` (re-export wrapper + ContributionSkyline)
20. Create `NavbarWrapper.jsx` (extract dari App.jsx)
21. Create `HeroSection.jsx` (canvas + gaze tracking — paling kompleks)

**Phase 4: Page Assembly**

22. Create `src/app/page.tsx` (assembly semua sections)
23. Add `"use client"` directives ke semua ui/ components yang membutuhkannya
24. Test visual parity dengan Vite build side-by-side

**Phase 5: Image Optimization**

25. Replace `<img>` tags di ui/ components dengan `<Image>` from next/image
26. Update `next.config.js` dengan remotePatterns

**Phase 6: Verification**

27. Run `next build` → pastikan exit code 0
28. Lighthouse CI untuk LCP, CLS, INP

### Semantic HTML Requirements per Section

Berdasarkan Requirement 6, setiap section harus menggunakan elemen semantik yang benar:

| Section | HTML Element | id attr | heading |
|---------|-------------|---------|---------|
| Hero | `<section>` | (tidak ada id — tidak ada di requirements) | `<h1>Alaika</h1>` |
| About | `<section id="about">` | `about` | `<h2>Engineering at the intersection...</h2>` |
| Experience | `<section id="experience">` | `experience` | `<h2>Career & Milestones</h2>` |
| Projects | `<section id="project">` | `project` | `<h2>Crafted with precision...</h2>` |
| Repository | `<section id="repository">` | `repository` | `<h2>Activity Skyline...</h2>` |
| Artikel | `<section id="artikel">` | `artikel` | `<h2>Thoughts on engineering...</h2>` |
| Testimonials | `<section id="testimonial">` | `testimonial` | `<h2>What clients say...</h2>` |
| Contact | `<section id="contact">` | `contact` | `<h2>Let's build something great</h2>` |

Project cards, repo cards, dan artikel cards menggunakan `<h3>` untuk sub-headings.

Navbar: `<nav aria-label="Main navigation">` — perlu ditambahkan ke `resizable-navbar.jsx`.

### Hydration Error Prevention

Sumber utama hydration errors dalam project ini:
1. **Canvas dimensions** — `window.innerWidth` / `window.innerHeight` berbeda di server vs client
2. **Date rendering** — `new Date().getFullYear()` di Footer bisa berbeda jika di-render saat midnight
3. **Random values** — Tidak ada dalam project ini (seeded RNG di ContributionSkyline)

**Solutions:**
- HeroSection: `ssr: false` via `next/dynamic` → tidak pernah dirender di server
- IDCardLanyard: `ssr: false` via `next/dynamic` → tidak pernah dirender di server
- ContributionSkyline: sudah `"use client"`, `ssr: false` via dynamic → tidak pernah dirender di server
- Footer year: Gunakan `suppressHydrationWarning` pada elemen yang menampilkan tahun, ATAU render year di useEffect

```jsx
// FooterSection.jsx — hydration-safe year rendering
"use client";
function Footer() {
  const [year, setYear] = React.useState(null);
  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="footer">
      {/* ... */}
      <span className="footer-copy">© {year ?? '2024'} Alaika. All rights reserved.</span>
    </footer>
  );
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: CSS Custom Properties Completeness

*For any* set of CSS custom properties defined in the original `src/index.css` `:root` block, every property in that set must also exist in the CSS custom properties available on `document.documentElement` after the Next.js page loads.

**Validates: Requirements 1.5, 15.2**

### Property 2: Client Directive Completeness

*For any* source file that contains at least one usage of `useState`, `useEffect`, `useRef`, `useLayoutEffect`, `canvas.getContext`, `window`, `document`, `requestAnimationFrame`, or pointer event handlers — that file must have `"use client"` as its first non-comment line.

**Validates: Requirements 2.5, 2.6**

### Property 3: Google Fonts Preconnect Absence

*For any* rendered HTML page, the set of `<link>` elements in `<head>` must not contain any element with `href` containing `fonts.googleapis.com` or `fonts.gstatic.com` as a preconnect or stylesheet link.

**Validates: Requirements 3.6**

### Property 4: Metadata Field Completeness

*For any* exported `metadata` object from `src/app/layout.tsx`, the set of required fields — `{title, description, openGraph.title, openGraph.description, openGraph.type, openGraph.locale, openGraph.url, openGraph.siteName, twitter.card, twitter.title, twitter.description, robots.index, robots.follow, alternates.canonical}` — must all be present with non-null, non-empty string values.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**

### Property 5: JSON-LD Person Schema Completeness

*For any* JSON-LD script with `@type: "Person"` in the rendered HTML, the following fields must be present and valid: `name` (string, non-empty), `jobTitle` (string), `url` (valid URL string), `sameAs` (array with length >= 1), `knowsAbout` (array with length between 5 and 15), `address.addressCountry` (equals "ID").

**Validates: Requirements 4.8**

### Property 6: Sitemap Section Coverage

*For any* section anchor in the set `['#about', '#experience', '#project', '#repository', '#artikel', '#contact']`, the sitemap output array must contain an entry whose `url` ends with that anchor, with `priority` equal to `0.7` and `changeFrequency` equal to `'monthly'`.

**Validates: Requirements 5.2, 5.3**

### Property 7: Unique H1 Invariant

*For any* rendered page HTML, the count of `<h1>` elements must be exactly one, and that element must contain the text "Alaika".

**Validates: Requirements 6.3**

### Property 8: Section Heading Hierarchy

*For any* section element with id in `['about', 'experience', 'project', 'repository', 'artikel', 'contact', 'testimonial']`, the first heading element that is a direct or nested child of that section must be an `<h2>` element, not an `<h1>` or `<h3>`.

**Validates: Requirements 6.4**

### Property 9: Image Alt Text Validity

*For any* `<img>` element (or `next/image` rendered `<img>`) in the page: if the element has `role="presentation"` or `aria-hidden="true"`, its `alt` attribute must be empty string `""`; otherwise its `alt` attribute must have length greater than or equal to 5 characters.

**Validates: Requirements 6.6**

### Property 10: Hydration Mismatch Absence

*For any* page render cycle, the set of console warnings must not contain any string matching the pattern `"Text content did not match"` or `"Prop \`className\` did not match"` or `"Expected server HTML to contain"`.

**Validates: Requirements 15.6**

### Property 11: Dancing Script Font Application

*For any* element in the set `['.name-heading', '.about-title em', '.footer-logo']`, the computed CSS `font-family` value must contain the string `"Dancing Script"`.

**Validates: Requirements 15.7**

---

## Error Handling

### Build-Time Errors

| Error | Cause | Resolution |
|-------|-------|-----------|
| `next/font` font not found | Typo dalam font name | Build time error akan describe font yang tidak ditemukan (Req 3.7) |
| `Module not found: @/components/...` | Path alias tidak dikonfigurasi | Verifikasi `tsconfig.json` `paths` dan `next.config.js` |
| `"use client" required` | Server component menggunakan browser API | Tambahkan `"use client"` directive |
| Image domain not configured | External URL di `<Image>` | Tambahkan hostname ke `next.config.js` `remotePatterns` |

### Runtime Errors

| Error | Cause | Resolution |
|-------|-------|-----------|
| Canvas hydration mismatch | Canvas dirender di server | Pastikan `ssr: false` pada HeroSection, IDCardLanyard |
| GitHub API fetch failure | Network error / CORS | ContributionSkyline fallback ke generated data (Req 9.4) |
| `window is not defined` | Browser API di server component | Move ke useEffect atau tambahkan `"use client"` |
| Font FOIT | `display: 'block'` | Gunakan `display: 'swap'` di next/font config |

### Graceful Degradation

- **Canvas frames**: Safety timer di HeroSection (2500ms) memastikan halaman muncul bahkan jika preloading gagal
- **GitHub contributions**: Jika fetch gagal, ContributionSkyline menggunakan seeded generated data — pengunjung tetap melihat visualisasi yang menarik
- **IDCardLanyard fonts**: Font dimuat lazy via useEffect — komponen terlihat dengan system font fallback jika CDN lambat

---

## Testing Strategy

### Unit Tests

Framework yang direkomendasikan: **Vitest** (sudah kompatibel dengan project karena menggunakan Vite toolchain), dengan **jsdom** sebagai test environment dan **@testing-library/react** untuk rendering.

Focus area unit tests:
- Constants di HeroSection (LERP factors, FACE_NORM values) — verifikasi tidak berubah
- Physics constants di IDCardLanyard (NUM_POINTS, REST_LENGTH, GRAVITY, dll.)
- `sitemap()` function — verifikasi output struktur
- `robots()` function — verifikasi output
- CSS custom properties completeness check (parse index.css, verify all vars present)
- Metadata object structure — verifikasi semua required fields present

```javascript
// Contoh: sitemap() function unit test
import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap()', () => {
  it('includes root URL with priority 1.0', () => {
    const entries = sitemap();
    const root = entries.find(e => !e.url.includes('#'));
    expect(root).toBeDefined();
    expect(root.priority).toBe(1.0);
  });

  it('includes all section anchors with priority 0.7', () => {
    const anchors = ['#about', '#experience', '#project', '#repository', '#artikel', '#contact'];
    const entries = sitemap();
    for (const anchor of anchors) {
      const entry = entries.find(e => e.url.endsWith(anchor));
      expect(entry, `Missing entry for ${anchor}`).toBeDefined();
      expect(entry.priority).toBe(0.7);
    }
  });

  it('never contains undefined in URLs when NEXT_PUBLIC_SITE_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.url).not.toContain('undefined');
      expect(entry.url).toContain('https://alaika.dev');
    }
  });
});
```

### Property-Based Tests

Framework: **fast-check** (JavaScript PBT library, tersedia via npm)

Property tests diimplementasikan sesuai dengan Correctness Properties di atas. Setiap property test berjalan minimum 100 iterasi.

```javascript
// Contoh: Property 6 — Sitemap Section Coverage
import fc from 'fast-check';
import sitemap from '@/app/sitemap';

// Tag: Feature: nextjs-migration, Property 6: Sitemap Section Coverage
test('sitemap covers all section anchors', () => {
  const SECTION_ANCHORS = ['#about', '#experience', '#project', '#repository', '#artikel', '#contact'];
  
  // Property: untuk setiap anchor, entry dengan priority 0.7 harus ada
  fc.assert(
    fc.property(
      fc.constantFrom(...SECTION_ANCHORS),
      (anchor) => {
        const entries = sitemap();
        const entry = entries.find(e => e.url.endsWith(anchor));
        return entry !== undefined && entry.priority === 0.7 && entry.changeFrequency === 'monthly';
      }
    ),
    { numRuns: 100 }
  );
});
```

```javascript
// Contoh: Property 4 — Metadata Field Completeness
import fc from 'fast-check';
import { metadata } from '@/app/layout';

// Tag: Feature: nextjs-migration, Property 4: Metadata Field Completeness
test('metadata contains all required fields with non-empty values', () => {
  const requiredPaths = [
    ['title', 'default'],
    ['description'],
    ['openGraph', 'title'],
    ['openGraph', 'description'],
    ['openGraph', 'type'],
    ['openGraph', 'locale'],
    ['openGraph', 'siteName'],
    ['twitter', 'card'],
    ['robots', 'index'],
    ['robots', 'follow'],
  ];
  
  for (const path of requiredPaths) {
    let value = metadata;
    for (const key of path) {
      value = value?.[key];
    }
    expect(value, `Missing metadata field: ${path.join('.')}`).toBeDefined();
    if (typeof value === 'string') {
      expect(value.length, `Empty metadata field: ${path.join('.')}`).toBeGreaterThan(0);
    }
  }
});
```

```javascript
// Contoh: Property 7 — Unique H1 Invariant
import { render } from '@testing-library/react';
import Page from '@/app/page';

// Tag: Feature: nextjs-migration, Property 7: Unique H1 Invariant
test('rendered page has exactly one h1 element containing "Alaika"', async () => {
  const { container } = render(<Page />);
  const h1Elements = container.querySelectorAll('h1');
  expect(h1Elements.length).toBe(1);
  expect(h1Elements[0].textContent).toContain('Alaika');
});
```

### Integration Tests

Untuk Core Web Vitals (Requirements 14.1-14.3), testing dilakukan dengan **Lighthouse CI**:

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      http://localhost:3000
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

```json
// lighthouse-budget.json
[{
  "path": "/",
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "interactive", "budget": 3800 }
  ],
  "metrics": [
    { "metric": "cumulative-layout-shift", "budget": 0.1 }
  ]
}]
```

### Visual Regression Tests

Untuk hydration errors (Property 10) dan font application (Property 11), gunakan **Playwright** dengan custom reporter yang captures console warnings:

```typescript
// e2e/hydration.spec.ts
import { test, expect } from '@playwright/test';

test('no hydration errors in console', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'warning' || msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const hydrationErrors = consoleErrors.filter(e =>
    e.includes('Text content did not match') ||
    e.includes('Prop `className` did not match') ||
    e.includes('Expected server HTML to contain')
  );
  
  expect(hydrationErrors).toHaveLength(0);
});

test('Dancing Script applied to name heading', async ({ page }) => {
  await page.goto('/');
  
  const fontFamily = await page.evaluate(() => {
    const el = document.querySelector('.name-heading');
    return window.getComputedStyle(el).fontFamily;
  });
  
  expect(fontFamily).toContain('Dancing Script');
});
```
