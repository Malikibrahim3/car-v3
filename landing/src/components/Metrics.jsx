import React from 'react'
import './Metrics.css'

const metrics = [
  { value: '50K+', label: 'Active users tracking vehicles' },
  { value: '$2.1B', label: 'Total vehicle value tracked' },
  { value: '98%', label: 'Accuracy vs dealer quotes' },
  { value: '4.9', label: 'App Store rating' },
]

function Metrics() {
  return (
    <section className="metrics">
      <div className="metrics-glow" />
      <div className="container">
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <span className="metric-value">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Metrics
