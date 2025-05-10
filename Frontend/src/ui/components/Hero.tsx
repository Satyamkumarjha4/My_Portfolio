import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Window from "./Window"
import ProfileImage from "./ProfileImage"


const Hero: React.FC = () => {
  const titles = [
    "AI Enthusiast",
    "ML Engineer",
    "Full-Stack Developer",
    "Data Analyst",
    "Problem Solver",
    "React Developer",
    "Software Engineer",
    "Tech Explorer",
    "Python Developer",
  ]

  const [displayText, setDisplayText] = useState("")
  const [titleIndex, setTitleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)
  const [showWindow, setShowWindow] = useState(true)

  const handleTyping = useCallback(() => {
    const currentTitle = titles[titleIndex]
    const shouldDelete = isDeleting

    setDisplayText((prev) => {
      if (!shouldDelete && prev === currentTitle) {
        // Full word is typed, pause before deleting
        setIsDeleting(true)
        setTypingSpeed(750) // Pause at the end before deleting
        return prev
      }

      if (shouldDelete && prev === "") {
        // Finished deleting, move to next word
        setIsDeleting(false)
        setTypingSpeed(100) // Reset typing speed
        setTitleIndex((titleIndex + 1) % titles.length)
        return ""
      }

      if (shouldDelete) {
        // Delete character
        setTypingSpeed(50) // Delete faster than typing
        return prev.substring(0, prev.length - 1)
      }

      // Add character
      return currentTitle.substring(0, prev.length + 1)
    })
  }, [titleIndex, isDeleting, titles])

  useEffect(() => {
    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, handleTyping, typingSpeed])

  const toggleDisplay = () => {
    setShowWindow((prev) => !prev)
  }

  return (
    <>
      <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-900">
        {/* Left Section: Text Content */}
        <motion.div
          className="md:w-1/2 w-full text-white flex items-center justify-center px-6 py-16"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Text Content */}
          <div className="max-w-3xl">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hi, I'm <br />
              <span className="text-indigo-500">Satyam Kumar Jha</span>
            </motion.h1>
            <motion.h3
              className="text-3xl md:text-4xl font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              I'm not just a{" "}
              <span className="text-indigo-400 font-bold">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </motion.h3>
            <motion.p
              className="text-lg md:text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              A driven Computer Science & Engineering student specializing in AI/ML and full-stack development. Skilled
              in Python, SQL, React, Express, TypeScript and building intelligent systems using Machine Learning and
              Deep Learning. Passionate about data-driven problem solving and scalable solutions. Adept at database
              management and API integration, with a hands-on approach to learning, experimenting, and innovating with
              emerging technologies.
            </motion.p>
            <motion.div
              className="flex flex-col md:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.button
                className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="/Contact">Get in Touch</a>
              </motion.button>
              <motion.button
                className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="/Projects">View Projects</a>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Section: Window/Profile Image Toggle */}
        <motion.div
          className="md:w-1/2 w-full text-white flex items-center justify-center px-6 py-16 bg-gray-900"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full h-96">
            <AnimatePresence mode="wait">
              {showWindow ? (
                <motion.div
                  key="window"
                  className="absolute top-0 w-full h-full cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  onClick={toggleDisplay}
                  whileHover={{
                    scale: 1.02,
                  }}
                >
                  
                  <Window />
                </motion.div>
              ) : (
                <motion.div
                  key="profile"
                  className="absolute top-0 w-full h-full flex items-center justify-center cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  onClick={toggleDisplay}
                  whileHover={{
                    
                    scale: 1.02,
                  }}
                >
                  
                  <ProfileImage />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Hero
