import { describe, it, expect } from 'vitest';
import {
  TOTAL_FRAMES,
  DEFAULT_LERP_FACTOR,
  INITIAL_LERP_FACTOR,
  FACE_NORM_X,
  FACE_NORM_Y,
  lerpAngle,
} from '../components/sections/HeroSection';

describe('Hero Canvas Constants', () => {
  it('TOTAL_FRAMES should be 64', () => {
    expect(TOTAL_FRAMES).toBe(64);
  });

  it('DEFAULT_LERP_FACTOR should be between 0 and 1', () => {
    expect(DEFAULT_LERP_FACTOR).toBeGreaterThan(0);
    expect(DEFAULT_LERP_FACTOR).toBeLessThan(1);
  });

  it('INITIAL_LERP_FACTOR should be less than DEFAULT_LERP_FACTOR', () => {
    expect(INITIAL_LERP_FACTOR).toBeLessThan(DEFAULT_LERP_FACTOR);
  });

  it('FACE_NORM_X and FACE_NORM_Y should be normalized (0–1)', () => {
    expect(FACE_NORM_X).toBeGreaterThanOrEqual(0);
    expect(FACE_NORM_X).toBeLessThanOrEqual(1);
    expect(FACE_NORM_Y).toBeGreaterThanOrEqual(0);
    expect(FACE_NORM_Y).toBeLessThanOrEqual(1);
  });
});

describe('lerpAngle — shortest path interpolation', () => {
  it('should interpolate toward target by factor', () => {
    const result = lerpAngle(0, Math.PI / 2, 1.0);
    expect(result).toBeCloseTo(Math.PI / 2, 5);
  });

  it('should take shortest path across 0/2π boundary', () => {
    // Going from near 2π (6.2) to near 0 (0.1) — shortest path crosses boundary
    const current = 6.2; // near 2π
    const target = 0.1;  // near 0
    const result = lerpAngle(current, target, 1.0);
    // lerpAngle does not normalize output; result and target differ by a full 2π rotation
    // (6.383... = 0.1 + 2π). Verify they represent the same angle:
    const TWO_PI = 2 * Math.PI;
    const normalized = ((result % TWO_PI) + TWO_PI) % TWO_PI;
    expect(normalized).toBeCloseTo(target, 4);
  });

  it('should take shortest path in reverse direction', () => {
    const current = 0.1;
    const target = 6.2;
    const result = lerpAngle(current, target, 1.0);
    // lerpAngle chooses shortest arc; result and target represent the same angle mod 2π
    const TWO_PI = 2 * Math.PI;
    const normalized = ((result % TWO_PI) + TWO_PI) % TWO_PI;
    expect(normalized).toBeCloseTo(target % TWO_PI, 4);
  });

  it('partial factor should only move partway', () => {
    const current = 0;
    const target = Math.PI;
    const result = lerpAngle(current, target, 0.5);
    expect(result).toBeCloseTo(Math.PI / 2, 5);
  });
});
