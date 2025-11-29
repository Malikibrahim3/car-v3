/**
 * Design Quality Audit
 * Comprehensive visual inspection of the app
 */

const { test, expect } = require('@playwright/test');

test.describe('Design Quality Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
  });

  test('dashboard visual quality', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    console.log('\n=== DASHBOARD AUDIT ===');
    
    // Check for hero card with gradient
    const heroGradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let gradientCount = 0;
      elements.forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg.includes('linear-gradient')) gradientCount++;
      });
      return gradientCount;
    });
    console.log('Gradient elements:', heroGradients);
    
    // Check for shadows
    const shadowElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let shadowCount = 0;
      let strongShadows = 0;
      elements.forEach(el => {
        const shadow = window.getComputedStyle(el).boxShadow;
        if (shadow && shadow !== 'none') {
          shadowCount++;
          // Check if it's a strong shadow (opacity > 0.1)
          if (shadow.includes('rgba') && parseFloat(shadow.split(',')[3]) > 0.1) {
            strongShadows++;
          }
        }
      });
      return { total: shadowCount, strong: strongShadows };
    });
    console.log('Shadow elements:', shadowElements.total, '(strong:', shadowElements.strong + ')');
    
    // Check for rounded corners
    const roundedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let rounded = 0;
      elements.forEach(el => {
        const radius = window.getComputedStyle(el).borderRadius;
        if (radius && radius !== '0px' && parseInt(radius) > 8) rounded++;
      });
      return rounded;
    });
    console.log('Rounded elements (>8px):', roundedElements);
    
    // Check for large text (hero numbers)
    const largeText = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let large = 0;
      elements.forEach(el => {
        const size = parseFloat(window.getComputedStyle(el).fontSize);
        if (size >= 32) large++;
      });
      return large;
    });
    console.log('Large text elements (>=32px):', largeText);
    
    // Check for colored text (not just black/gray)
    const coloredText = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let colored = 0;
      elements.forEach(el => {
        const color = window.getComputedStyle(el).color;
        // Check if it's not black, white, or gray
        if (color && !color.includes('0, 0, 0') && !color.includes('255, 255, 255')) {
          const rgb = color.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const [r, g, b] = rgb.map(Number);
            // Check if it's a saturated color (not gray)
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            if (max - min > 30) colored++;
          }
        }
      });
      return colored;
    });
    console.log('Colored text elements:', coloredText);
    
    await page.screenshot({ 
      path: 'test-results/dashboard-quality.png',
      fullPage: true 
    });
    
    // Quality assertions
    expect(heroGradients).toBeGreaterThan(3);
    expect(shadowElements.total).toBeGreaterThan(8);
    expect(roundedElements).toBeGreaterThan(10);
    expect(largeText).toBeGreaterThan(2);
    
    console.log('✓ Dashboard passes quality checks');
  });

  test('garage visual quality', async ({ page }) => {
    await page.goto('/garage');
    await page.waitForTimeout(2000);
    
    console.log('\n=== GARAGE AUDIT ===');
    
    // Check for card images
    const images = await page.locator('img').count();
    console.log('Images:', images);
    
    // Check for progress bars
    const progressBars = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let bars = 0;
      elements.forEach(el => {
        const height = parseFloat(window.getComputedStyle(el).height);
        const width = parseFloat(window.getComputedStyle(el).width);
        if (height >= 4 && height <= 10 && width > 50) bars++;
      });
      return bars;
    });
    console.log('Progress bar elements:', progressBars);
    
    // Check for status badges
    const badges = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let count = 0;
      elements.forEach(el => {
        const radius = window.getComputedStyle(el).borderRadius;
        const padding = window.getComputedStyle(el).padding;
        if (radius && parseInt(radius) > 100 && padding) count++;
      });
      return count;
    });
    console.log('Badge elements:', badges);
    
    await page.screenshot({ 
      path: 'test-results/garage-quality.png',
      fullPage: true 
    });
    
    expect(images).toBeGreaterThan(2);
    console.log('✓ Garage passes quality checks');
  });

  test('overall design consistency', async ({ page }) => {
    const screens = ['/', '/garage', '/activity', '/tools', '/market'];
    const results = [];
    
    console.log('\n=== CONSISTENCY AUDIT ===');
    
    for (const screen of screens) {
      await page.goto(screen);
      await page.waitForTimeout(1500);
      
      const metrics = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let gradients = 0;
        let shadows = 0;
        let rounded = 0;
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.backgroundImage.includes('gradient')) gradients++;
          if (style.boxShadow !== 'none') shadows++;
          if (parseInt(style.borderRadius) > 8) rounded++;
        });
        
        return { gradients, shadows, rounded };
      });
      
      results.push({ screen, ...metrics });
      console.log(`${screen}: gradients=${metrics.gradients}, shadows=${metrics.shadows}, rounded=${metrics.rounded}`);
    }
    
    // Check consistency - all screens should have similar visual richness
    const avgGradients = results.reduce((a, b) => a + b.gradients, 0) / results.length;
    const avgShadows = results.reduce((a, b) => a + b.shadows, 0) / results.length;
    
    console.log(`\nAverages: gradients=${avgGradients.toFixed(1)}, shadows=${avgShadows.toFixed(1)}`);
    
    expect(avgGradients).toBeGreaterThan(2);
    expect(avgShadows).toBeGreaterThan(5);
    
    console.log('✓ Design consistency passes');
  });
});
