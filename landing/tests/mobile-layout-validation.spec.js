import { test, expect } from '@playwright/test';

test.describe('Mobile Layout Validation', () => {
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Small Android', width: 320, height: 568 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} - Layout validation`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      console.log(`\n=== ${viewport.name} (${viewport.width}x${viewport.height}) ===\n`);
      
      // Check actual card containers (not child elements)
      const actualCards = await page.locator('.feature-card, .pricing-card, .hs-dark-card, .ht-card').all();
      
      console.log(`Found ${actualCards.length} actual card containers\n`);
      
      let issues = [];
      
      for (let i = 0; i < actualCards.length; i++) {
        const card = actualCards[i];
        if (await card.isVisible()) {
          const box = await card.boundingBox();
          const className = await card.getAttribute('class');
          
          // Check if card overflows viewport
          if (box && box.width > viewport.width) {
            issues.push(`Card ${i + 1} (${className}) overflows: ${box.width}px > ${viewport.width}px`);
          }
          
          // Check if card has reasonable minimum width (at least 200px or 60% of viewport)
          const minWidth = Math.min(200, viewport.width * 0.6);
          if (box && box.width < minWidth) {
            console.log(`⚠️  Card ${i + 1} (${className}): ${box.width}px (might be too narrow)`);
          } else if (box) {
            console.log(`✓ Card ${i + 1} (${className}): ${box.width}px`);
          }
        }
      }
      
      // Check CTA buttons
      const ctaButtons = await page.locator('.hero-cta-btn, .hs-cta-btn, .ht-cta-btn, .pricing-btn').all();
      console.log(`\nFound ${ctaButtons.length} CTA buttons\n`);
      
      for (let i = 0; i < Math.min(ctaButtons.length, 6); i++) {
        const btn = ctaButtons[i];
        if (await btn.isVisible()) {
          const box = await btn.boundingBox();
          const text = await btn.textContent();
          
          if (box) {
            const isTouchFriendly = box.height >= 44 && box.width >= 44;
            const status = isTouchFriendly ? '✓' : '✗';
            console.log(`${status} Button "${text?.trim().substring(0, 20)}": ${box.width.toFixed(0)}x${box.height.toFixed(0)}px`);
            
            if (!isTouchFriendly) {
              issues.push(`Button too small: ${box.width}x${box.height}px`);
            }
          }
        }
      }
      
      console.log(`\n${issues.length === 0 ? '✓ All checks passed!' : `✗ ${issues.length} issues found`}\n`);
      
      if (issues.length > 0) {
        console.log('Issues:');
        issues.forEach(issue => console.log(`  - ${issue}`));
      }
      
      expect(issues.length).toBe(0);
    });
  }
});
