'use client';

import React from 'react';
import { WavePath } from '@/components/ui/wave-path';

export default function WaveDividerQuote({
  quote = 'Experience the precision of engineers through their work. Let the beauty of code inspire you.',
  attribution = 'World of Craft',
  color = 'rgba(0,0,0,0.75)',
  strokeWidth = 3,
}) {
  return (
    <div className="wave-quote-divider">
      <div className="wave-quote-line">
        <WavePath color={color} strokeWidth={strokeWidth} />
      </div>
      <div className="wave-quote-content">
        <div className="wave-quote-text-wrap">
          <p className="wave-quote-attribution">{attribution}</p>
          <p className="wave-quote-body">{quote}</p>
        </div>
      </div>
    </div>
  );
}


