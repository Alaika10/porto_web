import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaika.dev';

const SECTION_ANCHORS = [
  '#about',
  '#experience',
  '#project',
  '#repository',
  '#artikel',
  '#contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const root: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1.0,
  };

  const sections: MetadataRoute.Sitemap = SECTION_ANCHORS.map((anchor) => ({
    url: `${SITE_URL}/${anchor}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [root, ...sections];
}
