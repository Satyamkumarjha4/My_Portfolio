import type React from "react"
import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import ProjectCard, { type ProjectCardProps } from "./ProjectCard"
import { useApi } from "../hooks/useApi"
import { ErrorBlock, LoadingBlock } from "./AsyncState"

interface ApiProject {
  id: string
  title: string
  description: string
  imageUrl: string
  techStack: string[]
}

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

  const { data, loading, error, refetch } = useApi<ApiProject[]>("/projects")
  const projects: ProjectCardProps[] = (data ?? []).slice(0, 3).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.imageUrl,
    technologies: p.techStack,
  }))

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
            A collection of my most significant work showcasing best of my skills and experience in software development.
          </motion.p>
        </motion.div>

        {loading && <LoadingBlock label="Loading projects..." />}
        {error && !data && <ErrorBlock message="Couldn't load projects." onRetry={refetch} />}

        {/* 3x2 Grid layout for projects with staggered animation */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="h-full"
              style={{
                perspective: "1000px",
                height: "100%",
              }}
            >
              
                <ProjectCard
                  id={project.id}
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
