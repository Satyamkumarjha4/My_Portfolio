import type React from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GraduationCap, Briefcase, Code, Award, CalendarDays } from "lucide-react"

// Define the type for a timeline item
export type TimelineItemType = {
  id: string
  title: string
  date: string
  description: string
  type: "education" | "work" | "hackathon"
  remarks?: string
}

// Icon component to display different icons based on the type
const TypeIcon: React.FC<{ type: TimelineItemType["type"] }> = ({ type }) => {
  switch (type) {
    case "education":
      return <GraduationCap className="h-5 w-5 text-white" />
    case "work":
      return <Briefcase className="h-5 w-5 text-white" />
    case "hackathon":
      return <Code className="h-5 w-5 text-white" />
    default:
      return <CalendarDays className="h-5 w-5 text-white" />
  }
}

// Individual timeline card component
interface TimelineCardProps {
  item: TimelineItemType
  isLeft: boolean
  isActive: boolean
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ item, isLeft, isActive }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: false, amount: 0.5 })

  return (
    <div className={`mb-12 flex justify-between items-center w-full ${isLeft ? "flex-row-reverse" : ""}`} ref={cardRef}>
      <div className="order-1 w-5/12"></div>

      {/* Timeline node */}
      <motion.div
        className={`z-20 flex items-center justify-center order-1 shadow-xl rounded-full
          ${isActive ? "w-12 h-12 bg-indigo-600 ring-4 ring-indigo-300/20" : "w-10 h-10 bg-indigo-500"}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: 0.1,
        }}
      >
        <div className="mx-auto text-white">
          <TypeIcon type={item.type} />
        </div>
      </motion.div>

      {/* Timeline card */}
      <motion.div
        className={`
          order-1 bg-gray-800 rounded-xl shadow-lg w-5/12 px-6 py-5
          ${isActive ? "border-2 border-indigo-500 shadow-indigo-500/20 shadow-lg" : "border border-gray-700"}
          ${isLeft ? "items-end text-right" : "items-start text-left"}
        `}
        initial={{
          opacity: 0,
          x: isLeft ? 50 : -50,
          y: 20,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                x: 0,
                y: 0,
              }
            : {
                opacity: 0,
                x: isLeft ? 50 : -50,
                y: 20,
              }
        }
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
          borderColor: "rgba(99, 102, 241, 0.8)",
        }}
      >
        <motion.h3
          className={`font-bold text-xl text-white mb-1 ${isActive ? "text-indigo-400" : ""}`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          {item.title}
        </motion.h3>

        <motion.div
          className={`flex items-center text-sm text-gray-300 mb-3 ${isLeft ? "justify-end" : "justify-start"}`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CalendarDays className={`${isLeft ? "ml-2 order-2" : "mr-2"} h-4 w-4 text-indigo-400`} />
          <span>{item.date}</span>
        </motion.div>

        <motion.p
          className="text-sm leading-relaxed tracking-wide text-gray-300"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {item.description}
        </motion.p>

        {item.remarks && (
          <motion.div
            className={`mt-3 flex items-center ${isLeft ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Award className={`${isLeft ? "ml-2 order-2" : "mr-2"} h-4 w-4 text-indigo-400`} />
            <p className="text-sm italic text-indigo-400 font-medium">{item.remarks}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
