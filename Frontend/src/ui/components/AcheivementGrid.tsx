import type React from "react"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import AchievementCard, { type AchievementType } from "./AchievementCards"
import { useApi } from "../hooks/useApi"
import { ErrorBlock, EmptyBlock, LoadingBlock } from "./AsyncState"

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
  const { data, loading, error, refetch } = useApi<AchievementType[]>("/achievements")

  const displayedAchievements = useMemo(() => {
    const direction = sortOrder === "newest" ? -1 : 1
    return [...(data ?? [])].sort((a, b) => direction * (new Date(a.date).getTime() - new Date(b.date).getTime()))
  }, [data, sortOrder])

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
          {displayedAchievements.length > 0 && (
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
        
        {loading && <LoadingBlock label="Loading achievements..." />}
        {error && !data && <ErrorBlock message="Couldn't load achievements." onRetry={refetch} />}
        {!loading && !error && displayedAchievements.length === 0 && <EmptyBlock message="No achievements yet." />}
      </div>
    </div>
  )
}

export default AchievementGrid