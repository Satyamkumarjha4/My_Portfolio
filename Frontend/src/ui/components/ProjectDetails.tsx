import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ProjectImage } from "./ProjectImage"
import { ProjectInfo } from "./ProjectInfo"

interface ProjectDetailsProps {
  title: string
  description: string
  techStack: string[]
  tags: string[]
  imageUrl: string
  githubUrl: string
  demoUrl: string
  imageOnRight?: boolean
}

export function ProjectDetails({
  title,
  description,
  techStack,
  tags,
  imageUrl,
  githubUrl,
  demoUrl,
  imageOnRight = false,
}: ProjectDetailsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className="max-w-6xl mx-auto mb-16 overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all hover:shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className={`flex md:flex-row ${imageOnRight ? "flex-col-reverse" : "flex-col"}`} id={imageUrl}>
        {imageOnRight ? (
          <>
            <ProjectInfo title={title} description={description} techStack={techStack} tags={tags} demoUrl={demoUrl} />
            <ProjectImage imageUrl={imageUrl} githubUrl={githubUrl} title={title} />
          </>
        ) : (
          <>
            <ProjectImage imageUrl={imageUrl} githubUrl={githubUrl} title={title} />
            <ProjectInfo title={title} description={description} techStack={techStack} tags={tags} demoUrl={demoUrl} />
          </>
        )}
      </div>
    </motion.div>
  )
}
