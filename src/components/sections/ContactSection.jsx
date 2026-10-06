'use client';
"use client";

import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { FadeInUp } from '@/components/ui/fade-in-up';

export default function ContactSection() {
  const [formState, setFormState] = React.useState({ name: '', email: '', message: '' });
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <em>something intelligent</em>
          </h2>
          <p className="contact-sub">
            Open for internships, data science collaborations, and applied AI projects. Response within 24 hours.
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
                <label htmlFor="contact-name" className="contact-label">Name</label>
                <input
                  id="contact-name"
                  className="contact-input"
                  type="text"
                  placeholder="Your name"
                  required
                  value={formState.name}
                  onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email" className="contact-label">Email</label>
                <input
                  id="contact-email"
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
              <label htmlFor="contact-message" className="contact-label">Message</label>
              <textarea
                id="contact-message"
                className="contact-input contact-textarea"
                placeholder="Tell me about your dataset, model, or AI idea..."
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
