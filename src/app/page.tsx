import NavbarWrapper from '@/components/sections/NavbarWrapper';
import HeroSectionLazy from '@/components/sections/HeroSectionLazy';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import RepositorySection from '@/components/sections/RepositorySection';
import ArtikelSection from '@/components/sections/ArtikelSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import ContactSection from '@/components/sections/ContactSection';
import FooterSection from '@/components/sections/FooterSection';
import { WavePath } from '@/components/ui/wave-path';

export default function Home() {
  return (
    <>
      {/* Navbar â€” fixed/sticky header, outside <main> per semantic HTML */}
      <NavbarWrapper />

      {/* Main content: semantically correct wrapper */}
      <main>
        {/* Hero â€” canvas-powered, client-only (ssr: false via HeroSectionLazy) */}
        <HeroSectionLazy />

        {/* About */}
        <AboutSection />

        {/* Experience + quote line */}
        <ExperienceSection />

        {/* Projects */}
        <ProjectsSection />

        {/* Repository */}
        <RepositorySection />

        {/* Artikel */}
        <ArtikelSection />

        {/* Testimonials */}
        <TestimonialSection />

        {/* wave divider â€” dark transition */}
        <div className="wave-divider wave-divider--dark">
          <WavePath className="" color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        </div>

        {/* Contact */}
        <ContactSection />
      </main>

      {/* Footer â€” outside <main> per semantic HTML */}
      <FooterSection />
    </>
  );
}

