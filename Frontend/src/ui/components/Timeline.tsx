import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { TimelineCard, type TimelineItemType } from "./TimelineCard"
import { axiosInstance } from "../utils/axios.ts"

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
  items,
  title = "Academic & Professional Timeline",
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [timelineItems, setTimelineItems] = useState<TimelineItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use the timeline container for more precise scroll tracking
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"],
  })

  // Add smooth spring animation to the line
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Fetch timeline data from API
  useEffect(() => {
    const fetchTimelineData = async () => {
      // If items are provided as props, use them instead of fetching
      if (items) {
        setTimelineItems(items)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await axiosInstance.get("/timeline")
        setTimelineItems(response.data || [])
      } catch (error) {
        console.error("Error fetching timeline items:", error)
        setError("Failed to fetch timeline data")
        // Fallback to sample data on error
      } finally {
        setLoading(false)
      }
    }

    fetchTimelineData()
  }, [items])

  // Sort items from latest to oldest
  const sortedItems = sortTimelineItems(timelineItems)

  // Check if screen is mobile width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 760)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Improved active index calculation based on scroll progress and item positions
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || sortedItems.length === 0) return

      const timelineRect = timelineRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Calculate how much of the timeline is visible
      const timelineTop = timelineRect.top
      const timelineBottom = timelineRect.bottom
      
      // If timeline is not in view at all
      if (timelineBottom < 0 || timelineTop > viewportHeight) {
        setActiveIndex(null)
        return
      }
      
      // Calculate the visible progress through the timeline
      const timelineHeight = timelineRect.height
      const scrolledPastTop = Math.max(0, -timelineTop)
      // Calculate progress as a percentage (0 to 1)
      const progress = scrolledPastTop / (timelineHeight - viewportHeight + 100) // Add padding
      const clampedProgress = Math.max(0, Math.min(1, progress))
      
      // Map progress to timeline items
      const activeItemIndex = Math.min(
        Math.floor(clampedProgress * sortedItems.length),
        sortedItems.length - 1
      )
      
      setActiveIndex(activeItemIndex >= 0 ? activeItemIndex : null)
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


  // Calculate line height based on active index for more precise sync
  const [lineHeightState, setLineHeightState] = useState("0%")
  
  useEffect(() => {
    if (activeIndex !== null && sortedItems.length > 0) {
      // Calculate the percentage based on active index
      const percentage = ((activeIndex + 1) / sortedItems.length) * 100
      setLineHeightState(`${Math.min(percentage, 100)}%`)
    } else if (activeIndex === null) {
      // Use scroll progress when no active index
      const unsubscribe = smoothProgress.onChange((value) => {
        setLineHeightState(`${value * 100}%`)
      })
      return unsubscribe
    }
  }, [activeIndex, sortedItems.length, smoothProgress])

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading timeline...</p>
        </div>
      </div>
    )
  }

  // Error state (still shows fallback data)
  if (error) {
    console.warn("Timeline error:", error)
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-gray-900 py-16"
      id="timeline"
      ref={containerRef}
    >
      <div className={`container mx-auto ${className}`}>
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white relative inline-block"
            variants={titleVariants}
          >
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
            className="text-gray-300 mt-4 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            My educational journey and professional experiences that have shaped my career path
          </motion.p>
        </motion.div>

        <div
          className="relative wrap overflow-hidden p-4 md:p-10 h-full"
          ref={timelineRef}
        >
          {/* Static background line */}
          <div
            className={`absolute border-opacity-20 border-gray-700 h-full border 
              ${isMobile ? "left-[20px] md:left-1/2" : "left-1/2"} 
              transform ${isMobile ? "-translate-x-1/2 md:-translate-x-1/2" : "-translate-x-1/2"}`}
          />

          {/* Animated progress line */}
          <div
            className={`absolute h-full
              ${isMobile ? "left-[20px] md:left-1/2" : "left-1/2"} 
              transform ${isMobile ? "-translate-x-1/2 md:-translate-x-1/2" : "-translate-x-1/2"}`}
            style={{ width: "4px", marginLeft: "-2px" }}
          >
            <motion.div
              className="bg-indigo-500 w-full rounded-full origin-top transition-all duration-300 ease-out"
              style={{
                height: lineHeightState,
                width: "4px",
              }}
            />
          </div>

          {/* Timeline items */}
          {sortedItems.map((item, index) => (
            <div key={item.id} data-timeline-card>
              <TimelineCard
                item={item}
                isLeft={isMobile ? false : index % 2 === 0}
                isActive={index === activeIndex}
                isMobile={isMobile}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Timeline