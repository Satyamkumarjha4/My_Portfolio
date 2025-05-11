import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TimelineCard, type TimelineItemType } from "./TimelineCard"

// Sample data (replace with your own)
const sampleTimelineData: TimelineItemType[] = [
  {
    id: "1",
    title: "B.Tech in Computer Science Engineering, MAIT Delhi (GGSIPU)",
    date: "2023 - 2027 (Expected)",
    description:
      "Pursuing B.Tech at Maharaja Agrasen Institute of Technology, Rohini, Delhi. Focused on AI, full-stack development, and research.",
    type: "education",
    remarks: "CGPA: 8.7 till 3rd semester",
  },
  {
    id: "2",
    title: "CBSE (Class XII), PCM with Computer Science",
    date: "2022",
    description: "Completed senior secondary education from Arwachin International School, Dilshad Garden, Delhi.",
    type: "education",
    remarks: "Scored 84.6%",
  },
  {
    id: "3",
    title: "CBSE (Class X)",
    date: "2020",
    description: "Completed secondary education from Arwachin International School, Dilshad Garden, Delhi.",
    type: "education",
    remarks: "Scored 91.4%",
  },
  {
    id: "4",
    title: "Hackathon Participant – Smart India Hackathon 2024",
    date: "September - December 2024",
    description:
      "Built a freelancer opportunities platform with AI-based job matching. Developed DBMS and cosine similarity-based recommendation model. Selected among the top 25 teams from the total of 250+ teams.",
    type: "hackathon",
    remarks: "AI/ML & DBMS Developer",
  },
  {
    id: "5",
    title: "Hackathon Participant – HACKCBS 7.0",
    date: "November 2024",
    description:
      "Created an integrated interview platform with real-time code editor and virtual interviews using socket programming.",
    type: "hackathon",
    remarks: "Team Lead and developed the LLM based code editor",
  },
  {
    id: "6",
    title: "Hackathon Participant – CodeNakshatra 1.0",
    date: "April 2025",
    description:
      "Led team to build a cross-platform gig marketplace using React Native and NestJS. Included in-app messaging, multilingual support, and subscription model.",
    type: "hackathon",
    remarks: "Team Lead & DBMS Architect",
  },
  {
    id: "7",
    title: "Hackathon Participant – Vihaan 8.0",
    date: "April 2025",
    description:
      "Developed a doctor-patient platform with real-time booking, WebRTC video calls, digital prescriptions, and monetization features.",
    type: "hackathon",
    remarks: "Team Lead & DBMS Developer",
  },
]

// Sort timeline items from latest to oldest
const sortTimelineItems = (items: TimelineItemType[]): TimelineItemType[] => {
  return [...items].sort((a, b) => {
    // Extract years from date strings
    const yearA = Number.parseInt(a.date.split(" ")[0])
    const yearB = Number.parseInt(b.date.split(" ")[0])

    // If years are the same, keep original order
    if (isNaN(yearA) || isNaN(yearB)) return 0

    // Sort in descending order (latest first)
    return yearB - yearA
  })
}

// Main timeline component
interface TimelineProps {
  items?: TimelineItemType[]
  title?: string
  className?: string
}

const Timeline: React.FC<TimelineProps> = ({
  items = sampleTimelineData,
  title = "Academic & Professional Timeline",
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  })

  // Sort items from latest to oldest
  const sortedItems = sortTimelineItems(items)

  // Calculate which timeline item is active based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return

      const timelineRect = timelineRef.current.getBoundingClientRect()
      const timelineTop = timelineRect.top
      const timelineHeight = timelineRect.height
      const viewportHeight = window.innerHeight

      // Calculate the visible portion of the timeline
      const visibleStart = Math.max(0, -timelineTop)
      const visibleEnd = Math.min(timelineHeight, viewportHeight - timelineTop)
      const visibleHeight = visibleEnd - visibleStart

      if (visibleHeight <= 0) {
        setActiveIndex(null)
        return
      }

      // Calculate the center of the visible portion
      const visibleCenter = visibleStart + visibleHeight / 2

      // Calculate which item is closest to the center
      const itemHeight = timelineHeight / sortedItems.length
      const activeItemIndex = Math.floor(visibleCenter / itemHeight)

      setActiveIndex(activeItemIndex >= 0 && activeItemIndex < sortedItems.length ? activeItemIndex : null)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sortedItems.length])

  // Animation for the title
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
      },
    },
  }

  // Animation for the line
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 py-16" id="timeline">
      <div className={`container mx-auto ${className}`}>
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 className="text-5xl font-bold text-white relative inline-block" variants={titleVariants}>
            {title}
          </motion.h2>
          <motion.span
            className="block h-1 w-20 bg-indigo-500 mx-auto mt-4 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          />
          <motion.p
            className="text-gray-300 mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            My educational journey and professional experiences that have shaped my career path
          </motion.p>
        </motion.div>

        <div className="relative wrap overflow-hidden p-4 md:p-10 h-full" ref={timelineRef}>
          {/* Animated vertical line */}
          <div className="absolute border-opacity-20 border-gray-700 h-full border left-1/2 transform -translate-x-1/2">
            <motion.div
              className="absolute bg-indigo-500 w-full rounded-full"
              style={{
                height: lineHeight,
                width: "4px",
                left: "-2px",
              }}
            />
          </div>

          {/* Timeline items */}
          {sortedItems.map((item, index) => (
            <TimelineCard key={item.id} item={item} isLeft={index % 2 === 0} isActive={index === activeIndex} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Timeline
