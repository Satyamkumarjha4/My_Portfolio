import InfoHero from "../components/InfoHero"
import Features from "../components/Features"
import FuturePlans from "../components/FuturePlans"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { usePageMeta } from "../hooks/usePageMeta"

export default function InfoPage() {
  usePageMeta('About this site', 'How this portfolio is built: React, Express, Prisma and PostgreSQL, and what is planned next.')
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
