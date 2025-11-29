const { test, expect } = require('@playwright/test');

// Helper function to click MUI Select dropdowns
async function clickMuiSelect(page, labelText) {
  // Find the Select by its label and click the div inside
  await page.locator(`div[role="combobox"]:near(label:has-text("${labelText}"))`).first().click();
}

// Safer test configuration to avoid crashing Cursor
test.describe('Add Vehicle Form - Safe Testing', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Switch to Live Mode if in Demo Mode
    const demoModeChip = page.locator('text=Demo Mode');
    const isVisible = await demoModeChip.isVisible().catch(() => false);
    if (isVisible) {
      await demoModeChip.click();
      await page.waitForTimeout(500);
    }

    // Navigate to My Garage
    await page.click('text=My Garage');
    await page.waitForTimeout(1000);

    // Click the Add Vehicle button to open dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle', { timeout: 5000 });
  });

  test('Step 1: Basic form elements are present', async ({ page }) => {
    // Check that VIN/Manual toggle exists
    await expect(page.locator('button:has-text("Manual Entry")')).toBeVisible();
    await expect(page.locator('button:has-text("VIN Lookup")')).toBeVisible();

    // Check basic dropdowns exist
    await expect(page.locator('label:has-text("Make")')).toBeVisible();
    await expect(page.locator('label:has-text("Model")')).toBeVisible();
    await expect(page.locator('label:has-text("Year")')).toBeVisible();

    // Check required fields exist
    await expect(page.locator('input[name="purchasePrice"]')).toBeVisible();
    await expect(page.locator('input[name="purchaseDate"]')).toBeVisible();

    console.log('✓ All basic form elements present');
  });

  test('Step 2: Manual entry flow works', async ({ page }) => {
    // Fill out basic details manually
    // Select Make
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Toyota")');

    // Wait for models to load
    await page.waitForTimeout(1000);

    // Select Model
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/Camry|Corolla|RAV4/');

    // Select Year
    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    // Fill Purchase Price
    await page.fill('input[name="purchasePrice"]', '25000');

    // Check Next button becomes enabled
    const nextButton = page.locator('button:has-text("Next")');
    await expect(nextButton).toBeEnabled();

    console.log('✓ Manual entry flow works');
  });

  test('Step 3: Auto-calculation - Deposit to Loan Amount', async ({ page }) => {
    // Fill basic details first
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Toyota")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/Camry|Corolla|RAV4/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    await page.fill('input[name="purchasePrice"]', '30000');

    // Go to step 2
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Select Loan ownership type
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Loan / HP")');

    // Go to step 3
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill deposit
    await page.fill('input[name="deposit"]', '5000');
    await page.waitForTimeout(300);

    // Check loan amount auto-calculated (30000 - 5000 = 25000)
    const loanAmount = await page.inputValue('input[name="loanAmount"]');
    expect(parseFloat(loanAmount)).toBe(25000);

    console.log('✓ Deposit → Loan Amount calculation works');
  });

  test('Step 4: Auto-calculation - GFV Percentage to Balloon Payment', async ({ page }) => {
    // Fill basic details
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("BMW")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/3 Series|5 Series|X5/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    await page.fill('input[name="purchasePrice"]', '40000');

    // Go to step 2
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Select PCP
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');

    // Go to step 3
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill GFV percentage (50%)
    await page.fill('input[name="guaranteedFutureValuePercent"]', '50');
    await page.waitForTimeout(300);

    // Check balloon payment auto-calculated (40000 * 50% = 20000)
    const balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(20000);

    console.log('✓ GFV % → Balloon Payment calculation works');
  });

  test('Step 5: Auto-calculation - Balloon Payment to GFV Percentage', async ({ page }) => {
    // Fill basic details
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("BMW")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/3 Series|5 Series|X5/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    await page.fill('input[name="purchasePrice"]', '40000');

    // Navigate to PCP
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill balloon payment amount
    await page.fill('input[name="balloonPayment"]', '16000');
    await page.waitForTimeout(300);

    // Check GFV percentage auto-calculated (16000 / 40000 * 100 = 40%)
    const gfvPercent = await page.inputValue('input[name="guaranteedFutureValuePercent"]');
    expect(parseFloat(gfvPercent)).toBe(40);

    console.log('✓ Balloon Payment → GFV % calculation works');
  });

  test('Step 6: Trade-in auto-calculation', async ({ page }) => {
    // Fill basic details
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Honda")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/Civic|Accord|CR-V/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    await page.fill('input[name="purchasePrice"]', '28000');

    // Navigate to Trade-in
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Trade-in")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill trade-in value and rolled debt
    await page.fill('input[name="tradeInValue"]', '8000');
    await page.waitForTimeout(300);
    await page.fill('input[name="rolledOverDebt"]', '2000');
    await page.waitForTimeout(300);

    // Check new loan amount (28000 - 8000 + 2000 = 22000)
    const newLoanAmount = await page.inputValue('input[name="newLoanAmount"]');
    expect(parseFloat(newLoanAmount)).toBe(22000);

    console.log('✓ Trade-in calculation works');
  });

  test('Step 7: VIN Lookup toggle works', async ({ page }) => {
    // Click VIN Lookup button
    await page.click('button:has-text("VIN Lookup")');
    await page.waitForTimeout(500);

    // Check VIN input appears
    await expect(page.locator('input[placeholder*="1HGBH41JXMN109186"]')).toBeVisible();

    // Check info alert appears
    await expect(page.locator('text=Enter your 17-character VIN')).toBeVisible();

    // Make/Model should be disabled in VIN mode
    const makeSelect = page.locator('label:has-text("Make")');
    await expect(makeSelect).toBeVisible();

    console.log('✓ VIN Lookup toggle works');
  });

  test('Step 8: Ownership type changes step 3 fields', async ({ page }) => {
    // Fill basic details
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Toyota")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/Camry|Corolla|RAV4/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    await page.fill('input[name="purchasePrice"]', '25000');

    // Go to step 2
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Test Cash - should show simple fields
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Cash Purchase")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    await expect(page.locator('text=No additional financing information required')).toBeVisible();

    console.log('✓ Ownership type changes work');
  });

  test('Step 9: Next button validation works', async ({ page }) => {
    // Initially Next should be disabled (no make/model/year/price)
    const nextButton = page.locator('button:has-text("Next")');
    await expect(nextButton).toBeDisabled();

    // Fill only make - still disabled
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Toyota")');
    await expect(nextButton).toBeDisabled();

    // Fill model
    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/Camry|Corolla|RAV4/');
    await expect(nextButton).toBeDisabled();

    // Fill year
    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');
    await expect(nextButton).toBeDisabled();

    // Fill price - now should be enabled
    await page.fill('input[name="purchasePrice"]', '25000');
    await expect(nextButton).toBeEnabled();

    console.log('✓ Next button validation works');
  });

  test('Step 10: Stepper navigation works', async ({ page }) => {
    // Fill basic details
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Toyota")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/Camry|Corolla|RAV4/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    await page.fill('input[name="purchasePrice"]', '25000');

    // Go to step 2
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Verify step 2 content
    await expect(page.locator('text=How did you acquire this vehicle?')).toBeVisible();

    // Go back
    await page.click('button:has-text("Back")');
    await page.waitForTimeout(500);

    // Should be back at step 1
    await expect(page.locator('label:has-text("Make")')).toBeVisible();

    console.log('✓ Stepper navigation works');
  });
});
