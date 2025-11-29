const { test } = require('@playwright/test');

test('Quick visual check - take screenshot', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'test-results/current-state.png', fullPage: true });
  console.log('Screenshot saved to test-results/current-state.png');
});
