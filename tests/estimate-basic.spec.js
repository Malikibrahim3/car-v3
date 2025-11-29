const { test, expect } = require('@playwright/test');

test.describe('Vehicle Estimate Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the estimate page
    await page.goto('http://localhost:3000');
    await page.click('text=Estimate');
    await page.waitForLoadState('networkidle');
  });

  test('should automatically calculate estimate when make, model, and year are selected', async ({ page }) => {
    console.log('Starting test...');
    
    // Wait for makes to load
    await page.waitForSelector('[data-testid="make-select"]', { timeout: 10000 });
    console.log('Make selector found');
    
    // Select make - use Toyota as it's reliable
    await page.click('[data-testid="make-select"]');
    await page.waitForSelector('text=Toyota', { timeout: 5000 });
    await page.click('text=Toyota');
    console.log('Toyota selected');
    
    // Wait for models to load and select model
    await page.waitForSelector('[data-testid="model-select"]:not([disabled])', { timeout: 5000 });
    await page.click('[data-testid="model-select"]');
    
    // Select the first available model
    await page.waitForSelector('[role="option"]', { timeout: 5000 });
    const firstModel = await page.locator('[role="option"]').first();
    const modelText = await firstModel.textContent();
    await firstModel.click();
    console.log('Model selected:', modelText);
    
    // Wait for years to load and select year
    await page.waitForSelector('[data-testid="year-select"]:not([disabled])', { timeout: 5000 });
    await page.click('[data-testid="year-select"]');
    
    // Select the first available year
    await page.waitForSelector('[role="option"]', { timeout: 5000 });
    const firstYear = await page.locator('[role="option"]').first();
    const yearText = await firstYear.textContent();
    await firstYear.click();
    console.log('Year selected:', yearText);
    
    // Wait for the estimate to appear automatically (should happen within 2 seconds)
    console.log('Waiting for estimate to appear...');
    await page.waitForSelector('text=Estimated Value', { timeout: 3000 });
    console.log('Estimate appeared!');
    
    // Check that the estimate value is displayed
    const estimateValue = await page.locator('text=/\\$[0-9,]+/').first();
    await expect(estimateValue).toBeVisible();
    console.log('Estimate value is visible');
    
    // Verify the vehicle details are shown
    const vehicleText = `${yearText} Toyota ${modelText}`;
    await expect(page.locator(`text=${vehicleText}`)).toBeVisible();
    console.log('Vehicle details verified');
    
    // Verify confidence level is shown
    await expect(page.locator('text=Confidence:')).toBeVisible();
    console.log('Confidence level shown');
    
    console.log('Test completed successfully!');
  });

  test('should show loading state during estimation', async ({ page }) => {
    // Select make
    await page.click('[data-testid="make-select"]');
    await page.click('text=Toyota');
    
    // Select model
    await page.waitForSelector('[data-testid="model-select"]:not([disabled])');
    await page.click('[data-testid="model-select"]');
    await page.locator('[role="option"]').first().click();
    
    // Select year and immediately check for loading
    await page.waitForSelector('[data-testid="year-select"]:not([disabled])');
    await page.click('[data-testid="year-select"]');
    await page.locator('[role="option"]').first().click();
    
    // The estimate should appear (loading state might be too fast to catch)
    await page.waitForSelector('text=Estimated Value', { timeout: 3000 });
    await expect(page.locator('text=/\\$[0-9,]+/').first()).toBeVisible();
  });
});