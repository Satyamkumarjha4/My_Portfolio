import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface ProjectInfoProps {
  title: string
  description: string
  techStack: string[]
  tags: string[]
  demoUrl: string
}

export function ProjectInfo({ title, description, techStack, tags, demoUrl }: ProjectInfoProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <motion.div
      className="flex w-full flex-col justify-around p-6 md:w-3/5"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div>
        <motion.h2 className="mb-3 text-2xl font-bold tracking-tight text-white" variants={item}>
          {title}
        </motion.h2>
        <motion.p className="mb-6 text-gray-300 leading-relaxed" variants={item}>
          {description}
        </motion.p>

        <motion.div className="mb-6" variants={item}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">Tech Stack</h3>
          <motion.div className="flex flex-wrap gap-2" variants={container} initial="hidden" animate="show">
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                className="inline-flex items-center rounded-md bg-gray-700 px-3 py-1 text-sm font-medium text-gray-200 backdrop-blur-sm"
                variants={item}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(79, 70, 229, 0.2)",
                  transition: { duration: 0.2 },
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <motion.div className="mb-4">
          {demoUrl && (
            <motion.a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Live Demo
              <ExternalLink className="ml-2 h-4 w-4" />
            </motion.a>
          )}
        </motion.div>

        <motion.div className="flex flex-wrap gap-2" variants={container} initial="hidden" animate="show">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-200"
              variants={item}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(79, 70, 229, 0.2)",
                transition: { duration: 0.2 },
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
