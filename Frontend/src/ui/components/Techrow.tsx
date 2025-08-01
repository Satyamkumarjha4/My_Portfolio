import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TechCarousel from "./TechCarousel"
import type { Category, TechStack } from "./TechTypes"
import { axiosInstance } from "../utils/axios.ts"

// Tech stack data with categories, icons, and proficiency levels


// Component for the tech stack section
export default function Techrow() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")
  const [techStacks, setTechStacks] = useState<TechStack[]>([])

  // Fetch tech stack data from API
  const fetchTechStacks = async () => {
    try {
      const response = await axiosInstance.get("/tech-stacks")
      setTechStacks(response.data || [])
    } catch (error) {
      console.error("Error fetching tech stacks:", error)
    }
  }

  useEffect(() => {
    fetchTechStacks()
  }, [])

  // Get unique categories
  const categories: (Category | "All")[] = ["All", ...Array.from(new Set(techStacks.map((tech) => tech.category)))]

  // Define category colors for filter buttons
  const getCategoryButtonClass = (category: Category | "All") => {
    if (category === "All") {
      return selectedCategory === "All"
        ? "bg-gray-800 text-white border-gray-600"
        : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
    }

    switch (category) {
      case "Languages":
        return selectedCategory === category
          ? "bg-blue-700 text-white border-blue-500"
          : "bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-800/50"
      case "Frontend":
        return selectedCategory === category
          ? "bg-purple-700 text-white border-purple-500"
          : "bg-purple-900/30 text-purple-300 border-purple-800 hover:bg-purple-800/50"
      case "Python_Frameworks":
        return selectedCategory === category
          ? "bg-green-700 text-white border-green-500"
          : "bg-green-900/30 text-green-300 border-green-800 hover:bg-green-800/50"
      case "Databases":
        return selectedCategory === category
          ? "bg-red-700 text-white border-red-500"
          : "bg-red-900/30 text-red-300 border-red-800 hover:bg-red-800/50"
      case "Data_Science":
        return selectedCategory === category
          ? "bg-yellow-700 text-white border-yellow-500"
          : "bg-yellow-900/30 text-yellow-300 border-yellow-800 hover:bg-yellow-800/50"
      case "Tools":
        return selectedCategory === category
          ? "bg-indigo-700 text-white border-indigo-500"
          : "bg-indigo-900/30 text-indigo-300 border-indigo-800 hover:bg-indigo-800/50"
      default:
        return "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
    }
  }

  return (
    <div className="w-full mx-auto p-4 bg-gray-900 py-16 ">
      <motion.h2
        className="text-5xl font-bold text-center mb-6 text-indigo-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Skills
      </motion.h2>

      {/* Tech Stack Filter Buttons */}
      <motion.div
        className="flex flex-wrap justify-center items-center gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${getCategoryButtonClass(category)} shadow-md transition-all duration-300`}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Tech Stack Carousel */}
      <TechCarousel techStacks={techStacks} selectedCategory={selectedCategory} />
    </div>
  )
}
