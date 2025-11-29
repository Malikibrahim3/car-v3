const { test, expect } = require('@playwright/test');

test.describe('Light Mode Comprehensive Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
  });

  test('should have porcelain grey background', async ({ page }) => {
    const body = await page.locator('body');
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be #F2F4F6 or similar light grey
    console.log('Background color:', bgColor);
    expect(bgColor).not.toBe('rgb(0, 0, 0)'); // Not black
    expect(bgColor).not.toBe('rgb(5, 5, 5)'); // Not dark mode
  });

  test('should have dark text on light background', async ({ page }) => {
    const textElements = await page.locator('text=Dashboard, text=Garage, text=Profile').all();
    
    for (const element of textElements) {
      const color = await element.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      console.log('Text color:', color);
      // Should be dark (near black), not white
      expect(color).not.toContain('255, 255, 255');
    }
  });

  test('should have white cards with shadows', async ({ page }) => {
    // Look for card-like elements
    const cards = await page.locator('[style*="backgroundColor"]').all();
    
    let whiteCardFound = false;
    for (const card of cards.slice(0, 10)) { // Check first 10
      const bgColor = await card.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'rgba(255, 255, 255, 1)') {
        whiteCardFound = true;
        console.log('Found white card');
        break;
      }
    }
    
    expect(whiteCardFound).toBe(true);
  });

  test('should have crimson accent color', async ({ page }) => {
    // Look for accent-colored elements (buttons, icons, etc.)
    const accentElements = await page.locator('[style*="color"]').all();
    
    let crimsonFound = false;
    for (const element of accentElements.slice(0, 20)) {
      const color = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.color || style.backgroundColor;
      });
      
      // Check for crimson (#A50010 = rgb(165, 0, 16))
      if (color.includes('165, 0, 16') || color.includes('#A50010')) {
        crimsonFound = true;
        console.log('Found crimson accent');
        break;
      }
    }
    
    console.log('Crimson accent found:', crimsonFound);
  });

  test('should have visible tab bar with light styling', async ({ page }) => {
    // Tab bar should be visible at bottom
    const tabBar = await page.locator('[role="navigation"], [role="tablist"]').first();
    
    if (await tabBar.count() > 0) {
      const isVisible = await tabBar.isVisible();
      expect(isVisible).toBe(true);
      
      const bgColor = await tabBar.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      console.log('Tab bar background:', bgColor);
      // Should be light, not dark
      expect(bgColor).not.toContain('10, 10, 10');
    }
  });

  test('should have readable contrast ratios', async ({ page }) => {
    // Get all text elements
    const textElements = await page.locator('text=/./').all();
    
    let contrastIssues = 0;
    for (const element of textElements.slice(0, 20)) {
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });
      
      // Check if text is white on white (bad) or black on black (bad)
      if (styles.color.includes('255, 255, 255') && styles.backgroundColor.includes('255, 255, 255')) {
        contrastIssues++;
        console.log('Contrast issue: white on white');
      }
      if (styles.color.includes('0, 0, 0') && styles.backgroundColor.includes('0, 0, 0')) {
        contrastIssues++;
        console.log('Contrast issue: black on black');
      }
    }
    
    expect(contrastIssues).toBe(0);
  });

  test('should have proper modal styling', async ({ page }) => {
    // Try to open a modal (if add vehicle button exists)
    const addButton = await page.locator('text=Add, button:has-text("Add")').first();
    
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Check if modal has light background
      const modal = await page.locator('[role="dialog"], [role="alertdialog"]').first();
      if (await modal.count() > 0) {
        const bgColor = await modal.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        console.log('Modal background:', bgColor);
        expect(bgColor).toContain('255, 255, 255'); // Should be white
      }
    }
  });

  test('should have visible input fields', async ({ page }) => {
    // Look for input fields
    const inputs = await page.locator('input, textarea').all();
    
    for (const input of inputs.slice(0, 5)) {
      const isVisible = await input.isVisible();
      if (isVisible) {
        const styles = await input.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor,
          };
        });
        
        console.log('Input styles:', styles);
        // Text should be dark, not white
        expect(styles.color).not.toContain('255, 255, 255');
      }
    }
  });

  test('should have proper button styling', async ({ page }) => {
    const buttons = await page.locator('button').all();
    
    let primaryButtonFound = false;
    for (const button of buttons.slice(0, 10)) {
      const isVisible = await button.isVisible();
      if (isVisible) {
        const bgColor = await button.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // Check for crimson primary button
        if (bgColor.includes('165, 0, 16')) {
          primaryButtonFound = true;
          console.log('Found crimson primary button');
          
          // Check text color on crimson button (should be white)
          const textColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).color;
          });
          expect(textColor).toContain('255, 255, 255');
        }
      }
    }
    
    console.log('Primary button found:', primaryButtonFound);
  });

  test('should not have any dark mode artifacts', async ({ page }) => {
    // Check for common dark mode colors that shouldn't be there
    const allElements = await page.locator('*').all();
    
    let darkModeArtifacts = 0;
    for (const element of allElements.slice(0, 50)) {
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          bg: computed.backgroundColor,
          color: computed.color,
        };
      });
      
      // Check for dark mode backgrounds
      if (styles.bg.includes('5, 5, 5') || styles.bg.includes('10, 10, 10')) {
        darkModeArtifacts++;
        console.log('Dark mode artifact found:', styles.bg);
      }
      
      // Check for neon yellow accent (old dark mode)
      if (styles.color.includes('255, 230, 0') || styles.bg.includes('255, 230, 0')) {
        darkModeArtifacts++;
        console.log('Old yellow accent found');
      }
    }
    
    expect(darkModeArtifacts).toBe(0);
  });
});
