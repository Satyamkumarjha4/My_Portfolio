import type React from "react"
import { motion } from "framer-motion"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  // color = "currentColor",
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = value / 100
  const strokeDashoffset = circumference * (1 - progress)

  // Determine color based on value
  const getColor = () => {
    if (value >= 90) return "text-green-500"
    if (value >= 75) return "text-blue-500"
    if (value >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={`relative flex items-center justify-center ${getColor()}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage text */}
      <motion.div
        className="absolute font-bold"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        {value}%
      </motion.div>
    </div>
  )
}

export default CircularProgress
