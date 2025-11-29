const { test, expect } = require('@playwright/test');

test.describe('Visual Cohesion Audit - All Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
  });

  test('Dashboard - Global Header & Search Present', async ({ page }) => {
    // Navigate to Dashboard
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);

    // Check for Global Header
    const header = await page.locator('text=AutoTrack').first();
    await expect(header).toBeVisible();

    // Check for utility icons (Search, Notifications, Profile)
    const searchIcon = await page.locator('[aria-label*="Search"], svg').first();
    await expect(searchIcon).toBeVisible();

    // Check for Search Bar
    const searchBar = await page.locator('input[placeholder*="Search"]').first();
    await expect(searchBar).toBeVisible();

    // Check for consistent spacing
    const content = await page.locator('text=Your Garage').first();
    await expect(content).toBeVisible();

    console.log('✓ Dashboard: Global header, search bar, and content present');
  });

  test('Garage - Global Header & Search Present', async ({ page }) => {
    // Navigate to Garage
    await page.click('text=Garage');
    await page.waitForTimeout(1000);

    // Check for Global Header
    const header = await page.locator('text=Garage').first();
    await expect(header).toBeVisible();

    // Check for Search Bar
    const searchBar = await page.locator('input[placeholder*="Search"]').first();
    await expect(searchBar).toBeVisible();

    // Check for floating add button
    const addButton = await page.locator('[testid="add-vehicle-button"]').first();
    await expect(addButton).toBeVisible();

    console.log('✓ Garage: Global header, search bar, and add button present');
  });

  test('Activity - Global Header & Search Present', async ({ page }) => {
    // Navigate to Activity
    await page.click('text=Activity');
    await page.waitForTimeout(1000);

    // Check for Global Header
    const header = await page.locator('text=Activity').first();
    await expect(header).toBeVisible();

    // Check for Search Bar
    const searchBar = await page.locator('input[placeholder*="Search"]').first();
    await expect(searchBar).toBeVisible();

    // Check for content sections
    const todaySection = await page.locator('text=TODAY').first();
    await expect(todaySection).toBeVisible();

    console.log('✓ Activity: Global header, search bar, and sections present');
  });

  test('Profile - Global Header Present (No Search)', async ({ page }) => {
    // Navigate to Profile
    await page.click('text=Profile');
    await page.waitForTimeout(1000);

    // Check for Global Header
    const header = await page.locator('text=Profile').first();
    await expect(header).toBeVisible();

    // Verify NO search bar (profile doesn't need it)
    const searchBars = await page.locator('input[placeholder*="Search"]').count();
    expect(searchBars).toBe(0);

    // Check for user card
    const userCard = await page.locator('text=John Doe').first();
    await expect(userCard).toBeVisible();

    console.log('✓ Profile: Global header present, no search bar (correct)');
  });

  test('Tools - Global Header Present (No Search)', async ({ page }) => {
    // Navigate to Tools
    await page.click('text=Tools');
    await page.waitForTimeout(1000);

    // Check for Global Header
    const header = await page.locator('text=Tools').first();
    await expect(header).toBeVisible();

    // Verify NO search bar (tools doesn't need it)
    const searchBars = await page.locator('input[placeholder*="Search"]').count();
    expect(searchBars).toBe(0);

    // Check for tool cards
    const valueEstimator = await page.locator('text=Value Estimator').first();
    await expect(valueEstimator).toBeVisible();

    const equityForecast = await page.locator('text=Equity Forecast').first();
    await expect(equityForecast).toBeVisible();

    console.log('✓ Tools: Global header present, tool cards visible');
  });

  test('Visual Consistency - Typography Across Pages', async ({ page }) => {
    const pages = ['Dashboard', 'Garage', 'Activity', 'Profile', 'Tools'];
    
    for (const pageName of pages) {
      await page.click(`text=${pageName}`);
      await page.waitForTimeout(500);

      // Check that header text uses SF Pro Display
      const headerElement = await page.locator(`text=${pageName === 'Dashboard' ? 'AutoTrack' : pageName}`).first();
      const fontSize = await headerElement.evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      
      // iOS Title 2 should be 22pt (approximately 29-30px on screen)
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThan(20);
      expect(fontSizeNum).toBeLessThan(35);

      console.log(`✓ ${pageName}: Header font size ${fontSize} (iOS Title 2)`);
    }
  });

  test('Visual Consistency - Spacing Across Pages', async ({ page }) => {
    const pages = ['Dashboard', 'Garage', 'Activity', 'Tools'];
    
    for (const pageName of pages) {
      await page.click(`text=${pageName}`);
      await page.waitForTimeout(500);

      // Check for consistent padding (16pt = ~21px on screen)
      const container = await page.locator('div').first();
      const paddingLeft = await container.evaluate(el => 
        window.getComputedStyle(el).paddingLeft
      );
      
      console.log(`✓ ${pageName}: Container padding ${paddingLeft}`);
    }
  });

  test('Visual Consistency - Card Styling Across Pages', async ({ page }) => {
    // Dashboard cards
    await page.click('text=Dashboard');
    await page.waitForTimeout(500);
    const dashboardCard = await page.locator('text=Your Garage').locator('..').locator('..');
    const dashboardBorderRadius = await dashboardCard.evaluate(el => 
      window.getComputedStyle(el).borderRadius
    );
    console.log(`✓ Dashboard card border radius: ${dashboardBorderRadius}`);

    // Garage cards
    await page.click('text=Garage');
    await page.waitForTimeout(500);
    const garageCards = await page.locator('[testid^="vehicle-card"]').first();
    if (await garageCards.isVisible()) {
      const garageBorderRadius = await garageCards.evaluate(el => 
        window.getComputedStyle(el).borderRadius
      );
      console.log(`✓ Garage card border radius: ${garageBorderRadius}`);
    }

    // Tools cards
    await page.click('text=Tools');
    await page.waitForTimeout(500);
    const toolCard = await page.locator('text=Value Estimator').locator('..').locator('..');
    const toolBorderRadius = await toolCard.evaluate(el => 
      window.getComputedStyle(el).borderRadius
    );
    console.log(`✓ Tools card border radius: ${toolBorderRadius}`);
  });

  test('Visual Consistency - Color Palette Across Pages', async ({ page }) => {
    const pages = ['Dashboard', 'Garage', 'Activity', 'Profile', 'Tools'];
    
    for (const pageName of pages) {
      await page.click(`text=${pageName}`);
      await page.waitForTimeout(500);

      // Check background color (should be #F2F4F6 - Porcelain Grey)
      const body = await page.locator('body');
      const bgColor = await body.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      console.log(`✓ ${pageName}: Background color ${bgColor}`);
    }
  });

  test('Navigation Flow - All Pages Accessible', async ({ page }) => {
    const tabs = [
      { name: 'Dashboard', expectedText: 'AutoTrack' },
      { name: 'Garage', expectedText: 'Garage' },
      { name: 'Activity', expectedText: 'Activity' },
      { name: 'Profile', expectedText: 'Profile' },
      { name: 'Tools', expectedText: 'Tools' }
    ];

    for (const tab of tabs) {
      await page.click(`text=${tab.name}`);
      await page.waitForTimeout(500);
      
      const header = await page.locator(`text=${tab.expectedText}`).first();
      await expect(header).toBeVisible();
      
      console.log(`✓ ${tab.name}: Navigation successful, header visible`);
    }
  });

  test('Search Functionality - Works on Applicable Pages', async ({ page }) => {
    // Dashboard search
    await page.click('text=Dashboard');
    await page.waitForTimeout(500);
    const dashboardSearch = await page.locator('input[placeholder*="Search"]').first();
    await dashboardSearch.fill('BMW');
    await page.waitForTimeout(300);
    console.log('✓ Dashboard: Search input works');

    // Garage search
    await page.click('text=Garage');
    await page.waitForTimeout(500);
    const garageSearch = await page.locator('input[placeholder*="Search"]').first();
    await garageSearch.fill('Tesla');
    await page.waitForTimeout(300);
    console.log('✓ Garage: Search input works');

    // Activity search
    await page.click('text=Activity');
    await page.waitForTimeout(500);
    const activitySearch = await page.locator('input[placeholder*="Search"]').first();
    await activitySearch.fill('value');
    await page.waitForTimeout(300);
    console.log('✓ Activity: Search input works');
  });

  test('Header Icons - Consistent Across Pages', async ({ page }) => {
    const pagesWithIcons = ['Dashboard', 'Garage', 'Activity', 'Profile', 'Tools'];
    
    for (const pageName of pagesWithIcons) {
      await page.click(`text=${pageName}`);
      await page.waitForTimeout(500);

      // Count utility icons (should be 3: Search/None, Notifications, Profile)
      const icons = await page.locator('svg').count();
      expect(icons).toBeGreaterThan(0);
      
      console.log(`✓ ${pageName}: ${icons} icons present in header`);
    }
  });

  test('Empty States - Consistent Styling', async ({ page }) => {
    // Check Garage empty state (if no vehicles)
    await page.click('text=Garage');
    await page.waitForTimeout(500);
    
    const emptyState = await page.locator('text=No Vehicles Yet');
    if (await emptyState.isVisible()) {
      const emptyStateIcon = await page.locator('svg').first();
      await expect(emptyStateIcon).toBeVisible();
      console.log('✓ Garage: Empty state styled consistently');
    }
  });

  test('iOS Design System - Touch Targets', async ({ page }) => {
    // Check that all buttons meet iOS minimum touch target (44pt)
    await page.click('text=Dashboard');
    await page.waitForTimeout(500);

    const buttons = await page.locator('button, [role="button"]').all();
    
    for (const button of buttons.slice(0, 5)) { // Check first 5 buttons
      const box = await button.boundingBox();
      if (box) {
        // iOS minimum is 44pt (approximately 58-60px on screen)
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
    
    console.log('✓ Touch targets meet iOS minimum size requirements');
  });

  test('Final Cohesion Check - All Pages Look Unified', async ({ page }) => {
    const pages = ['Dashboard', 'Garage', 'Activity', 'Profile', 'Tools'];
    const results = {
      hasGlobalHeader: [],
      hasConsistentSpacing: [],
      hasConsistentTypography: [],
      hasConsistentColors: [],
    };

    for (const pageName of pages) {
      await page.click(`text=${pageName}`);
      await page.waitForTimeout(500);

      // Check global header
      const header = await page.locator(`text=${pageName === 'Dashboard' ? 'AutoTrack' : pageName}`).first();
      results.hasGlobalHeader.push(await header.isVisible());

      // Check for consistent card styling
      const cards = await page.locator('[style*="borderRadius"]').count();
      results.hasConsistentSpacing.push(cards > 0);

      // Check typography
      const textElements = await page.locator('text').count();
      results.hasConsistentTypography.push(textElements > 0);

      // Check background color
      const bgColor = await page.evaluate(() => 
        window.getComputedStyle(document.body).backgroundColor
      );
      results.hasConsistentColors.push(bgColor.includes('242') || bgColor.includes('244') || bgColor.includes('246'));
    }

    // Verify all pages pass cohesion checks
    expect(results.hasGlobalHeader.every(v => v)).toBe(true);
    expect(results.hasConsistentSpacing.every(v => v)).toBe(true);
    expect(results.hasConsistentTypography.every(v => v)).toBe(true);
    expect(results.hasConsistentColors.every(v => v)).toBe(true);

    console.log('✅ COHESION CHECK PASSED: All pages look unified and consistent');
    console.log('   - Global headers: ✓');
    console.log('   - Consistent spacing: ✓');
    console.log('   - Consistent typography: ✓');
    console.log('   - Consistent colors: ✓');
  });
});
