import { describe, it, expect, afterEach } from 'vitest';
import robots from '../app/robots';

describe('robots()', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('should allow all user agents', () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.userAgent).toBe('*');
  });

  it('should allow all paths', () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.allow).toBe('/');
  });

  it('should return sitemap URL', () => {
    const result = robots();
    expect(result.sitemap).toBeDefined();
    expect(result.sitemap).toContain('sitemap.xml');
  });

  it('should use fallback domain when NEXT_PUBLIC_SITE_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const result = robots();
    expect(result.sitemap).toContain('alaika.dev');
    expect(result.sitemap).not.toContain('undefined');
  });

  it('should not disallow any paths', () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.disallow).toBeUndefined();
  });
});
