"use client"

import type React from "react"
import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import ProjectCard, { type ProjectCardProps } from "./ProjectCard"

// Interface for our project data
interface Project extends ProjectCardProps {}

const ProjectsShowcase: React.FC = () => {
  // Animation controls for staggered entrance
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Trigger animations when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Project data - you can modify these with your actual projects
  const projects: Project[] = [
    {
      title: "Car Price Prediction Web App",
      description:
        "A data-driven web application that predicts used car prices using ensemble models and CatBoost, with a Flask backend.",
      image: "/project_images/car_prediction.png",
      technologies: ["Flask", "Python", "CatBoost", "Render"],
    },
    {
      title: "Movie Buddy – Recommendation Engine",
      description:
        "Interactive movie recommender that uses NLP techniques and cosine similarity for personalized suggestions.",
      image: "/project_images/movie_recomendation_system.png",
      technologies: ["Streamlit", "Pandas", "Scikit-learn", "TMDb API"],
    },
    {
      title: "Binge+ – Movie & Web Series Explorer",
      description:
        "A dynamic content discovery platform where users can explore movies and web series with filtering, search, and real-time metadata fetched from an external API.",
      image: "/project_images/Binge.png",
      technologies: ["HTML", "CSS", "JavaScript", "TMDb API"],
    },
  ]

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  }

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-900 px-6 py-16 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.2,
          }}
        >
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            A collection of my most significant work showcasing my skills and experience in software development.
          </motion.p>
        </motion.div>

        {/* 3x2 Grid layout for projects with staggered animation */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="h-full"
              style={{
                perspective: "1000px",
                height: "100%",
              }}
            >
              
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  technologies={project.technologies}
                />
              
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProjectsShowcase
