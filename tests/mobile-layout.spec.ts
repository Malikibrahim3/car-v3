import { test, expect } from '@playwright/test';

// Define mobile viewport sizes to test against
const mobileViewports = [
  { width: 375, height: 667, name: 'iPhone SE' },
  { width: 390, height: 844, name: 'iPhone 12' },
  { width: 430, height: 932, name: 'iPhone 14 Pro Max' }
];

test.describe('Mobile Landing Page Layout', () => {
  
  for (const viewport of mobileViewports) {
    
    test(`should render correctly on ${viewport.name}`, async ({ page }) => {
      // 1. Set Viewport
      await page.setViewportSize(viewport);
      
      // UPDATED: Now pointing to port 3001
      await page.goto('http://localhost:3001'); 

      // 2. CHECK FOR HORIZONTAL SCROLL (The "Overflow" Bug)
      // The body width should not exceed the viewport width
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqualTo(viewport.width);

      // 3. CHECK HERO 1 (Dodge Section)
      const hero1Text = page.locator('h1, h2').first();
      await expect(hero1Text).toBeVisible();
      // Ensure text is not overlapping the header/nav
      const hero1Box = await hero1Text.boundingBox();
      expect(hero1Box?.y).toBeGreaterThan(60); 

      // 4. CHECK HERO 2 (Red Alfa Section)
      // Verify the car image is NOT bleeding off-screen in a way that breaks layout
      const redAlfaImg = page.locator('img[alt="Classic Alfa Romeo"]');
      
      // Only run this check if the image actually exists on the page
      if (await redAlfaImg.count() > 0) {
        await expect(redAlfaImg).toBeVisible();
        const alfaBox = await redAlfaImg.boundingBox();
        // On mobile, image should likely be full width or contained
        if (alfaBox) {
            expect(alfaBox.width).toBeLessThanOrEqualTo(viewport.width);
        }
      }

      // 5. CHECK GRID STACKING (Bento Grid / Features)
      // Cards should be stacked vertically (x coordinates should align, y should differ)
      const cards = page.locator('.grid > div'); 
      const count = await cards.count();
      
      if (count > 1) {
        const firstCardBox = await cards.nth(0).boundingBox();
        const secondCardBox = await cards.nth(1).boundingBox();
        
        if (firstCardBox && secondCardBox) {
            // In a mobile stack, the second card should be BELOW the first one
            expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
            // They should have roughly the same X alignment (stacked)
            expect(Math.abs(firstCardBox.x - secondCardBox.x)).toBeLessThan(20);
        }
      }

      // 6. CHECK FONT SIZES
      // Headlines shouldn't be massive (e.g., > 60px) on mobile
      const headlines = page.locator('h2');
      for (const hl of await headlines.all()) {
        const fontSize = await hl.evaluate((el) => window.getComputedStyle(el).fontSize);
        const sizeValue = parseFloat(fontSize);
        // Warning: if you use 'text-7xl', this might be ~72px. 
        // We assert it should be smaller on mobile (e.g. < 60px)
        // If this fails, it means your @media queries aren't reducing font size enough.
        expect(sizeValue).toBeLessThanOrEqual(60); 
      }

      // 7. CHECK PADDING
      // Ensure content isn't touching the edges
      const container = page.locator('.container').first();
      if (await container.count() > 0) {
          const paddingLeft = await container.evaluate((el) => window.getComputedStyle(el).paddingLeft);
          expect(parseFloat(paddingLeft)).toBeGreaterThanOrEqual(16); // At least 16px/1rem padding
      }
    });
  }

  test('should not have fixed background attachments on mobile', async ({ page }) => {
    // Fixed backgrounds cause jitter on iOS. Check that we switched to 'scroll' or generic img
    await page.setViewportSize(mobileViewports[1]);
    await page.goto('http://localhost:3001'); // UPDATED to 3001

    // Select elements that might have parallax
    const heroSection = page.locator('section').first(); 
    const bgAttachment = await heroSection.evaluate((el) => window.getComputedStyle(el).backgroundAttachment);
    
    // It should NOT be 'fixed' on mobile
    if (bgAttachment) {
        expect(bgAttachment).not.toBe('fixed');
    }
  });

});
