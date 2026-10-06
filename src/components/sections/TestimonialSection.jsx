'use client';
"use client";

import { FadeInUp } from '@/components/ui/fade-in-up';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

export default function TestimonialSection() {
  return (
    <section id="testimonial" className="testimonial-section">
      <div className="testimonial-container">
        <FadeInUp className="testimonial-header">
          <span className="about-eyebrow">Testimonials</span>
          <h2 className="about-title">
            What collaborators<br />
            <em>say about the work</em>
          </h2>
        </FadeInUp>
      </div>
      <StaggerTestimonials />
    </section>
  );
}
