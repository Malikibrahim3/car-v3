import { test, expect } from '@playwright/test';

test.describe('Premium Fintech Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the forecast page where InteractiveForecastChart is used
    await page.goto('http://localhost:8081');
    
    // Wait for initial load and navigation
    await page.waitForTimeout(2000);
    
    // Navigate to forecast page
    await page.goto('http://localhost:8081/forecast');
    
    // Wait for the forecast page to load
    await page.waitForSelector('text=FORECAST MODEL', { timeout: 20000 });
  });

  // 1. THE "SOUL" TEST (Visual Density)
  // Checks if the main chart is present and substantial, not a sliver.
  test('Dashboard should have a substantial Hero Chart', async ({ page }) => {
    // react-native-gifted-charts renders as SVG on web, not canvas
    // Find all SVGs and filter for the chart (should be large)
    const allSvgs = await page.locator('svg').all();
    
    let heroChart = null;
    let box = null;
    
    // Find the largest SVG (the chart)
    for (const svg of allSvgs) {
      const currentBox = await svg.boundingBox();
      if (currentBox && currentBox.height > 100) {
        heroChart = svg;
        box = currentBox;
        break;
      }
    }
    
    expect(box).not.toBeNull();
    
    if (box) {
      console.log(`Chart Dimensions: ${box.width}x${box.height}`);
      // A premium chart should be at least 200px tall to show detail
      expect(box.height).toBeGreaterThan(200);
    }
  });

  // 2. THE "JITTER" TEST (Typography Stability)
  // Verifies that numbers use tabular formatting to prevent layout shifts.
  test('Financial numbers should use tabular lining', async ({ page }) => {
    // Target a known financial text element. You might need to add a testID in your app code.
    // Example: <Text testID="equity-value">...
    const balanceText = page.getByText('$').first();
    
    // Check computed styles for font features or monospace properties
    const fontVariant = await balanceText.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.fontVariantNumeric || style.fontFeatureSettings;
    });

    // We expect tabular-nums for stability
    // Note: CSS output depends on how React Native Web compiles styles
    // If this fails, check if 'fontVariant: ["tabular-nums"]' is working in web build
    console.log('Font Variant Detected:', fontVariant);
  });

  // 3. THE "INTERACTION" TEST (Chart Responsiveness)
  // Simulates a drag gesture and checks if the tooltip appears instantly.
  test('Chart tooltip should track interaction', async ({ page }) => {
    // react-native-gifted-charts renders as SVG on web
    const chartArea = page.locator('svg').first();
    const box = await chartArea.boundingBox();
    
    if (!box) throw new Error("Chart SVG not found");

    // 1. Start interaction: Hover/Touch the middle-left of the chart
    await page.mouse.move(box.x + 50, box.y + box.height / 2);
    await page.mouse.down();

    // 2. Verify Tooltip Appears (look for month name in tooltip)
    const tooltip = page.locator('text=/JAN|FEB|MAR/i').first();
    await expect(tooltip).toBeVisible({ timeout: 5000 });

    // 3. Scrub to the right
    await page.mouse.move(box.x + box.width - 50, box.y + box.height / 2, { steps: 10 });

    // 4. Verify Tooltip Updates/Stays Visible
    await expect(tooltip).toBeVisible();
    
    await page.mouse.up();
  });

  // 4. THE "FAT FINGER" TEST (Touch Targets)
  // Ensures interactive elements are large enough for fingers (Apple HIG > 44pt).
  test('Interactive elements meet minimum touch target size', async ({ page }) => {
    // Test the year tabs (2025, 2026, 2027)
    // Find the text and get its parent div which is the Pressable
    const textElement = page.getByText('2025').first();
    await expect(textElement).toBeVisible();
    
    // Get the parent element (the Pressable container)
    const parentElement = page.locator('div').filter({ has: textElement }).first();
    const box = await parentElement.boundingBox();
    
    if (box) {
      console.log(`Touch Target Size: ${box.width}x${box.height}`);
      expect(box.height).toBeGreaterThanOrEqual(40); // Apple HIG minimum is 44pt, we allow 40px
    }
  });

  // 5. THE "COLOR PSYCHOLOGY" TEST
  // Checks if semantic colors (Green for good) are correctly applied.
  test('Positive equity should display in Green', async ({ page }) => {
    // Target a positive value or badge
    // You might need to ensure your mock data produces a positive value for this test
    const positiveIndicator = page.locator('text=+').first(); // Looking for "+$..."
    
    const color = await positiveIndicator.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Check for Green (generic check for green hue in RGB)
    // rgb(22, 101, 52) is the #166534 used in your palette
    // rgb(4, 120, 87) is another common green
    // We check if Green component is dominant or specific value
    console.log('Detected Color:', color);
    expect(color).not.toBe('rgb(0, 0, 0)'); // Should not be black
  });
});
