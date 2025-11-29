const { test, expect } = require('@playwright/test');

/**
 * COMPREHENSIVE UI CONSISTENCY AUDIT
 * 
 * This test inspects EVERY page in the app for:
 * 1. Visual consistency (colors, typography, spacing)
 * 2. Navigation patterns (back buttons, bottom nav visibility)
 * 3. Design system adherence
 * 4. Flow and user experience
 * 
 * NO CHANGES - REPORT ONLY
 */

test.describe('🔍 COMPREHENSIVE UI CONSISTENCY AUDIT', () => {
  
  const DESIGN_STANDARDS = {
    colors: {
      background: '#F2F4F6',
      surface: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      accent: '#A50010',
      success: '#059669',
      danger: '#DC2626',
      border: 'rgba(0, 0, 0, 0.06)',
    },
    typography: {
      largeTitle: '34px',
      title1: '28px',
      title2: '22px',
      title3: '20px',
      headline: '17px',
      body: '17px',
      callout: '16px',
      subheadline: '15px',
      footnote: '13px',
      caption: '12px',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    radius: {
      sm: '12px',
      md: '16px',
      lg: '20px',
      xl: '24px',
    },
  };

  const PAGES = {
    tabs: [
      { name: 'Dashboard', path: '/', hasBottomNav: true },
      { name: 'Garage', path: '/garage', hasBottomNav: true },
      { name: 'Tools', path: '/tools', hasBottomNav: true },
      { name: 'Activity', path: '/activity', hasBottomNav: true },
      { name: 'Profile', path: '/profile', hasBottomNav: true },
    ],
    stack: [
      { name: 'Estimate', path: '/estimate', needsBackButton: true, hasBottomNav: false },
      { name: 'Forecast', path: '/forecast', needsBackButton: true, hasBottomNav: false },
      { name: 'Settings', path: '/settings', needsBackButton: true, hasBottomNav: false },
      { name: 'Achievements', path: '/achievements', needsBackButton: true, hasBottomNav: false },
      { name: 'Help', path: '/help', needsBackButton: true, hasBottomNav: false },
      { name: 'Notifications', path: '/notifications', needsBackButton: true, hasBottomNav: false },
    ],
    auth: [
      { name: 'Landing', path: '/landing', hasBottomNav: false },
      { name: 'Login', path: '/login', hasBottomNav: false },
      { name: 'Signup', path: '/signup', hasBottomNav: false },
      { name: 'Forgot Password', path: '/forgot-password', hasBottomNav: false },
    ],
  };

  let auditReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: 0,
      pagesAudited: 0,
      issuesFound: 0,
      criticalIssues: 0,
      warningIssues: 0,
    },
    pageReports: [],
  };

  test.beforeAll(() => {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 COMPREHENSIVE UI CONSISTENCY AUDIT');
    console.log('='.repeat(80));
    console.log(`Started: ${new Date().toLocaleString()}`);
    console.log('='.repeat(80) + '\n');
  });

  test.afterAll(() => {
    console.log('\n' + '='.repeat(80));
    console.log('📊 AUDIT SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Pages: ${auditReport.summary.totalPages}`);
    console.log(`Pages Audited: ${auditReport.summary.pagesAudited}`);
    console.log(`Total Issues: ${auditReport.summary.issuesFound}`);
    console.log(`  🔴 Critical: ${auditReport.summary.criticalIssues}`);
    console.log(`  🟡 Warnings: ${auditReport.summary.warningIssues}`);
    console.log('='.repeat(80));
    
    // Print detailed report
    console.log('\n' + '='.repeat(80));
    console.log('📋 DETAILED FINDINGS');
    console.log('='.repeat(80) + '\n');
    
    auditReport.pageReports.forEach(report => {
      if (report.issues.length > 0) {
        console.log(`\n${'─'.repeat(80)}`);
        console.log(`📄 ${report.pageName}`);
        console.log(`${'─'.repeat(80)}`);
        
        report.issues.forEach(issue => {
          const icon = issue.severity === 'critical' ? '🔴' : '🟡';
          console.log(`${icon} [${issue.category}] ${issue.description}`);
          if (issue.expected) {
            console.log(`   Expected: ${issue.expected}`);
          }
          if (issue.actual) {
            console.log(`   Actual: ${issue.actual}`);
          }
          if (issue.recommendation) {
            console.log(`   💡 ${issue.recommendation}`);
          }
        });
      }
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ AUDIT COMPLETE');
    console.log('='.repeat(80) + '\n');
  });

  // Helper function to audit a page
  async function auditPage(page, pageInfo) {
    const report = {
      pageName: pageInfo.name,
      path: pageInfo.path,
      issues: [],
      checks: {
        navigation: { passed: 0, failed: 0 },
        visual: { passed: 0, failed: 0 },
        content: { passed: 0, failed: 0 },
        accessibility: { passed: 0, failed: 0 },
      },
    };

    try {
      console.log(`\n🔍 Auditing: ${pageInfo.name} (${pageInfo.path})`);
      
      // Navigate to page
      await page.goto(`http://localhost:8081${pageInfo.path}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      await page.waitForTimeout(2000); // Let animations settle

      // ============================================
      // 1. NAVIGATION CHECKS
      // ============================================
      console.log('  ├─ Checking navigation...');
      
      // Check for bottom nav bar (tabs only)
      if (pageInfo.hasBottomNav) {
        const bottomNav = await page.locator('[role="tablist"], [data-testid="tab-bar"]').count();
        if (bottomNav === 0) {
          report.issues.push({
            severity: 'critical',
            category: 'Navigation',
            description: 'Bottom navigation bar is missing',
            expected: 'Visible bottom tab bar with 5 tabs',
            actual: 'No tab bar found',
            recommendation: 'Ensure TabLayout is properly rendered and visible',
          });
          report.checks.navigation.failed++;
          auditReport.summary.criticalIssues++;
        } else {
          report.checks.navigation.passed++;
        }
      }

      // Check for back button (stack pages only)
      if (pageInfo.needsBackButton) {
        const backButton = await page.locator('button:has-text("Back"), [aria-label*="back" i], [aria-label*="close" i]').count();
        const backIcon = await page.locator('svg').filter({ hasText: /arrow|chevron|back/i }).count();
        
        if (backButton === 0 && backIcon === 0) {
          report.issues.push({
            severity: 'critical',
            category: 'Navigation',
            description: 'No back button or close button found',
            expected: 'Back button in header for navigation',
            actual: 'No navigation control found',
            recommendation: 'Add back button using router.back() or Link component',
          });
          report.checks.navigation.failed++;
          auditReport.summary.criticalIssues++;
        } else {
          report.checks.navigation.passed++;
        }
      }

      // ============================================
      // 2. VISUAL CONSISTENCY CHECKS
      // ============================================
      console.log('  ├─ Checking visual consistency...');
      
      // Check background color
      const bodyBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      
      // Convert rgb to hex for comparison
      const rgbToHex = (rgb) => {
        const match = rgb.match(/\d+/g);
        if (!match) return rgb;
        return '#' + match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
      };
      
      const bgHex = rgbToHex(bodyBg);
      const expectedBg = DESIGN_STANDARDS.colors.background.toUpperCase();
      
      if (bgHex !== expectedBg && bgHex !== '#FFFFFF') {
        report.issues.push({
          severity: 'warning',
          category: 'Visual',
          description: 'Background color does not match design system',
          expected: `${DESIGN_STANDARDS.colors.background} (Porcelain Grey)`,
          actual: bgHex,
          recommendation: 'Use PALETTE.background from DesignSystem.ts',
        });
        report.checks.visual.failed++;
        auditReport.summary.warningIssues++;
      } else {
        report.checks.visual.passed++;
      }

      // Check for cards/surfaces
      const cards = await page.locator('[class*="card"], [class*="Card"], [style*="background"]').all();
      console.log(`  │  └─ Found ${cards.length} card elements`);
      
      // Check for consistent border radius
      let inconsistentRadius = 0;
      for (const card of cards.slice(0, 5)) { // Check first 5 cards
        const borderRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
        const radiusValue = parseInt(borderRadius);
        
        // Should be one of: 12, 16, 20, 24
        if (radiusValue > 0 && ![12, 16, 20, 24].includes(radiusValue)) {
          inconsistentRadius++;
        }
      }
      
      if (inconsistentRadius > 0) {
        report.issues.push({
          severity: 'warning',
          category: 'Visual',
          description: `${inconsistentRadius} cards have non-standard border radius`,
          expected: 'Border radius should be 12, 16, 20, or 24px',
          recommendation: 'Use METRICS.radius from DesignSystem.ts',
        });
        report.checks.visual.failed++;
        auditReport.summary.warningIssues++;
      } else if (cards.length > 0) {
        report.checks.visual.passed++;
      }

      // ============================================
      // 3. TYPOGRAPHY CHECKS
      // ============================================
      console.log('  ├─ Checking typography...');
      
      const headings = await page.locator('h1, h2, h3, [class*="title"], [class*="Title"]').all();
      console.log(`  │  └─ Found ${headings.length} heading elements`);
      
      if (headings.length === 0 && !pageInfo.path.includes('landing')) {
        report.issues.push({
          severity: 'warning',
          category: 'Content',
          description: 'No page title or heading found',
          expected: 'Clear page title using TYPOGRAPHY.title1 or title2',
          recommendation: 'Add a prominent heading to establish page hierarchy',
        });
        report.checks.content.failed++;
        auditReport.summary.warningIssues++;
      } else {
        report.checks.content.passed++;
      }

      // ============================================
      // 4. CONTENT DENSITY CHECKS
      // ============================================
      console.log('  ├─ Checking content density...');
      
      const textContent = await page.evaluate(() => document.body.innerText);
      const wordCount = textContent.split(/\s+/).length;
      
      console.log(`  │  └─ Word count: ${wordCount}`);
      
      if (wordCount < 20 && !pageInfo.path.includes('landing')) {
        report.issues.push({
          severity: 'warning',
          category: 'Content',
          description: 'Page appears to have very little content',
          actual: `${wordCount} words`,
          recommendation: 'Consider adding more informative content, examples, or helpful text',
        });
        report.checks.content.failed++;
        auditReport.summary.warningIssues++;
      } else {
        report.checks.content.passed++;
      }

      // Check for interactive elements
      const buttons = await page.locator('button, [role="button"]').count();
      const links = await page.locator('a, [role="link"]').count();
      const inputs = await page.locator('input, textarea, select').count();
      
      console.log(`  │  └─ Interactive elements: ${buttons} buttons, ${links} links, ${inputs} inputs`);
      
      if (buttons === 0 && links === 0 && inputs === 0 && !pageInfo.path.includes('landing')) {
        report.issues.push({
          severity: 'warning',
          category: 'Content',
          description: 'No interactive elements found on page',
          recommendation: 'Add buttons, links, or other interactive elements',
        });
        report.checks.content.failed++;
        auditReport.summary.warningIssues++;
      } else {
        report.checks.content.passed++;
      }

      // ============================================
      // 5. SPACING & LAYOUT CHECKS
      // ============================================
      console.log('  ├─ Checking spacing & layout...');
      
      // Check for proper padding
      const mainContent = await page.locator('main, [role="main"], body > div').first();
      const padding = await mainContent.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          top: parseInt(style.paddingTop),
          right: parseInt(style.paddingRight),
          bottom: parseInt(style.paddingBottom),
          left: parseInt(style.paddingLeft),
        };
      });
      
      console.log(`  │  └─ Padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`);
      
      if (padding.left < 8 || padding.right < 8) {
        report.issues.push({
          severity: 'warning',
          category: 'Visual',
          description: 'Insufficient horizontal padding',
          expected: 'At least 16px horizontal padding',
          actual: `${padding.left}px / ${padding.right}px`,
          recommendation: 'Use SPACING.md (16px) for consistent page margins',
        });
        report.checks.visual.failed++;
        auditReport.summary.warningIssues++;
      } else {
        report.checks.visual.passed++;
      }

      // ============================================
      // 6. ACCESSIBILITY CHECKS
      // ============================================
      console.log('  ├─ Checking accessibility...');
      
      // Check for alt text on images
      const images = await page.locator('img').all();
      let missingAlt = 0;
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        if (!alt || alt.trim() === '') {
          missingAlt++;
        }
      }
      
      if (missingAlt > 0) {
        report.issues.push({
          severity: 'warning',
          category: 'Accessibility',
          description: `${missingAlt} images missing alt text`,
          recommendation: 'Add descriptive alt text to all images',
        });
        report.checks.accessibility.failed++;
        auditReport.summary.warningIssues++;
      } else if (images.length > 0) {
        report.checks.accessibility.passed++;
      }

      // Check for proper button labels
      const unlabeledButtons = await page.locator('button:not([aria-label]):not(:has-text(/\\w/))').count();
      if (unlabeledButtons > 0) {
        report.issues.push({
          severity: 'warning',
          category: 'Accessibility',
          description: `${unlabeledButtons} buttons without labels`,
          recommendation: 'Add aria-label or visible text to all buttons',
        });
        report.checks.accessibility.failed++;
        auditReport.summary.warningIssues++;
      } else {
        report.checks.accessibility.passed++;
      }

      // ============================================
      // 7. VISUAL RICHNESS CHECKS
      // ============================================
      console.log('  ├─ Checking visual richness...');
      
      // Check for charts/graphs
      const charts = await page.locator('svg[class*="chart"], canvas, [class*="Chart"]').count();
      console.log(`  │  └─ Charts/graphs: ${charts}`);
      
      // Check for icons
      const icons = await page.locator('svg:not([class*="chart"])').count();
      console.log(`  │  └─ Icons: ${icons}`);
      
      // Check for images
      console.log(`  │  └─ Images: ${images.length}`);
      
      const totalVisualElements = charts + icons + images.length;
      
      if (totalVisualElements < 3 && !pageInfo.path.includes('landing')) {
        report.issues.push({
          severity: 'warning',
          category: 'Visual',
          description: 'Page lacks visual richness',
          actual: `${totalVisualElements} visual elements (charts, icons, images)`,
          recommendation: 'Add charts, icons, or illustrations to enhance visual appeal',
        });
        report.checks.visual.failed++;
        auditReport.summary.warningIssues++;
      } else {
        report.checks.visual.passed++;
      }

      // ============================================
      // SUMMARY
      // ============================================
      const totalChecks = Object.values(report.checks).reduce((sum, cat) => sum + cat.passed + cat.failed, 0);
      const passedChecks = Object.values(report.checks).reduce((sum, cat) => sum + cat.passed, 0);
      const passRate = totalChecks > 0 ? ((passedChecks / totalChecks) * 100).toFixed(1) : 0;
      
      console.log(`  └─ ✅ Complete: ${passedChecks}/${totalChecks} checks passed (${passRate}%)`);
      console.log(`     Issues: ${report.issues.length} (${report.issues.filter(i => i.severity === 'critical').length} critical)`);
      
      auditReport.summary.pagesAudited++;
      auditReport.summary.issuesFound += report.issues.length;
      
    } catch (error) {
      console.log(`  └─ ❌ Error auditing page: ${error.message}`);
      report.issues.push({
        severity: 'critical',
        category: 'System',
        description: `Failed to audit page: ${error.message}`,
        recommendation: 'Check if page exists and loads correctly',
      });
      auditReport.summary.criticalIssues++;
    }

    auditReport.pageReports.push(report);
    return report;
  }

  // ============================================
  // TAB PAGES AUDIT
  // ============================================
  test('Audit all tab pages', async ({ page }) => {
    console.log('\n📱 AUDITING TAB PAGES (Bottom Navigation)');
    console.log('─'.repeat(80));
    
    for (const pageInfo of PAGES.tabs) {
      auditReport.summary.totalPages++;
      await auditPage(page, pageInfo);
    }
  });

  // ============================================
  // STACK PAGES AUDIT
  // ============================================
  test('Audit all stack pages', async ({ page }) => {
    console.log('\n📄 AUDITING STACK PAGES (Modal/Push Navigation)');
    console.log('─'.repeat(80));
    
    for (const pageInfo of PAGES.stack) {
      auditReport.summary.totalPages++;
      await auditPage(page, pageInfo);
    }
  });

  // ============================================
  // AUTH PAGES AUDIT
  // ============================================
  test('Audit all auth pages', async ({ page }) => {
    console.log('\n🔐 AUDITING AUTH PAGES');
    console.log('─'.repeat(80));
    
    for (const pageInfo of PAGES.auth) {
      auditReport.summary.totalPages++;
      await auditPage(page, pageInfo);
    }
  });

  // ============================================
  // FLOW TESTING
  // ============================================
  test('Test navigation flows', async ({ page }) => {
    console.log('\n🔄 TESTING NAVIGATION FLOWS');
    console.log('─'.repeat(80));
    
    const flows = [
      {
        name: 'Dashboard → Forecast → Back',
        steps: [
          { action: 'goto', path: '/' },
          { action: 'click', selector: 'text=/forecast/i' },
          { action: 'wait', ms: 1000 },
          { action: 'click', selector: '[aria-label*="back" i]' },
        ],
      },
      {
        name: 'Tools → Estimate → Back',
        steps: [
          { action: 'goto', path: '/tools' },
          { action: 'click', selector: 'text=/estimate/i' },
          { action: 'wait', ms: 1000 },
          { action: 'click', selector: '[aria-label*="back" i]' },
        ],
      },
      {
        name: 'Profile → Settings → Back',
        steps: [
          { action: 'goto', path: '/profile' },
          { action: 'click', selector: 'text=/settings/i' },
          { action: 'wait', ms: 1000 },
          { action: 'click', selector: '[aria-label*="back" i]' },
        ],
      },
    ];

    for (const flow of flows) {
      console.log(`\n  Testing: ${flow.name}`);
      try {
        for (const step of flow.steps) {
          if (step.action === 'goto') {
            await page.goto(`http://localhost:8081${step.path}`);
          } else if (step.action === 'click') {
            await page.locator(step.selector).first().click();
          } else if (step.action === 'wait') {
            await page.waitForTimeout(step.ms);
          }
        }
        console.log(`  ✅ Flow completed successfully`);
      } catch (error) {
        console.log(`  ❌ Flow failed: ${error.message}`);
        auditReport.pageReports.push({
          pageName: `Flow: ${flow.name}`,
          path: 'N/A',
          issues: [{
            severity: 'critical',
            category: 'Navigation',
            description: `Navigation flow failed: ${error.message}`,
            recommendation: 'Ensure all navigation links and back buttons work correctly',
          }],
          checks: {},
        });
        auditReport.summary.criticalIssues++;
        auditReport.summary.issuesFound++;
      }
    }
  });

  // ============================================
  // BOTTOM NAV VISIBILITY TEST
  // ============================================
  test('Verify bottom nav visibility across tabs', async ({ page }) => {
    console.log('\n📍 TESTING BOTTOM NAV VISIBILITY');
    console.log('─'.repeat(80));
    
    for (const pageInfo of PAGES.tabs) {
      await page.goto(`http://localhost:8081${pageInfo.path}`);
      await page.waitForTimeout(1000);
      
      const tabBar = await page.locator('[role="tablist"], [data-testid="tab-bar"]').first();
      const isVisible = await tabBar.isVisible().catch(() => false);
      
      if (!isVisible) {
        console.log(`  ❌ ${pageInfo.name}: Bottom nav NOT visible`);
        auditReport.pageReports.push({
          pageName: `${pageInfo.name} - Bottom Nav`,
          path: pageInfo.path,
          issues: [{
            severity: 'critical',
            category: 'Navigation',
            description: 'Bottom navigation bar not visible on tab page',
            expected: 'Visible floating tab bar at bottom',
            recommendation: 'Check TabLayout rendering and z-index',
          }],
          checks: {},
        });
        auditReport.summary.criticalIssues++;
        auditReport.summary.issuesFound++;
      } else {
        console.log(`  ✅ ${pageInfo.name}: Bottom nav visible`);
      }
    }
  });
});
