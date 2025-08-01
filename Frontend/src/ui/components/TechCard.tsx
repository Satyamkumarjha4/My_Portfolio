import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Category, type TechStack, getCategoryIconColor } from "./TechTypes"
import CircularProgress from "./CircularProgress"
import { FaPython, FaJava, FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt } from "react-icons/fa"
import { SiFlask, SiStreamlit, SiKeras, SiTensorflow, SiNumpy, SiPandas, SiMongodb, SiPostman, SiTailwindcss, SiTypescript, SiFramer } from "react-icons/si"
import { TbBrandCpp } from "react-icons/tb"
import { BiLogoPostgresql } from "react-icons/bi"
import { BsFiletypeSql } from "react-icons/bs"
import { DiSqllite } from "react-icons/di"
import { RiFileExcel2Fill } from "react-icons/ri"

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
      case "Python_Frameworks":
        return "bg-green-100 border-green-500 text-green-700"
      case "Databases":
        return "bg-red-100 border-red-500 text-red-700"
      case "Data_Science":
        return "bg-yellow-100 border-yellow-500 text-yellow-700"
      case "Tools":
        return "bg-indigo-100 border-indigo-500 text-indigo-700"
      default:
        return "bg-gray-100 border-gray-500 text-gray-700"
    }
  }

  // Map icon names to actual React icon components
  const getIconComponent = (iconName: string): React.ReactNode => {
    const iconMap: Record<string, React.ElementType> = {
      // Languages
      FaPython,
      FaJava,
      FaJs,
      TbBrandCpp,
      SiTypescript,
      
      // Frontend
      FaHtml5,
      FaCss3Alt,
      FaReact,
      SiTailwindcss,
      SiFramer,
      
      // Python Frameworks
      SiFlask,
      SiStreamlit,
      
      // Data Science
      SiKeras,
      SiTensorflow,
      SiNumpy,
      SiPandas,
      
      // Databases
      SiMongodb,
      BiLogoPostgresql,
      BsFiletypeSql,
      DiSqllite,
      RiFileExcel2Fill,
      
      // Tools
      FaGitAlt,
      SiPostman,
    }

    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent /> : <span className="text-xs">{iconName}</span>
  }

  const colorClasses = getCategoryClasses(tech.category)
  const [bgClass, borderClass, textClass] = colorClasses.split(" ")

  return (
    <motion.div
      className={`flex-shrink-0 w-40 h-48 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
        isHovered 
          ? `${bgClass} border-4 ${borderClass} shadow-lg transform` 
          : "bg-white border-gray-200 hover:border-gray-300"
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
              <div className={`${getCategoryIconColor(tech.category)} text-5xl mb-3`}>
                {getIconComponent(tech.iconName)}
              </div>
              <h3 className="font-medium text-center text-gray-800">{tech.name}</h3>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Smaller icon when hovered */}
              <div className={`${getCategoryIconColor(tech.category)} text-2xl mb-1`}>
                {getIconComponent(tech.iconName)}
              </div>
              <h3 className={`font-medium text-center text-sm mb-2 ${textClass}`}>
                {tech.name}
              </h3>

              {/* Circular progress indicator */}
              <div className="mb-2">
                <CircularProgress value={tech.proficiency} />
              </div>

              {/* Description */}
              <p className={`text-xs text-center line-clamp-2 ${textClass} opacity-90`}>
                {tech.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TechCard