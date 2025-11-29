import React, { useState, useEffect, useRef } from 'react'
import './ProductShowcase.css'

const screens = [
  {
    id: 'dashboard',
    title: 'Dashboard overview',
    description: 'See your entire portfolio at a glance. Total value, equity position, and recent changes all in one view.',
    content: (
      <div className="screen-dashboard">
        <div className="dash-header">
          <div className="dash-greeting">Good morning, Alex</div>
          <div className="dash-avatar">A</div>
        </div>
        <div className="dash-portfolio">
          <div className="dash-label">Portfolio Value</div>
          <div className="dash-value">$67,450</div>
          <div className="dash-change positive">+$1,240 this month</div>
        </div>
        <div className="dash-chart">
          <svg viewBox="0 0 200 60" className="mini-chart">
            <path d="M0,50 Q50,45 80,35 T160,25 T200,20" fill="none" stroke="url(#chartGrad)" strokeWidth="2"/>
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="dash-vehicles">
          <div className="dash-vehicle">
            <span className="v-icon">T</span>
            <span className="v-name">Tesla Model 3</span>
            <span className="v-value">$38,500</span>
          </div>
          <div className="dash-vehicle">
            <span className="v-icon">B</span>
            <span className="v-name">BMW X5</span>
            <span className="v-value">$28,950</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'vehicle',
    title: 'Vehicle details',
    description: 'Dive deep into each vehicle. Track value history, loan balance, and equity over time.',
    content: (
      <div className="screen-vehicle">
        <div className="veh-header">
          <div className="veh-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </div>
          <div className="veh-title">2022 Tesla Model 3</div>
          <div className="veh-more">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </div>
        </div>
        <div className="veh-hero">
          <div className="veh-value">$38,500</div>
          <div className="veh-subtitle">Current Market Value</div>
        </div>
        <div className="veh-stats">
          <div className="veh-stat">
            <div className="vs-label">Purchase</div>
            <div className="vs-value">$42,000</div>
          </div>
          <div className="veh-stat">
            <div className="vs-label">Loan</div>
            <div className="vs-value">$36,100</div>
          </div>
          <div className="veh-stat highlight">
            <div className="vs-label">Equity</div>
            <div className="vs-value positive">+$2,400</div>
          </div>
        </div>
        <div className="veh-timeline">
          <div className="tl-item">
            <div className="tl-dot"></div>
            <div className="tl-content">
              <div className="tl-date">Nov 2024</div>
              <div className="tl-text">Value increased +$800</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-dot"></div>
            <div className="tl-content">
              <div className="tl-date">Oct 2024</div>
              <div className="tl-text">Mileage updated to 24k</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'forecast',
    title: 'Value forecasting',
    description: 'See into the future. Know exactly when you will reach positive equity and the best time to sell.',
    content: (
      <div className="screen-forecast">
        <div className="fc-header">
          <div className="fc-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </div>
          <div className="fc-title">Forecast</div>
        </div>
        <div className="fc-card">
          <div className="fc-label">Break-even date</div>
          <div className="fc-date">March 2025</div>
          <div className="fc-sub">4 months away</div>
        </div>
        <div className="fc-graph">
          <div className="fg-labels">
            <span>Value</span>
            <span>Loan</span>
          </div>
          <svg viewBox="0 0 200 80" className="forecast-chart">
            <path d="M0,20 Q100,35 200,50" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4"/>
            <path d="M0,60 Q100,50 200,35" fill="none" stroke="#22c55e" strokeWidth="2"/>
            <circle cx="140" cy="42" r="4" fill="#8b5cf6"/>
          </svg>
          <div className="fg-marker">
            <div className="fgm-line"></div>
            <div className="fgm-label">Break-even</div>
          </div>
        </div>
        <div className="fc-insight">
          <div className="fci-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div className="fci-text">Best time to sell: June 2025 for maximum equity</div>
        </div>
      </div>
    ),
  },
]

function ProductShowcase() {
  const [activeScreen, setActiveScreen] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = rect.height
      const scrollProgress = -rect.top / (sectionHeight - window.innerHeight)
      
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        const newIndex = Math.min(
          Math.floor(scrollProgress * screens.length),
          screens.length - 1
        )
        setActiveScreen(newIndex)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="product-showcase" id="product" ref={sectionRef}>
      <div className="showcase-sticky">
        <div className="container showcase-container">
          <div className="showcase-content">
            <div className="showcase-tabs">
              {screens.map((screen, index) => (
                <button
                  key={screen.id}
                  className={`showcase-tab ${activeScreen === index ? 'active' : ''}`}
                  onClick={() => setActiveScreen(index)}
                >
                  <span className="tab-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="tab-title">{screen.title}</span>
                </button>
              ))}
            </div>
            
            <div className="showcase-info">
              <h2>{screens[activeScreen].title}</h2>
              <p>{screens[activeScreen].description}</p>
            </div>
          </div>
          
          <div className="showcase-phone">
            <div className="phone-frame-showcase">
              <div className="phone-notch-showcase" />
              <div className="phone-screen-showcase">
                {screens.map((screen, index) => (
                  <div
                    key={screen.id}
                    className={`screen-content ${activeScreen === index ? 'active' : ''}`}
                  >
                    {screen.content}
                  </div>
                ))}
              </div>
            </div>
            <div className="phone-glow-showcase" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase
