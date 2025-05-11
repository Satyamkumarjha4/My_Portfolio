import type React from "react"
import { useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring, useAnimationControls } from "framer-motion"
import { Link } from "react-router-dom"

// Interface definitions
interface TechBadgeProps {
  label: string
}

export interface ProjectCardProps {
  title: string
  description: string
  image?: string
  technologies: string[]
}

// Tech badge component with animation
const TechBadge: React.FC<TechBadgeProps> = ({ label }) => {
  return (
    <motion.span
      className="bg-blue-900/30 text-indigo-300 text-sm px-3 py-1 rounded-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(79, 70, 229, 0.4)",
        boxShadow: "0 0 8px rgba(99, 102, 241, 0.6)",
      }}
    >
      {label}
    </motion.span>
  )
}

// Individual project card component with 3D effects
const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, image, technologies }) => {
  // References for the card element
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for tracking mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Controls for content animations
  const controls = useAnimationControls()

  // Transform mouse position into rotation values with springs for smooth animation
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), { stiffness: 200, damping: 30 })

  // Transform for parallax effects
  const contentX = useTransform(mouseX, [-300, 300], [10, -10])
  const contentY = useTransform(mouseY, [-300, 300], [10, -10])

  const imageX = useTransform(mouseX, [-300, 300], [15, -15])
  const imageY = useTransform(mouseY, [-300, 300], [15, -15])

  // Glow effect based on mouse position
  const glowX = useTransform(mouseX, [-300, 300], [0, 100])
  const glowY = useTransform(mouseY, [-300, 300], [0, 100])
  const glowOpacity = useTransform(mouseX, [-300, 0, 300], [0.5, 0.2, 0.5])

  // Handle mouse movement over the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate mouse position relative to card center
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  // Reset card position when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Handle card click for a fun bounce effect
  const handleClick = async () => {
    await controls.start({
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.4 },
    })
  }

  return (
    <>
    <Link to={`/projects/`}>
    <motion.div
      ref={cardRef}
      className="relative h-full perspective-1000 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ z: 10 }}
    >
      {/* 3D Card Container */}
      <motion.div
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 h-full flex flex-col relative preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)",
        }}
        animate={controls}
      >
        {/* Glow effect overlay */}
        <motion.div
          className="absolute inset-0 rounded-lg z-0 opacity-50"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(99, 102, 241, 0.8), transparent 70%)`,
            opacity: glowOpacity,
          }}
        />

        {/* Project Image with parallax effect */}
        <motion.div
          className="h-48 overflow-hidden relative z-10"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(20px)",
          }}
        >
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              x: imageX,
              y: imageY,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />

          {/* Image overlay gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-60"
            style={{
              transformStyle: "preserve-3d",
            }}
          />
        </motion.div>

        {/* Content with parallax effect */}
        <motion.div
          className="p-6 flex-1 flex flex-col relative z-20"
          style={{
            x: contentX,
            y: contentY,
            transformStyle: "preserve-3d",
            transform: "translateZ(40px)",
          }}
        >
          {/* Title with floating effect */}
          <motion.h3
            className="text-xl font-bold text-white mb-2"
            style={{ transform: "translateZ(10px)" }}
            whileHover={{ scale: 1.02, color: "#a5b4fc" }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p className="text-gray-300 text-sm mb-4 flex-1" style={{ transform: "translateZ(5px)" }}>
            {description}
          </motion.p>

          {/* Technology Tags with staggered animation */}
          <motion.div
            className="flex flex-wrap gap-2 mt-auto"
            style={{ transform: "translateZ(15px)" }}
            variants={{
              hover: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {technologies.map((tech, index) => (
              <TechBadge key={index} label={tech} />
            ))}
          </motion.div>
        </motion.div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 rounded-lg"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 0.1,
            backgroundPosition: ["200% 50%", "-50% 50%"],
            transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" },
          }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </motion.div>
    </motion.div>
    </Link>
    </>
  )
}

export default ProjectCard
