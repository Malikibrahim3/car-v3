/**
 * Iterative iOS Audit - 3 Iteration Cycle
 * Audits UI, tracks improvements, generates reports
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ITERATION = process.env.ITERATION || '1';
const RESULTS_DIR = `audit-results/iteration-${ITERATION}`;

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const auditResults = {
  iteration: ITERATION,
  timestamp: new Date().toISOString(),
  screens: [],
  summary: {
    totalScreens: 0,
    totalIssues: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    touchTargetViolations: 0,
    typographyIssues: 0,
    spacingIssues: 0,
    colorIssues: 0
  },
  improvements: {
    fixedSinceLastIteration: 0,
    remainingIssues: 0
  }
};

function addIssue(screenName, category, severity, description, expected, measurement = null) {
  const screen = auditResults.screens.find(s => s.name === screenName);
  if (screen) {
    screen.issues.push({
      category,
      severity,
      description,
      expected,
      measurement
    });
    auditResults.summary.totalIssues++;
    auditResults.summary[`${severity.toLowerCase()}Issues`]++;
    
    if (category === 'iOS Human Interface Violations') {
      auditResults.summary.touchTargetViolations++;
    } else if (category === 'Typography') {
      auditResults.summary.typographyIssues++;
    } else if (category === 'Layout') {
      auditResults.summary.spacingIssues++;
    } else if (category === 'Color & Theme') {
      auditResults.summary.colorIssues++;
    }
  }
}

async function checkTouchTargets(page, screenName) {
  const buttons = await page.locator('button, [role="button"], a').all();
  let violations = 0;
  
  for (const button of buttons) {
    try {
      const box = await button.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        const text = await button.textContent().catch(() => 'Unknown');
        addIssue(
          screenName,
          'iOS Human Interface Violations',
          'High',
          `Touch target too small: ${box.width.toFixed(0)}×${box.height.toFixed(0)}px. Text: "${text?.trim()}"`,
          'iOS HIG requires minimum 44×44pt touch targets',
          { width: box.width, height: box.height }
        );
        violations++;
      }
    } catch (e) {
      // Skip if element is not visible
    }
  }
  
  return violations;
}

async function checkTypography(page, screenName) {
  const headings = await page.locator('h1, h2, h3, [class*="heading"], [class*="Heading"], [class*="title"], [class*="Title"]').all();
  let issues = 0;
  
  for (const heading of headings) {
    try {
      const styles = await heading.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontSize: parseFloat(computed.fontSize),
          fontWeight: computed.fontWeight
        };
      });
      
      if (parseInt(styles.fontWeight) < 600) {
        addIssue(
          screenName,
          'Typography',
          'Low',
          `Heading font weight too light: ${styles.fontWeight}`,
          'iOS headings should use semibold (600) or bold (700) weights',
          { fontWeight: styles.fontWeight }
        );
        issues++;
      }
    } catch (e) {
      // Skip
    }
  }
  
  return issues;
}

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
  
  const uniquePaddings = [...new Set(paddings)];
  if (uniquePaddings.length > 3) {
    addIssue(
      screenName,
      'Layout',
      'Medium',
      `Inconsistent card padding: ${uniquePaddings.length} different values`,
      'Cards should have consistent padding (16-24pt typically)'
    );
    return 1;
  }
  
  return 0;
}

async function auditScreen(page, screenName, path) {
  console.log(`\n🔍 Iteration ${ITERATION} - Auditing: ${screenName}`);
  
  const screenData = {
    name: screenName,
    path: path,
    screenshot: `${screenName.toLowerCase().replace(/\s+/g, '-')}.png`,
    issues: [],
    metrics: {
      touchTargetViolations: 0,
      typographyIssues: 0,
      spacingIssues: 0
    }
  };
  
  auditResults.screens.push(screenData);
  auditResults.summary.totalScreens++;
  
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ 
      path: `${RESULTS_DIR}/${screenData.screenshot}`,
      fullPage: true 
    });
    
    // Run checks
    screenData.metrics.touchTargetViolations = await checkTouchTargets(page, screenName);
    screenData.metrics.typographyIssues = await checkTypography(page, screenName);
    screenData.metrics.spacingIssues = await checkSpacing(page, screenName);
    
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

test.describe(`Iteration ${ITERATION} - iOS Audit`, () => {
  test('Audit all screens', async ({ page }) => {
    console.log(`\n🚀 Starting Iteration ${ITERATION} Audit...\n`);
    
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Auth screens
    await page.goto('/');
    await auditScreen(page, 'Landing Page', '/');
    
    await page.goto('/login');
    await auditScreen(page, 'Login Page', '/login');
    
    await page.goto('/signup');
    await auditScreen(page, 'Signup Page', '/signup');
    
    await page.goto('/forgot-password');
    await auditScreen(page, 'Forgot Password', '/forgot-password');
    
    // App screens
    try {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      if (page.url().includes('dashboard')) {
        await auditScreen(page, 'Dashboard', '/dashboard');
        
        // Check if dashboard has content
        const cards = await page.locator('[class*="card"], [class*="Card"]').count();
        if (cards === 0) {
          addIssue(
            'Dashboard',
            'Layout',
            'Critical',
            'No cards found on dashboard',
            'Dashboard should display vehicle cards or empty state'
          );
        }
        
        await page.goto('/garage');
        await auditScreen(page, 'Garage', '/garage');
        
        await page.goto('/activity');
        await auditScreen(page, 'Activity', '/activity');
        
        await page.goto('/forecast');
        await auditScreen(page, 'Forecast', '/forecast');
        
        await page.goto('/estimate');
        await auditScreen(page, 'Estimate', '/estimate');
        
        await page.goto('/tools');
        await auditScreen(page, 'Tools', '/tools');
        
        await page.goto('/notifications');
        await auditScreen(page, 'Notifications', '/notifications');
        
        await page.goto('/settings');
        await auditScreen(page, 'Settings', '/settings');
      }
    } catch (error) {
      console.log('⚠️  Cannot access authenticated screens:', error.message);
    }
    
    console.log(`\n✅ Iteration ${ITERATION} Audit Complete!\n`);
  });
  
  test.afterAll(async () => {
    // Calculate improvements if not first iteration
    if (ITERATION > 1) {
      const prevIterationFile = `audit-results/iteration-${ITERATION - 1}/results.json`;
      if (fs.existsSync(prevIterationFile)) {
        const prevResults = JSON.parse(fs.readFileSync(prevIterationFile, 'utf8'));
        auditResults.improvements.fixedSinceLastIteration = 
          prevResults.summary.totalIssues - auditResults.summary.totalIssues;
        auditResults.improvements.remainingIssues = auditResults.summary.totalIssues;
      }
    }
    
    // Save JSON results
    fs.writeFileSync(
      `${RESULTS_DIR}/results.json`,
      JSON.stringify(auditResults, null, 2)
    );
    
    // Generate markdown report
    const report = generateReport(auditResults);
    fs.writeFileSync(`${RESULTS_DIR}/REPORT.md`, report);
    
    console.log('\n📊 ITERATION ' + ITERATION + ' SUMMARY');
    console.log('================');
    console.log(`Total Screens: ${auditResults.summary.totalScreens}`);
    console.log(`Total Issues: ${auditResults.summary.totalIssues}`);
    console.log(`  🔴 Critical: ${auditResults.summary.criticalIssues}`);
    console.log(`  🟠 High: ${auditResults.summary.highIssues}`);
    console.log(`  🟡 Medium: ${auditResults.summary.mediumIssues}`);
    console.log(`  🟢 Low: ${auditResults.summary.lowIssues}`);
    console.log(`\nTouch Target Violations: ${auditResults.summary.touchTargetViolations}`);
    console.log(`Typography Issues: ${auditResults.summary.typographyIssues}`);
    console.log(`Spacing Issues: ${auditResults.summary.spacingIssues}`);
    
    if (ITERATION > 1 && auditResults.improvements.fixedSinceLastIteration > 0) {
      console.log(`\n✨ Fixed Since Last Iteration: ${auditResults.improvements.fixedSinceLastIteration}`);
    }
    
    console.log(`\n📄 Report: ${RESULTS_DIR}/REPORT.md`);
  });
});

function generateReport(results) {
  let md = `# 🔍 ITERATION ${results.iteration} - iOS AUDIT REPORT\n\n`;
  md += `**Date:** ${new Date(results.timestamp).toLocaleString()}\n\n`;
  
  md += `## 📊 Summary\n\n`;
  md += `- **Total Screens:** ${results.summary.totalScreens}\n`;
  md += `- **Total Issues:** ${results.summary.totalIssues}\n`;
  md += `- 🔴 **Critical:** ${results.summary.criticalIssues}\n`;
  md += `- 🟠 **High:** ${results.summary.highIssues}\n`;
  md += `- 🟡 **Medium:** ${results.summary.mediumIssues}\n`;
  md += `- 🟢 **Low:** ${results.summary.lowIssues}\n\n`;
  
  md += `### Issue Breakdown\n\n`;
  md += `- Touch Target Violations: ${results.summary.touchTargetViolations}\n`;
  md += `- Typography Issues: ${results.summary.typographyIssues}\n`;
  md += `- Spacing Issues: ${results.summary.spacingIssues}\n`;
  md += `- Color Issues: ${results.summary.colorIssues}\n\n`;
  
  if (results.iteration > 1 && results.improvements.fixedSinceLastIteration > 0) {
    md += `## ✨ Improvements\n\n`;
    md += `- **Fixed Since Last Iteration:** ${results.improvements.fixedSinceLastIteration}\n`;
    md += `- **Remaining Issues:** ${results.improvements.remainingIssues}\n\n`;
  }
  
  md += `## 📱 Screen-by-Screen Results\n\n`;
  
  results.screens.forEach(screen => {
    md += `### ${screen.name}\n\n`;
    md += `- **Path:** \`${screen.path}\`\n`;
    md += `- **Screenshot:** \`${screen.screenshot}\`\n`;
    md += `- **Issues:** ${screen.issues.length}\n`;
    md += `- Touch Target Violations: ${screen.metrics.touchTargetViolations}\n`;
    md += `- Typography Issues: ${screen.metrics.typographyIssues}\n`;
    md += `- Spacing Issues: ${screen.metrics.spacingIssues}\n\n`;
    
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
        if (issue.measurement) {
          md += `   - Measurement: ${JSON.stringify(issue.measurement)}\n`;
        }
      });
    } else {
      md += `✅ No issues detected\n`;
    }
    
    md += `\n---\n\n`;
  });
  
  return md;
}
