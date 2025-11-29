/**
 * FULL UI AUDIT - Comprehensive Visual Inspection
 * 
 * This test navigates through every screen in the app,
 * captures screenshots, measures elements, and detects UI issues.
 * 
 * NO FIXES - ONLY INSPECTION AND REPORTING
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Audit results storage
const auditResults = {
  timestamp: new Date().toISOString(),
  screens: [],
  summary: {
    totalScreens: 0,
    totalIssues: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0
  }
};

// Helper to add issue to audit
function addIssue(screenName, category, severity, description, expected, element = null) {
  const issue = {
    category,
    severity,
    description,
    expected,
    element: element ? {
      selector: element.selector,
      boundingBox: element.boundingBox,
      styles: element.styles
    } : null
  };
  
  const screen = auditResults.screens.find(s => s.name === screenName);
  if (screen) {
    screen.issues.push(issue);
    auditResults.summary.totalIssues++;
    auditResults.summary[`${severity.toLowerCase()}Issues`]++;
  }
}

// Helper to analyze element
async function analyzeElement(page, selector, screenName) {
  try {
    const element = await page.locator(selector).first();
    if (await element.count() === 0) return null;
    
    const box = await element.boundingBox();
    const styles = await element.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        margin: computed.margin,
        width: computed.width,
        height: computed.height,
        display: computed.display,
        position: computed.position
      };
    });
    
    return { selector, boundingBox: box, styles };
  } catch (e) {
    return null;
  }
}

// Helper to check touch target size (iOS HIG: minimum 44x44pt)
async function checkTouchTargets(page, screenName) {
  const buttons = await page.locator('button, [role="button"], a').all();
  
  for (const button of buttons) {
    try {
      const box = await button.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        const text = await button.textContent().catch(() => 'Unknown');
        addIssue(
          screenName,
          'iOS Human Interface Violations',
          'High',
          `Touch target too small: ${box.width.toFixed(0)}x${box.height.toFixed(0)}px. Text: "${text?.trim()}"`,
          'iOS HIG requires minimum 44x44pt touch targets',
          { selector: 'button', boundingBox: box, styles: {} }
        );
      }
    } catch (e) {
      // Skip if element is not visible
    }
  }
}

// Helper to check text contrast
async function checkTextContrast(page, screenName) {
  const textElements = await page.locator('p, span, h1, h2, h3, h4, h5, h6, text').all();
  
  for (const element of textElements.slice(0, 20)) { // Sample first 20
    try {
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      // Simple contrast check (would need proper algorithm for production)
      if (styles.color === styles.backgroundColor) {
        addIssue(
          screenName,
          'Color & Theme',
          'Critical',
          'Text has same color as background - invisible text detected',
          'Text should have sufficient contrast ratio (WCAG AA: 4.5:1 minimum)',
          { selector: 'text', boundingBox: null, styles }
        );
      }
    } catch (e) {
      // Skip
    }
  }
}

// Helper to check spacing consistency
async function checkSpacing(page, screenName) {
  const cards = await page.locator('[class*="card"], [class*="Card"]').all();
  const paddings = [];
  
  for (const card of cards) {
    try {
      const padding = await card.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return computed.padding;
      });
      paddings.push(padding);
    } catch (e) {
      // Skip
    }
  }
  
  // Check if paddings are inconsistent
  const uniquePaddings = [...new Set(paddings)];
  if (uniquePaddings.length > 3) {
    addIssue(
      screenName,
      'Layout',
      'Medium',
      `Inconsistent card padding detected: ${uniquePaddings.length} different padding values found`,
      'Cards should have consistent padding throughout the app (iOS uses 16-20pt typically)'
    );
  }
}

// Helper to check font sizes
async function checkTypography(page, screenName) {
  const headings = await page.locator('h1, h2, h3, [class*="heading"], [class*="Heading"], [class*="title"], [class*="Title"]').all();
  
  for (const heading of headings) {
    try {
      const styles = await heading.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontSize: parseFloat(computed.fontSize),
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight
        };
      });
      
      if (styles.fontSize < 20) {
        addIssue(
          screenName,
          'Typography',
          'Medium',
          `Heading font size too small: ${styles.fontSize}px`,
          'iOS headings should be 20-34pt for good hierarchy'
        );
      }
      
      if (parseInt(styles.fontWeight) < 600) {
        addIssue(
          screenName,
          'Typography',
          'Low',
          `Heading font weight too light: ${styles.fontWeight}`,
          'iOS headings typically use semibold (600) or bold (700) weights'
        );
      }
    } catch (e) {
      // Skip
    }
  }
}

// Main audit function for a screen
async function auditScreen(page, screenName, path, navigationFn = null) {
  console.log(`\n🔍 Auditing: ${screenName}`);
  
  const screenData = {
    name: screenName,
    path: path,
    screenshot: `audit-${screenName.toLowerCase().replace(/\s+/g, '-')}.png`,
    issues: [],
    timestamp: new Date().toISOString()
  };
  
  auditResults.screens.push(screenData);
  auditResults.summary.totalScreens++;
  
  try {
    // Navigate if function provided
    if (navigationFn) {
      await navigationFn();
    }
    
    // Wait for page to be stable
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: `test-results/${screenData.screenshot}`,
      fullPage: true 
    });
    
    // Run all checks
    await checkTouchTargets(page, screenName);
    await checkTextContrast(page, screenName);
    await checkSpacing(page, screenName);
    await checkTypography(page, screenName);
    
    // Check for overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (hasHorizontalScroll) {
      addIssue(
        screenName,
        'Layout',
        'High',
        'Horizontal scroll detected - content overflows viewport',
        'All content should fit within viewport width'
      );
    }
    
    // Check for overlapping elements
    const overlaps = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const overlapping = [];
      
      for (let i = 0; i < Math.min(elements.length, 50); i++) {
        const rect1 = elements[i].getBoundingClientRect();
        if (rect1.width === 0 || rect1.height === 0) continue;
        
        for (let j = i + 1; j < Math.min(elements.length, 50); j++) {
          const rect2 = elements[j].getBoundingClientRect();
          if (rect2.width === 0 || rect2.height === 0) continue;
          
          // Check if elements overlap
          if (!(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom)) {
            // They overlap - check if it's intentional (parent-child)
            if (!elements[i].contains(elements[j]) && !elements[j].contains(elements[i])) {
              overlapping.push({
                element1: elements[i].tagName,
                element2: elements[j].tagName
              });
            }
          }
        }
      }
      
      return overlapping.slice(0, 5); // Return first 5
    });
    
    if (overlaps.length > 0) {
      addIssue(
        screenName,
        'Visual Bugs',
        'Medium',
        `Overlapping elements detected: ${overlaps.length} cases found`,
        'Elements should not overlap unless intentionally layered'
      );
    }
    
    console.log(`✅ ${screenName}: ${screenData.issues.length} issues found`);
    
  } catch (error) {
    console.error(`❌ Error auditing ${screenName}:`, error.message);
    addIssue(
      screenName,
      'Navigation',
      'Critical',
      `Failed to audit screen: ${error.message}`,
      'Screen should be accessible and stable'
    );
  }
}

test.describe('Full UI Audit', () => {
  test.beforeAll(async () => {
    // Ensure test-results directory exists
    if (!fs.existsSync('test-results')) {
      fs.mkdirSync('test-results');
    }
  });
  
  test('Audit all screens', async ({ page }) => {
    console.log('\n🚀 Starting Full UI Audit...\n');
    
    // Set viewport to iPhone size
    await page.setViewportSize({ width: 390, height: 844 });
    
    // 1. Landing Page
    await page.goto('/');
    await auditScreen(page, 'Landing Page', '/');
    
    // Check for specific landing page issues
    const heroText = await page.locator('text=/welcome|get started|track/i').first();
    if (await heroText.count() > 0) {
      const heroStyles = await analyzeElement(page, 'text=/welcome|get started|track/i', 'Landing Page');
      if (heroStyles && heroStyles.styles.fontSize) {
        const size = parseFloat(heroStyles.styles.fontSize);
        if (size < 28) {
          addIssue(
            'Landing Page',
            'Typography',
            'High',
            `Hero text too small: ${size}px`,
            'Landing page hero should be 28-34pt minimum for impact'
          );
        }
      }
    }
    
    // 2. Login Page
    await page.goto('/login');
    await auditScreen(page, 'Login Page', '/login');
    
    // Check form inputs
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const box = await input.boundingBox();
      if (box && box.height < 44) {
        addIssue(
          'Login Page',
          'iOS Human Interface Violations',
          'High',
          `Input field too short: ${box.height}px`,
          'iOS input fields should be minimum 44pt tall'
        );
      }
    }
    
    // 3. Signup Page
    await page.goto('/signup');
    await auditScreen(page, 'Signup Page', '/signup');
    
    // 4. Forgot Password
    await page.goto('/forgot-password');
    await auditScreen(page, 'Forgot Password Page', '/forgot-password');
    
    // For authenticated screens, we'll need to check if we can access them
    // Try to navigate to dashboard
    try {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('dashboard')) {
        // We're authenticated or can access dashboard
        
        // 5. Dashboard
        await auditScreen(page, 'Dashboard', '/dashboard');
        
        // Check dashboard specific elements
        const cards = await page.locator('[class*="card"], [class*="Card"]').all();
        if (cards.length === 0) {
          addIssue(
            'Dashboard',
            'Layout',
            'Critical',
            'No cards found on dashboard - empty state or broken layout',
            'Dashboard should display vehicle cards or empty state'
          );
        }
        
        // 6. Garage
        await page.goto('/garage');
        await auditScreen(page, 'Garage', '/garage');
        
        // 7. Activity
        await page.goto('/activity');
        await auditScreen(page, 'Activity', '/activity');
        
        // 8. Forecast
        await page.goto('/forecast');
        await auditScreen(page, 'Forecast', '/forecast');
        
        // 9. Estimate
        await page.goto('/estimate');
        await auditScreen(page, 'Estimate', '/estimate');
        
        // 10. Tools
        await page.goto('/tools');
        await auditScreen(page, 'Tools', '/tools');
        
        // 11. Achievements
        await page.goto('/achievements');
        await auditScreen(page, 'Achievements', '/achievements');
        
        // 12. Notifications
        await page.goto('/notifications');
        await auditScreen(page, 'Notifications', '/notifications');
        
        // 13. Settings
        await page.goto('/settings');
        await auditScreen(page, 'Settings', '/settings');
        
        // 14. Help
        await page.goto('/help');
        await auditScreen(page, 'Help', '/help');
        
        // 15. More
        await page.goto('/more');
        await auditScreen(page, 'More', '/more');
        
      } else {
        console.log('⚠️  Cannot access authenticated screens - would need login');
        addIssue(
          'Navigation',
          'Navigation',
          'Low',
          'Authenticated screens not accessible without login',
          'Note: Full audit requires authentication'
        );
      }
    } catch (error) {
      console.log('⚠️  Cannot access authenticated screens:', error.message);
    }
    
    console.log('\n✅ Audit Complete!\n');
  });
  
  test.afterAll(async () => {
    // Generate audit report
    const reportPath = 'test-results/UI-AUDIT-REPORT.json';
    fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
    
    // Generate human-readable report
    const mdReport = generateMarkdownReport(auditResults);
    fs.writeFileSync('test-results/UI-AUDIT-REPORT.md', mdReport);
    
    console.log('\n📊 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total Screens: ${auditResults.summary.totalScreens}`);
    console.log(`Total Issues: ${auditResults.summary.totalIssues}`);
    console.log(`  🔴 Critical: ${auditResults.summary.criticalIssues}`);
    console.log(`  🟠 High: ${auditResults.summary.highIssues}`);
    console.log(`  🟡 Medium: ${auditResults.summary.mediumIssues}`);
    console.log(`  🟢 Low: ${auditResults.summary.lowIssues}`);
    console.log(`\n📄 Full report: ${reportPath}`);
    console.log(`📄 Markdown report: test-results/UI-AUDIT-REPORT.md`);
  });
});

function generateMarkdownReport(results) {
  let md = `# 🔍 FULL UI AUDIT REPORT\n\n`;
  md += `**Generated:** ${new Date(results.timestamp).toLocaleString()}\n\n`;
  md += `## 📊 Executive Summary\n\n`;
  md += `- **Total Screens Audited:** ${results.summary.totalScreens}\n`;
  md += `- **Total Issues Found:** ${results.summary.totalIssues}\n`;
  md += `- 🔴 **Critical Issues:** ${results.summary.criticalIssues}\n`;
  md += `- 🟠 **High Priority Issues:** ${results.summary.highIssues}\n`;
  md += `- 🟡 **Medium Priority Issues:** ${results.summary.mediumIssues}\n`;
  md += `- 🟢 **Low Priority Issues:** ${results.summary.lowIssues}\n\n`;
  
  md += `---\n\n`;
  
  // Group issues by category
  const issuesByCategory = {};
  results.screens.forEach(screen => {
    screen.issues.forEach(issue => {
      if (!issuesByCategory[issue.category]) {
        issuesByCategory[issue.category] = [];
      }
      issuesByCategory[issue.category].push({
        screen: screen.name,
        ...issue
      });
    });
  });
  
  md += `## 🎯 Issues by Category\n\n`;
  
  Object.keys(issuesByCategory).sort().forEach(category => {
    const issues = issuesByCategory[category];
    md += `### ${category} (${issues.length} issues)\n\n`;
    
    issues.forEach((issue, idx) => {
      const emoji = {
        'Critical': '🔴',
        'High': '🟠',
        'Medium': '🟡',
        'Low': '🟢'
      }[issue.severity] || '⚪';
      
      md += `${idx + 1}. ${emoji} **${issue.severity}** - ${issue.screen}\n`;
      md += `   - **Issue:** ${issue.description}\n`;
      md += `   - **Expected:** ${issue.expected}\n`;
      if (issue.element && issue.element.boundingBox) {
        md += `   - **Location:** ${JSON.stringify(issue.element.boundingBox)}\n`;
      }
      md += `\n`;
    });
    
    md += `\n`;
  });
  
  md += `---\n\n`;
  md += `## 📱 Screen-by-Screen Breakdown\n\n`;
  
  results.screens.forEach(screen => {
    md += `### ${screen.name}\n\n`;
    md += `- **Path:** \`${screen.path}\`\n`;
    md += `- **Screenshot:** \`${screen.screenshot}\`\n`;
    md += `- **Issues Found:** ${screen.issues.length}\n\n`;
    
    if (screen.issues.length > 0) {
      screen.issues.forEach((issue, idx) => {
        const emoji = {
          'Critical': '🔴',
          'High': '🟠',
          'Medium': '🟡',
          'Low': '🟢'
        }[issue.severity] || '⚪';
        
        md += `${idx + 1}. ${emoji} **[${issue.category}]** ${issue.description}\n`;
        md += `   - Expected: ${issue.expected}\n`;
      });
    } else {
      md += `✅ No issues detected\n`;
    }
    
    md += `\n---\n\n`;
  });
  
  md += `## 🎨 Design Recommendations\n\n`;
  md += `Based on the audit findings, here are the key areas requiring attention:\n\n`;
  
  if (results.summary.criticalIssues > 0) {
    md += `### 🔴 Critical Issues (Fix Immediately)\n`;
    md += `These issues severely impact usability and must be addressed:\n\n`;
    results.screens.forEach(screen => {
      const critical = screen.issues.filter(i => i.severity === 'Critical');
      if (critical.length > 0) {
        md += `**${screen.name}:**\n`;
        critical.forEach(issue => {
          md += `- ${issue.description}\n`;
        });
        md += `\n`;
      }
    });
  }
  
  md += `\n## 📋 Next Steps\n\n`;
  md += `1. Review all Critical and High priority issues\n`;
  md += `2. Prioritize fixes based on user impact\n`;
  md += `3. Address iOS Human Interface Guidelines violations\n`;
  md += `4. Ensure consistent spacing and typography\n`;
  md += `5. Verify all touch targets meet 44x44pt minimum\n`;
  md += `6. Test color contrast ratios\n`;
  md += `7. Re-run audit after fixes to verify improvements\n\n`;
  
  md += `---\n\n`;
  md += `*This audit was performed automatically using Playwright visual inspection.*\n`;
  md += `*Manual review of screenshots is recommended for complete assessment.*\n`;
  
  return md;
}
