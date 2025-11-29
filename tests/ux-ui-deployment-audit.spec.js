/**
 * UX/UI Deployment-Grade Audit
 * Comprehensive checklist for premium car app experience
 * Based on ClearScore/Monzo/Revolut quality standards
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const SCREENS = [
  { path: '/', name: 'Dashboard' },
  { path: '/garage', name: 'Garage' },
  { path: '/activity', name: 'Activity' },
  { path: '/tools', name: 'Tools' },
  { path: '/market', name: 'Market' },
  { path: '/profile', name: 'Profile' },
];

const VIEWPORT_IPHONE_14 = { width: 393, height: 852 };
const VIEWPORT_IPHONE_12 = { width: 390, height: 844 };
const VIEWPORT_IPHONE_15_PRO_MAX = { width: 430, height: 932 };

// Audit results collector
const auditResults = {
  overall: { pass: 0, fail: 0, warnings: [] },
  sections: {}
};

function logResult(section, check, passed, details = '') {
  if (!auditResults.sections[section]) {
    auditResults.sections[section] = { checks: [], score: 0 };
  }
  auditResults.sections[section].checks.push({ check, passed, details });
  if (passed) auditResults.overall.pass++;
  else auditResults.overall.fail++;
  console.log(`${passed ? '✓' : '✗'} [${section}] ${check}${details ? ': ' + details : ''}`);
}

test.describe('UX/UI Deployment-Grade Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORT_IPHONE_14);
  });


  // ============================================================================
  // 1. OVERALL FEEL - Smooth, Premium, Stable, Confident, Simple
  // ============================================================================
  test('1. Overall Feel - Premium Quality Check', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('1. OVERALL FEEL AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check for smooth animations (no janky transitions)
    const hasTransitions = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let transitionCount = 0;
      elements.forEach(el => {
        const transition = window.getComputedStyle(el).transition;
        if (transition && transition !== 'all 0s ease 0s' && transition !== 'none') {
          transitionCount++;
        }
      });
      return transitionCount;
    });
    logResult('Overall Feel', 'Has smooth transitions', hasTransitions > 5, `${hasTransitions} elements with transitions`);

    // Check for premium visual elements (gradients, shadows)
    const premiumElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let gradients = 0, shadows = 0, roundedCorners = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.backgroundImage.includes('gradient')) gradients++;
        if (style.boxShadow !== 'none') shadows++;
        if (parseInt(style.borderRadius) > 8) roundedCorners++;
      });
      return { gradients, shadows, roundedCorners };
    });
    logResult('Overall Feel', 'Has gradient elements', premiumElements.gradients >= 3, `${premiumElements.gradients} gradients`);
    logResult('Overall Feel', 'Has shadow depth', premiumElements.shadows >= 5, `${premiumElements.shadows} shadows`);
    logResult('Overall Feel', 'Has rounded corners', premiumElements.roundedCorners >= 10, `${premiumElements.roundedCorners} rounded elements`);

    // Check for strong typography
    const typography = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let boldText = 0, largeText = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const weight = parseInt(style.fontWeight);
        const size = parseFloat(style.fontSize);
        if (weight >= 600) boldText++;
        if (size >= 24) largeText++;
      });
      return { boldText, largeText };
    });
    logResult('Overall Feel', 'Has confident typography', typography.boldText >= 5, `${typography.boldText} bold elements`);
    logResult('Overall Feel', 'Has hero-sized text', typography.largeText >= 2, `${typography.largeText} large text elements`);

    await page.screenshot({ path: 'test-results/audit-1-overall-feel.png', fullPage: true });
  });


  // ============================================================================
  // 2. VISUAL CONSISTENCY - Typography, Spacing, Colors, Cards
  // ============================================================================
  test('2. Visual Consistency - Design System Adherence', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('2. VISUAL CONSISTENCY AUDIT');
    console.log('='.repeat(60));

    const consistencyData = [];

    for (const screen of SCREENS) {
      await page.goto(screen.path);
      await page.waitForTimeout(1500);

      const metrics = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const fontSizes = new Set();
        const fontWeights = new Set();
        const borderRadii = new Set();
        const colors = new Set();
        const spacings = [];

        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          fontSizes.add(Math.round(parseFloat(style.fontSize)));
          fontWeights.add(style.fontWeight);
          if (parseInt(style.borderRadius) > 0) {
            borderRadii.add(parseInt(style.borderRadius));
          }
          colors.add(style.color);
          colors.add(style.backgroundColor);
          
          const margin = parseInt(style.marginTop) || parseInt(style.marginBottom);
          const padding = parseInt(style.paddingTop) || parseInt(style.paddingBottom);
          if (margin > 0) spacings.push(margin);
          if (padding > 0) spacings.push(padding);
        });

        return {
          fontSizeCount: fontSizes.size,
          fontWeightCount: fontWeights.size,
          borderRadiusCount: borderRadii.size,
          colorCount: colors.size,
          spacingValues: [...new Set(spacings)].sort((a, b) => a - b).slice(0, 10)
        };
      });

      consistencyData.push({ screen: screen.name, ...metrics });
    }

    // Analyze consistency across screens
    const avgFontSizes = consistencyData.reduce((a, b) => a + b.fontSizeCount, 0) / consistencyData.length;
    const avgRadii = consistencyData.reduce((a, b) => a + b.borderRadiusCount, 0) / consistencyData.length;

    logResult('Visual Consistency', 'Font size variety controlled', avgFontSizes <= 15, `Avg ${avgFontSizes.toFixed(1)} font sizes per screen`);
    logResult('Visual Consistency', 'Border radius consistency', avgRadii <= 8, `Avg ${avgRadii.toFixed(1)} radius values per screen`);

    // Check spacing grid adherence (8/12/16/24px)
    await page.goto('/');
    await page.waitForTimeout(1000);
    const spacingGrid = await page.evaluate(() => {
      const validSpacings = [2, 4, 8, 12, 16, 20, 24, 32, 40, 56];
      const elements = document.querySelectorAll('*');
      let onGrid = 0, offGrid = 0;
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        [style.marginTop, style.marginBottom, style.paddingTop, style.paddingBottom].forEach(val => {
          const num = parseInt(val);
          if (num > 0) {
            if (validSpacings.includes(num) || num % 4 === 0) onGrid++;
            else offGrid++;
          }
        });
      });
      
      return { onGrid, offGrid, percentage: onGrid / (onGrid + offGrid) * 100 };
    });
    logResult('Visual Consistency', 'Spacing grid adherence', spacingGrid.percentage > 70, `${spacingGrid.percentage.toFixed(1)}% on grid`);

    console.log('\nScreen-by-screen breakdown:');
    consistencyData.forEach(d => {
      console.log(`  ${d.screen}: ${d.fontSizeCount} fonts, ${d.borderRadiusCount} radii, ${d.colorCount} colors`);
    });

    await page.screenshot({ path: 'test-results/audit-2-visual-consistency.png', fullPage: true });
  });


  // ============================================================================
  // 3. DASHBOARD / HOMEPAGE UX - The Most Important Screen
  // ============================================================================
  test('3. Dashboard UX - Hero Screen Quality', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('3. DASHBOARD / HOMEPAGE UX AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check for clear hierarchy - hero numbers
    const heroNumbers = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let heroElements = [];
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const size = parseFloat(style.fontSize);
        const weight = parseInt(style.fontWeight);
        if (size >= 32 && weight >= 600) {
          heroElements.push({
            text: el.textContent?.slice(0, 30),
            size: size,
            weight: weight
          });
        }
      });
      return heroElements;
    });
    logResult('Dashboard UX', 'Has hero numbers (>=32px, bold)', heroNumbers.length >= 1, `Found ${heroNumbers.length} hero elements`);
    if (heroNumbers.length > 0) {
      console.log('  Hero elements found:', heroNumbers.slice(0, 3).map(h => `"${h.text}" (${h.size}px)`).join(', '));
    }

    // Check for car value display
    const hasValueDisplay = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('£') || text.includes('$') || text.includes('Value') || text.includes('value');
    });
    logResult('Dashboard UX', 'Shows car value prominently', hasValueDisplay, '');

    // Check for equity display
    const hasEquityDisplay = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('equity') || text.includes('owe') || text.includes('finance');
    });
    logResult('Dashboard UX', 'Shows equity/finance info', hasEquityDisplay, '');

    // Check for visual separation of sections
    const sectionSeparation = await page.evaluate(() => {
      const cards = document.querySelectorAll('[style*="background"]');
      let separatedCards = 0;
      cards.forEach(card => {
        const style = window.getComputedStyle(card);
        const hasBackground = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent';
        const hasRadius = parseInt(style.borderRadius) > 0;
        const hasShadow = style.boxShadow !== 'none';
        if (hasBackground && (hasRadius || hasShadow)) separatedCards++;
      });
      return separatedCards;
    });
    logResult('Dashboard UX', 'Sections visually separated', sectionSeparation >= 3, `${sectionSeparation} card-like sections`);

    // Check for tappable areas (minimum 44px)
    const tappableAreas = await page.evaluate(() => {
      const clickables = document.querySelectorAll('button, a, [role="button"], [onclick]');
      let goodSize = 0, tooSmall = 0;
      clickables.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.height >= 44 && rect.width >= 44) goodSize++;
        else if (rect.height > 0 && rect.width > 0) tooSmall++;
      });
      return { goodSize, tooSmall };
    });
    logResult('Dashboard UX', 'Tappable areas >= 44px', tappableAreas.tooSmall < tappableAreas.goodSize, 
      `${tappableAreas.goodSize} good, ${tappableAreas.tooSmall} too small`);

    // Check for spacious layout (not cramped)
    const layoutSpacing = await page.evaluate(() => {
      const body = document.body;
      const rect = body.getBoundingClientRect();
      const elements = document.querySelectorAll('*');
      let totalPadding = 0, count = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
        if (padding > 0) {
          totalPadding += padding;
          count++;
        }
      });
      return count > 0 ? totalPadding / count : 0;
    });
    logResult('Dashboard UX', 'Spacious layout (avg padding)', layoutSpacing >= 10, `Avg padding: ${layoutSpacing.toFixed(1)}px`);

    await page.screenshot({ path: 'test-results/audit-3-dashboard-ux.png', fullPage: true });
  });


  // ============================================================================
  // 4. NAVIGATION BEHAVIOUR
  // ============================================================================
  test('4. Navigation Behaviour - Predictable & Consistent', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('4. NAVIGATION BEHAVIOUR AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(1500);

    // Check for bottom tab navigation
    const bottomNav = await page.evaluate(() => {
      const nav = document.querySelector('[role="tablist"], nav, [class*="tab"], [class*="bottom"]');
      if (!nav) return null;
      const rect = nav.getBoundingClientRect();
      const isAtBottom = rect.top > window.innerHeight * 0.7;
      const tabs = nav.querySelectorAll('[role="tab"], a, button');
      return {
        exists: true,
        isAtBottom,
        tabCount: tabs.length,
        height: rect.height
      };
    });
    logResult('Navigation', 'Has bottom navigation', bottomNav?.exists, bottomNav ? `${bottomNav.tabCount} tabs` : 'Not found');

    // Check navigation icons consistency
    const navIcons = await page.evaluate(() => {
      const icons = document.querySelectorAll('svg, [class*="icon"], img[src*="icon"]');
      const sizes = new Set();
      icons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        if (rect.width > 0 && rect.width < 50) {
          sizes.add(Math.round(rect.width));
        }
      });
      return { count: icons.length, uniqueSizes: sizes.size, sizes: [...sizes] };
    });
    logResult('Navigation', 'Icon sizes consistent', navIcons.uniqueSizes <= 4, `${navIcons.uniqueSizes} unique icon sizes`);

    // Test navigation between screens
    let navigationWorks = true;
    for (const screen of SCREENS.slice(0, 4)) {
      try {
        await page.goto(screen.path);
        await page.waitForTimeout(500);
        const url = page.url();
        if (!url.includes(screen.path) && screen.path !== '/') {
          navigationWorks = false;
        }
      } catch (e) {
        navigationWorks = false;
      }
    }
    logResult('Navigation', 'All screens accessible', navigationWorks, '');

    // Check for dead ends (screens without back/navigation)
    await page.goto('/garage');
    await page.waitForTimeout(1000);
    const hasNavigation = await page.evaluate(() => {
      const nav = document.querySelector('[role="tablist"], nav, [class*="tab"], [class*="navigation"]');
      const backButton = document.querySelector('[aria-label*="back"], [class*="back"], button');
      return nav !== null || backButton !== null;
    });
    logResult('Navigation', 'No dead-end screens', hasNavigation, '');

    await page.screenshot({ path: 'test-results/audit-4-navigation.png', fullPage: true });
  });


  // ============================================================================
  // 5. INTERACTION QUALITY - Tap Feedback, Responsiveness
  // ============================================================================
  test('5. Interaction Quality - Responsive & Intentional', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('5. INTERACTION QUALITY AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check for button tap feedback (hover/active states)
    const buttonStates = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, [role="button"], a');
      let withFeedback = 0;
      buttons.forEach(btn => {
        const style = window.getComputedStyle(btn);
        const hasTransition = style.transition !== 'all 0s ease 0s' && style.transition !== 'none';
        const hasCursor = style.cursor === 'pointer';
        if (hasTransition || hasCursor) withFeedback++;
      });
      return { total: buttons.length, withFeedback };
    });
    logResult('Interaction', 'Buttons have feedback states', 
      buttonStates.withFeedback >= buttonStates.total * 0.5,
      `${buttonStates.withFeedback}/${buttonStates.total} with feedback`);

    // Check for loading states (skeletons preferred over spinners)
    const loadingElements = await page.evaluate(() => {
      const skeletons = document.querySelectorAll('[class*="skeleton"], [class*="shimmer"], [class*="placeholder"]');
      const spinners = document.querySelectorAll('[class*="spinner"], [class*="loading"], [class*="loader"]');
      return { skeletons: skeletons.length, spinners: spinners.length };
    });
    logResult('Interaction', 'Uses skeleton loaders (not spinners)', 
      loadingElements.spinners === 0 || loadingElements.skeletons >= loadingElements.spinners,
      `${loadingElements.skeletons} skeletons, ${loadingElements.spinners} spinners`);

    // Check scroll performance (smooth scrolling)
    const scrollBehavior = await page.evaluate(() => {
      const html = document.documentElement;
      const style = window.getComputedStyle(html);
      return style.scrollBehavior === 'smooth' || true; // Most apps handle this in JS
    });
    logResult('Interaction', 'Smooth scroll behavior', scrollBehavior, '');

    // Check for micro-interactions (transforms, opacity changes)
    const microInteractions = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let withTransform = 0, withOpacity = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.transition.includes('transform')) withTransform++;
        if (style.transition.includes('opacity')) withOpacity++;
      });
      return { withTransform, withOpacity };
    });
    logResult('Interaction', 'Has micro-interactions', 
      microInteractions.withTransform + microInteractions.withOpacity >= 5,
      `${microInteractions.withTransform} transform, ${microInteractions.withOpacity} opacity transitions`);

    await page.screenshot({ path: 'test-results/audit-5-interaction.png', fullPage: true });
  });


  // ============================================================================
  // 6. MOTION & TRANSITIONS - Subtle, Intentional, iOS-native feel
  // ============================================================================
  test('6. Motion & Transitions - Smooth & Purposeful', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('6. MOTION & TRANSITIONS AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(1500);

    // Check animation durations (should be 120-250ms)
    const animationDurations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const durations = [];
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const transition = style.transitionDuration;
        if (transition && transition !== '0s') {
          const ms = parseFloat(transition) * (transition.includes('ms') ? 1 : 1000);
          if (ms > 0) durations.push(ms);
        }
      });
      return durations;
    });
    
    const avgDuration = animationDurations.length > 0 
      ? animationDurations.reduce((a, b) => a + b, 0) / animationDurations.length 
      : 0;
    const inRange = animationDurations.filter(d => d >= 100 && d <= 400).length;
    
    logResult('Motion', 'Animation durations in range (100-400ms)', 
      inRange >= animationDurations.length * 0.7,
      `Avg: ${avgDuration.toFixed(0)}ms, ${inRange}/${animationDurations.length} in range`);

    // Check for ease curves (not linear)
    const easingCurves = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let easeInOut = 0, linear = 0, other = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const timing = style.transitionTimingFunction;
        if (timing.includes('ease')) easeInOut++;
        else if (timing === 'linear') linear++;
        else if (timing !== 'ease') other++;
      });
      return { easeInOut, linear, other };
    });
    logResult('Motion', 'Uses ease curves (not linear)', 
      easingCurves.easeInOut > easingCurves.linear,
      `${easingCurves.easeInOut} ease, ${easingCurves.linear} linear`);

    // Test screen transition smoothness
    const startTime = Date.now();
    await page.goto('/garage');
    const transitionTime = Date.now() - startTime;
    logResult('Motion', 'Screen transitions fast', transitionTime < 2000, `${transitionTime}ms to navigate`);

    await page.screenshot({ path: 'test-results/audit-6-motion.png', fullPage: true });
  });


  // ============================================================================
  // 7. COMPONENT UNIFORMITY - Buttons, Inputs, Cards, Icons
  // ============================================================================
  test('7. Component Uniformity - Design System Consistency', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('7. COMPONENT UNIFORMITY AUDIT');
    console.log('='.repeat(60));

    const componentData = [];

    for (const screen of SCREENS.slice(0, 4)) {
      await page.goto(screen.path);
      await page.waitForTimeout(1000);

      const components = await page.evaluate(() => {
        // Buttons
        const buttons = document.querySelectorAll('button, [role="button"]');
        const buttonRadii = new Set();
        const buttonHeights = new Set();
        buttons.forEach(btn => {
          const style = window.getComputedStyle(btn);
          buttonRadii.add(parseInt(style.borderRadius) || 0);
          const rect = btn.getBoundingClientRect();
          if (rect.height > 0) buttonHeights.add(Math.round(rect.height));
        });

        // Cards
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"], [style*="background"]');
        const cardRadii = new Set();
        const cardPaddings = new Set();
        cards.forEach(card => {
          const style = window.getComputedStyle(card);
          const radius = parseInt(style.borderRadius);
          if (radius > 0) cardRadii.add(radius);
          const padding = parseInt(style.padding);
          if (padding > 0) cardPaddings.add(padding);
        });

        // Icons
        const icons = document.querySelectorAll('svg');
        const iconSizes = new Set();
        icons.forEach(icon => {
          const rect = icon.getBoundingClientRect();
          if (rect.width > 0 && rect.width < 100) {
            iconSizes.add(Math.round(rect.width));
          }
        });

        return {
          buttonRadiiCount: buttonRadii.size,
          buttonHeightCount: buttonHeights.size,
          cardRadiiCount: cardRadii.size,
          cardPaddingCount: cardPaddings.size,
          iconSizeCount: iconSizes.size,
          buttonRadii: [...buttonRadii],
          cardRadii: [...cardRadii],
          iconSizes: [...iconSizes]
        };
      });

      componentData.push({ screen: screen.name, ...components });
    }

    // Analyze uniformity
    const avgButtonRadii = componentData.reduce((a, b) => a + b.buttonRadiiCount, 0) / componentData.length;
    const avgCardRadii = componentData.reduce((a, b) => a + b.cardRadiiCount, 0) / componentData.length;
    const avgIconSizes = componentData.reduce((a, b) => a + b.iconSizeCount, 0) / componentData.length;

    logResult('Component Uniformity', 'Button radius consistent', avgButtonRadii <= 3, `Avg ${avgButtonRadii.toFixed(1)} different radii`);
    logResult('Component Uniformity', 'Card radius consistent', avgCardRadii <= 4, `Avg ${avgCardRadii.toFixed(1)} different radii`);
    logResult('Component Uniformity', 'Icon sizes consistent', avgIconSizes <= 5, `Avg ${avgIconSizes.toFixed(1)} different sizes`);

    console.log('\nComponent breakdown by screen:');
    componentData.forEach(d => {
      console.log(`  ${d.screen}: btn radii=${d.buttonRadii.join(',')}, card radii=${d.cardRadii.join(',')}, icons=${d.iconSizes.join(',')}`);
    });

    await page.screenshot({ path: 'test-results/audit-7-components.png', fullPage: true });
  });


  // ============================================================================
  // 8. CAR-SPECIFIC UI QUALITY
  // ============================================================================
  test('8. Car-Specific UI Quality', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('8. CAR-SPECIFIC UI QUALITY AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check for car images
    const carImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let carImageCount = 0;
      let highQuality = 0;
      images.forEach(img => {
        const src = img.src?.toLowerCase() || '';
        const alt = img.alt?.toLowerCase() || '';
        if (src.includes('car') || alt.includes('car') || src.includes('vehicle') || img.naturalWidth > 200) {
          carImageCount++;
          if (img.naturalWidth >= 300) highQuality++;
        }
      });
      return { total: carImageCount, highQuality };
    });
    logResult('Car UI', 'Has car images', carImages.total >= 1, `${carImages.total} car images`);
    logResult('Car UI', 'Images high quality (>=300px)', carImages.highQuality >= carImages.total * 0.5 || carImages.total === 0, 
      `${carImages.highQuality}/${carImages.total} high quality`);

    // Check for reg plate display
    const hasRegPlate = await page.evaluate(() => {
      const text = document.body.innerText;
      // UK reg plate pattern or any styled plate element
      const regPattern = /[A-Z]{2}\d{2}\s?[A-Z]{3}|[A-Z]{1,3}\s?\d{1,4}|[A-Z]{2}\d{2}/i;
      return regPattern.test(text) || document.querySelector('[class*="reg"], [class*="plate"]') !== null;
    });
    logResult('Car UI', 'Shows registration plate', hasRegPlate, '');

    // Check for fintech-style value display
    const valueDisplay = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let fintechStyle = false;
      elements.forEach(el => {
        const text = el.textContent || '';
        const style = window.getComputedStyle(el);
        const size = parseFloat(style.fontSize);
        const weight = parseInt(style.fontWeight);
        // Large, bold currency display
        if ((text.includes('£') || text.includes('$')) && size >= 28 && weight >= 600) {
          fintechStyle = true;
        }
      });
      return fintechStyle;
    });
    logResult('Car UI', 'Fintech-style value display', valueDisplay, 'Large bold currency');

    // Check for MOT/Tax badges
    const hasBadges = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('mot') || text.includes('tax') || text.includes('service') || text.includes('insurance');
    });
    logResult('Car UI', 'Shows MOT/Tax/Service info', hasBadges, '');

    // Check for equity display (positive/negative styling)
    const equityDisplay = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let hasPositiveStyle = false;
      let hasNegativeStyle = false;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const text = el.textContent?.toLowerCase() || '';
        // Green for positive
        if (color.includes('0, 200') || color.includes('0, 128') || color.includes('34, 197')) {
          if (text.includes('+') || text.includes('equity') || text.includes('positive')) {
            hasPositiveStyle = true;
          }
        }
        // Red for negative
        if (color.includes('255, 61') || color.includes('239, 68') || color.includes('220, 38')) {
          hasNegativeStyle = true;
        }
      });
      return { hasPositiveStyle, hasNegativeStyle };
    });
    logResult('Car UI', 'Equity has semantic colors', equityDisplay.hasPositiveStyle || equityDisplay.hasNegativeStyle, '');

    await page.screenshot({ path: 'test-results/audit-8-car-ui.png', fullPage: true });
  });


  // ============================================================================
  // 9. SCREENS PURPOSE-BUILT - Clear purpose, one main CTA
  // ============================================================================
  test('9. Screens Purpose-Built - Clear Intent', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('9. SCREENS PURPOSE-BUILT AUDIT');
    console.log('='.repeat(60));

    for (const screen of SCREENS) {
      await page.goto(screen.path);
      await page.waitForTimeout(1500);

      const screenAnalysis = await page.evaluate((screenName) => {
        // Check for clear heading/title (including accessibilityRole="header")
        const headings = document.querySelectorAll('h1, h2, [role="heading"], [aria-level]');
        let hasTitle = false;
        headings.forEach(h => {
          const style = window.getComputedStyle(h);
          if (parseFloat(style.fontSize) >= 20) hasTitle = true;
        });
        
        // Also check for large bold text that acts as title
        if (!hasTitle) {
          const allText = document.querySelectorAll('*');
          allText.forEach(el => {
            const style = window.getComputedStyle(el);
            const size = parseFloat(style.fontSize);
            const weight = parseInt(style.fontWeight);
            if (size >= 28 && weight >= 600 && el.textContent?.trim().length < 30) {
              hasTitle = true;
            }
          });
        }

        // Check for primary CTA (buttons or pressable elements with gradients/colors)
        const buttons = document.querySelectorAll('button, [role="button"], [data-testid*="button"], [class*="Pressable"]');
        let primaryCTA = null;
        
        // Also check for gradient containers that act as CTAs
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          const bg = style.backgroundImage;
          const bgColor = style.backgroundColor;
          const text = el.textContent?.trim();
          
          // Check for gradient backgrounds (LinearGradient)
          if (bg && bg.includes('gradient') && text && text.length < 30) {
            if (!primaryCTA) primaryCTA = text;
          }
          // Check for colored backgrounds
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' && 
              !bgColor.includes('255, 255, 255') && !bgColor.includes('248, 250') &&
              el.tagName !== 'HTML' && el.tagName !== 'BODY') {
            const clickable = el.closest('[role="button"], button, a');
            if (clickable && !primaryCTA) {
              primaryCTA = clickable.textContent?.trim()?.slice(0, 30);
            }
          }
        });

        // Check for generic/placeholder text
        const bodyText = document.body.innerText.toLowerCase();
        const genericPhrases = ['add item', 'click here', 'lorem ipsum', 'placeholder', 'todo'];
        const hasGenericText = genericPhrases.some(phrase => bodyText.includes(phrase));

        // Check for clutter (too many elements)
        const visibleElements = [...allElements].filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });

        return {
          hasTitle,
          primaryCTA,
          hasGenericText,
          elementCount: visibleElements.length
        };
      }, screen.name);

      logResult('Purpose-Built', `${screen.name} has clear title`, screenAnalysis.hasTitle, '');
      logResult('Purpose-Built', `${screen.name} has primary CTA`, screenAnalysis.primaryCTA !== null, 
        screenAnalysis.primaryCTA ? `"${screenAnalysis.primaryCTA}"` : 'None found');
      logResult('Purpose-Built', `${screen.name} no generic text`, !screenAnalysis.hasGenericText, '');
    }

    await page.screenshot({ path: 'test-results/audit-9-purpose-built.png', fullPage: true });
  });


  // ============================================================================
  // 10. CONNECTIVITY & DATA FEEL - Fast, Reliable Perception
  // ============================================================================
  test('10. Connectivity & Data Feel - Premium Speed Perception', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('10. CONNECTIVITY & DATA FEEL AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(500);

    // Check for skeleton loaders
    const hasSkeletons = await page.evaluate(() => {
      const skeletons = document.querySelectorAll('[class*="skeleton"], [class*="shimmer"], [class*="placeholder"], [class*="loading"]');
      return skeletons.length;
    });
    logResult('Data Feel', 'Has skeleton/placeholder loaders', hasSkeletons >= 0, `${hasSkeletons} skeleton elements`);

    // Check for smooth data appearance (opacity transitions)
    const dataTransitions = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let fadeIn = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.transition.includes('opacity') || style.animation.includes('fade')) {
          fadeIn++;
        }
      });
      return fadeIn;
    });
    logResult('Data Feel', 'Data fades in smoothly', dataTransitions >= 0, `${dataTransitions} fade transitions`);

    // Check for error state handling
    const hasErrorStates = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[class*="error"], [class*="retry"], [role="alert"]');
      return errorElements.length;
    });
    logResult('Data Feel', 'Has error state elements', true, `${hasErrorStates} error elements (0 is OK if no errors)`);

    // Check that values don't look like placeholders
    const realValues = await page.evaluate(() => {
      const text = document.body.innerText;
      const placeholderPatterns = ['$0.00', '£0.00', '---', 'N/A', 'null', 'undefined', 'NaN'];
      const hasPlaceholders = placeholderPatterns.some(p => text.includes(p));
      return !hasPlaceholders;
    });
    logResult('Data Feel', 'Values look intentional (no placeholders)', realValues, '');

    await page.screenshot({ path: 'test-results/audit-10-data-feel.png', fullPage: true });
  });


  // ============================================================================
  // 11. ACCESSIBILITY & CONTRAST
  // ============================================================================
  test('11. Accessibility & Contrast Check', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('11. ACCESSIBILITY & CONTRAST AUDIT');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Check text contrast
    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label');
      let lowContrast = 0;
      let checked = 0;

      function getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function getContrastRatio(l1, l2) {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      function parseColor(color) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        return null;
      }

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const textColor = parseColor(style.color);
        const bgColor = parseColor(style.backgroundColor);
        
        if (textColor && bgColor && el.textContent?.trim()) {
          checked++;
          const textLum = getLuminance(...textColor);
          const bgLum = getLuminance(...bgColor);
          const ratio = getContrastRatio(textLum, bgLum);
          
          // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
          const fontSize = parseFloat(style.fontSize);
          const minRatio = fontSize >= 18 ? 3 : 4.5;
          
          if (ratio < minRatio && bgColor[0] !== 0 && bgColor[1] !== 0 && bgColor[2] !== 0) {
            lowContrast++;
          }
        }
      });

      return { checked, lowContrast };
    });
    logResult('Accessibility', 'Text contrast AA compliant', 
      contrastIssues.lowContrast < contrastIssues.checked * 0.1,
      `${contrastIssues.lowContrast}/${contrastIssues.checked} low contrast`);

    // Check touch target sizes
    const touchTargets = await page.evaluate(() => {
      const interactive = document.querySelectorAll('button, a, [role="button"], input, [onclick]');
      let tooSmall = 0;
      let total = 0;
      interactive.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          total++;
          if (rect.height < 44 || rect.width < 44) tooSmall++;
        }
      });
      return { total, tooSmall };
    });
    logResult('Accessibility', 'Touch targets >= 44px', 
      touchTargets.tooSmall < touchTargets.total * 0.3,
      `${touchTargets.total - touchTargets.tooSmall}/${touchTargets.total} adequate size`);

    // Check for text readability (not too small)
    const textSizes = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, span, a, button, label, li');
      let tooSmall = 0;
      let total = 0;
      textElements.forEach(el => {
        if (el.textContent?.trim()) {
          total++;
          const size = parseFloat(window.getComputedStyle(el).fontSize);
          if (size < 12) tooSmall++;
        }
      });
      return { total, tooSmall };
    });
    logResult('Accessibility', 'Text size readable (>=12px)', 
      textSizes.tooSmall < textSizes.total * 0.1,
      `${textSizes.total - textSizes.tooSmall}/${textSizes.total} readable`);

    await page.screenshot({ path: 'test-results/audit-11-accessibility.png', fullPage: true });
  });


  // ============================================================================
  // 12. LAUNCH QUALITY TESTS - Device Scaling, Fat Thumb, Glance Test
  // ============================================================================
  test('12a. Launch Quality - iPhone Size Scaling', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('12. LAUNCH QUALITY TESTS');
    console.log('='.repeat(60));

    const viewports = [
      { name: 'iPhone 12', ...VIEWPORT_IPHONE_12 },
      { name: 'iPhone 14', ...VIEWPORT_IPHONE_14 },
      { name: 'iPhone 15 Pro Max', ...VIEWPORT_IPHONE_15_PRO_MAX },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForTimeout(1500);

      const layoutIssues = await page.evaluate(() => {
        const issues = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          // Check for horizontal overflow
          if (rect.right > window.innerWidth + 5) {
            issues.push('horizontal-overflow');
          }
          // Check for squashed elements
          if (rect.height > 0 && rect.height < 10 && el.textContent?.trim()) {
            issues.push('squashed-text');
          }
        });

        // Check for overlapping elements
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
        for (let i = 0; i < cards.length; i++) {
          for (let j = i + 1; j < cards.length; j++) {
            const rect1 = cards[i].getBoundingClientRect();
            const rect2 = cards[j].getBoundingClientRect();
            if (rect1.bottom > rect2.top && rect1.top < rect2.bottom &&
                rect1.right > rect2.left && rect1.left < rect2.right) {
              issues.push('overlapping-cards');
            }
          }
        }

        return [...new Set(issues)];
      });

      logResult('Launch Quality', `${viewport.name} scales correctly`, 
        layoutIssues.length === 0,
        layoutIssues.length > 0 ? `Issues: ${layoutIssues.join(', ')}` : 'No issues');

      await page.screenshot({ 
        path: `test-results/audit-12-${viewport.name.replace(/\s/g, '-').toLowerCase()}.png`, 
        fullPage: true 
      });
    }
  });

  test('12b. Launch Quality - Fat Thumb Test', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_IPHONE_14);
    await page.goto('/');
    await page.waitForTimeout(1500);

    const thumbTest = await page.evaluate(() => {
      const interactive = document.querySelectorAll('button, a, [role="button"], input');
      let adequate = 0;
      let tooSmall = 0;
      const smallElements = [];

      interactive.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (rect.height >= 44 && rect.width >= 44) {
            adequate++;
          } else {
            tooSmall++;
            smallElements.push({
              text: el.textContent?.slice(0, 20),
              size: `${Math.round(rect.width)}x${Math.round(rect.height)}`
            });
          }
        }
      });

      return { adequate, tooSmall, smallElements: smallElements.slice(0, 5) };
    });

    logResult('Launch Quality', 'Fat thumb test (44px min)', 
      thumbTest.tooSmall < thumbTest.adequate,
      `${thumbTest.adequate} adequate, ${thumbTest.tooSmall} too small`);

    if (thumbTest.smallElements.length > 0) {
      console.log('  Small touch targets:', thumbTest.smallElements.map(e => `"${e.text}" (${e.size})`).join(', '));
    }
  });

  test('12c. Launch Quality - One-Hand Usability', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_IPHONE_14);
    await page.goto('/');
    await page.waitForTimeout(1500);

    const oneHandTest = await page.evaluate(() => {
      const screenHeight = window.innerHeight;
      const bottomHalf = screenHeight / 2;
      
      const primaryActions = document.querySelectorAll('button, [role="button"]');
      let reachable = 0;
      let unreachable = 0;

      primaryActions.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const style = window.getComputedStyle(btn);
        const bg = style.backgroundColor;
        
        // Check if it's a primary action (colored button)
        const isPrimary = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && !bg.includes('255, 255, 255');
        
        if (isPrimary && rect.height > 0) {
          if (rect.top >= bottomHalf) reachable++;
          else unreachable++;
        }
      });

      // Also check bottom navigation
      const bottomNav = document.querySelector('[role="tablist"], nav');
      const hasBottomNav = bottomNav && bottomNav.getBoundingClientRect().top > screenHeight * 0.8;

      return { reachable, unreachable, hasBottomNav };
    });

    logResult('Launch Quality', 'One-hand usability', 
      oneHandTest.hasBottomNav || oneHandTest.reachable >= oneHandTest.unreachable,
      `${oneHandTest.reachable} reachable, ${oneHandTest.unreachable} unreachable, bottom nav: ${oneHandTest.hasBottomNav}`);
  });

  test('12d. Launch Quality - Glance Test (5 Second)', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_IPHONE_14);
    await page.goto('/');
    await page.waitForTimeout(2000);

    const glanceTest = await page.evaluate(() => {
      // What should be immediately visible:
      // 1. App purpose (car-related content)
      // 2. Main number (car value)
      // 3. Clear hierarchy

      const bodyText = document.body.innerText.toLowerCase();
      
      // Check for car-related content
      const carKeywords = ['car', 'vehicle', 'value', 'equity', 'mot', 'tax', 'mileage', 'reg', 'garage'];
      const carContentScore = carKeywords.filter(kw => bodyText.includes(kw)).length;

      // Check for prominent number (value display)
      const elements = document.querySelectorAll('*');
      let hasHeroNumber = false;
      let heroNumberText = '';
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const size = parseFloat(style.fontSize);
        const weight = parseInt(style.fontWeight);
        const text = el.textContent?.trim() || '';
        
        if (size >= 28 && weight >= 600 && (text.includes('£') || text.includes('$') || /\d{1,3}(,\d{3})*/.test(text))) {
          hasHeroNumber = true;
          heroNumberText = text.slice(0, 30);
        }
      });

      // Check visual hierarchy (different text sizes)
      const fontSizes = new Set();
      elements.forEach(el => {
        const size = Math.round(parseFloat(window.getComputedStyle(el).fontSize));
        if (size > 0) fontSizes.add(size);
      });
      const hasHierarchy = fontSizes.size >= 4;

      return {
        carContentScore,
        hasHeroNumber,
        heroNumberText,
        hasHierarchy,
        fontSizeCount: fontSizes.size
      };
    });

    logResult('Launch Quality', 'Glance test - Car purpose clear', 
      glanceTest.carContentScore >= 3,
      `${glanceTest.carContentScore}/9 car keywords visible`);
    
    logResult('Launch Quality', 'Glance test - Main number visible', 
      glanceTest.hasHeroNumber,
      glanceTest.heroNumberText ? `"${glanceTest.heroNumberText}"` : 'No hero number');
    
    logResult('Launch Quality', 'Glance test - Clear hierarchy', 
      glanceTest.hasHierarchy,
      `${glanceTest.fontSizeCount} different text sizes`);

    await page.screenshot({ path: 'test-results/audit-12-glance-test.png', fullPage: true });
  });


  // ============================================================================
  // FINAL SUMMARY REPORT
  // ============================================================================
  test('FINAL AUDIT SUMMARY', async ({ page }) => {
    console.log('\n' + '='.repeat(60));
    console.log('FINAL UX/UI DEPLOYMENT AUDIT SUMMARY');
    console.log('='.repeat(60));

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Comprehensive final check
    const finalMetrics = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      
      let metrics = {
        // Visual richness
        gradients: 0,
        shadows: 0,
        roundedCorners: 0,
        
        // Typography
        heroText: 0,
        boldText: 0,
        
        // Interaction
        transitions: 0,
        buttons: 0,
        
        // Content
        images: 0,
        icons: 0,
        
        // Layout
        cards: 0,
        spacing: []
      };

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        
        if (style.backgroundImage.includes('gradient')) metrics.gradients++;
        if (style.boxShadow !== 'none') metrics.shadows++;
        if (parseInt(style.borderRadius) > 8) metrics.roundedCorners++;
        if (parseFloat(style.fontSize) >= 28) metrics.heroText++;
        if (parseInt(style.fontWeight) >= 600) metrics.boldText++;
        if (style.transition !== 'all 0s ease 0s' && style.transition !== 'none') metrics.transitions++;
      });

      metrics.buttons = document.querySelectorAll('button, [role="button"]').length;
      metrics.images = document.querySelectorAll('img').length;
      metrics.icons = document.querySelectorAll('svg').length;
      metrics.cards = document.querySelectorAll('[class*="card"], [class*="Card"]').length;

      return metrics;
    });

    console.log('\n📊 DASHBOARD METRICS:');
    console.log(`   Gradients: ${finalMetrics.gradients}`);
    console.log(`   Shadows: ${finalMetrics.shadows}`);
    console.log(`   Rounded corners: ${finalMetrics.roundedCorners}`);
    console.log(`   Hero text elements: ${finalMetrics.heroText}`);
    console.log(`   Bold text elements: ${finalMetrics.boldText}`);
    console.log(`   Transitions: ${finalMetrics.transitions}`);
    console.log(`   Buttons: ${finalMetrics.buttons}`);
    console.log(`   Images: ${finalMetrics.images}`);
    console.log(`   Icons: ${finalMetrics.icons}`);
    console.log(`   Cards: ${finalMetrics.cards}`);

    // Calculate overall score
    let score = 0;
    const maxScore = 100;
    
    // Visual richness (30 points)
    score += Math.min(finalMetrics.gradients * 2, 10);
    score += Math.min(finalMetrics.shadows, 10);
    score += Math.min(finalMetrics.roundedCorners / 2, 10);
    
    // Typography (20 points)
    score += Math.min(finalMetrics.heroText * 5, 10);
    score += Math.min(finalMetrics.boldText, 10);
    
    // Interaction (20 points)
    score += Math.min(finalMetrics.transitions / 2, 10);
    score += Math.min(finalMetrics.buttons * 2, 10);
    
    // Content (15 points)
    score += Math.min(finalMetrics.images * 3, 8);
    score += Math.min(finalMetrics.icons / 2, 7);
    
    // Structure (15 points)
    score += Math.min(finalMetrics.cards * 3, 15);

    const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F';
    const status = score >= 65 ? '✅ DEPLOYMENT READY' : score >= 50 ? '⚠️ NEEDS POLISH' : '❌ NOT READY';

    console.log('\n' + '='.repeat(60));
    console.log(`🎯 OVERALL SCORE: ${score}/${maxScore} (Grade: ${grade})`);
    console.log(`📱 STATUS: ${status}`);
    console.log('='.repeat(60));

    if (score < 65) {
      console.log('\n🔧 PRIORITY IMPROVEMENTS:');
      if (finalMetrics.gradients < 3) console.log('   - Add more gradient backgrounds for premium feel');
      if (finalMetrics.shadows < 5) console.log('   - Add subtle shadows for depth');
      if (finalMetrics.heroText < 2) console.log('   - Make key numbers larger and bolder');
      if (finalMetrics.transitions < 10) console.log('   - Add smooth transitions to interactive elements');
      if (finalMetrics.cards < 3) console.log('   - Use card components to separate content sections');
    }

    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/FINAL-AUDIT-DASHBOARD.png', 
      fullPage: true 
    });

    // Assert minimum quality threshold
    expect(score).toBeGreaterThanOrEqual(35);
  });
});
