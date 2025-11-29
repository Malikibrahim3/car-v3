const { test, expect } = require('@playwright/test');

test.describe('UI Visual Inspection', () => {
  test('Capture and analyze all screens', async ({ page }) => {
    console.log('\n=== STARTING UI INSPECTION ===\n');
    
    // Go to web version
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({ path: 'tests/screenshots/full-app.png', fullPage: true });
    console.log('✅ Screenshot saved: tests/screenshots/full-app.png');
    
    // Check page title
    const title = await page.title();
    console.log('Page Title:', title);
    
    // Get all text content
    const bodyText = await page.locator('body').textContent();
    console.log('\n=== PAGE TEXT CONTENT ===');
    console.log(bodyText.substring(0, 500));
    
    // Check for specific elements
    console.log('\n=== ELEMENT CHECKS ===');
    
    // Check for buttons
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons`);
    
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      const text = await buttons[i].textContent().catch(() => '');
      const isVisible = await buttons[i].isVisible().catch(() => false);
      console.log(`  Button ${i + 1}: "${text}" - Visible: ${isVisible}`);
    }
    
    // Check for SVG (gauges)
    const svgs = await page.locator('svg').all();
    console.log(`\nFound ${svgs.length} SVG elements (gauges/icons)`);
    
    // Check for images
    const images = await page.locator('img').all();
    console.log(`Found ${images.length} images`);
    
    // Check computed styles of body
    console.log('\n=== STYLE ANALYSIS ===');
    const bodyStyles = await page.locator('body').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily,
      };
    });
    console.log('Body styles:', bodyStyles);
    
    // Check for gradient backgrounds
    const gradients = await page.locator('[style*="gradient"]').all();
    console.log(`\nFound ${gradients.length} elements with gradient styles`);
    
    // Check for specific color usage
    const allDivs = await page.locator('div').all();
    const colorSamples = [];
    for (let i = 0; i < Math.min(20, allDivs.length); i++) {
      try {
        const bg = await allDivs[i].evaluate(el => window.getComputedStyle(el).backgroundColor);
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          colorSamples.push(bg);
        }
      } catch (e) {}
    }
    console.log('\n=== COLOR SAMPLES (first 10) ===');
    console.log([...new Set(colorSamples)].slice(0, 10));
    
    // Check for specific text that should be visible
    console.log('\n=== CONTENT CHECKS ===');
    const hasCarValue = await page.locator('text=CarValue').isVisible().catch(() => false);
    const hasDashboard = await page.locator('text=Dashboard').isVisible().catch(() => false);
    const hasGarage = await page.locator('text=Garage').isVisible().catch(() => false);
    
    console.log('Has "CarValue":', hasCarValue);
    console.log('Has "Dashboard":', hasDashboard);
    console.log('Has "Garage":', hasGarage);
    
    // Get viewport size
    const viewport = page.viewportSize();
    console.log('\nViewport:', viewport);
    
    console.log('\n=== INSPECTION COMPLETE ===\n');
    console.log('Check tests/screenshots/full-app.png for visual reference');
  });
});
