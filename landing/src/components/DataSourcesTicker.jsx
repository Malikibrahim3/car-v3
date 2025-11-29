import React from 'react'
import './DataSourcesTicker.css'
import { 
  SiPorsche, 
  SiBmw, 
  SiMercedes, 
  SiAudi, 
  SiTesla, 
  SiVolvo,
  SiFord,
  SiToyota,
  SiHonda,
  SiChevrolet
} from 'react-icons/si'

function DataSourcesTicker() {
  const brands = [
    { name: 'Porsche', Icon: SiPorsche },
    { name: 'BMW', Icon: SiBmw },
    { name: 'Mercedes', Icon: SiMercedes },
    { name: 'Audi', Icon: SiAudi },
    { name: 'Tesla', Icon: SiTesla },
    { name: 'Volvo', Icon: SiVolvo },
    { name: 'Ford', Icon: SiFord },
    { name: 'Toyota', Icon: SiToyota },
    { name: 'Honda', Icon: SiHonda },
    { name: 'Chevrolet', Icon: SiChevrolet },
  ]

  return (
    <section className="car-brands-ticker">
      <div className="ticker-label-container">
        <p className="ticker-label">Supports all major manufacturers</p>
        <p className="ticker-trust-line">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Valuations are powered by live market data</span>
        </p>
      </div>
      
      {/* Infinite Marquee */}
      <div className="ticker-marquee">
        <div className="ticker-track">
          {/* First set */}
          {brands.map((brand, index) => (
            <div key={`brand-${index}`} className="ticker-logo" title={brand.name}>
              <brand.Icon />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {brands.map((brand, index) => (
            <div key={`brand-dup-${index}`} className="ticker-logo" title={brand.name}>
              <brand.Icon />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DataSourcesTicker
