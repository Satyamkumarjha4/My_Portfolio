import type React from "react"
import { Mail, Phone, Linkedin, Github, FileDown } from "lucide-react"
import { motion } from "framer-motion"

const ContactDetails: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col items-start justify-center px-4 sm:px-4 md:px-2 py-16">
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "tween", delay: 0.2, duration: 1 }}
        className="w-full max-w-xl bg-gray-900 rounded-2xl p-4"
      >
        <div className="w-full py-16 pl-16">
          {/* Heading Section */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500"
          >
            Let's Build Something Amazing!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg text-gray-300 mb-12 max-w-2xl"
          >
            Whether you're looking to collaborate on a project, exchange ideas, or seek and share advice — 
            I'm always open to meaningful connections.
          </motion.p>

          {/* Contact Information */}
          <div className="space-y-8 mb-12">
            {/* Email */}
            <motion.div
              className="flex items-center group"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-6 group-hover:bg-blue-800/50 transition-colors duration-300">
                <Mail className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-400">Email</h3>
                <a
                  href="mailto:satyamjha4@gmail.com"
                  className="text-white hover:text-indigo-300 transition-colors duration-300"
                >
                  satyamjha4@gmail.com
                </a>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="flex items-center group"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-6 group-hover:bg-blue-800/50 transition-colors duration-300">
                <Phone className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-400">Phone</h3>
                <a href="tel:+917060298070" className="text-white hover:text-indigo-300 transition-colors duration-300">
                  +91 706-029-8070
                </a>
              </div>
            </motion.div>

            {/* LinkedIn */}
            <motion.div
              className="flex items-center group"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-6 group-hover:bg-blue-800/50 transition-colors duration-300">
                <Linkedin className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-400">LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/in/satyamkumarjha4"
                  className="text-white hover:text-indigo-300 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  satyamkumarjha4
                </a>
              </div>
            </motion.div>

            {/* GitHub */}
            <motion.div
              className="flex items-center group"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-6 group-hover:bg-blue-800/50 transition-colors duration-300">
                <Github className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-400">GitHub</h3>
                <a
                  href="https://github.com/Satyamkumarjha4"
                  className="text-white hover:text-indigo-300 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Satyamkumarjha4
                </a>
              </div>
            </motion.div>
          </div>

          {/* Resume Download Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            <a
              href="https://drive.google.com/file/d/1tQ9_ap-tw5Et5qku7h7328wDLC3Bg8I8/view?usp=sharing"
              download
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
            >
              <FileDown className="mr-2" size={20} />
              Download Resume
            </a>
          </motion.div> 
        </div>
      </motion.div>
    </div>
  )
}

export default ContactDetails
