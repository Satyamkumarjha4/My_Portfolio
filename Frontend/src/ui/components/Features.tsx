"use client"
import { motion } from "framer-motion"
import {
  ImageIcon,
  ClipboardCopy,
  Code2,
  Filter,
  Award,
  Layers,
  ArrowUpDown,
  FileDown,
  MessageSquare,
} from "lucide-react"

const Features = () => {
  const features = [
    {
      icon: <ImageIcon className="h-6 w-6" />,
      title: "Profile Photo",
      description:
        "When clicking on the code block on the right side, my profile photo will appear and clicking again will bring back the code block.",
    },
    {
      icon: <ClipboardCopy className="h-6 w-6" />,
      title: "Clipboard Functionality",
      description: "The text in the code block can be copied by clicking on the clipboard icon.",
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Tech Stack Proficiency",
      description: "When hover over a tech stack, you will be able to see my proficiency in that skill.",
    },
    {
      icon: <Filter className="h-6 w-6" />,
      title: "Filter Options",
      description: "The text above the techstack are filter options.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Achievement Certificates",
      description: "In the achievement grid, when clicking on an achievement you will be able to see my certificate.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Featured Projects",
      description:
        "The feature projects on the home page only shows my best 3 works. To view all my work, visit the projects page.",
    },
    {
      icon: <ArrowUpDown className="h-6 w-6" />,
      title: "Sorting Visibility",
      description:
        "When clicking on the sorting button, if the cards are not visible, try scrolling once and it will be visible.",
    },
    {
      icon: <FileDown className="h-6 w-6" />,
      title: "Resume Download",
      description: "You can download my resume by clicking on the download resume button in the contacts page.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Feedback Form",
      description:
        "Try filling the feedback form. Currently there is only animation but I will be adding some features too.",
    },
  ]

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
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Portfolio <span className="text-indigo-500">Hidden Features</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Try exploring these intractive features in my portfolio. I have added some hidden features they are mentioned below.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              variants={item}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.2), 0 10px 10px -5px rgba(99, 102, 241, 0.1)",
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
