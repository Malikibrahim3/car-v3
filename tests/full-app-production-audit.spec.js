/**
 * FULL APP PRODUCTION READINESS AUDIT
 * Comprehensive UI/UX inspection across all pages
 */

const { test, expect } = require('@playwright/test');

// Configuration
const BASE_URL = 'http://localhost:8081';
const MOBILE_VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro

test.describe('🔍 FULL APP PRODUCTION AUDIT', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
  });

  // ============================================
  // SECTION 1: LANDING PAGE AUDIT
  // ============================================
  test('1.1 Landing Page - Visual & Theme Consistency', async ({ page }) => {
    console.log('\n📱 LANDING PAGE AUDIT');
    
    const issues = [];
    
    // Check background
    const body = await page.locator('body').first();
    const bgColor = await body.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log('Background:', bgColor);
    if (!bgColor.includes('5, 5, 5') && !bgColor.includes('0, 0, 0')) {
      issues.push('❌ Background not OLED black (#050505)');
    }
    
    // Check for hero text
    const heroText = page.getByText(/CarValue|Track|Portfolio/i).first();
    if (await heroText.count() > 0) {
      const fontSize = await heroText.evaluate(el => window.getComputedStyle(el).fontSize);
      console.log('Hero font size:', fontSize);
      if (parseInt(fontSize) < 32) {
        issues.push('❌ Hero text too small (should be 32px+)');
      }
    }
    
    // Check for CTA button
    const ctaButton = page.getByRole('button', { name: /get started|sign in|continue/i }).first();
    if (await ctaButton.count() === 0) {
      issues.push('❌ No clear CTA button found');
    } else {
      const btnBg = await ctaButton.evaluate(el => window.getComputedStyle(el).backgroundColor);
      console.log('CTA button color:', btnBg);
      if (!btnBg.includes('255, 230, 0')) {
        issues.push('⚠️ CTA button not using accent color (#FFE600)');
      }
    }
    
    console.log('\n📊 Landing Page Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 2: DASHBOARD AUDIT
  // ============================================
  test('2.1 Dashboard - Theme & Layout Consistency', async ({ page }) => {
    console.log('\n📱 DASHBOARD AUDIT');
    
    // Navigate to dashboard (simulate auth)
    await page.evaluate(() => {
      localStorage.setItem('testMode', 'true');
    });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Check for portfolio value
    const portfolioValue = page.getByText(/\$\d+,?\d*/);
    if (await portfolioValue.count() === 0) {
      issues.push('❌ No portfolio value displayed');
    } else {
      const valueSize = await portfolioValue.first().evaluate(el => window.getComputedStyle(el).fontSize);
      console.log('Portfolio value size:', valueSize);
      if (parseInt(valueSize) < 36) {
        issues.push('⚠️ Portfolio value too small (should be 36px+)');
      }
    }
    
    // Check for chart
    const chartArea = page.locator('[class*="chart"], svg, canvas').first();
    if (await chartArea.count() === 0) {
      issues.push('❌ No chart visualization found');
    } else {
      console.log('✅ Chart found');
    }
    
    // Check for glass cards
    const glassCards = page.locator('[style*="blur"], [class*="glass"]');
    const cardCount = await glassCards.count();
    console.log('Glass cards found:', cardCount);
    if (cardCount < 2) {
      issues.push('⚠️ Insufficient glass card usage (found ' + cardCount + ')');
    }
    
    // Check spacing consistency
    const cards = await page.locator('[class*="card"], [style*="border"]').all();
    for (let i = 0; i < Math.min(cards.length, 3); i++) {
      const padding = await cards[i].evaluate(el => window.getComputedStyle(el).padding);
      console.log(`Card ${i + 1} padding:`, padding);
    }
    
    console.log('\n📊 Dashboard Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  test('2.2 Dashboard - Interactive Elements', async ({ page }) => {
    console.log('\n🎯 DASHBOARD INTERACTIONS');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Check for clickable cards
    const clickableElements = await page.locator('[role="button"], button, [onclick]').all();
    console.log('Clickable elements:', clickableElements.length);
    
    if (clickableElements.length < 3) {
      issues.push('⚠️ Limited interactive elements (found ' + clickableElements.length + ')');
    }
    
    // Test card press states
    const firstCard = page.locator('[class*="card"]').first();
    if (await firstCard.count() > 0) {
      const initialOpacity = await firstCard.evaluate(el => window.getComputedStyle(el).opacity);
      await firstCard.hover();
      await page.waitForTimeout(100);
      const hoverOpacity = await firstCard.evaluate(el => window.getComputedStyle(el).opacity);
      
      if (initialOpacity === hoverOpacity) {
        issues.push('⚠️ No hover/press feedback on cards');
      }
    }
    
    console.log('\n📊 Interaction Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 3: GARAGE PAGE AUDIT
  // ============================================
  test('3.1 Garage - Vehicle List & Add Button', async ({ page }) => {
    console.log('\n🚗 GARAGE PAGE AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    // Navigate to garage
    const garageTab = page.getByRole('button', { name: /garage/i }).or(page.locator('[aria-label*="garage"]'));
    if (await garageTab.count() > 0) {
      await garageTab.first().click();
      await page.waitForTimeout(1000);
    }
    
    const issues = [];
    
    // Check for add vehicle button
    const addButton = page.getByRole('button', { name: /add/i }).or(page.getByTestId('add-vehicle-button'));
    if (await addButton.count() === 0) {
      issues.push('❌ No "Add Vehicle" button found');
    } else {
      console.log('✅ Add button found');
      
      // Test add button functionality
      await addButton.first().click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('[role="dialog"], [class*="modal"]');
      if (await modal.count() === 0) {
        issues.push('❌ Add vehicle modal does not open');
      } else {
        console.log('✅ Modal opens');
      }
    }
    
    // Check for vehicle cards or empty state
    const vehicleCards = page.locator('[class*="vehicle"], [testid*="vehicle"]');
    const emptyState = page.getByText(/no vehicles/i);
    
    if (await vehicleCards.count() === 0 && await emptyState.count() === 0) {
      issues.push('❌ No vehicle list or empty state shown');
    }
    
    console.log('\n📊 Garage Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  test('3.2 Garage - Add Vehicle Modal', async ({ page }) => {
    console.log('\n📝 ADD VEHICLE MODAL AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Navigate to garage and open modal
    const garageTab = page.locator('[aria-label*="garage"], [class*="garage"]').first();
    if (await garageTab.count() > 0) {
      await garageTab.click();
      await page.waitForTimeout(1000);
    }
    
    const addButton = page.getByTestId('add-vehicle-button').or(page.getByRole('button', { name: /add/i }));
    if (await addButton.count() > 0) {
      await addButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for required fields
      const yearInput = page.getByLabel(/year/i).or(page.getByPlaceholder(/year/i));
      const makeInput = page.getByLabel(/make/i).or(page.getByPlaceholder(/make/i));
      const modelInput = page.getByLabel(/model/i).or(page.getByPlaceholder(/model/i));
      
      if (await yearInput.count() === 0) issues.push('❌ Year input missing');
      if (await makeInput.count() === 0) issues.push('❌ Make input missing');
      if (await modelInput.count() === 0) issues.push('❌ Model input missing');
      
      // Check input styling
      if (await yearInput.count() > 0) {
        const inputBg = await yearInput.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
        console.log('Input background:', inputBg);
        
        const inputBorder = await yearInput.first().evaluate(el => window.getComputedStyle(el).border);
        console.log('Input border:', inputBorder);
      }
      
      // Check for submit button
      const submitBtn = page.getByRole('button', { name: /add vehicle|save|submit/i });
      if (await submitBtn.count() === 0) {
        issues.push('❌ No submit button in modal');
      }
    }
    
    console.log('\n📊 Modal Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 4: TOOLS PAGE AUDIT
  // ============================================
  test('4.1 Tools Hub - Navigation & Cards', async ({ page }) => {
    console.log('\n🔧 TOOLS PAGE AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Navigate to tools
    const toolsTab = page.locator('[aria-label*="tools"]').or(page.getByText(/tools/i));
    if (await toolsTab.count() > 0) {
      await toolsTab.first().click();
      await page.waitForTimeout(1000);
      
      // Check for tool cards
      const estimatorCard = page.getByText(/estimator|value/i);
      const forecastCard = page.getByText(/forecast|projection/i);
      
      if (await estimatorCard.count() === 0) {
        issues.push('❌ Estimator tool card missing');
      }
      if (await forecastCard.count() === 0) {
        issues.push('❌ Forecast tool card missing');
      }
      
      // Check card styling
      const toolCards = page.locator('[class*="card"]');
      const cardCount = await toolCards.count();
      console.log('Tool cards found:', cardCount);
      
      if (cardCount < 2) {
        issues.push('⚠️ Insufficient tool cards (expected 2+, found ' + cardCount + ')');
      }
    } else {
      issues.push('❌ Tools tab not found in navigation');
    }
    
    console.log('\n📊 Tools Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 5: ACTIVITY PAGE AUDIT
  // ============================================
  test('5.1 Activity Feed - Notifications & Achievements', async ({ page }) => {
    console.log('\n🔔 ACTIVITY PAGE AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Navigate to activity
    const activityTab = page.locator('[aria-label*="activity"]').or(page.getByText(/activity/i));
    if (await activityTab.count() > 0) {
      await activityTab.first().click();
      await page.waitForTimeout(1000);
      
      // Check for activity items
      const activityItems = page.locator('[class*="activity"], [class*="notification"]');
      const itemCount = await activityItems.count();
      console.log('Activity items:', itemCount);
      
      if (itemCount === 0) {
        issues.push('⚠️ No activity items or empty state shown');
      }
      
      // Check for gamification elements
      const achievementBadge = page.getByText(/level|achievement|xp/i);
      if (await achievementBadge.count() === 0) {
        issues.push('⚠️ No gamification elements found');
      } else {
        console.log('✅ Gamification present');
      }
    } else {
      issues.push('❌ Activity tab not found');
    }
    
    console.log('\n📊 Activity Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 6: PROFILE PAGE AUDIT
  // ============================================
  test('6.1 Profile - Settings & Menu Items', async ({ page }) => {
    console.log('\n👤 PROFILE PAGE AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Navigate to profile
    const profileTab = page.locator('[aria-label*="profile"]').or(page.getByText(/profile/i));
    if (await profileTab.count() > 0) {
      await profileTab.first().click();
      await page.waitForTimeout(1000);
      
      // Check for user info
      const userName = page.getByText(/john|user|name/i);
      if (await userName.count() === 0) {
        issues.push('⚠️ No user name displayed');
      }
      
      // Check for settings options
      const settingsItems = page.locator('[class*="menu"], [role="menuitem"]');
      const itemCount = await settingsItems.count();
      console.log('Settings items:', itemCount);
      
      if (itemCount < 3) {
        issues.push('⚠️ Limited settings options (found ' + itemCount + ')');
      }
      
      // Check for dark mode toggle
      const darkModeToggle = page.locator('[role="switch"]').or(page.getByText(/dark mode/i));
      if (await darkModeToggle.count() === 0) {
        issues.push('⚠️ No dark mode toggle found');
      }
    } else {
      issues.push('❌ Profile tab not found');
    }
    
    console.log('\n📊 Profile Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 7: TAB BAR AUDIT
  // ============================================
  test('7.1 Tab Bar - Design & Functionality', async ({ page }) => {
    console.log('\n📍 TAB BAR AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Check for tab bar
    const tabBar = page.locator('[role="tablist"], [class*="tab"]').first();
    if (await tabBar.count() === 0) {
      issues.push('❌ Tab bar not found');
    } else {
      // Check position
      const position = await tabBar.evaluate(el => window.getComputedStyle(el).position);
      console.log('Tab bar position:', position);
      
      if (position !== 'absolute' && position !== 'fixed') {
        issues.push('⚠️ Tab bar not floating (should be absolute/fixed)');
      }
      
      // Check for 5 tabs
      const tabs = page.locator('[role="tab"], [class*="tab-item"]');
      const tabCount = await tabs.count();
      console.log('Tab count:', tabCount);
      
      if (tabCount !== 5) {
        issues.push(`⚠️ Expected 5 tabs, found ${tabCount}`);
      }
      
      // Check tab bar styling
      const bgColor = await tabBar.evaluate(el => window.getComputedStyle(el).backgroundColor);
      const borderRadius = await tabBar.evaluate(el => window.getComputedStyle(el).borderRadius);
      
      console.log('Tab bar background:', bgColor);
      console.log('Tab bar radius:', borderRadius);
      
      if (parseInt(borderRadius) < 20) {
        issues.push('⚠️ Tab bar not rounded enough (should be 36px)');
      }
    }
    
    console.log('\n📊 Tab Bar Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 8: THEME CONSISTENCY AUDIT
  // ============================================
  test('8.1 Global Theme Consistency', async ({ page }) => {
    console.log('\n🎨 THEME CONSISTENCY AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    const pages = ['dashboard', 'garage', 'tools', 'activity', 'profile'];
    const themeData = {};
    
    for (const pageName of pages) {
      // Navigate to page
      const tab = page.locator(`[aria-label*="${pageName}"]`).or(page.getByText(new RegExp(pageName, 'i')));
      if (await tab.count() > 0) {
        await tab.first().click();
        await page.waitForTimeout(1000);
        
        // Collect theme data
        const body = await page.locator('body').first();
        const bgColor = await body.evaluate(el => window.getComputedStyle(el).backgroundColor);
        
        const headings = page.locator('h1, h2, [style*="fontSize: 32"], [style*="fontSize: 24"]');
        let headingColor = 'N/A';
        if (await headings.count() > 0) {
          headingColor = await headings.first().evaluate(el => window.getComputedStyle(el).color);
        }
        
        themeData[pageName] = { bgColor, headingColor };
        console.log(`${pageName}:`, themeData[pageName]);
      }
    }
    
    // Check consistency
    const backgrounds = Object.values(themeData).map(d => d.bgColor);
    const uniqueBgs = [...new Set(backgrounds)];
    
    if (uniqueBgs.length > 1) {
      issues.push(`❌ Inconsistent backgrounds across pages: ${uniqueBgs.join(', ')}`);
    }
    
    console.log('\n📊 Theme Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 9: TYPOGRAPHY AUDIT
  // ============================================
  test('9.1 Typography Consistency', async ({ page }) => {
    console.log('\n📝 TYPOGRAPHY AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Check heading hierarchy
    const h1 = page.locator('h1, [style*="fontSize: 42"], [style*="fontSize: 32"]').first();
    const h2 = page.locator('h2, [style*="fontSize: 24"], [style*="fontSize: 20"]').first();
    const body = page.locator('p, [style*="fontSize: 16"], [style*="fontSize: 14"]').first();
    
    if (await h1.count() > 0) {
      const h1Size = await h1.evaluate(el => window.getComputedStyle(el).fontSize);
      const h1Weight = await h1.evaluate(el => window.getComputedStyle(el).fontWeight);
      console.log('H1:', h1Size, h1Weight);
      
      if (parseInt(h1Size) < 32) {
        issues.push('⚠️ H1 too small (should be 32px+)');
      }
      if (parseInt(h1Weight) < 700) {
        issues.push('⚠️ H1 not bold enough (should be 700+)');
      }
    }
    
    // Check font family consistency
    const elements = await page.locator('h1, h2, p, button, input').all();
    const fonts = [];
    for (let i = 0; i < Math.min(elements.length, 5); i++) {
      const font = await elements[i].evaluate(el => window.getComputedStyle(el).fontFamily);
      fonts.push(font);
    }
    
    const uniqueFonts = [...new Set(fonts)];
    console.log('Fonts used:', uniqueFonts);
    
    if (uniqueFonts.length > 2) {
      issues.push(`⚠️ Too many font families (${uniqueFonts.length})`);
    }
    
    console.log('\n📊 Typography Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });

  // ============================================
  // SECTION 10: SPACING & LAYOUT AUDIT
  // ============================================
  test('10.1 Spacing Consistency', async ({ page }) => {
    console.log('\n📏 SPACING AUDIT');
    
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Check screen padding
    const container = page.locator('[class*="container"], [class*="scroll"]').first();
    if (await container.count() > 0) {
      const padding = await container.evaluate(el => window.getComputedStyle(el).padding);
      console.log('Container padding:', padding);
      
      const paddingValue = parseInt(padding);
      if (paddingValue < 16 || paddingValue > 24) {
        issues.push(`⚠️ Inconsistent padding (${paddingValue}px, should be 16-24px)`);
      }
    }
    
    // Check card gaps
    const cards = await page.locator('[class*="card"]').all();
    if (cards.length >= 2) {
      const card1Rect = await cards[0].boundingBox();
      const card2Rect = await cards[1].boundingBox();
      
      if (card1Rect && card2Rect) {
        const gap = card2Rect.y - (card1Rect.y + card1Rect.height);
        console.log('Card gap:', gap);
        
        if (gap < 8 || gap > 20) {
          issues.push(`⚠️ Inconsistent card spacing (${gap}px)`);
        }
      }
    }
    
    console.log('\n📊 Spacing Issues:', issues.length);
    issues.forEach(issue => console.log(issue));
  });
});

// ============================================
// FINAL SUMMARY TEST
// ============================================
test('📋 GENERATE PRODUCTION READINESS REPORT', async ({ page }) => {
  console.log('\n' + '='.repeat(60));
  console.log('📋 PRODUCTION READINESS SUMMARY');
  console.log('='.repeat(60));
  
  console.log('\n✅ Tests completed. Review output above for detailed issues.');
  console.log('\nKey areas audited:');
  console.log('  1. Landing Page');
  console.log('  2. Dashboard (Theme & Interactions)');
  console.log('  3. Garage (Vehicle Management)');
  console.log('  4. Tools Hub');
  console.log('  5. Activity Feed');
  console.log('  6. Profile & Settings');
  console.log('  7. Tab Bar Navigation');
  console.log('  8. Theme Consistency');
  console.log('  9. Typography');
  console.log('  10. Spacing & Layout');
  
  console.log('\n' + '='.repeat(60));
});
