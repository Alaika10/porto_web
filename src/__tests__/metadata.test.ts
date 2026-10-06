import { describe, it, expect } from 'vitest';
import { metadata } from '../app/layout';

describe('metadata completeness (Property 4)', () => {
  it('should have title.default', () => {
    expect(metadata.title).toBeDefined();
    const title = metadata.title as { default: string; template: string };
    expect(title.default).toBeTruthy();
    expect(title.default.length).toBeGreaterThan(0);
  });

  it('should have description', () => {
    expect(metadata.description).toBeDefined();
    expect(metadata.description).not.toBe('');
  });

  it('should have openGraph.title', () => {
    expect(metadata.openGraph?.title).toBeTruthy();
  });

  it('should have openGraph.type', () => {
    expect(metadata.openGraph?.type).toBe('website');
  });

  it('should have openGraph.locale', () => {
    expect(metadata.openGraph?.locale).toBeTruthy();
  });

  it('should have openGraph.siteName', () => {
    expect(metadata.openGraph?.siteName).toBeTruthy();
  });

  it('should have twitter.card', () => {
    expect(metadata.twitter?.card).toBeTruthy();
  });

  it('should have robots.index = true', () => {
    const robots = metadata.robots as { index: boolean; follow: boolean };
    expect(robots?.index).toBe(true);
  });

  it('should have robots.follow = true', () => {
    const robots = metadata.robots as { index: boolean; follow: boolean };
    expect(robots?.follow).toBe(true);
  });

  it('should have alternates.canonical', () => {
    const alternates = metadata.alternates as { canonical: string };
    expect(alternates?.canonical).toBeTruthy();
  });

  it('should not have any undefined required fields', () => {
    const requiredFields = [
      metadata.description,
      metadata.openGraph?.title,
      metadata.openGraph?.type,
      metadata.openGraph?.locale,
      metadata.openGraph?.siteName,
    ];
    requiredFields.forEach(field => {
      expect(field).toBeDefined();
      expect(field).not.toBe('');
    });
  });
});

import fc from 'fast-check';

describe('Property 4: Metadata Field Completeness (fast-check)', () => {
  it('all required metadata fields should never be undefined or empty', () => {
    // Property: given the metadata object, all required fields are non-empty strings
    const requiredFields: Array<[string, unknown]> = [
      ['description', metadata.description],
      ['openGraph.title', (metadata.openGraph as Record<string, unknown>)?.title],
      ['openGraph.type', (metadata.openGraph as Record<string, unknown>)?.type],
      ['openGraph.locale', (metadata.openGraph as Record<string, unknown>)?.locale],
      ['openGraph.siteName', (metadata.openGraph as Record<string, unknown>)?.siteName],
      ['twitter.card', (metadata.twitter as Record<string, unknown>)?.card],
    ];

    fc.assert(
      fc.property(
        // Generate arbitrary field indices to check
        fc.integer({ min: 0, max: requiredFields.length - 1 }),
        (idx) => {
          const [fieldName, value] = requiredFields[idx];
          expect(value, `${fieldName} must not be undefined`).toBeDefined();
          expect(value, `${fieldName} must not be empty`).not.toBe('');
          return true;
        }
      )
    );
  });
});
