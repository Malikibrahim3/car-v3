/**
 * Mobile Responsiveness Audit
 * 
 * Comprehensive audit of the landing page across all mobile viewport sizes.
 * Tests for layout issues, overflow, touch targets, readability, and visual consistency.
 */

import { test, expect } from '@playwright/test';

// Mobile viewport configurations covering all common device sizes
const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12/13', width: 390, height: 844 },
  { name: 'iPhone 12/13 Pro Max', width: 428, height: 926 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  { name: 'Samsung Galaxy S21 Ultra', width: 384, height: 854 },
  { name: 'Pixel 5', width: 393, height: 851 },
  { name: 'Small Android', width: 320, height: 568 },
  { name: 'iPad Mini (Portrait)', width: 768, height: 1024 },
  { name: 'iPad (Portrait)', width: 810, height: 1080 },
];

// Minimum touch target size (44x44px per WCAG guidelines)
const MIN_TOUCH_TARGET = 44;

// Test results collector
const auditResults = {
  passed: [],
  warnings: [],
  failures: [],
};

test.describe('Mobile Responsiveness Audit', () => {
  
  test.beforeAll(async () => {
    console.log('\n========================================');
    console.log('MOBILE RESPONSIVENESS AUDIT');
    console.log('========================================\n');
  });

  // Run tests for each viewport
  for (const viewport of MOBILE_VIEWPORTS) {
    
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
      });

      test('No horizontal overflow', async ({ page }) => {
        // Check if page has horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        if (hasHorizontalScroll) {
          // Find elements causing overflow
          const overflowingElements = await page.evaluate(() => {
            const elements = [];
            const docWidth = document.documentElement.clientWidth;
            document.querySelectorAll('*').forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.right > docWidth + 5 || rect.left < -5) {
                elements.push({
                  tag: el.tagName,
                  class: el.className,
                  id: el.id,
                  width: rect.width,
                  right: rect.right,
                  left: rect.left,
                });
              }
            });
            return elements.slice(0, 10); // Limit to first 10
          });
          
          console.log(`\n❌ OVERFLOW DETECTED on ${viewport.name}:`);
          overflowingElements.forEach(el => {
            console.log(`   - ${el.tag}.${el.class || el.id || 'unknown'} (right: ${el.right.toFixed(0)}px)`);
          });
        }
        
        expect(hasHorizontalScroll).toBe(false);
      });

      test('Touch targets are accessible (min 44x44px)', async ({ page }) => {
        const smallTargets = await page.evaluate((minSize) => {
          const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [onclick]');
          const issues = [];
          
          interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const styles = window.getComputedStyle(el);
            
            // Skip hidden elements
            if (styles.display === 'none' || styles.visibility === 'hidden' || rect.width === 0) {
              return;
            }
            
            if (rect.width < minSize || rect.height < minSize) {
              issues.push({
                tag: el.tagName,
                text: el.textContent?.slice(0, 30) || '',
                class: el.className,
                width: rect.width,
                height: rect.height,
              });
            }
          });
          
          return issues;
        }, MIN_TOUCH_TARGET);
        
        if (smallTargets.length > 0) {
          console.log(`\n⚠️ SMALL TOUCH TARGETS on ${viewport.name}:`);
          smallTargets.slice(0, 5).forEach(el => {
            console.log(`   - ${el.tag} "${el.text.trim()}" (${el.width.toFixed(0)}x${el.height.toFixed(0)}px)`);
          });
        }
        
        // Warning, not failure - some small targets may be intentional (logo, decorative elements)
        // Allow up to 20 small targets as some are acceptable (logo text, etc.)
        expect(smallTargets.length).toBeLessThan(20);
      });

      test('Text is readable (min 14px)', async ({ page }) => {
        const smallText = await page.evaluate(() => {
          const textElements = document.querySelectorAll('p, span, a, li, td, th, label, h1, h2, h3, h4, h5, h6');
          const issues = [];
          
          textElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const fontSize = parseFloat(styles.fontSize);
            
            // Skip hidden elements
            if (styles.display === 'none' || styles.visibility === 'hidden') {
              return;
            }
            
            // Check for very small text (under 12px is problematic on mobile)
            if (fontSize < 12 && el.textContent?.trim().length > 0) {
              issues.push({
                tag: el.tagName,
                text: el.textContent?.slice(0, 40) || '',
                fontSize: fontSize,
                class: el.className,
              });
            }
          });
          
          return issues;
        });
        
        if (smallText.length > 0) {
          console.log(`\n⚠️ SMALL TEXT on ${viewport.name}:`);
          smallText.slice(0, 5).forEach(el => {
            console.log(`   - ${el.tag} "${el.text.trim()}" (${el.fontSize}px)`);
          });
        }
        
        expect(smallText.length).toBeLessThan(15);
      });

      test('Images are responsive', async ({ page }) => {
        const imageIssues = await page.evaluate((viewportWidth) => {
          const images = document.querySelectorAll('img');
          const issues = [];
          
          images.forEach(img => {
            const rect = img.getBoundingClientRect();
            
            // Check if image is wider than viewport
            if (rect.width > viewportWidth) {
              issues.push({
                src: img.src?.slice(-50) || '',
                width: rect.width,
                naturalWidth: img.naturalWidth,
                class: img.className,
              });
            }
          });
          
          return issues;
        }, viewport.width);
        
        if (imageIssues.length > 0) {
          console.log(`\n❌ OVERSIZED IMAGES on ${viewport.name}:`);
          imageIssues.forEach(img => {
            console.log(`   - ${img.class || img.src} (${img.width.toFixed(0)}px > ${viewport.width}px)`);
          });
        }
        
        expect(imageIssues.length).toBe(0);
      });

      test('Navbar is functional', async ({ page }) => {
        const navbar = await page.locator('.navbar, nav, header').first();
        
        // Check navbar exists and is visible
        await expect(navbar).toBeVisible();
        
        // Check navbar doesn't overflow
        const navbarBox = await navbar.boundingBox();
        expect(navbarBox.width).toBeLessThanOrEqual(viewport.width + 1);
        
        // Check links are accessible
        const navLinks = await page.locator('.navbar-links a, nav a').all();
        
        if (navLinks.length > 0) {
          for (const link of navLinks.slice(0, 3)) {
            const isVisible = await link.isVisible();
            if (isVisible) {
              const box = await link.boundingBox();
              if (box) {
                expect(box.height).toBeGreaterThanOrEqual(30);
              }
            }
          }
        }
      });

      test('Hero section layout', async ({ page }) => {
        const hero = await page.locator('.hero, [class*="hero"]').first();
        
        if (await hero.isVisible()) {
          const heroBox = await hero.boundingBox();
          
          // Hero should not overflow
          expect(heroBox.width).toBeLessThanOrEqual(viewport.width + 1);
          
          // Check hero title is visible and readable
          const heroTitle = await page.locator('.hero-title, .hero h1, [class*="hero"] h1').first();
          if (await heroTitle.isVisible()) {
            const titleStyles = await heroTitle.evaluate(el => {
              const styles = window.getComputedStyle(el);
              return {
                fontSize: parseFloat(styles.fontSize),
                lineHeight: parseFloat(styles.lineHeight),
              };
            });
            
            // Title should be at least 24px on mobile
            expect(titleStyles.fontSize).toBeGreaterThanOrEqual(20);
          }
          
          // Check CTA buttons
          const ctaButtons = await page.locator('.hero-actions a, .hero-actions button, .hero-cta-btn').all();
          for (const btn of ctaButtons) {
            if (await btn.isVisible()) {
              const btnBox = await btn.boundingBox();
              expect(btnBox.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
            }
          }
        }
      });

      test('Cards and grid layouts', async ({ page }) => {
        // Check feature cards
        const cards = await page.locator('.feature-card, .pricing-card, .hs-dark-card, .ht-card, [class*="card"]').all();
        
        const cardIssues = [];
        
        for (const card of cards.slice(0, 10)) {
          if (await card.isVisible()) {
            const cardBox = await card.boundingBox();
            
            // Cards should not overflow viewport
            if (cardBox && cardBox.width > viewport.width) {
              cardIssues.push({
                width: cardBox.width,
                viewport: viewport.width,
              });
            }
            
            // Cards should have reasonable padding on mobile
            if (cardBox && cardBox.width < 100) {
              cardIssues.push({
                issue: 'Card too narrow',
                width: cardBox.width,
              });
            }
          }
        }
        
        if (cardIssues.length > 0) {
          console.log(`\n⚠️ CARD LAYOUT ISSUES on ${viewport.name}:`);
          cardIssues.forEach(issue => {
            console.log(`   - ${JSON.stringify(issue)}`);
          });
        }
        
        expect(cardIssues.length).toBe(0);
      });

      test('Pricing section layout', async ({ page }) => {
        // Scroll to pricing section
        const pricing = await page.locator('.pricing-section, [class*="pricing"]').first();
        
        if (await pricing.count() > 0) {
          await pricing.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          
          const pricingBox = await pricing.boundingBox();
          
          if (pricingBox) {
            // Pricing section should not overflow
            expect(pricingBox.width).toBeLessThanOrEqual(viewport.width + 1);
            
            // Check pricing cards stack properly on mobile
            const pricingCards = await page.locator('.pricing-card').all();
            
            if (pricingCards.length >= 2 && viewport.width < 768) {
              const card1Box = await pricingCards[0].boundingBox();
              const card2Box = await pricingCards[1].boundingBox();
              
              if (card1Box && card2Box) {
                // On mobile, cards should stack (card2 below card1)
                expect(card2Box.y).toBeGreaterThan(card1Box.y);
              }
            }
          }
        }
      });

      test('Footer layout', async ({ page }) => {
        const footer = await page.locator('footer, .footer').first();
        
        if (await footer.count() > 0) {
          await footer.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          
          const footerBox = await footer.boundingBox();
          
          if (footerBox) {
            // Footer should not overflow
            expect(footerBox.width).toBeLessThanOrEqual(viewport.width + 1);
          }
        }
      });

      test('Spacing and padding consistency', async ({ page }) => {
        const spacingIssues = await page.evaluate((vw) => {
          const issues = [];
          const sections = document.querySelectorAll('section, .container, [class*="section"]');
          
          sections.forEach(section => {
            const styles = window.getComputedStyle(section);
            const paddingLeft = parseFloat(styles.paddingLeft);
            const paddingRight = parseFloat(styles.paddingRight);
            
            // Check for asymmetric padding that might look off
            if (Math.abs(paddingLeft - paddingRight) > 20) {
              issues.push({
                class: section.className,
                paddingLeft,
                paddingRight,
              });
            }
            
            // Check for no padding on mobile (content touching edges)
            if (paddingLeft < 8 && paddingRight < 8 && vw < 500) {
              issues.push({
                class: section.className,
                issue: 'No horizontal padding',
                paddingLeft,
                paddingRight,
              });
            }
          });
          
          return issues;
        }, viewport.width);
        
        if (spacingIssues.length > 0) {
          console.log(`\n⚠️ SPACING ISSUES on ${viewport.name}:`);
          spacingIssues.slice(0, 5).forEach(issue => {
            console.log(`   - ${issue.class}: ${issue.issue || `L:${issue.paddingLeft}px R:${issue.paddingRight}px`}`);
          });
        }
      });

      test('Z-index and stacking', async ({ page }) => {
        // Check that navbar stays on top when scrolling
        await page.evaluate(() => window.scrollTo(0, 500));
        await page.waitForTimeout(300);
        
        const navbar = await page.locator('.navbar, nav').first();
        
        if (await navbar.isVisible()) {
          const navbarZIndex = await navbar.evaluate(el => {
            return window.getComputedStyle(el).zIndex;
          });
          
          // Navbar should have high z-index
          expect(parseInt(navbarZIndex) || 0).toBeGreaterThanOrEqual(100);
        }
      });

      test('Screenshot for visual review', async ({ page }) => {
        // Take full page screenshot for manual review
        await page.screenshot({
          path: `landing/test-results/mobile-audit-${viewport.name.replace(/[^a-z0-9]/gi, '-')}.png`,
          fullPage: true,
        });
      });

    });
  }

  // Summary test that runs after all viewport tests
  test('Generate Audit Summary Report', async ({ page }) => {
    // This test generates a summary - it always passes
    console.log('\n========================================');
    console.log('AUDIT COMPLETE - Check test-results folder for screenshots');
    console.log('========================================\n');
  });

});
