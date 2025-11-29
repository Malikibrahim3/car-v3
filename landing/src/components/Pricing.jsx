import React from 'react'
import './Pricing.css'

function Pricing() {
  const freeFeatures = [
    "Know exactly when to sell",
    "See potential profit/loss instantly",
    "Get alerts when you hit positive equity",
    "Track depreciation in real-time"
  ]

  const proFeatures = [
    "Everything in Free",
    "Track unlimited vehicles",
    "See total portfolio savings",
    "Export reports for tax/insurance",
    "Priority Support"
  ]

  return (
    <section className="pricing-section">
      <div className="pricing-container">
        {/* HEADLINE */}
        <div className="pricing-header">
          <h2 className="pricing-title">
            Save thousands
            <br />
            <span className="pricing-title-muted">Pay nothing to start</span>
          </h2>
          <p className="pricing-subtitle">
            The app is free. The money you save is yours to keep.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="pricing-grid">
          {/* CARD 1: FREE (The Main Focus) */}
          <div className="pricing-card pricing-card-free">
            <div className="pricing-free-content">
              <div className="pricing-active-indicator"></div>
              <h3 className="pricing-card-name">Single Vehicle</h3>
              <p className="pricing-card-tagline">Save £2,400+ on your next sale.</p>
              
              <div className="pricing-price">
                <span className="pricing-amount">$0</span>
                <span className="pricing-period">/ forever</span>
              </div>

              <ul className="pricing-features">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="pricing-feature-item">
                    <svg className="pricing-check pricing-check-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="pricing-feature-text">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Desktop: QR Code */}
              <div className="pricing-qr-desktop">
                <div className="pricing-qr-wrapper">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://apps.apple.com/app/autotrack&bgcolor=ffffff&color=000000" 
                    alt="Scan to download AutoTrack"
                    className="pricing-qr-code"
                  />
                  <span className="pricing-qr-label">Scan for iOS</span>
                </div>
              </div>
              
              {/* Mobile: Download Button */}
              <a href="https://apps.apple.com/app/autotrack" className="pricing-btn pricing-btn-free pricing-mobile-only">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download for iOS
              </a>
            </div>
          </div>

          {/* CARD 2: PRO (The Upsell) */}
          <div className="pricing-card pricing-card-pro">
            {/* Cool 'Black Card' Gradient Effect */}
            <div className="pricing-pro-gradient"></div>
            <div className="pricing-pro-glow"></div>
            <div className="pricing-pro-glow-bottom"></div>
            
            <div className="pricing-card-content">
              <div className="pricing-active-indicator"></div>
              <div className="pricing-pro-header">
                <h3 className="pricing-card-name">Garage</h3>
                <span className="pricing-badge">Collector</span>
              </div>
              <p className="pricing-card-tagline">Multiply your savings across every car.</p>
              
              <div className="pricing-price">
                <span className="pricing-amount">$4.99</span>
                <span className="pricing-period">/ month</span>
              </div>

              <ul className="pricing-features">
                {proFeatures.map((feature) => (
                  <li key={feature} className="pricing-feature-item">
                    <svg className="pricing-check pricing-check-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="pricing-feature-text">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Desktop: QR Code */}
              <div className="pricing-qr-desktop">
                <div className="pricing-qr-wrapper pricing-qr-pro">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://apps.apple.com/app/autotrack&bgcolor=1a1a1a&color=ffffff" 
                    alt="Scan to download AutoTrack"
                    className="pricing-qr-code"
                  />
                  <span className="pricing-qr-label">Scan for iOS</span>
                </div>
              </div>
              
              {/* Mobile: Download Button */}
              <a href="https://apps.apple.com/app/autotrack" className="pricing-btn pricing-btn-pro pricing-mobile-only">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Start 14-Day Trial
              </a>
              
              <div className="pricing-guarantee">
                <svg className="pricing-guarantee-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>14-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST FOOTER */}
        <div className="pricing-footer">
          <p className="pricing-trust-text">
            No credit card required for free tier. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
