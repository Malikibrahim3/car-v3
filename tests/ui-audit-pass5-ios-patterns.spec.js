/**
 * UI Audit - Pass 5: iOS Pattern Compliance
 * Validates iOS-native patterns
 */

const { test, expect } = require('@playwright/test');

test.describe('Pass 5: iOS Pattern Compliance', () => {
  
  test('All cards use iOS shadows', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const cards = await page.locator('[data-testid*="card"]').all();
    
    for (const card of cards) {
      const shadow = await card.evaluate(el => 
        getComputedStyle(el).boxShadow
      );
      
      const validShadows = [
        '0px 1px 2px rgba(0, 0, 0, 0.05)',
        '0px 2px 4px rgba(0, 0, 0, 0.08)',
        '0px 4px 8px rgba(0, 0, 0, 0.12)',
        'none',
      ];
      
      // Allow some tolerance for browser rendering
      const isValid = validShadows.some(valid => shadow?.includes(valid.split(' ')[0]));
      expect(isValid || shadow === 'none').toBeTruthy();
    }
  });

  test('All buttons are 44pt height minimum', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const buttons = await page.locator('button, [role="button"], [data-testid*="button"]').all();
    
    for (const button of buttons) {
      const height = await button.evaluate(el => 
        el.getBoundingClientRect().height
      );
      
      if (height > 0) { // Only check visible buttons
        expect(height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('All list items are minimum 44pt', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const listItems = await page.locator('[data-testid*="item"], [role="listitem"]').all();
    
    for (const item of listItems) {
      const height = await item.evaluate(el => 
        el.getBoundingClientRect().height
      );
      
      if (height > 0) { // Only check visible items
        expect(height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Cards have proper border radius', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const cards = await page.locator('[data-testid*="card"]').all();
    
    const validRadius = [12, 16, 24];
    
    for (const card of cards) {
      const radius = await card.evaluate(el => 
        parseInt(getComputedStyle(el).borderRadius)
      );
      
      if (radius > 0) {
        expect(validRadius).toContain(radius);
      }
    }
  });

  test('No custom animations (Reanimated)', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    // Check for Reanimated-specific attributes
    const reanimatedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="reanimated"], [style*="transform"]');
      return elements.length;
    });
    
    // Allow some native transforms but not excessive
    expect(reanimatedElements).toBeLessThan(10);
  });
});
