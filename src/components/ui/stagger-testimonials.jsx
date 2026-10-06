'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "Alaika turned a messy receipt dataset into a workflow our UMKM partners could actually use.",
    by: "Raka, Product Lead at Strukly",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 1,
    testimonial: "The classification pipeline was clean, documented, and the evaluation metrics were honest — not just high scores.",
    by: "Nadia, Lecturer in Informatics",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 2,
    testimonial: "Strong mix of data intuition and practical AI. The air-quality analysis was easy to present to non-technical readers.",
    by: "Sinta, Research Collaborator",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 3,
    testimonial: "Notebooks were reproducible and the feature engineering choices were well reasoned. Rare at student level.",
    by: "Bima, Data Analyst",
    imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12. Thoughtful applied machine learning, not just model-of-the-week.",
    by: "Andre, ML Mentor",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 5,
    testimonial: "Delivered a working vision experiment ahead of schedule. Clear plots, clear caveats, clean Git history.",
    by: "Jeremy, Project Partner",
    imgSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 6,
    testimonial: "Alaika's DataLabs dashboard made our experiment results actually discussable in class.",
    by: "Pam, Informatics Lab",
    imgSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 7,
    testimonial: "From EDA to a logistic model in a tight timeline. The evaluation write-up was the best part.",
    by: "Daniel, Data Science Peer",
    imgSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 8,
    testimonial: "It's just the most careful student ML work I've seen this year. Would collaborate again immediately.",
    by: "Fernando, Research Assistant",
    imgSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=250&fit=crop&q=80",
  },
  {
    tempId: 9,
    testimonial: "We've been iterating GenAI ideas together. Every notebook is tighter than the last.",
    by: "Andy, AI Study Group",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=250&fit=crop&q=80",
  },
];

const TestimonialCard = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        'absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out'
      )}
      style={{
        width: cardSize,
        height: cardSize,
        background: isCenter ? '#111418' : '#ffffff',
        borderColor: isCenter ? '#111418' : '#e5e7eb',
        zIndex: isCenter ? 10 : 0,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? '0px 8px 0px 4px #e5e7eb' : '0px 0px 0px 0px transparent',
      }}
    >
      {/* Corner cut diagonal line */}
      <span
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          background: isCenter ? '#374151' : '#e5e7eb',
        }}
      />

      <Image
        src={testimonial.imgSrc}
        alt={testimonial.by.split(',')[0]}
        width={48}
        height={56}
        className="mb-4 h-14 w-12 object-cover object-top"
        style={{
          boxShadow: isCenter
            ? '3px 3px 0px rgba(255,255,255,0.15)'
            : '3px 3px 0px #f3f4f6',
        }}
      />

      <h3
        className="text-base sm:text-lg font-semibold leading-snug"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: isCenter ? '#ffffff' : '#111418',
        }}
      >
        "{testimonial.testimonial}"
      </h3>

      <p
        className="absolute bottom-8 left-8 right-8 text-xs italic"
        style={{ color: isCenter ? '#9ca3af' : '#6b7280' }}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 600, background: '#f0f1f1' }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      {/* Navigation buttons */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className="flex h-12 w-12 items-center justify-center border-2 border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-900 hover:text-white hover:border-gray-900 focus-visible:outline-none"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="flex h-12 w-12 items-center justify-center border-2 border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-900 hover:text-white hover:border-gray-900 focus-visible:outline-none"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default StaggerTestimonials;
