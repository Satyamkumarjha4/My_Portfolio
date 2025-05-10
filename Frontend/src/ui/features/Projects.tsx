import type React from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ProjectDetails } from "../components/ProjectDetails"


const projects = [
  {
    title: "Car Price Prediction Web App",
    description:
      "A data-driven web application that predicts the price of used cars based on their features. It utilizes advanced machine learning models including CatBoost and ensemble techniques to provide accurate results. The backend is built using Flask, and the app is deployed on Render for easy accessibility. Users can input details like brand, model, year, mileage, and fuel type to get instant price estimates. The project emphasizes feature engineering, model optimization, and a clean user interface.",
    techStack: ["Flask", "Python", "CatBoost", "Render"],
    tags: ["Machine Learning", "Web App", "Regression", "Car Pricing"],
    imageUrl: "/placeholder.svg?height=400&width=600",
    githubUrl: "https://github.com/satyamkumarjha/car-price-predictor",
    demoUrl: "https://car-price-predictor-4aiw.onrender.com",
    imageOnRight: false,
  },
  {
    title: "Movie Buddy – Recommendation Engine",
    description:
      "An interactive and personalized movie recommendation engine that leverages NLP techniques and cosine similarity to suggest movies based on user input. It uses metadata like genres, cast, and keywords to create a tag-based vector for each movie and generates recommendations accordingly. Built with Streamlit for a user-friendly interface, and integrated with the TMDb API to fetch real-time poster images and movie details. The project demonstrates the power of content-based filtering in recommendation systems.",
    techStack: ["Streamlit", "Pandas", "Scikit-learn", "TMDb API"],
    tags: ["NLP", "Recommender System", "Movie App", "Content-Based Filtering"],
    imageUrl: "/placeholder.svg?height=400&width=600",
    githubUrl: "https://github.com/satyamkumarjha/movie-recommender",
    demoUrl: "https://moviebuddy-demo.vercel.app",
    imageOnRight: true,
  },
  {
    title: "Contact Manager Desktop App",
    description:
      "A feature-rich desktop application designed to efficiently manage personal or professional contacts. Built with PyQt5 for the GUI and SQLite for persistent data storage, it supports creating, editing, searching, and deleting contact entries. The project follows object-oriented principles and includes a user-friendly interface designed with PyQt Designer. It is ideal for users who need an offline and organized way to handle their contact database, with emphasis on usability and clean design.",
    techStack: ["PyQt5", "SQLite", "Python", "PyQt Designer"],
    tags: ["Desktop App", "Contact Management", "GUI", "OOP"],
    imageUrl: "/placeholder.svg?height=400&width=600",
    githubUrl: "https://github.com/satyamkumarjha/contact-manager",
    demoUrl: "",
    imageOnRight: false,
  },
  {
    title: "Binge+ – Movie & Web Series Explorer",
    description:
      "Binge+ is a dynamic content discovery platform that enables users to explore movies and web series interactively. It features real-time search, filtering by genres or ratings, and displays live metadata such as cast, plot summaries, and posters fetched via the TMDb API. Built using HTML, CSS, and JavaScript, this responsive website provides a seamless user experience and caters to entertainment enthusiasts looking for curated content. It's designed to function as a lightweight and fast front-end application.",
    techStack: ["HTML", "CSS", "JavaScript", "TMDb API"],
    tags: ["Movie App", "Web Series", "Frontend", "API Integration"],
    imageUrl: "/placeholder.svg?height=400&width=600",
    githubUrl: "https://github.com/satyamkumarjha/bingeplus",
    demoUrl: "https://bingeplus-demo.vercel.app",
    imageOnRight: true,
  },
]

const Projects: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="bg-gray-900 min-h-screen">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 z-50 origin-left" style={{ scaleX }} />
      <Navbar />

      <motion.div
        className="flex flex-col items-center justify-center py-20 md:py-32 bg-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Projects
        </motion.h1>
        <motion.div
          className="w-20 h-1 bg-indigo-500 my-6"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.p
          className="mt-4 text-lg text-gray-400 text-center max-w-2xl px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Explore my projects that showcase my skills and expertise in building innovative solutions.
        </motion.p>
      </motion.div>

      <div className="container mx-auto px-4 py-8 z-0">
        {projects.map((project, index) => (
          <ProjectDetails
            key={index}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            tags={project.tags}
            imageUrl={project.imageUrl}
            githubUrl={project.githubUrl}
            demoUrl={project.demoUrl}
            imageOnRight={project.imageOnRight}
          />
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default Projects
