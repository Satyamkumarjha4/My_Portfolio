"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Award, Calendar, ExternalLink } from "lucide-react"
import CertificateModal from "./CertificateModal"

// Define the achievement type
export type AchievementType = {
  id: number
  title: string
  date: string
  overview: string
  certificate?: string
}

// Format date to be more readable
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Individual achievement card component
interface AchievementCardProps {
  achievement: AchievementType
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    if (achievement.certificate) {
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <motion.div
        className={`
          bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col h-full 
          border border-transparent hover:border-indigo-500/30
          ${achievement.certificate ? "cursor-pointer" : ""}
        `}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
        }}
        onClick={openModal}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <motion.h3
              className="text-xl font-bold text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              {achievement.title}
            </motion.h3>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
            >
              <Award className="h-6 w-6 text-indigo-500 flex-shrink-0 ml-2" />
            </motion.div>
          </div>

          <motion.div
            className="flex items-center text-sm text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
            {formatDate(achievement.date)}
          </motion.div>

          <motion.p
            className="text-sm text-gray-300 flex-grow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            {achievement.overview}
          </motion.p>

          {achievement.certificate && (
            <motion.div
              className="mt-4 flex items-center text-indigo-400 text-sm font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Certificate
            </motion.div>
          )}
        </div>
      </motion.div>

      <CertificateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        certificateUrl={achievement.certificate || ""}
        title={achievement.title}
      />
    </>
  )
}

export default AchievementCard
