import React, { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

// Lazy load components below the fold for faster initial load
const DataSourcesTicker = lazy(() => import('./components/DataSourcesTicker'))
const HeroSecondary = lazy(() => import('./components/HeroSecondary'))
const HeroThird = lazy(() => import('./components/HeroThird'))
const Pricing = lazy(() => import('./components/Pricing'))
const Footer = lazy(() => import('./components/Footer'))

// Simple loading fallback
const LoadingFallback = () => (
  <div style={{ minHeight: '100vh', background: '#000' }} />
)

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Suspense fallback={<LoadingFallback />}>
        <DataSourcesTicker />
        <HeroSecondary />
        <HeroThird />
        <Pricing />
        <Footer />
      </Suspense>
    </div>
  )
}

export default App
