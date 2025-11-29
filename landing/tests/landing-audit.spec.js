import { test, expect } from '@playwright/test';

/**
 * Landing Page Audit Checklist - Linear/Vercel/Stripe Inspired
 * 
 * This test validates the landing page against modern design standards
 * used by top-tier apps like Linear, Vercel, Stripe, Raycast, and Arc.
 */

test.describe('Landing Page Visual Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/CarValue/);
  });

  test('Hero section is visible and has proper structure', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    const headline = hero.locator('h1');
    await expect(headline).toBeVisible();
    const headlineText = await headline.textContent();
    expect(headlineText).toContain('actually worth');
    
    const ctaButtons = hero.locator('.hero-actions .btn');
    await expect(ctaButtons).toHaveCount(2);
    
    const stats = hero.locator('.hero-stats .stat');
    await expect(stats).toHaveCount(3);
  });

  test('Navigation appears on scroll', async ({ page }) => {
    const navbar = page.locator('.navbar');
    await expect(navbar).toHaveClass(/hidden/);
    
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);
    
    await expect(navbar).not.toHaveClass(/hidden/);
  });

  test('Features section has proper grid layout', async ({ page }) => {
    const featuresGrid = page.locator('.features-grid');
    await featuresGrid.scrollIntoViewIfNeeded();
    await expect(featuresGrid).toBeVisible();
    
    const featureCards = page.locator('.feature-card');
    const count = await featureCards.count();
    expect(count).toBe(6);
  });

  test('Product showcase has interactive tabs', async ({ page }) => {
    const showcase = page.locator('.product-showcase');
    await showcase.scrollIntoViewIfNeeded();
    
    const tabs = page.locator('.showcase-tab');
    await expect(tabs).toHaveCount(3);
    
    // Verify tabs exist and first one is active by default
    const firstTab = tabs.nth(0);
    await expect(firstTab).toHaveClass(/active/);
    
    // Click second tab and verify it becomes active
    const secondTab = tabs.nth(1);
    await secondTab.click({ force: true });
    await page.waitForTimeout(500);
    
    await expect(secondTab).toHaveClass(/active/);
  });

  test('Metrics section displays numbers', async ({ page }) => {
    const metrics = page.locator('.metrics');
    await metrics.scrollIntoViewIfNeeded();
    
    const metricCards = page.locator('.metric-card');
    await expect(metricCards).toHaveCount(4);
    
    const firstValue = page.locator('.metric-value').first();
    await expect(firstValue).toBeVisible();
  });

  test('CTA section has download buttons', async ({ page }) => {
    const cta = page.locator('.cta');
    await cta.scrollIntoViewIfNeeded();
    
    const storeButtons = page.locator('.store-button');
    await expect(storeButtons).toHaveCount(2);
  });

  test('Footer has proper structure', async ({ page }) => {
    const footer = page.locator('.footer');
    await footer.scrollIntoViewIfNeeded();
    
    const logo = footer.locator('.footer-logo');
    await expect(logo).toBeVisible();
    
    const columns = footer.locator('.footer-column');
    await expect(columns).toHaveCount(3);
    
    const socialLinks = footer.locator('.social-link');
    await expect(socialLinks).toHaveCount(3);
  });

  test('Color palette is dark and sophisticated', async ({ page }) => {
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => 
      getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toMatch(/rgb\(\s*\d{1,2}\s*,\s*\d{1,2}\s*,\s*\d{1,2}\s*\)/);
  });

  test('Responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    const navLinks = page.locator('.navbar-links');
    await expect(navLinks).not.toBeVisible();
  });

  test('Typography hierarchy is clear', async ({ page }) => {
    const h1 = page.locator('h1').first();
    const h2 = page.locator('h2').first();
    const p = page.locator('p').first();
    
    const h1Size = await h1.evaluate((el) => 
      parseFloat(getComputedStyle(el).fontSize)
    );
    const h2Size = await h2.evaluate((el) => 
      parseFloat(getComputedStyle(el).fontSize)
    );
    const pSize = await p.evaluate((el) => 
      parseFloat(getComputedStyle(el).fontSize)
    );
    
    expect(h1Size).toBeGreaterThan(h2Size);
    expect(h2Size).toBeGreaterThan(pSize);
  });

  test('No horizontal scroll on any viewport', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 812 },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      
      const hasHorizontalScroll = await page.evaluate(() => 
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});

test.describe('Checklist Summary', () => {
  test('Generate audit report', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const report = {
      checklist: {},
      score: 0,
      total: 0,
    };
    
    report.checklist['Dark color palette'] = await page.evaluate(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        return r < 30 && g < 30 && b < 30;
      }
      return false;
    });
    
    report.checklist['Has gradient backgrounds'] = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const bg = getComputedStyle(el).backgroundImage;
        if (bg.includes('gradient')) return true;
      }
      return false;
    });
    
    report.checklist['Proper whitespace'] = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      for (const section of sections) {
        const padding = parseFloat(getComputedStyle(section).paddingTop);
        if (padding < 48) return false;
      }
      return true;
    });
    
    report.checklist['Clear value proposition'] = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 && h1.textContent.length > 10;
    });
    
    report.checklist['Has CTA buttons'] = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.btn, .store-button');
      return buttons.length >= 2;
    });
    
    report.checklist['Has social proof'] = await page.evaluate(() => {
      const stats = document.querySelectorAll('.stat, .metric-card');
      return stats.length >= 3;
    });
    
    report.checklist['Responsive navigation'] = await page.evaluate(() => {
      const nav = document.querySelector('.navbar');
      return nav !== null;
    });
    
    report.checklist['Footer with links'] = await page.evaluate(() => {
      const footer = document.querySelector('.footer');
      const links = footer?.querySelectorAll('a');
      return links && links.length >= 5;
    });
    
    for (const [key, value] of Object.entries(report.checklist)) {
      report.total++;
      if (value) report.score++;
    }
    
    report.percentage = Math.round((report.score / report.total) * 100);
    
    console.log('\n========================================');
    console.log('LANDING PAGE AUDIT REPORT');
    console.log('========================================\n');
    console.log(`Score: ${report.score}/${report.total} (${report.percentage}%)\n`);
    console.log('Checklist Results:');
    for (const [key, value] of Object.entries(report.checklist)) {
      console.log(`  ${value ? 'PASS' : 'FAIL'} ${key}`);
    }
    console.log('\n========================================\n');
    
    expect(report.percentage).toBeGreaterThanOrEqual(75);
  });
});
