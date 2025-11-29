const { test, expect } = require('@playwright/test');

test.describe('UI Inspection - Visual Issues', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
  });

  test('Inspect Landing Page', async ({ page }) => {
    await page.screenshot({ path: 'tests/screenshots/landing-page.png', fullPage: true });
    
    // Check for gradient background
    const body = await page.locator('body');
    const bgColor = await body.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log('Landing Background Color:', bgColor);
    
    // Check for circular gauge
    const gauge = await page.locator('svg').first();
    const gaugeExists = await gauge.isVisible().catch(() => false);
    console.log('Circular Gauge Visible:', gaugeExists);
    
    // Check button colors
    const primaryButton = await page.locator('button:has-text("Get Started")');
    if (await primaryButton.isVisible()) {
      const btnBg = await primaryButton.evaluate(el => window.getComputedStyle(el).backgroundColor);
      console.log('Get Started Button Color:', btnBg);
    }
  });

  test('Inspect Dashboard', async ({ page }) => {
    // Try to navigate to dashboard (may need auth)
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/dashboard.png', fullPage: true });
    
    // Check for hero card
    const heroCard = await page.locator('[class*="heroCard"]').first();
    const heroExists = await heroCard.isVisible().catch(() => false);
    console.log('Hero Card Visible:', heroExists);
    
    // Check for glass effect
    const cards = await page.locator('[class*="card"]').all();
    console.log('Number of cards found:', cards.length);
  });

  test('Inspect Garage', async ({ page }) => {
    await page.goto('http://localhost:8081/garage');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/garage.png', fullPage: true });
  });

  test('Color Palette Check', async ({ page }) => {
    // Check if navy/teal colors are being used
    const allElements = await page.locator('*').all();
    const colors = new Set();
    
    for (let i = 0; i < Math.min(50, allElements.length); i++) {
      const el = allElements[i];
      try {
        const bgColor = await el.evaluate(el => window.getComputedStyle(el).backgroundColor);
        const color = await el.evaluate(el => window.getComputedStyle(el).color);
        if (bgColor !== 'rgba(0, 0, 0, 0)') colors.add(bgColor);
        if (color !== 'rgba(0, 0, 0, 0)') colors.add(color);
      } catch (e) {}
    }
    
    console.log('Colors found:', Array.from(colors).slice(0, 20));
  });
});
