import type React from "react"
import { motion } from "framer-motion"
import { ChevronDown, Code, Github } from "lucide-react"

const ProjectsHero: React.FC = () => {
  const scrollToProjects = () => {
    // Smooth scroll to the first project
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/10" />

      {/* Animated code particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-indigo-500/10 font-mono text-4xl md:text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          >
            {["</>", "{}", "[]", "//", "&&", "||", "=>", "**", "++"][Math.floor(Math.random() * 9)]}
          </motion.div>
        ))}
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`icon-${i}`}
            className="absolute text-indigo-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 150 - 75],
              y: [0, Math.random() * 150 - 75],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          >
            {i % 2 === 0 ? (
              <Code className="h-12 w-12 md:h-16 md:w-16" />
            ) : (
              <Github className="h-12 w-12 md:h-16 md:w-16" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 z-10 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          My Projects
        </motion.h1>

        <motion.div
          className="w-20 h-1 bg-indigo-500 mx-auto mb-8"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        <motion.p
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Explore my portfolio of projects showcasing my skills in web development, machine learning, and software
          engineering.
        </motion.p>

        <motion.button
          className="flex items-center gap-2 bg-indigo-500 text-white px-8 py-4 rounded-full mx-auto hover:bg-indigo-600 transition-colors"
          onClick={scrollToProjects}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          View My Work
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 1.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <ChevronDown className="h-8 w-8 text-indigo-400" />
      </motion.div>
    </div>
  )
}

export default ProjectsHero
