'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function WavePath({ className, color = 'currentColor', strokeWidth = 3, compact = false, ...props }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const progressRef = useRef(0);
  const xRef = useRef(0.5);
  const timeRef = useRef(Math.PI / 2);
  const reqIdRef = useRef(null);

  const Y_MID = compact ? 120 : 250;

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
  }, [compact]);

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
    <div
      ref={containerRef}
      className={cn('wave-path', compact && 'wave-path--compact', className)}
      {...props}
    >
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        className="wave-path-hit"
      />
      <svg className="wave-path-svg" aria-hidden="true">
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
