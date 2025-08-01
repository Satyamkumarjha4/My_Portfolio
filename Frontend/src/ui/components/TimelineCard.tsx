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
  type: "EDUCATION" | "WORK" | "HACKATHON"
  remarks?: string
}

// Icon component to display different icons based on the type
const TypeIcon: React.FC<{ type: TimelineItemType["type"] }> = ({ type }) => {
  switch (type) {
    case "EDUCATION":
      return <GraduationCap className="h-5 w-5 text-white" />
    case "WORK":
      return <Briefcase className="h-5 w-5 text-white" />
    case "HACKATHON":
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
  isMobile?: boolean
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ item, isLeft, isActive, isMobile = false }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: false, amount: 0.5 })

  return (
    <div
      className={`mb-12 flex justify-between items-center w-full 
        ${
          isMobile ? "flex-row pl-8 md:pl-0 md:flex-row-reverse md:justify-between" : isLeft ? "flex-row-reverse" : ""
        }`}
      ref={cardRef}
    >
      {/* This div is hidden on mobile */}
      <div className={`order-1 ${isMobile ? "hidden md:block md:w-5/12" : "w-5/12"}`}></div>

      {/* Timeline node */}
      <motion.div
        className={`z-20 flex items-center justify-center order-1 shadow-xl rounded-full
          ${
            isActive
              ? "w-10 h-10 md:w-12 md:h-12 bg-indigo-600 ring-4 ring-indigo-300/20"
              : "w-8 h-8 md:w-10 md:h-10 bg-indigo-500"
          }`}
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
          order-1 bg-gray-800 rounded-xl shadow-lg px-4 py-4 md:px-6 md:py-5
          ${isActive ? "border-2 border-indigo-500 shadow-indigo-500/20 shadow-lg" : "border border-gray-700"}
          ${isMobile ? "ml-4 w-full md:w-5/12 md:ml-0" : "w-5/12"}
          ${!isMobile && isLeft ? "items-end text-right" : "items-start text-left"}
        `}
        initial={{
          opacity: 0,
          x: isMobile ? -30 : isLeft ? 50 : -50,
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
                x: isMobile ? -30 : isLeft ? 50 : -50,
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
          className={`font-bold text-lg md:text-xl text-white mb-1 ${isActive ? "text-indigo-400" : ""}`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          {item.title}
        </motion.h3>

        <motion.div
          className={`flex items-center text-xs md:text-sm text-gray-300 mb-2 md:mb-3 
            ${!isMobile && isLeft ? "justify-end" : "justify-start"}`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CalendarDays
            className={`${!isMobile && isLeft ? "ml-2 order-2" : "mr-2"} h-3 w-3 md:h-4 md:w-4 text-indigo-400`}
          />
          <span>{item.date}</span>
        </motion.div>

        <motion.p
          className="text-xs md:text-sm leading-relaxed tracking-wide text-gray-300"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {item.description}
        </motion.p>

        {item.remarks && (
          <motion.div
            className={`mt-2 md:mt-3 flex items-center ${!isMobile && isLeft ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Award
              className={`${!isMobile && isLeft ? "ml-2 order-2" : "mr-2"} h-3 w-3 md:h-4 md:w-4 text-indigo-400`}
            />
            <p className="text-xs md:text-sm italic text-indigo-400 font-medium">{item.remarks}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
