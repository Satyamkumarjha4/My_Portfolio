import { Github } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface ProjectImageProps {
  imageUrl: string
  githubUrl: string
  title: string
}

export function ProjectImage({ imageUrl, githubUrl, title }: ProjectImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      className="relative h-64 w-full md:h-auto md:w-2/5 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="group relative h-full w-full overflow-hidden rounded-md bg-gray-700/30"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {!imageLoaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-700/50"
            initial={{ opacity: 1 }}
            animate={{ opacity: imageLoaded ? 0 : 1 }}
          >
            <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </motion.div>
        )}
        <motion.img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          initial={{ filter: "blur(10px)" }}
          animate={{ filter: imageLoaded ? "blur(0px)" : "blur(10px)" }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
        />
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/90 shadow-md transition-all hover:bg-indigo-600 hover:shadow-lg"
          aria-label="View GitHub repository"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Github className="h-5 w-5 text-white" />
        </motion.a>
      </motion.div>
    </motion.div>
  )
}
