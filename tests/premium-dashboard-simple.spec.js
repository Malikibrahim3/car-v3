/**
 * Simplified Premium Dashboard UI Test
 * Works with authentication flow
 */

import { test, expect } from '@playwright/test';

const EXPO_WEB_URL = 'http://localhost:8081';

test.describe('Premium Dashboard UI - Simple Test', () => {
  test('Capture Landing Page and Navigate', async ({ page }) => {
    // Go to Expo Web
    await page.goto(EXPO_WEB_URL);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of whatever loads
    await page.screenshot({ 
      path: 'test-results/01-initial-load.png', 
      fullPage: true 
    });
    
    console.log('✅ Initial page screenshot captured');
    
    // Try to find and click any "Get Started" or "Demo" button
    const getStartedButton = page.locator('text=/get started|demo|continue|skip/i').first();
    const buttonExists = await getStartedButton.count() > 0;
    
    if (buttonExists) {
      await getStartedButton.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: 'test-results/02-after-click.png', 
        fullPage: true 
      });
      
      console.log('✅ After button click screenshot captured');
    }
  });

  test('Try Direct Dashboard URL', async ({ page }) => {
    // Try various dashboard URL patterns
    const urls = [
      'http://localhost:8081/(app)/dashboard',
      'http://localhost:8081/app/dashboard',
      'http://localhost:8081/dashboard',
    ];
    
    for (const url of urls) {
      console.log(`Trying URL: ${url}`);
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const urlSafe = url.replace(/[^a-z0-9]/gi, '-');
      await page.screenshot({ 
        path: `test-results/url-test-${urlSafe}.png`, 
        fullPage: true 
      });
    }
    
    console.log('✅ URL test screenshots captured');
  });

  test('Check Page Content', async ({ page }) => {
    await page.goto(EXPO_WEB_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Get page title and content
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Get all text content
    const bodyText = await page.locator('body').textContent();
    console.log(`Page contains: ${bodyText.substring(0, 200)}...`);
    
    // Check for common elements
    const hasButton = await page.locator('button').count();
    const hasText = await page.locator('text=/dashboard|portfolio|vehicle/i').count();
    
    console.log(`Buttons found: ${hasButton}`);
    console.log(`Dashboard-related text found: ${hasText}`);
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/03-content-check.png', 
      fullPage: true 
    });
  });
});

test.describe('Premium Dashboard - If Accessible', () => {
  test('Try to Access Dashboard Elements', async ({ page }) => {
    await page.goto(EXPO_WEB_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Look for dashboard-specific elements
    const dashboardElements = [
      '[data-testid="dashboard-screen"]',
      '[data-testid="hero-gauge-card"]',
      '[data-testid="stats-grid"]',
      'text=/total portfolio/i',
      'text=/quick stats/i',
      'text=/vehicles/i',
    ];
    
    for (const selector of dashboardElements) {
      const element = page.locator(selector);
      const count = await element.count();
      
      if (count > 0) {
        console.log(`✅ Found: ${selector}`);
        
        // Take screenshot if we find dashboard elements
        await page.screenshot({ 
          path: 'test-results/dashboard-found.png', 
          fullPage: true 
        });
        
        // Try to screenshot individual elements
        try {
          await element.first().screenshot({ 
            path: `test-results/element-${selector.replace(/[^a-z0-9]/gi, '-')}.png` 
          });
        } catch (e) {
          console.log(`Could not screenshot ${selector}`);
        }
      } else {
        console.log(`❌ Not found: ${selector}`);
      }
    }
    
    // Final full page screenshot
    await page.screenshot({ 
      path: 'test-results/04-final-state.png', 
      fullPage: true 
    });
  });
});
