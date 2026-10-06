'use client';
"use client";

import { motion } from 'motion/react';
import { BlogPostCard } from '@/components/ui/card-18';
import { FadeInUp } from '@/components/ui/fade-in-up';

const featuredPost = {
  tag: 'Web Dev',
  date: 'JUL 2026',
  title: 'Building Zero-Latency Interfaces: From Canvas to Production',
  description:
    'A deep dive into how 60fps interactive character engines work under the hood — covering WebGL, canvas rendering pipelines, and the maths behind smooth gaze tracking.',
  href: '#',
  imageUrl:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
};

const artikelPosts = [
  {
    tag: 'Architecture',
    date: 'JUN 2026',
    title: 'Distributed Event-Driven Systems at Scale',
    description:
      'How to design backend infrastructure that processes millions of events per day with sub-10ms response times using Go and Kafka.',
    href: '#',
  },
  {
    tag: 'Design',
    date: 'MAY 2026',
    title: 'Luxury Digital Design: Principles Behind Premium Web Experiences',
    description:
      'Breaking down the visual language, typography choices, and micro-animation patterns that separate luxury digital products from the rest.',
    href: '#',
  },
  {
    tag: 'Cloud',
    date: 'APR 2026',
    title: 'Terraform Patterns for Production-Grade Cloud Infrastructure',
    description:
      'Practical patterns for managing multi-region AWS infrastructure as code — from state management to CI/CD pipeline integration.',
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
            <em>engineering & craft</em>
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
