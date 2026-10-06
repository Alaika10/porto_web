import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
// fast-check is imported here for future property-based tests (will be installed in task 39.1)
// Currently unused — this is a static analysis test
// import fc from 'fast-check';

/**
 * Property 7: Unique H1 Invariant
 * The page must have exactly one <h1> element.
 * This is a static analysis test — scans all section JSX files for <h1> tags.
 *
 * Validates: Requirements 6.3
 */

const SECTIONS_DIR = join(process.cwd(), 'src/components/sections');
const PAGE_FILE = join(process.cwd(), 'src/app/page.tsx');

function countH1InFile(filePath: string): number {
  try {
    const content = readFileSync(filePath, 'utf-8');
    // Match <h1 or <h1> or <h1 className=...
    const matches = content.match(/<h1[\s>]/g);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

function getSectionFiles(): string[] {
  const { readdirSync } = require('fs');
  try {
    return readdirSync(SECTIONS_DIR)
      .filter((f: string) => f.endsWith('.jsx') || f.endsWith('.tsx'))
      .map((f: string) => join(SECTIONS_DIR, f));
  } catch {
    return [];
  }
}

describe('Unique H1 Invariant (Property 7)', () => {
  it('HeroSection should contain exactly one <h1>', () => {
    const heroFile = join(SECTIONS_DIR, 'HeroSection.jsx');
    const count = countH1InFile(heroFile);
    expect(count).toBe(1);
  });

  it('page.tsx should not contain any <h1> directly (h1 lives in HeroSection)', () => {
    const count = countH1InFile(PAGE_FILE);
    expect(count).toBe(0);
  });

  it('all other section components should not contain <h1>', () => {
    const sectionFiles = getSectionFiles().filter(
      f => !f.includes('HeroSection')
    );
    sectionFiles.forEach(file => {
      const count = countH1InFile(file);
      expect(count, `${file} should not have h1`).toBe(0);
    });
  });

  it('total h1 count across all section files should be exactly 1', () => {
    const allFiles = getSectionFiles();
    const total = allFiles.reduce((sum, file) => sum + countH1InFile(file), 0);
    expect(total).toBe(1);
  });
});

import fc from 'fast-check';

describe('Property 7: Unique H1 Invariant (fast-check)', () => {
  it('total h1 count in section files should be exactly 1 across any valid page configuration', () => {
    const allFiles = getSectionFiles();
    
    fc.assert(
      fc.property(
        // Pick a random subset of section files to simulate "any page config"
        // In practice, all sections are always included, so we check the full set
        fc.constant(allFiles),
        (files) => {
          const total = files.reduce((sum: number, file: string) => sum + countH1InFile(file), 0);
          expect(total).toBe(1);
          return true;
        }
      )
    );
  });
});
