const { test, expect } = require('@playwright/test');

// Helper function to click MUI Select dropdowns
async function clickMuiSelect(page, labelText) {
  await page.locator(`div[role="combobox"]:near(label:has-text("${labelText}"))`).first().click();
}

test.describe('Balloon Payment Auto-Estimation Feature', () => {

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

  test('Test 1: Balloon estimation for Standard vehicle (Toyota)', async ({ page }) => {
    // Fill basic details for a Standard vehicle
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

    // Purchase price: £30,000
    await page.fill('input[name="purchasePrice"]', '30000');

    // Navigate to PCP
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill deposit and term
    await page.fill('input[name="deposit"]', '5000');
    await page.waitForTimeout(300);

    await page.fill('input[name="termMonths"]', '36');
    await page.waitForTimeout(500); // Wait for auto-calculation

    // Check balloon payment auto-calculated
    // Standard vehicle, 36 months = 55% residual value
    // 30000 * 0.55 = 16500
    const balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(16500);

    // Check GFV percentage is also updated (55%)
    const gfvPercent = await page.inputValue('input[name="guaranteedFutureValuePercent"]');
    expect(parseFloat(gfvPercent)).toBe(55);

    // Check helper text shows estimation range
    const helperText = await page.locator('text=/Range: £15,675/').textContent();
    expect(helperText).toContain('Standard');
    expect(helperText).toContain('£15,675');

    console.log('✓ Standard vehicle balloon estimation works (Toyota)');
  });

  test('Test 2: Balloon estimation for Luxury vehicle (BMW)', async ({ page }) => {
    // Fill basic details for a Luxury vehicle
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

    // Purchase price: £40,000
    await page.fill('input[name="purchasePrice"]', '40000');

    // Navigate to PCP
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill term
    await page.fill('input[name="termMonths"]', '36');
    await page.waitForTimeout(500); // Wait for auto-calculation

    // Check balloon payment auto-calculated
    // Luxury vehicle, 36 months = 58% residual value
    // 40000 * 0.58 = 23200
    const balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(23200);

    // Check GFV percentage is also updated (58%)
    const gfvPercent = await page.inputValue('input[name="guaranteedFutureValuePercent"]');
    expect(parseFloat(gfvPercent)).toBe(58);

    // Check helper text shows Luxury category
    const helperText = await page.locator('text=/Luxury/').textContent();
    expect(helperText).toContain('Luxury');

    console.log('✓ Luxury vehicle balloon estimation works (BMW)');
  });

  test('Test 3: Balloon estimation for Sports/Exotic vehicle (Porsche)', async ({ page }) => {
    // Fill basic details for a Sports/Exotic vehicle
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Porsche")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/911|Cayenne|Macan/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    // Purchase price: £50,000
    await page.fill('input[name="purchasePrice"]', '50000');

    // Navigate to PCP
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill term
    await page.fill('input[name="termMonths"]', '36');
    await page.waitForTimeout(500); // Wait for auto-calculation

    // Check balloon payment auto-calculated
    // Sports/Exotic vehicle, 36 months = 70% residual value
    // 50000 * 0.70 = 35000
    const balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(35000);

    // Check GFV percentage is also updated (70%)
    const gfvPercent = await page.inputValue('input[name="guaranteedFutureValuePercent"]');
    expect(parseFloat(gfvPercent)).toBe(70);

    // Check helper text shows Sports/Exotic category
    const helperText = await page.locator('text=/Sports\\/Exotic/').textContent();
    expect(helperText).toContain('Sports/Exotic');

    console.log('✓ Sports/Exotic vehicle balloon estimation works (Porsche)');
  });

  test('Test 4: Balloon estimation for Electric vehicle (Tesla)', async ({ page }) => {
    // Fill basic details for an Electric vehicle
    await clickMuiSelect(page, 'Make');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Tesla")');

    await page.waitForTimeout(1000);
    await clickMuiSelect(page, 'Model');
    await page.waitForTimeout(500);
    await page.click('li >> text=/Model 3|Model S|Model Y/');

    await clickMuiSelect(page, 'Year');
    await page.waitForTimeout(500);
    await page.click('li:has-text("2023")');

    // Purchase price: £45,000
    await page.fill('input[name="purchasePrice"]', '45000');

    // Navigate to PCP
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill term
    await page.fill('input[name="termMonths"]', '36');
    await page.waitForTimeout(500); // Wait for auto-calculation

    // Check balloon payment auto-calculated
    // Electric vehicle, 36 months = 55% residual value
    // 45000 * 0.55 = 24750
    const balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(24750);

    // Check GFV percentage is also updated (55%)
    const gfvPercent = await page.inputValue('input[name="guaranteedFutureValuePercent"]');
    expect(parseFloat(gfvPercent)).toBe(55);

    // Check helper text shows Electric category
    const helperText = await page.locator('text=/Electric/').textContent();
    expect(helperText).toContain('Electric');

    console.log('✓ Electric vehicle balloon estimation works (Tesla)');
  });

  test('Test 5: User manual override disables auto-estimation', async ({ page }) => {
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

    await page.fill('input[name="purchasePrice"]', '30000');

    // Navigate to PCP
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill term - should auto-populate balloon
    await page.fill('input[name="termMonths"]', '36');
    await page.waitForTimeout(500);

    // Verify auto-calculated value
    let balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(16500); // 30000 * 55%

    // User manually overrides balloon payment
    await page.fill('input[name="balloonPayment"]', '20000');
    await page.waitForTimeout(300);

    // Change purchase price - balloon should NOT auto-update
    await page.click('button:has-text("Back")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Back")');
    await page.waitForTimeout(500);
    await page.fill('input[name="purchasePrice"]', '35000');

    // Navigate back to PCP financial details
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Balloon should still be the user's manual value (20000), not recalculated
    balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(20000);

    console.log('✓ User override prevents auto-estimation');
  });

  test('Test 6: Real-time update when term changes', async ({ page }) => {
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

    // Set term to 24 months
    await page.fill('input[name="termMonths"]', '24');
    await page.waitForTimeout(500);

    // Luxury vehicle, 24 months = 68% residual value
    // 40000 * 0.68 = 27200
    let balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(27200);

    // Change term to 48 months
    await page.fill('input[name="termMonths"]', '48');
    await page.waitForTimeout(500);

    // Luxury vehicle, 48 months = 50% residual value
    // 40000 * 0.50 = 20000
    balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(20000);

    console.log('✓ Real-time update when term changes works');
  });

  test('Test 7: Estimation range (±5%) displayed correctly', async ({ page }) => {
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

    // Purchase price: £25,000
    await page.fill('input[name="purchasePrice"]', '25000');

    // Navigate to PCP
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("PCP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill term
    await page.fill('input[name="termMonths"]', '36');
    await page.waitForTimeout(500);

    // Standard vehicle, 36 months = 55% residual value
    // 25000 * 0.55 = 13750
    // Range: 13750 * 0.95 = 13062.5 (13063) to 13750 * 1.05 = 14437.5 (14438)
    const balloonPayment = await page.inputValue('input[name="balloonPayment"]');
    expect(parseFloat(balloonPayment)).toBe(13750);

    // Check helper text contains the range
    const helperText = await page.textContent('p:has-text("Range:")');
    expect(helperText).toContain('£13,063');
    expect(helperText).toContain('£14,438');

    console.log('✓ ±5% estimation range displayed correctly');
  });

  test('Test 8: No estimation for non-PCP ownership types', async ({ page }) => {
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

    await page.fill('input[name="purchasePrice"]', '30000');

    // Navigate to Loan (not PCP)
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
    await clickMuiSelect(page, 'Ownership Type');
    await page.waitForTimeout(500);
    await page.click('li:has-text("Loan / HP")');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);

    // Fill term
    await page.fill('input[name="termMonths"]', '36');
    await page.waitForTimeout(500);

    // Balloon payment field should NOT be present for Loan
    const balloonField = await page.locator('input[name="balloonPayment"]').count();
    expect(balloonField).toBe(0);

    console.log('✓ No balloon estimation for non-PCP ownership types');
  });
});
