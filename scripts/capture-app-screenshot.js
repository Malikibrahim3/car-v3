const { chromium } = require('playwright');
const path = require('path');

async function captureAppScreenshot() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro dimensions
    deviceScaleFactor: 3,
  });
  
  const page = await context.newPage();
  
  // Navigate to Expo web version (if running) or create a mock
  // For now, we'll create a visual representation based on the garage code
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          color: #1a1a1a;
          width: 390px;
          height: 844px;
          overflow: hidden;
        }
        .safe-area { padding: 60px 12px 100px; height: 100%; overflow-y: auto; }
        .header {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 20px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .header-title {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }
        .portfolio-card {
          background: linear-gradient(135deg, #0F81A3 0%, #0a5f7a 100%);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 0 40px rgba(15, 129, 163, 0.35);
        }
        .portfolio-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .portfolio-icon {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          background: rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 20px;
        }
        .portfolio-label {
          color: rgba(255,255,255,0.8);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }
        .portfolio-value {
          color: white;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
        }
        .portfolio-stats {
          background: rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 12px;
          margin: 12px 0;
          display: flex;
          justify-content: space-between;
        }
        .stat-item { flex: 1; }
        .stat-label {
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          margin-bottom: 2px;
        }
        .stat-value {
          color: white;
          font-size: 17px;
          font-weight: 700;
        }
        .portfolio-change {
          display: inline-flex;
          align-items: center;
          background: rgba(0,0,0,0.2);
          padding: 6px 12px;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
        }
        .vehicle-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .vehicle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .vehicle-name {
          color: white;
          font-size: 15px;
          font-weight: 700;
        }
        .vehicle-mileage {
          color: rgba(255,255,255,0.6);
          font-size: 12px;
        }
        .vehicle-image {
          width: 100%;
          height: 140px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
        }
        .vehicle-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .vehicle-image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background: linear-gradient(transparent, rgba(0,0,0,0.6));
          color: white;
          font-size: 13px;
          font-weight: 600;
        }
        .vehicle-stats {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 12px;
        }
        .stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
        }
        .stats-row:last-child { margin-bottom: 0; }
        .stat {
          flex: 1;
        }
        .stat-label-small {
          color: rgba(255,255,255,0.6);
          font-size: 11px;
          margin-bottom: 2px;
        }
        .stat-value-large {
          color: white;
          font-size: 17px;
          font-weight: 700;
          display: flex;
          align-items: center;
        }
        .stat-value-medium {
          color: white;
          font-size: 15px;
          font-weight: 600;
        }
        .change-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(239, 68, 68, 0.15);
          padding: 4px 8px;
          border-radius: 6px;
          color: #ef4444;
          font-size: 13px;
          font-weight: 700;
        }
        .equity-positive {
          color: #10b981;
        }
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 8px 0;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .btn {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background: #0F81A3;
          color: white;
        }
        .btn-secondary {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }
      </style>
    </head>
    <body>
      <div class="safe-area">
        <div class="header">
          <div class="header-title">Garage</div>
        </div>

        <div class="portfolio-card">
          <div class="portfolio-header">
            <div class="portfolio-icon">💰</div>
            <div>
              <div class="portfolio-label">Portfolio Value</div>
              <div class="portfolio-value">$131,200</div>
            </div>
          </div>
          
          <div class="portfolio-stats">
            <div class="stat-item">
              <div class="stat-label">Total Equity</div>
              <div class="stat-value">$24,200</div>
            </div>
            <div class="stat-item" style="text-align: right;">
              <div class="stat-label">Loan Balance</div>
              <div class="stat-value">$107,000</div>
            </div>
          </div>
          
          <div class="portfolio-change">
            ↓ -$28,800 (18.0%)
          </div>
        </div>

        <div class="vehicle-card">
          <div class="vehicle-header">
            <div>
              <div class="vehicle-name">2020 Tesla Model 3</div>
              <div class="vehicle-mileage">45,000 miles</div>
            </div>
          </div>
          
          <div class="vehicle-image">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3); font-size: 48px;">
              🚗
            </div>
            <div class="vehicle-image-overlay">
              2020 Tesla Model 3
            </div>
          </div>
          
          <div class="vehicle-stats">
            <div class="stats-row">
              <div class="stat">
                <div class="stat-label-small">Current Value</div>
                <div class="stat-value-large">$32,500</div>
              </div>
              <div class="stat">
                <div class="stat-label-small">Depreciation</div>
                <div class="change-badge">↓ 27.8%</div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="stats-row">
              <div class="stat">
                <div class="stat-label-small">Loan Balance</div>
                <div class="stat-value-medium">$28,000</div>
              </div>
              <div class="stat">
                <div class="stat-label-small">Equity</div>
                <div class="stat-value-medium equity-positive">$4,500</div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-primary">Update Mileage</button>
            <button class="btn btn-secondary">Edit</button>
          </div>
        </div>

        <div class="vehicle-card">
          <div class="vehicle-header">
            <div>
              <div class="vehicle-name">2019 Honda Civic</div>
              <div class="vehicle-mileage">62,000 miles</div>
            </div>
          </div>
          
          <div class="vehicle-image">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3); font-size: 48px;">
              🚙
            </div>
            <div class="vehicle-image-overlay">
              2019 Honda Civic
            </div>
          </div>
          
          <div class="vehicle-stats">
            <div class="stats-row">
              <div class="stat">
                <div class="stat-label-small">Current Value</div>
                <div class="stat-value-large">$18,200</div>
              </div>
              <div class="stat">
                <div class="stat-label-small">Depreciation</div>
                <div class="change-badge">↓ 17.3%</div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="stats-row">
              <div class="stat">
                <div class="stat-label-small">Loan Balance</div>
                <div class="stat-value-medium">$12,000</div>
              </div>
              <div class="stat">
                <div class="stat-label-small">Equity</div>
                <div class="stat-value-medium equity-positive">$6,200</div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-primary">Update Mileage</button>
            <button class="btn btn-secondary">Edit</button>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  
  // Take screenshot
  await page.screenshot({
    path: path.join(__dirname, '../landing/public/app-screenshot.png'),
    fullPage: false,
  });
  
  console.log('Screenshot saved to landing/public/app-screenshot.png');
  
  await browser.close();
}

captureAppScreenshot().catch(console.error);
