import { test, expect } from '@playwright/test';

test.describe('Mobile Visual Check', () => {
  const viewports = [
    { name: 'iPhone-SE', width: 375, height: 667 },
    { name: 'iPhone-12', width: 390, height: 844 },
    { name: 'Galaxy-S21', width: 360, height: 800 },
  ];

  for (const viewport of viewports) {
    test(`Full page screenshot - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      // Take full page screenshot
      await page.screenshot({
        path: `test-results/mobile-${viewport.name}-full.png`,
        fullPage: true
      });
      
      // Take hero section screenshot
      await page.screenshot({
        path: `test-results/mobile-${viewport.name}-hero.png`,
      });
      
      // Scroll to pricing and take screenshot
      await page.evaluate(() => {
        document.querySelector('.pricing-section')?.scrollIntoView({ behavior: 'instant' });
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `test-results/mobile-${viewport.name}-pricing.png`,
      });
      
      expect(true).toBe(true);
    });
  }
});
