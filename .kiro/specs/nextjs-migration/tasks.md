# Implementation Plan: Next.js Migration

## Overview

Migrasi portfolio Alaika dari arsitektur Vite + React 18 SPA ke Next.js 15 App Router secara incremental. Pendekatan ini menggunakan parallel development — proyek Next.js dikonfigurasi di atas codebase yang ada tanpa menghapus Vite files sampai verifikasi selesai. Setiap phase divalidasi sebelum melanjutkan ke phase berikutnya.

## Tasks

---

### Phase 1: Foundation Setup

- [x] 1. Install Next.js dan konfigurasi package.json
  - Install `next@15` dan `react@18`, `react-dom@18` (pastikan versi sudah sesuai) via `npm install next@15`
  - Tambahkan scripts di `package.json`: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "next lint"`
  - Pertahankan semua dependencies yang ada (motion, lucide-react, dll.) — hanya tambah `next`
  - Hapus `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"` dari scripts setelah Next.js dikonfirmasi berjalan
  - _Requirements: 1.1, 1.6_

- [x] 2. Buat `next.config.js` dengan image remotePatterns
  - Buat file `next.config.js` di root project
  - Konfigurasi `images.remotePatterns` untuk: `images.unsplash.com`, `avatars.githubusercontent.com`, `fonts.gstatic.com`
  - Gunakan skeleton dari design document section "next.config.js"
  - _Requirements: 1.1, 10.5_

- [x] 3. Buat `jsconfig.json` dengan path alias `@/`
  - Buat `jsconfig.json` di root project (bukan `tsconfig.json` karena codebase utama JSX)
  - Konfigurasi `compilerOptions.paths`: `"@/*": ["./src/*"]`
  - Konfigurasi `compilerOptions.baseUrl: "."` dan `moduleResolution: "bundler"`
  - Sertakan `"allowJs": true`, `"skipLibCheck": true`, `"jsx": "preserve"`
  - _Requirements: 1.3_

- [x] 4. Update `tailwind.config.js` dengan Next.js content paths
  - Baca `tailwind.config.js` yang ada terlebih dahulu
  - Tambahkan `./src/app/**/*.{js,ts,jsx,tsx}` ke array `content` — jangan hapus paths yang sudah ada
  - Verifikasi semua paths lain tetap identik
  - _Requirements: 1.4_

- [x] 5. Verifikasi `src/index.css` tidak dimodifikasi
  - Baca `src/index.css` dan catat semua CSS custom properties di `:root`, semua `@keyframes`, dan semua rule blocks
  - Konfirmasi tidak ada perubahan apapun — file ini adalah read-only selama migrasi
  - Buat checklist: semua `--bg-color`, `--font-*`, `@keyframes` definitions harus tetap ada
  - _Requirements: 1.5, 15.1, 15.2_

- [x] 6. Checkpoint — verifikasi foundation
  - Pastikan `next` binary tersedia dengan menjalankan `npx next --version`
  - Pastikan `jsconfig.json` valid JSON dengan memverifikasi tidak ada syntax error
  - Pastikan semua file yang ada di `src/components/ui/` dan `src/lib/` tidak tersentuh
  - Tanya user jika ada pertanyaan sebelum lanjut ke Phase 2.

---

### Phase 2: App Shell

- [x] 7. Buat `src/app/layout.tsx` — font, metadata, JSON-LD
  - [x] 7.1 Buat direktori `src/app/` jika belum ada, lalu buat `src/app/layout.tsx`
    - Import `Plus_Jakarta_Sans` dan `Dancing_Script` dari `next/font/google`
    - Konfigurasi `plusJakartaSans` dengan `weight: ['300','400','500','600','700']`, `subsets: ['latin']`, `display: 'swap'`, `variable: '--font-jakarta'`
    - Konfigurasi `dancingScript` dengan `weight: ['500','600','700']`, `subsets: ['latin']`, `display: 'swap'`, `variable: '--font-dancing'`
    - Import `'@/index.css'` sebagai global stylesheet
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 7.2 Tambahkan `export const metadata` di `src/app/layout.tsx`
    - Set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaika.dev')`
    - Set `title.default: 'Alaika — Full Stack Developer & Creative Technologist'` dan `title.template: '%s | Alaika'`
    - Set `description`, `openGraph` (title, description, type, locale, url, siteName), `twitter` (card, title, description)
    - Set `robots: { index: true, follow: true }` dan `alternates: { canonical: '/' }`
    - Gunakan skeleton dari design document section "src/app/layout.tsx"
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.10_

  - [x] 7.3 Tambahkan JSON-LD structured data di `src/app/layout.tsx`
    - Buat `personSchema` dengan: `@type: 'Person'`, `name: 'Alaika'`, `jobTitle: 'Full Stack Developer'`, `url`, `sameAs: [github, linkedin]`, `knowsAbout` (10 items), `address.addressCountry: 'ID'`
    - Buat `websiteSchema` dengan: `@type: 'WebSite'`, `name: 'Alaika'`, `url`, `description`
    - Inject keduanya via `<script type="application/ld+json" dangerouslySetInnerHTML={...} />` di dalam `<head>` di `RootLayout`
    - _Requirements: 4.8, 4.9_

  - [x] 7.4 Selesaikan `RootLayout` component di `src/app/layout.tsx`
    - Struktur: `<html lang="en" className={font variables}>` → `<head>` (JSON-LD scripts) → `<body>` (children)
    - Apply font variables ke `<html>` element: `className={\`${plusJakartaSans.variable} ${dancingScript.variable}\`}`
    - _Requirements: 3.1, 3.4, 3.5_

  - [x] 7.5 Tulis unit test untuk metadata completeness
    - **Property 4: Metadata Field Completeness**
    - Verifikasi semua required fields hadir: title.default, description, openGraph.title, openGraph.type, openGraph.locale, openGraph.siteName, twitter.card, robots.index, robots.follow, alternates.canonical
    - Verifikasi tidak ada field yang undefined atau empty string
    - **Validates: Requirements 4.1–4.7**

- [x] 8. Buat `src/app/sitemap.ts`
  - [x] 8.1 Buat `src/app/sitemap.ts` dengan Next.js Sitemap API
    - Definisikan `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaika.dev'`
    - Definisikan `SECTION_ANCHORS` array: `['#about', '#experience', '#project', '#repository', '#artikel', '#contact']`
    - Return entry untuk `/` dengan `priority: 1.0`, `changeFrequency: 'monthly'`, `lastModified: new Date()`
    - Return entries untuk setiap anchor dengan `priority: 0.7`, `changeFrequency: 'monthly'`
    - Gunakan skeleton dari design document section "src/app/sitemap.ts"
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

  - [x] 8.2 Tulis unit tests untuk `sitemap()`
    - Test: root URL (/) hadir dengan priority 1.0
    - Test: setiap anchor hadir dengan priority 0.7 dan changeFrequency 'monthly'
    - Test: ketika `NEXT_PUBLIC_SITE_URL` tidak di-set, URL tidak mengandung 'undefined' — menggunakan fallback 'alaika.dev'
    - **Property 6: Sitemap Section Coverage — Validates: Requirements 5.2, 5.3, 5.6**

- [x] 9. Buat `src/app/robots.ts`
  - Buat `src/app/robots.ts` dengan Next.js Robots API
  - Konfigurasi `rules: { userAgent: '*', allow: '/' }`
  - Set `sitemap: \`${SITE_URL}/sitemap.xml\`` dengan SITE_URL fallback yang sama
  - _Requirements: 5.4, 5.5_

- [x] 10. Checkpoint — verifikasi App Shell
  - Jalankan `next build` — pastikan tidak ada error pada layout.tsx, sitemap.ts, robots.ts
  - Buka `http://localhost:3000` dan inspect `<head>` — verifikasi tidak ada `<link rel="preconnect" href="https://fonts.googleapis.com">`
  - Verifikasi JSON-LD scripts hadir di rendered HTML
  - Tanya user jika ada pertanyaan sebelum lanjut ke Phase 3.

---

### Phase 3: Section Components

- [x] 11. Buat `src/components/sections/NavbarWrapper.jsx`
  - Ekstrak `DesktopNav` function dan Navbar JSX dari `App.jsx` (baris ~530–680 di App.jsx)
  - Tambahkan `"use client"` directive di baris pertama
  - Pertahankan: `navItems` array, `onScrollTo` helper, `DesktopNav` dengan dropdown "About", `AnimatePresence` untuk dropdown, `useScroll`/`useSpring` untuk frosted glass
  - Wrap dalam `<header>` dengan `<nav aria-label="Main navigation">` sesuai Requirement 6.5 dan 6.8
  - Pertahankan scroll-triggered frosted glass behavior identik dengan App.jsx
  - Export sebagai default export `NavbarWrapper`
  - _Requirements: 2.3, 2.5, 2.6, 6.5, 6.8, 11.1, 11.2, 11.3, 11.4, 11.5, 12.4, 12.5_

- [x] 12. Buat `src/components/sections/FooterSection.jsx`
  - Ekstrak `Footer` function dari `App.jsx`
  - Tambahkan `"use client"` directive di baris pertama
  - Implementasikan hydration-safe year: gunakan `useState(null)` + `useEffect(() => setYear(new Date().getFullYear()), [])` — render `year ?? '2024'` sebagai fallback
  - Pertahankan: links array, socials array dengan SVG icons, smooth scroll onClick handlers, semua className yang ada
  - Wrap seluruh komponen dalam `<footer className="footer">` (sudah ada di App.jsx)
  - Export sebagai default export `FooterSection`
  - _Requirements: 2.3, 2.5, 2.6, 6.8, 15.6_

- [x] 13. Buat `src/components/sections/ContactSection.jsx`
  - Ekstrak `ContactSection` function dari `App.jsx`
  - Tambahkan `"use client"` directive di baris pertama
  - Pertahankan: `formState` useState, `sent` useState, `handleSubmit` dengan `e.preventDefault()`, simulated 4000ms reset, HTML5 `required` attributes pada semua fields
  - Pertahankan: `FadeInUp` component definition atau import dari shared util
  - Pertahankan semua className dan JSX markup identik
  - Export sebagai default export `ContactSection`
  - _Requirements: 2.3, 2.5, 2.6, 13.1, 13.2, 13.3, 13.4_

- [x] 14. Buat `src/components/sections/TestimonialSection.jsx`
  - Ekstrak `TestimonialSection` function dari `App.jsx`
  - Tambahkan `"use client"` directive di baris pertama
  - Import `StaggerTestimonials` dari `@/components/ui/stagger-testimonials`
  - Pertahankan `<section id="testimonial" className="testimonial-section">` wrapper dan heading hierarchy (`<h2>`)
  - Export sebagai default export `TestimonialSection`
  - _Requirements: 2.3, 2.5, 2.6_

- [x] 15. Buat `src/components/sections/ArtikelSection.jsx`
  - Ekstrak `ArtikelSection` function, `featuredPost` const, `artikelPosts` array, `containerVariants`, `itemVariants` dari `App.jsx`
  - Tambahkan `"use client"` directive di baris pertama
  - Import `BlogPostCard` dari `@/components/ui/card-18`
  - Import `motion` dari `motion/react` (bukan framer-motion)
  - Pertahankan `FadeInUp` component atau import dari shared util
  - Pertahankan semua motion variants dan whileInView config identik
  - Export sebagai default export `ArtikelSection`
  - _Requirements: 2.3, 2.5, 2.6, 12.1, 12.2, 12.3_

- [x] 16. Buat `src/components/sections/ExperienceSection.jsx`
  - Ekstrak section experience dari dalam `AboutSection` function di `App.jsx` — yaitu `<section id="experience" className="experience-section">` dan semua isinya (timeline array, experience cards, stats column)
  - Tambahkan `"use client"` directive di baris pertama
  - Import `motion` dari `motion/react` dan `FadeInUp` dari shared util (atau definisikan inline)
  - Pertahankan semua experience cards dengan delay staggered identik: 0.08, 0.14, 0.20
  - Pertahankan `<section id="experience">` wrapper dengan `<h2>` heading
  - Export sebagai default export `ExperienceSection`
  - _Requirements: 2.3, 2.5, 2.6, 12.1, 12.2, 12.3_

- [x] 17. Buat shared `FadeInUp` utility component
  - Buat `src/components/ui/fade-in-up.jsx` dengan `"use client"` directive
  - Pindahkan definisi `FadeInUp` dari App.jsx: `initial={{ opacity: 0, y: 40 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: '-80px' }}`, `transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}`
  - Export sebagai named export `{ FadeInUp }`
  - Import dan gunakan di semua section components yang membutuhkannya
  - _Requirements: 2.5, 12.1, 12.2, 12.3_

- [x] 18. Buat `src/components/sections/AboutSection.jsx`
  - Ekstrak bagian `<section id="about" className="about-section">` dari `AboutSection` function di App.jsx (sebelum Experience section)
  - Tambahkan `"use client"` directive di baris pertama
  - Import `IDCardLanyard` dari `@/components/ui/id-card-lanyard`
  - Import `FadeInUp` dari `@/components/ui/fade-in-up`
  - Pertahankan: `skills` array, stats row, skill cards grid, IDCardLanyard props identik (name, role, brand, dll.)
  - Pertahankan semua `FadeInUp` delays identik: header 0, bio 0.1, stats 0.12, section-label 0.08, skill cards 0.1–0.31
  - Export sebagai default export `AboutSection` yang hanya berisi `<section id="about">` (bukan experience)
  - _Requirements: 2.3, 2.5, 2.6, 8.1, 12.1, 12.2_

- [x] 19. Buat `src/components/sections/ProjectsSection.jsx`
  - Buat re-export wrapper yang mengekspos `ProjectsSection` dari `@/components/ui/projects-section`
  - Tambahkan `"use client"` directive di baris pertama
  - Cukup: `export { ProjectsSection as default } from '@/components/ui/projects-section'`
  - Atau default export wrapper `function ProjectsSection() { return <UiProjectsSection /> }` jika re-export langsung tidak kompatibel
  - _Requirements: 2.3, 2.4_

- [x] 20. Buat `src/components/sections/RepositorySection.jsx`
  - Buat re-export wrapper dari `@/components/ui/repository-section`
  - Tambahkan `"use client"` directive di baris pertama
  - Pastikan `ContributionSkyline` tetap di-render via `repository-section.jsx` yang sudah ada — jangan pindahkan logika
  - _Requirements: 2.3, 2.4, 9.1, 9.2_

- [x] 21. Buat `src/components/sections/HeroSection.jsx`
  - [x] 21.1 Ekstrak canvas state dan refs dari `App()` function di App.jsx
    - Tambahkan `"use client"` directive di baris pertama
    - Pindahkan semua canvas-related state: `loadingProgress`, `isLoaded`, `activeModal`, `cursorPos`, `auraPos`, `isHovered`, `isEyeContactState`, `cursorVisible`
    - Pindahkan semua refs: `canvasRef`, `framesRef`, `centerFrameRef`, `realMouseRef`, `virtualMouseRef`, `currentAngleRef`, `lerpFactorRef`, `idleTimerRef`, `lerpTimerRef`, `loadStartTimeRef`
    - Definisikan constants di atas component: `TOTAL_FRAMES = 64`, `DEFAULT_LERP_FACTOR = 0.32`, `INITIAL_LERP_FACTOR = 0.04`, `FACE_NORM_X = 0.50`, `FACE_NORM_Y = 0.38`
    - Definisikan `lerpAngle` helper function di luar component
    - _Requirements: 7.1, 7.3_

  - [x] 21.2 Pindahkan frame preloading logic ke HeroSection
    - Pindahkan `useEffect` yang melakukan preloading 64 frame WebP (`/frames/frame_00.webp` s.d. `/frames/frame_63.webp`) beserta `center.webp`
    - Pertahankan progress callback yang update `loadingProgress` (0–100)
    - Pertahankan `setIsLoaded(true)` ketika semua frames ter-load
    - Pertahankan cinematic ease-in timer: `lerpFactor` dimulai dari `INITIAL_LERP_FACTOR = 0.04` dan transition ke `DEFAULT_LERP_FACTOR = 0.32` setelah 2500ms
    - _Requirements: 7.2, 7.3_

  - [x] 21.3 Pindahkan canvas render loop dan mouse tracking ke HeroSection
    - Pindahkan `useEffect` untuk mouse/pointer event listeners (`mousemove`, `mouseleave`, `mouseenter`, `touchmove`)
    - Pindahkan `requestAnimationFrame` render loop: compute angle dari realMouse ke FACE_NORM, `lerpAngle` circular interpolation, deadzone 9%, frame index calculation, `ctx.clearRect` + `ctx.drawImage`
    - Pertahankan idle timer: reset ke neutral (center.webp) setelah 4500ms idle
    - Pertahankan magnetic aura cursor dengan spring factor 0.16
    - Verify tidak ada Ghost_Frame: canvas di-clear dengan `ctx.clearRect(0, 0, w, h)` setiap frame
    - _Requirements: 7.3, 7.4, 7.6_

  - [x] 21.4 Pindahkan preloader UI dan modal overlay ke HeroSection
    - Pindahkan loading bar JSX: `<div className="loader-overlay">` dengan progress bar dan teks progress
    - Pindahkan `activeModal` state dan modal JSX: overlay AnimatePresence, "Let's Talk" modal, "Resume" modal
    - Pertahankan AnimatePresence fade+scale animation identik untuk modal
    - _Requirements: 7.5, 15.5, 12.4_

  - [x] 21.5 Pindahkan hero section JSX dan cursor overlay ke HeroSection
    - Pindahkan seluruh hero section markup: `<section className="hero-section-wrapper">`, canvas element, cursor dot, aura element, CTA buttons
    - Pastikan `<h1>` ada tepat satu: heading dengan nama "Alaika" di hero section
    - Pertahankan `onClick` handlers untuk "Let's Talk" dan "Resume" buttons yang set `activeModal`
    - Pertahankan cursor visibility tracking (masuk/keluar viewport)
    - Export sebagai default export `HeroSection`
    - _Requirements: 6.3, 7.4, 7.5, 7.7_

  - [x] 21.6 Tulis unit tests untuk hero canvas constants
    - Verifikasi `DEFAULT_LERP_FACTOR === 0.32`, `INITIAL_LERP_FACTOR === 0.04`
    - Verifikasi `FACE_NORM_X === 0.50`, `FACE_NORM_Y === 0.38`
    - Verifikasi `TOTAL_FRAMES === 64`
    - Verifikasi `lerpAngle` function: output selalu dalam range (-π, π], circular interpolation benar
    - **Validates: Requirements 7.3**

- [x] 22. Checkpoint — verifikasi semua section components
  - Pastikan setiap file di `src/components/sections/` memiliki `"use client"` di baris pertama
  - Pastikan tidak ada import dari `framer-motion` — semua harus dari `motion/react`
  - Pastikan `FadeInUp` tersedia di semua section yang membutuhkannya
  - Tanya user jika ada pertanyaan sebelum lanjut ke Phase 4.

---

### Phase 4: "use client" pada ui/ Components

- [x] 23. Tambahkan `"use client"` directive pada `src/components/ui/resizable-navbar.jsx`
  - Baca file, verifikasi apakah sudah ada `"use client"` di baris pertama
  - Jika belum: tambahkan `"use client";` di baris pertama file
  - Verifikasi ada `<nav aria-label="Main navigation">` wrapper — tambahkan jika belum ada
  - _Requirements: 2.6, 6.5_

- [x] 24. Verifikasi `"use client"` pada `src/components/ui/id-card-lanyard.jsx`
  - Baca file dan verifikasi `"use client"` sudah ada di baris pertama
  - Verifikasi font loading via `useEffect` dengan `<link>` injection (Archivo, Work Sans, JetBrains Mono, Caveat) — bukan via `@import`
  - Jika `"use client"` belum ada, tambahkan di baris pertama
  - _Requirements: 2.6, 8.1, 8.4_

- [x] 25. Verifikasi `"use client"` pada `src/components/ui/contribution-skyline.tsx`
  - Baca file dan konfirmasi `"use client"` sudah ada di baris pertama (design doc menyatakan sudah ada)
  - Verifikasi tidak ada Server Component incompatible APIs yang muncul tanpa directive
  - _Requirements: 2.6, 9.1_

- [x] 26. Tambahkan `"use client"` pada `src/components/ui/stagger-testimonials.jsx`
  - Baca file, verifikasi apakah sudah ada `"use client"` di baris pertama
  - Tambahkan jika belum ada
  - _Requirements: 2.6_

- [x] 27. Tambahkan `"use client"` pada `src/components/ui/card-18.jsx`
  - Baca file, verifikasi apakah sudah ada `"use client"` di baris pertama
  - Tambahkan jika belum ada (dibutuhkan karena menggunakan `whileHover` dari motion)
  - _Requirements: 2.6_

- [x] 28. Verifikasi `"use client"` pada `src/components/ui/wave-path.jsx`
  - Baca file dan konfirmasi `"use client"` sudah ada (design doc menyatakan sudah ada)
  - Verifikasi ada `useEffect`, `useRef`, atau `window` usage yang membutuhkan directive
  - _Requirements: 2.6_

- [x] 29. Tambahkan `"use client"` pada `src/components/ui/projects-section.jsx`
  - Baca file, verifikasi apakah sudah ada `"use client"` di baris pertama
  - Tambahkan jika belum ada (menggunakan `motion.*` whileInView)
  - _Requirements: 2.6_

- [x] 30. Tambahkan `"use client"` pada `src/components/ui/repository-section.jsx`
  - Baca file, verifikasi apakah sudah ada `"use client"` di baris pertama
  - Tambahkan jika belum ada (menggunakan useState, useEffect, fetch)
  - _Requirements: 2.6, 9.2_

---

### Phase 5: Page Assembly

- [x] 31. Buat `src/app/page.tsx` dengan section assembly
  - [x] 31.1 Buat `src/app/page.tsx` dengan dynamic import untuk HeroSection
    - Import `dynamic` dari `next/dynamic`
    - Definisikan `HeroSection` via `dynamic(() => import('@/components/sections/HeroSection'), { ssr: false, loading: () => <div style={{ width: '100vw', height: '100vh', backgroundColor: '#e5e7e7' }} aria-hidden="true" /> })`
    - Placeholder `loading` HARUS memiliki `height: '100vh'` dan `backgroundColor: '#e5e7e7'` untuk CLS = 0
    - _Requirements: 14.4, 15.1_

  - [x] 31.2 Tambahkan dynamic import untuk IDCardLanyard di `AboutSection.jsx`
    - Di dalam `src/components/sections/AboutSection.jsx`, ganti import IDCardLanyard langsung dengan `dynamic` import
    - Set `ssr: false`, loading fallback: `<div style={{ position: 'sticky', top: '88px', height: '520px', borderRadius: '18px' }} aria-hidden="true" />`
    - Perhatikan named export: `dynamic(() => import('@/components/ui/id-card-lanyard').then(m => ({ default: m.IDCardLanyard })), ...)`
    - _Requirements: 14.4_

  - [x] 31.3 Tambahkan dynamic import untuk ContributionSkyline di `repository-section.jsx`
    - Di dalam `src/components/ui/repository-section.jsx`, ganti import ContributionSkyline langsung dengan `dynamic` import
    - Set `ssr: false`, loading fallback berupa div dengan `height: '400px'`
    - _Requirements: 14.4_

  - [x] 31.4 Assembly semua sections di `src/app/page.tsx`
    - Import static: `NavbarWrapper`, `AboutSection`, `ExperienceSection`, `ProjectsSection`, `RepositorySection`, `ArtikelSection`, `TestimonialSection`, `ContactSection`, `FooterSection`, `WavePath` dari `@/components/ui/wave-path`
    - Import dynamic: `HeroSection` (sudah dari step 31.1)
    - Struktur JSX: `NavbarWrapper` → `<main>` → HeroSection → AboutSection → ExperienceSection → WavePath (light) → ProjectsSection → RepositorySection → ArtikelSection → TestimonialSection → WavePath (dark) → ContactSection → `</main>` → FooterSection
    - Letakkan `WavePath` di posisi identik dengan App.jsx saat ini
    - _Requirements: 2.2, 15.3, 15.4_

  - [x] 31.5 Verifikasi semantic HTML di `page.tsx` dan semua section components
    - Pastikan `<main>` wraps semua konten di page.tsx (kecuali Navbar dan Footer)
    - Pastikan tepat satu `<h1>` per halaman (di HeroSection) — periksa semua section files
    - Pastikan setiap section menggunakan `<section id="...">` dengan id yang benar: `about`, `experience`, `project`, `repository`, `artikel`, `contact`, `testimonial`
    - Pastikan semua section headings menggunakan `<h2>`, sub-headings (card titles) menggunakan `<h3>`
    - Pastikan `<header>` wraps Navbar di `NavbarWrapper.jsx` dan `<footer>` wraps Footer di `FooterSection.jsx`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.8_

  - [x] 31.6 Tulis property test untuk Unique H1 Invariant
    - **Property 7: Unique H1 Invariant**
    - Render Page component (static render) dan query semua `h1` elements
    - Assert: `h1Elements.length === 1` dan `h1Elements[0].textContent` berisi "Alaika"
    - **Validates: Requirements 6.3**

- [x] 32. Checkpoint — verifikasi page assembly dan visual parity
  - Jalankan dev server dan bandingkan visual dengan Vite baseline side-by-side
  - Verifikasi urutan section identik: Hero → About → Experience → Projects → Repository → Artikel → Testimonial → Contact → Footer
  - Verifikasi WavePath muncul di posisi yang sama dengan App.jsx
  - Buka browser console — tidak boleh ada hydration error warnings
  - Tanya user jika ada pertanyaan sebelum lanjut ke Phase 6.

---

### Phase 6: Image Optimization

- [x] 33. Ganti img tag di `src/components/ui/id-card-lanyard.jsx`
  - Baca file untuk menemukan semua `<img>` tags
  - Ganti `<img src={photoUrl} ...>` dengan `<Image>` dari `next/image` menggunakan `fill` prop
  - Pastikan parent element memiliki `style={{ position: 'relative' }}` dan class/style yang mendefinisikan dimensi
  - Set `alt` yang deskriptif (minimal 5 karakter): `alt={\`${name} — profile photo\`}`
  - Tambahkan `import Image from 'next/image'` di bagian atas file
  - _Requirements: 10.1, 10.2, 10.4, 6.6_

- [x] 34. Ganti img tag di `src/components/ui/repository-section.jsx`
  - Baca file untuk menemukan GitHub avatar `<img>`
  - Ganti dengan `<Image>` dari `next/image` dengan `width={48}`, `height={48}`, `alt={\`${GITHUB_USERNAME} GitHub avatar\`}`
  - Tambahkan `import Image from 'next/image'`
  - _Requirements: 10.1, 10.2, 6.6_

- [x] 35. Ganti img tags di `src/components/ui/projects-section.jsx`
  - Baca file untuk menemukan semua project thumbnail `<img>` tags
  - Ganti dengan `<Image fill>` dari `next/image` karena menggunakan external Unsplash URLs dengan dimensi dinamis
  - Pastikan wrapper element memiliki `style={{ position: 'relative' }}` dan dimensi terdefinisi
  - Tambahkan `sizes` prop yang sesuai dengan ukuran tampilan gambar
  - _Requirements: 10.1, 10.2, 10.6_

- [x] 36. Ganti img tags di `src/components/ui/stagger-testimonials.jsx`
  - Baca file untuk menemukan testimonial photo `<img>` tags
  - Ganti dengan `<Image>` dari `next/image` dengan `width={48}`, `height={56}`, `style={{ objectFit: 'cover', objectPosition: 'top' }}`
  - Set `alt` dari `testimonial.by.split(',')[0]` — sudah minimal 5 karakter untuk nama yang valid
  - _Requirements: 10.1, 10.2, 6.6_

---

### Phase 7: Testing & Verification

- [x] 37. Setup Vitest untuk unit tests
  - Install Vitest dan testing utilities: `npm install -D vitest @testing-library/react jsdom @vitejs/plugin-react`
  - Buat `vitest.config.js` di root project dengan environment `jsdom`
  - Tambahkan script `"test": "vitest --run"` di `package.json`
  - Buat direktori `src/__tests__/` untuk test files
  - _Requirements: (testing infrastructure)_

- [x] 38. Tulis unit tests untuk sitemap dan robots
  - [x] 38.1 Buat `src/__tests__/sitemap.test.ts`
    - Test root URL hadir dengan priority 1.0
    - Test semua 6 section anchors hadir dengan priority 0.7 dan changeFrequency 'monthly'
    - Test tanpa `NEXT_PUBLIC_SITE_URL`: URL tidak mengandung 'undefined', menggunakan fallback 'alaika.dev'
    - _Requirements: 5.2, 5.3, 5.6_

  - [x] 38.2 Buat `src/__tests__/robots.test.ts`
    - Test `sitemap` field tidak mengandung 'undefined'
    - Test `sitemap` field berisi full URL dengan '/sitemap.xml'
    - Test `rules.userAgent === '*'` dan `rules.allow === '/'`
    - _Requirements: 5.4, 5.5_

- [x] 39. Setup dan implementasi property-based tests dengan fast-check
  - [x] 39.1 Install fast-check: `npm install -D fast-check`
    - Tambahkan ke devDependencies di package.json

  - [x] 39.2 Implementasi Property 4: Metadata Field Completeness
    - **Property 4: Metadata Field Completeness**
    - Import `metadata` dari `@/app/layout` dan verifikasi semua required fields hadir dengan nilai non-empty
    - Test paths: title.default, description, openGraph.title, openGraph.type, openGraph.locale, openGraph.siteName, twitter.card, robots.index, robots.follow, alternates.canonical
    - **Validates: Requirements 4.1–4.7**

  - [x] 39.3 Implementasi Property 6: Sitemap Section Coverage
    - **Property 6: Sitemap Section Coverage**
    - Gunakan `fc.constantFrom(...SECTION_ANCHORS)` sebagai arbitrary
    - Assert: untuk setiap anchor, sitemap() mengembalikan entry dengan url ending anchor itu, priority 0.7, changeFrequency 'monthly'
    - **Validates: Requirements 5.2, 5.3**

  - [x] 39.4 Implementasi Property 7: Unique H1 Invariant
    - **Property 7: Unique H1 Invariant**
    - Render `Page` component dengan `@testing-library/react`
    - Assert: tepat satu `<h1>` element, dan berisi teks "Alaika"
    - **Validates: Requirements 6.3**

- [x] 40. Setup Playwright dan implementasi e2e tests
  - [x] 40.1 Install Playwright: `npm install -D @playwright/test` dan `npx playwright install --with-deps chromium`
    - Buat `playwright.config.ts` di root project dengan baseURL `http://localhost:3000`
    - Tambahkan script `"test:e2e": "playwright test"` di `package.json`

  - [x] 40.2 Implementasi hydration error test (Property 10)
    - **Property 10: Hydration Mismatch Absence**
    - Collect semua console warnings/errors selama page load
    - Assert: tidak ada string yang match `"Text content did not match"`, `"Prop \`className\` did not match"`, `"Expected server HTML to contain"`
    - **Validates: Requirements 15.6**

  - [x] 40.3 Implementasi Dancing Script font verification test (Property 11)
    - **Property 11: Dancing Script Font Application**
    - Navigate ke `/` dan wait for `networkidle`
    - Evaluate computed `font-family` pada `.name-heading`, `.about-title em`, `.footer-logo`
    - Assert: computed font-family mengandung string "Dancing Script"
    - **Validates: Requirements 15.7, 3.5**

- [x] 41. Verifikasi build produksi
  - Jalankan `next build` dan pastikan exit code 0 tanpa output level error
  - Jalankan `next start` dan buka `http://localhost:3000` di browser
  - Verifikasi tidak ada console errors atau hydration warnings di browser
  - Verifikasi request ke `/sitemap.xml` mengembalikan XML yang valid
  - Verifikasi request ke `/robots.txt` mengembalikan robots rules yang benar
  - _Requirements: 1.6, 14.5_

- [x] 42. Verifikasi Core Web Vitals dengan Lighthouse
  - Jalankan Lighthouse audit di `http://localhost:3000` dengan mode "Mobile" dan throttling "Slow 4G"
  - Verifikasi LCP ≤ 2500ms
  - Verifikasi CLS < 0.1
  - Verifikasi INP ≤ 200ms
  - Dokumentasikan hasil di comments atau test report
  - _Requirements: 14.1, 14.2, 14.3_

- [x] 43. Final Checkpoint — migrasi selesai
  - Verifikasi semua requirements tercakup: Req 1–15
  - Verifikasi tidak ada preconnect link ke fonts.googleapis.com di rendered HTML
  - Verifikasi Google Fonts CDN tidak di-load di network tab (kecuali lazy IDCardLanyard fonts di useEffect)
  - Verifikasi visual parity: bandingkan screenshot key sections dengan Vite baseline
  - Tanya user jika ada pertanyaan atau penyesuaian yang diperlukan.

---

## Notes

- Task bertanda `*` adalah optional dan dapat di-skip untuk MVP yang lebih cepat
- Setiap task merujuk requirement spesifik untuk traceability
- Checkpoint tasks (6, 10, 22, 32, 43) memastikan validasi incremental
- Property tests memvalidasi correctness properties dari design document
- HeroSection (task 21) adalah task paling kompleks — punya 6 sub-tasks karena mencakup canvas render loop, physics tracking, dan modal overlay
- Canvas frames di `public/frames/` dan `center.webp` TIDAK perlu dioptimasi via next/image — diload via `new Image()` di Canvas API
- `src/index.css` bersifat read-only selama seluruh migrasi — tidak ada modifikasi apapun

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2", "3", "4", "5"] },
    { "id": 1, "tasks": ["7.1", "7.2", "7.3", "8.1", "9"] },
    { "id": 2, "tasks": ["7.4", "7.5", "8.2"] },
    { "id": 3, "tasks": ["17", "23", "24", "25", "26", "27", "28", "29", "30"] },
    { "id": 4, "tasks": ["11", "12", "13", "14", "15", "16", "18", "19", "20"] },
    { "id": 5, "tasks": ["21.1", "21.2"] },
    { "id": 6, "tasks": ["21.3", "21.4"] },
    { "id": 7, "tasks": ["21.5", "21.6"] },
    { "id": 8, "tasks": ["31.1", "31.2", "31.3"] },
    { "id": 9, "tasks": ["31.4"] },
    { "id": 10, "tasks": ["31.5", "31.6"] },
    { "id": 11, "tasks": ["33", "34", "35", "36"] },
    { "id": 12, "tasks": ["37", "39.1", "40.1"] },
    { "id": 13, "tasks": ["38.1", "38.2"] },
    { "id": 14, "tasks": ["39.2", "39.3", "39.4", "40.2", "40.3"] },
    { "id": 15, "tasks": ["41"] },
    { "id": 16, "tasks": ["42"] }
  ]
}
```
