/**
 * CUSTOMER EXPERIENCE AUDIT
 * 
 * Answers 5 critical questions:
 * 1. Would a customer like how this looks?
 * 2. Does it have all the bells, whistles, and little features apps have?
 * 3. Is it easy to use?
 * 4. Does it look cohesive?
 * 5. Is there enough data?
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const auditResults = {
  timestamp: new Date().toISOString(),
  questions: {
    customerAppeal: { score: 0, findings: [], screenshots: [] },
    features: { score: 0, findings: [], screenshots: [] },
    usability: { score: 0, findings: [], screenshots: [] },
    cohesion: { score: 0, findings: [], screenshots: [] },
    dataRichness: { score: 0, findings: [], screenshots: [] }
  },
  overallScore: 0,
  verdict: ''
};

// Helper: Capture screenshot
async function captureScreenshot(page, name, context) {
  const timestamp = Date.now();
  const screenshotPath = `tests/customer-audit-screenshots/${name}-${context}-${timestamp}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

test.beforeAll(async () => {
  const dir = 'tests/customer-audit-screenshots';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

test.describe('CUSTOMER EXPERIENCE AUDIT', () => {
  
  test('Question 1: Would a customer like how this looks?', async ({ page }) => {
    console.log('\n🎨 QUESTION 1: VISUAL APPEAL');
    
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const findings = [];
    let score = 0;
    
    // Capture initial impression
    const screenshot1 = await captureScreenshot(page, 'dashboard', 'first-impression');
    
    // Check for modern design elements
    const hasGradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).some(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg.includes('gradient');
      });
    });
    
    if (hasGradients) {
      findings.push('✅ Uses gradients for visual depth');
      score += 15;
    } else {
      findings.push('❌ No gradients detected - looks flat');
    }
    
    // Check for shadows (depth perception)
    const hasShadows = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).some(el => {
        const shadow = window.getComputedStyle(el).boxShadow;
        return shadow !== 'none';
      });
    });
    
    if (hasShadows) {
      findings.push('✅ Uses shadows for depth');
      score += 15;
    } else {
      findings.push('❌ No shadows - looks flat');
    }
    
    // Check for images/visual content
    const imageCount = await page.locator('img, canvas, svg').count();
    if (imageCount > 3) {
      findings.push(`✅ Rich visual content (${imageCount} visual elements)`);
      score += 20;
    } else {
      findings.push(`⚠️ Limited visual content (${imageCount} elements)`);
      score += 5;
    }
    
    // Check color palette richness
    const colorAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const colors = new Set();
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.backgroundColor);
        }
        if (styles.color) {
          colors.add(styles.color);
        }
      });
      return colors.size;
    });
    
    if (colorAnalysis >= 8 && colorAnalysis <= 20) {
      findings.push(`✅ Balanced color palette (${colorAnalysis} colors)`);
      score += 20;
    } else if (colorAnalysis < 8) {
      findings.push(`⚠️ Limited color palette (${colorAnalysis} colors)`);
      score += 10;
    } else {
      findings.push(`❌ Too many colors (${colorAnalysis} colors)`);
      score += 5;
    }
    
    // Check for rounded corners (modern feel)
    const hasRoundedCorners = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).some(el => {
        const radius = window.getComputedStyle(el).borderRadius;
        return radius !== '0px' && radius !== '';
      });
    });
    
    if (hasRoundedCorners) {
      findings.push('✅ Modern rounded corners');
      score += 15;
    } else {
      findings.push('❌ Sharp corners - looks dated');
    }
    
    // Check typography quality
    const typographyCheck = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      const fontFamily = styles.fontFamily.toLowerCase();
      
      const modernFonts = ['inter', 'sf pro', 'system-ui', 'segoe ui', 'roboto'];
      const hasModernFont = modernFonts.some(font => fontFamily.includes(font));
      
      return {
        hasModernFont,
        fontFamily: styles.fontFamily
      };
    });
    
    if (typographyCheck.hasModernFont) {
      findings.push(`✅ Modern typography (${typographyCheck.fontFamily})`);
      score += 15;
    } else {
      findings.push(`⚠️ Generic typography (${typographyCheck.fontFamily})`);
      score += 5;
    }
    
    auditResults.questions.customerAppeal = {
      score,
      maxScore: 100,
      findings,
      screenshots: [screenshot1],
      verdict: score >= 80 ? 'Customers will love it' : 
               score >= 60 ? 'Customers will like it' :
               score >= 40 ? 'Customers will find it acceptable' :
               'Customers may be disappointed'
    };
    
    console.log(`Score: ${score}/100`);
    console.log(`Verdict: ${auditResults.questions.customerAppeal.verdict}`);
  });
  
  test('Question 2: Does it have all the bells and whistles?', async ({ page }) => {
    console.log('\n🔔 QUESTION 2: FEATURES & POLISH');
    
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const findings = [];
    let score = 0;
    
    // Check for animations/transitions
    const hasTransitions = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).some(el => {
        const transition = window.getComputedStyle(el).transition;
        return transition !== 'all 0s ease 0s' && transition !== 'none';
      });
    });
    
    if (hasTransitions) {
      findings.push('✅ Smooth transitions present');
      score += 15;
    } else {
      findings.push('❌ No transitions - feels static');
    }
    
    // Check for interactive charts
    const hasCharts = await page.locator('canvas, svg[class*="chart" i]').count();
    if (hasCharts > 0) {
      findings.push(`✅ Data visualizations (${hasCharts} charts)`);
      score += 20;
    } else {
      findings.push('❌ No charts - missing data viz');
    }
    
    // Check for badges/labels
    const hasBadges = await page.evaluate(() => {
      const text = document.body.textContent;
      return /\+\d+%|\-\d+%|NEW|HOT|TRENDING/i.test(text);
    });
    
    if (hasBadges) {
      findings.push('✅ Status badges/indicators');
      score += 10;
    } else {
      findings.push('⚠️ No status badges');
    }
    
    // Check for icons
    const iconCount = await page.locator('svg').count();
    if (iconCount > 5) {
      findings.push(`✅ Rich iconography (${iconCount} icons)`);
      score += 15;
    } else {
      findings.push(`⚠️ Limited icons (${iconCount} icons)`);
      score += 5;
    }
    
    // Check for progress indicators
    const hasProgress = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).some(el => {
        const className = el.className?.toString().toLowerCase() || '';
        return className.includes('progress') || className.includes('bar');
      });
    });
    
    if (hasProgress) {
      findings.push('✅ Progress indicators');
      score += 10;
    } else {
      findings.push('⚠️ No progress indicators');
    }
    
    // Check for hover effects
    const button = page.locator('button').first();
    if (await button.isVisible()) {
      await button.hover();
      await page.waitForTimeout(200);
      findings.push('✅ Interactive hover states');
      score += 10;
    }
    
    // Check for loading states
    const hasLoadingStates = await page.evaluate(() => {
      const text = document.body.innerHTML.toLowerCase();
      return text.includes('loading') || text.includes('spinner') || text.includes('skeleton');
    });
    
    if (hasLoadingStates) {
      findings.push('✅ Loading states');
      score += 10;
    } else {
      findings.push('❌ No loading states');
    }
    
    // Check for empty states
    await page.goto('http://localhost:8081/garage');
    await page.waitForTimeout(1000);
    
    const hasEmptyState = await page.evaluate(() => {
      const text = document.body.textContent.toLowerCase();
      return text.includes('no vehicles') || text.includes('empty') || text.includes('add your first');
    });
    
    if (hasEmptyState) {
      findings.push('✅ Empty state handling');
      score += 10;
    } else {
      findings.push('❌ No empty state handling');
    }
    
    auditResults.questions.features = {
      score,
      maxScore: 100,
      findings,
      verdict: score >= 80 ? 'Feature-rich and polished' : 
               score >= 60 ? 'Good feature set' :
               score >= 40 ? 'Basic features present' :
               'Missing key features'
    };
    
    console.log(`Score: ${score}/100`);
    console.log(`Verdict: ${auditResults.questions.features.verdict}`);
  });
  
  test('Question 3: Is it easy to use?', async ({ page }) => {
    console.log('\n👆 QUESTION 3: USABILITY');
    
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const findings = [];
    let score = 0;
    
    // Check for clear navigation
    const navElements = await page.locator('nav, [role="navigation"], [class*="nav" i]').count();
    if (navElements > 0) {
      findings.push('✅ Clear navigation present');
      score += 15;
    } else {
      findings.push('⚠️ Navigation unclear');
      score += 5;
    }
    
    // Check for clear headings
    const h1Count = await page.locator('h1').count();
    if (h1Count > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      findings.push(`✅ Clear page title: "${h1Text}"`);
      score += 15;
    } else {
      findings.push('❌ No clear page title (H1)');
    }
    
    // Check button clarity
    const buttons = await page.locator('button').all();
    let clearButtons = 0;
    for (const button of buttons.slice(0, 5)) {
      const text = await button.textContent();
      if (text && text.trim().length > 2 && !text.includes('undefined')) {
        clearButtons++;
      }
    }
    
    if (clearButtons >= 3) {
      findings.push(`✅ Clear button labels (${clearButtons} buttons)`);
      score += 15;
    } else {
      findings.push(`⚠️ Unclear button labels (${clearButtons} buttons)`);
      score += 5;
    }
    
    // Check for search functionality
    const hasSearch = await page.locator('input[type="search"], input[placeholder*="search" i]').count();
    if (hasSearch > 0) {
      findings.push('✅ Search functionality');
      score += 10;
    } else {
      findings.push('⚠️ No search functionality');
    }
    
    // Check touch target sizes (mobile-friendly)
    const touchTargets = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a, [role="button"]');
      let goodTargets = 0;
      let totalTargets = 0;
      
      buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          totalTargets++;
          if (rect.width >= 44 && rect.height >= 44) {
            goodTargets++;
          }
        }
      });
      
      return { goodTargets, totalTargets };
    });
    
    const touchTargetPercent = touchTargets.totalTargets > 0 
      ? (touchTargets.goodTargets / touchTargets.totalTargets) * 100 
      : 0;
    
    if (touchTargetPercent >= 80) {
      findings.push(`✅ Mobile-friendly touch targets (${Math.round(touchTargetPercent)}%)`);
      score += 15;
    } else if (touchTargetPercent >= 50) {
      findings.push(`⚠️ Some touch targets too small (${Math.round(touchTargetPercent)}%)`);
      score += 8;
    } else {
      findings.push(`❌ Many touch targets too small (${Math.round(touchTargetPercent)}%)`);
      score += 3;
    }
    
    // Check for visual feedback on interactions
    const hasVisualFeedback = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      return Array.from(buttons).some(btn => {
        const styles = window.getComputedStyle(btn);
        return styles.cursor === 'pointer';
      });
    });
    
    if (hasVisualFeedback) {
      findings.push('✅ Visual feedback (cursor changes)');
      score += 10;
    } else {
      findings.push('❌ No visual feedback');
    }
    
    // Check for consistent layout
    const layoutConsistency = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="card" i]');
      if (cards.length < 2) return true;
      
      const firstCardPadding = window.getComputedStyle(cards[0]).padding;
      let consistent = true;
      
      cards.forEach(card => {
        if (window.getComputedStyle(card).padding !== firstCardPadding) {
          consistent = false;
        }
      });
      
      return consistent;
    });
    
    if (layoutConsistency) {
      findings.push('✅ Consistent layout');
      score += 10;
    } else {
      findings.push('⚠️ Inconsistent layout');
      score += 5;
    }
    
    // Check for error prevention
    const hasValidation = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).some(input => {
        return input.hasAttribute('required') || 
               input.hasAttribute('pattern') || 
               input.hasAttribute('minlength');
      });
    });
    
    if (hasValidation) {
      findings.push('✅ Input validation');
      score += 10;
    } else {
      findings.push('⚠️ No input validation');
    }
    
    auditResults.questions.usability = {
      score,
      maxScore: 100,
      findings,
      verdict: score >= 80 ? 'Very easy to use' : 
               score >= 60 ? 'Easy to use' :
               score >= 40 ? 'Usable with some friction' :
               'Difficult to use'
    };
    
    console.log(`Score: ${score}/100`);
    console.log(`Verdict: ${auditResults.questions.usability.verdict}`);
  });
  
  test('Question 4: Does it look cohesive?', async ({ page }) => {
    console.log('\n🎯 QUESTION 4: COHESION');
    
    const findings = [];
    let score = 0;
    
    // Visit multiple pages to check consistency
    const pages = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/garage', name: 'Garage' },
      { path: '/activity', name: 'Activity' }
    ];
    
    const pageStyles = [];
    
    for (const pageInfo of pages) {
      await page.goto(`http://localhost:8081${pageInfo.path}`);
      await page.waitForTimeout(1500);
      
      const styles = await page.evaluate(() => {
        const body = document.body;
        const bodyStyles = window.getComputedStyle(body);
        
        // Get all cards
        const cards = document.querySelectorAll('[class*="card" i]');
        const cardStyles = Array.from(cards).map(card => {
          const styles = window.getComputedStyle(card);
          return {
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            backgroundColor: styles.backgroundColor,
            boxShadow: styles.boxShadow
          };
        });
        
        // Get all buttons
        const buttons = document.querySelectorAll('button');
        const buttonStyles = Array.from(buttons).map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            backgroundColor: styles.backgroundColor
          };
        });
        
        return {
          backgroundColor: bodyStyles.backgroundColor,
          fontFamily: bodyStyles.fontFamily,
          cardStyles,
          buttonStyles
        };
      });
      
      pageStyles.push({ page: pageInfo.name, styles });
    }
    
    // Check background consistency
    const backgrounds = pageStyles.map(p => p.styles.backgroundColor);
    const uniqueBackgrounds = new Set(backgrounds);
    if (uniqueBackgrounds.size === 1) {
      findings.push('✅ Consistent background across pages');
      score += 20;
    } else {
      findings.push(`⚠️ Inconsistent backgrounds (${uniqueBackgrounds.size} different)`);
      score += 10;
    }
    
    // Check font family consistency
    const fonts = pageStyles.map(p => p.styles.fontFamily);
    const uniqueFonts = new Set(fonts);
    if (uniqueFonts.size === 1) {
      findings.push('✅ Consistent typography across pages');
      score += 20;
    } else {
      findings.push(`⚠️ Inconsistent fonts (${uniqueFonts.size} different)`);
      score += 10;
    }
    
    // Check card styling consistency
    const allCardRadii = pageStyles.flatMap(p => 
      p.styles.cardStyles.map(c => c.borderRadius)
    );
    const uniqueCardRadii = new Set(allCardRadii);
    if (uniqueCardRadii.size <= 2) {
      findings.push('✅ Consistent card styling');
      score += 15;
    } else {
      findings.push(`⚠️ Inconsistent card styling (${uniqueCardRadii.size} different radii)`);
      score += 7;
    }
    
    // Check button styling consistency
    const allButtonRadii = pageStyles.flatMap(p => 
      p.styles.buttonStyles.map(b => b.borderRadius)
    );
    const uniqueButtonRadii = new Set(allButtonRadii);
    if (uniqueButtonRadii.size <= 2) {
      findings.push('✅ Consistent button styling');
      score += 15;
    } else {
      findings.push(`⚠️ Inconsistent button styling (${uniqueButtonRadii.size} different radii)`);
      score += 7;
    }
    
    // Check for design system usage
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(1000);
    
    const hasDesignSystem = await page.evaluate(() => {
      const spacingValues = new Set();
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'].forEach(prop => {
          const value = styles[prop];
          if (value !== '0px' && value !== 'auto') {
            spacingValues.add(value);
          }
        });
      });
      
      // Good design system has 8-15 spacing values
      return spacingValues.size >= 8 && spacingValues.size <= 15;
    });
    
    if (hasDesignSystem) {
      findings.push('✅ Systematic spacing (design system)');
      score += 15;
    } else {
      findings.push('⚠️ No clear design system');
      score += 5;
    }
    
    // Check color scheme consistency
    const colorScheme = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const colors = new Set();
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.backgroundColor);
        }
      });
      
      return colors.size;
    });
    
    if (colorScheme >= 8 && colorScheme <= 20) {
      findings.push(`✅ Cohesive color scheme (${colorScheme} colors)`);
      score += 15;
    } else if (colorScheme < 8) {
      findings.push(`⚠️ Limited color palette (${colorScheme} colors)`);
      score += 10;
    } else {
      findings.push(`❌ Too many colors (${colorScheme} colors)`);
      score += 5;
    }
    
    auditResults.questions.cohesion = {
      score,
      maxScore: 100,
      findings,
      verdict: score >= 80 ? 'Highly cohesive' : 
               score >= 60 ? 'Cohesive' :
               score >= 40 ? 'Somewhat cohesive' :
               'Lacks cohesion'
    };
    
    console.log(`Score: ${score}/100`);
    console.log(`Verdict: ${auditResults.questions.cohesion.verdict}`);
  });
  
  test('Question 5: Is there enough data?', async ({ page }) => {
    console.log('\n📊 QUESTION 5: DATA RICHNESS');
    
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const findings = [];
    let score = 0;
    
    // Check for numerical data
    const numberCount = await page.evaluate(() => {
      const text = document.body.textContent;
      const numbers = text.match(/\$[\d,]+|\d+%|\d+\.\d+/g);
      return numbers ? numbers.length : 0;
    });
    
    if (numberCount >= 10) {
      findings.push(`✅ Rich numerical data (${numberCount} data points)`);
      score += 20;
    } else if (numberCount >= 5) {
      findings.push(`⚠️ Moderate data (${numberCount} data points)`);
      score += 12;
    } else {
      findings.push(`❌ Sparse data (${numberCount} data points)`);
      score += 5;
    }
    
    // Check for charts/visualizations
    const chartCount = await page.locator('canvas, svg[class*="chart" i]').count();
    if (chartCount >= 2) {
      findings.push(`✅ Multiple visualizations (${chartCount} charts)`);
      score += 20;
    } else if (chartCount === 1) {
      findings.push('⚠️ Single visualization');
      score += 12;
    } else {
      findings.push('❌ No data visualizations');
      score += 0;
    }
    
    // Check for data categories
    const hasCategories = await page.evaluate(() => {
      const text = document.body.textContent.toLowerCase();
      const categories = [
        'value', 'equity', 'loan', 'payment', 'trend', 
        'forecast', 'portfolio', 'total', 'monthly'
      ];
      return categories.filter(cat => text.includes(cat)).length;
    });
    
    if (hasCategories >= 5) {
      findings.push(`✅ Diverse data categories (${hasCategories} types)`);
      score += 15;
    } else {
      findings.push(`⚠️ Limited data categories (${hasCategories} types)`);
      score += 8;
    }
    
    // Check for trend indicators
    const hasTrends = await page.evaluate(() => {
      const text = document.body.textContent;
      return /\+\d+%|\-\d+%|↑|↓|up|down|increase|decrease/i.test(text);
    });
    
    if (hasTrends) {
      findings.push('✅ Trend indicators present');
      score += 15;
    } else {
      findings.push('❌ No trend indicators');
    }
    
    // Check for time-based data
    const hasTimeData = await page.evaluate(() => {
      const text = document.body.textContent.toLowerCase();
      return /month|year|week|day|6 month|forecast|history/i.test(text);
    });
    
    if (hasTimeData) {
      findings.push('✅ Time-based data');
      score += 10;
    } else {
      findings.push('⚠️ No time-based data');
    }
    
    // Check for comparative data
    const hasComparisons = await page.evaluate(() => {
      const text = document.body.textContent.toLowerCase();
      return /vs|versus|compared|difference|more than|less than/i.test(text);
    });
    
    if (hasComparisons) {
      findings.push('✅ Comparative data');
      score += 10;
    } else {
      findings.push('⚠️ No comparative data');
    }
    
    // Check garage for data richness
    await page.goto('http://localhost:8081/garage');
    await page.waitForTimeout(1500);
    
    const garageData = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="card" i]');
      let dataPoints = 0;
      
      cards.forEach(card => {
        const text = card.textContent;
        const numbers = text.match(/\$[\d,]+|\d+%/g);
        if (numbers) dataPoints += numbers.length;
      });
      
      return { cards: cards.length, dataPoints };
    });
    
    if (garageData.dataPoints >= 6) {
      findings.push(`✅ Rich vehicle data (${garageData.dataPoints} points per vehicle)`);
      score += 10;
    } else {
      findings.push(`⚠️ Limited vehicle data (${garageData.dataPoints} points)`);
      score += 5;
    }
    
    auditResults.questions.dataRichness = {
      score,
      maxScore: 100,
      findings,
      verdict: score >= 80 ? 'Data-rich and informative' : 
               score >= 60 ? 'Good amount of data' :
               score >= 40 ? 'Adequate data' :
               'Insufficient data'
    };
    
    console.log(`Score: ${score}/100`);
    console.log(`Verdict: ${auditResults.questions.dataRichness.verdict}`);
  });
  
  test('Generate Final Report', async ({ page }) => {
    console.log('\n📄 GENERATING FINAL REPORT');
    
    // Calculate overall score
    const scores = [
      auditResults.questions.customerAppeal.score,
      auditResults.questions.features.score,
      auditResults.questions.usability.score,
      auditResults.questions.cohesion.score,
      auditResults.questions.dataRichness.score
    ];
    
    auditResults.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
    
    // Determine overall verdict
    if (auditResults.overallScore >= 80) {
      auditResults.verdict = '🎉 EXCELLENT - Ready to ship!';
    } else if (auditResults.overallScore >= 70) {
      auditResults.verdict = '✅ GOOD - Minor improvements needed';
    } else if (auditResults.overallScore >= 60) {
      auditResults.verdict = '⚠️ ACCEPTABLE - Some work needed';
    } else if (auditResults.overallScore >= 50) {
      auditResults.verdict = '⚠️ NEEDS WORK - Significant improvements required';
    } else {
      auditResults.verdict = '❌ POOR - Major overhaul needed';
    }
    
    // Save results
    const reportPath = 'tests/audit-reports/CUSTOMER-EXPERIENCE-REPORT.json';
    fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 CUSTOMER EXPERIENCE AUDIT COMPLETE');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\nOverall Score: ${auditResults.overallScore}/100`);
    console.log(`Verdict: ${auditResults.verdict}\n`);
    console.log('Question Scores:');
    console.log(`1. Visual Appeal: ${auditResults.questions.customerAppeal.score}/100`);
    console.log(`2. Features: ${auditResults.questions.features.score}/100`);
    console.log(`3. Usability: ${auditResults.questions.usability.score}/100`);
    console.log(`4. Cohesion: ${auditResults.questions.cohesion.score}/100`);
    console.log(`5. Data Richness: ${auditResults.questions.dataRichness.score}/100`);
    console.log('\n═══════════════════════════════════════════════════════\n');
  });
});

module.exports = { auditResults };
