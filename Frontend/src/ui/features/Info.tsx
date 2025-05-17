"use client"
import InfoHero from "../components/InfoHero"
import Features from "../components/Features"
import FuturePlans from "../components/FuturePlans"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />  
      <InfoHero />
      <Features />
      <FuturePlans />
      <Footer />
    </div>
  )
}
