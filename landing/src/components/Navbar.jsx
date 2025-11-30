import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useOptimizedScroll } from '../hooks/useOptimizedScroll'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [lightSection, setLightSection] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const modalRef = useRef(null)
  const pricingRef = useRef(null)
  const menuRef = useRef(null)

  // Cache pricing section reference
  useEffect(() => {
    pricingRef.current = document.querySelector('.pricing-section')
  }, [])

  const handleScroll = useCallback(() => {
    const isMobile = window.innerWidth <= 768
    setScrolled(window.scrollY > (isMobile ? 10 : 100))
    
    const pricing = pricingRef.current
    let inLightSection = false
    
    if (pricing) {
      const rect = pricing.getBoundingClientRect()
      if (rect.top < 60 && rect.bottom > 0) inLightSection = true
    }
    
    setLightSection(inLightSection)
  }, [])

  useOptimizedScroll(handleScroll, [], 32) // 32ms throttle for navbar (less critical)

  // Direct scroll listener as backup
  useEffect(() => {
    const onScroll = () => {
      const isMobile = window.innerWidth <= 768
      setScrolled(window.scrollY > (isMobile ? 10 : 100))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDownloadOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setModalOpen(false)
    }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false)
      }
    }
    if (modalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  const navClass = `navbar ${scrolled ? 'scrolled' : ''} ${lightSection ? 'light-section' : ''}`

  return (
    <nav className={navClass}>
      <div className="navbar-content">
        <div className="navbar-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span>AutoTrack</span>
        </div>

        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#showcase">How it works</a>
          <a href="#pricing">Pricing</a>
          <button className="navbar-download-btn" onClick={() => setModalOpen(true)}>Download</button>
          
          <div className="navbar-mobile-download" ref={dropdownRef}>
            <button 
              className="navbar-download-trigger"
              onClick={() => setDownloadOpen(!downloadOpen)}
              aria-expanded={downloadOpen}
              aria-haspopup="true"
            >
              Download
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {downloadOpen && (
              <div className="navbar-download-dropdown">
                <a href="#ios" className="navbar-dropdown-item" onClick={() => setDownloadOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>iOS</span>
                </a>
                <div className="navbar-dropdown-item navbar-dropdown-coming-soon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341c-.5 0-.908.406-.908.908s.408.908.908.908.908-.406.908-.908-.408-.908-.908-.908zm-11.046 0c-.5 0-.908.406-.908.908s.408.908.908.908.908-.406.908-.908-.408-.908-.908-.908zm11.4-6.744l1.959-3.392c.108-.188.044-.428-.144-.536-.188-.108-.428-.044-.536.144l-1.984 3.435c-1.504-.687-3.196-1.071-5.172-1.071s-3.668.384-5.172 1.071L4.844 4.813c-.108-.188-.348-.252-.536-.144-.188.108-.252.348-.144.536l1.959 3.392C2.79 10.424.5 13.868.5 17.818h23c0-3.95-2.29-7.394-5.623-9.221z"/>
                  </svg>
                  <span>Android <span className="coming-soon-badge">Soon</span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="navbar-cta" onClick={() => setModalOpen(true)}>Get Started</button>
      </div>

      {modalOpen && (
        <div className="navbar-modal-overlay">
          <div className="navbar-modal" ref={modalRef}>
            <button className="navbar-modal-close" onClick={() => setModalOpen(false)} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <div className="navbar-modal-content">
              <div className="navbar-modal-qr">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://apps.apple.com/app/autotrack&bgcolor=ffffff&color=000000" 
                  alt="Scan to download AutoTrack on iOS"
                  loading="lazy"
                />
              </div>
              
              <div className="navbar-modal-text">
                <h3>Get AutoTrack</h3>
                <p>Scan the QR code with your iPhone camera to download AutoTrack from the App Store.</p>
                
                <div className="navbar-modal-platforms">
                  <div className="navbar-modal-platform navbar-modal-platform-active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span>Available on iOS</span>
                  </div>
                  <div className="navbar-modal-platform navbar-modal-platform-soon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.341c-.5 0-.908.406-.908.908s.408.908.908.908.908-.406.908-.908-.408-.908-.908-.908zm-11.046 0c-.5 0-.908.406-.908.908s.408.908.908.908.908-.406.908-.908-.408-.908-.908-.908zm11.4-6.744l1.959-3.392c.108-.188.044-.428-.144-.536-.188-.108-.428-.044-.536.144l-1.984 3.435c-1.504-.687-3.196-1.071-5.172-1.071s-3.668.384-5.172 1.071L4.844 4.813c-.108-.188-.348-.252-.536-.144-.188.108-.252.348-.144.536l1.959 3.392C2.79 10.424.5 13.868.5 17.818h23c0-3.95-2.29-7.394-5.623-9.221z"/>
                    </svg>
                    <span>Android coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile floating buttons - always visible on mobile */}
      <div className="mobile-floating-buttons">
        <div className="floating-menu-wrapper" ref={menuRef}>
          <button 
            className="floating-btn floating-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </button>
          {menuOpen && (
            <div className="floating-menu-dropdown">
              <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#showcase" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            </div>
          )}
        </div>
        <button className="floating-btn floating-download-btn" onClick={() => setModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download
        </button>
      </div>
    </nav>
  )
}

export default Navbar
