import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Mail, Sparkles, X, Check, FileText, Code2, BookOpen, MapPin, Calendar, Zap, Layers, Globe } from 'lucide-react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { BlogPostCard } from '@/components/ui/card-18';
import { IDCardLanyard } from '@/components/ui/id-card-lanyard';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';
import { ProjectsSection } from '@/components/ui/projects-section';
import { RepositorySection } from '@/components/ui/repository-section';
import { WavePath } from '@/components/ui/wave-path';

const TOTAL_FRAMES = 64;
const DEFAULT_LERP_FACTOR = 0.32; // Fast responsive tracking
const INITIAL_LERP_FACTOR = 0.04; // Gentle cinematic ease-in on load
const FACE_NORM_X = 0.50;
const FACE_NORM_Y = 0.38;

// Shortest path circular angular interpolation
function lerpAngle(current, target, factor) {
  let diff = target - current;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  return current + diff * factor;
}

// ── ABOUT SECTION COMPONENT ─────────────────────────────────────────────────
function FadeInUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const skills = [
  { category: 'Frontend', icon: Layers, items: ['React', 'TypeScript', 'Next.js', 'WebGL / Canvas', 'Tailwind CSS'] },
  { category: 'Backend', icon: Zap, items: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis'] },
  { category: 'Infrastructure', icon: Globe, items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
  { category: 'Craft', icon: Code2, items: ['Computer Vision', 'Real-time Systems', 'API Design', 'Performance'] },
];

const timeline = [
  { year: '2024–Now', role: 'Senior Full Stack Engineer', company: 'Independent / Freelance', desc: 'Building high-performance interactive web experiences and consulting on cloud architecture for scale-up companies.' },
  { year: '2021–2024', role: 'Lead Engineer', company: 'Vortex Systems', desc: 'Led a team of 8 engineers building distributed event-driven infrastructure processing 10M+ events/day with sub-10ms latency.' },
  { year: '2018–2021', role: 'Full Stack Developer', company: 'Nexlayer Studio', desc: 'Developed real-time collaborative tools and WebGL-powered data visualisation platforms for enterprise clients.' },
];

function AboutSection() {
  return (
    <>
      <section id="about" className="about-section">
      {/* Subtle grid background */}
      <div className="about-grid-bg" aria-hidden="true" />

      <div className="about-container">
        <div className="about-main-grid">

          {/* ── LEFT COLUMN: semua konten ── */}
          <div className="about-left-col">

            {/* ── Header ── */}
            <FadeInUp className="about-header">
              <span className="about-eyebrow">About</span>
              <h2 className="about-title">
                Engineering at the<br />
                <em>intersection of art & code</em>
              </h2>
            </FadeInUp>

            {/* ── Bio ── */}
            <FadeInUp delay={0.1} className="about-bio-text">
              <p>
                I'm Alaika — a full-stack engineer with 8+ years building products that sit at the edge of performance and aesthetics. My work spans zero-latency canvas engines, distributed cloud backends, and luxury digital interfaces.
              </p>
              <p>
                I believe code should be fast, honest, and beautiful. Whether it's a 60fps interactive character or a globally distributed API, every layer deserves the same rigour.
              </p>
              <div className="about-meta-tags">
                <span><MapPin size={13} /> Based in Indonesia</span>
                <span><Calendar size={13} /> 8+ years experience</span>
                <span><Zap size={13} /> Open to contracts</span>
              </div>
            </FadeInUp>

          </div>{/* end about-left-col */}

          {/* ── RIGHT COLUMN: Lanyard ── */}
          <div className="about-card-placeholder">
            <IDCardLanyard
              name="Alaika"
              role="Full Stack Developer"
              brand="ALAIKA"
              brandTagline="Full Stack Dev Studio"
              pillars={["Design", "Code", "Ship"]}
              location="Indonesia"
              idNumber="AL-2024"
              validThru="12/2029"
              site="alaika.dev"
              githubUrl="https://github.com/Alaika10"
              linkedinUrl="https://linkedin.com"
              zIndex={10}
              showHint={false}
              photoUrl="/foto-layard.png"
            />
          </div>

        </div>{/* end about-main-grid */}

        {/* ── Stats + Skills — full width below the 2-col grid ── */}
        <FadeInUp delay={0.12} className="about-stats-row">
          {[
            { value: '50+', label: 'Projects shipped' },
            { value: '12+', label: 'Happy clients' },
            { value: '60fps', label: 'Target performance' },
            { value: '0ms', label: 'Tolerance for bloat' },
          ].map((s) => (
            <div key={s.label} className="about-stat-card">
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </FadeInUp>

        <FadeInUp delay={0.08}>
          <p className="about-section-label">Tech Stack</p>
        </FadeInUp>
        <div className="about-skills-grid">
          {skills.map((group, i) => (
            <FadeInUp key={group.category} delay={0.1 + i * 0.07}>
              <div className="about-skill-card">
                <div className="about-skill-header">
                  <group.icon size={16} className="about-skill-icon" />
                  <span>{group.category}</span>
                </div>
                <ul className="about-skill-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </FadeInUp>
          ))}
        </div>

      </div>{/* end about-container */}
    </section>

    {/* ── Experience Section ── */}
    <section id="experience" className="experience-section">
      <div className="about-grid-bg" aria-hidden="true" />
      <div className="experience-container">

        <FadeInUp className="experience-header">
          <span className="about-eyebrow">Experience</span>
          <h2 className="about-title">
            Career &amp; <br />
            <em>Milestones</em>
          </h2>
          <p className="experience-period">2020 — 2026</p>
        </FadeInUp>

        <div className="experience-grid">

          <FadeInUp delay={0.08} className="experience-card experience-card--featured">
            <div className="experience-card-inner">
              <div className="experience-meta">
                <span className="experience-year">2024 – Now</span>
                <span className="experience-badge">Current</span>
              </div>
              <h3 className="experience-role">Senior Full Stack Engineer</h3>
              <p className="experience-company">Independent / Freelance</p>
              <p className="experience-desc">
                Building high-performance interactive web experiences and consulting on cloud architecture for scale-up companies. Specialising in zero-latency canvas engines and luxury digital interfaces.
              </p>
              <div className="experience-tags">
                <span>React</span><span>WebGL</span><span>AWS</span><span>Go</span>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.14} className="experience-card">
            <div className="experience-card-inner">
              <div className="experience-meta">
                <span className="experience-year">2021 – 2024</span>
              </div>
              <h3 className="experience-role">Lead Engineer</h3>
              <p className="experience-company">Vortex Systems</p>
              <p className="experience-desc">
                Led a team of 8 engineers building distributed event-driven infrastructure processing 10M+ events/day with sub-10ms latency. Scaled backend from monolith to microservices.
              </p>
              <div className="experience-tags">
                <span>Node.js</span><span>Kafka</span><span>Kubernetes</span><span>PostgreSQL</span>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.20} className="experience-card">
            <div className="experience-card-inner">
              <div className="experience-meta">
                <span className="experience-year">2018 – 2021</span>
              </div>
              <h3 className="experience-role">Full Stack Developer</h3>
              <p className="experience-company">Nexlayer Studio</p>
              <p className="experience-desc">
                Developed real-time collaborative tools and WebGL-powered data visualisation platforms for enterprise clients. Built award-winning luxury digital experiences.
              </p>
              <div className="experience-tags">
                <span>TypeScript</span><span>Next.js</span><span>WebGL</span><span>Redis</span>
              </div>
            </div>
          </FadeInUp>

          {/* Stats column */}
          <FadeInUp delay={0.1} className="experience-stats-col">
            <div className="experience-stat-item">
              <span className="experience-stat-num">8+</span>
              <span className="experience-stat-label">Years building</span>
            </div>
            <div className="experience-divider" />
            <div className="experience-stat-item">
              <span className="experience-stat-num">3</span>
              <span className="experience-stat-label">Companies led</span>
            </div>
            <div className="experience-divider" />
            <div className="experience-stat-item">
              <span className="experience-stat-num">10M+</span>
              <span className="experience-stat-label">Events / day</span>
            </div>
            <div className="experience-divider" />
            <div className="experience-stat-item">
              <span className="experience-stat-num">50+</span>
              <span className="experience-stat-label">Projects shipped</span>
            </div>
          </FadeInUp>

        </div>
      </div>
    </section>

    {/* ── Projects Section (6 Rich Feature Cards) ── */}
    <ProjectsSection />

    {/* ── Repository & Contribution Skyline Section ── */}
    <RepositorySection />

    </>
  );
}

// ── TESTIMONIAL SECTION ──────────────────────────────────────────────────────
function TestimonialSection() {
  return (
    <section id="testimonial" className="testimonial-section">
      <div className="testimonial-container">
        <FadeInUp className="testimonial-header">
          <span className="about-eyebrow">Testimonials</span>
          <h2 className="about-title">
            What clients<br />
            <em>say about the work</em>
          </h2>
        </FadeInUp>
      </div>
      <StaggerTestimonials />
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { label: 'About',      href: '#about' },
    { label: 'Project',    href: '#project' },
    { label: 'Experience', href: '#experience' },
    { label: 'Artikel',    href: '#artikel' },
    { label: 'Repository', href: '#repository' },
    { label: 'Contact',    href: '#contact' },
  ];
  const socials = [
    {
      label: 'GitHub',
      href: 'https://github.com/Alaika10',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
    },
    {
      label: 'X / Twitter',
      href: 'https://x.com',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Top row */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <span className="footer-logo">Alaika</span>
            <p className="footer-tagline">
              Full Stack Engineer crafting zero-latency web experiences &amp; distributed systems from Indonesia.
            </p>
          </div>

          {/* Nav links */}
          <div className="footer-nav">
            <span className="footer-nav-label">Navigation</span>
            <ul>
              {links.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={e => {
                      e.preventDefault();
                      document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-connect">
            <span className="footer-nav-label">Connect</span>
            <div className="footer-socials">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="footer-social-btn">
                  {s.icon}
                </a>
              ))}
            </div>
            <a href="mailto:alaika@example.com" className="footer-email">
              alaika@example.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom row */}
        <div className="footer-bottom">
          <span className="footer-copy">© {year} Alaika. All rights reserved.</span>
          <span className="footer-made">Designed &amp; built with care in Indonesia</span>
        </div>

      </div>
    </footer>
  );
}

// ── CONTACT SECTION ─────────────────────────────────────────────────────────
function ContactSection() {
  const [formState, setFormState] = React.useState({ name: '', email: '', message: '' });
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate send
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="about-grid-bg" aria-hidden="true" />
      <div className="contact-container">

        {/* Left — text */}
        <FadeInUp className="contact-left">
          <span className="about-eyebrow">Contact</span>
          <h2 className="about-title">
            Let's build<br />
            <em>something great</em>
          </h2>
          <p className="contact-sub">
            Open for select engineering contracts, creative web builds, and technical leadership roles. Response within 24 hours.
          </p>

          <div className="contact-links">
            <a href="mailto:alaika@example.com" className="contact-link-row">
              <div className="contact-link-icon">
                <Mail size={16} />
              </div>
              <div>
                <span className="contact-link-label">Email</span>
                <span className="contact-link-value">alaika@example.com</span>
              </div>
            </a>

            <a href="https://github.com/Alaika10" target="_blank" rel="noreferrer" className="contact-link-row">
              <div className="contact-link-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </div>
              <div>
                <span className="contact-link-label">GitHub</span>
                <span className="contact-link-value">github.com/Alaika10</span>
              </div>
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-link-row">
              <div className="contact-link-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </div>
              <div>
                <span className="contact-link-label">LinkedIn</span>
                <span className="contact-link-value">linkedin.com/in/alaika</span>
              </div>
            </a>
          </div>
        </FadeInUp>

        {/* Right — form */}
        <FadeInUp delay={0.15} className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="contact-field-row">
              <div className="contact-field">
                <label className="contact-label">Name</label>
                <input
                  className="contact-input"
                  type="text"
                  placeholder="Your name"
                  required
                  value={formState.name}
                  onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="contact-field">
                <label className="contact-label">Email</label>
                <input
                  className="contact-input"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formState.email}
                  onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="contact-field">
              <label className="contact-label">Message</label>
              <textarea
                className="contact-input contact-textarea"
                placeholder="Tell me about your project..."
                required
                rows={5}
                value={formState.message}
                onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
              />
            </div>

            <button type="submit" className={`contact-submit ${sent ? 'contact-submit--sent' : ''}`}>
              {sent ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>Message sent!</span>
                </>
              ) : (
                <>
                  <span>Send message</span>
                  <ArrowUpRight size={16} />
                </>
              )}
            </button>

          </form>
        </FadeInUp>

      </div>
    </section>
  );
}

// ── ARTIKEL SECTION ──────────────────────────────────────────────────────────
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

function ArtikelSection() {
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

// ── DESKTOP NAV dengan dropdown About ────────────────────────────────────────
function DesktopNav({ navItems, onScrollTo }) {
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(null);
  const timerRef = React.useRef(null);

  const openDropdown = () => {
    clearTimeout(timerRef.current);
    setAboutOpen(true);
  };
  const closeDropdown = () => {
    timerRef.current = setTimeout(() => setAboutOpen(false), 120);
  };

  return (
    <div
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', pointerEvents: 'none' }}
    >
      {/* About — with dropdown */}
      <div
        style={{ position: 'relative', pointerEvents: 'auto' }}
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdown}
      >
        <button
          onClick={() => onScrollTo('#about')}
          onMouseEnter={() => setHovered('about')}
          onMouseLeave={() => setHovered(null)}
          style={{ position: 'relative', padding: '10px 20px', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#52525b', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {hovered === 'about' && (
            <motion.div layoutId="nav-hovered" style={{ position: 'absolute', inset: 0, borderRadius: '9999px', background: '#f3f4f6', zIndex: 0 }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>About</span>
          <svg style={{ position: 'relative', zIndex: 1, transition: 'transform 0.2s', transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <AnimatePresence>
          {aboutOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '6px', minWidth: '170px', zIndex: 200, pointerEvents: 'auto' }}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              {[
                { label: 'About', sub: 'Who I am', href: '#about' },
                { label: 'Experience', sub: 'Career & milestones', href: '#experience' },
              ].map(item => (
                <button
                  key={item.href}
                  onClick={() => { onScrollTo(item.href); setAboutOpen(false); }}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '9px 12px', borderRadius: '9px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111418' }}>{item.label}</span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '1px' }}>{item.sub}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Regular nav items */}
      {navItems.map((item, idx) => (
        <div key={item.link} style={{ position: 'relative', pointerEvents: 'auto' }}>
          <a
            href={item.link}
            onClick={e => { e.preventDefault(); onScrollTo(item.link); }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{ position: 'relative', display: 'block', padding: '10px 20px', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 500, color: '#52525b', textDecoration: 'none' }}
          >
            {hovered === idx && (
              <motion.div layoutId="nav-hovered" style={{ position: 'absolute', inset: 0, borderRadius: '9999px', background: '#f3f4f6', zIndex: 0 }} />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{item.name}</span>
          </a>
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const canvasRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'work', 'about', 'contact', 'resume'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Project',    link: '#project',     modal: null },
    { name: 'Repository', link: '#repository',  modal: null },
    { name: 'Artikel',    link: '#artikel',     modal: null },
    { name: 'Contact',    link: '#contact',     modal: null },
  ];
  


  // Cursor state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [auraPos, setAuraPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isEyeContactState, setIsEyeContactState] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(false);

  // References for animation loop
  const framesRef = useRef([]);
  const centerFrameRef = useRef(null);
  
  // Real mouse position vs virtual smoothed tracking position
  const realMouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight * 0.4 });
  const virtualMouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight * 0.4 });
  const isInsideWindowRef = useRef(false);
  const lastMouseMoveTimeRef = useRef(0);
  const startTimeRef = useRef(0);

  const smoothedAngleRef = useRef(0);
  const isEyeContactRef = useRef(true);
  const animFrameIdRef = useRef(null);
  const auraAnimRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // 1. Preload 64 WebP frames + center.webp
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = TOTAL_FRAMES + 1;
    const framesArray = new Array(TOTAL_FRAMES);
    let isMounted = true;

    const checkComplete = () => {
      if (!isMounted) return;
      loadedCount++;
      const pct = Math.round((loadedCount / totalToLoad) * 100);
      setLoadingProgress(pct);
      if (loadedCount >= totalToLoad) {
        framesRef.current = framesArray;
        setTimeout(() => {
          if (isMounted) {
            setIsLoaded(true);
            startTimeRef.current = performance.now();
          }
        }, 300);
      }
    };

    // Safety fallback: if any image is cached or network stalls, reveal within 2.5s
    const safetyTimer = setTimeout(() => {
      if (isMounted && !isLoaded) {
        framesRef.current = framesArray;
        setIsLoaded(true);
        startTimeRef.current = performance.now();
      }
    }, 2500);

    // Load 64 rotation frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIdx = String(i).padStart(2, '0');
      img.src = `/frames/frame_${paddedIdx}.webp`;
      img.onload = checkComplete;
      img.onerror = checkComplete;
      framesArray[i] = img;
    }

    // Load center.webp
    const centerImg = new Image();
    centerImg.src = '/center.webp';
    centerImg.onload = () => {
      centerFrameRef.current = centerImg;
      checkComplete();
    };
    centerImg.onerror = checkComplete;

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      framesArray.forEach(img => { if (img) img.onload = null; });
      if (centerImg) centerImg.onload = null;
    };
  }, []);

  // 2. High-performance canvas render loop
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let lastHudUpdate = 0;

    const render = (time) => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Ensure canvas internal buffer matches screen resolution
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background color matches exactly (#e5e7e7)
      ctx.fillStyle = '#e5e7e7';
      ctx.fillRect(0, 0, width, height);

      // Image source resolution (1280 x 720)
      const srcW = 1280;
      const srcH = 720;

      // Object-fit: cover scaling
      const scale = Math.max(width / srcW, height / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = (width - drawW) / 2;
      // Push image down by navbar height so head clears the nav
      const NAV_OFFSET = 72;
      const drawY = (height - drawH) / 2 + NAV_OFFSET;

      // Calculate character face center in CSS screen coordinates
      const faceScreenX = drawX + FACE_NORM_X * drawW;
      const faceScreenY = drawY + FACE_NORM_Y * drawH;

      // Calculate initial slow ease-in ramp:
      // When page first loads, ramp factor from INITIAL_LERP_FACTOR (0.045) to DEFAULT_LERP_FACTOR (0.26)
      // over 2.5 seconds for a graceful, cinematic introduction
      const elapsedSinceStart = time - startTimeRef.current;
      const rampProgress = Math.min(1.0, Math.max(0.0, elapsedSinceStart / 2500));
      // Smooth cubic ease-out for tracking factor
      const easedRamp = 1 - Math.pow(1 - rampProgress, 3);
      const currentLerpFactor = INITIAL_LERP_FACTOR + (DEFAULT_LERP_FACTOR - INITIAL_LERP_FACTOR) * easedRamp;

      // Check whether cursor is inside window and active
      // If cursor is OUTSIDE the web window (or idle > 4s), return target to face center (forward neutral pose)
      const timeSinceLastMove = time - lastMouseMoveTimeRef.current;
      const isCursorActive = isInsideWindowRef.current && timeSinceLastMove < 4500;

      let targetX, targetY;
      if (isCursorActive) {
        targetX = realMouseRef.current.x;
        targetY = realMouseRef.current.y;
      } else {
        // Target is face center so character naturally looks forward
        targetX = faceScreenX;
        targetY = faceScreenY;
      }

      // Virtual mouse smooth interpolation (smooth return & follow)
      // When returning to center or initial load, use smooth gentle easing
      const virtualSpeed = isCursorActive ? currentLerpFactor : 0.08;
      virtualMouseRef.current.x += (targetX - virtualMouseRef.current.x) * virtualSpeed;
      virtualMouseRef.current.y += (targetY - virtualMouseRef.current.y) * virtualSpeed;

      const dx = virtualMouseRef.current.x - faceScreenX;
      const dy = virtualMouseRef.current.y - faceScreenY;
      const distance = Math.hypot(dx, dy);

      // Deadzone: 9% — tighter so tracking kicks in sooner
      const screenRadiusRef = Math.min(width, height);
      const baseDeadzone = screenRadiusRef * 0.09;
      const enterDeadzone = baseDeadzone * 0.88;
      const exitDeadzone = baseDeadzone * 1.12;

      let inDeadzone = isEyeContactRef.current;
      if (inDeadzone) {
        if (distance > exitDeadzone) inDeadzone = false;
      } else {
        if (distance < enterDeadzone) inDeadzone = true;
      }
      isEyeContactRef.current = inDeadzone;

      let currentFrameImg;
      let directionLabel = 'CENTER';
      let frameIndex = -1;

      if (inDeadzone || (!isCursorActive && distance < 20)) {
        // Direct Eye Contact Mode (Neutral Forward Pose)
        currentFrameImg = centerFrameRef.current;
        directionLabel = 'DIRECT EYE CONTACT';
      } else {
        // Calculate cursor angle relative to face center
        const rawAngle = Math.atan2(dy, dx);

        // Convert to clockwise angle starting from UP = 0
        let targetAngle = rawAngle + Math.PI / 2;
        while (targetAngle < 0) targetAngle += 2 * Math.PI;
        while (targetAngle >= 2 * Math.PI) targetAngle -= 2 * Math.PI;

        // Shortest-path circular angular lerp — smooth angle tracking
        smoothedAngleRef.current = lerpAngle(smoothedAngleRef.current, targetAngle, currentLerpFactor);
        while (smoothedAngleRef.current < 0) smoothedAngleRef.current += 2 * Math.PI;
        while (smoothedAngleRef.current >= 2 * Math.PI) smoothedAngleRef.current -= 2 * Math.PI;

        // Map smoothed angle to nearest frame index 0..63
        frameIndex = Math.round((smoothedAngleRef.current / (2 * Math.PI)) * TOTAL_FRAMES) % TOTAL_FRAMES;
        currentFrameImg = framesRef.current[frameIndex];

        // Determine compass direction label
        const deg = (smoothedAngleRef.current * 180) / Math.PI;
        if (deg >= 337.5 || deg < 22.5) directionLabel = 'UP';
        else if (deg >= 22.5 && deg < 67.5) directionLabel = 'UP-RIGHT';
        else if (deg >= 67.5 && deg < 112.5) directionLabel = 'RIGHT';
        else if (deg >= 112.5 && deg < 157.5) directionLabel = 'DOWN-RIGHT';
        else if (deg >= 157.5 && deg < 202.5) directionLabel = 'DOWN';
        else if (deg >= 202.5 && deg < 247.5) directionLabel = 'DOWN-LEFT';
        else if (deg >= 247.5 && deg < 292.5) directionLabel = 'LEFT';
        else directionLabel = 'UP-LEFT';
      }

      // Draw single crisp frame at 100% opacity (no blending = no flicker)
      if (currentFrameImg?.complete && currentFrameImg.naturalWidth > 0) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(currentFrameImg, drawX, drawY, drawW, drawH);
      } else if (centerFrameRef.current?.complete) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(centerFrameRef.current, drawX, drawY, drawW, drawH);
      }

      ctx.restore();

      // Throttle cursor aura eye-contact state updates
      if (time - lastHudUpdate > 66) {
        lastHudUpdate = time;
        setIsEyeContactState(inDeadzone);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isLoaded]);

  // 3. Mouse Tracking, Boundary Detection & Magnetic Trailing Aura Loop
  useEffect(() => {
    let auraAnimFrame;

    const handleMouseMove = (e) => {
      realMouseRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTimeRef.current = performance.now();
      isInsideWindowRef.current = true;
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
    };

    const handleMouseEnter = () => {
      isInsideWindowRef.current = true;
      lastMouseMoveTimeRef.current = performance.now();
      setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      // User moved cursor outside the web viewport
      isInsideWindowRef.current = false;
      setCursorVisible(false);
    };

    const handleWindowBlur = () => {
      // User switched tab or clicked outside
      isInsideWindowRef.current = false;
      setCursorVisible(false);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        realMouseRef.current = { x: touch.clientX, y: touch.clientY };
        lastMouseMoveTimeRef.current = performance.now();
        isInsideWindowRef.current = true;
        setCursorPos({ x: touch.clientX, y: touch.clientY });
        setCursorVisible(true);
      }
    };

    const handleTouchEnd = () => {
      isInsideWindowRef.current = false;
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Smooth spring aura loop
    const updateAura = () => {
      auraAnimRef.current.x += (realMouseRef.current.x - auraAnimRef.current.x) * 0.16;
      auraAnimRef.current.y += (realMouseRef.current.y - auraAnimRef.current.y) * 0.16;
      setAuraPos({ x: auraAnimRef.current.x, y: auraAnimRef.current.y });
      auraAnimFrame = requestAnimationFrame(updateAura);
    };
    auraAnimFrame = requestAnimationFrame(updateAura);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(auraAnimFrame);
    };
  }, []);

  const handleInteractiveEnter = () => setIsHovered(true);
  const handleInteractiveLeave = () => setIsHovered(false);

  return (
    <>
      {/* 1. Ultra-Luxury Preloader */}
      <div className={`loader-overlay ${isLoaded ? 'hidden' : ''}`}>
        <h1 className="loader-title">Alaika</h1>
        <div className="loader-bar-bg">
          <div className="loader-bar-fill" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="loader-text">
          {loadingProgress < 100 ? `Synthesizing Frames ${loadingProgress}%` : 'Entering Experience'}
        </p>
      </div>

      {/* ── PAGE WRAPPER ── */}
      <div className="page-wrapper">

        {/* ── NAVBAR — rendered outside hero to avoid stacking context traps ── */}
        <Navbar>
          {/* Desktop Nav */}
          <NavBody>
            <a href="#" className="relative z-20 flex items-center px-2 py-1">
              <span
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-xl font-bold text-gray-900 tracking-wide"
              >
                Alaika
              </span>
            </a>
            <DesktopNav navItems={navItems} onScrollTo={(href) => {
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }} />
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold bg-transparent text-gray-700 hover:text-black transition"
                onClick={() => setActiveModal('resume')}
              >
                Resume
              </button>
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-black transition shadow-sm"
                onClick={() => setActiveModal('contact')}
              >
                Let's Talk
              </button>
            </div>
          </NavBody>

          {/* Mobile Nav */}
          <MobileNav>
            <MobileNavHeader>
              <a href="#" className="flex items-center px-2">
                <span
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  className="text-xl font-bold text-gray-900"
                >
                  Alaika
                </span>
              </a>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (item.modal) {
                      e.preventDefault();
                      setActiveModal(item.modal);
                    } else if (item.link?.startsWith('#')) {
                      e.preventDefault();
                      const target = document.querySelector(item.link);
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-base font-medium text-neutral-700 hover:text-black transition"
                >
                  {item.name}
                </a>
              ))}
              {/* Experience — sub-item di bawah About */}
              <a
                href="#experience"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm font-medium text-neutral-400 hover:text-black transition pl-3 -mt-2"
              >
                ↳ Experience
              </a>
              <div className="flex w-full flex-col gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setActiveModal('resume'); }}
                  className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  Resume
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setActiveModal('contact'); }}
                  className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-black transition"
                >
                  Let's Talk
                </button>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>

        {/* ── HERO SECTION ── */}
        <section className="hero-section-wrapper">
          {/* Canvas */}
          <div className="hero-canvas-container">
            <canvas ref={canvasRef} className="hero-canvas" />
          </div>

          {/* Hero UI Overlay — hero content only, no navbar */}
          <div className="ui-overlay">
            {/* Bottom-Left Hero Typography */}
            <div className="hero-content">
              <div className="greeting-text">
                <span>Hi, I'm</span>
              </div>
              <h1 className="name-heading">Alaika</h1>
              <p className="bio-text">
                Full Stack Developer specializing in high-performance web systems,
                interactive architectures, and luxury digital design. Crafting zero-latency experiences.
              </p>
              <div className="cta-group">
                <button
                  className="btn-primary"
                  onMouseEnter={handleInteractiveEnter}
                  onMouseLeave={handleInteractiveLeave}
                  onClick={() => setActiveModal('resume')}
                >
                  <span>Resume</span>
                  <ArrowUpRight className="arrow-icon" />
                </button>
                <button
                  className="btn-secondary"
                  onMouseEnter={handleInteractiveEnter}
                  onMouseLeave={handleInteractiveLeave}
                  onClick={() => setActiveModal('contact')}
                >
                  <Mail size={15} />
                  <span>Let's Talk</span>
                </button>
              </div>
            </div>
          </div>

          {/* Blur fade-out at the bottom of hero → blends into About */}
          <div className="hero-bottom-blur" />
        </section>

        {/* ── ABOUT SECTION ── */}
        <AboutSection />

        {/* wave divider */}
        <div className="wave-divider wave-divider--light">
          <WavePath color="rgba(0,0,0,0.25)" strokeWidth={2.5} />
        </div>

        {/* ── ARTIKEL SECTION ── */}
        <ArtikelSection />

        {/* ── TESTIMONIAL SECTION ── */}
        <TestimonialSection />

        {/* wave divider — transisi ke gelap */}
        <div className="wave-divider wave-divider--dark">
          <WavePath color="rgba(255,255,255,0.45)" strokeWidth={2.5} />
        </div>

        {/* ── CONTACT SECTION ── */}
        <ContactSection />

        {/* ── FOOTER ── */}
        <Footer />

      </div>{/* end page-wrapper */}

      {/* 5. Modals */}
      {activeModal && (
        <div className="contact-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="contact-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={16} />
            </button>

            {activeModal === 'contact' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Let's Create Together</h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Open for select engineering contracts, creative web builds, and technical leadership roles.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <a
                    href="mailto:alaika@example.com"
                    className="btn-primary"
                    style={{ justifyContent: 'flex-start', padding: '0.7rem 1.2rem' }}
                  >
                    <Mail size={16} />
                    <span>alaika@example.com</span>
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <a href="https://github.com/Alaika10" target="_blank" rel="noreferrer" style={{ color: '#333' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#333' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                  <a href="https://x.com" target="_blank" rel="noreferrer" style={{ color: '#333' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                </div>
              </div>
            )}

            {activeModal === 'work' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Selected Architecture & Projects</h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', marginBottom: '1.2rem' }}>
                  Highlighting recent production deployments and client case studies:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ padding: '0.9rem', borderRadius: '14px', background: 'rgba(255,255,255,0.7)', border: '1px solid #eee' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Aura Interactive Engine</div>
                    <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Zero-latency 60fps WebGL/Canvas micro-tracking engine</div>
                  </div>
                  <div style={{ padding: '0.9rem', borderRadius: '14px', background: 'rgba(255,255,255,0.7)', border: '1px solid #eee' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Vortex Cloud Platform</div>
                    <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Distributed event-driven infrastructure with sub-10ms response times</div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'about' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Engineering Philosophy</h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  With over 8 years in full-stack architecture, I combine mathematically rigorous graphics programming
                  with modern scalable cloud services. Every pixel and payload is tuned for zero waste and maximum velocity.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['React', 'TypeScript', 'Node.js', 'WebGL/Canvas', 'Go', 'Python / CV', 'Cloud Architecture'].map((tech) => (
                    <span key={tech} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', background: '#f3f4f6', fontSize: '0.76rem', fontWeight: 500 }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'resume' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Professional Dossier</h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Full curriculum vitae detailing experience with high-scale tech firms, open-source work, and patents.
                </p>
                <button
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => alert('Resume download initialized.')}
                >
                  <FileText size={16} />
                  <span>Download Curriculum Vitae (PDF)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
