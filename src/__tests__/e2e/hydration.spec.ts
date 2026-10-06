import { test, expect } from '@playwright/test';

/**
 * Property 10: Hydration Error Check
 * Verifies that no React hydration errors appear in the browser console
 * when the page loads.
 */
test.describe('Property 10: No Hydration Errors', () => {
  test('page should load without hydration errors', async ({ page }) => {
    const hydrationErrors: string[] = [];
    const jsErrors: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          text.includes('Hydration failed') ||
          text.includes('hydration') ||
          text.includes('server rendered HTML') ||
          text.includes('did not match') ||
          text.includes('Warning: Expected server HTML')
        ) {
          hydrationErrors.push(text);
        }
        jsErrors.push(text);
      }
    });

    // Navigate to the page
    await page.goto('/');
    
    // Wait for main content to be visible
    await page.waitForSelector('main', { timeout: 30000 });

    // Assert no hydration errors
    expect(hydrationErrors, 
      `Hydration errors found:\n${hydrationErrors.join('\n')}`
    ).toHaveLength(0);
  });

  test('page title should be set correctly', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toContain('Alaika');
  });

  test('hero section should render after client-side hydration', async ({ page }) => {
    await page.goto('/');
    // HeroSection is dynamically imported (ssr: false) — wait for it to appear
    await page.waitForSelector('.hero-section-wrapper', { timeout: 15000 });
    const hero = page.locator('.hero-section-wrapper');
    await expect(hero).toBeVisible();
  });
});
