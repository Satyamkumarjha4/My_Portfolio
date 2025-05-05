import { useEffect, useRef, useState } from 'react'


import python_icon from '/python.jpeg'
import C_icon from '/C.jpeg'
import CSS_icon from '/CSS.jpeg'
import Flask_icon from '/Flask.png'
import HTML_icon from '/HTML.png'
import Java_icon from '/Java.png'
import Js_icon from '/Js.jpeg'
import Keras_icon from '/keras.png'
import Matplotlib_icon from '/Matplotlib.png'
import NumPy_icon from '/numpy.png'
import Pandas_icon from '/pandas.png'
import Postgres_icon from '/Postgress.png'
import Postman_icon from '/Postman.png'
import ScikitLearn_icon from '/scikitlearn.png'
import Streamlit_icon from '/Streamlit.png'
import Tensorflow_icon from '/Tensorflow.png'
import SQLite_icon from '/SQLite.jpeg'
import Git_icon from '/Git.png'


// Define TypeScript interfaces for our data structures
interface TechStack {
  name: string;
  category: Category;
  proficiency: number;
  description: string;
  icon?: string;
}

// Use literal types for categories to ensure type safety
type Category = 'Languages' | 'Frontend' | 'Frameworks' | 'Databases' | 'Data Science' | 'Tools';

// Tech stack data with categories, icons, and proficiency levels
const techStacks: TechStack[] = [
  {
    name: "C/C++",
    category: "Languages",
    proficiency: 85,
    description: "System programming, algorithms, and data structures",
    icon: C_icon
  },
  {
    name: "Python",
    category: "Languages",
    proficiency: 90,
    description: "Data analysis, automation, and backend development",
    icon: python_icon
  },
  {
    name: "JavaScript",
    category: "Languages",
    proficiency: 80,
    description: "Web development, frontend and backend scripting",
    icon: Js_icon
  },
  {
    name: "Java",
    category: "Languages",
    proficiency: 75,
    description: "Object-oriented programming and enterprise applications",
    icon: Java_icon
  },
  {
    name: "HTML",
    category: "Frontend",
    proficiency: 95,
    description: "Markup language for creating web pages",
    icon: HTML_icon
  },
  {
    name: "CSS",
    category: "Frontend",
    proficiency: 85,
    description: "Styling and layout for web applications",
    icon: CSS_icon
  },
  {
    name: "Streamlit",
    category: "Frameworks",
    proficiency: 80,
    description: "Rapid data application development",
    icon: Streamlit_icon
  },
  {
    name: "Flask",
    category: "Frameworks",
    proficiency: 85,
    description: "Lightweight web application framework",
    icon: Flask_icon
  },
  {
    name: "SQL",
    category: "Databases",
    proficiency: 90,
    description: "Structured query language for database management",
    icon: SQLite_icon
  },
  {
    name: "SQLite",
    category: "Databases",
    proficiency: 85,
    description: "Embedded relational database",
    icon: SQLite_icon
  },
  {
    name: "Postgres",
    category: "Databases",
    proficiency: 80,
    description: "Object-relational database system",
    icon: Postgres_icon
  },
  {
    name: "MongoDB",
    category: "Databases",
    proficiency: 75,
    description: "NoSQL document database",
    icon: Postgres_icon
  },
  {
    name: "Pandas",
    category: "Data Science",
    proficiency: 90,
    description: "Data manipulation and analysis library",
    icon: Pandas_icon
  },
  {
    name: "NumPy",
    category: "Data Science",
    proficiency: 85,
    description: "Numerical computing with Python",
    icon: NumPy_icon
  },
  {
    name: "Matplotlib",
    category: "Data Science",
    proficiency: 80,
    description: "Visualization library for Python",
    icon: Matplotlib_icon
  },
  {
    name: "Seaborn",
    category: "Data Science",
    proficiency: 80,
    description: "Visualization library for Python",
    icon: Matplotlib_icon
  },
  {
    name: "Scikit-Learn",
    category: "Data Science",
    proficiency: 85,
    description: "Machine learning library for Python",
    icon: ScikitLearn_icon
  },
  {
    name: "Keras",
    category: "Data Science",
    proficiency: 75,
    description: "Deep learning API running on TensorFlow",
    icon: Keras_icon
  },
  {
    name: "TensorFlow",
    category: "Data Science",
    proficiency: 75,
    description: "Deep learning framework",
    icon: Tensorflow_icon
  },
  {
    name: "Git/GitHub",
    category: "Tools",
    proficiency: 90,
    description: "Version control and code collaboration",
    icon: Git_icon
  },
  {
    name: "Postman",
    category: "Tools",
    proficiency: 85,
    description: "API development and testing tool",
    icon: Postman_icon
  }
];


// Define interface for category colors
interface CategoryColorMap {
  [key: string]: string
}

// Color schemes for different categories
const categoryColors: CategoryColorMap = {
  Languages: "bg-blue-100 border-blue-500 text-blue-700",
  Frontend: "bg-purple-100 border-purple-500 text-purple-700",
  Frameworks: "bg-green-100 border-green-500 text-green-700",
  Databases: "bg-red-100 border-red-500 text-red-700",
  "Data Science": "bg-yellow-100 border-yellow-500 text-yellow-700",
  Tools: "bg-indigo-100 border-indigo-500 text-indigo-700",
}

// Component for the tech stack carousel
export default function TechStackCarousel() {
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [hoveredStack, setHoveredStack] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Clone items for infinite scrolling
  useEffect(() => {
    if (containerRef.current && carouselRef.current) {
      // Clone the first set of items and append to the end for seamless looping
      const items = carouselRef.current.children
      const clonedItems = Array.from(items).map((item) => item.cloneNode(true))

      clonedItems.forEach((item) => {
        carouselRef.current?.appendChild(item)
      })
    }
  }, [])

  // Effect for automatic scrolling with infinite loop
  useEffect(() => {
    if (!isPaused && carouselRef.current) {
      const scrollInterval = setInterval(() => {
        if (carouselRef.current) {
          const scrollWidth = carouselRef.current.scrollWidth
          const scrollLeft = carouselRef.current.scrollLeft

          // If we've scrolled to the cloned section (halfway point)
          if (scrollLeft >= scrollWidth / 4) {
            // Reset to the beginning without animation
            carouselRef.current.style.scrollBehavior = "auto"
            carouselRef.current.scrollLeft = 0
            // Restore smooth scrolling
            setTimeout(() => {
              if (carouselRef.current) {
                carouselRef.current.style.scrollBehavior = "smooth"
              }
            }, 10)
          } else {
            // Continue scrolling
            carouselRef.current.scrollLeft += 1
          }
        }
      }, 20)

      return () => clearInterval(scrollInterval)
    }
  }, [isPaused])

  // Render proficiency circle
  const renderProficiencyCircle = (proficiency: number) => {
    const getCircleColor = (value: number): string => {
      if (value >= 90) return "bg-green-500 text-white"
      if (value >= 75) return "bg-blue-500 text-white"
      if (value >= 60) return "bg-yellow-500 text-white"
      return "bg-red-500 text-white"
    }

    return (
      <div className="flex items-center justify-center mt-2">
        <div
          className={`rounded-full ${getCircleColor(proficiency)} flex items-center justify-center transition-all duration-300 animate-pulse`}
          style={{
            width: "80px",
            height: "80px",
          }}
        >
          <span className="font-bold text-xl">{proficiency}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-9/10 mx-auto p-4 bg-gray-900" ref={containerRef}>
      <h2 className="text-2xl font-bold text-center mb-6 text-5xl text-indigo-500">My Skills</h2>

      {/* Tech Stack Filter Buttons */}
      <div className="w-400 flex flex-wrap justify-center item-center gap-4 mb-6">
        {Object.keys(categoryColors).map((category) => (
          <span
            key={category}
            className={`px-3 py-1 rounded-full text-m font-medium border ${categoryColors[category]} shadow-md hover:shadow-lg transition-all duration-300`}
          >
            {category}
          </span>
        ))}
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden py-4">
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {techStacks.map((tech, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-72 h-72 rounded-full border-2 transition-all duration-300 ${
                hoveredStack === tech.name
                  ? `${categoryColors[tech.category].split(" ")[0]} border-4 ${categoryColors[tech.category].split(" ")[1]} shadow-lg transform -translate-y-2`
                  : "bg-white border-gray-200 hover:shadow-md"
              }`}
              onMouseEnter={() => {
                setIsPaused(true)
                setHoveredStack(tech.name)
              }}
              onMouseLeave={() => {
                setIsPaused(false)
                setHoveredStack(null)
              }}
            >
              <div className="p-4 flex flex-col items-center justify-center h-full">
                {/* Show icon when not hovered */}
                {hoveredStack !== tech.name && (
                  <>
                    <div className="w-20 h-20 relative mb-2">
                      <img src={tech.icon} alt={tech.name} className="object-contain" />
                    </div>
                  </>
                )}

                {/* Show proficiency circle and description on hover */}
                {hoveredStack === tech.name && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h3 className="font-bold text-2xl text-center mb-2">{tech.name}</h3>
                    {renderProficiencyCircle(tech.proficiency)}
                    <p className="text-xs mt-3 text-center line-clamp-2">{tech.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
