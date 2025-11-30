import React, { useRef, useState, useEffect } from 'react'
import './HeroSecondary.css'

// Detect Safari browser (has poor scroll performance with JS parallax)
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

function HeroSecondary() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const cardsRef = useRef(null)
  const [highlightProgress, setHighlightProgress] = useState(0)

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
    const isMobile = window.innerWidth <= 768
    let ticking = false
    let lastProgress = 0
    
    const updateAnimations = () => {
      const section = sectionRef.current
      if (!section) {
        ticking = false
        return
      }
      
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Only process if section is in view
      if (rect.top >= windowHeight || rect.bottom <= 0) {
        ticking = false
        return
      }
      
      // Skip parallax transforms on Safari, keep only fade effects
      if (!isSafari) {
        // Background parallax - GPU accelerated
        if (bgRef.current) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
          const parallaxY = scrollProgress * 150
          bgRef.current.style.transform = `translate3d(0, ${parallaxY}px, 0) scale(1.15)`
        }
        
        // Cards parallax (desktop only)
        if (cardsRef.current && !isMobile) {
          const scrollProgress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight + rect.height * 0.60)))
          const translateY = scrollProgress * -50
          cardsRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`
        }
        
        // Content parallax
        if (contentRef.current) {
          const fadeStart = 0
          const fadeEnd = -300
          let translateY = 0
          
          if (rect.top <= fadeStart && rect.top >= fadeEnd) {
            translateY = (fadeStart - rect.top) * 0.3
          }
          
          contentRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`
        }
      }
      
      // Fade effects work on all browsers (less expensive)
      if (cardsRef.current) {
        const fadeStart = -280
        const fadeEnd = -700
        let opacity = 1
        if (rect.top <= fadeStart && rect.top >= fadeEnd) {
          opacity = 1 - (fadeStart - rect.top) / (fadeStart - fadeEnd)
        } else if (rect.top < fadeEnd) {
          opacity = 0
        }
        cardsRef.current.style.opacity = Math.max(0, opacity)
      }
      
      if (contentRef.current) {
        const fadeStart = 0
        const fadeEnd = -300
        let opacity = 1
        
        if (rect.top <= fadeStart && rect.top >= fadeEnd) {
          opacity = 1 - (fadeStart - rect.top) / (fadeStart - fadeEnd)
        } else if (rect.top < fadeEnd) {
          opacity = 0
        }
        
        contentRef.current.style.opacity = Math.max(0, opacity)
      }
      
      // Highlight progress - only update state if changed significantly
      const startPoint = windowHeight * 0.6
      const endPoint = windowHeight * 0.11
      let progress = 0
      
      if (rect.top <= startPoint && rect.top >= endPoint) {
        progress = (startPoint - rect.top) / (startPoint - endPoint)
      } else if (rect.top < endPoint) {
        progress = 1
      }
      
      const newProgress = Math.min(1, Math.max(0, progress))
      // Only update if changed by more than 1% to reduce re-renders
      if (Math.abs(newProgress - lastProgress) > 0.01) {
        lastProgress = newProgress
        setHighlightProgress(newProgress)
      }
      
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

  const firstPassClip = Math.min(100, highlightProgress * 200)
  const secondPassClip = Math.max(0, (highlightProgress - 0.5) * 200)

  return (
    <section className="hero-secondary-swiss" ref={sectionRef}>
      <div className="hs-content-wrapper" ref={contentRef}>
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
        
        <p className="hs-subtitle">
          AutoTrack compares your car's live market value against what you owe so you know exactly when selling makes financial sense, not just emotional sense.
        </p>
      </div>

      <div className="hs-container">
        <div className="hs-grid">
          <div className="hs-left-spacer"></div>
          <div className="hs-right-content"></div>
        </div>
      </div>

      <img
        ref={bgRef}
        src="/hero-2-bg.jpg"
        alt="Gas station scene representing car ownership and value tracking"
        className="hs-background-image"
        loading="lazy"
        decoding="async"
      />
      
      <div className="hs-gradient-overlay"></div>

      <div className="hs-bottom-cards" ref={cardsRef}>
        {featureCards.map((card, index) => (
          <div key={index} className={`hs-dark-card ${card.highlight ? 'hs-dark-card-highlight' : ''}`}>
            <div className="hs-card-hover-gradient"></div>
            <div className="hs-card-content">
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
