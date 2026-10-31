import type React from "react"
import { useMemo, useRef, useState } from "react"
import { motion, useInView, useMotionValueEvent, useScroll, useSpring } from "framer-motion"
import { TimelineCard, type TimelineItemType } from "./TimelineCard"
import { useApi } from "../hooks/useApi"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { ErrorBlock, EmptyBlock, LoadingBlock } from "./AsyncState"

// Newest first. Prefer the server-provided startDate, fall back to the year in the label.
const timeOf = (item: TimelineItemType): number => {
  if (item.startDate) return new Date(item.startDate).getTime()
  const year = /\b(19|20)\d{2}\b/.exec(item.date)?.[0]
  return year ? Date.UTC(Number(year), 0, 1) : 0
}

const sortTimelineItems = (items: TimelineItemType[]): TimelineItemType[] =>
  [...items].sort((a, b) => timeOf(b) - timeOf(a))

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
}

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
  const api = useApi<TimelineItemType[]>("/timeline")
  const timelineItems = items ?? api.data
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isMobile = useMediaQuery("(max-width: 759px)")
  const timelineRef = useRef<HTMLDivElement>(null)

  const sortedItems = useMemo(() => sortTimelineItems(timelineItems ?? []), [timelineItems])
  const inView = useInView(timelineRef)

  // scrollYProgress (0..1 across the timeline) drives both the progress line and the
  // active card. No scroll listeners or layout reads: framer-motion handles that.
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start start", "end end"] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (sortedItems.length === 0) return
    setActiveIndex(Math.min(Math.floor(v * sortedItems.length), sortedItems.length - 1))
  })

  const currentActive = inView ? activeIndex : null

  // Rendered inside the ref'd container so the scroll target exists from the first render.
  const status = !items && api.loading
    ? <LoadingBlock label="Loading timeline..." />
    : !items && api.error && !timelineItems
      ? <ErrorBlock message="Couldn't load the timeline." onRetry={api.refetch} />
      : sortedItems.length === 0
        ? <EmptyBlock message="No timeline entries yet." />
        : null

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-gray-900 py-16"
      id="timeline"
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
          {status}
          {!status && (<>
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
              className="bg-indigo-500 w-full rounded-full origin-top"
              style={{
                scaleY: smoothProgress,
                height: "100%",
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
                isActive={index === currentActive}
                isMobile={isMobile}
              />
            </div>
          ))}
          </>)}
        </div>
      </div>
    </div>
  )
}

export default Timeline