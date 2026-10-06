import { test, expect } from '@playwright/test';

/**
 * Property 11: Dancing Script Font Verification
 * Verifies that the Dancing Script font is loaded via Next.js font optimization
 * (NOT via fonts.googleapis.com preconnect link which would indicate CDN loading)
 */
test.describe('Property 11: Dancing Script Font Optimization', () => {
  test('page should NOT have googleapis.com preconnect links (Next.js font optimization)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for head to be fully rendered
    await page.waitForLoadState('domcontentloaded');

    // Check that there are no preconnect links to googleapis.com or gstatic.com
    // (Next.js font optimization inlines fonts — no external preconnect needed)
    const googleapiPreconnect = await page.locator('link[rel="preconnect"][href*="fonts.googleapis.com"]').count();
    const gstaticPreconnect = await page.locator('link[rel="preconnect"][href*="fonts.gstatic.com"]').count();

    expect(googleapiPreconnect, 
      'Should not have preconnect to fonts.googleapis.com — Next.js handles fonts internally'
    ).toBe(0);
    
    expect(gstaticPreconnect,
      'Should not have preconnect to fonts.gstatic.com — Next.js handles fonts internally'
    ).toBe(0);
  });

  test('html element should have font CSS variable classes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Next.js next/font injects CSS variable classes on the html element
    const htmlClass = await page.locator('html').getAttribute('class');
    
    expect(htmlClass).toContain('__variable_');
    // Should have two font variables (Jakarta Sans + Dancing Script)
  });

  test('name heading should use Dancing Script font family', async ({ page }) => {
    await page.goto('/');
    // Wait for HeroSection to load (it's dynamically imported)
    await page.waitForSelector('.name-heading', { timeout: 15000 });
    
    const fontFamily = await page.locator('.name-heading').evaluate(
      el => window.getComputedStyle(el).fontFamily
    );
    
    // Should contain 'Dancing Script' or the CSS variable for it
    expect(
      fontFamily.toLowerCase().includes('dancing') || fontFamily.includes('--font-dancing'),
      `Expected Dancing Script font, got: ${fontFamily}`
    ).toBe(true);
  });
});
