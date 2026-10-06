'use client';
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';

function DesktopNav({ navItems, onScrollTo }) {
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(null);
  const timerRef = React.useRef(null);

  const openDropdown = () => {
    clearTimeout(timerRef.current);
    setAboutOpen(true);
  };
  const closeDropdown = () => {
    timerRef.current = setTimeout(() => setAboutOpen(false), 120);
  };

  return (
    <div
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', pointerEvents: 'none' }}
    >
      {/* About — with dropdown */}
      <div
        style={{ position: 'relative', pointerEvents: 'auto' }}
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdown}
      >
        <button
          onClick={() => onScrollTo('#about')}
          onMouseEnter={() => setHovered('about')}
          onMouseLeave={() => setHovered(null)}
          style={{ position: 'relative', padding: '10px 20px', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#52525b', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {hovered === 'about' && (
            <motion.div layoutId="nav-hovered" style={{ position: 'absolute', inset: 0, borderRadius: '9999px', background: '#f3f4f6', zIndex: 0 }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>About</span>
          <svg style={{ position: 'relative', zIndex: 1, transition: 'transform 0.2s', transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <AnimatePresence>
          {aboutOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '6px', minWidth: '170px', zIndex: 200, pointerEvents: 'auto' }}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              {[
                { label: 'About', sub: 'Who I am', href: '#about' },
                { label: 'Experience', sub: 'Career & milestones', href: '#experience' },
              ].map(item => (
                <button
                  key={item.href}
                  onClick={() => { onScrollTo(item.href); setAboutOpen(false); }}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '9px 12px', borderRadius: '9px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111418' }}>{item.label}</span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '1px' }}>{item.sub}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Regular nav items */}
      {navItems.map((item, idx) => (
        <div key={item.link} style={{ position: 'relative', pointerEvents: 'auto' }}>
          <a
            href={item.link}
            onClick={e => { e.preventDefault(); onScrollTo(item.link); }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{ position: 'relative', display: 'block', padding: '10px 20px', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 500, color: '#52525b', textDecoration: 'none' }}
          >
            {hovered === idx && (
              <motion.div layoutId="nav-hovered" style={{ position: 'absolute', inset: 0, borderRadius: '9999px', background: '#f3f4f6', zIndex: 0 }} />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{item.name}</span>
          </a>
        </div>
      ))}
    </div>
  );
}

export default function NavbarWrapper({ onModalOpen = null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Project',    link: '#project',     modal: null },
    { name: 'Repository', link: '#repository',  modal: null },
    { name: 'Artikel',    link: '#artikel',     modal: null },
    { name: 'Contact',    link: '#contact',     modal: null },
  ];

  const handleScrollTo = (href) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header>
      <nav aria-label="Main navigation">
        <Navbar>
          {/* Desktop Nav */}
          <NavBody>
            <a href="#" className="relative z-20 flex items-center px-2 py-1">
              <span
                style={{ fontFamily: "'Dancing Script', cursive" }}
                className="text-xl font-bold text-gray-900 tracking-wide"
              >
                Alaika
              </span>
            </a>
            <DesktopNav navItems={navItems} onScrollTo={handleScrollTo} />
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold bg-transparent text-gray-700 hover:text-black transition"
                onClick={() => onModalOpen?.('resume')}
              >
                Resume
              </button>
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-black transition shadow-sm"
                onClick={() => onModalOpen?.('contact')}
              >
                Let's Talk
              </button>
            </div>
          </NavBody>

          {/* Mobile Nav */}
          <MobileNav>
            <MobileNavHeader>
              <a href="#" className="flex items-center px-2">
                <span
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  className="text-xl font-bold text-gray-900"
                >
                  Alaika
                </span>
              </a>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (item.modal) {
                      e.preventDefault();
                      onModalOpen?.(item.modal);
                    } else if (item.link?.startsWith('#')) {
                      e.preventDefault();
                      const target = document.querySelector(item.link);
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-base font-medium text-neutral-700 hover:text-black transition"
                >
                  {item.name}
                </a>
              ))}
              {/* Experience sub-item */}
              <a
                href="#experience"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm font-medium text-neutral-400 hover:text-black transition pl-3 -mt-2"
              >
                ↳ Experience
              </a>
              <div className="flex w-full flex-col gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onModalOpen?.('resume'); }}
                  className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  Resume
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onModalOpen?.('contact'); }}
                  className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-black transition"
                >
                  Let's Talk
                </button>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </nav>
    </header>
  );
}
