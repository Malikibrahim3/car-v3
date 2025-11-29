import { test } from '@playwright/test';

test('Debug HeroSecondary cards layout', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/', { waitUntil: 'networkidle' });
  
  // Scroll to HeroSecondary
  await page.evaluate(() => {
    document.querySelector('.hero-secondary-swiss')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  
  // Check the bottom cards container
  const cardsContainer = page.locator('.hs-bottom-cards');
  const containerBox = await cardsContainer.boundingBox();
  const gridColumns = await cardsContainer.evaluate(el => 
    window.getComputedStyle(el).gridTemplateColumns
  );
  
  console.log('\n=== HeroSecondary Bottom Cards ===');
  console.log(`Container width: ${containerBox?.width}px`);
  console.log(`Grid template columns: ${gridColumns}`);
  
  // Check individual cards
  const cards = await page.locator('.hs-dark-card').all();
  console.log(`\nFound ${cards.length} cards:\n`);
  
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const box = await card.boundingBox();
    const className = await card.getAttribute('class');
    console.log(`Card ${i + 1}: ${box?.width}px - ${className}`);
  }
  
  await page.screenshot({
    path: 'test-results/hero-secondary-cards-mobile.png',
  });
});
