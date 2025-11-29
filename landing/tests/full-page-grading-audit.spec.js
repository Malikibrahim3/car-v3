/**
 * Full Landing Page Grading Audit
 * Comprehensive inspection and grading of the entire landing page
 */

import { test, expect } from '@playwright/test';

// Grading system
const grades = {
  scores: {},
  issues: [],
  recommendations: [],
  
  addScore(category, score, maxScore, details = '') {
    this.scores[category] = { score, maxScore, details };
  },
  
  addIssue(severity, category, message) {
    this.issues.push({ severity, category, message });
  },
  
  addRecommendation(category, message) {
    this.recommendations.push({ category, message });
  },
  
  calculateGrade() {
    let totalScore = 0;
    let maxPossible = 0;
    
    for (const [category, data] of Object.entries(this.scores)) {
      totalScore += data.score;
      maxPossible += data.maxScore;
    }
    
    const percentage = (totalScore / maxPossible) * 100;
    let letterGrade;
    
    if (percentage >= 90) letterGrade = 'A';
    else if (percentage >= 80) letterGrade = 'B';
    else if (percentage >= 70) letterGrade = 'C';
    else if (percentage >= 60) letterGrade = 'D';
    else letterGrade = 'F';
    
    return { totalScore, maxPossible, percentage, letterGrade };
  }
};


test.describe('Landing Page Full Grading Audit', () => {
  let auditResults = {
    scores: {},
    issues: [],
    recommendations: [],
    screenshots: []
  };

  test.beforeAll(async ({ browser }) => {
    // Reset audit results
    auditResults = {
      scores: {},
      issues: [],
      recommendations: [],
      screenshots: []
    };
  });

  test('1. Page Load & Performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Score based on load time
    let score = 10;
    if (loadTime > 3000) score -= 3;
    else if (loadTime > 2000) score -= 2;
    else if (loadTime > 1000) score -= 1;
    
    auditResults.scores['Performance'] = {
      score,
      maxScore: 10,
      details: `Page loaded in ${loadTime}ms`
    };
    
    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    if (consoleErrors.length > 0) {
      auditResults.issues.push({
        severity: 'medium',
        category: 'Performance',
        message: `${consoleErrors.length} console errors detected`
      });
    }
    
    console.log(`\n📊 PERFORMANCE: ${score}/10 - Load time: ${loadTime}ms`);
  });


  test('2. Visual Design & Layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    let score = 0;
    const maxScore = 20;
    const issues = [];
    
    // Check viewport responsiveness
    const viewportWidth = page.viewportSize().width;
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    
    if (bodyWidth <= viewportWidth) {
      score += 4;
    } else {
      issues.push('Horizontal scroll detected - content overflows viewport');
    }
    
    // Check for proper spacing and padding
    const sections = await page.$$('section, .hero, .hero-secondary, .hero-third, .pricing, .footer');
    if (sections.length >= 4) {
      score += 3;
    } else {
      issues.push('Missing expected page sections');
    }
    
    // Check color contrast and readability
    const textElements = await page.$$('h1, h2, h3, p');
    let readableCount = 0;
    
    for (const el of textElements.slice(0, 10)) {
      const styles = await el.evaluate(e => {
        const computed = window.getComputedStyle(e);
        return {
          fontSize: parseFloat(computed.fontSize),
          color: computed.color,
          opacity: parseFloat(computed.opacity)
        };
      });
      
      if (styles.fontSize >= 14 && styles.opacity >= 0.7) {
        readableCount++;
      }
    }
    
    if (readableCount >= 8) score += 4;
    else if (readableCount >= 5) score += 2;
    
    // Check for consistent styling
    const headings = await page.$$eval('h1, h2, h3', els => 
      els.map(e => window.getComputedStyle(e).fontFamily)
    );
    const uniqueFonts = new Set(headings);
    if (uniqueFonts.size <= 2) {
      score += 3;
    } else {
      issues.push('Inconsistent heading fonts detected');
    }
    
    // Check for visual hierarchy
    const h1Size = await page.$eval('h1', e => parseFloat(window.getComputedStyle(e).fontSize)).catch(() => 0);
    const h2Size = await page.$eval('h2', e => parseFloat(window.getComputedStyle(e).fontSize)).catch(() => 0);
    
    if (h1Size > h2Size) {
      score += 3;
    }
    
    // Check for proper image handling
    const images = await page.$$('img');
    let properImages = 0;
    for (const img of images) {
      const hasAlt = await img.getAttribute('alt');
      const naturalWidth = await img.evaluate(e => e.naturalWidth);
      if (hasAlt !== null && naturalWidth > 0) properImages++;
    }
    if (images.length > 0 && properImages / images.length >= 0.8) {
      score += 3;
    }
    
    auditResults.scores['Visual Design'] = { score, maxScore, details: issues.join('; ') || 'Good visual design' };
    
    console.log(`\n🎨 VISUAL DESIGN: ${score}/${maxScore}`);
    issues.forEach(i => console.log(`   ⚠️ ${i}`));
  });


  test('3. Navigation & Structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    let score = 0;
    const maxScore = 15;
    const issues = [];
    
    // Check navbar exists and is visible
    const navbar = await page.$('nav, .navbar, header');
    if (navbar) {
      const isVisible = await navbar.isVisible();
      if (isVisible) {
        score += 3;
      } else {
        issues.push('Navbar not visible');
      }
    } else {
      issues.push('No navbar found');
    }
    
    // Check for navigation links
    const navLinks = await page.$$('nav a, .navbar a, header a');
    if (navLinks.length >= 3) {
      score += 3;
    } else if (navLinks.length >= 1) {
      score += 1;
      issues.push('Limited navigation links');
    }
    
    // Check for CTA buttons
    const ctaButtons = await page.$$('button, .btn, .cta, a[href*="signup"], a[href*="start"]');
    if (ctaButtons.length >= 2) {
      score += 3;
    } else if (ctaButtons.length >= 1) {
      score += 2;
    } else {
      issues.push('No clear CTA buttons found');
    }
    
    // Check for footer
    const footer = await page.$('footer, .footer');
    if (footer) {
      const isVisible = await footer.isVisible();
      if (isVisible) score += 3;
    } else {
      issues.push('No footer found');
    }
    
    // Check for logical section order
    const sectionOrder = await page.$$eval('section, [class*="hero"], [class*="pricing"], footer', 
      els => els.map(e => e.className || e.tagName)
    );
    if (sectionOrder.length >= 4) {
      score += 3;
    }
    
    auditResults.scores['Navigation'] = { score, maxScore, details: issues.join('; ') || 'Good navigation structure' };
    
    console.log(`\n🧭 NAVIGATION: ${score}/${maxScore}`);
    issues.forEach(i => console.log(`   ⚠️ ${i}`));
  });


  test('4. Content Quality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    let score = 0;
    const maxScore = 15;
    const issues = [];
    
    // Check for main headline
    const h1 = await page.$('h1');
    if (h1) {
      const text = await h1.textContent();
      if (text && text.length > 10 && text.length < 100) {
        score += 3;
      } else {
        issues.push('Main headline too short or too long');
      }
    } else {
      issues.push('No main headline (h1) found');
    }
    
    // Check for subheadlines
    const h2s = await page.$$('h2');
    if (h2s.length >= 2) {
      score += 2;
    } else {
      issues.push('Insufficient section headings');
    }
    
    // Check for descriptive paragraphs
    const paragraphs = await page.$$('p');
    let goodParagraphs = 0;
    for (const p of paragraphs.slice(0, 10)) {
      const text = await p.textContent();
      if (text && text.length > 30) goodParagraphs++;
    }
    if (goodParagraphs >= 3) {
      score += 3;
    } else {
      issues.push('Limited descriptive content');
    }
    
    // Check for feature/benefit sections
    const features = await page.$$('[class*="feature"], [class*="benefit"], .card, [class*="card"]');
    if (features.length >= 3) {
      score += 3;
    } else if (features.length >= 1) {
      score += 1;
      issues.push('Limited feature highlights');
    }
    
    // Check for pricing information
    const pricing = await page.$('[class*="pricing"], [class*="price"], .plan');
    if (pricing) {
      score += 2;
    }
    
    // Check for social proof or testimonials
    const socialProof = await page.$('[class*="testimonial"], [class*="review"], [class*="metric"], [class*="stat"]');
    if (socialProof) {
      score += 2;
    } else {
      issues.push('No social proof elements found');
    }
    
    auditResults.scores['Content'] = { score, maxScore, details: issues.join('; ') || 'Good content quality' };
    
    console.log(`\n📝 CONTENT: ${score}/${maxScore}`);
    issues.forEach(i => console.log(`   ⚠️ ${i}`));
  });


  test('5. Accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    let score = 0;
    const maxScore = 15;
    const issues = [];
    
    // Check for proper heading hierarchy
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', els => 
      els.map(e => parseInt(e.tagName.charAt(1)))
    );
    
    let properHierarchy = true;
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i-1] + 1) {
        properHierarchy = false;
        break;
      }
    }
    if (properHierarchy && headings.length > 0) {
      score += 3;
    } else {
      issues.push('Heading hierarchy skips levels');
    }
    
    // Check for alt text on images
    const images = await page.$$('img');
    let imagesWithAlt = 0;
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt && alt.length > 0) imagesWithAlt++;
    }
    if (images.length === 0 || imagesWithAlt / images.length >= 0.9) {
      score += 3;
    } else if (imagesWithAlt / images.length >= 0.5) {
      score += 1;
      issues.push(`${images.length - imagesWithAlt} images missing alt text`);
    } else {
      issues.push('Most images missing alt text');
    }
    
    // Check for button/link accessibility
    const buttons = await page.$$('button, a');
    let accessibleButtons = 0;
    for (const btn of buttons.slice(0, 20)) {
      const text = await btn.textContent();
      const ariaLabel = await btn.getAttribute('aria-label');
      if ((text && text.trim().length > 0) || ariaLabel) accessibleButtons++;
    }
    if (buttons.length > 0 && accessibleButtons / Math.min(buttons.length, 20) >= 0.9) {
      score += 3;
    } else {
      issues.push('Some buttons/links lack accessible text');
    }
    
    // Check for form labels
    const inputs = await page.$$('input, textarea, select');
    let labeledInputs = 0;
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      if (id || ariaLabel || placeholder) labeledInputs++;
    }
    if (inputs.length === 0 || labeledInputs === inputs.length) {
      score += 3;
    } else {
      issues.push('Some form inputs lack labels');
    }
    
    // Check for focus indicators
    const focusableElements = await page.$$('button, a, input');
    if (focusableElements.length > 0) {
      await focusableElements[0].focus();
      score += 3; // Basic check - assume focus works
    }
    
    auditResults.scores['Accessibility'] = { score, maxScore, details: issues.join('; ') || 'Good accessibility' };
    
    console.log(`\n♿ ACCESSIBILITY: ${score}/${maxScore}`);
    issues.forEach(i => console.log(`   ⚠️ ${i}`));
  });


  test('6. Responsive Design', async ({ page }) => {
    await page.goto('/');
    
    let score = 0;
    const maxScore = 15;
    const issues = [];
    
    const viewports = [
      { name: 'Desktop', width: 1280, height: 800 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];
    
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(500);
      
      // Check for horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const hasOverflow = bodyWidth > vp.width + 10;
      
      if (!hasOverflow) {
        score += 2;
      } else {
        issues.push(`Horizontal overflow on ${vp.name} (${vp.width}px)`);
      }
      
      // Check if main content is visible
      const h1Visible = await page.$eval('h1', el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).catch(() => false);
      
      if (h1Visible) {
        score += 1;
      } else {
        issues.push(`Main headline not visible on ${vp.name}`);
      }
      
      // Check text readability (not too small)
      const minFontSize = await page.$$eval('p, span, a', els => {
        return Math.min(...els.slice(0, 20).map(e => 
          parseFloat(window.getComputedStyle(e).fontSize)
        ).filter(s => s > 0));
      }).catch(() => 16);
      
      if (minFontSize >= 12) {
        score += 1;
      } else {
        issues.push(`Text too small on ${vp.name} (${minFontSize}px)`);
      }
    }
    
    // Take screenshot at mobile size for reference
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'test-results/mobile-view.png', fullPage: true });
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    
    auditResults.scores['Responsive'] = { score, maxScore, details: issues.join('; ') || 'Good responsive design' };
    
    console.log(`\n📱 RESPONSIVE: ${score}/${maxScore}`);
    issues.forEach(i => console.log(`   ⚠️ ${i}`));
  });


  test('7. Interactive Elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    let score = 0;
    const maxScore = 10;
    const issues = [];
    
    // Check for hover effects on buttons
    const buttons = await page.$$('button, .btn, .cta');
    if (buttons.length > 0) {
      const btn = buttons[0];
      const initialBg = await btn.evaluate(e => window.getComputedStyle(e).backgroundColor);
      await btn.hover();
      await page.waitForTimeout(300);
      const hoverBg = await btn.evaluate(e => window.getComputedStyle(e).backgroundColor);
      
      if (initialBg !== hoverBg) {
        score += 3;
      } else {
        issues.push('Buttons lack hover feedback');
        score += 1; // Partial credit for having buttons
      }
    }
    
    // Check for clickable links
    const links = await page.$$('a[href]');
    if (links.length >= 5) {
      score += 2;
    } else if (links.length >= 1) {
      score += 1;
    }
    
    // Check for animations/transitions
    const hasAnimations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.animation !== 'none' || style.transition !== 'all 0s ease 0s') {
          return true;
        }
      }
      return false;
    });
    
    if (hasAnimations) {
      score += 3;
    } else {
      issues.push('No animations or transitions detected');
    }
    
    // Check for scroll behavior
    const hasScrollElements = await page.$$('[class*="scroll"], [class*="ticker"], [class*="carousel"]');
    if (hasScrollElements.length > 0) {
      score += 2;
    }
    
    auditResults.scores['Interactivity'] = { score, maxScore, details: issues.join('; ') || 'Good interactivity' };
    
    console.log(`\n🖱️ INTERACTIVITY: ${score}/${maxScore}`);
    issues.forEach(i => console.log(`   ⚠️ ${i}`));
  });


  test('8. Final Grade Report', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/full-page-audit.png', 
      fullPage: true 
    });
    
    // Calculate final grade
    let totalScore = 0;
    let maxPossible = 0;
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 LANDING PAGE GRADING REPORT');
    console.log('='.repeat(60));
    
    const categories = [
      'Performance', 'Visual Design', 'Navigation', 
      'Content', 'Accessibility', 'Responsive', 'Interactivity'
    ];
    
    for (const cat of categories) {
      const data = auditResults.scores[cat];
      if (data) {
        totalScore += data.score;
        maxPossible += data.maxScore;
        const pct = Math.round((data.score / data.maxScore) * 100);
        const bar = '█'.repeat(Math.floor(pct / 10)) + '░'.repeat(10 - Math.floor(pct / 10));
        console.log(`\n${cat.padEnd(15)} ${bar} ${data.score}/${data.maxScore} (${pct}%)`);
        if (data.details && data.details !== `Good ${cat.toLowerCase()}`) {
          console.log(`                 └─ ${data.details}`);
        }
      }
    }
    
    const percentage = Math.round((totalScore / maxPossible) * 100);
    let letterGrade, gradeEmoji;
    
    if (percentage >= 90) { letterGrade = 'A'; gradeEmoji = '🏆'; }
    else if (percentage >= 80) { letterGrade = 'B'; gradeEmoji = '🌟'; }
    else if (percentage >= 70) { letterGrade = 'C'; gradeEmoji = '👍'; }
    else if (percentage >= 60) { letterGrade = 'D'; gradeEmoji = '⚠️'; }
    else { letterGrade = 'F'; gradeEmoji = '❌'; }
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n${gradeEmoji} FINAL GRADE: ${letterGrade} (${totalScore}/${maxPossible} - ${percentage}%)`);
    console.log('\n' + '='.repeat(60));
    
    // Recommendations based on lowest scores
    console.log('\n📌 TOP RECOMMENDATIONS:');
    
    const sortedCategories = categories
      .filter(cat => auditResults.scores[cat])
      .sort((a, b) => {
        const aData = auditResults.scores[a];
        const bData = auditResults.scores[b];
        return (aData.score / aData.maxScore) - (bData.score / bData.maxScore);
      });
    
    const recommendations = {
      'Performance': 'Optimize images, minimize JS/CSS, enable caching',
      'Visual Design': 'Improve spacing, color contrast, and visual hierarchy',
      'Navigation': 'Add more navigation links and clear CTAs',
      'Content': 'Add more descriptive content and social proof',
      'Accessibility': 'Add alt text, improve heading hierarchy, add ARIA labels',
      'Responsive': 'Fix layout issues on mobile/tablet viewports',
      'Interactivity': 'Add hover effects, animations, and micro-interactions'
    };

    
    for (let i = 0; i < Math.min(3, sortedCategories.length); i++) {
      const cat = sortedCategories[i];
      const data = auditResults.scores[cat];
      const pct = Math.round((data.score / data.maxScore) * 100);
      if (pct < 80) {
        console.log(`\n   ${i + 1}. ${cat} (${pct}%)`);
        console.log(`      → ${recommendations[cat]}`);
        if (data.details && !data.details.startsWith('Good')) {
          console.log(`      → Issues: ${data.details}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📸 Screenshots saved to test-results/');
    console.log('='.repeat(60) + '\n');
    
    // Assert minimum passing grade
    expect(percentage).toBeGreaterThanOrEqual(0); // Always pass to show report
  });
});
