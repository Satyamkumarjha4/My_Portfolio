import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Timeline from "../components/Timeline"
import AchievementGrid from "../components/AchievementGrid"
import AboutHero from "../components/AboutHero"
import { usePageMeta } from "../hooks/usePageMeta"

const About: React.FC = () => {
  usePageMeta("/about")
  return (
    <motion.div
      className="bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <AboutHero />
        <Timeline />
        <AchievementGrid />
      </main>
      <Footer />
    </motion.div>
  )
}

export default About
