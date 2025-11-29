import { test } from '@playwright/test';

test('Debug card elements', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/', { waitUntil: 'networkidle' });
  
  const cards = await page.locator('.feature-card, .pricing-card, .hs-dark-card, .ht-card, [class*="card"]').all();
  
  console.log(`\nFound ${cards.length} card elements:\n`);
  
  for (let i = 0; i < Math.min(cards.length, 15); i++) {
    const card = cards[i];
    if (await card.isVisible()) {
      const box = await card.boundingBox();
      const className = await card.getAttribute('class');
      console.log(`${i + 1}. ${className} - Width: ${box?.width}px`);
    }
  }
});
