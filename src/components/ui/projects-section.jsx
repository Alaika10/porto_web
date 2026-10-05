import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    id: 'aura-canvas',
    num: '01',
    title: 'Aura Canvas Tracking Engine',
    category: 'Creative Web',
    description: 'Mathematically rigorous 360° circular trajectory mapping with angular shortest-path lerping and seamless WebP frame rendering at 60fps with zero alpha ghosting.',
    tech: ['WebGL', 'Canvas API', 'React', 'TypeScript'],
    metric: '60 FPS · 0ms lag',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    url: '#',
  },
  {
    id: 'vortex-cloud',
    num: '02',
    title: 'Vortex Cloud Event Mesh',
    category: 'Distributed Systems',
    description: 'Distributed event-driven infrastructure processing 10M+ events/day with dynamic backpressure, geo-replicated clusters, and zero-downtime rolling deployments.',
    tech: ['Go', 'gRPC', 'Redis', 'Kubernetes'],
    metric: '10M+ events/day · <10ms p99',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    url: '#',
  },
  {
    id: 'synapse-ai',
    num: '03',
    title: 'Synapse AI Multimodal Studio',
    category: 'AI & Tools',
    description: 'Visual node-based canvas for orchestrating multi-step LLM workflows with real-time token streaming via SSE and autonomous vision tool execution.',
    tech: ['Next.js', 'FastAPI', 'Python', 'OpenAI'],
    metric: 'Realtime SSE · Multi-agent',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    url: '#',
  },
];

export function ProjectsSection() {
  return (
    <section id="project" className="proj-section">
      <div className="about-grid-bg" aria-hidden="true" />

      <div className="proj-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="proj-header"
        >
          <span className="about-eyebrow">Selected Works</span>
          <h2 className="about-title">
            Crafted with<br />
            <em>precision & purpose</em>
          </h2>
        </motion.div>

        {/* Project list */}
        <div className="proj-list">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="proj-row"
            >
              {/* Number */}
              <span className="proj-num">{p.num}</span>

              {/* Thumb */}
              <div className="proj-thumb">
                <img src={p.image} alt={p.title} loading="lazy" />
              </div>

              {/* Main content */}
              <div className="proj-body">
                <div className="proj-top">
                  <span className="proj-cat">{p.category}</span>
                  <span className="proj-metric">{p.metric}</span>
                </div>
                <h3 className="proj-title">{p.title}</h3>
                <p className="proj-desc">{p.description}</p>
                <div className="proj-tags">
                  {p.tech.map(t => <span key={t}>{t}</span>)}
                </div>
              </div>

              {/* Arrow */}
              <span className="proj-arrow">
                <ArrowUpRight size={18} />
              </span>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="proj-cta"
        >
          <a href="mailto:alaika@example.com" className="btn-primary">
            <span>Start a conversation</span>
            <ArrowUpRight size={15} />
          </a>
          <a href="https://github.com/Alaika10" target="_blank" rel="noreferrer" className="btn-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            <span>View all on GitHub</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
