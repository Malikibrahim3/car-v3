import { test, expect } from '@playwright/test';

test('Verify our site matches Linear styling', async ({ page }) => {
  test.setTimeout(60000);
  
  // Test our site
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  const ourStyles = await page.evaluate(() => {
    const body = document.body;
    const bodyBg = window.getComputedStyle(body).backgroundColor;
    
    // Get card backgrounds
    const cards = document.querySelectorAll('.portfolio-card, .feature-card, .metric-card');
    const cardStyles = Array.from(cards).slice(0, 3).map(card => {
      const computed = window.getComputedStyle(card);
      return {
        background: computed.background,
        backgroundColor: computed.backgroundColor,
        backgroundImage: computed.backgroundImage,
        border: computed.border,
        borderRadius: computed.borderRadius,
      };
    });
    
    return {
      bodyBackground: bodyBg,
      cards: cardStyles,
    };
  });
  
  console.log('\n=== OUR SITE STYLES ===');
  console.log(JSON.stringify(ourStyles, null, 2));
  
  // Expected Linear values
  const expectedBodyBg = 'rgb(8, 9, 10)';
  const expectedCardBg = 'rgb(20, 21, 22)';
  const expectedBorder = 'rgba(255, 255, 255, 0.05)';
  const expectedBorderRadius = '30px';
  
  // Verify body background
  expect(ourStyles.bodyBackground).toBe(expectedBodyBg);
  console.log('✓ Body background matches Linear');
  
  // Verify card styling
  if (ourStyles.cards.length > 0) {
    const card = ourStyles.cards[0];
    
    // Check if gradient is present
    expect(card.backgroundImage).toContain('linear-gradient');
    expect(card.backgroundImage).toContain('134deg');
    console.log('✓ Card gradient matches Linear');
    
    // Check border
    expect(card.border).toContain('rgba(255, 255, 255, 0.05)');
    console.log('✓ Card border matches Linear');
    
    // Check border radius
    expect(card.borderRadius).toBe(expectedBorderRadius);
    console.log('✓ Card border radius matches Linear');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'landing/tests/our-site-comparison.png', fullPage: false });
  console.log('\n✓ Screenshot saved to landing/tests/our-site-comparison.png');
  console.log('\n✅ All Linear styling matches verified!');
});
