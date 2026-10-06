"use client";

import dynamic from 'next/dynamic';

// Dynamically import HeroSection with ssr: false — allowed in Client Components
const HeroSection = dynamic(
  () => import('@/components/sections/HeroSection'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{ width: '100vw', height: '100vh', backgroundColor: '#e5e7e7' }}
        aria-hidden="true"
      />
    ),
  }
);

export default function HeroSectionLazy() {
  return <HeroSection />;
}
