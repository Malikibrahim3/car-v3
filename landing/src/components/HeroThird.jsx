import React, { useEffect, useRef } from 'react'
import './HeroThird.css'

function HeroThird() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)
  const card4Ref = useRef(null)
  const card5Ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !headerRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Only apply effects when section is in view
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Header fade-in as it enters viewport
        const headerFadeInStart = windowHeight * 0.8
        const headerFadeInEnd = windowHeight * 0.3
        let headerOpacity = 1
        
        if (rect.top > headerFadeInEnd && rect.top < headerFadeInStart) {
          // Fade in as section enters
          headerOpacity = 1 - (rect.top - headerFadeInEnd) / (headerFadeInStart - headerFadeInEnd)
        } else if (rect.top >= headerFadeInStart) {
          headerOpacity = 0
        }
        
        // Fade out when scrolling past - much slower, starts later
        const fadeOutStart = -400
        const fadeOutEnd = -1200
        if (rect.top <= fadeOutStart && rect.top >= fadeOutEnd) {
          const fadeOutOpacity = 1 - (fadeOutStart - rect.top) / (fadeOutStart - fadeOutEnd)
          headerOpacity = Math.min(headerOpacity, fadeOutOpacity)
          const fadeTranslateY = (fadeOutStart - rect.top) * 0.3
          headerRef.current.style.transform = `translateY(${fadeTranslateY}px)`
        } else if (rect.top < fadeOutEnd) {
          headerOpacity = 0
        } else if (rect.top > fadeOutStart) {
          headerRef.current.style.transform = 'translateY(0)'
        }
        
        headerRef.current.style.opacity = Math.max(0, Math.min(1, headerOpacity))

        // Individual card parallax with staggered timing
        const cards = [card1Ref, card2Ref, card3Ref, card4Ref, card5Ref]
        const delays = [0, 0.08, 0.12, 0.16, 0.20]
        const distances = [100, 80, 120, 100, 90]
        const speeds = [0.7, 0.8, 0.6, 0.75, 0.65]
        
        cards.forEach((cardRef, index) => {
          if (!cardRef.current) return
          
          // Each card has its own progress with delay
          const cardProgress = Math.min(1, Math.max(0, 
            (windowHeight * (0.8 - delays[index]) - rect.top) / (windowHeight * speeds[index])
          ))
          
          // Rise up from below with different distances
          const translateY = (1 - cardProgress) * distances[index]
          // Slight rotation for depth
          const rotateX = (1 - cardProgress) * 5
          // Scale up slightly as it comes in
          const scale = 0.95 + cardProgress * 0.05
          
          // Fade in based on card progress
          let cardOpacity = Math.min(1, cardProgress * 1.5)
          
          // Fade out when scrolling past
          if (rect.top <= fadeOutStart && rect.top >= fadeOutEnd) {
            const fadeOutOpacity = 1 - (fadeOutStart - rect.top) / (fadeOutStart - fadeOutEnd)
            cardOpacity = Math.min(cardOpacity, fadeOutOpacity)
          } else if (rect.top < fadeOutEnd) {
            cardOpacity = 0
          }
          
          cardRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`
          cardRef.current.style.opacity = Math.max(0, cardOpacity)
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="hero-third" ref={sectionRef}>
      <div className="ht-container">
        {/* SECTION HEADER */}
        <div className="ht-header" ref={headerRef}>
          <h2 className="ht-title">
            <span className="ht-title-line">Every feature saves you money.</span>
            <span className="ht-title-line ht-title-muted">Here's how.</span>
          </h2>
          <p className="ht-subtitle">
            From market alerts to service logs, everything in AutoTrack is designed to maximize what you keep when you sell.
          </p>
          
        </div>

        {/* THE BENTO GRID */}
        <div className="ht-bento-grid">
          {/* CARD 1: FAMILY FLEET Large, spans 2 rows */}
          <div className="ht-card ht-card-large" ref={card1Ref}>
            <div className="ht-card-hover-gradient"></div>
            <div className="ht-card-content">
              <div className="ht-active-indicator"></div>
              <span className="ht-card-number">01</span>
              <h3 className="ht-card-title">Family Sharing</h3>
              <p className="ht-card-desc">
                Manage the entire household fleet. Share view-only access with your spouse or financial advisor.
              </p>
              
              {/* Visual: User Avatars List */}
              <div className="ht-user-list">
                <div className="ht-user-item">
                  <div className="ht-avatar ht-avatar-owner">JD</div>
                  <div className="ht-user-name">John (Owner)</div>
                </div>
                <div className="ht-user-item">
                  <div className="ht-avatar ht-avatar-viewer">SD</div>
                  <div className="ht-user-name">Sarah (Viewer)</div>
                </div>
                <div className="ht-user-item ht-user-item-add">
                  + Add family member
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: SECURITY Wide */}
          <div className="ht-card ht-card-wide" ref={card2Ref}>
            <div className="ht-glow-effect"></div>
            <div className="ht-card-content-wide">
              <div className="ht-security-text">
                <div className="ht-active-indicator"></div>
                <span className="ht-card-number">02</span>
                <h3 className="ht-card-title">Bank-Level Security</h3>
                <p className="ht-card-desc">
                  Your financial data is encrypted (AES-256) and never shared with dealers. We prioritize privacy above all.
                </p>
              </div>
              
              {/* Visual: Lock/Shield Icon */}
              <div className="ht-security-icon">
                <svg className="ht-lock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* CARD 3: SMART ALERTS */}
          <div className="ht-card ht-card-small" ref={card3Ref}>
            <div className="ht-card-content">
              <div className="ht-active-indicator"></div>
              <span className="ht-card-number">03</span>
              <h3 className="ht-card-title-sm">Market Alerts</h3>
              <p className="ht-card-label">Notify when equity &gt; $5k</p>
              
              <div className="ht-progress-bar">
                <div className="ht-progress-fill"></div>
              </div>
              
              <div className="ht-alert-visual">
                <div className="ht-alert-dot"></div>
                <span className="ht-alert-text">Alert active</span>
              </div>
            </div>
          </div>

          {/* CARD 4: MAINTENANCE LOG */}
          <div className="ht-card ht-card-small" ref={card4Ref}>
            <div className="ht-card-content">
              <div className="ht-active-indicator"></div>
              <span className="ht-card-number">04</span>
              <h3 className="ht-card-title-sm">Digital Service Log</h3>
              <p className="ht-card-label">Full history = higher resale value.</p>
              
              {/* Visual: Service entries */}
              <div className="ht-log-visual">
                <div className="ht-log-entry">
                  <span className="ht-log-date">Nov 24</span>
                  <span className="ht-log-type">Oil Change</span>
                </div>
                <div className="ht-log-entry">
                  <span className="ht-log-date">Oct 15</span>
                  <span className="ht-log-type">Tire Rotation</span>
                </div>
              </div>
              
              <div className="ht-value-boost">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
                <span>Buyers pay more for documented cars</span>
              </div>
            </div>
          </div>

          {/* CARD 5: TOTAL COST OF OWNERSHIP Coming Soon */}
          <div className="ht-card ht-card-wide ht-card-coming-soon" ref={card5Ref}>
            <div className="ht-card-content-wide">
              <div className="ht-tco-text">
                <div className="ht-active-indicator"></div>
                <span className="ht-card-number">05</span>
                <div className="ht-coming-badge">Coming Soon</div>
                <h3 className="ht-card-title">True Cost of Ownership</h3>
                <p className="ht-card-desc">
                  See the full picture: depreciation, fuel, insurance, and maintenance. Know exactly what your car costs you per month.
                </p>
              </div>
              
              {/* Visual: Cost breakdown preview */}
              <div className="ht-tco-preview">
                <div className="ht-tco-item">
                  <span className="ht-tco-label">Depreciation</span>
                  <span className="ht-tco-value">$312/mo</span>
                </div>
                <div className="ht-tco-item">
                  <span className="ht-tco-label">Fuel</span>
                  <span className="ht-tco-value">$180/mo</span>
                </div>
                <div className="ht-tco-item">
                  <span className="ht-tco-label">Insurance</span>
                  <span className="ht-tco-value">$145/mo</span>
                </div>
                <div className="ht-tco-divider"></div>
                <div className="ht-tco-item ht-tco-total">
                  <span className="ht-tco-label">Total</span>
                  <span className="ht-tco-value">$637/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroThird
