'use client';

import { motion } from 'motion/react';

/**
 * Shared FadeInUp animation wrapper.
 * Usage: <FadeInUp delay={0.1}>content</FadeInUp>
 */
export function FadeInUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
