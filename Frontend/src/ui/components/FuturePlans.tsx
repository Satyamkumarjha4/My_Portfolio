"use client"
import { motion } from "framer-motion"
import { Database, Code, Server, FileCode, MessageCircle } from "lucide-react"

const FuturePlans = () => {
  const plans = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Database Integration",
      description:
        "I will be adding all the projects, achievements, timeline, and skills into a database and it will be fetching the data through backend.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "CRUD Interface",
      description:
        "I will create an interface that will help me do CRUD operations on my database through an interface on my portfolio itself, making the portfolio dynamic.",
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Backend Development",
      description:
        "For Backend, currently I will be using Node.js, Express, and Supabase for the Database and bucket (to store images and other resources).",
    },
    {
      icon: <FileCode className="h-6 w-6" />,
      title: "NestJS Migration",
      description: "I have thought to move my backend later into NestJs after I have learned that.",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Testimonials Section",
      description:
        "After the backend will be created, I will be collecting the responses from all my viewers and then will be creating a testimonial section in the contacts page itself.",
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
    <section className="py-20 bg-gradient-to-b from-gray-900 to-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Future <span className="text-indigo-500">Plans</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover my upcoming development plans and enhancements for this portfolio.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
              variants={item}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.2), 0 10px 10px -5px rgba(99, 102, 241, 0.1)",
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
                {plan.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{plan.title}</h3>
              <p className="text-gray-300">{plan.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-300 italic">"Always under development, constantly evolving."</p>
        </motion.div>
      </div>
    </section>
  )
}

export default FuturePlans
