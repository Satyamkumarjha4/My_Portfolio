import { useState } from "react"
import { motion } from "framer-motion"
import TechCarousel from "./TechCarousel"
import type { Category, TechStack } from "./TechTypes"
import { FaPython, FaJava, FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt } from "react-icons/fa"
import { SiFlask, SiStreamlit, SiKeras, SiTensorflow, SiNumpy, SiPandas, SiMongodb, SiPostman, SiTailwindcss, SiTypescript, SiFramer } from "react-icons/si"
import { TbBrandCpp } from "react-icons/tb"
import { BiLogoPostgresql } from "react-icons/bi"
import { BsFiletypeSql } from "react-icons/bs"
import { DiSqllite } from "react-icons/di"
import { RiFileExcel2Fill } from "react-icons/ri"

// Tech stack data with categories, icons, and proficiency levels
const techStacks: TechStack[] = [
  {
    name: "C/C++",
    category: "Languages",
    proficiency: 60,
    description: "System programming, algorithms, and data structures",
    icon: <TbBrandCpp />,
  },
  {
    name: "Python",
    category: "Languages",
    proficiency: 90,
    description: "Data analysis, automation, and backend development",
    icon: <FaPython />,
  },
  {
    name: "JavaScript",
    category: "Languages",
    proficiency: 65,
    description: "Web development, frontend and backend scripting",
    icon: <FaJs />,
  },
  {
    name: "Java",
    category: "Languages",
    proficiency: 60,
    description: "Object-oriented programming and enterprise applications",
    icon: <FaJava />,
  },
  {
    name: "TypeScript",
    category: "Languages",
    proficiency: 40,
    description: "Typed superset of JavaScript for scalable applications",
    icon: <SiTypescript />,
  },
  {
    name: "HTML",
    category: "Frontend",
    proficiency: 75,
    description: "Markup language for creating web pages",
    icon: <FaHtml5 />,
  },
  {
    name: "CSS",
    category: "Frontend",
    proficiency: 65,
    description: "Styling and layout for web applications",
    icon: <FaCss3Alt />,
  },
  {
    name: "React",
    category: "Frontend",
    proficiency: 60,
    description: "Building dynamic and component-based user interfaces",
    icon: <FaReact />,
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    proficiency: 50,
    description: "Utility-first CSS framework for rapid UI development",
    icon: <SiTailwindcss />,
  },
  {
    name: "Framer Motion",
    category: "Frontend",
    proficiency: 40,
    description: "Declarative animations and transitions for React apps",
    icon: <SiFramer />,
  },
  {
    name: "Streamlit",
    category: "Python Frameworks",
    proficiency: 75,
    description: "Rapid data application development",
    icon: <SiStreamlit />,
  },
  {
    name: "Flask",
    category: "Python Frameworks",
    proficiency: 75,
    description: "Lightweight web application framework",
    icon: <SiFlask />,
  },
  {
    name: "SQL",
    category: "Databases",
    proficiency: 85,
    description: "Structured query language for database management",
    icon: <BsFiletypeSql />,
  },
  {
    name: "SQLite",
    category: "Databases",
    proficiency: 80,
    description: "Embedded relational database",
    icon: <DiSqllite />,
  },
  {
    name: "Postgres",
    category: "Databases",
    proficiency: 65,
    description: "Object-relational database system",
    icon: <BiLogoPostgresql />,
  },
  {
    name: "MongoDB",
    category: "Databases",
    proficiency: 60,
    description: "NoSQL document database",
    icon: <SiMongodb />,
  },
  {
    name: "Pandas",
    category: "Data Science",
    proficiency: 85,
    description: "Data manipulation and analysis library",
    icon: <SiPandas />,
  },
  {
    name: "NumPy",
    category: "Data Science",
    proficiency: 85,
    description: "Numerical computing with Python",
    icon: <SiNumpy />,
  },
  {
    name: "Keras",
    category: "Data Science",
    proficiency: 75,
    description: "Deep learning API running on TensorFlow",
    icon: <SiKeras />,
  },
  {
    name: "TensorFlow",
    category: "Data Science",
    proficiency: 60,
    description: "Deep learning framework",
    icon: <SiTensorflow />,
  },
  {
    name: "Git/GitHub",
    category: "Tools",
    proficiency: 90,
    description: "Version control and code collaboration",
    icon: <FaGitAlt />,
  },
  {
    name: "Postman",
    category: "Tools",
    proficiency: 80,
    description: "API development and testing tool",
    icon: <SiPostman />,
  },
  {
    name: "Excel",
    category: "Tools",
    proficiency: 75,
    description: "Data analysis, visualization, and spreadsheet management",
    icon: <RiFileExcel2Fill />,
  }
]

// Component for the tech stack section
export default function Techrow() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")

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
      case "Python Frameworks":
        return selectedCategory === category
          ? "bg-green-700 text-white border-green-500"
          : "bg-green-900/30 text-green-300 border-green-800 hover:bg-green-800/50"
      case "Databases":
        return selectedCategory === category
          ? "bg-red-700 text-white border-red-500"
          : "bg-red-900/30 text-red-300 border-red-800 hover:bg-red-800/50"
      case "Data Science":
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
    <div className="w-full mx-auto p-4 bg-gray-900">
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
