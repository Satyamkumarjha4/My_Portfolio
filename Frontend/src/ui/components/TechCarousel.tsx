"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import TechCard from "./TechCard"
import type { Category, TechStack } from "./TechTypes"

interface TechCarouselProps {
  techStacks: TechStack[]
  selectedCategory: Category | "All" | null
}

const TechCarousel: React.FC<TechCarouselProps> = ({ techStacks, selectedCategory }) => {
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [hoveredStack, setHoveredStack] = useState<string | null>(null)
  const [isWaitingAtEnd, setIsWaitingAtEnd] = useState<boolean>(false)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  // Filter tech stacks based on selected category
  const filteredTechStacks =
    selectedCategory && selectedCategory !== "All"
      ? techStacks.filter((tech) => tech.category === selectedCategory)
      : techStacks

  // Effect for automatic scrolling
  useEffect(() => {
    if (!isPaused && carouselRef.current) {
      const scrollInterval = setInterval(() => {
        if (carouselRef.current) {
          const scrollWidth = carouselRef.current.scrollWidth
          const clientWidth = carouselRef.current.clientWidth
          const scrollLeft = carouselRef.current.scrollLeft

          // If we've scrolled to the end
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            // If not already waiting at the end, start waiting
            if (!isWaitingAtEnd) {
              setIsWaitingAtEnd(true)
              
              // After 3 seconds, reset to the beginning
              setTimeout(() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollLeft = 0
                }
                setIsWaitingAtEnd(false)
              }, 2000)
            }
          } else if (!isWaitingAtEnd) {
            // Continue scrolling if not waiting
            carouselRef.current.scrollLeft += 1
          }
        }
      }, 20)

      return () => clearInterval(scrollInterval)
    }
  }, [isPaused, isWaitingAtEnd])

  return (
    <motion.div
      className="relative overflow-hidden py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        ref={carouselRef}
        className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide mx-20"
        style={{ scrollBehavior: "smooth" }}
      >
        {filteredTechStacks.map((tech, index) => (
          <TechCard
            key={`${tech.name}-${index}`}
            tech={tech}
            isHovered={hoveredStack === tech.name}
            onMouseEnter={() => {
              setIsPaused(true)
              setHoveredStack(tech.name)
            }}
            onMouseLeave={() => {
              setIsPaused(false)
              setHoveredStack(null)
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default TechCarousel