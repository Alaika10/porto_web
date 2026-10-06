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
    default: 'Alaika — Data Scientist & AI Practitioner',
    template: '%s | Alaika',
  },
  description:
    'Data Scientist and AI practitioner specializing in machine learning, generative AI, and applied analytics. Informatics student at Universitas Bhamada Slawi, based in Tegal, Indonesia.',
  openGraph: {
    title: 'Alaika — Data Scientist & AI Practitioner',
    description:
      'Data Scientist and AI practitioner specializing in machine learning, generative AI, and applied analytics. Informatics student at Universitas Bhamada Slawi, based in Tegal, Indonesia.',
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Alaika',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alaika — Data Scientist & AI Practitioner',
    description:
      'Data Scientist and AI practitioner specializing in machine learning, generative AI, and applied analytics. Informatics student at Universitas Bhamada Slawi, based in Tegal, Indonesia.',
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
  jobTitle: 'Data Scientist & AI Practitioner',
  url: SITE_URL,
  sameAs: [
    'https://github.com/Alaika10',
    'https://www.linkedin.com/in/alaika',
  ],
  knowsAbout: [
    'Python',
    'Machine Learning',
    'Data Science',
    'Generative AI',
    'Pandas',
    'Scikit-learn',
    'SQL',
    'Computer Vision',
    'Jupyter',
    'Next.js',
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
    'Data Scientist and AI practitioner specializing in machine learning, generative AI, and applied analytics. Based in Tegal, Indonesia.',
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
