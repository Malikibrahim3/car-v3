const { test, expect } = require('@playwright/test');

/**
 * FORECAST & ESTIMATE PAGE AUDIT
 * Deep inspection to find all visual and functional issues
 */

test.describe('🔍 Forecast & Estimate Page Audit', () => {
  
  test('Audit Forecast Page', async ({ page }) => {
    console.log('\n' + '='.repeat(80));
    console.log('📊 AUDITING FORECAST PAGE');
    console.log('='.repeat(80) + '\n');
    
    await page.goto('http://localhost:8081/forecast');
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/forecast-page.png', fullPage: true });
    
    // 1. Check for back button
    console.log('1. Checking back button...');
    const backButton = await page.locator('button, [role="button"]').filter({ hasText: /back/i }).count();
    const backIcon = await page.locator('svg').first().isVisible();
    if (!backIcon && backButton === 0) {
      issues.push('❌ No visible back button found');
      console.log('   ❌ No visible back button');
    } else {
      console.log('   ✅ Back button present');
    }
    
    // 2. Check for page title
    console.log('2. Checking page title...');
    const pageTitle = await page.locator('text=/forecast|value forecast/i').first().isVisible().catch(() => false);
    if (!pageTitle) {
      issues.push('❌ No page title found');
      console.log('   ❌ No page title visible');
    } else {
      console.log('   ✅ Page title found');
    }
    
    // 3. Check background color
    console.log('3. Checking background color...');
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`   Background color: ${bgColor}`);
    if (bgColor.includes('0, 0, 0') || bgColor === 'rgb(0, 0, 0)') {
      issues.push('❌ Background is black (should be light grey #F2F4F6)');
      console.log('   ❌ Background is BLACK');
    }
    
    // 4. Check text visibility
    console.log('4. Checking text visibility...');
    const allText = await page.locator('text=/current|forecast|value/i').all();
    console.log(`   Found ${allText.length} text elements`);
    
    // 5. Check for charts
    console.log('5. Checking for charts...');
    const charts = await page.locator('svg, canvas').count();
    console.log(`   Found ${charts} chart elements`);
    if (charts === 0) {
      issues.push('⚠️ No charts found');
    }
    
    // 6. Check for interactive elements
    console.log('6. Checking interactive elements...');
    const buttons = await page.locator('button, [role="button"]').count();
    console.log(`   Found ${buttons} buttons`);
    
    // 7. Check padding
    console.log('7. Checking padding...');
    const mainContent = await page.locator('body > div').first();
    const padding = await mainContent.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        left: parseInt(style.paddingLeft),
        right: parseInt(style.paddingRight),
      };
    });
    console.log(`   Padding: ${padding.left}px / ${padding.right}px`);
    if (padding.left < 16 || padding.right < 16) {
      issues.push('⚠️ Insufficient horizontal padding');
    }
    
    // 8. Check for timeframe selector
    console.log('8. Checking timeframe selector...');
    const timeframes = await page.locator('text=/6M|1Y|3Y|5Y/').count();
    console.log(`   Found ${timeframes} timeframe options`);
    if (timeframes < 4) {
      issues.push('⚠️ Timeframe selector incomplete');
    }
    
    // 9. Check text color contrast
    console.log('9. Checking text colors...');
    const textElements = await page.locator('text=/current|value|forecast/i').all();
    for (const el of textElements.slice(0, 3)) {
      const color = await el.evaluate(e => window.getComputedStyle(e).color);
      console.log(`   Text color: ${color}`);
      if (color.includes('255, 255, 255')) {
        issues.push('❌ White text on light background (invisible)');
        break;
      }
    }
    
    // 10. Check for content sections
    console.log('10. Checking content sections...');
    const sections = await page.locator('text=/current value|forecast|projection|insights|depreciation/i').count();
    console.log(`   Found ${sections} content sections`);
    
    console.log('\n' + '─'.repeat(80));
    console.log('📋 FORECAST PAGE ISSUES FOUND:');
    console.log('─'.repeat(80));
    if (issues.length === 0) {
      console.log('✅ No issues found!');
    } else {
      issues.forEach(issue => console.log(issue));
    }
    console.log('─'.repeat(80) + '\n');
  });
  
  test('Audit Estimate Page', async ({ page }) => {
    console.log('\n' + '='.repeat(80));
    console.log('💰 AUDITING ESTIMATE PAGE');
    console.log('='.repeat(80) + '\n');
    
    await page.goto('http://localhost:8081/estimate');
    await page.waitForTimeout(2000);
    
    const issues = [];
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/estimate-page.png', fullPage: true });
    
    // 1. Check for back button
    console.log('1. Checking back button...');
    const backButton = await page.locator('button, [role="button"]').filter({ hasText: /back/i }).count();
    const backIcon = await page.locator('svg').first().isVisible();
    if (!backIcon && backButton === 0) {
      issues.push('❌ No visible back button found');
      console.log('   ❌ No visible back button');
    } else {
      console.log('   ✅ Back button present');
    }
    
    // 2. Check for page title
    console.log('2. Checking page title...');
    const pageTitle = await page.locator('text=/estimate|what.*worth/i').first().isVisible().catch(() => false);
    if (!pageTitle) {
      issues.push('❌ No page title found');
      console.log('   ❌ No page title visible');
    } else {
      console.log('   ✅ Page title found');
    }
    
    // 3. Check background color
    console.log('3. Checking background color...');
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`   Background color: ${bgColor}`);
    if (bgColor.includes('0, 0, 0') || bgColor === 'rgb(0, 0, 0)') {
      issues.push('❌ Background is black (should be light grey #F2F4F6)');
      console.log('   ❌ Background is BLACK');
    }
    
    // 4. Check for input fields
    console.log('4. Checking input fields...');
    const inputs = await page.locator('input').count();
    console.log(`   Found ${inputs} input fields`);
    if (inputs < 4) {
      issues.push('⚠️ Missing input fields (should have 4: year, make, model, mileage)');
    }
    
    // 5. Check input field visibility
    console.log('5. Checking input field colors...');
    const firstInput = await page.locator('input').first();
    if (await firstInput.isVisible()) {
      const inputBg = await firstInput.evaluate(el => {
        const parent = el.parentElement;
        return window.getComputedStyle(parent).backgroundColor;
      });
      console.log(`   Input background: ${inputBg}`);
      if (inputBg.includes('0, 0, 0') || inputBg === 'rgba(0, 0, 0, 0)') {
        issues.push('❌ Input fields have dark/transparent background');
      }
    }
    
    // 6. Check for submit button
    console.log('6. Checking submit button...');
    const submitButton = await page.locator('text=/get estimate|calculate|submit/i').count();
    console.log(`   Found ${submitButton} submit buttons`);
    if (submitButton === 0) {
      issues.push('⚠️ No submit button found');
    }
    
    // 7. Check for example estimates
    console.log('7. Checking example estimates...');
    const examples = await page.locator('text=/recent|example|tesla|bmw/i').count();
    console.log(`   Found ${examples} example-related elements`);
    
    // 8. Check padding
    console.log('8. Checking padding...');
    const mainContent = await page.locator('body > div').first();
    const padding = await mainContent.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        left: parseInt(style.paddingLeft),
        right: parseInt(style.paddingRight),
      };
    });
    console.log(`   Padding: ${padding.left}px / ${padding.right}px`);
    if (padding.left < 16 || padding.right < 16) {
      issues.push('⚠️ Insufficient horizontal padding');
    }
    
    // 9. Check text color contrast
    console.log('9. Checking text colors...');
    const textElements = await page.locator('text=/year|make|model|mileage/i').all();
    for (const el of textElements.slice(0, 3)) {
      const color = await el.evaluate(e => window.getComputedStyle(e).color);
      console.log(`   Text color: ${color}`);
      if (color.includes('255, 255, 255')) {
        issues.push('❌ White text on light background (invisible)');
        break;
      }
    }
    
    // 10. Check placeholder visibility
    console.log('10. Checking placeholder text...');
    const placeholders = await page.locator('input').all();
    for (const input of placeholders.slice(0, 2)) {
      const placeholder = await input.getAttribute('placeholder');
      console.log(`   Placeholder: ${placeholder}`);
    }
    
    console.log('\n' + '─'.repeat(80));
    console.log('📋 ESTIMATE PAGE ISSUES FOUND:');
    console.log('─'.repeat(80));
    if (issues.length === 0) {
      console.log('✅ No issues found!');
    } else {
      issues.forEach(issue => console.log(issue));
    }
    console.log('─'.repeat(80) + '\n');
  });
  
  test('Compare with working pages', async ({ page }) => {
    console.log('\n' + '='.repeat(80));
    console.log('🔄 COMPARING WITH WORKING PAGES');
    console.log('='.repeat(80) + '\n');
    
    // Check Settings page (known to be working)
    console.log('Checking Settings page (reference)...');
    await page.goto('http://localhost:8081/settings');
    await page.waitForTimeout(1000);
    
    const settingsBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    const settingsTitle = await page.locator('text=/settings/i').first().isVisible();
    const settingsBack = await page.locator('svg').first().isVisible();
    
    console.log(`Settings background: ${settingsBg}`);
    console.log(`Settings has title: ${settingsTitle}`);
    console.log(`Settings has back button: ${settingsBack}`);
    
    // Check Forecast page
    console.log('\nChecking Forecast page...');
    await page.goto('http://localhost:8081/forecast');
    await page.waitForTimeout(1000);
    
    const forecastBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    const forecastTitle = await page.locator('text=/forecast|value forecast/i').first().isVisible().catch(() => false);
    const forecastBack = await page.locator('svg').first().isVisible();
    
    console.log(`Forecast background: ${forecastBg}`);
    console.log(`Forecast has title: ${forecastTitle}`);
    console.log(`Forecast has back button: ${forecastBack}`);
    
    console.log('\n' + '─'.repeat(80));
    console.log('COMPARISON RESULTS:');
    console.log('─'.repeat(80));
    
    if (settingsBg !== forecastBg) {
      console.log('❌ Background colors DO NOT MATCH');
      console.log(`   Settings: ${settingsBg}`);
      console.log(`   Forecast: ${forecastBg}`);
    } else {
      console.log('✅ Background colors match');
    }
    
    if (settingsTitle && !forecastTitle) {
      console.log('❌ Forecast missing title (Settings has one)');
    } else if (forecastTitle) {
      console.log('✅ Both pages have titles');
    }
    
    console.log('─'.repeat(80) + '\n');
  });
});
