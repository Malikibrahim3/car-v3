/**
 * Visual Audit Test
 * Captures screenshots of all main screens for design review
 */

const { test, expect } = require('@playwright/test');

test.describe('Visual Design Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport (iPhone 14 Pro)
    await page.setViewportSize({ width: 393, height: 852 });
  });

  test('capture dashboard screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/dashboard.png',
      fullPage: true 
    });
  });

  test('capture garage screen', async ({ page }) => {
    await page.goto('/garage');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/garage.png',
      fullPage: true 
    });
  });

  test('capture activity screen', async ({ page }) => {
    await page.goto('/activity');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/activity.png',
      fullPage: true 
    });
  });

  test('capture tools screen', async ({ page }) => {
    await page.goto('/tools');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/tools.png',
      fullPage: true 
    });
  });

  test('capture market screen', async ({ page }) => {
    await page.goto('/market');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/market.png',
      fullPage: true 
    });
  });

  test('audit design elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check for visual elements
    const body = await page.locator('body');
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    console.log('=== DESIGN AUDIT ===');
    console.log('Background color:', bgColor);
    
    // Check text colors
    const headings = await page.locator('text=/Home|Dashboard|Garage/').first();
    if (await headings.count() > 0) {
      const textColor = await headings.evaluate(el => 
        window.getComputedStyle(el).color
      );
      console.log('Heading color:', textColor);
    }

    // Check for cards
    const cards = await page.locator('[style*="background"]').count();
    console.log('Card-like elements:', cards);

    // Check for shadows
    const elementsWithShadow = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      let count = 0;
      all.forEach(el => {
        const shadow = window.getComputedStyle(el).boxShadow;
        if (shadow && shadow !== 'none') count++;
      });
      return count;
    });
    console.log('Elements with shadows:', elementsWithShadow);

    // Check for gradients
    const elementsWithGradient = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      let count = 0;
      all.forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg.includes('gradient')) count++;
      });
      return count;
    });
    console.log('Elements with gradients:', elementsWithGradient);

    console.log('===================');
  });
});
