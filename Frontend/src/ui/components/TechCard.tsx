import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Category, type TechStack, getCategoryIconColor } from "./TechTypes"
import CircularProgress from "./CircularProgress"

interface TechCardProps {
  tech: TechStack
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const TechCard: React.FC<TechCardProps> = ({ tech, isHovered, onMouseEnter, onMouseLeave }) => {
  // Get category color classes
  const getCategoryClasses = (category: Category) => {
    switch (category) {
      case "Languages":
        return "bg-blue-100 border-blue-500 text-blue-700"
      case "Frontend":
        return "bg-purple-100 border-purple-500 text-purple-700"
      case "Python Frameworks":
        return "bg-green-100 border-green-500 text-green-700"
      case "Databases":
        return "bg-red-100 border-red-500 text-red-700"
      case "Data Science":
        return "bg-yellow-100 border-yellow-500 text-yellow-700"
      case "Tools":
        return "bg-indigo-100 border-indigo-500 text-indigo-700"
      default:
        return "bg-gray-100 border-gray-500 text-gray-700"
    }
  }

  const colorClasses = getCategoryClasses(tech.category)
  const [bgClass, borderClass] = colorClasses.split(" ")

  return (
    <motion.div
      className={`flex-shrink-0 w-40 h-48 rounded-lg border-2 ${
        isHovered ? `${bgClass} border-4 ${borderClass} shadow-lg` : "bg-white border-gray-200"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      layout
    >
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="icon"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Large icon when not hovered */}
              <div className={`${getCategoryIconColor(tech.category)} text-5xl mb-3`}>{tech.icon}</div>
              <h3 className="font-medium text-center">{tech.name}</h3>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Smaller icon when hovered */}
              <div className={`${getCategoryIconColor(tech.category)} text-2xl mb-1`}>{tech.icon}</div>
              <h3 className="font-medium text-center text-sm mb-2">{tech.name}</h3>

              {/* Circular progress indicator */}
              <CircularProgress value={tech.proficiency} />

              {/* Description */}
              <p className="text-xs mt-2 text-center line-clamp-2">{tech.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TechCard
