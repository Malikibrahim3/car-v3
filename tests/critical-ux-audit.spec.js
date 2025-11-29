/**
 * CRITICAL USER EXPERIENCE AUDIT
 * Deep inspection from user perspective
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8081';
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.describe('🔍 CRITICAL UX AUDIT - USER PERSPECTIVE', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.setItem('testMode', 'true'));
    await page.waitForTimeout(2000);
  });

  // SECTION 1: VISUAL CONSISTENCY
  test('SECTION 1: Visual Consistency Audit', async ({ page }) => {
    console.log('\n' + '='.repeat(70));
    console.log('SECTION 1: VISUAL CONSISTENCY & DESIGN QUALITY');
    console.log('='.repeat(70));
    
    const issues = [];
    const pages = ['dashboard', 'garage', 'tools', 'activity', 'profile'];
    
    for (const pageName of pages) {
      console.log(`\n📱 Inspecting: ${pageName.toUpperCase()}`);
      
      const tab = page.locator(`[href*="${pageName}"]`).first();
      if (await tab.count() > 0) {
        await tab.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot
        await page.screenshot({ 
          path: `tests/screenshots/${pageName}-audit.png`,
          fullPage: true 
        });
        
        // Check background
        const bg = await page.evaluate(() => {
          return window.getComputedStyle(document.body).backgroundColor;
        });
        console.log(`  Background: ${bg}`);
        
        // Check for glass cards
        const glassCards = await page.locator('[class*="glass"], [style*="blur"]').count();
        console.log(`  Glass cards: ${glassCards}`);
        if (glassCards === 0) {
          issues.push(`${pageName}: No glassmorphism detected`);
        }
        
        // Check heading
        const heading = page.locator('h1, [style*="fontSize: 32"], [style*="fontSize: 42"]').first();
        if (await heading.count() > 0) {
          const headingSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
          const headingWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);
          console.log(`  Heading: ${headingSize} / ${headingWeight}`);
        } else {
          issues.push(`${pageName}: No clear heading found`);
        }
        
        // Check spacing
        const container = page.locator('[class*="container"], [class*="scroll"]').first();
        if (await container.count() > 0) {
          const padding = await container.evaluate(el => window.getComputedStyle(el).padding);
          console.log(`  Padding: ${padding}`);
        }
      }
    }
    
    console.log('\n📊 VISUAL ISSUES FOUND:', issues.length);
    issues.forEach(issue => console.log(`  ❌ ${issue}`));
  });

  // SECTION 2: INFORMATION CLARITY
  test('SECTION 2: Information Clarity Audit', async ({ page }) => {
    console.log('\n' + '='.repeat(70));
    console.log('SECTION 2: INFORMATION CLARITY & CONTENT');
    console.log('='.repeat(70));
    
    const issues = [];

    
    // Dashboard clarity
    console.log('\n📱 DASHBOARD CLARITY');
    const dashTab = page.locator('[href*="dashboard"]').first();
    await dashTab.click();
    await page.waitForTimeout(1000);
    
    // Check for portfolio value
    const portfolioValue = page.getByText(/\$\d+,?\d*/);
    if (await portfolioValue.count() === 0) {
      issues.push('Dashboard: No portfolio value shown');
    } else {
      console.log('  ✓ Portfolio value present');
    }
    
    // Check for context labels
    const labels = await page.locator('text=/total|portfolio|equity|value/i').count();
    console.log(`  Labels found: ${labels}`);
    if (labels < 2) {
      issues.push('Dashboard: Insufficient context labels');
    }
    
    // Check for data visualization
    const hasChart = await page.locator('svg, canvas, [class*="chart"]').count() > 0;
    console.log(`  Chart present: ${hasChart}`);
    if (!hasChart) {
      issues.push('Dashboard: No data visualization');
    }
    
    // Garage clarity
    console.log('\n📱 GARAGE CLARITY');
    const garageTab = page.locator('[href*="garage"]').first();
    await garageTab.click();
    await page.waitForTimeout(1000);
    
    const garageHeading = await page.getByText(/garage|vehicles/i).count();
    console.log(`  Heading clarity: ${garageHeading > 0 ? 'Good' : 'Poor'}`);
    
    const emptyState = await page.getByText(/no vehicles|add.*vehicle/i).count();
    const vehicleCards = await page.locator('[testid*="vehicle"]').count();
    console.log(`  Empty state: ${emptyState > 0}`);
    console.log(`  Vehicle cards: ${vehicleCards}`);
    
    if (emptyState === 0 && vehicleCards === 0) {
      issues.push('Garage: No content or empty state');
    }
    
    console.log('\n📊 CLARITY ISSUES FOUND:', issues.length);
    issues.forEach(issue => console.log(`  ❌ ${issue}`));
  });

  // SECTION 3: FUNCTIONALITY & USABILITY
  test('SECTION 3: Functionality & Usability Audit', async ({ page }) => {
    console.log('\n' + '='.repeat(70));
    console.log('SECTION 3: FUNCTIONALITY & USABILITY');
    console.log('='.repeat(70));
    
    const issues = [];
    
    // Test dashboard interactions
    console.log('\n📱 DASHBOARD INTERACTIONS');
    const dashTab = page.locator('[href*="dashboard"]').first();
    await dashTab.click();
    await page.waitForTimeout(1000);
    
    const clickableElements = await page.locator('[role="button"], button, [onclick]').count();
    console.log(`  Clickable elements: ${clickableElements}`);
    if (clickableElements < 3) {
      issues.push('Dashboard: Too few interactive elements');
    }
    
    // Test garage functionality
    console.log('\n📱 GARAGE FUNCTIONALITY');
    const garageTab = page.locator('[href*="garage"]').first();
    await garageTab.click();
    await page.waitForTimeout(1000);
    
    const addButton = page.getByTestId('add-vehicle-button');
    if (await addButton.count() === 0) {
      issues.push('Garage: Add button not found');
    } else {
      console.log('  ✓ Add button present');
      
      // Try to open modal
      await addButton.click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('[role="dialog"], [class*="modal"]');
      if (await modal.count() === 0) {
        issues.push('Garage: Modal does not open');
      } else {
        console.log('  ✓ Modal opens');
        
        // Check form fields
        const inputs = await page.locator('input, [role="textbox"]').count();
        console.log(`  Form inputs: ${inputs}`);
        if (inputs < 3) {
          issues.push('Garage: Insufficient form fields');
        }
      }
    }
    
    // Test tools navigation
    console.log('\n📱 TOOLS NAVIGATION');
    const toolsTab = page.locator('[href*="tools"]').first();
    await toolsTab.click();
    await page.waitForTimeout(1000);
    
    const toolCards = await page.locator('[class*="card"]').count();
    console.log(`  Tool cards: ${toolCards}`);
    if (toolCards < 2) {
      issues.push('Tools: Missing tool cards');
    }
    
    console.log('\n📊 FUNCTIONALITY ISSUES FOUND:', issues.length);
    issues.forEach(issue => console.log(`  ❌ ${issue}`));
  });

  // SECTION 4: USER FLOW & NAVIGATION
  test('SECTION 4: User Flow & Navigation Audit', async ({ page }) => {
    console.log('\n' + '='.repeat(70));
    console.log('SECTION 4: USER FLOW & NAVIGATION');
    console.log('='.repeat(70));
    
    const issues = [];
    
    // Test tab navigation
    console.log('\n📱 TAB NAVIGATION FLOW');
    const tabs = ['dashboard', 'garage', 'tools', 'activity', 'profile'];
    let successfulNavigations = 0;
    
    for (const tabName of tabs) {
      const tab = page.locator(`[href*="${tabName}"]`).first();
      if (await tab.count() > 0) {
        await tab.click();
        await page.waitForTimeout(500);
        
        // Check if content changed
        const content = await page.locator('body').textContent();
        if (content && content.length > 100) {
          successfulNavigations++;
          console.log(`  ✓ ${tabName} navigation works`);
        } else {
          issues.push(`${tabName}: Navigation appears broken`);
        }
      } else {
        issues.push(`${tabName}: Tab not found`);
      }
    }
    
    console.log(`  Success rate: ${successfulNavigations}/${tabs.length}`);
    
    // Test deep navigation
    console.log('\n📱 DEEP NAVIGATION (Tools → Estimator)');
    const toolsTab = page.locator('[href*="tools"]').first();
    await toolsTab.click();
    await page.waitForTimeout(1000);
    
    const estimatorCard = page.getByText(/estimator/i).first();
    if (await estimatorCard.count() > 0) {
      await estimatorCard.click();
      await page.waitForTimeout(1000);
      
      const estimatorContent = await page.getByText(/estimate|value|vin/i).count();
      if (estimatorContent > 0) {
        console.log('  ✓ Estimator page loads');
      } else {
        issues.push('Estimator: Page content missing');
      }
    } else {
      issues.push('Tools: Estimator card not clickable');
    }
    
    // Test back navigation
    console.log('\n📱 BACK NAVIGATION');
    const backButton = page.locator('[aria-label*="back"], [class*="back"]').first();
    if (await backButton.count() > 0) {
      console.log('  ✓ Back button present');
    } else {
      issues.push('Navigation: No back button on sub-pages');
    }
    
    console.log('\n📊 NAVIGATION ISSUES FOUND:', issues.length);
    issues.forEach(issue => console.log(`  ❌ ${issue}`));
  });
});

// FINAL REPORT
test('📋 GENERATE COMPREHENSIVE CRITIQUE', async ({ page }) => {
  console.log('\n' + '='.repeat(70));
  console.log('📋 COMPREHENSIVE USER EXPERIENCE CRITIQUE');
  console.log('='.repeat(70));
  console.log('\nReview the 4 sections above for detailed findings.');
  console.log('\nScreenshots saved to: tests/screenshots/');
  console.log('='.repeat(70));
});
