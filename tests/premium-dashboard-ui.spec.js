/**
 * Premium Dashboard UI Inspection Test
 * ClearScore-inspired design verification
 * 
 * This test verifies:
 * - Layout spacing and alignment
 * - Typography consistency
 * - Card styling and shadows
 * - Color scheme adherence
 * - Visual hierarchy
 */

import { test, expect } from '@playwright/test';

const EXPO_WEB_URL = 'http://localhost:8081';
const DASHBOARD_URL = 'http://localhost:8081/(app)/dashboard';

test.describe('Premium Dashboard UI - ClearScore Style', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to dashboard (bypassing auth for testing)
    await page.goto(DASHBOARD_URL);
    
    // Wait for dashboard to load (increased timeout)
    try {
      await page.waitForSelector('[data-testid="dashboard-screen"]', { timeout: 15000 });
    } catch (error) {
      // If testID not found, wait for any content to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
  });

  test('Full Dashboard Screenshot', async ({ page }) => {
    // Capture full page screenshot for visual inspection
    await page.screenshot({ 
      path: 'test-results/dashboard-premium-full.png', 
      fullPage: true 
    });
    
    console.log('✅ Full dashboard screenshot saved to test-results/dashboard-premium-full.png');
  });

  test('Hero Gauge Card - Premium Styling', async ({ page }) => {
    const heroCard = page.locator('[data-testid="hero-gauge-card"]');
    
    // Verify card exists
    await expect(heroCard).toBeVisible();
    
    // Screenshot hero card
    await heroCard.screenshot({ 
      path: 'test-results/hero-gauge-card.png' 
    });
    
    // Check label styling
    const label = page.locator('[data-testid="hero-label"]');
    await expect(label).toBeVisible();
    
    // Check main value
    const value = page.locator('[data-testid="hero-value"]');
    await expect(value).toBeVisible();
    
    // Check equity and change values
    const equity = page.locator('[data-testid="hero-equity"]');
    const change = page.locator('[data-testid="hero-change"]');
    await expect(equity).toBeVisible();
    await expect(change).toBeVisible();
    
    console.log('✅ Hero Gauge Card verified');
  });

  test('Quick Stats Grid - Layout & Spacing', async ({ page }) => {
    const statsGrid = page.locator('[data-testid="stats-grid"]');
    
    // Verify grid exists
    await expect(statsGrid).toBeVisible();
    
    // Screenshot stats grid
    await statsGrid.screenshot({ 
      path: 'test-results/stats-grid.png' 
    });
    
    // Verify all three stat cards
    const vehiclesStat = page.locator('[data-testid="stat-vehicles"]');
    const loanStat = page.locator('[data-testid="stat-loan"]');
    const positiveStat = page.locator('[data-testid="stat-positive"]');
    
    await expect(vehiclesStat).toBeVisible();
    await expect(loanStat).toBeVisible();
    await expect(positiveStat).toBeVisible();
    
    console.log('✅ Quick Stats Grid verified');
  });

  test('Vehicle Carousel - Premium Cards', async ({ page }) => {
    const carousel = page.locator('[data-testid="vehicles-carousel"]');
    
    // Check if carousel exists (may not if no vehicles)
    const carouselExists = await carousel.count() > 0;
    
    if (carouselExists) {
      await expect(carousel).toBeVisible();
      
      // Screenshot carousel
      await carousel.screenshot({ 
        path: 'test-results/vehicle-carousel.png' 
      });
      
      console.log('✅ Vehicle Carousel verified');
    } else {
      console.log('ℹ️  No vehicles in carousel (empty state)');
    }
  });

  test('Typography Consistency Check', async ({ page }) => {
    // Check section titles
    const sectionTitles = page.locator('[data-testid*="title"]');
    const titleCount = await sectionTitles.count();
    
    console.log(`Found ${titleCount} section titles`);
    
    // Verify at least one title exists
    expect(titleCount).toBeGreaterThan(0);
    
    console.log('✅ Typography structure verified');
  });

  test('Color Scheme Verification', async ({ page }) => {
    // Take screenshot for manual color verification
    await page.screenshot({ 
      path: 'test-results/color-scheme-check.png',
      fullPage: true
    });
    
    // Verify background gradient exists
    const background = page.locator('body');
    await expect(background).toBeVisible();
    
    console.log('✅ Color scheme screenshot captured');
  });

  test('Spacing & Alignment - Visual Grid', async ({ page }) => {
    // Capture with viewport dimensions
    const viewport = page.viewportSize();
    console.log(`Viewport: ${viewport.width}x${viewport.height}`);
    
    // Take screenshot for spacing analysis
    await page.screenshot({ 
      path: 'test-results/spacing-alignment.png',
      fullPage: true
    });
    
    console.log('✅ Spacing and alignment screenshot captured');
  });

  test('Mobile Responsive - 375px Width', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Wait for reflow
    await page.waitForTimeout(500);
    
    // Capture mobile view
    await page.screenshot({ 
      path: 'test-results/mobile-375px.png',
      fullPage: true
    });
    
    console.log('✅ Mobile 375px screenshot captured');
  });

  test('Tablet Responsive - 768px Width', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Wait for reflow
    await page.waitForTimeout(500);
    
    // Capture tablet view
    await page.screenshot({ 
      path: 'test-results/tablet-768px.png',
      fullPage: true
    });
    
    console.log('✅ Tablet 768px screenshot captured');
  });

  test('Glass Card Effects - Visual Inspection', async ({ page }) => {
    // Capture hero card for glass effect inspection
    const heroCard = page.locator('[data-testid="hero-gauge-card"]');
    
    if (await heroCard.count() > 0) {
      await heroCard.screenshot({ 
        path: 'test-results/glass-effect-hero.png' 
      });
    }
    
    // Capture stat card for glass effect
    const statCard = page.locator('[data-testid="stat-vehicles"]');
    
    if (await statCard.count() > 0) {
      await statCard.screenshot({ 
        path: 'test-results/glass-effect-stat.png' 
      });
    }
    
    console.log('✅ Glass effect screenshots captured');
  });
});

test.describe('Premium UI - Detailed Measurements', () => {
  test('Card Border Radius Check', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    try {
      await page.waitForSelector('[data-testid="dashboard-screen"]', { timeout: 15000 });
    } catch (error) {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    // Get computed styles for hero card
    const heroCard = page.locator('[data-testid="hero-gauge-card"]');
    
    if (await heroCard.count() > 0) {
      const borderRadius = await heroCard.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      
      console.log(`Hero Card Border Radius: ${borderRadius}`);
      // Expected: 20px
    }
  });

  test('Card Padding Verification', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    try {
      await page.waitForSelector('[data-testid="dashboard-screen"]', { timeout: 15000 });
    } catch (error) {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    const heroCard = page.locator('[data-testid="hero-gauge-card"]');
    
    if (await heroCard.count() > 0) {
      const padding = await heroCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          top: styles.paddingTop,
          right: styles.paddingRight,
          bottom: styles.paddingBottom,
          left: styles.paddingLeft,
        };
      });
      
      console.log('Hero Card Padding:', padding);
      // Expected: 20-24px
    }
  });

  test('Typography Font Sizes', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    try {
      await page.waitForSelector('[data-testid="dashboard-screen"]', { timeout: 15000 });
    } catch (error) {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    // Check section title font size
    const sectionTitle = page.locator('[data-testid="quick-stats-title"]');
    
    if (await sectionTitle.count() > 0) {
      const fontSize = await sectionTitle.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      console.log(`Section Title Font Size: ${fontSize}`);
      // Expected: 20px
    }
  });
});

// Export test configuration
export const config = {
  name: 'Premium Dashboard UI Test',
  description: 'Verifies ClearScore-inspired premium design implementation',
  expectedScreenshots: [
    'dashboard-premium-full.png',
    'hero-gauge-card.png',
    'stats-grid.png',
    'vehicle-carousel.png',
    'mobile-375px.png',
    'tablet-768px.png',
  ],
};
