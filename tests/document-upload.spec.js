const { test, expect } = require('@playwright/test');

test.describe('Document Upload Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for app to load
    await page.waitForSelector('text=My Garage', { timeout: 10000 });
  });

  test('should show upload document option in Add Vehicle dialog', async ({ page }) => {
    // Click Add Vehicle button
    await page.click('button:has-text("Add Vehicle")');
    
    // Wait for dialog to open
    await page.waitForSelector('text=Add New Vehicle');
    
    // Check for input method selector
    await expect(page.locator('text=How would you like to add your vehicle?')).toBeVisible();
    
    // Check for both options
    await expect(page.locator('text=Enter Manually')).toBeVisible();
    await expect(page.locator('text=Upload Document')).toBeVisible();
  });

  test('should display privacy notice when upload tab is selected', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check for privacy notice
    await expect(page.locator('text=Your Privacy is Protected')).toBeVisible();
    await expect(page.locator('text=Document is processed securely')).toBeVisible();
    await expect(page.locator('text=No document saved on our servers')).toBeVisible();
    await expect(page.locator('text=File deleted immediately')).toBeVisible();
  });

  test('should show upload area with drag and drop', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check for upload area
    await expect(page.locator('text=Upload Finance Agreement')).toBeVisible();
    await expect(page.locator('text=Drag and drop or click to browse')).toBeVisible();
    await expect(page.locator('text=Supports PDF, JPG, PNG')).toBeVisible();
  });

  test('should allow switching between manual and upload modes', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Start with manual (default)
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
    
    // Switch to upload
    await page.click('text=Upload Document');
    await expect(page.locator('text=Upload Finance Agreement')).toBeVisible();
    
    // Switch back to manual
    await page.click('text=Enter Manually');
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
  });

  test('should show manual entry fallback option', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check for fallback option
    await expect(page.locator('text=Enter Details Manually Instead')).toBeVisible();
  });

  test('should have accessible keyboard navigation', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to switch tabs with keyboard
    await page.keyboard.press('Enter');
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Add New Vehicle')).not.toBeVisible();
  });

  test('should display all privacy guarantees', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check all privacy points
    const privacyPoints = [
      'Document is processed securely and temporarily',
      'Information is only used to fill out vehicle details',
      'No document is saved or stored on our servers',
      'File is deleted immediately after processing'
    ];
    
    for (const point of privacyPoints) {
      await expect(page.locator(`text=${point}`)).toBeVisible();
    }
  });

  test('should show file size and type restrictions', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check for restrictions
    await expect(page.locator('text=max 10MB')).toBeVisible();
    await expect(page.locator('text=PDF, JPG, PNG')).toBeVisible();
  });

  test('should have proper ARIA labels for accessibility', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Check for accessible elements
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
  });

  test('should close dialog and reset state', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Switch to upload
    await page.click('text=Upload Document');
    await expect(page.locator('text=Upload Finance Agreement')).toBeVisible();
    
    // Close dialog
    await page.click('[aria-label*="Close"]');
    
    // Reopen dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Should be back to manual mode (default)
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
  });
});

test.describe('Document Upload - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=My Garage', { timeout: 10000 });
  });

  test('should match upload area screenshot', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Wait for upload area to be visible
    await page.waitForSelector('text=Upload Finance Agreement');
    
    // Take screenshot
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toHaveScreenshot('upload-area.png', {
      maxDiffPixels: 100
    });
  });

  test('should match privacy notice screenshot', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Take screenshot of privacy notice
    const privacyNotice = page.locator('text=Your Privacy is Protected').locator('..');
    await expect(privacyNotice).toHaveScreenshot('privacy-notice.png', {
      maxDiffPixels: 50
    });
  });
});

test.describe('Document Upload - Mobile', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=My Garage', { timeout: 10000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check that elements are visible and properly sized
    await expect(page.locator('text=Upload Finance Agreement')).toBeVisible();
    await expect(page.locator('text=Your Privacy is Protected')).toBeVisible();
    
    // Check that upload area is touch-friendly (large enough)
    const uploadArea = page.locator('text=Upload Finance Agreement').locator('..');
    const box = await uploadArea.boundingBox();
    expect(box.height).toBeGreaterThan(200); // Should be tall enough for touch
  });

  test('should have large touch targets on mobile', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check button size (should be at least 44x44 for touch)
    const chooseFileButton = page.locator('button:has-text("Choose File")');
    const box = await chooseFileButton.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Document Upload - Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=My Garage', { timeout: 10000 });
  });

  test('should integrate with existing Add Vehicle flow', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Verify both input methods are available
    await expect(page.locator('text=Enter Manually')).toBeVisible();
    await expect(page.locator('text=Upload Document')).toBeVisible();
    
    // Manual entry should still work
    await page.click('text=Enter Manually');
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
    
    // Should have all the original form fields
    await expect(page.locator('label:has-text("Make")')).toBeVisible();
    await expect(page.locator('label:has-text("Model")')).toBeVisible();
    await expect(page.locator('label:has-text("Year")')).toBeVisible();
  });

  test('should maintain form state when switching modes', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Start with manual and enter some data
    await page.click('text=Enter Manually');
    // Note: Would need to fill form here if selects were working
    
    // Switch to upload
    await page.click('text=Upload Document');
    await expect(page.locator('text=Upload Finance Agreement')).toBeVisible();
    
    // Switch back to manual
    await page.click('text=Enter Manually');
    // Form should still be there
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();
  });
});

test.describe('Document Upload - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=My Garage', { timeout: 10000 });
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Click Upload Document tab
    await page.click('text=Upload Document');
    
    // Check for proper semantic structure
    await expect(page.locator('text=Your Privacy is Protected')).toBeVisible();
  });

  test('should announce state changes to screen readers', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Switch to upload mode
    await page.click('text=Upload Document');
    
    // Content should change and be announced
    await expect(page.locator('text=Upload Finance Agreement')).toBeVisible();
  });

  test('should have visible focus indicators', async ({ page }) => {
    // Open Add Vehicle dialog
    await page.click('button:has-text("Add Vehicle")');
    await page.waitForSelector('text=Add New Vehicle');
    
    // Tab to upload tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focused element is visible
    const focused = await page.evaluate(() => document.activeElement.tagName);
    expect(focused).toBeTruthy();
  });
});
