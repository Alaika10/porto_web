'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function WavePath({ className, color = 'currentColor', strokeWidth = 3, ...props }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const progressRef = useRef(0);
  const xRef = useRef(0.5);
  const timeRef = useRef(Math.PI / 2);
  const reqIdRef = useRef(null);

  const Y_MID = 250;

  const getWidth = () =>
    containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;

  const setPath = (prog) => {
    const w = getWidth();
    if (pathRef.current) {
      const cpX = w * xRef.current;
      const cpY = Y_MID + prog;
      pathRef.current.setAttributeNS(
        null, 'd',
        `M 0 ${Y_MID} Q ${cpX} ${cpY} ${w} ${Y_MID}`
      );
    }
  };

  useEffect(() => {
    setPath(0);
    const handleResize = () => setPath(progressRef.current);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, []);

  const lerp = (a, b, t) => a * (1 - t) + b * t;

  const manageMouseEnter = () => {
    if (reqIdRef.current) {
      cancelAnimationFrame(reqIdRef.current);
      reqIdRef.current = null;
    }
    timeRef.current = Math.PI / 2;
  };

  const manageMouseMove = (e) => {
    const { movementY, clientX } = e;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      xRef.current = (clientX - rect.left) / rect.width;
    }
    progressRef.current += movementY * 3;
    setPath(progressRef.current);
  };

  const manageMouseLeave = () => { animateOut(); };

  const animateOut = () => {
    const newProgress = progressRef.current * Math.sin(timeRef.current);
    progressRef.current = lerp(progressRef.current, 0, 0.025);
    timeRef.current += 0.2;
    setPath(newProgress);
    if (Math.abs(progressRef.current) > 0.75) {
      reqIdRef.current = requestAnimationFrame(animateOut);
    } else {
      timeRef.current = Math.PI / 2;
      progressRef.current = 0;
      setPath(0);
      reqIdRef.current = null;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)} {...props}>
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        style={{ position: 'absolute', left: 0, right: 0, top: '-60px', height: '120px', cursor: 'crosshair', zIndex: 10 }}
      />
      <svg
        style={{ position: 'absolute', width: '100%', height: '700px', top: '-350px', pointerEvents: 'none', overflow: 'visible' }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default WavePath;
