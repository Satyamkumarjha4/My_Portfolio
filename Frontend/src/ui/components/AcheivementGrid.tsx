import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import AchievementCard, { type AchievementType } from "./AchievementCards"
import { axiosInstance } from "../utils/axios.ts"

// achievements data


interface AchievementGridProps {
  title?: string
  subtitle?: string
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  title = "My Certifications & Achievements",
  subtitle = "A showcase of my professional accomplishments and milestones",
}) => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [achievement, setAchievements] = useState<AchievementType[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [displayedAchievements, setDisplayedAchievements] = useState<AchievementType[]>([])
  
  useEffect(() => {
    const fetchAchievements = async () => {
      const response = await axiosInstance.get("/achievements")
      setAchievements(response.data)
    }
    fetchAchievements()
  }, [])
  // Sort achievements whenever sortOrder changes
  useEffect(() => {
    setIsFiltering(true)
    
    // Use setTimeout to create a visual transition effect
    const timer = setTimeout(() => {
      const sorted = [...achievement].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB
      })
      
      setDisplayedAchievements(sorted)
      setIsFiltering(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [sortOrder, achievement])

  // Initialize displayedAchievements on first render
  useEffect(() => {
    const sorted = [...achievement].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
    
    setDisplayedAchievements(sorted)
  }, [])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900/20 py-16" id="achievements">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h2
              className="text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
            <motion.span
              className="block h-1 w-20 bg-indigo-500 mt-4 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>

          <motion.div
            className="flex items-center mt-6 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition duration-300 border border-transparent hover:border-indigo-500/20"
              onClick={toggleSortOrder}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              disabled={isFiltering}
            >
              <Filter className="h-4 w-4" />
              Sort by: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              {sortOrder === "newest" ? (
                <ChevronDown className="h-4 w-4 ml-2" />
              ) : (
                <ChevronUp className="h-4 w-4 ml-2" />
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isFiltering && (
            <motion.div
              key={sortOrder}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {displayedAchievements.map((achievement) => (
                <motion.div key={achievement.id} variants={itemVariants}>
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {isFiltering && (
          <div className="flex justify-center items-center py-20">
            <motion.div 
              className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AchievementGrid