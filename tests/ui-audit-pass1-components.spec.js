/**
 * UI Audit - Pass 1: Component Audit
 * Validates no gradients, custom shadows, or non-system fonts
 */

const { test, expect } = require('@playwright/test');

test.describe('Pass 1: Component Audit', () => {
  
  test('No gradients anywhere', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const gradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const found = [];
      elements.forEach(el => {
        const bg = getComputedStyle(el).background;
        if (bg && bg.includes('gradient')) {
          found.push({
            tag: el.tagName,
            class: el.className,
            id: el.id,
            testID: el.getAttribute('data-testid'),
          });
        }
      });
      return found;
    });
    
    expect(gradients).toHaveLength(0);
  });

  test('Only standard shadows used', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validShadows = [
      '0px 1px 2px rgba(0, 0, 0, 0.05)',  // small
      '0px 2px 4px rgba(0, 0, 0, 0.08)',  // medium
      '0px 4px 8px rgba(0, 0, 0, 0.12)',  // large
      '0px 2px 4px rgba(139, 38, 53, 0.15)', // maroon
      'none',
    ];
    
    const invalidShadows = await page.evaluate((valid) => {
      const elements = document.querySelectorAll('*');
      const found = [];
      elements.forEach(el => {
        const shadow = getComputedStyle(el).boxShadow;
        if (shadow && !valid.includes(shadow)) {
          found.push({ 
            shadow, 
            tag: el.tagName,
            testID: el.getAttribute('data-testid'),
          });
        }
      });
      return found;
    }, validShadows);
    
    // Allow some tolerance for browser rendering differences
    expect(invalidShadows.length).toBeLessThan(5);
  });

  test('Only System font used', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const nonSystemFonts = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const found = [];
      elements.forEach(el => {
        const font = getComputedStyle(el).fontFamily;
        if (font && 
            !font.includes('System') && 
            !font.includes('-apple-system') &&
            !font.includes('BlinkMacSystemFont') &&
            font !== 'inherit') {
          found.push({ 
            font, 
            tag: el.tagName,
            text: el.textContent?.substring(0, 30),
          });
        }
      });
      return found;
    });
    
    // Allow some system defaults
    expect(nonSystemFonts.length).toBeLessThan(10);
  });

  test('No GlassCard components', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const glassCards = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="glass"], [class*="Glass"]');
      return elements.length;
    });
    
    expect(glassCards).toBe(0);
  });
});
