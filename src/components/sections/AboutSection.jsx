'use client';
"use client";

import { Layers, Zap, Globe, Code2, MapPin, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';

const IDCardLanyard = dynamic(
  () => import('@/components/ui/id-card-lanyard').then(m => ({ default: m.IDCardLanyard })),
  { ssr: false }
);
import { FadeInUp } from '@/components/ui/fade-in-up';

const skills = [
  { category: 'Frontend', icon: Layers, items: ['React', 'TypeScript', 'Next.js', 'WebGL / Canvas', 'Tailwind CSS'] },
  { category: 'Backend', icon: Zap, items: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis'] },
  { category: 'Infrastructure', icon: Globe, items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
  { category: 'Craft', icon: Code2, items: ['Computer Vision', 'Real-time Systems', 'API Design', 'Performance'] },
];

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      {/* Subtle grid background */}
      <div className="about-grid-bg" aria-hidden="true" />

      <div className="about-container">
        <div className="about-main-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="about-left-col">

            <FadeInUp className="about-header">
              <span className="about-eyebrow">About</span>
              <h2 className="about-title">
                Engineering at the<br />
                <em>intersection of art &amp; code</em>
              </h2>
            </FadeInUp>

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

          </div>

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

        </div>

        {/* ── Stats + Skills — full width below grid ── */}
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

      </div>
    </section>
  );
}
