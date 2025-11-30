import React, { useRef, useEffect } from 'react'
import './HeroThird.css'

// Detect Safari browser (has poor scroll performance with JS parallax)
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

function HeroThird() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    let ticking = false
    
    const updateAnimations = () => {
      const section = sectionRef.current
      const header = headerRef.current
      if (!section || !header) {
        ticking = false
        return
      }

      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      if (rect.top >= windowHeight || rect.bottom <= 0) {
        ticking = false
        return
      }

      const isMobile = window.innerWidth <= 768
      
      // Skip all fade effects on mobile
      if (isMobile) {
        header.style.opacity = 1
        cardRefs.current.forEach((card) => {
          if (card) card.style.opacity = 1
        })
        ticking = false
        return
      }

      // Header fade in as section enters viewport
      const headerFadeInStart = windowHeight * 0.8
      const headerFadeInEnd = windowHeight * 0.3
      let headerOpacity = 1
      
      if (rect.top > headerFadeInEnd && rect.top < headerFadeInStart) {
        headerOpacity = 1 - (rect.top - headerFadeInEnd) / (headerFadeInStart - headerFadeInEnd)
      } else if (rect.top >= headerFadeInStart) {
        headerOpacity = 0
      }
      
      // Header fade out as section scrolls past
      const fadeOutStart = -400
      const fadeOutEnd = -1200
      let fadeTranslateY = 0
      
      if (rect.top <= fadeOutStart && rect.top >= fadeOutEnd) {
        const fadeOutOpacity = 1 - (fadeOutStart - rect.top) / (fadeOutStart - fadeOutEnd)
        headerOpacity = Math.min(headerOpacity, fadeOutOpacity)
        // Only apply parallax transform on non-Safari browsers
        if (!isSafari) {
          fadeTranslateY = (fadeOutStart - rect.top) * 0.3
        }
      } else if (rect.top < fadeOutEnd) {
        headerOpacity = 0
      }
      
      header.style.opacity = Math.max(0, Math.min(1, headerOpacity))
      if (!isSafari) {
        header.style.transform = `translate3d(0, ${fadeTranslateY}px, 0)`
      }

      // Staggered card animations - GPU accelerated
      const delays = [0, 0.08, 0.12, 0.16, 0.20]
      const distances = [100, 80, 120, 100, 90]
      const speeds = [0.7, 0.8, 0.6, 0.75, 0.65]
      
      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const cardProgress = Math.min(1, Math.max(0, 
          (windowHeight * (0.8 - delays[index]) - rect.top) / (windowHeight * speeds[index])
        ))
        
        let cardOpacity = Math.min(1, cardProgress * 1.5)
        
        if (rect.top <= fadeOutStart && rect.top >= fadeOutEnd) {
          const fadeOutOpacity = 1 - (fadeOutStart - rect.top) / (fadeOutStart - fadeOutEnd)
          cardOpacity = Math.min(cardOpacity, fadeOutOpacity)
        } else if (rect.top < fadeOutEnd) {
          cardOpacity = 0
        }
        
        // Only apply parallax transforms on non-Safari browsers
        if (!isSafari) {
          const translateY = (1 - cardProgress) * distances[index]
          const rotateX = (1 - cardProgress) * 5
          const scale = 0.95 + cardProgress * 0.05
          card.style.transform = `translate3d(0, ${translateY}px, 0) rotateX(${rotateX}deg) scale(${scale})`
        }
        
        card.style.opacity = Math.max(0, cardOpacity)
      })
      
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateAnimations)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateAnimations() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const setCardRef = (index) => (el) => { cardRefs.current[index] = el }

  return (
    <section className="hero-third" ref={sectionRef}>
      <div className="ht-container">
        <div className="ht-header" ref={headerRef}>
          <h2 className="ht-title">
            <span className="ht-title-line">Every feature saves you money.</span>
            <span className="ht-title-line ht-title-muted">Here's how.</span>
          </h2>
          <p className="ht-subtitle">From market alerts to service logs, everything in AutoTrack is designed to maximize what you keep when you sell.</p>
        </div>
        <div className="ht-bento-grid">
          <div className="ht-card ht-card-large" ref={setCardRef(0)}>
            <div className="ht-card-hover-gradient"></div>
            <div className="ht-card-content">
              <div className="ht-active-indicator"></div>
              <span className="ht-card-number">01</span>
              <h3 className="ht-card-title">Family Sharing</h3>
              <p className="ht-card-desc">Manage the entire household fleet. Share view-only access with your spouse or financial advisor.</p>
              <div className="ht-user-list">
                <div className="ht-user-item"><div className="ht-avatar ht-avatar-owner">JD</div><div className="ht-user-name">John (Owner)</div></div>
                <div className="ht-user-item"><div className="ht-avatar ht-avatar-viewer">SD</div><div className="ht-user-name">Sarah (Viewer)</div></div>
                <div className="ht-user-item ht-user-item-add">+ Add family member</div>
              </div>
            </div>
          </div>
          <div className="ht-card ht-card-wide" ref={setCardRef(1)}>
            <div className="ht-glow-effect"></div>
            <div className="ht-card-content-wide">
              <div className="ht-security-text">
                <div className="ht-active-indicator"></div>
                <span className="ht-card-number">02</span>
                <h3 className="ht-card-title">Bank-Level Security</h3>
                <p className="ht-card-desc">Your financial data is encrypted (AES-256) and never shared with dealers. We prioritize privacy above all.</p>
              </div>
              <div className="ht-security-icon">
                <svg className="ht-lock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="ht-card ht-card-small" ref={setCardRef(2)}>
            <div className="ht-card-content">
              <div className="ht-active-indicator"></div>
              <span className="ht-card-number">03</span>
              <h3 className="ht-card-title-sm">Market Alerts</h3>
              <p className="ht-card-label">Notify when equity &gt; $5k</p>
              <div className="ht-progress-bar"><div className="ht-progress-fill"></div></div>
              <div className="ht-alert-visual"><div className="ht-alert-dot"></div><span className="ht-alert-text">Alert active</span></div>
            </div>
          </div>
          <div className="ht-card ht-card-small" ref={setCardRef(3)}>
            <div className="ht-card-content">
              <div className="ht-active-indicator"></div>
              <span className="ht-card-number">04</span>
              <h3 className="ht-card-title-sm">Digital Service Log</h3>
              <p className="ht-card-label">Full history = higher resale value.</p>
              <div className="ht-log-visual">
                <div className="ht-log-entry"><span className="ht-log-date">Nov 24</span><span className="ht-log-type">Oil Change</span></div>
                <div className="ht-log-entry"><span className="ht-log-date">Oct 15</span><span className="ht-log-type">Tire Rotation</span></div>
              </div>
              <div className="ht-value-boost">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                <span>Buyers pay more for documented cars</span>
              </div>
            </div>
          </div>
          <div className="ht-card ht-card-wide ht-card-coming-soon" ref={setCardRef(4)}>
            <div className="ht-card-content-wide">
              <div className="ht-tco-text">
                <div className="ht-active-indicator"></div>
                <span className="ht-card-number">05</span>
                <div className="ht-coming-badge">Coming Soon</div>
                <h3 className="ht-card-title">True Cost of Ownership</h3>
                <p className="ht-card-desc">See the full picture: depreciation, fuel, insurance, and maintenance. Know exactly what your car costs you per month.</p>
              </div>
              <div className="ht-tco-preview">
                <div className="ht-tco-item"><span className="ht-tco-label">Depreciation</span><span className="ht-tco-value">$312/mo</span></div>
                <div className="ht-tco-item"><span className="ht-tco-label">Fuel</span><span className="ht-tco-value">$180/mo</span></div>
                <div className="ht-tco-item"><span className="ht-tco-label">Insurance</span><span className="ht-tco-value">$145/mo</span></div>
                <div className="ht-tco-divider"></div>
                <div className="ht-tco-item ht-tco-total"><span className="ht-tco-label">Total</span><span className="ht-tco-value">$637/mo</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroThird
