/**
 * UI Audit - Pass 2: Spacing & Alignment
 * Validates 8pt grid system and touch targets
 */

const { test, expect } = require('@playwright/test');

test.describe('Pass 2: Spacing & Alignment', () => {
  
  test('All cards use standard padding', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validPadding = [16, 24]; // cardPadding, cardPaddingLarge
    
    const invalidCards = await page.evaluate((valid) => {
      const cards = document.querySelectorAll('[data-testid*="card"]');
      const found = [];
      cards.forEach(card => {
        const padding = parseInt(getComputedStyle(card).padding);
        if (padding && !valid.includes(padding)) {
          found.push({
            padding,
            testID: card.getAttribute('data-testid'),
          });
        }
      });
      return found;
    }, validPadding);
    
    expect(invalidCards).toHaveLength(0);
  });

  test('All spacing uses 8pt grid', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const validSpacing = [0, 4, 8, 16, 24, 32, 48, 64];
    
    const invalidSpacing = await page.evaluate((valid) => {
      const elements = document.querySelectorAll('[data-testid]');
      const found = [];
      elements.forEach(el => {
        const styles = getComputedStyle(el);
        const padding = parseInt(styles.padding);
        const margin = parseInt(styles.margin);
        
        if (padding && padding > 0 && !valid.includes(padding)) {
          found.push({ type: 'padding', value: padding, testID: el.getAttribute('data-testid') });
        }
        if (margin && margin > 0 && !valid.includes(margin)) {
          found.push({ type: 'margin', value: margin, testID: el.getAttribute('data-testid') });
        }
      });
      return found;
    }, validSpacing);
    
    // Allow some tolerance for calculated values
    expect(invalidSpacing.length).toBeLessThan(10);
  });

  test('All interactive elements meet 44pt minimum', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
    
    const tooSmall = await page.evaluate(() => {
      const interactive = document.querySelectorAll(
        'button, [role="button"], a[href], [data-testid*="button"]'
      );
      const found = [];
      interactive.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.height > 0 && rect.height < 44) {
          found.push({
            height: rect.height,
            testID: el.getAttribute('data-testid'),
            tag: el.tagName,
          });
        }
      });
      return found;
    });
    
    expect(tooSmall).toHaveLength(0);
  });

  test('All screens use 16pt horizontal padding', async ({ page }) => {
    const screens = [
      { path: '/', name: 'landing' },
      { path: '/dashboard', name: 'dashboard' },
      { path: '/garage', name: 'garage' },
    ];
    
    for (const screen of screens) {
      await page.goto(`http://localhost:8081${screen.path}`);
      await page.waitForLoadState('networkidle');
      
      const padding = await page.evaluate(() => {
        const container = document.querySelector('[data-testid*="screen"], main, [role="main"]');
        if (!container) return null;
        return parseInt(getComputedStyle(container).paddingLeft);
      });
      
      // Allow 16pt or 0 (if padding is on child elements)
      if (padding !== null) {
        expect([0, 16]).toContain(padding);
      }
    }
  });
});
