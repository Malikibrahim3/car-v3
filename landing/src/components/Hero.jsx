import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useOptimizedScroll } from '../hooks/useOptimizedScroll'
import './Hero.css'

function Hero() {
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const iphoneRef = useRef(null)
  
  // Cache window dimensions to avoid repeated reads
  const windowDimensions = useRef({ width: window.innerWidth, height: window.innerHeight })
  
  // Update dimensions on resize (throttled)
  useEffect(() => {
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        windowDimensions.current = { width: window.innerWidth, height: window.innerHeight }
      }, 100)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const isMobile = windowDimensions.current.width <= 768
    
    // Batch all transforms together using CSS custom properties for better performance
    const bg = bgRef.current
    const content = contentRef.current
    const iphone = iphoneRef.current
    
    if (bg) {
      bg.style.transform = `translate3d(0, ${scrollY * 0.5}px, 0)`
    }
    
    if (iphone) {
      iphone.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`
    }
    
    if (content) {
      const fadeDivisor = isMobile ? 600 : 750
      const opacity = Math.max(0, 1 - scrollY / fadeDivisor)
      const translateY = scrollY * 0.2
      content.style.opacity = opacity
      content.style.transform = `translate3d(0, ${translateY}px, 0)`
    }
  }, [])

  useOptimizedScroll(handleScroll, [], 16)

  return (
    <section className="hero">
      {/* Full bleed background image with parallax */}
      <div className="hero-bg" ref={bgRef}>
        <img 
          src="/hero-bg.jpg" 
          alt="Luxury sports car showcasing automotive excellence" 
          className="hero-bg-image"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
        {/* iPhone mockup in front of car */}
        <div className="hero-iphone-container" ref={iphoneRef}>
          <div className="hero-iphone-blur"></div>
          <img 
            src="/usethis.png" 
            alt="AutoTrack app interface on iPhone" 
            className="hero-iphone"
            loading="eager"
            decoding="async"
          />
        </div>
        {/* Dark gradient overlay fades to black on left */}
        <div className="hero-overlay" />
      </div>
      
      <div className="hero-content" ref={contentRef}>
        <div className="hero-text">
          <p className="hero-tagline">From first cars to dream cars</p>
          
          <h1 className="hero-title">
            Your car is an asset. Treat it like one.
          </h1>
          
          <p className="hero-description">
            Depreciation is predictable if you track it. AutoTrack tells you the exact moment to sell so you keep thousands more in your pocket.
          </p>
          
          <div className="hero-savings-stat">
            <span className="hero-savings-amount">$6,500+</span>
            <span className="hero-savings-label">potential value kept</span>
          </div>
          
          <p className="hero-trust-line">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Powered by real-time market data from 10,000+ listings</span>
          </p>
          
          <div className="hero-actions">
            {/* Desktop: QR Code for iOS App Store */}
            <div className="hero-qr-desktop">
              <div className="hero-qr-container">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://apps.apple.com/app/autotrack&bgcolor=ffffff&color=000000" 
                  alt="Scan to download AutoTrack on iOS"
                  className="hero-qr-code"
                  loading="lazy"
                />
              </div>
              <div className="hero-qr-text">
                <span className="hero-qr-label">Scan to download</span>
                <span className="hero-qr-platform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Available on iOS
                </span>
              </div>
            </div>
            
            {/* Mobile: iOS Download Button */}
            <a href="https://apps.apple.com/app/autotrack" className="hero-cta-btn hero-cta-ios hero-mobile-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Download for iOS</span>
            </a>
            
            {/* Android Coming Soon */}
            <div className="hero-cta-btn hero-cta-android hero-cta-coming-soon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.341c-.5 0-.908.406-.908.908s.408.908.908.908.908-.406.908-.908-.408-.908-.908-.908zm-11.046 0c-.5 0-.908.406-.908.908s.408.908.908.908.908-.406.908-.908-.408-.908-.908-.908zm11.4-6.744l1.959-3.392c.108-.188.044-.428-.144-.536-.188-.108-.428-.044-.536.144l-1.984 3.435c-1.504-.687-3.196-1.071-5.172-1.071s-3.668.384-5.172 1.071L4.844 4.813c-.108-.188-.348-.252-.536-.144-.188.108-.252.348-.144.536l1.959 3.392C2.79 10.424.5 13.868.5 17.818h23c0-3.95-2.29-7.394-5.623-9.221z"/>
              </svg>
              <span>Android Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}

export default Hero
