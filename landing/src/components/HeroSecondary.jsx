import React, { useEffect, useRef, useState } from 'react'
import './HeroSecondary.css'

function HeroSecondary() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const cardsRef = useRef(null)
  const [highlightProgress, setHighlightProgress] = useState(0)

  // Horizontal bottom cards dark, sharp, technical style
  const featureCards = [
    {
      number: '01',
      title: 'See what you\'d lose today',
      desc: 'Instantly know if selling now means paying out of pocket or walking away with cash.',
    },
    {
      number: '02',
      title: 'Know when you\'ll profit',
      desc: 'Our forecasts show exactly when your car becomes worth more than you owe.',
    },
    {
      number: '03',
      title: 'Get alerted to sell',
      desc: 'We\'ll notify you the moment selling becomes profitable. No more guessing.',
      highlight: true,
    },
  ]

  useEffect(() => {
    // Skip parallax effects on mobile
    const isMobile = window.innerWidth <= 768
    
    const handleScroll = () => {
      // Parallax for background image - moves slower than scroll (works on all devices like Hero)
      if (bgRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        // Only apply parallax when section is in view
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
          bgRef.current.style.transform = `translateY(${scrollProgress * 100}px) scale(1.1)`
        }
      }
      
      // Parallax for bottom cards - subtle rise as you scroll down (desktop only)
      if (!isMobile && cardsRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        // Cards rise up slightly as you scroll through the section - 30% more aggressive
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight + rect.height * 0.60)))
          const translateY = scrollProgress * -20 // Move up to 20px as you scroll
          cardsRef.current.style.transform = `translateY(${translateY}px)`
        }
      }
      
      // Fade out cards as they scroll past (works on all devices)
      if (cardsRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        // Fade out cards as they scroll past (when section goes above viewport)
        const fadeStart = -280 // Start fading when section top is 280px above viewport
        const fadeEnd = -700 // Fully faded when section top is 700px above viewport
        if (rect.top <= fadeStart && rect.top >= fadeEnd) {
          const opacity = 1 - (fadeStart - rect.top) / (fadeStart - fadeEnd)
          cardsRef.current.style.opacity = Math.max(0, opacity)
        } else if (rect.top > fadeStart) {
          cardsRef.current.style.opacity = 1
        } else {
          cardsRef.current.style.opacity = 0
        }
      }
      
      // Fade out headline and CTAs as user scrolls past (works on all devices like Hero)
      if (contentRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        // Start fading when section top goes above viewport
        const fadeStart = 0
        const fadeEnd = -300
        if (rect.top <= fadeStart && rect.top >= fadeEnd) {
          const opacity = 1 - (fadeStart - rect.top) / (fadeStart - fadeEnd)
          const translateY = (fadeStart - rect.top) * 0.3
          contentRef.current.style.opacity = Math.max(0, opacity)
          contentRef.current.style.transform = `translateY(${translateY}px)`
        } else if (rect.top > fadeStart) {
          contentRef.current.style.opacity = 1
          contentRef.current.style.transform = 'translateY(0)'
        } else {
          contentRef.current.style.opacity = 0
        }
      }
      
      // Calculate highlight progress based on section visibility
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Slowed down by 35% total - even larger range, starts 10% later
        const startPoint = windowHeight * 0.6
        const endPoint = windowHeight * 0.11
        
        if (rect.top <= startPoint && rect.top >= endPoint) {
          const progress = (startPoint - rect.top) / (startPoint - endPoint)
          setHighlightProgress(Math.min(1, Math.max(0, progress)))
        } else if (rect.top < endPoint) {
          setHighlightProgress(1)
        } else {
          setHighlightProgress(0)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // First pass: 0-50% of scroll (left to right)
  // Second pass: 50-100% of scroll (right to left, backwards)
  const firstPassClip = Math.min(100, highlightProgress * 200)
  const secondPassClip = Math.max(0, (highlightProgress - 0.5) * 200)

  return (
    <section className="hero-secondary-swiss" ref={sectionRef}>
      {/* Content wrapper for fade effect */}
      <div className="hs-content-wrapper" ref={contentRef}>
        {/* 1. HEADLINE POSITIONED ABOVE */}
        <h2 className="hs-headline">
          Sell at the wrong time, lose money.
          <br />
          <span className="hs-highlight-word">
            <span 
              className="hs-highlight-mark hs-highlight-mark-1"
              style={{ clipPath: `inset(0 ${100 - firstPassClip}% 0 0)` }}
            />
            <span 
              className="hs-highlight-mark hs-highlight-mark-2"
              style={{ clipPath: `inset(0 0 0 ${100 - secondPassClip}%)` }}
            />
            We fix that
          </span>
          .
        </h2>
        
        {/* SUBTITLE */}
        <p className="hs-subtitle">
          AutoTrack compares your car's live market value against what you owe so you know exactly when selling makes financial sense, not just emotional sense.
        </p>
        
      </div>

      <div className="hs-container">
        <div className="hs-grid">
          {/* LEFT COLUMN: Empty (Reserved for the Car Visual) */}
          <div className="hs-left-spacer"></div>

          {/* RIGHT COLUMN: Now empty - floating cards handle content */}
          <div className="hs-right-content">
          </div>
        </div>
      </div>

      {/* BACKGROUND IMAGE Gas station in grayscale with parallax */}
      <img
        ref={bgRef}
        src="/hero-2-bg.jpg"
        alt="Gas station scene representing car ownership and value tracking"
        className="hs-background-image"
      />
      
      {/* GRADIENT OVERLAY Fades from transparent at top to black at bottom */}
      <div className="hs-gradient-overlay"></div>

      {/* HORIZONTAL CARDS Dark, Sharp, Technical Style */}
      <div className="hs-bottom-cards" ref={cardsRef}>
        {featureCards.map((card, index) => (
          <div key={index} className={`hs-dark-card ${card.highlight ? 'hs-dark-card-highlight' : ''}`}>
            {/* Subtle Gradient Hover Effect */}
            <div className="hs-card-hover-gradient"></div>
            <div className="hs-card-content">
              {/* Active indicator line glows on hover */}
              <div className="hs-active-indicator"></div>
              <span className="hs-card-number">{card.number}</span>
              <h3 className="hs-card-title">{card.title}</h3>
              <p className="hs-card-desc">{card.desc}</p>
              {card.highlight && (
                <div className="hs-magic-badge">
                  <span className="hs-magic-dot"></span>
                  Your "sell now" moment
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroSecondary
