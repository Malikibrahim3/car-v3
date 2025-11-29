const { test, expect } = require('@playwright/test');

test.describe('App Cohesion & Consistency Audit', () => {
  let auditReport = {
    typography: [],
    spacing: [],
    colors: [],
    components: [],
    navigation: [],
    overall: [],
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);
  });

  test('Typography Consistency Audit', async ({ page }) => {
    console.log('\n=== TYPOGRAPHY AUDIT ===\n');
    
    const typographyData = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]'));
      const bodyText = Array.from(document.querySelectorAll('p, span, div')).filter(el => {
        const text = el.textContent?.trim();
        return text && text.length > 0 && text.length < 100;
      }).slice(0, 20);
      
      const getFontData = (el) => {
        const styles = window.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
          color: styles.color,
          text: el.textContent?.trim().substring(0, 30),
        };
      };
      
      return {
        headings: headings.map(getFontData),
        body: bodyText.map(getFontData),
      };
    });
    
    // Analyze font sizes
    const fontSizes = new Set([
      ...typographyData.headings.map(h => h.fontSize),
      ...typographyData.body.map(b => b.fontSize),
    ]);
    
    console.log('Font Sizes Found:', Array.from(fontSizes).sort());
    console.log('Total Unique Sizes:', fontSizes.size);
    
    if (fontSizes.size > 8) {
      auditReport.typography.push('⚠️ Too many font sizes (' + fontSizes.size + '). Should be 6-8 max.');
    }
    
    // Analyze font weights
    const fontWeights = new Set([
      ...typographyData.headings.map(h => h.fontWeight),
      ...typographyData.body.map(b => b.fontWeight),
    ]);
    
    console.log('Font Weights Found:', Array.from(fontWeights).sort());
    
    if (fontWeights.size > 4) {
      auditReport.typography.push('⚠️ Too many font weights (' + fontWeights.size + '). Should be 3-4 max.');
    }
    
    // Check for inconsistent letter spacing
    const letterSpacings = new Set(typographyData.headings.map(h => h.letterSpacing));
    console.log('Letter Spacings:', Array.from(letterSpacings));
    
    console.log('\n');
  });

  test('Spacing & Layout Consistency', async ({ page }) => {
    console.log('\n=== SPACING AUDIT ===\n');
    
    const spacingData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[class*="card"], [style*="padding"]')).slice(0, 10);
      
      return cards.map(card => {
        const styles = window.getComputedStyle(card);
        return {
          padding: styles.padding,
          margin: styles.margin,
          borderRadius: styles.borderRadius,
          gap: styles.gap,
        };
      });
    });
    
    const paddings = new Set(spacingData.map(s => s.padding));
    const margins = new Set(spacingData.map(s => s.margin));
    const borderRadii = new Set(spacingData.map(s => s.borderRadius));
    
    console.log('Padding Values:', Array.from(paddings));
    console.log('Margin Values:', Array.from(margins));
    console.log('Border Radius Values:', Array.from(borderRadii));
    
    if (paddings.size > 5) {
      auditReport.spacing.push('⚠️ Too many padding values (' + paddings.size + '). Inconsistent spacing.');
    }
    
    if (borderRadii.size > 4) {
      auditReport.spacing.push('⚠️ Too many border radius values (' + borderRadii.size + '). Should be 2-3 max.');
    }
    
    console.log('\n');
  });

  test('Color Consistency Audit', async ({ page }) => {
    console.log('\n=== COLOR AUDIT ===\n');
    
    const colorData = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*')).slice(0, 100);
      const colors = {
        backgrounds: new Set(),
        text: new Set(),
        borders: new Set(),
      };
      
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.backgrounds.add(styles.backgroundColor);
        }
        if (styles.color) {
          colors.text.add(styles.color);
        }
        if (styles.borderColor && styles.borderColor !== 'rgba(0, 0, 0, 0)') {
          colors.borders.add(styles.borderColor);
        }
      });
      
      return {
        backgrounds: Array.from(colors.backgrounds),
        text: Array.from(colors.text),
        borders: Array.from(colors.borders),
      };
    });
    
    console.log('Background Colors:', colorData.backgrounds.length, 'unique');
    colorData.backgrounds.forEach(c => console.log('  -', c));
    
    console.log('\nText Colors:', colorData.text.length, 'unique');
    colorData.text.forEach(c => console.log('  -', c));
    
    console.log('\nBorder Colors:', colorData.borders.length, 'unique');
    colorData.borders.forEach(c => console.log('  -', c));
    
    if (colorData.backgrounds.length > 10) {
      auditReport.colors.push('⚠️ Too many background colors (' + colorData.backgrounds.length + '). Lacks cohesion.');
    }
    
    if (colorData.text.length > 6) {
      auditReport.colors.push('⚠️ Too many text colors (' + colorData.text.length + '). Should be 3-4 max.');
    }
    
    console.log('\n');
  });

  test('Component Consistency Audit', async ({ page }) => {
    console.log('\n=== COMPONENT AUDIT ===\n');
    
    const componentData = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      const cards = Array.from(document.querySelectorAll('[class*="card"]'));
      const inputs = Array.from(document.querySelectorAll('input, textarea'));
      
      const getButtonStyles = (btn) => {
        const styles = window.getComputedStyle(btn);
        return {
          bg: styles.backgroundColor,
          color: styles.color,
          padding: styles.padding,
          borderRadius: styles.borderRadius,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
        };
      };
      
      return {
        buttons: buttons.map(getButtonStyles),
        buttonCount: buttons.length,
        cardCount: cards.length,
        inputCount: inputs.length,
      };
    });
    
    console.log('Buttons Found:', componentData.buttonCount);
    console.log('Cards Found:', componentData.cardCount);
    console.log('Inputs Found:', componentData.inputCount);
    
    // Check button consistency
    const buttonBgs = new Set(componentData.buttons.map(b => b.bg));
    const buttonSizes = new Set(componentData.buttons.map(b => b.fontSize));
    
    console.log('\nButton Background Colors:', Array.from(buttonBgs));
    console.log('Button Font Sizes:', Array.from(buttonSizes));
    
    if (buttonBgs.size > 4) {
      auditReport.components.push('⚠️ Buttons have ' + buttonBgs.size + ' different backgrounds. Inconsistent.');
    }
    
    if (buttonSizes.size > 3) {
      auditReport.components.push('⚠️ Buttons have ' + buttonSizes.size + ' different sizes. Should be 2-3 max.');
    }
    
    console.log('\n');
  });

  test('Navigation & Tab Bar Audit', async ({ page }) => {
    console.log('\n=== NAVIGATION AUDIT ===\n');
    
    const navData = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"], [role="navigation"] *'));
      const links = Array.from(document.querySelectorAll('a'));
      
      return {
        tabCount: tabs.length,
        linkCount: links.length,
        tabBar: tabs.map(tab => {
          const styles = window.getComputedStyle(tab);
          return {
            bg: styles.backgroundColor,
            color: styles.color,
            text: tab.textContent?.trim(),
          };
        }),
      };
    });
    
    console.log('Tabs Found:', navData.tabCount);
    console.log('Links Found:', navData.linkCount);
    
    if (navData.tabBar.length > 0) {
      console.log('\nTab Bar Items:');
      navData.tabBar.forEach(tab => {
        console.log('  -', tab.text, '| BG:', tab.bg, '| Color:', tab.color);
      });
    }
    
    console.log('\n');
  });

  test('Visual Hierarchy Audit', async ({ page }) => {
    console.log('\n=== VISUAL HIERARCHY AUDIT ===\n');
    
    await page.screenshot({ path: 'test-results/cohesion-full-page.png', fullPage: true });
    
    const hierarchyData = await page.evaluate(() => {
      const allText = Array.from(document.querySelectorAll('*'))
        .filter(el => el.textContent && el.textContent.trim().length > 0)
        .slice(0, 50);
      
      const hierarchy = allText.map(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = parseInt(styles.fontWeight);
        
        return {
          text: el.textContent?.trim().substring(0, 30),
          fontSize,
          fontWeight,
          color: styles.color,
          score: fontSize * (fontWeight / 400), // Visual weight score
        };
      }).sort((a, b) => b.score - a.score);
      
      return hierarchy.slice(0, 10); // Top 10 most prominent elements
    });
    
    console.log('Visual Hierarchy (Most Prominent First):');
    hierarchyData.forEach((item, i) => {
      console.log(`${i + 1}. "${item.text}" | ${item.fontSize}px | Weight: ${item.fontWeight} | Score: ${item.score.toFixed(1)}`);
    });
    
    // Check if hierarchy makes sense
    const topElement = hierarchyData[0];
    if (topElement && topElement.fontSize < 24) {
      auditReport.overall.push('⚠️ Largest text is only ' + topElement.fontSize + 'px. Weak visual hierarchy.');
    }
    
    console.log('\n');
  });

  test('Cohesion Issues Summary', async ({ page }) => {
    console.log('\n=== COHESION ISSUES SUMMARY ===\n');
    
    const allIssues = [
      ...auditReport.typography,
      ...auditReport.spacing,
      ...auditReport.colors,
      ...auditReport.components,
      ...auditReport.navigation,
      ...auditReport.overall,
    ];
    
    if (allIssues.length === 0) {
      console.log('✅ No major cohesion issues found!');
    } else {
      console.log('Found ' + allIssues.length + ' cohesion issues:\n');
      allIssues.forEach(issue => console.log(issue));
    }
    
    // Take screenshots for visual reference
    await page.screenshot({ path: 'test-results/cohesion-viewport.png' });
    
    console.log('\n📸 Screenshots saved to test-results/');
    console.log('\n=== END OF AUDIT ===\n');
  });
});
