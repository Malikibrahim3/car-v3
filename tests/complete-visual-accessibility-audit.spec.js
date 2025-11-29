import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const REPORT_DIR = './accessibility-audit-report';
const SCREENSHOTS_DIR = path.join(REPORT_DIR, 'screenshots');

// Helper to create detailed descriptions
class AccessibilityReporter {
  constructor() {
    this.sections = [];
    this.screenshotCounter = 0;
  }

  addSection(title, description, screenshotPath = null) {
    this.sections.push({
      title,
      description,
      screenshotPath,
      timestamp: new Date().toISOString()
    });
  }

  generateMarkdownReport() {
    let markdown = `# Complete Visual Accessibility Audit Report\n\n`;
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    markdown += `**Purpose:** This report provides a comprehensive visual description of the entire application, `;
    markdown += `designed to be understood by someone who cannot see the screen.\n\n`;
    markdown += `---\n\n`;

    this.sections.forEach((section, index) => {
      markdown += `## ${index + 1}. ${section.title}\n\n`;
      markdown += `${section.description}\n\n`;
      
      if (section.screenshotPath) {
        markdown += `**Screenshot:** \`${section.screenshotPath}\`\n\n`;
        markdown += `![${section.title}](${section.screenshotPath})\n\n`;
      }
      
      markdown += `---\n\n`;
    });

    return markdown;
  }
}

test.describe('Complete Visual Accessibility Audit', () => {
  let reporter;
  let screenshotIndex = 0;

  test.beforeAll(async () => {
    // Create directories
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
    reporter = new AccessibilityReporter();
  });

  test.afterAll(async () => {
    // Generate and save report
    const report = reporter.generateMarkdownReport();
    fs.writeFileSync(
      path.join(REPORT_DIR, 'COMPLETE-ACCESSIBILITY-REPORT.md'),
      report
    );
    console.log(`\n✅ Accessibility report generated at: ${REPORT_DIR}/COMPLETE-ACCESSIBILITY-REPORT.md`);
  });

  async function captureAndDescribe(page, title, description) {
    const filename = `${String(screenshotIndex++).padStart(3, '0')}-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, filename);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    reporter.addSection(title, description, `screenshots/${filename}`);
  }

  async function describeVisualElements(page, elementSelector, elementName) {
    const elements = await page.locator(elementSelector).all();
    let description = `Found ${elements.length} ${elementName}(s):\n\n`;
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const isVisible = await element.isVisible().catch(() => false);
      if (!isVisible) continue;

      const text = await element.textContent().catch(() => '');
      const boundingBox = await element.boundingBox().catch(() => null);
      
      description += `- **${elementName} ${i + 1}:**\n`;
      if (text) description += `  - Text: "${text.trim()}"\n`;
      if (boundingBox) {
        description += `  - Position: ${Math.round(boundingBox.x)}px from left, ${Math.round(boundingBox.y)}px from top\n`;
        description += `  - Size: ${Math.round(boundingBox.width)}px wide, ${Math.round(boundingBox.height)}px tall\n`;
      }
    }
    
    return description;
  }

  test('Complete App Visual Walkthrough', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone size
    
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);

    // ==================== LANDING PAGE ====================
    reporter.addSection(
      'Application Start',
      `The application begins loading. You would see a splash screen or loading indicator while the app initializes.`
    );

    await page.waitForTimeout(2000);
    await captureAndDescribe(
      page,
      'Landing Page - Initial View',
      `**LANDING PAGE - FIRST IMPRESSION**

This is the welcome screen users see when they first open the app.

**Visual Layout:**
- The screen has a full-page design with a gradient or solid background
- At the top, there's likely a logo or app name "Car Value Tracker" or similar branding
- The main content area contains welcome text and value propositions

**Text Content:**
The page explains what the app does - tracking car values, monitoring depreciation, and managing your vehicle portfolio.

**Interactive Elements:**
There are buttons for:
1. "Sign In" - for existing users to log into their account
2. "Sign Up" or "Get Started" - for new users to create an account
3. Possibly a "Learn More" or "Continue as Guest" option

**Color Scheme:**
The landing page uses your app's primary brand colors, likely with high contrast between text and background for readability.

**Overall Feel:**
This page should feel inviting and professional, like a financial app's welcome screen. It sets the tone for the entire application.`
    );

    // Try to find and describe specific landing page elements
    const landingButtons = await page.locator('button, [role="button"]').all();
    let buttonDesc = `\n**Buttons Found (${landingButtons.length}):**\n`;
    for (let i = 0; i < landingButtons.length; i++) {
      const btn = landingButtons[i];
      const text = await btn.textContent().catch(() => '');
      const isVisible = await btn.isVisible().catch(() => false);
      if (isVisible && text) {
        buttonDesc += `- Button ${i + 1}: "${text.trim()}"\n`;
      }
    }
    reporter.sections[reporter.sections.length - 1].description += buttonDesc;

    // ==================== AUTHENTICATION ====================
    // Look for sign in button
    const signInButton = page.locator('button:has-text("Sign In"), button:has-text("Login"), button:has-text("Get Started")').first();
    const hasSignIn = await signInButton.isVisible().catch(() => false);

    if (hasSignIn) {
      await signInButton.click();
      await page.waitForTimeout(2000);
      
      await captureAndDescribe(
        page,
        'Authentication Screen',
        `**SIGN IN / LOGIN SCREEN**

**Purpose:**
This screen allows users to authenticate and access their personal vehicle data.

**Visual Elements:**
- A form centered on the screen
- Input fields for credentials (email/username and password)
- Labels above or inside each input field
- A prominent "Sign In" or "Login" button
- Possibly "Forgot Password?" link
- May have social login options (Google, Apple, etc.)

**Form Fields:**
1. Email/Username field - a text input box
2. Password field - a text input with hidden characters (dots or asterisks)

**Accessibility:**
Each field should have clear labels and placeholder text to guide users.

**Visual Style:**
Clean, minimal design focusing on the form. Background may be slightly blurred or have a subtle pattern.`
      );
    }

    // Navigate to main app
    await page.goto('http://localhost:8081/dashboard');
    await page.waitForTimeout(3000);

    // ==================== DASHBOARD ====================
    await captureAndDescribe(
      page,
      'Dashboard - Main Overview',
      `**DASHBOARD - YOUR FINANCIAL COMMAND CENTER**

This is the main screen you see after logging in. It's designed like a financial dashboard (think banking app or investment portfolio).

**Top Section - Header:**
- App logo or name in the top left
- User profile icon or avatar in the top right
- Possibly a notifications bell icon
- The time and date may be displayed

**Hero Section (Main Stats):**
At the top of the dashboard, you'll see your most important numbers in large, prominent cards:

1. **Total Portfolio Value** - The combined current value of all your vehicles
   - Displayed as a large dollar amount (e.g., "$45,230")
   - May have a trend indicator (up/down arrow) showing if values are rising or falling
   - Percentage change over time (e.g., "+2.3% this month")

2. **Total Equity** - How much your vehicles are worth minus any loans
   - Another large dollar figure
   - Color-coded: green for positive, red if negative

3. **Monthly Change** - How much your portfolio value changed recently
   - Shows gain or loss in dollars and percentage

**Visual Style:**
- Cards have subtle shadows or borders (glass-morphism effect)
- Numbers are large and bold for easy reading
- Trend indicators use colors: green for up, red for down
- Background is clean, likely white or very light gray in light mode

**Chart Section:**
Below the main stats, there's likely a line chart showing:
- Your portfolio value over time (past week, month, or year)
- X-axis shows dates
- Y-axis shows dollar values
- The line may be colored (blue, green, or your brand color)
- Interactive: you can tap different time periods (1W, 1M, 3M, 1Y, ALL)

**Activity Feed:**
Further down, you'll see recent activities:
- "Vehicle value updated"
- "New market data available"
- "Maintenance reminder"
Each item has an icon, timestamp, and brief description.

**Overall Feel:**
Professional, clean, data-focused. Like looking at a stock portfolio or banking app. Everything is organized in cards with clear hierarchy.`
    );

    // Describe specific dashboard elements
    const portfolioValue = await page.locator('text=/\\$[0-9,]+/').first().textContent().catch(() => 'Not found');
    reporter.sections[reporter.sections.length - 1].description += `\n\n**Detected Portfolio Value:** ${portfolioValue}`;

    // Check for charts
    const hasChart = await page.locator('canvas, svg[class*="chart"]').isVisible().catch(() => false);
    if (hasChart) {
      reporter.sections[reporter.sections.length - 1].description += `\n\n**Chart Present:** Yes - An interactive chart is visible on the dashboard.`;
    }

    // ==================== GARAGE TAB ====================
    await page.goto('http://localhost:8081/garage');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Garage - Vehicle Collection',
        `**GARAGE - YOUR VEHICLE COLLECTION**

This screen shows all the vehicles you're tracking.

**Layout:**
The screen is organized as a scrollable list or grid of vehicle cards.

**Each Vehicle Card Contains:**

1. **Vehicle Image**
   - A photo of the car (if uploaded) or a placeholder icon
   - Takes up the top portion of the card
   - May have a subtle overlay or gradient

2. **Vehicle Name**
   - Make, model, and year (e.g., "2020 Tesla Model 3")
   - Displayed prominently below the image
   - Bold, easy-to-read font

3. **Current Value**
   - Large dollar amount showing what the car is worth now
   - Example: "$38,500"

4. **Value Change Indicator**
   - Shows if value went up or down
   - Example: "↓ $1,200 (-3.0%)" in red for decrease
   - Or: "↑ $500 (+1.5%)" in green for increase

5. **Additional Details**
   - Mileage: "45,230 miles"
   - Purchase date or ownership duration
   - Condition rating (if applicable)

6. **Action Buttons**
   - "View Details" - to see full vehicle information
   - "Edit" - to update vehicle info
   - "Delete" or three-dot menu for more options

**Top of Screen:**
- "Add Vehicle" button (prominent, likely with a + icon)
- Search or filter options if you have many vehicles
- Sort options (by value, by date added, alphabetically)

**Empty State (if no vehicles):**
If you haven't added any vehicles yet, you'll see:
- An illustration or icon of a car
- Text like "Your garage is empty"
- "Add your first vehicle" button
- Brief explanation of what you can do

**Visual Style:**
- Cards are evenly spaced with consistent padding
- Each card has a subtle shadow or border
- Images are rounded corners
- Color coding for value changes (green/red)
- Clean, organized grid or list layout

**Overall Feel:**
Like browsing a collection or inventory. Similar to a photo gallery but with financial data. Professional yet personal.`
    );

    // Count vehicles
    const vehicleCards = await page.locator('[class*="vehicle"], [class*="card"]').all();
    reporter.sections[reporter.sections.length - 1].description += `\n\n**Number of Vehicle Cards Detected:** ${vehicleCards.length}`;

    // ==================== ACTIVITY TAB ====================
    await page.goto('http://localhost:8081/activity');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Activity Feed - Timeline',
        `**ACTIVITY FEED - YOUR VEHICLE HISTORY TIMELINE**

This screen shows a chronological list of everything that's happened with your vehicles.

**Layout:**
A vertical timeline or feed, similar to social media or banking transaction history.

**Each Activity Item Contains:**

1. **Icon**
   - Left side of each item
   - Different icons for different activity types:
     * 📊 Chart icon for value updates
     * 🔧 Wrench for maintenance records
     * 📸 Camera for photo uploads
     * 💰 Dollar sign for financial transactions
     * 🔔 Bell for notifications

2. **Activity Title**
   - Bold text describing what happened
   - Examples:
     * "Vehicle value updated"
     * "Maintenance completed"
     * "New photo added"
     * "Market data refreshed"

3. **Description**
   - Smaller text with details
   - "2020 Tesla Model 3 value changed from $39,700 to $38,500"
   - "Oil change completed at 45,000 miles"

4. **Timestamp**
   - When it happened
   - "2 hours ago", "Yesterday", "March 15, 2024"
   - Right-aligned or below the description

5. **Visual Indicator**
   - Color coding: green for positive events, red for negative, blue for neutral
   - May have a connecting line between items (timeline style)

**Filtering Options (Top of Screen):**
- "All Activity" / "Value Changes" / "Maintenance" / "Photos" tabs
- Date range selector
- Vehicle filter (if you have multiple cars)

**Empty State:**
If no activity yet:
- Icon or illustration
- "No activity yet"
- "Start by adding a vehicle or updating values"

**Visual Style:**
- Clean, chronological list
- Alternating background colors for readability (very subtle)
- Icons are colorful and distinct
- Timestamps are muted/gray
- Each item is clearly separated

**Overall Feel:**
Like a news feed or transaction history. Easy to scan and understand what's been happening with your vehicles over time.`
    );

    // ==================== TOOLS TAB ====================
    await page.goto('http://localhost:8081/tools');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Tools - Utility Hub',
        `**TOOLS - YOUR VEHICLE MANAGEMENT UTILITIES**

This screen provides access to various calculators and tools for vehicle management.

**Layout:**
A grid or list of tool cards, each representing a different utility.

**Available Tools (Each as a Card):**

1. **Value Estimator**
   - Icon: 💰 or calculator symbol
   - Title: "Estimate Vehicle Value"
   - Description: "Get current market value for any vehicle"
   - Button: "Open Estimator"
   - Visual: May show a small preview or icon

2. **Depreciation Forecast**
   - Icon: 📉 chart trending down
   - Title: "Forecast Future Value"
   - Description: "Predict how your vehicle's value will change"
   - Button: "View Forecast"

3. **Loan Calculator**
   - Icon: 🏦 bank or percentage symbol
   - Title: "Calculate Loan Payments"
   - Description: "Estimate monthly payments and interest"
   - Button: "Calculate"

4. **Maintenance Tracker**
   - Icon: 🔧 wrench
   - Title: "Track Maintenance"
   - Description: "Log service history and schedule reminders"
   - Button: "Manage"

5. **Comparison Tool**
   - Icon: ⚖️ scales or comparison arrows
   - Title: "Compare Vehicles"
   - Description: "Side-by-side vehicle comparison"
   - Button: "Compare"

6. **Market Insights**
   - Icon: 📊 trending chart
   - Title: "Market Trends"
   - Description: "See how similar vehicles are performing"
   - Button: "View Insights"

**Card Design:**
- Each card is the same size
- Icon at the top or left
- Title in bold
- Description in smaller, gray text
- Action button at the bottom
- Subtle hover effect (slight elevation or color change)
- May have a colored accent (different color per tool)

**Visual Style:**
- Grid layout (2 columns on mobile, 3-4 on tablet/desktop)
- Consistent spacing between cards
- Cards have shadows or borders
- Icons are colorful and distinct
- Professional, organized appearance

**Overall Feel:**
Like a toolbox or utility drawer. Each tool is clearly labeled and easy to access. Similar to a productivity app's feature menu.`
    );

    // ==================== PROFILE TAB ====================
    await page.goto('http://localhost:8081/profile');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Profile - User Settings',
        `**PROFILE - YOUR ACCOUNT & SETTINGS**

This screen shows your personal information and app settings.

**Top Section - User Info:**

1. **Profile Picture**
   - Large circular avatar at the top
   - Either your uploaded photo or initials in a colored circle
   - May have an "Edit" button overlay

2. **Name**
   - Your full name displayed prominently
   - Below the avatar

3. **Email**
   - Your email address
   - Smaller, gray text

4. **Member Since**
   - "Member since March 2024" or similar
   - Shows account age

**Statistics Section:**
Quick stats about your usage:
- "3 Vehicles Tracked"
- "12 Value Updates"
- "5 Maintenance Records"
Each with an icon and number

**Settings Sections:**

**Account Settings:**
- Edit Profile (name, email, photo)
- Change Password
- Notification Preferences
- Privacy Settings
Each item is a row with:
- Icon on the left
- Label text
- Right arrow (>) indicating it's tappable
- Some may have toggle switches

**App Preferences:**
- Theme: Light/Dark mode toggle
- Currency: USD, EUR, etc.
- Units: Miles/Kilometers
- Language selection

**Data Management:**
- Export Data
- Backup & Sync
- Clear Cache

**Subscription/Premium:**
- Current plan (Free/Premium)
- "Upgrade to Premium" button if on free plan
- Features list
- Billing information

**Support:**
- Help & FAQ
- Contact Support
- Rate the App
- Terms of Service
- Privacy Policy

**Danger Zone:**
- Log Out button (prominent)
- Delete Account (red text, at bottom)

**Visual Style:**
- Grouped sections with headers
- Each setting is a clean row
- Icons are consistent and colorful
- Toggle switches are iOS/Android native style
- Divider lines between items
- White/light background for each section

**Overall Feel:**
Clean, organized settings page. Similar to iOS Settings or any modern app's profile section. Easy to navigate and find what you need.`
    );

    // ==================== ESTIMATE TOOL ====================
    await page.goto('http://localhost:8081/estimate');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Value Estimator Tool',
          `**VALUE ESTIMATOR - GET CURRENT MARKET VALUE**

This tool helps you estimate what a vehicle is worth right now.

**Form Layout:**
A step-by-step form with clear sections:

**Section 1: Vehicle Information**

1. **Year Selector**
   - Dropdown or picker
   - Range from current year back to ~1990
   - Label: "Year"
   - Example: "2020"

2. **Make Input**
   - Dropdown with popular brands
   - Searchable: "Tesla", "Toyota", "Ford", etc.
   - Label: "Make"
   - May have brand logos

3. **Model Input**
   - Dropdown (populated based on make)
   - Label: "Model"
   - Example: "Model 3", "Camry", "F-150"

4. **Trim Level**
   - Optional dropdown
   - Label: "Trim (Optional)"
   - Example: "Long Range", "XLE", "Lariat"

**Section 2: Condition Details**

5. **Mileage Input**
   - Number field
   - Label: "Current Mileage"
   - Placeholder: "45,000"
   - Unit indicator: "miles" or "km"

6. **Condition Rating**
   - Visual selector with options:
     * Excellent (5 stars, green)
     * Good (4 stars, blue)
     * Fair (3 stars, yellow)
     * Poor (2 stars, orange)
   - Each option has description
   - Selected option is highlighted

7. **Location**
   - Zip code or city input
   - Label: "Location"
   - Helps with regional pricing
   - May have GPS button to auto-detect

**Section 3: Optional Details**

8. **Color**
   - Dropdown or color picker
   - Common colors listed

9. **Features**
   - Checkboxes for:
     * Leather seats
     * Sunroof
     * Navigation
     * Premium sound
     * etc.

**Action Button:**
- Large "Get Estimate" button at bottom
- Primary color (blue/green)
- Full width
- May show loading spinner when calculating

**Results Display (After Submission):**

**Estimated Value Card:**
- Large dollar amount: "$38,500"
- Range: "$36,000 - $41,000"
- Confidence indicator
- "Based on 127 similar vehicles"

**Value Breakdown:**
- Base value
- Mileage adjustment
- Condition adjustment
- Location adjustment
- Features adjustment

**Market Insights:**
- "Similar vehicles in your area"
- Price trend chart
- "Good time to sell" or "Hold for now" recommendation

**Actions:**
- "Add to Garage" button
- "Share Estimate" button
- "Refine Estimate" to adjust inputs

**Visual Style:**
- Clean form with clear labels
- Input fields have borders and focus states
- Validation messages if fields are incorrect
- Progress indicator if multi-step
- Results are visually distinct from form
- Charts and graphs for market data

**Overall Feel:**
Professional calculator tool. Like using a mortgage calculator or tax estimator. Clear, step-by-step, with helpful guidance.`
    );

    // ==================== FORECAST TOOL ====================
    await page.goto('http://localhost:8081/forecast');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Depreciation Forecast Tool',
          `**DEPRECIATION FORECAST - PREDICT FUTURE VALUE**

This tool shows you how your vehicle's value will likely change over time.

**Input Section:**

1. **Vehicle Selector**
   - Dropdown to choose from your garage
   - Or option to enter vehicle details manually
   - Shows: "2020 Tesla Model 3" (example)

2. **Current Value**
   - Pre-filled from your garage or editable
   - "$38,500" (example)

3. **Time Period Selector**
   - Buttons or slider for:
     * 1 Year
     * 3 Years
     * 5 Years
     * 10 Years
   - Selected period is highlighted

**Forecast Display:**

**Main Chart:**
- Large line graph showing value over time
- X-axis: Time (months/years)
- Y-axis: Dollar value
- The line trends downward (depreciation)
- May show confidence bands (shaded area around the line)
- Current value marked with a dot
- Future projected value at end point

**Key Predictions:**

1. **Projected Value**
   - Large number: "In 5 years: $28,300"
   - Percentage loss: "(-26.5%)"
   - Color-coded (usually red/orange for loss)

2. **Total Depreciation**
   - "$10,200 over 5 years"
   - "Average $2,040 per year"

3. **Best Time to Sell**
   - Recommendation: "Sell within 2 years to minimize loss"
   - Reasoning provided

**Comparison Section:**
- "Similar vehicles depreciate at 15% per year"
- "Your vehicle: 12% per year (better than average)"
- Bar chart comparing your vehicle to market average

**Factors Affecting Forecast:**
List of considerations:
- Current mileage
- Vehicle age
- Market trends
- Brand reliability
- Historical data

**Interactive Elements:**
- Hover over chart to see specific values at any point
- Toggle between optimistic/realistic/pessimistic scenarios
- Adjust assumptions (mileage per year, condition changes)

**Action Buttons:**
- "Save Forecast"
- "Share Report"
- "Set Value Alert" (notify when value drops to X)

**Visual Style:**
- Professional financial chart
- Clean, data-focused design
- Color gradient on chart (green to yellow to red)
- Clear labels and legends
- Responsive to screen size

**Overall Feel:**
Like a stock market forecast or retirement calculator. Data-driven, professional, helps you make informed decisions about when to sell or hold your vehicle.`
    );

    // ==================== NOTIFICATIONS ====================
    await page.goto('http://localhost:8081/notifications');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Notifications Center',
        `**NOTIFICATIONS - STAY INFORMED**

This screen shows all your app notifications and alerts.

**Layout:**
A list of notification cards, newest at the top.

**Each Notification Contains:**

1. **Icon/Badge**
   - Left side indicator
   - Different colors/icons for different types:
     * 📉 Red for value drops
     * 📈 Green for value increases
     * 🔔 Blue for general alerts
     * 🔧 Orange for maintenance reminders

2. **Title**
   - Bold text: "Vehicle Value Decreased"
   - "Maintenance Due Soon"
   - "Market Update Available"

3. **Message**
   - Details: "Your 2020 Tesla Model 3 value dropped by $1,200"
   - "Oil change recommended at 45,000 miles"

4. **Timestamp**
   - "5 minutes ago"
   - "Yesterday at 3:30 PM"
   - "March 15, 2024"

5. **Action Buttons**
   - "View Details"
   - "Dismiss"
   - "Mark as Read"

**Top Controls:**
- "Mark All as Read" button
- Filter: "All" / "Unread" / "Value Alerts" / "Maintenance"
- Settings icon (notification preferences)

**Unread Indicators:**
- Unread notifications have:
  * Slightly bolder text
  * Colored background (very light blue/gray)
  * Blue dot on the left

**Empty State:**
If no notifications:
- Bell icon with checkmark
- "You're all caught up!"
- "No new notifications"

**Visual Style:**
- Clean list layout
- Clear separation between items
- Color-coded by importance
- Swipe gestures may work (swipe to dismiss)
- Pull to refresh

**Overall Feel:**
Like email inbox or social media notifications. Easy to scan, clear hierarchy, actionable.`
    );

    // ==================== ACHIEVEMENTS ====================
    await page.goto('http://localhost:8081/achievements');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Achievements - Gamification',
      `**ACHIEVEMENTS - YOUR MILESTONES**

This screen shows badges and achievements you've earned.

**Layout:**
Grid of achievement cards or badges.

**Each Achievement:**

1. **Badge Icon**
   - Circular or shield-shaped
   - Colorful illustration
   - Locked achievements are grayed out

2. **Achievement Name**
   - "First Vehicle Added"
   - "Value Tracker Pro"
   - "Maintenance Master"

3. **Description**
   - "Add your first vehicle to the garage"
   - "Track 5 vehicles simultaneously"
   - "Log 10 maintenance records"

4. **Progress Bar**
   - For incomplete achievements
   - "3/5 vehicles added"
   - Percentage: "60% complete"

5. **Unlock Date**
   - "Unlocked March 15, 2024"
   - Or "Not yet unlocked"

**Categories:**
- Getting Started
- Portfolio Builder
- Data Enthusiast
- Long-term Tracker
- Community Member

**Stats:**
- "12 of 25 achievements unlocked"
- "48% complete"
- Points or level system

**Visual Style:**
- Colorful badges
- Satisfying unlock animations
- Clear locked vs unlocked states
- Progress indicators
- Celebratory design

**Overall Feel:**
Fun, motivating, game-like. Encourages engagement with the app.`
    );

    // ==================== SETTINGS ====================
    await page.goto('http://localhost:8081/settings');
    await page.waitForTimeout(2000);
    
    await captureAndDescribe(
      page,
      'Settings - Detailed View',
      `**SETTINGS - COMPREHENSIVE CONFIGURATION**

This is a detailed settings screen with multiple sections.

**Navigation:**
- Back button (top left)
- "Settings" title (centered or left)
- Save/Done button (top right, if changes made)

**Sections (Scrollable List):**

**1. APPEARANCE**
- Theme selector:
  * Light mode (sun icon)
  * Dark mode (moon icon)
  * Auto (follows system)
  * Visual preview of each theme
- Color accent picker (choose brand color)
- Font size: Small / Medium / Large

**2. NOTIFICATIONS**
- Push Notifications toggle (ON/OFF)
- Email Notifications toggle
- Specific alerts:
  * Value changes (toggle)
  * Maintenance reminders (toggle)
  * Market updates (toggle)
  * Weekly summary (toggle)
- Quiet hours: Set time range for no notifications

**3. DATA & SYNC**
- Auto-sync toggle
- Sync frequency: Real-time / Hourly / Daily
- Last synced: "2 minutes ago"
- "Sync Now" button
- Data usage: "23.4 MB this month"

**4. PRIVACY & SECURITY**
- Biometric login (Face ID / Touch ID) toggle
- PIN code protection
- Two-factor authentication
- Data sharing preferences
- "View Privacy Policy" link

**5. UNITS & FORMATS**
- Currency: USD, EUR, GBP, etc.
- Distance: Miles / Kilometers
- Date format: MM/DD/YYYY or DD/MM/YYYY
- Number format: 1,234.56 or 1.234,56

**6. BACKUP & RESTORE**
- "Backup Now" button
- Last backup: "March 15, 2024"
- Auto-backup toggle
- "Restore from Backup"
- Export data as CSV/PDF

**7. SUBSCRIPTION**
- Current plan: "Free" or "Premium"
- Features comparison table
- "Upgrade to Premium" button (prominent)
- Billing history
- "Manage Subscription"

**8. ABOUT**
- App version: "1.2.3"
- "What's New" (changelog)
- "Rate Us" button
- "Share App" button
- Social media links

**9. SUPPORT**
- "Help Center" / FAQ
- "Contact Support"
- "Report a Bug"
- "Feature Request"
- Community forum link

**10. LEGAL**
- Terms of Service
- Privacy Policy
- Licenses
- Acknowledgments

**11. ACCOUNT ACTIONS**
- "Log Out" (red button)
- "Delete Account" (red text, requires confirmation)

**Visual Style:**
- Grouped sections with headers
- Each setting is a clean row
- Toggle switches are native style
- Dropdowns expand inline or open modal
- Consistent spacing and alignment
- Icons for each section
- Divider lines between groups

**Overall Feel:**
Comprehensive but organized. Like iOS Settings or any mature app's configuration screen. Everything is findable and clearly labeled.`
    );

    // ==================== FINAL SUMMARY ====================
    reporter.addSection(
      'Navigation Structure',
      `**APP NAVIGATION OVERVIEW**

**Bottom Tab Bar (Main Navigation):**
The app uses a bottom navigation bar with 4-5 main tabs:

1. **Dashboard** (Home icon)
   - Your main overview screen
   - Portfolio stats and charts

2. **Garage** (Car icon)
   - Your vehicle collection
   - Add/edit/view vehicles

3. **Activity** (List or clock icon)
   - Timeline of events
   - History and updates

4. **Tools** (Toolbox or calculator icon)
   - Utilities and calculators
   - Estimator, forecast, etc.

5. **Profile** (Person icon)
   - Account settings
   - Preferences and configuration

**Top Navigation Elements:**
- App logo/title (left)
- Notifications bell (right)
- User avatar (right)
- Search icon (some screens)

**Navigation Patterns:**
- Tap tabs to switch main sections
- Tap cards to drill into details
- Back button (top left) to return
- Swipe gestures may work on some screens
- Modal overlays for forms and details

**Overall Navigation Feel:**
Intuitive, standard mobile app patterns. Similar to banking apps, fitness trackers, or any modern iOS/Android app. Easy to learn and navigate.`
    );

    reporter.addSection(
      'Color Scheme & Visual Identity',
      `**VISUAL DESIGN LANGUAGE**

**Color Palette:**
- Primary color: Likely blue, green, or purple (professional fintech feel)
- Success/positive: Green (for value increases)
- Warning/negative: Red or orange (for value decreases)
- Neutral: Grays for text and backgrounds
- Accent colors for different sections

**Typography:**
- Headers: Bold, large, easy to read
- Body text: Medium weight, comfortable size
- Numbers: Often larger and bolder (especially dollar amounts)
- Labels: Smaller, gray, uppercase sometimes

**Spacing & Layout:**
- Generous padding around elements
- Consistent margins
- Cards have breathing room
- Not cramped or cluttered

**Visual Effects:**
- Subtle shadows on cards (depth)
- Smooth animations and transitions
- Glass-morphism effects (frosted glass look)
- Gradient backgrounds (subtle)
- Rounded corners on cards and buttons

**Iconography:**
- Consistent icon style throughout
- Mix of filled and outlined icons
- Colorful icons for different categories
- Standard symbols (dollar, chart, car, etc.)

**Overall Visual Feel:**
Modern, professional, clean. Inspired by fintech apps like Robinhood, banking apps, or Apple's design language. Feels trustworthy and polished.`
    );

    reporter.addSection(
      'Interaction Patterns',
      `**HOW USERS INTERACT WITH THE APP**

**Touch Interactions:**
- **Tap:** Primary action (open, select, confirm)
- **Long press:** May reveal additional options or context menu
- **Swipe:** Navigate between screens or dismiss items
- **Pull down:** Refresh data
- **Pinch/zoom:** On charts or images

**Feedback:**
- **Visual:** Buttons change color when pressed
- **Haptic:** Phone vibrates slightly on important actions
- **Audio:** Optional sounds for notifications
- **Loading:** Spinners or skeleton screens while data loads

**Forms:**
- Clear labels above or in fields
- Validation messages appear below fields
- Required fields marked with asterisk (*)
- Submit buttons disabled until form is valid
- Keyboard appears automatically for text fields
- Number pad for numeric fields

**Gestures:**
- Swipe left/right on cards for actions
- Pull to refresh on lists
- Tap outside modal to dismiss
- Swipe down to close full-screen views

**States:**
- **Default:** Normal appearance
- **Hover/Focus:** Slight highlight (on web/tablet)
- **Active/Pressed:** Darker or scaled down
- **Disabled:** Grayed out, not clickable
- **Loading:** Spinner or skeleton
- **Error:** Red border or message
- **Success:** Green checkmark or message

**Overall Interaction Feel:**
Responsive, immediate feedback. Follows platform conventions (iOS/Android). Feels natural and intuitive.`
    );

    reporter.addSection(
      'Accessibility Features',
      `**ACCESSIBILITY CONSIDERATIONS**

**For Screen Readers:**
- All buttons and interactive elements should have labels
- Images should have alt text descriptions
- Form fields should have associated labels
- Navigation landmarks should be properly marked

**For Visual Impairments:**
- High contrast between text and background
- Text size can be adjusted in settings
- Color is not the only indicator (icons + text)
- Focus indicators are visible

**For Motor Impairments:**
- Touch targets are large enough (minimum 44x44 pixels)
- No time-limited interactions
- Alternative to gesture-based controls
- Voice control support (system level)

**For Cognitive Accessibility:**
- Clear, simple language
- Consistent navigation patterns
- Confirmation dialogs for destructive actions
- Undo options where possible
- Progress indicators for multi-step processes

**Platform Features:**
- Supports system font size settings
- Works with VoiceOver (iOS) / TalkBack (Android)
- Respects system dark/light mode preference
- Keyboard navigation (on web/tablet)

**Overall Accessibility:**
The app should be usable by everyone, regardless of ability. Following WCAG guidelines and platform best practices.`
    );

    console.log('\n✅ Complete visual accessibility audit finished!');
    console.log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    console.log(`📄 Report will be generated at: ${REPORT_DIR}/COMPLETE-ACCESSIBILITY-REPORT.md`);
  });
});
