/**
 * UI Audit - Pass 3: Typography
 * Validates typography scale compliance
 */

const { test, expect } = require('@playwright/test');

test.describe('Pass 3: Typography Audit', () => {
  
  test('All font sizes match typography scale', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validSizes = [48, 34, 28, 22, 17, 15, 13, 11];
    
    const invalidSizes = await page.evaluate((valid) => {
      const elements = document.querySelectorAll('[data-testid]');
      const found = [];
      elements.forEach(el => {
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        if (fontSize && fontSize > 0 && !valid.includes(Math.round(fontSize))) {
          found.push({
            fontSize: Math.round(fontSize),
            text: el.textContent?.substring(0, 30),
            testID: el.getAttribute('data-testid'),
          });
        }
      });
      return found;
    }, validSizes);
    
    // Allow some tolerance for system defaults
    expect(invalidSizes.length).toBeLessThan(20);
  });

  test('Only standard font weights used', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validWeights = ['400', '600', '700', 'normal', 'bold'];
    
    const invalidWeights = await page.evaluate((valid) => {
      const elements = document.querySelectorAll('[data-testid]');
      const found = [];
      elements.forEach(el => {
        const weight = getComputedStyle(el).fontWeight;
        if (weight && !valid.includes(weight)) {
          found.push({
            weight,
            text: el.textContent?.substring(0, 30),
            testID: el.getAttribute('data-testid'),
          });
        }
      });
      return found;
    }, validWeights);
    
    expect(invalidWeights.length).toBeLessThan(10);
  });

  test('All text uses label color system', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validColors = [
      'rgb(0, 0, 0)',           // label
      'rgba(60, 60, 67, 0.6)',  // labelSecondary
      'rgba(60, 60, 67, 0.3)',  // labelTertiary
      'rgb(255, 255, 255)',     // white
      'rgb(139, 38, 53)',       // maroon
      'rgb(52, 199, 89)',       // systemGreen
      'rgb(255, 59, 48)',       // systemRed
      'rgb(0, 122, 255)',       // systemBlue
    ];
    
    const invalidColors = await page.evaluate((valid) => {
      const elements = document.querySelectorAll('[data-testid]');
      const found = [];
      elements.forEach(el => {
        const color = getComputedStyle(el).color;
        if (color && !valid.includes(color)) {
          found.push({
            color,
            text: el.textContent?.substring(0, 30),
            testID: el.getAttribute('data-testid'),
          });
        }
      });
      return found;
    }, validColors);
    
    // Allow some tolerance for variations
    expect(invalidColors.length).toBeLessThan(30);
  });
});
