'use client';

import React from 'react';
import { WavePath } from '@/components/ui/wave-path';

export default function WaveDividerQuote({
  quote = 'Experience the precision of data scientists through their work. Let the beauty of insight inspire you.',
  attribution = 'World of Craft',
  color = 'rgba(0,0,0,0.75)',
  strokeWidth = 3,
}) {
  return (
    <div className="wave-quote-divider">
      <div className="wave-quote-cluster">
        <WavePath compact color={color} strokeWidth={strokeWidth} />
        <div className="wave-quote-content">
          <p className="wave-quote-attribution">{attribution}</p>
          <p className="wave-quote-body">{quote}</p>
        </div>
      </div>
    </div>
  );
}
