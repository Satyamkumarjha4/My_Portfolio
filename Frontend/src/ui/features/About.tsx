"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Timeline from "../components/Timeline"
import AchievementGrid from "../components/AcheivementGrid"
import AboutHero from "../components/AboutHero"

const About: React.FC = () => {
  return (
    <motion.div
      className="bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <AboutHero />
      <Timeline />
      <AchievementGrid />
      <Footer />
    </motion.div>
  )
}

export default About
