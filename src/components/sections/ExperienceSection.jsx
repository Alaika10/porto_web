'use client';

import { FadeInUp } from '@/components/ui/fade-in-up';
import WaveDividerQuote from '@/components/sections/WaveDividerQuote';

export default function ExperienceSection() {
  return (
    <section id="experience" className="experience-section">
      <div className="about-grid-bg" aria-hidden="true" />
      <div className="experience-container">

        <FadeInUp className="experience-header">
          <span className="about-eyebrow">Experience</span>
          <h2 className="about-title">
            Career &amp; <br />
            <em>Milestones</em>
          </h2>
          <p className="experience-period">2023 — 2026</p>
        </FadeInUp>

        <div className="experience-list">

          <FadeInUp delay={0.08} className="experience-row">
            <div className="experience-row-meta">
              <span className="experience-year">2024 – Now</span>
              <span className="experience-badge">Current</span>
            </div>
            <article className="experience-card experience-card--featured">
              <div className="experience-card-inner">
                <h3 className="experience-role">Data Scientist &amp; AI Practitioner</h3>
                <p className="experience-company">Independent / Applied Projects</p>
                <p className="experience-desc">
                  Building applied machine learning and generative AI systems — from UMKM receipt intelligence to predictive models and analytics dashboards that surface clear insight from real-world data.
                </p>
                <div className="experience-tags">
                  <span>Python</span><span>ML</span><span>GenAI</span><span>Pandas</span>
                </div>
              </div>
            </article>
          </FadeInUp>

          <FadeInUp delay={0.14} className="experience-row">
            <div className="experience-row-meta">
              <span className="experience-year">2024 – 2025</span>
            </div>
            <article className="experience-card">
              <div className="experience-card-inner">
                <h3 className="experience-role">AI Product Contributor</h3>
                <p className="experience-company">Strukly AI UMKM</p>
                <p className="experience-desc">
                  Contributed to an AI platform for receipt digitization, transaction management, and automated analysis for small businesses — connecting computer vision, structured data, and practical UMKM workflows.
                </p>
                <div className="experience-tags">
                  <span>Python</span><span>Computer Vision</span><span>NLP</span><span>UMKM</span>
                </div>
              </div>
            </article>
          </FadeInUp>

          <FadeInUp delay={0.20} className="experience-row">
            <div className="experience-row-meta">
              <span className="experience-year">2023 – Now</span>
            </div>
            <article className="experience-card">
              <div className="experience-card-inner">
                <h3 className="experience-role">Informatics Student</h3>
                <p className="experience-company">Universitas Bhamada Slawi</p>
                <p className="experience-desc">
                  Studying Informatics with a focus on data science and machine learning. Shipped analysis notebooks, classification models, and public experiments across air quality, healthcare prediction, and body-language decoding.
                </p>
                <div className="experience-tags">
                  <span>Jupyter</span><span>Scikit-learn</span><span>EDA</span><span>SQL</span>
                </div>
              </div>
            </article>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.12} className="experience-stats-col">
          <div className="experience-stat-item">
            <span className="experience-stat-num">3+</span>
            <span className="experience-stat-label">Years exploring</span>
          </div>
          <div className="experience-divider" />
          <div className="experience-stat-item">
            <span className="experience-stat-num">18</span>
            <span className="experience-stat-label">Public repos</span>
          </div>
          <div className="experience-divider" />
          <div className="experience-stat-item">
            <span className="experience-stat-num">6+</span>
            <span className="experience-stat-label">ML / AI builds</span>
          </div>
          <div className="experience-divider" />
          <div className="experience-stat-item">
            <span className="experience-stat-num">Tegal</span>
            <span className="experience-stat-label">Based in Indonesia</span>
          </div>
        </FadeInUp>

        <WaveDividerQuote />
      </div>
    </section>
  );
}
