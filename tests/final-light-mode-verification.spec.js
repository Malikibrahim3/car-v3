const { test, expect } = require('@playwright/test');

test.describe('Final Light Mode Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000); // Wait for app to fully load
  });

  test('Complete visual audit with screenshots', async ({ page }) => {
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/01-initial-load.png', 
      fullPage: true 
    });
    
    console.log('✓ Initial screenshot captured');
    
    // Check if we can find any text elements
    const textElements = await page.locator('text=/./').count();
    console.log(`Found ${textElements} text elements`);
    
    // Try to find common UI elements
    const hasButtons = await page.locator('button').count();
    console.log(`Found ${hasButtons} buttons`);
    
    // Check for navigation/tabs
    const hasTabs = await page.locator('[role="navigation"], [role="tablist"], [role="tab"]').count();
    console.log(`Found ${hasTabs} navigation elements`);
    
    // Get computed styles of body
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });
    
    console.log('Body styles:', bodyStyles);
    
    // Check if background is light (not dark)
    const bgIsLight = !bodyStyles.backgroundColor.includes('0, 0, 0') && 
                      !bodyStyles.backgroundColor.includes('5, 5, 5');
    console.log(`Background is light: ${bgIsLight}`);
    
    // Wait a bit more and take another screenshot
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'test-results/02-after-wait.png', 
      fullPage: true 
    });
    
    console.log('✓ Second screenshot captured');
    
    // Try to interact with the page
    const clickableElements = await page.locator('button, a, [role="button"]').all();
    console.log(`Found ${clickableElements.length} clickable elements`);
    
    if (clickableElements.length > 0) {
      // Click first clickable element
      try {
        await clickableElements[0].click({ timeout: 1000 });
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: 'test-results/03-after-interaction.png', 
          fullPage: true 
        });
        console.log('✓ Interaction screenshot captured');
      } catch (e) {
        console.log('Could not interact with element:', e.message);
      }
    }
    
    // Final report
    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log(`Text elements: ${textElements}`);
    console.log(`Buttons: ${hasButtons}`);
    console.log(`Navigation: ${hasTabs}`);
    console.log(`Background: ${bodyStyles.backgroundColor}`);
    console.log(`Text color: ${bodyStyles.color}`);
    console.log('Screenshots saved to test-results/');
    console.log('===========================\n');
    
    // Basic assertions
    expect(textElements).toBeGreaterThan(0);
  });

  test('Color palette verification', async ({ page }) => {
    // Get all elements and check their colors
    const colorReport = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const colors = {
        backgrounds: new Set(),
        textColors: new Set(),
        borderColors: new Set(),
      };
      
      for (let i = 0; i < Math.min(elements.length, 100); i++) {
        const el = elements[i];
        const computed = window.getComputedStyle(el);
        
        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.backgrounds.add(computed.backgroundColor);
        }
        if (computed.color) {
          colors.textColors.add(computed.color);
        }
        if (computed.borderColor && computed.borderColor !== 'rgba(0, 0, 0, 0)') {
          colors.borderColors.add(computed.borderColor);
        }
      }
      
      return {
        backgrounds: Array.from(colors.backgrounds),
        textColors: Array.from(colors.textColors),
        borderColors: Array.from(colors.borderColors),
      };
    });
    
    console.log('\n=== COLOR PALETTE FOUND ===');
    console.log('Backgrounds:', colorReport.backgrounds);
    console.log('Text Colors:', colorReport.textColors);
    console.log('Border Colors:', colorReport.borderColors);
    console.log('===========================\n');
    
    // Check for dark mode artifacts
    const hasDarkBackground = colorReport.backgrounds.some(bg => 
      bg.includes('5, 5, 5') || bg.includes('10, 10, 10')
    );
    
    const hasWhiteText = colorReport.textColors.some(color => 
      color.includes('255, 255, 255')
    );
    
    console.log(`Dark mode background found: ${hasDarkBackground}`);
    console.log(`White text found: ${hasWhiteText}`);
    
    // We expect some white (for cards), but not dark backgrounds
    expect(hasDarkBackground).toBe(false);
  });

  test('Component visibility check', async ({ page }) => {
    // Check if key components are visible
    const components = {
      buttons: await page.locator('button').count(),
      inputs: await page.locator('input, textarea').count(),
      links: await page.locator('a').count(),
      images: await page.locator('img').count(),
      headings: await page.locator('h1, h2, h3, h4, h5, h6').count(),
    };
    
    console.log('\n=== COMPONENT COUNT ===');
    console.log(components);
    console.log('=======================\n');
    
    // Take a screenshot highlighting interactive elements
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.style.outline = '2px solid red';
      });
    });
    
    await page.screenshot({ 
      path: 'test-results/04-buttons-highlighted.png', 
      fullPage: true 
    });
    
    console.log('✓ Button highlight screenshot captured');
  });
});
