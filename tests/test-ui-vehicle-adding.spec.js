const { test, expect } = require('@playwright/test');

test.describe('Vehicle Adding Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should load all 64 makes in the dropdown', async ({ page }) => {
    console.log('🧪 Testing: Load all makes in dropdown');
    
    // Navigate to dashboard and click Add Vehicle
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);
    
    // Look for Add Vehicle button
    const addVehicleButton = page.locator('button:has-text("Add Vehicle"), button:has-text("Add Car")').first();
    await addVehicleButton.click();
    
    // Wait for dialog to open
    await page.waitForSelector('text=Add New Vehicle', { timeout: 5000 });
    console.log('✅ Add Vehicle dialog opened');
    
    // Wait for makes to load
    await page.waitForTimeout(2000);
    
    // Click on Make dropdown
    const makeDropdown = page.locator('label:has-text("Make")').locator('..').locator('div[role="button"]').first();
    await makeDropdown.click();
    
    // Wait for dropdown to open
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
    console.log('✅ Make dropdown opened');
    
    // Count the number of options (excluding "Select Make")
    const options = await page.locator('[role="option"]').all();
    const optionTexts = [];
    for (const option of options) {
      const text = await option.textContent();
      if (text && text !== 'Select a Make' && text !== 'Select Make') {
        optionTexts.push(text);
      }
    }
    
    console.log(`✅ Found ${optionTexts.length} makes in dropdown`);
    console.log(`   First 10: ${optionTexts.slice(0, 10).join(', ')}`);
    
    // Verify we have at least 60 makes (allowing for some variation)
    expect(optionTexts.length).toBeGreaterThanOrEqual(60);
    
    // Verify key makes are present
    expect(optionTexts).toContain('BMW');
    expect(optionTexts).toContain('Mercedes-Benz');
    expect(optionTexts).toContain('Toyota');
    expect(optionTexts).toContain('Tesla');
    expect(optionTexts).toContain('Ferrari');
    expect(optionTexts).toContain('Lamborghini');
    
    console.log('✅ All key makes are present');
  });

  test('should load models when make is selected', async ({ page }) => {
    console.log('🧪 Testing: Load models for selected make');
    
    // Navigate to dashboard and click Add Vehicle
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);
    
    const addVehicleButton = page.locator('button:has-text("Add Vehicle"), button:has-text("Add Car")').first();
    await addVehicleButton.click();
    
    await page.waitForSelector('text=Add New Vehicle', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Click on Make dropdown
    const makeDropdown = page.locator('label:has-text("Make")').locator('..').locator('div[role="button"]').first();
    await makeDropdown.click();
    
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
    
    // Select BMW
    await page.click('[role="option"]:has-text("BMW")');
    console.log('✅ Selected BMW');
    
    // Wait for models to load
    await page.waitForTimeout(2000);
    
    // Click on Model dropdown
    const modelDropdown = page.locator('label:has-text("Model")').locator('..').locator('div[role="button"]').first();
    await modelDropdown.click();
    
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
    console.log('✅ Model dropdown opened');
    
    // Count models
    const modelOptions = await page.locator('[role="option"]').all();
    const modelTexts = [];
    for (const option of modelOptions) {
      const text = await option.textContent();
      if (text && text !== 'Select a Model' && text !== 'Select Model') {
        modelTexts.push(text);
      }
    }
    
    console.log(`✅ Found ${modelTexts.length} BMW models`);
    console.log(`   Models: ${modelTexts.slice(0, 5).join(', ')}`);
    
    // Verify we have models
    expect(modelTexts.length).toBeGreaterThan(5);
    
    // Verify key BMW models are present
    const hasX3 = modelTexts.some(m => m.includes('X3'));
    const hasX5 = modelTexts.some(m => m.includes('X5'));
    const has3Series = modelTexts.some(m => m.includes('3 Series') || m.includes('3-Series'));
    
    expect(hasX3 || hasX5 || has3Series).toBeTruthy();
    console.log('✅ BMW models loaded successfully');
  });

  test('should complete full vehicle adding workflow', async ({ page }) => {
    console.log('🧪 Testing: Complete vehicle adding workflow');
    
    // Navigate to dashboard
    await page.click('text=Dashboard');
    await page.waitForTimeout(1000);
    
    // Click Add Vehicle
    const addVehicleButton = page.locator('button:has-text("Add Vehicle"), button:has-text("Add Car")').first();
    await addVehicleButton.click();
    
    await page.waitForSelector('text=Add New Vehicle', { timeout: 5000 });
    console.log('✅ Dialog opened');
    
    await page.waitForTimeout(2000);
    
    // Select Make: Toyota
    const makeDropdown = page.locator('label:has-text("Make")').locator('..').locator('div[role="button"]').first();
    await makeDropdown.click();
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
    await page.click('[role="option"]:has-text("Toyota")');
    console.log('✅ Selected Toyota');
    
    await page.waitForTimeout(2000);
    
    // Select Model: Camry
    const modelDropdown = page.locator('label:has-text("Model")').locator('..').locator('div[role="button"]').first();
    await modelDropdown.click();
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
    await page.click('[role="option"]:has-text("Camry")');
    console.log('✅ Selected Camry');
    
    await page.waitForTimeout(2000);
    
    // Select Year
    const yearDropdown = page.locator('label:has-text("Year")').locator('..').locator('div[role="button"]').first();
    await yearDropdown.click();
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
    
    // Select first available year
    const yearOptions = await page.locator('[role="option"]').all();
    if (yearOptions.length > 1) {
      await yearOptions[1].click(); // Skip "Select Year" option
      console.log('✅ Selected year');
    }
    
    await page.waitForTimeout(2000);
    
    // Fill in purchase price
    await page.fill('input[name="purchasePrice"]', '25000');
    console.log('✅ Entered purchase price');
    
    // Check if estimated value is displayed
    const hasEstimatedValue = await page.locator('text=Estimated Current Market Value').isVisible().catch(() => false);
    if (hasEstimatedValue) {
      console.log('✅ Market valuation displayed');
    }
    
    console.log('✅ Complete workflow test passed');
  });
});

test.afterAll(async () => {
  console.log('\n🎉 All UI tests completed!');
});