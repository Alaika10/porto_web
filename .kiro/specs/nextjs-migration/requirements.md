# Requirements Document

## Introduction

Migrasi portfolio website Alaika dari arsitektur Vite + React 18 SPA ke Next.js 15 App Router. Portfolio ini adalah single-page website milik Alaika (Full Stack Developer) yang menampilkan karakter interaktif berbasis Canvas 60fps, physics rope simulation, isometric 3D contribution heatmap, dan berbagai animasi berbasis Framer Motion.

Migrasi ini mencakup empat tujuan utama: (1) meningkatkan SEO melalui server-side metadata, structured data, dan crawlability; (2) menjaga visual parity 100% — tidak ada perubahan tampilan, warna, layout, maupun animasi dari baseline; (3) memodularisasi monolith App.jsx menjadi komponen per-section yang terpisah dan dapat di-maintain; (4) meningkatkan Core Web Vitals melalui font optimization, image optimization, dan code splitting.

Semua komponen yang menggunakan Browser APIs (Canvas, pointer events, physics simulation, IntersectionObserver) harus tetap berjalan sebagai Client Components dengan `"use client"` directive. Komponen yang tidak memerlukan interaktivitas browser dapat dirender di server.

## Glossary

- **App Router**: Sistem routing Next.js 15 berbasis file system di dalam direktori `app/`, mendukung React Server Components secara default.
- **RSC**: React Server Component — komponen yang dirender di server, tidak memiliki akses ke browser APIs atau React hooks yang bergantung pada state/effect.
- **Client Component**: Komponen React yang dirender di browser, dideklarasikan dengan `"use client"` directive, memiliki akses penuh ke browser APIs.
- **Visual Parity**: Kondisi di mana tampilan, warna, layout, spacing, animasi, dan interaktivitas identik antara implementasi lama dan baru secara pixel-level.
- **Hero Canvas**: Komponen canvas yang memuat dan merender 64 frame WebP untuk efek gaze tracking 60fps berdasarkan posisi kursor.
- **IDCardLanyard**: Komponen canvas physics simulation yang mensimulasikan tali lanyard dengan rigid body ID card yang dapat di-drag dan di-flip.
- **ContributionSkyline**: Komponen canvas isometric 3D heatmap kontribusi GitHub (`contribution-skyline.tsx`) yang sudah memiliki `"use client"` directive.
- **Metadata API**: Next.js API untuk mendefinisikan `<head>` tags (title, description, Open Graph, JSON-LD) per halaman atau layout menggunakan `export const metadata` atau `generateMetadata()`.
- **next/font**: Modul Next.js untuk self-hosting font dari Google Fonts atau font lokal dengan zero layout shift.
- **next/image**: Komponen `<Image>` dari Next.js yang secara otomatis mengoptimalkan format, ukuran, dan lazy loading gambar.
- **LCP**: Largest Contentful Paint — metrik Core Web Vitals yang mengukur waktu render elemen terbesar di viewport.
- **CLS**: Cumulative Layout Shift — metrik Core Web Vitals yang mengukur pergeseran layout yang tidak diharapkan.
- **JSON-LD**: JavaScript Object Notation for Linked Data — format structured data yang diembedkan di `<script type="application/ld+json">` untuk mesin pencari.
- **Open Graph**: Protokol metadata untuk kontrol tampilan ketika URL dibagikan di media sosial (og:title, og:image, dll.).
- **E-E-A-T**: Experience, Expertise, Authoritativeness, Trustworthiness — sinyal kualitas konten yang dinilai oleh mesin pencari.
- **Sitemap**: File `sitemap.xml` yang mendaftarkan semua URL di website untuk di-crawl mesin pencari.
- **Section_Anchor**: ID HTML pada setiap `<section>` yang digunakan untuk navigasi smooth-scroll (contoh: `#about`, `#project`, `#experience`).
- **Monolith**: App.jsx saat ini yang berisi semua section (~700+ baris) dalam satu file.
- **App_Shell**: Layout wrapper di Next.js yang membungkus seluruh halaman, termasuk Navbar dan font injection.
- **Path_Alias**: Konfigurasi `@/` yang memetakan ke direktori `src/` sehingga import path tetap konsisten.
- **Ghost_Frame**: Artefak visual alpha ghosting yang terjadi jika canvas tidak di-clear dengan benar saat merender frame WebP.

---

## Requirements

### Requirement 1: Setup Proyek Next.js

**User Story:** Sebagai developer, saya ingin menginisialisasi proyek Next.js 15 dengan konfigurasi yang kompatibel dengan codebase yang ada, sehingga proses migrasi dapat dimulai dari fondasi yang bersih.

#### Acceptance Criteria

1. THE Next_Project SHALL menggunakan Next.js 15 dengan App Router sebagai sistem routing utama.
2. THE Next_Project SHALL mengkonfigurasi TypeScript dengan opsi `strict: false` untuk mempertahankan kompatibilitas dengan komponen JSX yang ada.
3. THE Next_Project SHALL mengkonfigurasi Path_Alias `@/` yang memetakan ke direktori `src/` melalui `tsconfig.json` atau `jsconfig.json` dan `next.config.js`.
4. THE Next_Project SHALL mempertahankan Tailwind CSS v3 dengan konfigurasi `tailwind.config.js` yang identik dengan konfigurasi saat ini, dengan memperluas `content` paths untuk mencakup direktori Next.js (`./src/app/**/*.{js,ts,jsx,tsx}`) selain paths yang sudah ada.
5. THE Next_Project SHALL mempertahankan `src/index.css` secara utuh — termasuk semua CSS custom properties (`:root` variables), `@tailwind` directives, `@keyframes` definitions, media queries, dan semua rule blocks — tanpa penghapusan atau modifikasi apapun.
6. WHEN membangun proyek, THE Next_Project SHALL berhasil menyelesaikan `next build` dengan exit code 0 dan tanpa output level error di stdout atau stderr.

---

### Requirement 2: Struktur File dan Komponen Per-Section

**User Story:** Sebagai developer, saya ingin memecah monolith `App.jsx` menjadi komponen-komponen terpisah per section, sehingga codebase lebih mudah di-navigate, di-maintain, dan di-test secara independen.

#### Acceptance Criteria

1. THE App_Shell SHALL menempatkan layout wrapper di `src/app/layout.tsx` (atau `.jsx`) yang berisi injeksi font, global CSS import, dan tag HTML root.
2. THE App_Shell SHALL menempatkan halaman utama di `src/app/page.tsx` (atau `.jsx`) yang merakit semua section dalam urutan eksplisit berikut: HeroSection → AboutSection → ExperienceSection → ProjectsSection → RepositorySection → ArtikelSection → TestimonialSection → ContactSection → FooterSection — identik dengan urutan di `App.jsx` saat ini.
3. THE Component_System SHALL memisahkan setiap section menjadi file komponen tersendiri di `src/components/sections/`:
   - `HeroSection.jsx` — canvas gaze tracking, preloader
   - `AboutSection.jsx` — bio, meta tags, stats row, skills grid
   - `ExperienceSection.jsx` — experience card grid
   - `ProjectsSection.jsx` — re-export wrapper dari `src/components/ui/projects-section.jsx` (bukan duplikat atau file yang dipindahkan)
   - `RepositorySection.jsx` — re-export wrapper dari `src/components/ui/repository-section.jsx` yang juga mengintegrasikan ContributionSkyline
   - `TestimonialSection.jsx` — StaggerTestimonials wrapper
   - `ArtikelSection.jsx` — BlogPostCard featured + grid
   - `ContactSection.jsx` — contact form
   - `FooterSection.jsx` — footer navigation dan social links
4. THE Component_System SHALL mempertahankan semua komponen di `src/components/ui/` (resizable-navbar, id-card-lanyard, contribution-skyline, dll.) di lokasi yang sama tanpa memindahkan file.
5. IF komponen menggunakan `useState`, `useEffect`, `useRef`, Canvas API, atau pointer events, THEN THE Component_System SHALL menambahkan `"use client"` directive di baris pertama file tersebut.
6. THE Component_System SHALL menambahkan `"use client"` directive pada file-file berikut secara eksplisit:
   - Di `src/components/sections/`: `HeroSection.jsx`, `AboutSection.jsx`, `ExperienceSection.jsx`, `ArtikelSection.jsx`, `TestimonialSection.jsx`, `ContactSection.jsx`, `FooterSection.jsx`
   - Di `src/components/ui/`: `resizable-navbar.jsx`, `id-card-lanyard.jsx`, `contribution-skyline.tsx`, `stagger-testimonials.jsx`, `card-18.jsx` (jika menggunakan state), `wave-path.jsx` (jika menggunakan refs)

---

### Requirement 3: Font Optimization dengan next/font

**User Story:** Sebagai developer, saya ingin mengganti link Google Fonts di `<head>` dengan `next/font/google`, sehingga font di-host secara self-contained dan tidak menyebabkan layout shift.

#### Acceptance Criteria

1. THE Font_System SHALL mengimpor `Plus_Jakarta_Sans` dan `Dancing_Script` menggunakan `next/font/google` di `src/app/layout.tsx`.
2. THE Font_System SHALL mendefinisikan `Plus_Jakarta_Sans` dengan weight `['300', '400', '500', '600', '700']`, `subsets: ['latin']`, dan `display: 'swap'` untuk mencegah FOIT (Flash of Invisible Text).
3. THE Font_System SHALL mendefinisikan `Dancing_Script` dengan weight `['500', '600', '700']`, `subsets: ['latin']`, dan `display: 'swap'` untuk mencegah FOIT.
4. THE Font_System SHALL mengaplikasikan CSS variable font — `variable: '--font-jakarta'` untuk Plus Jakarta Sans (digunakan sebagai font body) dan `variable: '--font-dancing'` untuk Dancing Script (digunakan untuk elemen dekoratif) — sehingga dapat direferensikan di CSS custom properties tanpa perubahan pada rule CSS yang ada.
5. WHEN halaman dirender, THE Font_System SHALL memastikan tidak ada perubahan font-family yang terlihat dibandingkan implementasi Vite pada elemen-elemen berikut: semua elemen `body`, `.name-heading`, `.about-title em`, `.footer-logo`, dan brand text pada IDCardLanyard — Plus Jakarta Sans tetap sebagai font body, Dancing Script tetap untuk elemen dekoratif.
6. IF tag `<link rel="preconnect" href="https://fonts.googleapis.com">` atau `<link rel="preconnect" href="https://fonts.gstatic.com">` ditemukan di rendered HTML, THEN itu merupakan regression yang harus diperbaiki karena semua font seharusnya sudah di-host melalui next/font.
7. WHEN konfigurasi next/font mengandung font name yang tidak valid, THE Font_System SHALL menghasilkan error saat build time yang mendeskripsikan font yang tidak ditemukan, bukan silent fallback ke system font.

---

### Requirement 4: Metadata, Open Graph, dan JSON-LD

**User Story:** Sebagai developer, saya ingin menambahkan metadata lengkap pada halaman portfolio, sehingga mesin pencari dapat memahami konten halaman dan tampilan preview di media sosial menjadi optimal.

#### Acceptance Criteria

1. WHEN `src/app/layout.tsx` diinisialisasi, THE Metadata_System SHALL mengekspor objek `metadata` yang valid menggunakan Next.js Metadata API.
2. THE Metadata_System SHALL mengatur `title` dengan template `{ default: 'Alaika — Full Stack Developer & Creative Technologist', template: '%s | Alaika' }`.
3. THE Metadata_System SHALL mengatur `description` dengan nilai: `'Full Stack Engineer specializing in high-performance web systems, interactive canvas architectures, and luxury digital design. Based in Indonesia.'`
4. THE Metadata_System SHALL mengatur `openGraph` dengan properti: `title` (identik dengan default title), `description` (identik dengan root description), `type: 'website'`, `locale: 'en_US'`, `url` (canonical), dan `siteName: 'Alaika'`.
5. THE Metadata_System SHALL mengatur `twitter` card dengan `card: 'summary_large_image'`, `title`, dan `description`.
6. THE Metadata_System SHALL mengatur `robots: { index: true, follow: true }` dan `metadataBase` dengan URL produksi.
7. THE Metadata_System SHALL menyertakan `alternates: { canonical: '/' }` untuk mencegah duplicate content.
8. WHEN halaman dirender, THE JSON_LD_System SHALL menyertakan `<script type="application/ld+json">` di dalam `src/app/layout.tsx` dengan schema `Person` yang mencakup: `name: 'Alaika'`, `jobTitle: 'Full Stack Developer'`, `url`, `sameAs` (GitHub, LinkedIn), `knowsAbout` (array antara 5–15 item teknologi), dan `address.addressCountry: 'ID'`.
9. WHEN halaman dirender, THE JSON_LD_System SHALL menyertakan schema `WebSite` yang mencakup: `name: 'Alaika'`, `url`, dan `description`.
10. IF environment variable `NEXT_PUBLIC_SITE_URL` tidak dikonfigurasi saat build, THEN THE Metadata_System SHALL menggunakan fallback URL `https://alaika.dev` sehingga `metadataBase` tidak pernah undefined.

---

### Requirement 5: Sitemap dan robots.txt

**User Story:** Sebagai developer, saya ingin menghasilkan sitemap.xml dan robots.txt secara otomatis, sehingga mesin pencari dapat men-crawl dan mengindeks halaman dengan benar.

#### Acceptance Criteria

1. THE Sitemap_System SHALL membuat file `src/app/sitemap.ts` (atau `.js`) yang menggunakan Next.js Sitemap API (`MetadataRoute.Sitemap`).
2. THE Sitemap_System SHALL mendaftarkan URL untuk halaman utama (`/`) dengan `priority: 1.0`, `changeFrequency: 'monthly'`, dan `lastModified: new Date()`.
3. THE Sitemap_System SHALL mendaftarkan URL untuk setiap anchor section (`/#about`, `/#experience`, `/#project`, `/#repository`, `/#artikel`, `/#contact`) dengan `priority: 0.7` dan `changeFrequency: 'monthly'`.
4. THE Robots_System SHALL membuat file `src/app/robots.ts` (atau `.js`) yang menggunakan Next.js Robots API (`MetadataRoute.Robots`).
5. THE Robots_System SHALL mengkonfigurasi `rules: { userAgent: '*', allow: '/' }` dan field `sitemap` yang menunjuk ke absolute URL sitemap produksi (contoh: `https://alaika.dev/sitemap.xml`).
6. IF environment variable `NEXT_PUBLIC_SITE_URL` tidak dikonfigurasi, THEN THE Sitemap_System SHALL menggunakan fallback `https://alaika.dev` sehingga generated sitemap URL tidak pernah mengandung `undefined` atau `localhost`.

---

### Requirement 6: Semantic HTML dan Struktur Konten

**User Story:** Sebagai developer, saya ingin memastikan markup HTML menggunakan elemen semantik yang tepat, sehingga mesin pencari dan screen reader dapat memahami struktur konten halaman.

#### Acceptance Criteria

1. THE Semantic_HTML SHALL menggunakan elemen `<main>` sebagai wrapper untuk seluruh konten halaman di `src/app/page.tsx`.
2. THE Semantic_HTML SHALL memastikan setiap section menggunakan elemen `<section>` dengan atribut `id` yang identik dengan nilai Section_Anchor yang ada (`about`, `experience`, `project`, `repository`, `artikel`, `contact`).
3. THE Semantic_HTML SHALL memastikan terdapat tepat satu elemen `<h1>` per halaman — yaitu nama "Alaika" di hero section.
4. THE Semantic_HTML SHALL memastikan semua heading di section lain (semua section kecuali Hero) menggunakan `<h2>`, dan sub-heading — yaitu heading elements langsung di dalam content blocks section seperti cards dan list items — menggunakan `<h3>`.
5. THE Semantic_HTML SHALL memastikan elemen navigasi utama menggunakan elemen `<nav>` dengan `aria-label="Main navigation"`.
6. THE Semantic_HTML SHALL memastikan semua gambar dekoratif (canvas-rendered atau elemen UI non-informational) memiliki `alt=""`, dan gambar konten (foto profil, project screenshots) memiliki alt text minimal 5 karakter yang mendeskripsikan subjek dan tujuan gambar tersebut.
7. WHEN halaman dirender di server, THE Semantic_HTML SHALL menghasilkan HTML yang lulus validasi W3C Nu HTML Checker tanpa error (warning diperbolehkan).
8. THE Semantic_HTML SHALL menggunakan elemen `<header>` sebagai wrapper untuk Navbar dan elemen `<footer>` sebagai wrapper untuk Footer, sehingga landmarks dapat diidentifikasi oleh screen reader.

---

### Requirement 7: Hero Section — Canvas Gaze Tracking

**User Story:** Sebagai pengunjung, saya ingin melihat karakter interaktif yang mengikuti gerakan kursor saya persis seperti versi Vite, sehingga pengalaman pertama yang membedakan portfolio ini tetap terjaga.

#### Acceptance Criteria

1. THE Hero_Canvas SHALL didefinisikan sebagai Client Component dengan `"use client"` directive.
2. THE Hero_Canvas SHALL mempertahankan logika preloading 64 frame WebP dari `/frames/frame_00.webp` hingga `/frames/frame_63.webp` ditambah `center.webp`.
3. THE Hero_Canvas SHALL mempertahankan logika render loop: `DEFAULT_LERP_FACTOR = 0.32`, `INITIAL_LERP_FACTOR = 0.04`, `FACE_NORM_X = 0.50`, `FACE_NORM_Y = 0.38`, deadzone 9%, `lerpAngle` circular interpolation, cinematic ease-in 2500ms.
4. THE Hero_Canvas SHALL mempertahankan behavior: karakter melihat ke arah kursor, kembali ke pose neutral (center.webp) ketika kursor di luar viewport atau idle lebih dari 4500ms, dan Ghost_Frame tidak muncul.
5. THE Hero_Canvas SHALL mempertahankan preloader dengan loading bar dan teks progress yang identik secara visual.
6. THE Hero_Canvas SHALL mempertahankan magnetic trailing aura cursor dengan spring animation (factor `0.16`).
7. WHEN Hero_Canvas dirender di server, THE Hero_Canvas SHALL menghasilkan HTML shell tanpa error hydration — canvas element kosong diterima sebagai valid.

---

### Requirement 8: IDCardLanyard — Physics Client Component

**User Story:** Sebagai pengunjung, saya ingin berinteraksi dengan ID card yang dapat di-drag dengan simulasi fisika tali yang realistis, persis seperti versi Vite.

#### Acceptance Criteria

1. THE IDCardLanyard SHALL didefinisikan sebagai Client Component dengan `"use client"` directive di `src/components/ui/id-card-lanyard.jsx`.
2. THE IDCardLanyard SHALL mempertahankan semua parameter fisika yang ada: `NUM_POINTS = 16`, `REST_LENGTH = 220`, `GRAVITY = 0.42`, `FRICTION = 0.985`, `CONSTRAINT_ITERATIONS = 8`.
3. THE IDCardLanyard SHALL mempertahankan interaktivitas: drag untuk mengayun, tap/click untuk flip ke sisi belakang, hover sheen effect.
4. WHEN IDCardLanyard dirender pertama kali, THE IDCardLanyard SHALL memuat Google Fonts (`Archivo`, `Work Sans`, `JetBrains Mono`, `Caveat`) secara lazy melalui injeksi `<link>` element di dalam `useEffect` — BUKAN melalui `@import` di CSS level yang dapat memblokir rendering.
5. IF terjadi resize pada container parent, THEN THE IDCardLanyard SHALL menyesuaikan dimensi canvas dan posisi rope anchor tanpa artefak visual melalui `ResizeObserver`.

---

### Requirement 9: ContributionSkyline — Canvas Isometric Client Component

**User Story:** Sebagai pengunjung, saya ingin melihat visualisasi aktivitas GitHub Alaika dalam bentuk 3D skyline yang interaktif, dengan data live dari GitHub API.

#### Acceptance Criteria

1. THE ContributionSkyline SHALL dipertahankan sebagai Client Component — directive `"use client"` di baris pertama `src/components/ui/contribution-skyline.tsx` harus tidak berubah.
2. THE RepositorySection SHALL melakukan fetch data kontribusi GitHub di dalam `useEffect` pada sisi client (bukan server-side `fetch` di RSC), karena endpoint `github-contributions-api.jogruber.de` memerlukan runtime browser context untuk fallback graceful.
3. WHEN data GitHub berhasil di-fetch, THE ContributionSkyline SHALL merender data aktual dari `github-contributions-api.jogruber.de/v4/Alaika10?y=last`.
4. IF fetch gagal atau timeout, THEN THE ContributionSkyline SHALL merender data generated (seeded) sebagai fallback tanpa error yang terlihat pengguna.
5. THE ContributionSkyline SHALL mempertahankan fitur: 2D/3D toggle, drag-to-orbit, palette switching, tooltip per cell, legend highlighting, stats overlay, keyboard navigation.

---

### Requirement 10: Image Optimization dengan next/image

**User Story:** Sebagai developer, saya ingin mengoptimalkan gambar yang ada menggunakan `next/image`, sehingga LCP meningkat dan bandwidth berkurang tanpa mengubah tampilan visual.

#### Acceptance Criteria

1. THE Image_Optimization SHALL mengganti semua tag `<img>` yang merender gambar statis dari direktori `public/` dengan komponen `<Image>` dari `next/image`.
2. THE Image_Optimization SHALL memberikan props `width`, `height`, dan `alt` yang akurat pada setiap komponen `<Image>`.
3. WHERE gambar adalah elemen hero atau above-the-fold, THE Image_Optimization SHALL menambahkan prop `priority` untuk memicu preload dan meningkatkan LCP.
4. WHERE gambar adalah below-the-fold (thumbnail project, foto profil IDCard), THE Image_Optimization SHALL mempertahankan `loading="lazy"` (default pada `<Image>`).
5. THE Image_Optimization SHALL mengkonfigurasi `next.config.js` dengan `images.remotePatterns` yang mencakup: `images.unsplash.com`, `avatars.githubusercontent.com`, dan `fonts.gstatic.com`.
6. WHERE komponen menggunakan external URL dari Unsplash (project thumbnails di `ProjectsSection`) dengan dimensi dinamis, THE Image_Optimization SHALL menggunakan `fill` prop dengan wrapper `relative` agar layout tidak berubah.

---

### Requirement 11: Navbar dan Smooth Scroll Navigation

**User Story:** Sebagai pengunjung, saya ingin menggunakan navbar untuk berpindah antar section dengan smooth scroll yang identik dengan versi Vite.

#### Acceptance Criteria

1. THE Navbar SHALL dipertahankan sebagai Client Component karena menggunakan `useScroll`, `useSpring`, pointer events, dan state untuk mobile menu.
2. THE Navbar SHALL mempertahankan perilaku scroll-triggered: frosted glass effect muncul setelah scroll melewati ambang batas yang sama dengan implementasi saat ini.
3. THE Navbar SHALL mempertahankan dropdown "About" dengan sub-item "About" dan "Experience" yang berfungsi identik.
4. WHEN pengguna mengklik item navigasi, THE Navbar SHALL memanggil `scrollIntoView({ behavior: 'smooth' })` pada Section_Anchor yang sesuai — bukan menggunakan Next.js `<Link>` karena tidak ada perubahan halaman.
5. THE Navbar SHALL mempertahankan tampilan mobile menu yang identik termasuk item "↳ Experience" sebagai sub-item.

---

### Requirement 12: Animasi Framer Motion

**User Story:** Sebagai pengunjung, saya ingin melihat animasi fade-in dan scroll-triggered yang identik dengan versi Vite di semua section.

#### Acceptance Criteria

1. THE Animation_System SHALL mempertahankan dependency `motion` (dari package `motion`) — BUKAN `framer-motion` untuk motion components, karena codebase saat ini menggunakan `import { motion } from 'motion/react'`.
2. THE Animation_System SHALL mempertahankan komponen `FadeInUp` dengan konfigurasi identik: `initial={{ opacity: 0, y: 40 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: '-80px' }}`, `transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}`.
3. WHEN komponen menggunakan `motion.*` elements, THE Animation_System SHALL memastikan file tersebut adalah Client Component.
4. THE Animation_System SHALL mempertahankan `AnimatePresence` untuk modal overlay dan dropdown navbar dengan durasi dan easing yang identik.
5. THE Animation_System SHALL mempertahankan `useScroll` dan `useSpring` di Navbar untuk scroll-triggered style changes.

---

### Requirement 13: Contact Form

**User Story:** Sebagai pengunjung, saya ingin mengirim pesan melalui form kontak yang berfungsi sama seperti sebelumnya.

#### Acceptance Criteria

1. THE Contact_Form SHALL dipertahankan sebagai Client Component karena menggunakan `useState` untuk form state dan sent state.
2. THE Contact_Form SHALL mempertahankan behavior simulated send: setelah submit, tombol berubah menjadi state "Message sent!" dengan warna hijau selama 4000ms, kemudian kembali ke state semula.
3. THE Contact_Form SHALL mempertahankan validasi HTML5 native (`required` attribute) pada semua field.
4. WHEN fitur server action tersedia di Next.js, THE Contact_Form SHALL TETAP menggunakan client-side handler (`handleSubmit` dengan `e.preventDefault()`) — integrasi server action berada di luar scope migrasi ini.

---

### Requirement 14: Performance — Core Web Vitals

**User Story:** Sebagai developer, saya ingin memastikan migrasi ke Next.js menghasilkan peningkatan atau minimal mempertahankan skor Core Web Vitals dibandingkan implementasi Vite.

#### Acceptance Criteria

1. WHEN halaman diukur menggunakan Lighthouse dalam mode "Slow 4G" (bandwidth 1.6 Mbps, RTT 150ms, CPU slowdown 4x), THE Performance_System SHALL mencapai LCP tidak melebihi 2500ms.
2. THE Performance_System SHALL mencapai CLS di bawah 0.1 dengan memastikan semua font dimuat melalui next/font (zero layout shift) dan semua elemen `<Image>` memiliki dimensi eksplisit — diukur menggunakan Lighthouse atau Web Vitals library setelah full page load.
3. WHEN halaman diukur menggunakan Lighthouse dalam mode "Slow 4G" (bandwidth 1.6 Mbps, RTT 150ms, CPU slowdown 4x), THE Performance_System SHALL mencapai INP tidak melebihi 200ms.
4. WHERE komponen berat menggunakan dynamic import (`next/dynamic`), THE Performance_System SHALL menyediakan `loading` fallback berupa placeholder yang memiliki tinggi minimum sama dengan tinggi elemen final yang akan di-render, sehingga CLS dari komponen tersebut bernilai 0.
5. THE Performance_System SHALL menghasilkan bundle JavaScript halaman utama yang dapat di-parse dan dieksekusi oleh browser tanpa error pada mode produksi.

> **Note (Implementation Approach):** Penggunaan `next/dynamic` dengan `{ ssr: false }` adalah pendekatan implementasi yang direkomendasikan untuk komponen canvas berat (`HeroSection`, `IDCardLanyard`, `ContributionSkyline`) agar server tidak mencoba merender browser-only APIs. Detail ini didokumentasikan di design document, bukan sebagai requirement.

---

### Requirement 15: Visual Parity dan Non-Regression

**User Story:** Sebagai developer, saya ingin memastikan migrasi tidak mengubah tampilan apapun dibandingkan implementasi Vite, sehingga pengunjung tidak merasakan perbedaan apapun.

#### Acceptance Criteria

1. THE Visual_Parity SHALL mempertahankan background color `#e5e7e7` (CSS variable `--bg-color`) sebagai warna dasar halaman dan canvas background.
2. THE Visual_Parity SHALL mempertahankan semua CSS custom property yang didefinisikan di `:root` dalam `src/index.css` tanpa modifikasi.
3. THE Visual_Parity SHALL mempertahankan urutan section yang identik: Hero → About → Experience → Projects → Repository → Artikel → Testimonial → Contact → Footer.
4. THE Visual_Parity SHALL mempertahankan wave divider (`WavePath`) di antara section yang sama dengan implementasi Vite saat ini — yaitu antara Hero→About dan di antara section-section lain sesuai posisi yang ada di `App.jsx`.
5. WHEN pengguna mengklik tombol "Let's Talk" atau link "Resume", THE Visual_Parity SHALL menampilkan modal overlay dengan animasi fade+scale yang identik dengan implementasi Vite saat ini.
6. WHEN halaman dirender di browser, THE Visual_Parity SHALL tidak menampilkan hydration error `Warning: Text content did not match` atau `Warning: Prop \`className\` did not match` di browser console, karena error tersebut dapat menyebabkan flash of incorrect content (FOIC).
7. THE Visual_Parity SHALL mempertahankan Dancing Script font pada elemen: `.name-heading` (hero), `.about-title em` (italic cursive), `.footer-logo`, dan brand pada IDCardLanyard — diverifikasi melalui pemeriksaan computed style `font-family` DAN `font-weight` pada elemen-elemen tersebut.
