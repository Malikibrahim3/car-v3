/**
 * VISUAL INSPECTION TEST
 * Takes screenshots of ALL screens to see what's actually happening
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');

test.describe('Visual Inspection - See What Actually Looks Like', () => {
  test('Capture all screens with detailed analysis', async ({ page }) => {
    console.log('\n🔍 VISUAL INSPECTION STARTING...\n');
    
    // Create results directory
    if (!fs.existsSync('visual-inspection')) {
      fs.mkdirSync('visual-inspection', { recursive: true });
    }
    
    await page.setViewportSize({ width: 390, height: 844 });
    
    const report = [];
    
    async function inspectScreen(name, url) {
      console.log(`\n📸 Inspecting: ${name}`);
      
      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(2000);
        
        // Take screenshot
        const screenshotPath = `visual-inspection/${name.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        
        // Analyze what's on screen
        const analysis = {
          name,
          url,
          screenshot: screenshotPath,
          elements: {},
          issues: []
        };
        
        // Check for buttons
        const buttons = await page.locator('button, [role="button"]').all();
        analysis.elements.buttons = buttons.length;
        
        // Check button sizes
        for (const btn of buttons.slice(0, 5)) {
          try {
            const box = await btn.boundingBox();
            const text = await btn.textContent().catch(() => '');
            if (box) {
              console.log(`  Button: "${text?.trim()}" - ${box.width.toFixed(0)}×${box.height.toFixed(0)}px`);
              if (box.height < 44) {
                analysis.issues.push(`Button too short: ${box.height.toFixed(0)}px`);
              }
            }
          } catch (e) {}
        }
        
        // Check for text elements
        const textElements = await page.locator('p, span, h1, h2, h3, h4, h5, h6').all();
        analysis.elements.textElements = textElements.length;
        
        // Check headings
        const headings = await page.locator('h1, h2, h3, [class*="headline"], [class*="title"]').all();
        analysis.elements.headings = headings.length;
        
        for (const heading of headings.slice(0, 3)) {
          try {
            const text = await heading.textContent();
            const styles = await heading.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                color: computed.color
              };
            });
            console.log(`  Heading: "${text?.trim()}" - ${styles.fontSize}, weight: ${styles.fontWeight}`);
            if (parseInt(styles.fontWeight) < 600) {
              analysis.issues.push(`Heading too light: ${styles.fontWeight}`);
            }
          } catch (e) {}
        }
        
        // Check for cards
        const cards = await page.locator('[class*="card"], [class*="Card"]').count();
        analysis.elements.cards = cards;
        console.log(`  Cards found: ${cards}`);
        
        // Check overall layout
        const bodyStyles = await page.evaluate(() => {
          const body = document.body;
          const computed = window.getComputedStyle(body);
          return {
            backgroundColor: computed.backgroundColor,
            color: computed.color,
            fontFamily: computed.fontFamily
          };
        });
        analysis.styles = bodyStyles;
        
        console.log(`  Background: ${bodyStyles.backgroundColor}`);
        console.log(`  Text color: ${bodyStyles.color}`);
        console.log(`  Issues found: ${analysis.issues.length}`);
        
        report.push(analysis);
        
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        report.push({
          name,
          url,
          error: error.message
        });
      }
    }
    
    // Inspect all screens
    await inspectScreen('Landing Page', 'http://localhost:8081/');
    await inspectScreen('Login', 'http://localhost:8081/login');
    await inspectScreen('Signup', 'http://localhost:8081/signup');
    await inspectScreen('Forgot Password', 'http://localhost:8081/forgot-password');
    
    // Try authenticated screens
    try {
      await inspectScreen('Dashboard', 'http://localhost:8081/dashboard');
      await inspectScreen('Garage', 'http://localhost:8081/garage');
      await inspectScreen('Tools', 'http://localhost:8081/tools');
      await inspectScreen('Activity', 'http://localhost:8081/activity');
      await inspectScreen('Forecast', 'http://localhost:8081/forecast');
      await inspectScreen('Estimate', 'http://localhost:8081/estimate');
      await inspectScreen('More', 'http://localhost:8081/more');
      await inspectScreen('Achievements', 'http://localhost:8081/achievements');
      await inspectScreen('Notifications', 'http://localhost:8081/notifications');
      await inspectScreen('Settings', 'http://localhost:8081/settings');
      await inspectScreen('Help', 'http://localhost:8081/help');
    } catch (e) {
      console.log('⚠️  Some authenticated screens may not be accessible');
    }
    
    // Generate report
    const reportText = generateReport(report);
    fs.writeFileSync('visual-inspection/INSPECTION-REPORT.md', reportText);
    
    console.log('\n✅ VISUAL INSPECTION COMPLETE');
    console.log('📄 Report: visual-inspection/INSPECTION-REPORT.md');
    console.log('📸 Screenshots: visual-inspection/*.png\n');
  });
});

function generateReport(report) {
  let md = `# 🔍 VISUAL INSPECTION REPORT\n\n`;
  md += `**Date:** ${new Date().toLocaleString()}\n`;
  md += `**Screens Inspected:** ${report.length}\n\n`;
  md += `---\n\n`;
  
  report.forEach(screen => {
    md += `## ${screen.name}\n\n`;
    
    if (screen.error) {
      md += `❌ **Error:** ${screen.error}\n\n`;
      return;
    }
    
    md += `- **URL:** ${screen.url}\n`;
    md += `- **Screenshot:** ${screen.screenshot}\n\n`;
    
    md += `### Elements Found\n`;
    md += `- Buttons: ${screen.elements.buttons}\n`;
    md += `- Headings: ${screen.elements.headings}\n`;
    md += `- Text Elements: ${screen.elements.textElements}\n`;
    md += `- Cards: ${screen.elements.cards}\n\n`;
    
    if (screen.styles) {
      md += `### Styles\n`;
      md += `- Background: ${screen.styles.backgroundColor}\n`;
      md += `- Text Color: ${screen.styles.color}\n`;
      md += `- Font: ${screen.styles.fontFamily}\n\n`;
    }
    
    if (screen.issues.length > 0) {
      md += `### Issues Detected\n`;
      screen.issues.forEach(issue => {
        md += `- ⚠️ ${issue}\n`;
      });
      md += `\n`;
    } else {
      md += `✅ No obvious issues detected\n\n`;
    }
    
    md += `---\n\n`;
  });
  
  return md;
}
