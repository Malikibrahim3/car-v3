import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './ValueChart.css'

const data = [
  { month: 'Jan', value: 45000, equity: -5000 },
  { month: 'Feb', value: 44200, equity: -4200 },
  { month: 'Mar', value: 43500, equity: -3500 },
  { month: 'Apr', value: 42800, equity: -2800 },
  { month: 'May', value: 42200, equity: -2200 },
  { month: 'Jun', value: 41800, equity: -1800 },
  { month: 'Jul', value: 41500, equity: -1500 },
  { month: 'Aug', value: 41300, equity: -1300 },
  { month: 'Sep', value: 41200, equity: -1200 },
  { month: 'Oct', value: 41100, equity: -1100 },
  { month: 'Nov', value: 41000, equity: -1000 },
  { month: 'Dec', value: 40900, equity: -900 },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-value">${payload[0].value.toLocaleString()}</p>
        <p className="tooltip-label">{payload[0].payload.month}</p>
      </div>
    )
  }
  return null
}

function ValueChart() {
  return (
    <div className="value-chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <span className="chart-icon">📈</span>
          <span>Value Over Time</span>
        </div>
        <div className="chart-current">
          <span className="current-value">$40,900</span>
          <span className="current-change negative">-$4.1k this year</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5E6AD2" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#5E6AD2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="month" 
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: '11px' }}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: '11px' }}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#5E6AD2" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="chart-footer">
        <div className="chart-insight">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Track depreciation and know exactly when to sell</span>
        </div>
      </div>
    </div>
  )
}

export default ValueChart
