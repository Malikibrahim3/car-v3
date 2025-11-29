const { chromium } = require('playwright');
const path = require('path');

async function captureRealScreenshot() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro dimensions
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to Expo app...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  
  // Wait for the app to load
  await page.waitForTimeout(3000);
  
  console.log('Looking for garage navigation...');
  // Try to find and click on garage tab/link
  // This might be in a tab bar at the bottom
  const garageSelectors = [
    'text=Garage',
    '[aria-label*="Garage"]',
    '[href*="garage"]',
    'button:has-text("Garage")',
    'a:has-text("Garage")'
  ];
  
  let navigated = false;
  for (const selector of garageSelectors) {
    try {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        console.log(`Found garage element with selector: ${selector}`);
        await element.click();
        await page.waitForTimeout(2000);
        navigated = true;
        break;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  if (!navigated) {
    console.log('Could not find garage navigation, checking current page...');
  }
  
  // Take screenshot
  console.log('Taking screenshot...');
  await page.screenshot({
    path: path.join(__dirname, '../landing/public/app-screenshot.png'),
    fullPage: false,
  });
  
  console.log('Screenshot saved to landing/public/app-screenshot.png');
  
  await browser.close();
}

captureRealScreenshot().catch(console.error);
