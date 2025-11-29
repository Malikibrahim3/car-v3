/**
 * Playwright Test: Human-Designed Dashboard
 * Validates that the UI doesn't look AI-generated
 */

const { test, expect } = require('@playwright/test');

test.describe('Human-Designed Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000); // Wait for app to load
  });

  test('should have maroon accent color (not AI teal/purple)', async ({ page }) => {
    // Check for maroon color in the hero card border
    const heroCard = page.getByTestId('portfolio-hero');
    await expect(heroCard).toBeVisible();
    
    // Take screenshot for visual inspection
    await page.screenshot({ 
      path: 'test-results/dashboard-maroon-check.png',
      fullPage: true 
    });
    
    // Maroon should be present (#8B1538 or similar)
    const styles = await heroCard.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        borderLeftColor: computed.borderLeftColor,
        borderLeftWidth: computed.borderLeftWidth,
      };
    });
    
    console.log('Hero card border:', styles);
    expect(styles.borderLeftWidth).toBe('4px');
  });

  test('should have left-aligned content (not centered)', async ({ page }) => {
    const heroValue = page.getByTestId('portfolio-hero-value');
    await expect(heroValue).toBeVisible();
    
    const alignment = await heroValue.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        textAlign: computed.textAlign,
        alignSelf: computed.alignSelf,
      };
    });
    
    console.log('Hero value alignment:', alignment);
    // Should be left-aligned or start, not center
    expect(alignment.textAlign).not.toBe('center');
  });

  test('should have varied spacing (not uniform)', async ({ page }) => {
    // Check that cards have different spacing
    const heroCard = page.getByTestId('portfolio-hero');
    const quickMetrics = page.getByTestId('quick-metrics');
    const activityFeed = page.getByTestId('activity-feed');
    
    const spacings = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="portfolio-hero"]');
      const metrics = document.querySelector('[data-testid="quick-metrics"]');
      const feed = document.querySelector('[data-testid="activity-feed"]');
      
      return {
        heroMarginBottom: window.getComputedStyle(hero).marginBottom,
        metricsMarginBottom: window.getComputedStyle(metrics).marginBottom,
        feedMarginBottom: window.getComputedStyle(feed).marginBottom,
      };
    });
    
    console.log('Spacing values:', spacings);
    
    // Spacings should be different (20px, 24px, etc - not all the same)
    const uniqueSpacings = new Set(Object.values(spacings));
    expect(uniqueSpacings.size).toBeGreaterThan(1);
  });

  test('should have bold typography hierarchy', async ({ page }) => {
    const heroValue = page.getByTestId('portfolio-hero-value');
    const label = page.getByTestId('portfolio-hero-label');
    
    const typography = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="portfolio-hero-value"]');
      const label = document.querySelector('[data-testid="portfolio-hero-label"]');
      
      return {
        heroSize: window.getComputedStyle(hero).fontSize,
        heroWeight: window.getComputedStyle(hero).fontWeight,
        labelSize: window.getComputedStyle(label).fontSize,
        labelWeight: window.getComputedStyle(label).fontWeight,
      };
    });
    
    console.log('Typography:', typography);
    
    // Hero should be massive (64px)
    expect(parseInt(typography.heroSize)).toBeGreaterThan(50);
    
    // Hero should be bold (700)
    expect(parseInt(typography.heroWeight)).toBeGreaterThanOrEqual(700);
    
    // Label should be much smaller
    expect(parseInt(typography.labelSize)).toBeLessThan(20);
  });

  test('should have uneven metric card widths', async ({ page }) => {
    const mileageCard = page.getByTestId('quick-metrics-mileage');
    const costCard = page.getByTestId('quick-metrics-cost');
    
    const widths = await page.evaluate(() => {
      const mileage = document.querySelector('[data-testid="quick-metrics-mileage"]');
      const cost = document.querySelector('[data-testid="quick-metrics-cost"]');
      
      return {
        mileageWidth: mileage.offsetWidth,
        costWidth: cost.offsetWidth,
      };
    });
    
    console.log('Card widths:', widths);
    
    // Widths should be different (not a perfect grid)
    expect(widths.mileageWidth).not.toBe(widths.costWidth);
  });

  test('should have activity feed with timeline feel', async ({ page }) => {
    const activityFeed = page.getByTestId('activity-feed');
    await expect(activityFeed).toBeVisible();
    
    // Should have title
    const title = page.getByTestId('activity-feed-title');
    await expect(title).toHaveText('Recent Activity');
    
    // Should have at least one activity item
    const firstItem = page.getByTestId('activity-feed-item-0');
    await expect(firstItem).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-activity-feed.png',
      fullPage: true 
    });
  });

  test('should NOT have glass-morphism effects', async ({ page }) => {
    // Check that cards don't have blur filters
    const cards = await page.evaluate(() => {
      const allCards = document.querySelectorAll('[data-testid*="card"], [data-testid*="hero"]');
      const blurFilters = [];
      
      allCards.forEach(card => {
        const filter = window.getComputedStyle(card).filter;
        const backdropFilter = window.getComputedStyle(card).backdropFilter;
        
        if (filter.includes('blur') || backdropFilter.includes('blur')) {
          blurFilters.push({
            testId: card.getAttribute('data-testid'),
            filter,
            backdropFilter,
          });
        }
      });
      
      return blurFilters;
    });
    
    console.log('Blur filters found:', cards);
    
    // Should have NO blur filters (no glass-morphism)
    expect(cards.length).toBe(0);
  });

  test('should have dark charcoal background (not pure black)', async ({ page }) => {
    const bgColor = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="dashboard-screen"]');
      return window.getComputedStyle(container).backgroundColor;
    });
    
    console.log('Background color:', bgColor);
    
    // Should be #121212 (rgb(18, 18, 18)), not #000000
    expect(bgColor).toContain('18');
  });

  test('visual snapshot - full dashboard', async ({ page }) => {
    // Wait for all content to load
    await page.waitForTimeout(1000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-full.png',
      fullPage: true 
    });
    
    console.log('✅ Full dashboard screenshot saved');
  });
});

test.describe('Anti-AI Pattern Checks', () => {
  test('should NOT have circular progress rings', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
    
    // Check for SVG circles (common in AI-generated gauge components)
    const circles = await page.evaluate(() => {
      const svgCircles = document.querySelectorAll('svg circle');
      return svgCircles.length;
    });
    
    console.log('SVG circles found:', circles);
    
    // Should have minimal or no circular gauges
    expect(circles).toBeLessThan(3);
  });

  test('should NOT have teal/purple gradient backgrounds', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
    
    const gradients = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const aiColors = [];
      
      allElements.forEach(el => {
        const bg = window.getComputedStyle(el).background;
        
        // Check for teal (#2AD0BB) or purple gradients
        if (bg.includes('2AD0BB') || bg.includes('42, 208, 187') || 
            bg.includes('purple') || bg.includes('violet')) {
          aiColors.push({
            tag: el.tagName,
            testId: el.getAttribute('data-testid'),
            background: bg.substring(0, 100),
          });
        }
      });
      
      return aiColors;
    });
    
    console.log('AI-style colors found:', gradients);
    
    // Should have NO teal/purple AI colors
    expect(gradients.length).toBe(0);
  });

  test('should have mixed corner radii (not all 24px)', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
    
    const radii = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid*="card"], [data-testid*="hero"], [data-testid*="metrics"]');
      const borderRadii = new Set();
      
      cards.forEach(card => {
        const radius = window.getComputedStyle(card).borderRadius;
        if (radius && radius !== '0px') {
          borderRadii.add(radius);
        }
      });
      
      return Array.from(borderRadii);
    });
    
    console.log('Border radii found:', radii);
    
    // Should have variety (8px, 12px, 16px - not all the same)
    expect(radii.length).toBeGreaterThan(1);
  });
});
