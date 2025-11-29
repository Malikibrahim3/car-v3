import React from 'react'
import './LogoMarquee.css'

function LogoMarquee() {
  const items = [
    'Kelley Blue Book data',
    'NADA values',
    'Real-time market pricing',
    'Auction results',
    'Dealer inventory',
    'Private sale data',
    'Edmunds integration',
    'CarGurus pricing',
  ]

  return (
    <section className="marquee-section">
      <div className="marquee-label">Powered by trusted data sources</div>
      <div className="marquee-container">
        <div className="marquee-track">
          {[...items, ...items].map((item, i) => (
            <div key={i} className="marquee-item">
              <span className="marquee-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LogoMarquee
