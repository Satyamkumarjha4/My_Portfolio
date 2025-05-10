"use client"

import type React from "react"
import { Github, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const navigateTo = (path: string) => {
    window.location.href = path
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.9 },
  }

  const linkVariants = {
    hover: {
      x: 5,
      color: "#818cf8",
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.footer
      className="w-full bg-gray-900 text-white py-12 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="w-400 mx-auto">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-y border-gray-800 py-12 px-2">
          {/* About column */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-4">
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Satyam Kumar Jha
              </motion.span>
            </h3>
            <motion.p
              className="text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Turning ideas into reality through code and innovation. Specializing in AI/ML and full-stack development.
            </motion.p>
            <motion.div
              className="flex space-x-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.a
                href="https://github.com/Satyamkumarjha4"
                target="_blank"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
                rel="noreferrer"
              >
                <Github size={30} />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/satyamkumarjha4"
                target="_blank"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
                rel="noreferrer"
              >
                <Linkedin size={30} />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
              <motion.a
                href="mailto:satyamjha4@gmail.com"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Mail size={30} />
                <span className="sr-only">Email</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About", "Projects", "Contact"].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <motion.a
                    onClick={() => navigateTo(`/${item === "Home" ? "" : item}`)}
                    className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center cursor-pointer"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <motion.span
                      className="p-1 rounded-md flex items-center"
                      whileHover={{
                        backgroundColor: "rgba(79, 70, 229, 0.1)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <motion.span
                        className="mr-2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + 0.1 * index }}
                      >
                        →
                      </motion.span>
                      {item}
                    </motion.span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Made Using */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4">Made Using</h3>
            <ul className="space-y-2">
              {["React", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech, index) => (
                <motion.li
                  key={tech}
                  className="text-gray-300 transition-colors flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <motion.span
                    className="p-1 rounded-md flex items-center"
                    whileHover={{
                      scale: 1.05,
                      color: "#818cf8",
                      backgroundColor: "rgba(79, 70, 229, 0.1)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <motion.span
                      className="mr-2 text-indigo-400"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + 0.1 * index }}
                    >
                      •
                    </motion.span>
                    {tech}
                  </motion.span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section with copyright */}
        <motion.div
          className="text-center text-gray-400 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>© {currentYear} Satyam Kumar Jha. All rights reserved.</p>
          <motion.p
            className="mt-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.span className="inline-flex items-center" whileHover={{ scale: 1.05 }}>
              Built with
              <motion.span
                className="text-red-500 mx-1"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 1,
                }}
              >
                ❤
              </motion.span>
              using React & Tailwind CSS
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
