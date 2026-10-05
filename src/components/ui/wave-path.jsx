'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function WavePath({ className, color = 'currentColor', strokeWidth = 1.5, ...props }) {
  const path = useRef(null);
  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId = null;

  useEffect(() => {
    setPath(progress);
    const handleResize = () => setPath(progress);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setPath = (prog) => {
    const width = window.innerWidth * 0.7;
    if (path.current) {
      path.current.setAttributeNS(
        null,
        'd',
        `M0 100 Q${width * x} ${100 + prog * 2.2}, ${width} 100`,
      );
    }
  };

  const lerp = (a, b, t) => a * (1 - t) + b * t;

  const manageMouseEnter = () => {
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  const manageMouseMove = (e) => {
    const { movementY, clientX } = e;
    if (path.current) {
      const bound = path.current.getBoundingClientRect();
      x = (clientX - bound.left) / bound.width;
      progress += movementY;
      setPath(progress);
    }
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp(progress, 0, 0.018);
    time += 0.15;
    setPath(newProgress);
    if (Math.abs(progress) > 0.5) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  };

  return (
    <div className={cn('relative h-px w-full', className)} {...props}>
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        className="relative z-10 w-full"
        style={{ cursor: 'crosshair', top: '-30px', height: '80px' }}
      />
      <svg
        className="absolute w-full pointer-events-none"
        style={{ top: '-180px', height: '460px' }}
      >
        <path
          ref={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  );
}

export default WavePath;
