import { test } from '@playwright/test';

test('Debug DOM structure', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/', { waitUntil: 'networkidle' });
  
  // Scroll to HeroSecondary
  await page.evaluate(() => {
    document.querySelector('.hero-secondary-swiss')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  
  const structure = await page.evaluate(() => {
    const cards = document.querySelector('.hs-bottom-cards');
    if (!cards) return 'Cards not found';
    
    let current = cards;
    const parents = [];
    
    while (current && current !== document.body) {
      const styles = window.getComputedStyle(current);
      parents.push({
        tag: current.tagName,
        class: current.className,
        width: current.getBoundingClientRect().width,
        computedWidth: styles.width,
        position: styles.position,
        display: styles.display,
      });
      current = current.parentElement;
    }
    
    return parents;
  });
  
  console.log('\n=== DOM Structure (from .hs-bottom-cards up) ===\n');
  structure.forEach((el, i) => {
    console.log(`${i}. <${el.tag}> .${el.class}`);
    console.log(`   Width: ${el.width}px (computed: ${el.computedWidth})`);
    console.log(`   Position: ${el.position}, Display: ${el.display}\n`);
  });
});
