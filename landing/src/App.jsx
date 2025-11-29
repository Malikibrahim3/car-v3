import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HeroSecondary from './components/HeroSecondary'
import DataSourcesTicker from './components/DataSourcesTicker'
import HeroThird from './components/HeroThird'
import Pricing from './components/Pricing'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <DataSourcesTicker />
      <HeroSecondary />
      <HeroThird />
      <Pricing />
      <Footer />
    </div>
  )
}

export default App
