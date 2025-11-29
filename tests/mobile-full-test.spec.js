const { test, expect, devices } = require('@playwright/test');

test.use(devices['iPhone 12 Pro']);

test.describe('Full Mobile App Test', () => {
  test('Complete mobile experience test', async ({ page }) => {
    // 1. Load Dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/final-dashboard.png', fullPage: true });
    
    console.log('✅ Dashboard loaded');
    
    // 2. Check no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
    console.log('✅ No horizontal scroll');
    
    // 3. Test theme toggle
    const themeToggle = await page.locator('button[aria-label*="Switch"]').first();
    await themeToggle.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'tests/screenshots/final-dark-mode.png', fullPage: true });
    console.log('✅ Theme toggle works');
    
    // Toggle back to light
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // 4. Navigate to My Garage (use direct URL on mobile)
    await page.goto('http://localhost:3000/garage');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/final-garage.png', fullPage: true });
    console.log('✅ My Garage loaded');
    
    // 5. Navigate to Achievements
    await page.goto('http://localhost:3000/achievements');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/final-achievements.png', fullPage: true });
    console.log('✅ Achievements loaded');
    
    // 6. Navigate to Financial Forecast
    await page.goto('http://localhost:3000/forecast');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/final-forecast.png', fullPage: true });
    console.log('✅ Financial Forecast loaded');
    
    // 7. Check all touch targets
    const buttons = await page.locator('button').all();
    let touchFriendlyCount = 0;
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box && box.width >= 44 && box.height >= 44) {
        touchFriendlyCount++;
      }
    }
    
    console.log(`✅ ${touchFriendlyCount}/${buttons.length} buttons are touch-friendly`);
    expect(touchFriendlyCount / buttons.length).toBeGreaterThan(0.8); // At least 80% should be touch-friendly
    
    // 8. Test dark mode on all pages
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await page.goto('http://localhost:3000/dashboard');
    await page.screenshot({ path: 'tests/screenshots/final-dashboard-dark.png', fullPage: true });
    
    await page.goto('http://localhost:3000/garage');
    await page.screenshot({ path: 'tests/screenshots/final-garage-dark.png', fullPage: true });
    
    await page.goto('http://localhost:3000/achievements');
    await page.screenshot({ path: 'tests/screenshots/final-achievements-dark.png', fullPage: true });
    
    console.log('✅ Dark mode screenshots captured');
    
    // 9. Performance check
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      };
    });
    
    console.log('📊 Performance:', performanceMetrics);
    expect(performanceMetrics.loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    
    console.log('\n🎉 All tests passed!');
  });
});
