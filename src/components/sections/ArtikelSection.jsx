'use client';
"use client";

import { motion } from 'motion/react';
import { BlogPostCard } from '@/components/ui/card-18';
import { FadeInUp } from '@/components/ui/fade-in-up';

const featuredPost = {
  tag: 'Machine Learning',
  date: 'JUL 2026',
  title: 'From Notebook to Decision: Evaluating Classification Models Honestly',
  description:
    'A practical walkthrough of train/test splits, metrics that actually matter, and how I evaluate logistic regression pipelines on real healthcare-style datasets.',
  href: '#',
  imageUrl:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
};

const artikelPosts = [
  {
    tag: 'Data Science',
    date: 'JUN 2026',
    title: 'Reading Beijing Air Quality: EDA That Tells a Story',
    description:
      'How exploratory analysis, cleaning, and visualization turn a dense environmental dataset into patterns you can actually explain.',
    href: '#',
  },
  {
    tag: 'Generative AI',
    date: 'MAY 2026',
    title: 'Applied GenAI for Small Business Workflows',
    description:
      'Lessons from building AI around receipts and UMKM operations — where language models help, and where structured data still wins.',
    href: '#',
  },
  {
    tag: 'Computer Vision',
    date: 'APR 2026',
    title: 'Decoding Body Language with Vision Models',
    description:
      'Notes on pose signals, feature extraction, and the gap between a demo notebook and a system that behaves in the wild.',
    href: '#',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function ArtikelSection() {
  return (
    <section id="artikel" className="artikel-section">
      <div className="artikel-container">

        {/* Header */}
        <FadeInUp className="artikel-header">
          <span className="about-eyebrow">Artikel</span>
          <h2 className="about-title">
            Thoughts on<br />
            <em>data, models &amp; AI</em>
          </h2>
        </FadeInUp>

        {/* Featured post */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="artikel-featured"
        >
          <BlogPostCard variant="featured" {...featuredPost} />
        </motion.div>

        {/* Grid */}
        <motion.div
          className="artikel-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {artikelPosts.map((post, i) => (
            <motion.div key={i} variants={itemVariants}>
              <BlogPostCard {...post} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
