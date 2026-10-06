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
  { category: 'Data Science', icon: Layers, items: ['Python', 'Pandas', 'SQL', 'Exploratory Analysis', 'Statistics'] },
  { category: 'Machine Learning', icon: Zap, items: ['Scikit-learn', 'Logistic Regression', 'Model Evaluation', 'Jupyter', 'Feature Engineering'] },
  { category: 'AI & GenAI', icon: Globe, items: ['Generative AI', 'Computer Vision', 'LLMs', 'Prompting', 'Applied NLP'] },
  { category: 'Build & Viz', icon: Code2, items: ['Dashboards', 'Next.js', 'Matplotlib', 'Git', 'Experiment Tracking'] },
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
                Building at the<br />
                <em>intersection of data &amp; AI</em>
              </h2>
            </FadeInUp>

            <FadeInUp delay={0.1} className="about-bio-text">
              <p>
                I'm Alaika Izatul Ilmi — an Informatics student at Universitas Bhamada Slawi focused on Data Science, Machine Learning Engineering, and Generative AI. I build models, analyses, and AI products that turn messy data into decisions.
              </p>
              <p>
                From receipt intelligence for UMKM to air-quality analysis and medical prediction models, I care about work that is rigorous, interpretable, and actually useful.
              </p>
              <div className="about-meta-tags">
                <span><MapPin size={13} /> Tegal, Indonesia</span>
                <span><Calendar size={13} /> Informatics student</span>
                <span><Zap size={13} /> Open to internships</span>
              </div>
            </FadeInUp>

          </div>

          {/* ── RIGHT COLUMN: Lanyard ── */}
          <div className="about-card-placeholder">
            <IDCardLanyard
              name="Alaika"
              role="Data Scientist & AI"
              brand="ALAIKA"
              brandTagline="Data Science Studio"
              pillars={["Data", "Model", "Insight"]}
              location="Tegal, ID"
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
            { value: '18+', label: 'Public repositories' },
            { value: '6+', label: 'ML & AI projects' },
            { value: 'Python', label: 'Core research stack' },
            { value: 'GenAI', label: 'Current focus' },
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
