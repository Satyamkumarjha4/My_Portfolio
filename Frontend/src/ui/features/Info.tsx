import InfoHero from "../components/InfoHero"
import Features from "../components/Features"
import FuturePlans from "../components/FuturePlans"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { usePageMeta } from "../hooks/usePageMeta"

export default function InfoPage() {
  usePageMeta("/info")
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />  
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <InfoHero />
        <Features />
        <FuturePlans />
      </main>
      <Footer />
    </div>
  )
}
