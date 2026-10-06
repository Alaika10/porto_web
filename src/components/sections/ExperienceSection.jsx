'use client';
"use client";

import { motion } from 'motion/react';
import { FadeInUp } from '@/components/ui/fade-in-up';

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
  );
}
