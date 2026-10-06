'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Mail, X } from 'lucide-react';

// ── Canvas constants ──────────────────────────────────────────────────────────
export const TOTAL_FRAMES = 64;
export const DEFAULT_LERP_FACTOR = 0.32;
export const INITIAL_LERP_FACTOR = 0.04;
export const FACE_NORM_X = 0.50;
export const FACE_NORM_Y = 0.38;

// Shortest path circular angular interpolation
export function lerpAngle(current, target, factor) {
  let diff = target - current;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  return current + diff * factor;
}

export default function HeroSection() {
  const canvasRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cursor state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isEyeContactState, setIsEyeContactState] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // References for animation loop
  const framesRef = useRef([]);
  const centerFrameRef = useRef(null);

  // Real mouse position vs virtual smoothed tracking position
  const realMouseRef = useRef(
    typeof window !== 'undefined'
      ? { x: window.innerWidth / 2, y: window.innerHeight * 0.4 }
      : { x: 0, y: 0 }
  );
  const virtualMouseRef = useRef(
    typeof window !== 'undefined'
      ? { x: window.innerWidth / 2, y: window.innerHeight * 0.4 }
      : { x: 0, y: 0 }
  );
  const isInsideWindowRef = useRef(false);
  const lastMouseMoveTimeRef = useRef(0);
  const startTimeRef = useRef(0);

  const smoothedAngleRef = useRef(0);
  const isEyeContactRef = useRef(true);
  const animFrameIdRef = useRef(null);
  const handleInteractiveEnter = () => setIsHovered(true);
  const handleInteractiveLeave = () => setIsHovered(false);

  // 1. Preload 64 WebP frames + center.webp
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = TOTAL_FRAMES + 1;
    const framesArray = new Array(TOTAL_FRAMES);
    let isMounted = true;

    const checkComplete = () => {
      if (!isMounted) return;
      loadedCount++;
      const pct = Math.round((loadedCount / totalToLoad) * 100);
      setLoadingProgress(pct);
      if (loadedCount >= totalToLoad) {
        framesRef.current = framesArray;
        setTimeout(() => {
          if (isMounted) {
            setIsLoaded(true);
            startTimeRef.current = performance.now();
          }
        }, 300);
      }
    };

    // Safety fallback: reveal within 2.5s if network stalls
    const safetyTimer = setTimeout(() => {
      if (isMounted && !isLoaded) {
        framesRef.current = framesArray;
        setIsLoaded(true);
        startTimeRef.current = performance.now();
      }
    }, 2500);

    // Load 64 rotation frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIdx = String(i).padStart(2, '0');
      img.src = `/frames/frame_${paddedIdx}.webp`;
      img.onload = checkComplete;
      img.onerror = checkComplete;
      framesArray[i] = img;
    }

    // Load center.webp
    const centerImg = new Image();
    centerImg.src = '/center.webp';
    centerImg.onload = () => {
      centerFrameRef.current = centerImg;
      checkComplete();
    };
    centerImg.onerror = checkComplete;

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      framesArray.forEach(img => { if (img) img.onload = null; });
      if (centerImg) centerImg.onload = null;
    };
  }, []);

  // 2. High-performance canvas render loop
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let lastHudUpdate = 0;

    const render = (time) => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = '#e5e7e7';
      ctx.fillRect(0, 0, width, height);

      const srcW = 1280;
      const srcH = 720;
      const scale = Math.max(width / srcW, height / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = (width - drawW) / 2;
      const NAV_OFFSET = 72;
      const drawY = (height - drawH) / 2 + NAV_OFFSET;

      const faceScreenX = drawX + FACE_NORM_X * drawW;
      const faceScreenY = drawY + FACE_NORM_Y * drawH;

      const elapsedSinceStart = time - startTimeRef.current;
      const rampProgress = Math.min(1.0, Math.max(0.0, elapsedSinceStart / 2500));
      const easedRamp = 1 - Math.pow(1 - rampProgress, 3);
      const currentLerpFactor = INITIAL_LERP_FACTOR + (DEFAULT_LERP_FACTOR - INITIAL_LERP_FACTOR) * easedRamp;

      const timeSinceLastMove = time - lastMouseMoveTimeRef.current;
      const isCursorActive = isInsideWindowRef.current && timeSinceLastMove < 4500;

      let targetX, targetY;
      if (isCursorActive) {
        targetX = realMouseRef.current.x;
        targetY = realMouseRef.current.y;
      } else {
        targetX = faceScreenX;
        targetY = faceScreenY;
      }

      const virtualSpeed = isCursorActive ? currentLerpFactor : 0.08;
      virtualMouseRef.current.x += (targetX - virtualMouseRef.current.x) * virtualSpeed;
      virtualMouseRef.current.y += (targetY - virtualMouseRef.current.y) * virtualSpeed;

      const dx = virtualMouseRef.current.x - faceScreenX;
      const dy = virtualMouseRef.current.y - faceScreenY;
      const distance = Math.hypot(dx, dy);

      const screenRadiusRef = Math.min(width, height);
      const baseDeadzone = screenRadiusRef * 0.09;
      const enterDeadzone = baseDeadzone * 0.88;
      const exitDeadzone = baseDeadzone * 1.12;

      let inDeadzone = isEyeContactRef.current;
      if (inDeadzone) {
        if (distance > exitDeadzone) inDeadzone = false;
      } else {
        if (distance < enterDeadzone) inDeadzone = true;
      }
      isEyeContactRef.current = inDeadzone;

      let currentFrameImg;

      if (inDeadzone || (!isCursorActive && distance < 20)) {
        currentFrameImg = centerFrameRef.current;
      } else {
        const rawAngle = Math.atan2(dy, dx);
        let targetAngle = rawAngle + Math.PI / 2;
        while (targetAngle < 0) targetAngle += 2 * Math.PI;
        while (targetAngle >= 2 * Math.PI) targetAngle -= 2 * Math.PI;

        smoothedAngleRef.current = lerpAngle(smoothedAngleRef.current, targetAngle, currentLerpFactor);
        while (smoothedAngleRef.current < 0) smoothedAngleRef.current += 2 * Math.PI;
        while (smoothedAngleRef.current >= 2 * Math.PI) smoothedAngleRef.current -= 2 * Math.PI;

        const frameIndex = Math.round((smoothedAngleRef.current / (2 * Math.PI)) * TOTAL_FRAMES) % TOTAL_FRAMES;
        currentFrameImg = framesRef.current[frameIndex];
      }

      if (currentFrameImg?.complete && currentFrameImg.naturalWidth > 0) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(currentFrameImg, drawX, drawY, drawW, drawH);
      } else if (centerFrameRef.current?.complete) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(centerFrameRef.current, drawX, drawY, drawW, drawH);
      }

      ctx.restore();

      if (time - lastHudUpdate > 66) {
        lastHudUpdate = time;
        setIsEyeContactState(inDeadzone);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isLoaded]);

  // 3. Mouse Tracking & Boundary Detection
  useEffect(() => {
    const handleMouseMove = (e) => {
      realMouseRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTimeRef.current = performance.now();
      isInsideWindowRef.current = true;
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
    };

    const handleMouseEnter = () => {
      isInsideWindowRef.current = true;
      lastMouseMoveTimeRef.current = performance.now();
      setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      isInsideWindowRef.current = false;
      setCursorVisible(false);
    };

    const handleWindowBlur = () => {
      isInsideWindowRef.current = false;
      setCursorVisible(false);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        realMouseRef.current = { x: touch.clientX, y: touch.clientY };
        lastMouseMoveTimeRef.current = performance.now();
        isInsideWindowRef.current = true;
        setCursorPos({ x: touch.clientX, y: touch.clientY });
        setCursorVisible(true);
      }
    };

    const handleTouchEnd = () => {
      isInsideWindowRef.current = false;
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section className="hero-section-wrapper">
      {/* Canvas placeholder — logic added in 21.3 */}
      <div className="hero-canvas-container">
        <canvas ref={canvasRef} className="hero-canvas" />
      </div>

      {/* Preloader placeholder — logic added in 21.4 */}
      <div className={`loader-overlay ${isLoaded ? 'hidden' : ''}`} aria-hidden="true">
        <p className="loader-title">Alaika</p>
        <div className="loader-bar-bg">
          <div className="loader-bar-fill" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="loader-text">
          {loadingProgress < 100 ? `Synthesizing Frames ${loadingProgress}%` : 'Entering Experience'}
        </p>
      </div>

      {/* Hero UI Overlay */}
      <div className="ui-overlay">
        <div className="hero-content">
          <div className="greeting-text">
            <span>Hi, I'm</span>
          </div>
          <h1 className="name-heading">Alaika</h1>
          <p className="bio-text">
            Full Stack Developer specializing in high-performance web systems,
            interactive architectures, and luxury digital design. Crafting zero-latency experiences.
          </p>
          <div className="cta-group">
            <button
              className="btn-primary"
              onMouseEnter={handleInteractiveEnter}
              onMouseLeave={handleInteractiveLeave}
              onClick={() => setActiveModal('resume')}
            >
              <span>Resume</span>
              <ArrowUpRight className="arrow-icon" />
            </button>
            <button
              className="btn-secondary"
              onMouseEnter={handleInteractiveEnter}
              onMouseLeave={handleInteractiveLeave}
              onClick={() => setActiveModal('contact')}
            >
              <Mail size={15} />
              <span>Let's Talk</span>
            </button>
          </div>
        </div>


        {/* Gaze HUD — bottom right */}
        <div className="gaze-hud">
          <div className="gaze-tag">
            <div className={`gaze-dot-active ${isEyeContactState ? '' : 'gaze-dot-contact'}`} />
            <span>{isEyeContactState ? 'EYE CONTACT' : 'TRACKING'}</span>
          </div>
        </div>
      </div>

      {/* Custom Cursor */}
      <div
        className={`cursor-dot ${!cursorVisible ? 'opacity-0' : ''}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      {/* Blur fade-out at bottom */}
      <div className="hero-bottom-blur" />

      {/* 5. Modals */}
      {activeModal && (
        <div className="contact-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="contact-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
              <X size={16} />
            </button>

            {activeModal === 'contact' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Let's Create Together</h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Open for select engineering contracts, creative web builds, and technical leadership roles.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <a href="mailto:alaika@example.com" className="btn-primary" style={{ justifyContent: 'flex-start', padding: '0.7rem 1.2rem' }}>
                    <Mail size={16} />
                    <span>alaika@example.com</span>
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <a href="https://github.com/Alaika10" target="_blank" rel="noreferrer" style={{ color: '#333' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#333' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                </div>
              </div>
            )}

            {activeModal === 'resume' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Professional Dossier</h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Full curriculum vitae detailing experience with high-scale tech firms, open-source work, and patents.
                </p>
                <a
                  href="/resume.pdf"
                  download
                  className="btn-primary"
                  style={{ display: 'inline-flex', padding: '0.7rem 1.2rem' }}
                >
                  <span>Download CV</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

