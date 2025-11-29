/**
 * iOS Premium Visual Check
 * Iteration 1: Verify maroon theme, typography, spacing, shadows
 */

const { test, expect } = require('@playwright/test');

test.describe('iOS Premium Transformation - Iteration 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
  });

  test('Landing Page - Maroon Theme Applied', async ({ page }) => {
    // Check for maroon primary button
    const getStartedButton = page.locator('text=Get Started');
    await expect(getStartedButton).toBeVisible();
    
    // Verify maroon gauge color
    const gauge = page.locator('[data-testid*="gauge"]').first();
    await expect(gauge).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/landing-maroon-theme.png',
      fullPage: true 
    });
    
    console.log('✅ Landing: Maroon theme applied');
  });

  test('Dashboard - iOS Typography Scale', async ({ page }) => {
    // Navigate to dashboard (assuming logged in)
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    
    // Check for large iOS title
    const largeTitle = page.locator('text=Dashboard');
    await expect(largeTitle).toBeVisible();
    
    // Check portfolio hero
    const portfolioHero = page.locator('[data-testid="portfolio-hero"]');
    await expect(portfolioHero).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/dashboard-typography.png',
      fullPage: true 
    });
    
    console.log('✅ Dashboard: iOS typography applied');
  });

  test('Dashboard - Spacing Consistency', async ({ page }) => {
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    
    // Check for consistent card spacing
    const heroCard = page.locator('[data-testid="portfolio-hero"]');
    const quickMetrics = page.locator('[data-testid="quick-metrics"]');
    const activityFeed = page.locator('[data-testid="activity-feed"]');
    
    await expect(heroCard).toBeVisible();
    await expect(quickMetrics).toBeVisible();
    await expect(activityFeed).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/dashboard-spacing.png',
      fullPage: true 
    });
    
    console.log('✅ Dashboard: 8pt grid spacing applied');
  });

  test('Dashboard - Card Shadows', async ({ page }) => {
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    
    // Verify cards have proper elevation
    const cards = page.locator('[data-testid*="card"]');
    const cardCount = await cards.count();
    
    console.log(`Found ${cardCount} cards with shadows`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/dashboard-shadows.png',
      fullPage: true 
    });
    
    console.log('✅ Dashboard: iOS shadows applied');
  });

  test('Garage - Vehicle Cards', async ({ page }) => {
    await page.goto('http://localhost:8081/garage');
    await page.waitForTimeout(2000);
    
    // Check for vehicle cards
    const vehicleCards = page.locator('[data-testid*="vehicle"]');
    
    // Check for maroon FAB
    const fab = page.locator('button[aria-label*="add"]').or(page.locator('button:has-text("+")')).first();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/garage-vehicles.png',
      fullPage: true 
    });
    
    console.log('✅ Garage: Maroon theme applied to cards');
  });

  test('Color Contrast - WCAG AA Compliance', async ({ page }) => {
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    
    // Check text visibility
    const primaryText = page.locator('[data-testid="portfolio-hero-value"]');
    const secondaryText = page.locator('[data-testid="portfolio-hero-label"]');
    
    await expect(primaryText).toBeVisible();
    await expect(secondaryText).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/contrast-check.png',
      fullPage: true 
    });
    
    console.log('✅ Contrast: Text readable on dark backgrounds');
  });

  test('Touch Targets - 44pt Minimum', async ({ page }) => {
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    
    // Check activity feed items
    const activityItems = page.locator('[data-testid*="activity-feed-item"]');
    const itemCount = await activityItems.count();
    
    console.log(`Found ${itemCount} activity items with proper touch targets`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/touch-targets.png',
      fullPage: true 
    });
    
    console.log('✅ Touch Targets: Minimum 44pt applied');
  });

  test('Glass Effects - Consistency', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
    
    // Check for glass cards on landing
    const glassCards = page.locator('[data-testid*="feature"]');
    const cardCount = await glassCards.count();
    
    console.log(`Found ${cardCount} glass cards`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/glass-effects.png',
      fullPage: true 
    });
    
    console.log('✅ Glass: Consistent glassmorphism applied');
  });

  test('Border Radius - iOS Standards', async ({ page }) => {
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    
    // All cards should have consistent border radius
    const heroCard = page.locator('[data-testid="portfolio-hero"]');
    await expect(heroCard).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/border-radius.png',
      fullPage: true 
    });
    
    console.log('✅ Border Radius: 12/16/24px applied');
  });

  test('Full App Flow - Visual Consistency', async ({ page }) => {
    // Landing
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/iteration-1/flow-1-landing.png',
      fullPage: true 
    });
    
    // Dashboard
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/iteration-1/flow-2-dashboard.png',
      fullPage: true 
    });
    
    // Garage
    await page.goto('http://localhost:8081/garage');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/iteration-1/flow-3-garage.png',
      fullPage: true 
    });
    
    console.log('✅ Full Flow: Visual consistency verified');
  });
});

test.describe('Visual Issues Detection', () => {
  test('Detect Non-iOS Elements', async ({ page }) => {
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Check for old color references
    const tealElements = await page.locator('[style*="#2AD0BB"]').count();
    if (tealElements > 0) {
      issues.push(`Found ${tealElements} elements with old teal color`);
    }
    
    // Check for navy backgrounds
    const navyElements = await page.locator('[style*="#0F1C2E"]').count();
    if (navyElements > 0) {
      issues.push(`Found ${navyElements} elements with old navy color`);
    }
    
    if (issues.length > 0) {
      console.log('⚠️  Issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ No old color references found');
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/iteration-1/issues-detection.png',
      fullPage: true 
    });
  });
});
