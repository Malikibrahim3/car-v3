const { chromium } = require('playwright');
const path = require('path');

async function captureGarageScreenshot() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to Expo app...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for initial load
  await page.waitForTimeout(3000);
  
  console.log('Current URL:', page.url());
  
  // Log what's on the page
  const bodyText = await page.locator('body').textContent();
  console.log('Page content preview:', bodyText.substring(0, 200));
  
  // Try different navigation approaches
  console.log('Attempting to navigate to garage...');
  
  // Try direct URL navigation
  const possibleUrls = [
    'http://localhost:8081/garage',
    'http://localhost:8081/(tabs)/garage',
    'http://localhost:8081/tabs/garage',
  ];
  
  for (const url of possibleUrls) {
    try {
      console.log(`Trying URL: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(2000);
      
      const content = await page.locator('body').textContent();
      if (content.includes('Garage') || content.includes('Portfolio') || content.includes('Vehicle')) {
        console.log('Found garage content!');
        break;
      }
    } catch (e) {
      console.log(`Failed to load ${url}`);
    }
  }
  
  // Look for tab bar and click garage
  const tabSelectors = [
    '[role="tab"]:has-text("Garage")',
    'button:has-text("Garage")',
    'a:has-text("Garage")',
    '[aria-label="Garage"]',
    'text=Garage',
  ];
  
  for (const selector of tabSelectors) {
    try {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 })) {
        console.log(`Clicking garage tab: ${selector}`);
        await element.click();
        await page.waitForTimeout(2000);
        break;
      }
    } catch (e) {
      // Continue
    }
  }
  
  // Take screenshot
  console.log('Taking screenshot...');
  await page.screenshot({
    path: path.join(__dirname, '../landing/public/app-screenshot.png'),
    fullPage: false,
  });
  
  console.log('Screenshot saved!');
  console.log('\nPlease check if the screenshot shows the garage screen.');
  console.log('If not, manually navigate to the garage screen in the browser window,');
  console.log('then press Enter here to take another screenshot...');
  
  // Keep browser open for manual navigation if needed
  await page.waitForTimeout(10000);
  
  // Take final screenshot
  await page.screenshot({
    path: path.join(__dirname, '../landing/public/app-screenshot.png'),
    fullPage: false,
  });
  
  console.log('Final screenshot saved!');
  
  await browser.close();
}

captureGarageScreenshot().catch(console.error);
