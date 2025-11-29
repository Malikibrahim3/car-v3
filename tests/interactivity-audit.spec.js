const { test } = require('@playwright/test');

test.describe('Interactivity Audit - Screenshot Analysis', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);
  });

  test('Capture Dashboard - Analyze Interactivity', async ({ page }) => {
    await page.click('text=Dashboard');
    await page.waitForTimeout(1500);
    
    await page.screenshot({ 
      path: 'test-results/interactivity-dashboard.png',
      fullPage: true 
    });
    
    console.log('📸 Dashboard screenshot captured');
  });

  test('Capture Garage - Analyze Interactivity', async ({ page }) => {
    await page.click('text=Garage');
    await page.waitForTimeout(1500);
    
    await page.screenshot({ 
      path: 'test-results/interactivity-garage.png',
      fullPage: true 
    });
    
    console.log('📸 Garage screenshot captured');
  });

  test('Capture Activity - Analyze Interactivity', async ({ page }) => {
    await page.click('text=Activity');
    await page.waitForTimeout(1500);
    
    await page.screenshot({ 
      path: 'test-results/interactivity-activity.png',
      fullPage: true 
    });
    
    console.log('📸 Activity screenshot captured');
  });

  test('Capture Profile - Analyze Interactivity', async ({ page }) => {
    await page.click('text=Profile');
    await page.waitForTimeout(1500);
    
    await page.screenshot({ 
      path: 'test-results/interactivity-profile.png',
      fullPage: true 
    });
    
    console.log('📸 Profile screenshot captured');
  });

  test('Capture Tools - Analyze Interactivity', async ({ page }) => {
    await page.click('text=Tools');
    await page.waitForTimeout(1500);
    
    await page.screenshot({ 
      path: 'test-results/interactivity-tools.png',
      fullPage: true 
    });
    
    console.log('📸 Tools screenshot captured');
  });

  test('Capture Card Interactions', async ({ page }) => {
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);
    
    // Hover over a card
    const card = await page.locator('text=Your Garage').locator('..').locator('..');
    await card.hover();
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/interactivity-card-hover.png',
      fullPage: false 
    });
    
    console.log('📸 Card hover state captured');
  });

  test('Capture Search Interaction', async ({ page }) => {
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);
    
    const searchBar = await page.locator('input[placeholder*="Search"]').first();
    await searchBar.click();
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/interactivity-search-focus.png',
      fullPage: false 
    });
    
    console.log('📸 Search focus state captured');
  });

  test('Analyze Interactive Elements Count', async ({ page }) => {
    const pages = ['Dashboard', 'Garage', 'Activity', 'Profile', 'Tools'];
    
    for (const pageName of pages) {
      await page.click(`text=${pageName}`);
      await page.waitForTimeout(1000);
      
      // Count interactive elements
      const buttons = await page.locator('button, [role="button"]').count();
      const links = await page.locator('a').count();
      const inputs = await page.locator('input').count();
      const pressables = await page.locator('[onPress], [onClick]').count();
      
      console.log(`\n${pageName} Interactive Elements:`);
      console.log(`  Buttons: ${buttons}`);
      console.log(`  Links: ${links}`);
      console.log(`  Inputs: ${inputs}`);
      console.log(`  Pressables: ${pressables}`);
      console.log(`  Total: ${buttons + links + inputs + pressables}`);
    }
  });

  test('Analyze Visual Feedback', async ({ page }) => {
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);
    
    // Check for animations
    const hasTransitions = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let transitionCount = 0;
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.transition !== 'all 0s ease 0s' && style.transition !== 'none') {
          transitionCount++;
        }
      });
      
      return transitionCount;
    });
    
    console.log(`\nElements with transitions: ${hasTransitions}`);
    
    // Check for hover states
    const hasHoverStates = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules || []);
          } catch {
            return [];
          }
        })
        .filter(rule => rule.selectorText?.includes(':hover'))
        .length;
      
      return styles;
    });
    
    console.log(`Hover state rules: ${hasHoverStates}`);
  });

  test('Analyze Empty States', async ({ page }) => {
    await page.click('text=Garage');
    await page.waitForTimeout(1000);
    
    const hasEmptyState = await page.locator('text=No Vehicles Yet').isVisible();
    
    if (hasEmptyState) {
      await page.screenshot({ 
        path: 'test-results/interactivity-empty-state.png',
        fullPage: true 
      });
      console.log('📸 Empty state captured - needs more engagement');
    }
  });

  test('Analyze Data Visualization', async ({ page }) => {
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);
    
    // Check for charts/graphs
    const hasCharts = await page.locator('canvas, svg[class*="chart"]').count();
    console.log(`\nData visualizations found: ${hasCharts}`);
    
    if (hasCharts > 0) {
      await page.screenshot({ 
        path: 'test-results/interactivity-charts.png',
        fullPage: false 
      });
      console.log('📸 Chart visualization captured');
    }
  });
});
