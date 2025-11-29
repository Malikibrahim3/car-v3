const { test } = require('@playwright/test');

test('Diagnose current colors', async ({ page }) => {
  console.log('Loading page...');
  await page.goto('http://localhost:8081');
  await page.waitForTimeout(5000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'test-results/diagnosis.png', fullPage: true });
  
  console.log('Checking colors...');
  const report = await page.evaluate(() => {
    const allElements = Array.from(document.querySelectorAll('*'));
    const report = {
      backgrounds: new Set(),
      textColors: new Set(),
      totalElements: allElements.length,
    };
    
    allElements.slice(0, 100).forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        report.backgrounds.add(styles.backgroundColor);
      }
      if (styles.color) {
        report.textColors.add(styles.color);
      }
    });
    
    return {
      backgrounds: Array.from(report.backgrounds),
      textColors: Array.from(report.textColors),
      totalElements: report.totalElements,
    };
  });
  
  console.log('\n=== COLOR DIAGNOSIS ===');
  console.log('Total elements:', report.totalElements);
  console.log('\nBackgrounds found:');
  report.backgrounds.forEach(bg => console.log('  -', bg));
  console.log('\nText colors found:');
  report.textColors.forEach(color => console.log('  -', color));
  console.log('=======================\n');
  
  console.log('Screenshot saved to test-results/diagnosis.png');
});
