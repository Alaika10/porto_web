import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Dancing_Script } from 'next/font/google';
import '@/index.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

const dancingScript = Dancing_Script({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing',
});

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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alaika',
  jobTitle: 'Full Stack Developer',
  url: SITE_URL,
  sameAs: [
    'https://github.com/Alaika10',
    'https://www.linkedin.com/in/alaika',
  ],
  knowsAbout: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Canvas API',
    'WebGL',
    'Framer Motion',
    'Python',
    'PostgreSQL',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dancingScript.variable}`}>
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
      <body>{children}</body>
    </html>
  );
}
