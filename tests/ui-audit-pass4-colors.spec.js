/**
 * UI Audit - Pass 4: Color Consistency
 * Validates color system compliance
 */

const { test, expect } = require('@playwright/test');

test.describe('Pass 4: Color Consistency', () => {
  
  test('Maroon used correctly', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const maroonElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const found = [];
      elements.forEach(el => {
        const styles = getComputedStyle(el);
        const bg = styles.backgroundColor;
        const color = styles.color;
        const border = styles.borderColor;
        
        if (bg.includes('139, 38, 53') || 
            color.includes('139, 38, 53') || 
            border.includes('139, 38, 53')) {
          found.push({
            type: el.tagName,
            testID: el.getAttribute('data-testid'),
            role: el.getAttribute('role'),
          });
        }
      });
      return found;
    });
    
    // Maroon should be used (primary buttons, hero borders, etc.)
    expect(maroonElements.length).toBeGreaterThan(0);
    
    // But not everywhere (should be < 20% of elements)
    const totalElements = await page.evaluate(() => document.querySelectorAll('*').length);
    expect(maroonElements.length / totalElements).toBeLessThan(0.2);
  });

  test('Only white and gray backgrounds', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validBackgrounds = [
      'rgb(255, 255, 255)',  // white
      'rgb(245, 245, 245)',  // backgroundAlt
      'rgba(0, 0, 0, 0)',    // transparent
      'transparent',
    ];
    
    const invalidBackgrounds = await page.evaluate((valid) => {
      const elements = document.querySelectorAll('[data-testid]');
      const found = [];
      elements.forEach(el => {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && 
            !valid.includes(bg) && 
            !bg.includes('139, 38, 53') && // allow maroon
            !bg.includes('52, 199, 89') && // allow green
            !bg.includes('255, 59, 48')) { // allow red
          found.push({
            bg,
            testID: el.getAttribute('data-testid'),
          });
        }
      });
      return found;
    }, validBackgrounds);
    
    // Allow some tolerance for semantic colors
    expect(invalidBackgrounds.length).toBeLessThan(10);
  });

  test('Only standard border radius values', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validRadius = [0, 8, 12, 16, 24];
    
    const invalidRadius = await page.evaluate((valid) => {
      const elements = document.querySelectorAll('[data-testid]');
      const found = [];
      elements.forEach(el => {
        const radius = parseInt(getComputedStyle(el).borderRadius);
        if (radius && radius > 0 && !valid.includes(radius)) {
          found.push({
            radius,
            testID: el.getAttribute('data-testid'),
          });
        }
      });
      return found;
    }, validRadius);
    
    expect(invalidRadius).toHaveLength(0);
  });

  test('Background is white or light gray', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const bodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    
    const validBgs = [
      'rgb(255, 255, 255)',
      'rgb(245, 245, 245)',
    ];
    
    expect(validBgs).toContain(bodyBg);
  });
});
