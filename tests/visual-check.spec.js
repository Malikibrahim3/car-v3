/**
 * Simple Visual Check - Human-Designed Dashboard
 * Just takes screenshots and checks basic rendering
 */

const { test, expect } = require('@playwright/test');

test.describe('Visual Check - Human Design', () => {
  test('capture dashboard and check for human design elements', async ({ page }) => {
    // Navigate and wait for load
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(5000); // Give it time to fully load
    
    // Take full screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-visual-check.png',
      fullPage: true 
    });
    
    console.log('✅ Screenshot saved to test-results/dashboard-visual-check.png');
    
    // Check page content
    const bodyText = await page.textContent('body');
    console.log('Page contains text:', bodyText ? 'Yes' : 'No');
    
    // Check for maroon color in computed styles
    const maroonFound = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      let maroonCount = 0;
      
      for (const el of allElements) {
        const styles = window.getComputedStyle(el);
        const props = [
          styles.color,
          styles.backgroundColor,
          styles.borderColor,
          styles.borderLeftColor,
          styles.borderRightColor,
          styles.borderTopColor,
          styles.borderBottomColor,
        ];
        
        for (const prop of props) {
          // Check for maroon-ish colors (rgb(139, 21, 56) or similar)
          if (prop && (
            prop.includes('139') || 
            prop.includes('8B') ||
            prop.includes('107') || // 6B in decimal
            prop.includes('168')    // A8 in decimal
          )) {
            maroonCount++;
            console.log('Found maroon-like color:', prop, 'on', el.tagName);
          }
        }
      }
      
      return maroonCount;
    });
    
    console.log('Maroon-like colors found:', maroonFound);
    
    // Check for teal (the AI color we want to avoid)
    const tealFound = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      let tealCount = 0;
      
      for (const el of allElements) {
        const styles = window.getComputedStyle(el);
        const bg = styles.background + styles.backgroundColor;
        
        // Check for teal (#2AD0BB = rgb(42, 208, 187))
        if (bg.includes('42, 208, 187') || bg.includes('2AD0BB')) {
          tealCount++;
          console.log('Found teal on:', el.tagName, el.className);
        }
      }
      
      return tealCount;
    });
    
    console.log('Teal colors found:', tealFound);
    
    // Check background color
    const bgColor = await page.evaluate(() => {
      const body = document.body;
      const container = document.querySelector('[data-testid="dashboard-screen"]') || body;
      return window.getComputedStyle(container).backgroundColor;
    });
    
    console.log('Background color:', bgColor);
    
    // Basic assertions
    expect(bodyText).toBeTruthy();
    
    // Report findings
    console.log('\n=== VISUAL CHECK SUMMARY ===');
    console.log('Maroon elements:', maroonFound);
    console.log('Teal elements (should be 0):', tealFound);
    console.log('Background:', bgColor);
    console.log('Screenshot: test-results/dashboard-visual-check.png');
    console.log('===========================\n');
  });
  
  test('check if components are rendering at all', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(5000);
    
    // Get all text content
    const allText = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    console.log('\n=== PAGE TEXT CONTENT ===');
    console.log(allText.substring(0, 500)); // First 500 chars
    console.log('=========================\n');
    
    // Check for expected text
    const hasPortfolioText = allText.includes('Portfolio') || allText.includes('portfolio');
    const hasValueText = allText.includes('$') || allText.includes('Value');
    const hasMileageText = allText.includes('miles') || allText.includes('mi');
    
    console.log('Has "Portfolio" text:', hasPortfolioText);
    console.log('Has value/$ text:', hasValueText);
    console.log('Has mileage text:', hasMileageText);
    
    // Take screenshot of what's actually rendering
    await page.screenshot({ 
      path: 'test-results/dashboard-content-check.png',
      fullPage: true 
    });
  });
});
